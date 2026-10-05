import React, { useState } from 'react';
import { Message } from '../../services/messagesService';
import { format, isSameDay } from 'date-fns';
import { motion } from 'motion/react';
import { Trash2, Check, CheckCheck } from 'lucide-react';
import Linkify from 'linkify-react';

interface ChatMessageProps {
  message: Message;
  isMe: boolean;
  showAvatar: boolean;
  otherUserAvatar?: string;
  otherUserInitial?: string;
  onDelete?: (messageId: string) => void;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ 
  message, 
  isMe, 
  showAvatar, 
  otherUserAvatar, 
  otherUserInitial,
  onDelete
}) => {
  const [showActions, setShowActions] = useState(false);
  const [confirming, setConfirming] = useState(false);

  const timeString = format(new Date(message.created_at), 'h:mm a');
  const isDeleted = message.is_deleted; 
  const status = message.local_status; // sent, delivered, read
  const canDelete = isMe && !isDeleted && !!onDelete && !message.id.startsWith('temp_');

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex ${isMe ? 'justify-end' : 'justify-start'} mb-4`}
    >
      {!isMe && (
        <div className="w-8 h-8 mr-2 shrink-0 flex items-end">
          {showAvatar && (
            otherUserAvatar ? (
              <img src={otherUserAvatar} alt="" className="w-8 h-8 rounded-full object-cover" />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
                <span className="text-xs font-bold text-gray-500">{otherUserInitial || '?'}</span>
              </div>
            )
          )}
        </div>
      )}
      <div className={`max-w-[75%] flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
        <div 
          onClick={() => {
            if (canDelete) {
              setShowActions(prev => {
                if (prev) setConfirming(false);
                return !prev;
              });
            }
          }}
          className={`px-4 py-2.5 rounded-2xl ${canDelete ? 'cursor-pointer' : ''} ${
            isDeleted 
              ? 'bg-gray-100 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400 italic border border-gray-200 dark:border-gray-800'
              : isMe 
                ? 'bg-brand-purple text-white rounded-br-sm' 
                : 'bg-brand-white dark:bg-brand-dark-card border border-gray-200 dark:border-gray-800 text-brand-black dark:text-brand-white rounded-bl-sm shadow-sm sm:shadow-none'
          }`}
        >
          {isDeleted ? (
            <div className="flex items-center gap-2 text-sm">
              <Trash2 className="w-4 h-4 opacity-50" />
              <span>This message was deleted</span>
            </div>
          ) : (
            <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
              <Linkify options={{
                className: isMe ? 'underline underline-offset-2' : 'text-brand-purple dark:text-brand-purple hover:underline underline-offset-2',
                target: '_blank'
              }}>
                {message.content}
              </Linkify>
            </p>
          )}
        </div>

        {showActions && canDelete && (
          <div className="flex items-center gap-1.5 mt-1.5">
            {!confirming ? (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setConfirming(true);
                }}
                className="flex items-center gap-1 text-xs text-red-500 hover:text-red-600 font-medium px-2 py-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            ) : (
              <div className="flex items-center gap-2 text-xs bg-brand-white dark:bg-brand-dark-card border border-gray-200 dark:border-gray-800 rounded-xl px-2.5 py-1 shadow-xs">
                <span className="text-gray-500 dark:text-gray-400">Delete for everyone?</span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete?.(message.id);
                    setShowActions(false);
                    setConfirming(false);
                  }}
                  className="text-red-600 hover:text-red-700 font-bold px-1.5 py-0.5 rounded hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer"
                >
                  Delete
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowActions(false);
                    setConfirming(false);
                  }}
                  className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 font-medium px-1.5 py-0.5 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        )}

        <div className="flex items-center gap-1.5 mt-1 mx-1">
          <span className="text-[10px] text-gray-400 font-medium">{timeString}</span>
          {!isDeleted && message.edited_at && (
            <span className="text-[10px] text-gray-400 italic">(edited)</span>
          )}
          {isMe && !isDeleted && (
            <span className="flex items-center text-gray-400">
              {status === 'sent' && <Check className="w-3 h-3" />}
              {status === 'delivered' && <CheckCheck className="w-3 h-3" />}
              {status === 'read' && <CheckCheck className="w-3 h-3 text-brand-purple dark:text-brand-purple" />}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};
