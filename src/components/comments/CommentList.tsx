import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { CommentItem } from './CommentItem';

interface CommentListProps {
  comments: any[];
  currentUser: any;
  postOwnerId: string;
  onLike: (commentId: string, e: React.MouseEvent) => void;
  onReply: (commentId: string, username: string) => void;
  onDelete: (commentId: string) => Promise<void>;
  onEdit: (commentId: string, newContent: string) => Promise<void>;
}

export function CommentList({
  comments,
  currentUser,
  postOwnerId,
  onLike,
  onReply,
  onDelete,
  onEdit
}: CommentListProps) {
  const [sortOption, setSortOption] = useState<'newest' | 'top'>('newest');

  // Only show top level comments here, replies are handled recursively inside CommentItem
  const topLevelComments = [...comments].filter(c => !c.parent_id);

  if (sortOption === 'top') {
    topLevelComments.sort((a, b) => (b.likes_count || 0) - (a.likes_count || 0));
  } else {
    topLevelComments.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }
  
  if (comments.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-4 px-3 sm:px-4 pb-2 pt-1 border-t border-gray-100 dark:border-[#1F1F23]">
      <div className="flex justify-between items-center py-2">
        <h3 className="font-bold text-[15px] text-gray-900 dark:text-white">Comments</h3>
        <select 
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value as 'newest' | 'top')}
          className="text-[13px] bg-transparent outline-none cursor-pointer text-gray-600 dark:text-gray-400 font-medium hover:text-gray-900 dark:hover:text-gray-200 transition-colors bg-white dark:bg-[#0F0F12]"
        >
          <option value="newest">Newest</option>
          <option value="top">Top comments</option>
        </select>
      </div>
      {topLevelComments.map(comment => (
        <CommentItem
          key={comment.id}
          comment={comment}
          replies={comments.filter(c => c.parent_id === comment.id)}
          currentUser={currentUser}
          postOwnerId={postOwnerId}
          onLike={onLike}
          onReply={onReply}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      ))}
    </div>
  );
}
