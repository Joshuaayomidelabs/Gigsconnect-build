import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import {
  Loader2,
  Music,
  MapPin,
  Banknote,
  Calendar,
  FileText,
  Image as ImageIcon,
  Shield,
  Video,
  Mic,
  Smile,
  X,
  Save,
  Globe,
  Check,
  Pause,
  Play
} from "lucide-react";
import { toast } from "sonner";
import TextareaAutosize from "react-textarea-autosize";
import { gigsService } from "../services/gigsService";
import { communityService } from "../services/communityService";
import { profilesService } from "../services/profilesService";
import { supabase } from "../services/supabaseClient";
import { useAuth } from "../context/AuthContext";
import { GIG_CATEGORIES } from "../utils/constants";
import { checkVideoConstraints } from "../utils/validation";
import { resumableUploadService, UploadState } from "../services/resumableUploadService";
import { generateVideoThumbnail, dataUrlToFile } from "../utils/videoUtils";
import { useMentions } from "../hooks/useMentions";
import { handleError, notifyError } from '../utils/errorHandler';

const PostGig: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const postMode = location.state?.initialMode === "gig" ? "gig" : "post";
  const isSubmittingRef = useRef(false);

  useEffect(() => {
    if (user) {
      profilesService.getProfile(user.id).then(({ data }) => setProfile(data));
    }
  }, [user]);

  // Gig Form State
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    budget: "",
    currency: "NGN",
    location: "",
    gig_category: GIG_CATEGORIES[0],
    deadline: "",
  });

  // Post Form State
  const [postContent, setPostContent] = useState("");
  const [cursorPos, setCursorPos] = useState(0);
  const [isAvailableForGigs, setIsAvailableForGigs] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [uploadState, setUploadState] = useState<UploadState | null>(null);
  const [uploadStage, setUploadStage] = useState<'idle' | 'compressing' | 'uploading' | 'processing' | 'done' | 'error'>('idle');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const { mentionState, results, loading: mentionsLoading } = useMentions(postContent, cursorPos);

  const handleSelectMention = (username: string) => {
    if (!mentionState) return;
    const newText = postContent.slice(0, mentionState.start) + '@' + username + ' ' + postContent.slice(mentionState.end);
    setPostContent(newText);
    
    // Focus and update cursor
    setTimeout(() => {
      if (textAreaRef.current) {
        textAreaRef.current.focus();
        const newCursor = mentionState.start + username.length + 2;
        textAreaRef.current.setSelectionRange(newCursor, newCursor);
        setCursorPos(newCursor);
      }
    }, 0);
  };

  const getCurrencySymbol = (currency: string) =>
    currency === "USD" ? "$" : "₦";

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      // Clear video to maintain single media focus for MVP cleanly
      setVideoFile(null);
      setVideoPreview(null);
      setThumbnailFile(null);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
    e.target.value = '';
  };

  const handleVideoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      const validTypes = ["video/mp4", "video/quicktime", "video/webm"];
      if (!validTypes.includes(file.type)) {
        notifyError("Please upload an mp4, mov, or webm video file.");
        e.target.value = '';
        return;
      }
      
      const MAX_VIDEO_SIZE = 50 * 1024 * 1024; // 50MB
      if (file.size > MAX_VIDEO_SIZE) {
        notifyError("Please upload a video smaller than 50MB.");
        e.target.value = '';
        return;
      }

      setVideoFile(file);
      // Clear image
      setImageFile(null);
      setImagePreview(null);
      
      setUploadStage('compressing');
      try {
        const thumbDataUrl = await generateVideoThumbnail(file);
        setVideoPreview(thumbDataUrl);
        const thumbFile = dataUrlToFile(thumbDataUrl, 'thumbnail.jpg');
        setThumbnailFile(thumbFile);
        setUploadStage('idle');
      } catch (err) {
        console.error("Thumbnail error:", err);
        const url = URL.createObjectURL(file);
        setVideoPreview(url);
        setUploadStage('idle');
      }
    }
    e.target.value = '';
  };

  const handlePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!postContent.trim() && !imageFile && !videoFile) return;
    if (isLoading || isSubmittingRef.current) return;

    isSubmittingRef.current = true;
    setIsLoading(true);

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) throw new Error("You must be logged in to post");

      let imageUrl = null;
      let videoUrl = null;
      let thumbnailUrl = null;

      if (imageFile || videoFile) {
        setUploadStage("uploading");
      }

      if (videoFile) {
         try {
           const fileExt = videoFile.name.split(".").pop() || "mp4";
           const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
           const filePath = `raw/${session.user.id}/${fileName}`;
           
           if (thumbnailFile) {
             const thumbPath = `raw/${session.user.id}/thumb_${fileName}.jpg`;
             const { error: thumbErr, data: thumbData } = await supabase.storage.from("post-videos").upload(thumbPath, thumbnailFile);
             if (!thumbErr && thumbData) {
               thumbnailUrl = supabase.storage.from("post-videos").getPublicUrl(thumbPath).data.publicUrl;
             }
           }

           videoUrl = await resumableUploadService.uploadVideo(
             videoFile,
             "post-videos",
             filePath,
             (state) => {
               setUploadState(state);
               setUploadStage("uploading");
             },
             (url) => { console.log("Uploaded successfully", url); },
             (error) => { throw error; }
           );
           
           const { error: dbError } = await supabase.from('videos').insert({
             file_path: filePath,
             status: 'uploaded',
             user_id: session.user.id
           });
           
           if (dbError) {
             console.error("Failed to insert video metadata", dbError);
           }
         } catch (error: any) {
           throw new Error("Failed to upload video: " + error.message);
         }
      }

      if (imageFile) {
        const fileExt = imageFile.name.split(".").pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${session.user.id}/${fileName}`;

        const { error: uploadError, data } = await supabase.storage
          .from("portfolio")
          .upload(filePath, imageFile);

        if (uploadError) {
          throw new Error("Failed to upload image: " + uploadError.message);
        } else if (data) {
          const { data: publicUrlData } = supabase.storage
            .from("portfolio")
            .getPublicUrl(filePath);
          imageUrl = publicUrlData.publicUrl;
        }
      }

      setUploadStage("processing");
      
      let finalVideoUrl = videoUrl;
      if (videoUrl && thumbnailUrl) {
        finalVideoUrl = `${videoUrl}${videoUrl.includes('?') ? '&' : '?'}thumb=${encodeURIComponent(thumbnailUrl)}`;
      }
      
      const { data, error } = await communityService.createPost({
        user_id: session.user.id,
        text: postContent,
        image_urls: imageUrl ? [imageUrl] : undefined,
        video_url: finalVideoUrl ? finalVideoUrl : undefined,
        is_available_for_gigs: isAvailableForGigs,
      });

      if (error) {
        throw new Error(error.message || "Failed to create post");
      }

      toast.success("Post shared with your community!");
      setUploadStage("done");

      setTimeout(() => {
        setPostContent("");
        setImageFile(null);
        setImagePreview(null);
        setVideoFile(null);
        setVideoPreview(null);
        setThumbnailFile(null);
        setIsAvailableForGigs(false);
        setUploadStage("idle");
        setUploadState(null);
        navigate("/overview");
      }, 1500);
    } catch (err: any) {
      console.error("Post creation error:", err);
      handleError(err, "Operation Error");
      setUploadStage("error");
      setIsLoading(false);
      isSubmittingRef.current = false;
    }
  };

  const handleGigSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading || isSubmittingRef.current) return;
    
    isSubmittingRef.current = true;
    setIsLoading(true);

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) throw new Error("You must be logged in to post a gig");

      const { error } = await gigsService.createGig({
        title: formData.title,
        description: formData.description,
        budget: Number(formData.budget),
        currency: formData.currency,
        location: formData.location,
        gig_category: formData.gig_category,
        deadline: formData.deadline, // HTML date input is already YYYY-MM-DD
        poster_id: session.user.id,
      });

      if (error) throw error;
      toast.success("Gig posted successfully!");
      navigate("/overview");
    } catch (err: any) {
      handleError(err, "Operation Error");
      setIsLoading(false);
      isSubmittingRef.current = false;
    }
  };


  return (
    <div className="pt-main pb-12 px-4 sm:px-6 lg:px-8 max-w-[640px] mx-auto min-h-screen transition-colors duration-500">
      <section className="mb-6">
        <h1 className="text-3xl font-black text-brand-black dark:text-brand-white tracking-tight">
          Create{" "}
          <span className="text-brand-purple">
            {postMode === "gig" ? "Gig" : "Post"}
          </span>
        </h1>
      </section>

      {postMode === "post" ? (
        <form
          onSubmit={handlePostSubmit}
          className="bg-white dark:bg-[#0F0F12] sm:rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 dark:border-[#1F1F23] p-4 sm:p-6 transition-all duration-300"
        >
          {/* 1. HEADER SECTION */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-800 shrink-0 border border-gray-100 dark:border-[#1F1F23]">
                <img
                  src={
                    profile?.avatar_url ||
                    "https://picsum.photos/seed/default/100"
                  }
                  alt={profile?.full_name || "User"}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-[15px] text-gray-900 dark:text-white leading-tight">
                  {profile?.full_name || "Anonymous User"}
                </span>
                <span className="text-[12px] text-gray-500 font-medium">
                  Posting to Community
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#6C2BD9]/10 text-[#6C2BD9] text-[12px] font-bold border border-[#6C2BD9]/20">
              <Globe className="w-3.5 h-3.5" />
              Public
            </div>
          </div>

          {/* 2. MAIN TEXT INPUT */}
          <div className="mb-4 relative">
            {mentionState && results.length > 0 && (
              <div className="absolute top-[100%] left-0 w-64 bg-white dark:bg-[#1A1A1E] border border-gray-200 dark:border-[#2A2A2F] rounded-xl shadow-xl z-50 mb-2 overflow-hidden animate-in fade-in slide-in-from-top-2">
                {results.map(r => (
                  <div 
                    key={r.id} 
                    onClick={() => handleSelectMention(r.username || r.full_name.replace(/\s+/g, ''))}
                    className="flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-[#2A2A2F] cursor-pointer transition-colors"
                  >
                    <img src={r.avatar_url || 'https://picsum.photos/seed/default/100'} alt={r.full_name} className="w-8 h-8 rounded-full object-cover" />
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-gray-900 dark:text-white leading-tight">{r.full_name}</span>
                      {r.username && <span className="text-xs text-gray-500">@{r.username}</span>}
                    </div>
                  </div>
                ))}
              </div>
            )}
            <TextareaAutosize
              ref={textAreaRef}
              minRows={3}
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
              onKeyUp={(e: any) => setCursorPos(e.target.selectionStart)}
              onClick={(e: any) => setCursorPos(e.target.selectionStart)}
              placeholder="Share your sound, idea, or moment..."
              className="w-full text-[18px] sm:text-[20px] text-gray-900 dark:text-gray-100 placeholder:text-gray-400 bg-transparent border-none outline-none resize-none leading-relaxed"
            />
          </div>

          {/* 4. MEDIA PREVIEW SECTION */}
          {imagePreview && (
            <div
              className={`mb-4 group ${uploadStage !== 'idle' ? "upload-wrapper" : "relative rounded-xl overflow-hidden border border-gray-100 dark:border-[#1F1F23]"}`}
            >
              <div className={uploadStage !== 'idle' ? "preview" : "relative"}>
                <img
                  src={imagePreview}
                  alt="Preview"
                  className={
                    uploadStage === 'idle'
                      ? "w-full max-h-[400px] object-cover transition-all duration-300"
                      : ""
                  }
                />

                {/* Upload Status Overlay */}
                {uploadStage !== 'idle' && (
                  <div className="overlay">
                    {uploadStage === "done" ? (
                      <div className="flex flex-col items-center animate-fade-in">
                        <div className="w-12 h-12 bg-[#4ade80] rounded-full flex items-center justify-center mb-3 shadow-lg shadow-green-500/30">
                          <svg
                            className="w-6 h-6 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={3}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </div>
                        <p className="font-bold text-[15px] drop-shadow-md">
                          Upload complete
                        </p>
                      </div>
                    ) : uploadStage === "error" ? (
                      <div
                        className="flex flex-col items-center animate-fade-in cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => setUploadStage('idle')}
                      >
                        <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center mb-3">
                          <X className="w-6 h-6 text-white" />
                        </div>
                        <p className="font-bold text-[15px] text-center drop-shadow-md">
                          Upload failed. Tap to retry.
                        </p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center animate-fade-in pointer-events-auto">
                        <div className="p-3 bg-brand-white/10 dark:bg-black/20 backdrop-blur-md rounded-full shadow-[0_0_20px_rgba(108,43,217,0.3)] mb-4">
                           <Loader2 className="w-10 h-10 text-brand-purple animate-spin drop-shadow-md" />
                        </div>
                        <p className="font-bold text-[15px] text-white drop-shadow-md text-center">
                          {uploadStage === "uploading"
                            ? "Uploading image..."
                            : "Processing..."}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {(uploadStage === 'idle' || uploadStage === "error") && (
                  <button
                    type="button"
                    onClick={() => {
                      setImageFile(null);
                      setImagePreview(null);
                      setUploadStage('idle');
                    }}
                    className="absolute top-3 right-3 p-2 bg-[#0F0F12]/60 backdrop-blur-md text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[#0F0F12]/80 shadow-sm z-20 pointer-events-auto"
                    aria-label="Remove image"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          )}

          {videoPreview && (
            <div
              className={`mb-4 group bg-black/5 dark:bg-white/5 ${uploadStage !== 'idle' ? "upload-wrapper" : "relative rounded-xl overflow-hidden border border-gray-100 dark:border-[#1F1F23]"}`}
            >
              <div className={uploadStage !== 'idle' ? "preview" : "relative"}>
                {videoPreview.startsWith('data:image/') ? (
                  <div className="relative w-full flex items-center justify-center bg-black">
                    <img
                      src={videoPreview}
                      alt="Video Preview"
                      className="w-full max-h-[400px] object-contain transition-all duration-300"
                    />
                    {(uploadStage === 'idle' || uploadStage === "error") && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                        <div className="w-14 h-14 bg-brand-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/20 shadow-lg">
                          <Play className="w-6 h-6 fill-current text-white translate-x-[2px]" />
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <video
                    src={videoPreview}
                    controls={uploadStage === 'idle' || uploadStage === "error"}
                    className={
                      uploadStage === 'idle'
                        ? "w-full max-h-[400px] object-contain transition-all duration-300"
                        : ""
                    }
                  />
                )}

                {/* Upload Status Overlay */}
                {uploadStage !== 'idle' && (
                  <div className="overlay pointer-events-none">
                    {uploadStage === "done" ? (
                      <div className="flex flex-col items-center animate-fade-in">
                        <div className="w-12 h-12 bg-[#4ade80] rounded-full flex items-center justify-center mb-3 shadow-lg shadow-green-500/30">
                          <svg
                            className="w-6 h-6 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={3}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </div>
                        <p className="font-bold text-[15px] drop-shadow-md">
                          Upload complete
                        </p>
                      </div>
                    ) : uploadStage === "error" ? (
                      <div
                        className="flex flex-col items-center animate-fade-in cursor-pointer hover:opacity-80 transition-opacity pointer-events-auto"
                        onClick={() => setUploadStage('idle')}
                      >
                        <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center mb-3">
                          <X className="w-6 h-6 text-white" />
                        </div>
                        <p className="font-bold text-[15px] text-center drop-shadow-md">
                          Upload failed. Tap to retry.
                        </p>
                      </div>
                    ) : uploadStage === "compressing" ? (
                      <div className="flex flex-col items-center animate-fade-in pointer-events-auto max-w-[80%] mx-auto">
                        <div className="p-3 bg-brand-white/10 dark:bg-black/20 backdrop-blur-md rounded-full shadow-[0_0_20px_rgba(108,43,217,0.3)] mb-4">
                           <Loader2 className="w-10 h-10 text-brand-purple animate-spin drop-shadow-md" />
                        </div>
                        <p className="font-bold text-[17px] text-white drop-shadow-md text-center mb-1">
                          Compressing Video...
                        </p>
                        <p className="text-[13px] text-white/80 drop-shadow-md text-center">
                          Optimizing for faster upload
                        </p>
                      </div>
                    ) : uploadStage === "uploading" && uploadState ? (
                      <div className="flex flex-col items-center animate-fade-in pointer-events-auto w-full max-w-[280px]">
                        <div className="w-full flex justify-between text-white drop-shadow-md mb-2 text-[14px]">
                          <span className="font-bold">Uploading...</span>
                          <span className="font-bold">{uploadState.progress}%</span>
                        </div>
                        <div className="w-full h-2.5 bg-black/40 backdrop-blur-md rounded-full overflow-hidden shadow-inner mb-3">
                          <div 
                            className="h-full bg-gradient-to-r from-[#6C2BD9] to-[#9D4EDD] transition-all duration-300 ease-out" 
                            style={{ width: `${uploadState.progress}%` }}
                          />
                        </div>
                        <div className="flex items-center justify-between w-full text-[12px] text-white/80 drop-shadow-md font-medium">
                          <span>{uploadState.uploadSpeed}</span>
                          <span>{uploadState.timeRemaining}</span>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center animate-fade-in pointer-events-auto max-w-[80%] mx-auto">
                        <div className="p-3 bg-brand-white/10 dark:bg-black/20 backdrop-blur-md rounded-full shadow-[0_0_20px_rgba(108,43,217,0.3)] mb-4">
                           <Loader2 className="w-10 h-10 text-brand-purple animate-spin drop-shadow-md" />
                        </div>
                        <p className="font-bold text-[17px] text-white drop-shadow-md text-center">
                          {uploadStage === "uploading"
                            ? "Starting upload..."
                            : "Processing Video..."}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {(uploadStage === 'idle' || uploadStage === "error") && (
                  <button
                    type="button"
                    onClick={() => {
                      setVideoFile(null);
                      setVideoPreview(null);
                      setUploadStage('idle');
                    }}
                    className="absolute top-3 right-3 p-2 bg-[#0F0F12]/60 backdrop-blur-md text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[#0F0F12]/80 shadow-sm z-20 pointer-events-auto"
                    aria-label="Remove video"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* 3. MEDIA ACTION BAR */}
          <div className="flex items-center justify-between py-3 border-t border-b border-gray-100 dark:border-[#1F1F23] mb-4">
            <div className="flex items-center gap-1 sm:gap-2">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                ref={fileInputRef}
                disabled={isLoading}
                onChange={handleImageChange}
              />
              <input
                type="file"
                accept="video/mp4,video/quicktime,video/webm"
                className="hidden"
                ref={videoInputRef}
                disabled={isLoading}
                onChange={handleVideoChange}
              />
              <button
                type="button"
                disabled={isLoading}
                onClick={() => fileInputRef.current?.click()}
                className={`p-2 sm:p-2.5 rounded-full text-[#9CA3AF] hover:text-[#A78BFA] hover:bg-[#6C2BD9]/10 active:text-[#6C2BD9] transition-all duration-200 active:scale-105 ${isLoading ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}`}
                aria-label="Add image"
              >
                <ImageIcon className="w-[22px] h-[22px]" />
              </button>
              <button
                type="button"
                disabled={isLoading}
                onClick={() => videoInputRef.current?.click()}
                className={`p-2 sm:p-2.5 rounded-full text-[#9CA3AF] hover:text-[#A78BFA] hover:bg-[#6C2BD9]/10 active:text-[#6C2BD9] transition-all duration-200 active:scale-105 ${isLoading ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}`}
                aria-label="Add video"
              >
                <Video className="w-[22px] h-[22px]" />
              </button>
              <button
                type="button"
                className="p-2 sm:p-2.5 rounded-full text-[#9CA3AF] hover:text-[#A78BFA] hover:bg-[#6C2BD9]/10 active:text-[#6C2BD9] transition-all duration-200 active:scale-105"
                title="Coming soon"
              >
                <Mic className="w-[22px] h-[22px]" />
              </button>
              <button
                type="button"
                className="p-2 sm:p-2.5 rounded-full text-[#9CA3AF] hover:text-[#A78BFA] hover:bg-gray-100 dark:hover:bg-[#1F1F23] active:text-[#6C2BD9] transition-all duration-200 active:scale-105"
                title="Location"
              >
                <MapPin className="w-[22px] h-[22px]" />
              </button>
              <button
                type="button"
                className="p-2 sm:p-2.5 rounded-full text-[#9CA3AF] hover:text-[#A78BFA] hover:bg-gray-100 dark:hover:bg-[#1F1F23] active:text-[#6C2BD9] transition-all duration-200 active:scale-105"
                title="Emoji"
              >
                <Smile className="w-[22px] h-[22px]" />
              </button>
            </div>

            {/* Toggle Available for Gigs */}
            <label className="flex items-center gap-2 cursor-pointer p-1.5 rounded-full hover:bg-gray-50 dark:hover:bg-[#1F1F23]/50 transition-colors border border-transparent hover:border-gray-100 dark:hover:border-[#1F1F23]">
              <div className="relative">
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={isAvailableForGigs}
                  onChange={(e) => setIsAvailableForGigs(e.target.checked)}
                />
                <div
                  className={`block w-9 h-5 rounded-full transition-colors duration-200 ${isAvailableForGigs ? "bg-[#6C2BD9]" : "bg-gray-300 dark:bg-gray-700"}`}
                ></div>
                <div
                  className={`absolute left-0.5 top-0.5 bg-white w-4 h-4 rounded-full transition-transform duration-200 ${isAvailableForGigs ? "transform translate-x-4" : ""} shadow-sm`}
                ></div>
              </div>
              <Shield
                className={`w-4 h-4 transition-colors duration-200 ${isAvailableForGigs ? "text-[#6C2BD9]" : "text-[#9CA3AF]"}`}
              />
            </label>
          </div>

          {/* 5. ACTION FOOTER */}
          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              className="flex items-center gap-1.5 px-4 py-2 text-[14px] font-bold text-[#9CA3AF] hover:text-[#A78BFA] active:text-[#6C2BD9] transition-all duration-200 active:scale-[0.98]"
            >
              <Save className="w-4 h-4" />
              Draft
            </button>

            <button
              type="submit"
              disabled={
                isLoading || (!postContent.trim() && !imageFile && !videoFile)
              }
              className="px-8 py-3 rounded-[14px] bg-[#6C2BD9] text-white font-bold hover:bg-[#A78BFA] active:bg-[#4C1D95] transition-all duration-200 shadow-md shadow-[#6C2BD9]/20 flex items-center justify-center gap-2 active:scale-[0.98] disabled:bg-[#1F1F23] disabled:text-[#9CA3AF] disabled:shadow-none disabled:cursor-not-allowed min-w-[140px] relative overflow-hidden"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin relative z-10" />
                  <span className="relative z-10">
                    {uploadStage === "processing" 
                      ? "Processing video..." 
                      : (uploadStage === "uploading"
                        ? (videoFile ? "Uploading video..." : "Uploading image...")
                        : "Finishing up...")}
                  </span>
                </>
              ) : uploadStage === "done" ? (
                <>
                  <Check className="w-5 h-5 relative z-10" />
                  <span className="relative z-10">Upload complete</span>
                </>
              ) : (
                "Publish"
              )}
            </button>
          </div>
        </form>
      ) : (
        <form
          onSubmit={handleGigSubmit}
          className="bg-brand-white dark:bg-brand-dark-card rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-brand-gray dark:border-brand-black p-8 space-y-6 transition-colors"
        >
          <div>
            <label className="block text-sm font-bold text-brand-black dark:text-brand-white mb-2 flex items-center gap-2">
              <Music className="w-4 h-4 text-brand-purple" />
              Gig Title *
            </label>
            <input
              required
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Lead Guitarist for Afrobeats Tour"
              className="w-full p-4 rounded-2xl border border-brand-gray dark:border-brand-black focus:ring-2 focus:ring-brand-purple focus:border-transparent transition-all outline-none bg-brand-gray dark:bg-brand-black focus:bg-brand-white dark:focus:bg-brand-dark-card text-brand-black dark:text-brand-white"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-brand-black dark:text-brand-white mb-2 flex items-center gap-2">
                <Banknote className="w-4 h-4 text-brand-purple" />
                Budget *
              </label>
              <div className="flex items-center bg-brand-gray dark:bg-brand-black rounded-2xl border border-brand-gray dark:border-brand-black focus-within:ring-2 focus-within:ring-brand-purple focus-within:border-transparent transition-all overflow-hidden">
                <span className="px-4 font-bold text-brand-purple bg-brand-purple/10 h-full flex items-center py-4">
                  {getCurrencySymbol(formData.currency)}
                </span>
                <input
                  required
                  type="number"
                  name="budget"
                  value={formData.budget}
                  onChange={handleChange}
                  placeholder="e.g. 500"
                  className="w-full p-4 outline-none bg-transparent text-brand-black dark:text-brand-white"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-brand-black dark:text-brand-white mb-2 flex items-center gap-2">
                <Banknote className="w-4 h-4 text-brand-purple" />
                Currency *
              </label>
              <select
                name="currency"
                value={formData.currency}
                onChange={handleChange}
                className="w-full p-4 rounded-2xl border border-brand-gray dark:border-brand-black focus:ring-2 focus:ring-brand-purple focus:border-transparent transition-all outline-none bg-brand-gray dark:bg-brand-black focus:bg-brand-white dark:focus:bg-brand-dark-card text-brand-black dark:text-brand-white"
              >
                <option value="NGN">Naira (₦)</option>
                <option value="USD">Dollar ($)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-brand-black dark:text-brand-white mb-2 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-brand-purple" />
                Location *
              </label>
              <input
                required
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g. Lagos, Nigeria / Remote"
                className="w-full p-4 rounded-2xl border border-brand-gray dark:border-brand-black focus:ring-2 focus:ring-brand-purple focus:border-transparent transition-all outline-none bg-brand-gray dark:bg-brand-black focus:bg-brand-white dark:focus:bg-brand-dark-card text-brand-black dark:text-brand-white"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-brand-black dark:text-brand-white mb-2 flex items-center gap-2">
                <Music className="w-4 h-4 text-brand-purple" />
                Category *
              </label>
              <select
                name="gig_category"
                value={formData.gig_category}
                onChange={handleChange}
                className="w-full p-4 rounded-2xl border border-brand-gray dark:border-brand-black focus:ring-2 focus:ring-brand-purple focus:border-transparent transition-all outline-none bg-brand-gray dark:bg-brand-black focus:bg-brand-white dark:focus:bg-brand-dark-card text-brand-black dark:text-brand-white"
              >
                {GIG_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-brand-black dark:text-brand-white mb-2 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-brand-purple" />
                Deadline *
              </label>
              <input
                required
                type="date"
                name="deadline"
                value={formData.deadline}
                onChange={handleChange}
                className="w-full p-4 rounded-2xl border border-brand-gray dark:border-brand-black focus:ring-2 focus:ring-brand-purple focus:border-transparent transition-all outline-none bg-brand-gray dark:bg-brand-black focus:bg-brand-white dark:focus:bg-brand-dark-card text-brand-black dark:text-brand-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-brand-black dark:text-brand-white mb-2 flex items-center gap-2">
              <FileText className="w-4 h-4 text-brand-purple" />
              Description *
            </label>
            <textarea
              required
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={6}
              placeholder="Describe the gig requirements, expectations, and any other relevant details..."
              className="w-full p-4 rounded-2xl border border-brand-gray dark:border-brand-black focus:ring-2 focus:ring-brand-purple focus:border-transparent transition-all outline-none bg-brand-gray dark:bg-brand-black focus:bg-brand-white dark:focus:bg-brand-dark-card resize-none text-brand-black dark:text-brand-white"
            />
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 rounded-2xl bg-brand-purple text-brand-white font-bold hover:bg-brand-purple-hover transition-all shadow-md flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-70"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                "Post Gig Now"
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default PostGig;
