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
  // Only show top level comments here, replies are handled recursively inside CommentItem
  const topLevelComments = comments.filter(c => !c.parent_id);
  
  if (comments.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-4 px-3 sm:px-4 pb-2 pt-1">
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
