import { supabase } from './supabaseClient';
import * as tus from 'tus-js-client';

export type UploadState = {
  progress: number;
  uploadSpeed: string;
  timeRemaining: string;
  isPaused: boolean;
};

export const resumableUploadService = {
  activeUploads: new Map<string, tus.Upload>(),

  async uploadVideo(
    file: File,
    bucket: string,
    filePath: string,
    onProgress: (state: UploadState) => void,
    onSuccess: (url: string) => void,
    onError: (error: Error) => void
  ): Promise<string> {
    return new Promise(async (resolve, reject) => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) throw new Error("Authentication required");

        // Use Supabase Storage TUS upload endpoint
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
        const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
        
        const uploadUrl = `${supabaseUrl}/storage/v1/upload/resumable`;

        let lastBytesUploaded = 0;
        let lastTime = Date.now();

        const upload = new tus.Upload(file, {
          endpoint: uploadUrl,
          retryDelays: [0, 3000, 5000, 10000, 20000],
          headers: {
            Authorization: `Bearer ${session.access_token}`,
            'x-upsert': 'true',
          },
          uploadDataDuringCreation: true,
          removeFingerprintOnSuccess: true,
          metadata: {
            bucketName: bucket,
            objectName: filePath,
            contentType: file.type,
            cacheControl: '3600',
          },
          chunkSize: 6 * 1024 * 1024, // 6MB chunks
          onError: (error) => {
            console.error('Failed to upload:', error);
            reject(error);
            onError(error);
          },
          onProgress: (bytesUploaded, bytesTotal) => {
            const now = Date.now();
            const timeDiff = (now - lastTime) / 1000; // in seconds
            const bytesDiff = bytesUploaded - lastBytesUploaded;
            
            let speedStr = "Calculating...";
            let timeRemainingStr = "Calculating...";

            if (timeDiff > 0.5) { // update speed every 500ms
              const speedBps = bytesDiff / timeDiff;
              const remainingBytes = bytesTotal - bytesUploaded;
              const remainingSeconds = remainingBytes / speedBps;

              speedStr = `${(speedBps / (1024 * 1024)).toFixed(1)} MB/s`;
              timeRemainingStr = `${Math.round(remainingSeconds)} seconds`;

              lastBytesUploaded = bytesUploaded;
              lastTime = now;
            }

            onProgress({
              progress: Math.round((bytesUploaded / bytesTotal) * 100),
              uploadSpeed: speedStr,
              timeRemaining: timeRemainingStr,
              isPaused: false
            });
          },
          onSuccess: () => {
            const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
            this.activeUploads.delete(filePath);
            resolve(data.publicUrl);
            onSuccess(data.publicUrl);
          },
        });

        // Store the upload instance so it can be paused/resumed
        this.activeUploads.set(filePath, upload);

        // Start upload
        upload.findPreviousUploads().then((previousUploads) => {
          if (previousUploads.length > 0) {
            upload.resumeFromPreviousUpload(previousUploads[0]);
          }
          upload.start();
        });

      } catch (err: any) {
        reject(err);
        onError(err);
      }
    });
  },

  pauseUpload(filePath: string) {
    const upload = this.activeUploads.get(filePath);
    if (upload) {
      upload.abort();
    }
  },

  resumeUpload(filePath: string) {
    const upload = this.activeUploads.get(filePath);
    if (upload) {
      upload.start();
    }
  }
};
