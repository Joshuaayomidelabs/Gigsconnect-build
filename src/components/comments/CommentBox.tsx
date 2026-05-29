import React, { useState, useEffect, useRef } from 'react';
import { Loader2 } from 'lucide-react';
import { profilesService } from '../../services/profilesService';
import { useMentions } from '../../hooks/useMentions';

interface CommentBoxProps {
  postId: string;
  user: any;
  onSubmit: (text: string, parentId?: string | null) => Promise<void>;
  replyTo?: { id: string; name: string } | null;
  onCancelReply?: () => void;
  inputRef?: React.RefObject<HTMLTextAreaElement>;
}

export function CommentBox({ postId, user, onSubmit, replyTo, onCancelReply, inputRef: externalInputRef }: CommentBoxProps) {
  const [text, setText] = useState("");
  const [cursorPos, setCursorPos] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  
  const fallbackRef = useRef<HTMLTextAreaElement>(null);
  const textAreaRef = (externalInputRef as any) || fallbackRef;

  const { mentionState, results, loading } = useMentions(text, cursorPos);

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

  const handleSelectMention = (username: string) => {
    if (!mentionState) return;
    const newText = text.slice(0, mentionState.start) + '@' + username + ' ' + text.slice(mentionState.end);
    setText(newText);
    
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || !user || isSubmitting) return;

    setIsSubmitting(true);
    await onSubmit(text.trim(), replyTo?.id);
    setText("");
    setIsSubmitting(false);
  };

  return (
    <div className="px-3 sm:px-4 pb-4 pt-1 flex flex-col gap-2 relative">
      {mentionState && results.length > 0 && (
        <div className="absolute bottom-[100%] left-[44px] sm:left-[56px] w-64 bg-white dark:bg-[#1A1A1E] border border-gray-200 dark:border-[#2A2A2F] rounded-xl shadow-xl z-50 mb-2 overflow-hidden animate-in fade-in slide-in-from-bottom-2">
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

      {replyTo && (
        <div className="flex items-center justify-between bg-brand-gray/10 dark:bg-[#1F1F23]/50 px-3 py-1.5 rounded-md text-[13px] text-gray-600 dark:text-gray-300">
          <span>Replying to <span className="font-semibold">{replyTo.name}</span></span>
          <button type="button" onClick={onCancelReply} className="font-bold hover:text-brand-purple">✕</button>
        </div>
      )}
      <form onSubmit={handleSubmit} className="flex gap-3 items-start relative">
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
            ref={textAreaRef}
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              e.target.style.height = 'auto';
              e.target.style.height = e.target.scrollHeight + 'px';
            }}
            onKeyUp={(e: any) => setCursorPos(e.target.selectionStart)}
            onClick={(e: any) => setCursorPos(e.target.selectionStart)}
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
