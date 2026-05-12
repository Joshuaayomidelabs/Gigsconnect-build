import React, { useState, useRef, useEffect } from 'react';
import { Heart, MessageCircle, Send, MoreHorizontal, Trash2, X, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { communityService } from '../services/communityService';
import { toast } from 'sonner';

function timeAgo(date: string | Date) {
  const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);

  const intervals: Record<string, number> = {
    year: 31536000,
    month: 2592000,
    day: 86400,
    hour: 3600,
    minute: 60
  };

  for (let key in intervals) {
    const interval = Math.floor(seconds / intervals[key]);
    if (interval > 0) {
      return interval + " " + key + (interval > 1 ? "s" : "") + " ago";
    }
  }

  return "Just now";
}

interface PostCardProps {
  post: {
    id: string;
    text: string;
    created_at: string;
    image_urls?: string[];
    video_url?: string;
    audio_url?: string;
    user_id: string; // <-- Needed to check ownership
    user: {
      full_name: string;
      avatar_url: string;
    };
    likes_count: number;
    comments_count?: number;
    is_liked: boolean;
  };
  onDelete?: (postId: string) => void;
}

export default function PostCard({ post, onDelete }: PostCardProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLiked, setIsLiked] = useState(post.is_liked);
  const [likesCount, setLikesCount] = useState(post.likes_count || 0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Comments State
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<any[]>([]);
  const [commentsCount, setCommentsCount] = useState(post.comments_count || 0);
  const [newCommentText, setNewCommentText] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [hasFetchedComments, setHasFetchedComments] = useState(false);
  const [isLoadingComments, setIsLoadingComments] = useState(false);

  const isOwner = user?.id === post.user_id;

  useEffect(() => {
    if (!videoRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          videoRef.current?.play().catch(e => console.log('Autoplay prevented by browser:', e));
        } else {
          videoRef.current?.pause();
        }
      },
      { threshold: 0.6 } // Play when 60% visible
    );

    observer.observe(videoRef.current);
    return () => observer.disconnect();
  }, [post.video_url]);

  const handleLike = async () => {
    if (!user) {
      toast.error("You must be logged in to like posts.");
      return;
    }
    
    // Optimistic UI update
    const newIsLiked = !isLiked;
    setIsLiked(newIsLiked);
    setLikesCount((prev) => (newIsLiked ? prev + 1 : Math.max(0, prev - 1)));

    try {
      await communityService.toggleLike(post.id, user.id, post.user_id);
    } catch (error) {
      console.error("Error toggling like:", error);
      // Revert on error
      setIsLiked(!newIsLiked);
      setLikesCount((prev) => (!newIsLiked ? prev + 1 : Math.max(0, prev - 1)));
      toast.error("Failed to update like status.");
    }
  };

  const formattedDate = post.created_at ? timeAgo(post.created_at) : 'Just now';

  const handleDelete = async () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    
    setIsDeleting(true);
    try {
      const { error } = await communityService.deletePost(post.id);
      if (error) throw error;
      toast.success("Post deleted safely");
      setShowOptions(false);
      setConfirmDelete(false);
      if (onDelete) onDelete(post.id);
    } catch (err) {
      console.error("Error deleting post:", err);
      toast.error("Failed to delete post.");
      setIsDeleting(false);
    }
  };

  const handleToggleComments = async () => {
    setShowComments(true);
    if (!hasFetchedComments) {
      setIsLoadingComments(true);
      const { data } = await communityService.getComments(post.id);
      if (data) {
        setComments(data);
        // Correct the count if necessary, or just rely on local state tracking
        setCommentsCount(data.length);
      }
      setHasFetchedComments(true);
      setIsLoadingComments(false);
    }
  };

  const submitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim() || !user) return;

    setIsSubmittingComment(true);
    try {
      const { data, error } = await communityService.addComment(post.id, user.id, newCommentText);
      if (error) throw error;
      
      if (data && data[0]) {
        // Optimistically add comment to list
        const newCommentObj = {
          ...data[0],
          user: {
            full_name: user?.user_metadata?.full_name || 'You',
            avatar_url: user?.user_metadata?.avatar_url || 'https://picsum.photos/seed/default/100'
          }
        };
        setComments([...comments, newCommentObj]);
        setCommentsCount((prev) => prev + 1);
      } else {
        // Fallback re-fetch if insert select doesn't populate properly
        const { data: refetched } = await communityService.getComments(post.id);
        if (refetched) {
          setComments(refetched);
          setCommentsCount(refetched.length);
        }
      }
      setNewCommentText("");
    } catch (err) {
      console.error("Error adding comment:", err);
      toast.error("Failed to add comment.");
    } finally {
      setIsSubmittingComment(false);
    }
  };

  if (isDeleting) return null; // Simple optimistic removal from DOM

  return (
    <div className="bg-white dark:bg-[#121214] rounded-none sm:rounded-[20px] border-b sm:border border-gray-100 dark:border-[#1F1F23]/80 overflow-hidden max-w-[600px] mx-auto w-full shadow-sm hover:shadow-md dark:shadow-none dark:hover:shadow-[0_4px_20px_rgba(0,0,0,0.4)] transition-all duration-300 sm:hover:-translate-y-[2px] mb-6">
      {/* Header */}
      <div className="flex items-center gap-3 p-5 pb-4">
        <div 
          onClick={() => navigate(`/profile/${post.user_id}`)}
          className="w-[44px] h-[44px] rounded-full overflow-hidden bg-gray-200 dark:bg-gray-800 shrink-0 border border-gray-100 dark:border-[#1F1F23] cursor-pointer hover:opacity-80 transition-opacity"
        >
          <img
            src={post.user?.avatar_url || 'https://picsum.photos/seed/default/100'}
            alt={post.user?.full_name || 'User'}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="flex flex-col flex-1">
          <span 
            onClick={() => navigate(`/profile/${post.user_id}`)}
            className="font-bold text-[14px] text-gray-900 dark:text-white leading-tight mb-0.5 cursor-pointer hover:underline"
          >
            {post.user?.full_name || 'Anonymous User'}
          </span>
          <span className="text-[12px] text-gray-500 font-medium">
            {formattedDate}
          </span>
        </div>
        
        {isOwner && (
          <div className="relative">
            <button 
              onClick={() => {
                setShowOptions(!showOptions);
                setConfirmDelete(false);
              }}
              className="p-2 text-[#9CA3AF] hover:text-[#A78BFA] active:text-[#6C2BD9] rounded-full transition-all duration-200 ease-in-out active:scale-105"
            >
              <MoreHorizontal className="w-5 h-5" />
            </button>
            
            {showOptions && (
              <div className="absolute right-0 mt-1 w-48 bg-white dark:bg-[#0F0F12] rounded-xl shadow-xl border border-gray-100 dark:border-[#1F1F23]/60 overflow-hidden z-10 py-1">
                <button 
                  onClick={handleDelete}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  {confirmDelete ? "Click again to confirm" : "Delete Post"}
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Body / Text */}
      {post.text && (
        <div className="px-5 pb-4 text-[15px] text-gray-800 dark:text-gray-200 whitespace-pre-wrap leading-[1.6]">
          {post.text}
        </div>
      )}

      {/* Optional Image */}
      {post.image_urls && post.image_urls.length > 0 && (
        <div className="w-full bg-gray-50 dark:bg-[#0A0A0C] border-y border-gray-100 dark:border-[#1F1F23]/50">
          <img
            src={post.image_urls[0]}
            alt="Post content"
            className="w-full h-auto object-cover max-h-[600px]"
            referrerPolicy="no-referrer"
          />
        </div>
      )}

      {/* Optional Video */}
      {post.video_url && (
        <div className="w-full bg-black/5 dark:bg-[#0A0A0C] border-y border-gray-100 dark:border-[#1F1F23]/50">
          <video 
            ref={videoRef}
            src={post.video_url} 
            controls 
            loop
            muted
            playsInline
            className="w-full h-auto max-h-[600px] object-contain"
          />
        </div>
      )}

      {/* View all comments */}
      {commentsCount > 0 && (
        <div className="px-5 pt-4 pb-1">
          <button 
            onClick={handleToggleComments}
            className="text-[14px] text-[#9CA3AF] text-left hover:text-[#A78BFA] active:text-[#6C2BD9] transition-all duration-200 w-fit font-medium active:scale-[0.98]"
          >
            View all {commentsCount} comments
          </button>
        </div>
      )}

      {/* Compact Engagement Bar */}
      <div className={`px-5 py-3.5 mt-1 flex items-center ${commentsCount > 0 ? '' : 'border-t border-gray-100 dark:border-[#1F1F23]/60'}`}>
        <div className="flex items-center gap-6 text-[#9CA3AF]">
          {/* Like */}
          <button
            onClick={handleLike}
            className={`flex items-center gap-1.5 transition-all duration-200 ease-in-out active:scale-105 group font-medium text-[14px] ${isLiked ? 'text-[#6C2BD9]' : 'hover:text-[#A78BFA] active:text-[#6C2BD9]'}`}
            aria-label="Like post"
          >
            <Heart className={`w-[22px] h-[22px] transition-colors duration-200 ${isLiked ? 'fill-[#6C2BD9] text-[#6C2BD9]' : ''}`} />
            {likesCount > 0 ? likesCount : ''}
          </button>
          
          {/* Comment */}
          <button 
            onClick={handleToggleComments}
            className="flex items-center gap-1.5 transition-all duration-200 ease-in-out active:scale-105 hover:text-[#A78BFA] active:text-[#6C2BD9] group font-medium text-[14px]"
            aria-label="Comment"
          >
            <MessageCircle className="w-[22px] h-[22px]" />
            {commentsCount > 0 ? commentsCount : ''}
          </button>
        </div>

        {/* Share */}
        <button 
          className="flex items-center gap-1.5 ml-auto transition-all duration-200 ease-in-out active:scale-105 text-[#9CA3AF] hover:text-[#A78BFA] active:text-[#6C2BD9] font-medium text-[14px]"
          aria-label="Share"
        >
          <Send className="w-[20px] h-[20px] ml-[2px] mt-[-2px]" />
          <span className="hidden sm:inline">Share</span>
        </button>
      </div>

      {/* Comments Modal (Mobile-first Bottom Sheet) */}
      {showComments && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in" onClick={() => setShowComments(false)}>
          <div 
            className="bg-[#0F0F12] w-full max-w-[600px] h-[90vh] sm:h-[80vh] sm:max-h-[700px] rounded-t-[24px] sm:rounded-[24px] shadow-2xl border border-[#1F1F23] flex flex-col overflow-hidden animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#1F1F23]">
              <h3 className="font-bold text-[16px] text-white">
                Comments <span className="text-[#9CA3AF] font-medium">({commentsCount})</span>
              </h3>
              <button 
                onClick={() => setShowComments(false)}
                className="p-2 text-[#9CA3AF] hover:text-white transition-colors rounded-full hover:bg-[#1F1F23]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Comments List */}
            <div className="flex-1 overflow-y-auto px-5 py-5 custom-scrollbar flex flex-col gap-6">
              {isLoadingComments ? (
                <div className="flex-1 flex items-center justify-center">
                  <Loader2 className="w-8 h-8 text-[#6C2BD9] animate-spin" />
                </div>
              ) : comments.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-[#9CA3AF] h-full my-auto">
                  <MessageCircle className="w-12 h-12 mb-3 opacity-30" />
                  <p className="text-[15px] font-medium text-gray-300 mb-1">No comments yet</p>
                  <p className="text-[14px]">Be the first to start the conversation!</p>
                </div>
              ) : (
                comments.map((comment) => (
                  <div key={comment.id} className="flex gap-3">
                    <div className="w-[36px] h-[36px] rounded-full overflow-hidden bg-[#0F0F12] shrink-0 border border-[#1F1F23]">
                      <img
                        src={comment.user?.avatar_url || 'https://picsum.photos/seed/default/100'}
                        alt={comment.user?.full_name || 'User'}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="flex flex-col flex-1">
                      <div className="flex items-baseline gap-2 mb-0.5">
                        <span className="font-bold text-[14px] text-white">
                          {comment.user?.full_name || 'Anonymous User'}
                        </span>
                        <span className="text-[12px] text-[#9CA3AF]">
                          {timeAgo(comment.created_at)}
                        </span>
                      </div>
                      <p className="text-[14.5px] text-gray-200 leading-snug">
                        {comment.text}
                      </p>
                      {/* Premium Interaction actions (Visually only, as placeholders to improve perception of UI feature) */}
                      <div className="flex gap-4 mt-2 text-[12px] font-medium text-[#9CA3AF]">
                        <button className="hover:text-white transition-colors active:text-[#6C2BD9]">Reply</button>
                        <button className="hover:text-white transition-colors active:text-[#6C2BD9]">Like</button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Sticky Comment Input */}
            <div className="px-5 py-4 border-t border-[#1F1F23] bg-[#0F0F12] pb-safe z-10 sticky bottom-0">
              <form onSubmit={submitComment} className="flex gap-3 items-center">
                <div className="w-[36px] h-[36px] rounded-full overflow-hidden shrink-0 hidden sm:block border-gray-800 border">
                  <img src={user?.user_metadata?.avatar_url || 'https://picsum.photos/seed/default/100'} alt="Me" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                </div>
                <input
                  type="text"
                  value={newCommentText}
                  onChange={(e) => setNewCommentText(e.target.value)}
                  placeholder="Write a comment..."
                  className="flex-1 bg-white/5 border border-[#1F1F23] rounded-full px-4 py-2.5 text-[14.5px] text-white placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#6C2BD9] focus:ring-1 focus:ring-[#6C2BD9] transition-all duration-200"
                />
                <button
                  type="submit"
                  disabled={isSubmittingComment || !newCommentText.trim()}
                  className="flex items-center justify-center w-[40px] h-[40px] rounded-full bg-[#6C2BD9] text-white disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-[#1F1F23] hover:bg-[#A78BFA] active:bg-[#4C1D95] active:scale-105 transition-all duration-200 ease-in-out shrink-0"
                >
                  {isSubmittingComment ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4 ml-[-2px]" />
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
