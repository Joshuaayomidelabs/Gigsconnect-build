import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";
import { supabase } from "./supabaseClient";
import { checkVideoConstraints } from "../utils/validation";

export type UploadPhase = 'preparing' | 'compressing' | 'uploading' | 'publishing' | 'success' | 'error' | null;

export interface UploadProgressCallback {
  (phase: UploadPhase, progress: number, error?: Error): void;
}

export const videoUploadService = {
  async validateVideo(file: File): Promise<string | null> {
    const validTypes = ["video/mp4", "video/quicktime", "video/webm"];
    if (!validTypes.includes(file.type)) {
      return "Please upload an mp4, mov, or webm video file.";
    }
    const constraintError = await checkVideoConstraints(file);
    if (constraintError) {
      return constraintError;
    }
    return null;
  },

  async compressVideo(file: File, onProgress: (progress: number) => void): Promise<File> {
    try {
      // Small optimization: If video is small (< 10MB) and already MP4, skip FFmpeg processing to save CPU
      if (file.size < 10 * 1024 * 1024 && file.type === 'video/mp4') {
         onProgress(100);
         return file;
      }

      const ffmpeg = new FFmpeg();

      ffmpeg.on("progress", ({ progress }) => {
        onProgress(Math.round(progress * 100));
      });

      const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd";
      
      // Load FFmpeg. This can take time on slow connections, so we notify progress minimally.
      await ffmpeg.load({
        coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
        wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, "application/wasm"),
      });

      const inputName = `input_${Date.now()}.mp4`;
      const outputName = `output_${Date.now()}.mp4`;

      await ffmpeg.writeFile(inputName, await fetchFile(file));

      // Optimal settings for very fast processing and good mobile streaming
      await ffmpeg.exec([
        "-i", inputName,
        "-vf", "scale='min(720,iw)':-2", // Only scale down if larger than 720p
        "-vcodec", "libx264",
        "-preset", "ultrafast", // Fastest preset to prevent browser freezing
        "-crf", "30", // Good balance of size and quality
        "-acodec", "aac",
        "-movflags", "+faststart", // Enable fast start for instant web playback
        outputName,
      ]);

      const outputData = await ffmpeg.readFile(outputName);
      const blob = new Blob([new Uint8Array(outputData as any)], { type: "video/mp4" });
      
      try {
        await ffmpeg.deleteFile(inputName);
        await ffmpeg.deleteFile(outputName);
        ffmpeg.terminate(); // Free memory
      } catch (e) {
        console.warn("Cleanup failed", e);
      }
      
      return new File([blob], outputName, { type: "video/mp4" });
    } catch (compressErr) {
      console.error("Compression failed or timed out. Falling back to original file:", compressErr);
      return file;
    }
  },

  async uploadToSupabaseXHR(
    file: File, 
    userId: string, 
    bucket: string, 
    onProgress: (progress: number) => void
  ): Promise<string> {
    const fileExt = file.name.split(".").pop() || "mp4";
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `${userId}/${fileName}`;

    return new Promise(async (resolve, reject) => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) throw new Error("Authentication required for upload.");

        const storageUrl = `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/${bucket}/${filePath}`;
        
        const xhr = new XMLHttpRequest();
        xhr.open("POST", storageUrl, true);
        xhr.setRequestHeader("Authorization", `Bearer ${session.access_token}`);
        xhr.setRequestHeader("Content-Type", file.type || "video/mp4");
        // Don't set x-upsert header unless required, standard is just generic POST

        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) {
            const percent = Math.round((e.loaded / e.total) * 100);
            onProgress(percent);
          }
        };

        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            const { data: publicUrlData } = supabase.storage
              .from(bucket)
              .getPublicUrl(filePath);
            resolve(publicUrlData.publicUrl);
          } else {
            console.error("Upload failed with status:", xhr.status, xhr.responseText);
            reject(new Error(`Failed to upload video: ${xhr.responseText}`));
          }
        };

        xhr.onerror = () => reject(new Error("Network error occurred during video upload."));
        xhr.send(file);
      } catch (err) {
        reject(err);
      }
    });
  },

  async processAndUploadVideo(
    file: File,
    userId: string,
    bucket: string,
    onProgressUpdate: UploadProgressCallback
  ): Promise<string> {
    try {
      onProgressUpdate('preparing', 0);
      
      // 1. Double check constraints
      const validationError = await this.validateVideo(file);
      if (validationError) throw new Error(validationError);
      
      // 2. Compress
      onProgressUpdate('compressing', 0);
      // Wait slightly so UI can paint the preparing state
      await new Promise(r => setTimeout(r, 100));

      const compressedFile = await this.compressVideo(file, (progress) => {
        onProgressUpdate('compressing', progress);
      });

      // 3. Upload with real XHR progress
      onProgressUpdate('uploading', 0);
      const publicUrl = await this.uploadToSupabaseXHR(compressedFile, userId, bucket, (progress) => {
        onProgressUpdate('uploading', progress);
      });
      
      onProgressUpdate('publishing', 100);
      return publicUrl;
    } catch (error: any) {
      onProgressUpdate('error', 0, error);
      throw error;
    }
  }
};
