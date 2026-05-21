import React, { useState, useRef, useEffect } from 'react';
import { Heart, MessageCircle, Send, MoreHorizontal, Trash2, X, Loader2, Bookmark, BadgeCheck, Play, Copy } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { communityService } from '../services/communityService';
import { toast } from 'sonner';
import { CommentBox } from './comments/CommentBox';
import { CommentList } from './comments/CommentList';

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
      city?: string;
      country?: string;
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
  const [replyTo, setReplyTo] = useState<{id: string, name: string} | null>(null);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [hasFetchedComments, setHasFetchedComments] = useState(false);
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showHeart, setShowHeart] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  const isOwner = user?.id === post.user_id;

  // Sync props to state for real-time updates from parent
  useEffect(() => {
    setIsLiked(post.is_liked);
  }, [post.is_liked]);

  useEffect(() => {
    setLikesCount(post.likes_count || 0);
  }, [post.likes_count]);

  useEffect(() => {
    setCommentsCount(post.comments_count || 0);
  }, [post.comments_count]);

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
    
    // Add event listeners for play/pause state
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    
    const videoEl = videoRef.current;
    videoEl.addEventListener('play', handlePlay);
    videoEl.addEventListener('pause', handlePause);

    return () => {
      observer.disconnect();
      videoEl.removeEventListener('play', handlePlay);
      videoEl.removeEventListener('pause', handlePause);
    };
  }, [post.video_url]);

  const handleVideoPress = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play().catch(e => console.log('Autoplay prevented:', e));
      } else {
        videoRef.current.pause();
      }
    }
  };

  const handleDoubleTap = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isLiked) {
      handleLike();
    }
    setShowHeart(true);
    setTimeout(() => {
      setShowHeart(false);
    }, 1000);
  };

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
      const { error } = await communityService.toggleLike(post.id, user.id, post.user_id);
      if (error) {
        throw error;
      }
    } catch (error) {
      console.error("Error toggling like:", error);
      // Revert on error
      setIsLiked(!newIsLiked);
      setLikesCount((prev) => (!newIsLiked ? prev + 1 : Math.max(0, prev - 1)));
      toast.error("Failed to update like status.");
    }
  };

  const formattedDate = post.created_at ? timeAgo(post.created_at) : 'Just now';

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/post/${post.id}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Post by ${post.user?.full_name || 'Anonymous User'}`,
          text: post.text ? (post.text.substring(0, 100) + '...') : 'Check out this post!',
          url: shareUrl,
        });
        toast.success("Shared successfully!");
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          setShowShareModal(true);
        }
      }
    } else {
      setShowShareModal(true);
    }
  };

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
      const { data } = await communityService.getComments(post.id, user?.id);
      if (data) {
        setComments(data);
        // Correct the count if necessary, or just rely on local state tracking
        setCommentsCount(data.length);
      }
      setHasFetchedComments(true);
      setIsLoadingComments(false);
    }
  };

  const handleCommentLike = async (commentId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) return;
    
    // Optimistic UI update
    setComments((prev: any[]) => prev.map(c => {
      if (c.id === commentId) {
        const isLiked = !c.is_liked;
        return {
          ...c,
          is_liked: isLiked,
          likes_count: Math.max(0, (c.likes_count || 0) + (isLiked ? 1 : -1))
        };
      }
      return c;
    }));

    const { error } = await communityService.likeComment(commentId, user.id);
    if (error) {
      // Rollback if failed
      setComments((prev: any[]) => prev.map(c => {
        if (c.id === commentId) {
          const isLiked = !c.is_liked; // revert
          return {
            ...c,
            is_liked: isLiked,
            likes_count: Math.max(0, (c.likes_count || 0) + (isLiked ? 1 : -1))
          };
        }
        return c;
      }));
    }
  };

  const [isExpanded, setIsExpanded] = useState(false);
  const isLongText = post.text && post.text.length > 100;

  if (isDeleting) return null; // Simple optimistic removal from DOM

  return (
    <div className="w-full sm:max-w-[600px] mx-auto mb-6 sm:mb-8 group/post">
      <div className="bg-white dark:bg-[#0F0F12] sm:rounded-2xl border-y sm:border border-gray-200 dark:border-[#1F1F23] flex flex-col relative z-0 overflow-hidden shadow-sm">
        
        {/* HEADER */}
        <div className="flex items-center gap-3 px-3 sm:px-4 py-3">
          <div 
            onClick={() => navigate(`/profile/${post.user_id}`)}
            className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-800 shrink-0 cursor-pointer object-cover"
          >
            <img
              src={post.user?.avatar_url || 'https://picsum.photos/seed/default/100'}
              alt={post.user?.full_name || 'User'}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="flex flex-col flex-1">
            <div className="flex items-center gap-1">
              <span 
                onClick={() => navigate(`/profile/${post.user_id}`)}
                className="font-bold text-[14px] text-gray-900 dark:text-white leading-tight cursor-pointer hover:underline"
              >
                {post.user?.full_name || 'Anonymous User'}
              </span>
              <BadgeCheck className="w-3.5 h-3.5 text-brand-purple" />
            </div>
            <span className="text-[12px] text-gray-500 font-medium">
              {formattedDate} {post.user?.city && post.user?.country ? `• ${post.user.city}, ${post.user.country}` : ''}
            </span>
          </div>
          
          {isOwner && (
            <div className="relative">
              <button 
                onClick={() => {
                  setShowOptions(!showOptions);
                  setConfirmDelete(false);
                }}
                className="p-2 text-gray-900 dark:text-white transition-all active:opacity-50"
              >
                <MoreHorizontal className="w-5 h-5" />
              </button>
              
              {showOptions && (
                <div className="absolute right-0 mt-1 w-48 bg-white dark:bg-[#1A1A1E] rounded-xl shadow-lg border border-gray-100 dark:border-[#2A2A2F] overflow-hidden z-20 py-1">
                  <button 
                    onClick={handleDelete}
                    className="w-full flex items-center gap-3 px-4 py-3 text-[14px] font-bold text-red-500 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    {confirmDelete ? "Tap to confirm" : "Delete"}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* MEDIA */}
        {(post.image_urls?.length || post.video_url) ? (
          <div className="w-full">
            <div 
              className="relative w-full aspect-[4/5] bg-[#0A0A0C] group/media overflow-hidden"
              onDoubleClick={handleDoubleTap}
            >
              {post.image_urls && post.image_urls.length > 0 && (
                <div className="absolute inset-0 flex overflow-x-auto snap-x snap-mandatory no-scrollbar h-full w-full">
                  {post.image_urls.map((url, i) => (
                    <div key={i} className="flex-none w-full h-full snap-center relative">
                      <img
                        src={url}
                        alt={`Post media ${i + 1}`}
                        className="w-full h-full object-cover object-center"
                        referrerPolicy="no-referrer"
                        loading={i === 0 ? "lazy" : "eager"}
                      />
                    </div>
                  ))}
                </div>
              )}
              {post.video_url && (
                <div className="absolute inset-0 w-full h-full cursor-pointer" onClick={handleVideoPress}>
                  <video 
                    ref={videoRef}
                    src={post.video_url} 
                    loop
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover object-center"
                  />
                  {!isPlaying && (
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center transition-opacity z-10">
                      <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center">
                        <Play className="w-8 h-8 text-white fill-white ml-1" />
                      </div>
                    </div>
                  )}
                </div>
              )}
              {post.image_urls && post.image_urls.length > 1 && (
                <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-2 py-1 rounded-full text-white text-[10px] font-bold tracking-wide">
                  1/{post.image_urls.length}
                </div>
              )}
              
              {/* Double-tap heart animation overlay */}
              {showHeart && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-50 animate-in zoom-in-50 fade-in duration-300">
                  <Heart className="w-24 h-24 text-white fill-white drop-shadow-2xl opacity-90" />
                </div>
              )}
            </div>
          </div>
        ) : null}

        {/* ACTIONS */}
        <div className="flex items-center justify-between px-3 sm:px-4 py-3">
          <div className="flex items-center gap-6">
            <button
              onClick={handleLike}
              className="flex items-center gap-2 active:opacity-50 transition-opacity group"
              aria-label="Like post"
            >
              <Heart className={`w-[26px] h-[26px] ${isLiked ? 'fill-brand-purple text-brand-purple' : 'text-gray-900 dark:text-white group-hover:text-brand-purple'}`} strokeWidth={isLiked ? 2.5 : 1.5} />
              {likesCount > 0 && <span className="font-semibold text-gray-700 dark:text-gray-300">{likesCount}</span>}
            </button>
            
            <button 
              onClick={handleToggleComments}
              className="flex items-center gap-2 active:opacity-50 transition-opacity text-gray-900 dark:text-white group"
              aria-label="Comment"
            >
              <MessageCircle className="w-[26px] h-[26px] group-hover:text-brand-purple" strokeWidth={1.5} />
              {commentsCount > 0 && <span className="font-semibold text-gray-700 dark:text-gray-300">{commentsCount}</span>}
            </button>
            
            <button 
              onClick={handleShare}
              className="flex items-center gap-2 active:opacity-50 transition-opacity text-gray-900 dark:text-white group"
              aria-label="Share"
            >
              <Send className="w-[26px] h-[26px] -mt-1 group-hover:text-brand-purple" strokeWidth={1.5} />
            </button>
          </div>

          <div className="flex items-center gap-4">
            <button 
              className="active:opacity-50 transition-opacity text-gray-900 dark:text-white hover:text-brand-purple"
              aria-label="Save"
            >
              <Bookmark className="w-[26px] h-[26px]" strokeWidth={1.5} />
            </button>
          </div>
        </div>

        {/* CAPTION */}
        {post.text && (
          <div className="px-3 sm:px-4 text-[14px] text-gray-900 dark:text-white leading-tight mb-2">
            <span className="font-bold mr-2 cursor-pointer hover:underline" onClick={() => navigate(`/profile/${post.user_id}`)}>
              {post.user?.full_name || 'Anonymous User'}
            </span>
            <span>
              {isExpanded ? post.text : isLongText ? (post.text.substring(0, 100) + '...') : post.text}
            </span>
            {isLongText && !isExpanded && (
              <button 
                onClick={() => setIsExpanded(true)}
                className="text-gray-500 font-medium ml-1"
              >
                more
              </button>
            )}
          </div>
        )}        {/* VIEW ALL COMMENTS */}
        {commentsCount > 0 && !showComments && (
          <div className="px-3 sm:px-4 pb-2">
            <button 
              onClick={handleToggleComments}
              className="text-[14px] text-gray-500 font-medium active:opacity-50"
            >
              View all {commentsCount} comments
            </button>
          </div>
        )}

        {showComments && (
          <CommentList 
            comments={comments} 
            currentUser={user} 
            postOwnerId={post.user_id} 
            onLike={handleCommentLike} 
            onReply={(id, name) => setReplyTo({ id, name })} 
            onDelete={async (commentId) => {
              const { error } = await communityService.deleteComment(commentId, post.id);
              if (!error) {
                setComments(prev => prev.filter(c => c.id !== commentId && c.parent_id !== commentId));
                setCommentsCount(prev => Math.max(0, prev - 1));
                toast.success("Comment deleted");
              } else {
                toast.error("Failed to delete comment");
              }
            }}
            onEdit={async (commentId, content) => {
              const { error } = await communityService.editComment(commentId, content);
              if (!error) {
                setComments(prev => prev.map(c => c.id === commentId ? { ...c, content } : c));
                toast.success("Comment updated");
              } else {
                toast.error("Failed to update comment");
              }
            }}
          />
        )}

        {/* ALWAYS VISIBLE INLINE COMMENT INPUT */}
        <CommentBox
          postId={post.id}
          user={user}
          onSubmit={async (text, parentId) => {
             if (!user) return;
             const { error } = await communityService.addComment(post.id, user.id, text, parentId);
             if (error) {
               console.error(error);
               toast.error("Failed to add comment.");
             } else {
               const { data } = await communityService.getComments(post.id, user?.id);
               if (data) {
                 setComments(data);
                 setCommentsCount(data.length);
                 setShowComments(true);
                 setReplyTo(null);
               }
             }
          }}
          replyTo={replyTo}
          onCancelReply={() => setReplyTo(null)}
        />
      </div>

      {/* SHARE MODAL */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0F0F12] rounded-2xl w-full max-w-sm overflow-hidden flex flex-col shadow-2xl relative">
            <div className="px-5 py-4 border-b border-gray-200 dark:border-[#1F1F23] flex items-center justify-between sticky top-0 bg-white dark:bg-[#0F0F12] z-10">
              <h3 className="font-bold text-lg text-gray-900 dark:text-white">Share Post</h3>
              <button onClick={() => setShowShareModal(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-[#1F1F23] rounded-full transition-colors active:scale-95 text-gray-900 dark:text-white bg-transparent outline-none"> 
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-5 flex flex-col gap-3">
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(`${window.location.origin}/post/${post.id}`);
                  toast.success("Link copied to clipboard!");
                  setShowShareModal(false);
                }}
                className="flex items-center gap-3 p-3 hover:bg-gray-100 dark:hover:bg-[#1F1F23] rounded-xl transition-colors text-left"
              >
                <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
                  <Copy className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                </div>
                <span className="font-medium text-gray-900 dark:text-white">Copy Link</span>
              </button>

              <button 
                onClick={() => {
                  window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(`${window.location.origin}/post/${post.id}`)}&text=${encodeURIComponent('Check out this post on GigsConnect!')}`, '_blank');
                  setShowShareModal(false);
                }}
                className="flex items-center gap-3 p-3 hover:bg-gray-100 dark:hover:bg-[#1F1F23] rounded-xl transition-colors text-left"
              >
                <div className="w-10 h-10 rounded-full bg-black dark:bg-white flex items-center justify-center">
                  <svg className="w-4 h-4 text-white dark:text-black fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                </div>
                <span className="font-medium text-gray-900 dark:text-white">X (Twitter)</span>
              </button>

              <button 
                onClick={() => {
                  window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`${window.location.origin}/post/${post.id}`)}`, '_blank');
                  setShowShareModal(false);
                }}
                className="flex items-center gap-3 p-3 hover:bg-gray-100 dark:hover:bg-[#1F1F23] rounded-xl transition-colors text-left"
              >
                <div className="w-10 h-10 rounded-full bg-[#0077B5] flex items-center justify-center">
                  <svg className="w-5 h-5 text-white fill-current" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
                </div>
                <span className="font-medium text-gray-900 dark:text-white">LinkedIn</span>
              </button>

              <button 
                onClick={() => {
                  window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(`Check out this post! ${window.location.origin}/post/${post.id}`)}`, '_blank');
                  setShowShareModal(false);
                }}
                className="flex items-center gap-3 p-3 hover:bg-gray-100 dark:hover:bg-[#1F1F23] rounded-xl transition-colors text-left"
              >
                <div className="w-10 h-10 rounded-full bg-[#25D366] flex items-center justify-center">
                  <svg className="w-5 h-5 text-white fill-current" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                </div>
                <span className="font-medium text-gray-900 dark:text-white">WhatsApp</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
