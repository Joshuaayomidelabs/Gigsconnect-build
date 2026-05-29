import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Trash2, Edit2, Loader2, MoreHorizontal } from 'lucide-react';
import { formatDistanceToNow, parseISO } from 'date-fns';

interface CommentItemProps {
  comment: any;
  replies: any[];
  currentUser: any;
  postOwnerId: string;
  onReply: (commentId: string, username: string) => void;
  onLike: (commentId: string, e: React.MouseEvent) => void;
  onDelete: (commentId: string) => Promise<void>;
  onEdit: (commentId: string, newContent: string) => Promise<void>;
}

export function CommentItem({
  comment,
  replies,
  currentUser,
  postOwnerId,
  onReply,
  onLike,
  onDelete,
  onEdit,
}: CommentItemProps) {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSubmittingEdit, setIsSubmittingEdit] = useState(false);

  const isOwner = currentUser?.id === comment.user_id;
  const isPostOwner = currentUser?.id === postOwnerId;
  const canDelete = isOwner || isPostOwner;

  const handleSaveEdit = async () => {
    if (!editContent.trim() || editContent === comment.content) {
      setIsEditing(false);
      return;
    }
    setIsSubmittingEdit(true);
    await onEdit(comment.id, editContent);
    setIsSubmittingEdit(false);
    setIsEditing(false);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    await onDelete(comment.id);
    setIsDeleting(false);
  };

  if (isDeleting) return null;

  return (
    <div className="flex flex-col gap-3 group">
      <div className="flex gap-3 relative">
        <div 
          onClick={() => navigate(`/profile/${comment.user_id}`)}
          className="w-[32px] h-[32px] rounded-full overflow-hidden bg-brand-gray dark:bg-[#0F0F12] shrink-0 border border-brand-gray dark:border-[#1F1F23] cursor-pointer"
        >
          <img
            src={comment.user?.avatar_url || 'https://picsum.photos/seed/default/100'}
            alt={comment.user?.username || comment.user?.full_name || 'User'}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        
        <div className="flex flex-col flex-1 pl-1">
          <div className="flex items-start justify-between gap-2">
            <div className="flex flex-col flex-1">
              <span 
                onClick={() => navigate(`/profile/${comment.user_id}`)}
                className="font-bold text-[13px] text-gray-900 dark:text-white cursor-pointer hover:underline inline-block mr-2"
              >
                {comment.user?.username || comment.user?.full_name || 'Anonymous User'}
              </span>
              
              {isEditing ? (
                <div className="mt-1 flex flex-col gap-2 w-full pr-2">
                  <textarea
                    value={editContent}
                    onChange={(e) => {
                      setEditContent(e.target.value);
                      e.target.style.height = 'auto';
                      e.target.style.height = e.target.scrollHeight + 'px';
                    }}
                    className="w-full bg-transparent text-[14px] leading-snug border-b border-brand-purple focus:outline-none text-gray-900 dark:text-gray-200 resize-none py-1"
                    rows={1}
                  />
                  <div className="flex gap-3 text-[12px] font-bold">
                    <button onClick={() => setIsEditing(false)} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">Cancel</button>
                    <button onClick={handleSaveEdit} className="text-brand-purple" disabled={isSubmittingEdit}>
                      {isSubmittingEdit ? 'Saving...' : 'Save'}
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-[14px] text-gray-800 dark:text-gray-200 leading-snug break-words pr-2 mr-2">
                  {comment.content}
                </p>
              )}
            </div>
            
            <button 
              onClick={(e) => onLike(comment.id, e)}
              className="flex flex-col items-center shrink-0 pr-1 group shrink-0"
            >
              <Heart 
                className={`w-[14px] h-[14px] transition-transform group-active:scale-90 ${comment.is_liked ? 'fill-brand-purple text-brand-purple' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`} 
                strokeWidth={comment.is_liked ? 2.5 : 2} 
              />
              {comment.likes_count > 0 && <span className="text-[10px] text-gray-400 font-semibold mt-0.5">{comment.likes_count}</span>}
            </button>
          </div>

          <div className="flex gap-4 mt-2 text-[12px] font-medium text-gray-500 items-center">
            <span className="text-[12px]">
              {(() => {
                if (!comment.created_at) return "Just now";
                try {
                  const safeStr = comment.created_at.endsWith('Z') || comment.created_at.includes('+') ? comment.created_at : `${comment.created_at}Z`;
                  const date = parseISO(safeStr);
                  if (date.getTime() > new Date().getTime()) return "Just now";
                  const res = formatDistanceToNow(date, { addSuffix: true });
                  if (res.includes('less than a minute') || res.includes('half a minute')) return "Just now";
                  return res.replace("about ", "").replace("almost ", "").replace("over ", "").replace("minutes", "mins").replace("minute", "min").replace("1 day ago", "Yesterday");
                } catch(e) {
                  return "Just now";
                }
              })()}
            </span>
            <button 
              onClick={() => onReply(comment.id, comment.user?.username || comment.user?.full_name || 'User')} 
              className="hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              Reply
            </button>
            {isOwner && (
              <button onClick={() => setIsEditing(!isEditing)} className="hover:text-gray-900 dark:hover:text-white transition-colors">
                Edit
              </button>
            )}
            {canDelete && (
              <button onClick={handleDelete} className="hover:text-red-500 transition-colors">
                Delete
              </button>
            )}
          </div>
        </div>
      </div>

      {replies && replies.length > 0 && (
        <div className="ml-[44px] flex flex-col gap-3">
          {replies.map(reply => (
            <CommentItem
              key={reply.id}
              comment={reply}
              replies={[]} // Only 1 level of nesting per UI requirements
              currentUser={currentUser}
              postOwnerId={postOwnerId}
              onReply={(id, name) => onReply(comment.id, name)} // Send parent id for 1-level threading
              onLike={onLike}
              onDelete={onDelete}
              onEdit={onEdit}
            />
          ))}
        </div>
      )}
    </div>
  );
}
