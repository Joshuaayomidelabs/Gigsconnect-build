import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { profilesService } from '../../services/profilesService';

interface CommentBoxProps {
  postId: string;
  user: any;
  onSubmit: (text: string, parentId?: string | null) => Promise<void>;
  replyTo?: { id: string; name: string } | null;
  onCancelReply?: () => void;
  inputRef?: React.RefObject<HTMLTextAreaElement>;
}

export function CommentBox({ postId, user, onSubmit, replyTo, onCancelReply, inputRef }: CommentBoxProps) {
  const [text, setText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        const { data } = await profilesService.getProfile(user.id);
        if (data && data.avatar_url) {
          setAvatarUrl(data.avatar_url);
        } else {
          setAvatarUrl(user?.user_metadata?.avatar_url || 'https://picsum.photos/seed/default/100');
        }
      }
    };
    fetchProfile();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || !user || isSubmitting) return;

    setIsSubmitting(true);
    await onSubmit(text.trim(), replyTo?.id);
    setText("");
    setIsSubmitting(false);
  };

  return (
    <div className="px-3 sm:px-4 pb-4 pt-1 flex flex-col gap-2">
      {replyTo && (
        <div className="flex items-center justify-between bg-brand-gray/10 dark:bg-[#1F1F23]/50 px-3 py-1.5 rounded-md text-[13px] text-gray-600 dark:text-gray-300">
          <span>Replying to <span className="font-semibold">{replyTo.name}</span></span>
          <button type="button" onClick={onCancelReply} className="font-bold hover:text-brand-purple">✕</button>
        </div>
      )}
      <form onSubmit={handleSubmit} className="flex gap-3 items-start">
        {user ? (
          <div className="w-[32px] h-[32px] rounded-full overflow-hidden shrink-0 border border-brand-gray dark:border-[#1F1F23] mt-0.5">
            <img 
              src={avatarUrl || user?.user_metadata?.avatar_url || 'https://picsum.photos/seed/default/100'} 
              alt="Me" 
              referrerPolicy="no-referrer" 
              className="w-full h-full object-cover" 
            />
          </div>
        ) : (
          <div className="w-[32px] h-[32px] rounded-full shrink-0 bg-gray-200 dark:bg-[#1F1F23] mt-0.5" />
        )}
        <div className="flex-1 flex flex-col items-end gap-2">
          <textarea
            ref={inputRef}
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              e.target.style.height = 'auto';
              e.target.style.height = e.target.scrollHeight + 'px';
            }}
            placeholder={user ? "Add a comment..." : "Log in to comment"}
            disabled={!user || isSubmitting}
            rows={1}
            style={{ minHeight: '36px', maxHeight: '120px' }}
            className="w-full bg-transparent text-[14px] leading-relaxed text-gray-900 dark:text-white placeholder:text-gray-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed resize-none overflow-y-auto pt-2"
          />
          {text.trim() && user && (
            <button
              type="submit"
              disabled={isSubmitting || !text.trim()}
              className="text-brand-purple font-semibold text-[14px] active:opacity-50 disabled:opacity-50 px-2 py-1"
            >
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Post"}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
