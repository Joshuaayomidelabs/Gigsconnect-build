import React, { useState, useRef, useEffect, useCallback, lazy, Suspense } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import { Smile, Plus, Send, Check } from 'lucide-react';
import { AttachmentMenu } from './AttachmentMenu';
import { motion, AnimatePresence } from 'motion/react';

const EmojiPicker = lazy(() => import('emoji-picker-react'));

interface RichComposerProps {
  conversationId: string;
  onSend: (text: string) => Promise<void>;
  sending: boolean;
}

export const RichComposer: React.FC<RichComposerProps> = ({ conversationId, onSend, sending }) => {
  const [text, setText] = useState('');
  const [showEmoji, setShowEmoji] = useState(false);
  const [showAttachment, setShowAttachment] = useState(false);
  const [justSent, setJustSent] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  
  const MAX_CHARS = 5000;
  const WARN_CHARS = 4500;

  // Load draft
  useEffect(() => {
    if (!conversationId) return;
    const draft = localStorage.getItem(`chat_draft_${conversationId}`);
    if (draft) {
      setText(draft);
    } else {
      setText('');
    }
  }, [conversationId]);

  // Save draft debounced
  useEffect(() => {
    if (!conversationId) return;
    const timer = setTimeout(() => {
      if (text.trim()) {
        localStorage.setItem(`chat_draft_${conversationId}`, text);
      } else {
        localStorage.removeItem(`chat_draft_${conversationId}`);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [text, conversationId]);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!text.trim() || sending) return;

    const content = text.trim();
    if (content.length > MAX_CHARS) return;

    try {
      await onSend(content);
      setText('');
      localStorage.removeItem(`chat_draft_${conversationId}`);
      setShowEmoji(false);
      setJustSent(true);
      setTimeout(() => setJustSent(false), 1500);
    } catch (err) {
      // Handled by parent, keep text
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const onEmojiClick = (emojiObj: any) => {
    const cursor = inputRef.current?.selectionStart || text.length;
    const newText = text.slice(0, cursor) + emojiObj.emoji + text.slice(cursor);
    setText(newText);
    // Focus back and move cursor
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
        const newCursor = cursor + emojiObj.emoji.length;
        inputRef.current.setSelectionRange(newCursor, newCursor);
      }
    }, 10);
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    // Paste logic for images/videos in future
    const items = e.clipboardData.items;
    let hasMedia = false;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1 || items[i].type.indexOf('video') !== -1) {
        hasMedia = true;
        // In the future: prepare attachment preview
        break;
      }
    }
    if (hasMedia) {
      // e.preventDefault(); 
      // handle media...
    }
  };

  return (
    <div className="relative bg-brand-white dark:bg-brand-dark-card border-t border-gray-200 dark:border-gray-800 p-2 sm:p-4 pb-safe sm:pb-4 z-20">
      
      {/* Remaining Chars Warning */}
      {text.length > WARN_CHARS && (
        <div className={`text-xs px-2 mb-1 text-right ${text.length > MAX_CHARS ? 'text-red-500' : 'text-gray-500'}`}>
          {MAX_CHARS - text.length}
        </div>
      )}

      {/* Emoji Picker Popover */}
      {showEmoji && (
        <div className="absolute bottom-full left-2 mb-2 z-50">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-200 dark:border-gray-800 overflow-hidden" style={{ width: '320px', height: '400px' }}>
            <Suspense fallback={<div className="flex items-center justify-center h-full text-gray-500">Loading emojis...</div>}>
              <EmojiPicker 
                onEmojiClick={onEmojiClick}
                autoFocusSearch={false}
                width="100%"
                height="100%"
                previewConfig={{ showPreview: false }}
              />
            </Suspense>
          </div>
        </div>
      )}

      {/* Attachment Menu */}
      <div className="relative">
        <AttachmentMenu isOpen={showAttachment} onClose={() => setShowAttachment(false)} />
      </div>

      <form onSubmit={handleSubmit} className="flex items-end gap-2 max-w-4xl mx-auto">
        <button
          type="button"
          onClick={() => {
            setShowAttachment(!showAttachment);
            setShowEmoji(false);
          }}
          className="p-2 sm:p-3 text-gray-500 hover:text-brand-purple hover:bg-brand-purple/10 rounded-full transition-colors shrink-0 mb-0.5"
        >
          <Plus className="w-6 h-6" />
        </button>

        <div className="flex-1 relative bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-end overflow-hidden border border-transparent focus-within:border-brand-purple/50 transition-colors">
          <button
            type="button"
            onClick={() => {
              setShowEmoji(!showEmoji);
              setShowAttachment(false);
            }}
            className="p-3 text-gray-500 hover:text-brand-purple transition-colors shrink-0"
          >
            <Smile className="w-6 h-6" />
          </button>
          
          <TextareaAutosize
            ref={inputRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            onPaste={handlePaste}
            onFocus={() => {
              setShowEmoji(false);
              setShowAttachment(false);
            }}
            maxRows={6}
            placeholder="Message..."
            className="w-full bg-transparent border-none outline-none resize-none py-3 pr-4 text-brand-black dark:text-brand-white placeholder:text-gray-500 leading-relaxed"
          />
        </div>

        <AnimatePresence mode="popLayout">
            <motion.button
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              type="submit"
              disabled={sending || text.length > MAX_CHARS || text.trim().length === 0}
              className={`p-3 rounded-full transition-colors shrink-0 flex items-center justify-center h-12 w-12 mb-0.5
                ${justSent 
                  ? 'bg-green-500 text-white' 
                  : (sending || !text.trim() || text.length > MAX_CHARS)
                    ? 'bg-gray-200 dark:bg-gray-800 text-gray-400 cursor-not-allowed'
                    : 'bg-brand-purple text-white hover:bg-brand-purple/90 shadow-soft'
                }
              `}
            >
              {justSent ? (
                <Check className="w-6 h-6" />
              ) : (
                <Send className="w-5 h-5 -ml-0.5" />
              )}
            </motion.button>
        </AnimatePresence>
      </form>
    </div>
  );
};
