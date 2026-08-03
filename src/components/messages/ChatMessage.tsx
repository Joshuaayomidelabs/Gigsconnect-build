import React from 'react';
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
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message, isMe, showAvatar, otherUserAvatar, otherUserInitial }) => {
  const timeString = format(new Date(message.created_at), 'h:mm a');
  const isDeleted = message.is_deleted; 
  const status = message.local_status; // sent, delivered, read

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
          className={`px-4 py-2.5 rounded-2xl ${
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
