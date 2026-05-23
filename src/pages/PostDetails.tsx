import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { communityService } from '../services/communityService';
import { CommentList } from '../components/comments/CommentList';
import { CommentBox } from '../components/comments/CommentBox';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function PostDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [replyTo, setReplyTo] = useState<{ id: string; name: string } | null>(null);
  
  const commentInputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    async function loadComments() {
      if (!id) return;
      try {
        const { data, error } = await communityService.getComments(id, user?.id);
        if (error) throw error;
        if (data) {
          setComments(data);
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to load comments");
      } finally {
        setLoading(false);
      }
    }
    loadComments();
    
    // Auto focus on enter
    setTimeout(() => {
      commentInputRef.current?.focus();
    }, 300);
  }, [id, user]);

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
          const isLiked = !c.is_liked;
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

  return (
    <div className="w-full h-screen flex flex-col bg-brand-gray dark:bg-brand-black transition-colors">
      {/* HEADER */}
      <div className="shrink-0 sticky top-0 z-20 bg-white/80 dark:bg-[#0F0F12]/80 backdrop-blur-lg border-b border-gray-200 dark:border-[#1F1F23] flex items-center px-4 py-3">
        <button 
          onClick={() => navigate(-1)}
          className="p-2 -ml-2 mr-2 hover:bg-gray-100 dark:hover:bg-[#1F1F23] rounded-full transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-gray-900 dark:text-white" />
        </button>
        <h1 className="text-[18px] font-bold text-gray-900 dark:text-white">Comments</h1>
      </div>

      <div className="flex-1 overflow-y-auto w-full max-w-[800px] mx-auto pb-24">
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <Loader2 className="w-8 h-8 animate-spin text-brand-purple" />
          </div>
        ) : comments.length === 0 ? (
          <div className="flex justify-center items-center h-40 text-gray-500">
            No comments yet. Be the first to start the discussion!
          </div>
        ) : (
          <div className="pt-2">
            <CommentList 
              comments={comments} 
              currentUser={user} 
              // We pass a dummy postOwnerId because we don't have it here. Or we can just omit it if ok.
              postOwnerId={""} 
              onLike={handleCommentLike} 
              onReply={(replyId, name) => {
                setReplyTo({ id: replyId, name });
                setTimeout(() => {
                  commentInputRef.current?.focus();
                }, 50);
              }} 
              onDelete={async (commentId) => {
                const { error } = await communityService.deleteComment(commentId, id!);
                if (!error) {
                  setComments(prev => prev.filter(c => c.id !== commentId && c.parent_id !== commentId));
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
          </div>
        )}
      </div>
      
      {/* COMMENT INPUT FIXED AT BOTTOM */}
      <div className="fixed bottom-[60px] sm:bottom-0 left-0 right-0 sm:left-[240px] xl:left-[280px] bg-white dark:bg-[#121214] border-t border-gray-200 dark:border-gray-800 p-3 sm:p-4 shrink-0 transition-all z-20">
        <div className="max-w-[800px] mx-auto">
          <CommentBox
            inputRef={commentInputRef}
            postId={id!}
            user={user}
            onSubmit={async (text, parentId) => {
               if (!user) return;
               const { error } = await communityService.addComment(id!, user.id, text, parentId);
               if (error) {
                 console.error(error);
                 toast.error("Failed to add comment.");
               } else {
                 const { data } = await communityService.getComments(id!, user?.id);
                 if (data) {
                   setComments(data);
                   setReplyTo(null);
                 }
               }
            }}
            replyTo={replyTo}
            onCancelReply={() => setReplyTo(null)}
          />
        </div>
      </div>
    </div>
  );
}
