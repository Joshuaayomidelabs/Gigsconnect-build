import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Image as ImageIcon, Video, Mic, FileText, Briefcase, Music } from 'lucide-react';
import VerificationBadge from '../VerificationBadge';
import { PremiumBadge } from '../PremiumBadge';
import { ConversationInboxItem } from '../../services/messagesService';
import { formatDistanceToNow } from 'date-fns';

interface ConversationCardProps {
  conversation: ConversationInboxItem;
}

export const ConversationCard: React.FC<ConversationCardProps> = ({ conversation }) => {
  const navigate = useNavigate();

  const getMessageIcon = (type: string) => {
    switch (type) {
      case 'image': return <ImageIcon className="w-4 h-4" />;
      case 'video': return <Video className="w-4 h-4" />;
      case 'voice': return <Mic className="w-4 h-4" />;
      case 'document': return <FileText className="w-4 h-4" />;
      case 'portfolio': return <Briefcase className="w-4 h-4" />;
      case 'gig': return <Music className="w-4 h-4" />;
      default: return null;
    }
  };

  const formattedTime = conversation.updated_at 
    ? formatDistanceToNow(new Date(conversation.updated_at), { addSuffix: true })
    : '';

  return (
    <motion.button
      whileHover={{ scale: 0.99 }}
      whileTap={{ scale: 0.97 }}
      onClick={() => navigate(`/messages/${conversation.conversation_id}`)}
      layout
      className="w-full flex items-center p-4 bg-brand-white dark:bg-brand-dark-card hover:bg-gray-50 dark:hover:bg-[#1A1A1E] transition-colors rounded-2xl border border-transparent hover:border-gray-200 dark:hover:border-gray-800 text-left"
    >
      <div className="relative shrink-0">
        {conversation.avatar_url ? (
          <img 
            src={conversation.avatar_url} 
            alt={conversation.full_name} 
            className="w-14 h-14 rounded-full object-cover"
          />
        ) : (
          <div className="w-14 h-14 rounded-full bg-brand-gray dark:bg-gray-800 flex items-center justify-center">
            <span className="text-xl font-bold text-gray-500">
              {conversation.full_name?.charAt(0)?.toUpperCase() || '?'}
            </span>
          </div>
        )}
        {conversation.unread_count > 0 && (
          <motion.div 
            initial={{ scale: 0 }} 
            animate={{ scale: 1 }} 
            className="absolute -top-1 -right-1 w-5 h-5 bg-brand-purple rounded-full border-2 border-white dark:border-brand-black flex items-center justify-center"
          >
            <span className="text-[10px] font-bold text-white">
              {conversation.unread_count > 99 ? '99+' : conversation.unread_count}
            </span>
          </motion.div>
        )}
      </div>

      <div className="ml-4 flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-1.5 truncate">
            <h3 className="font-bold text-brand-black dark:text-brand-white truncate">
              {conversation.full_name}
            </h3>
            {conversation.is_verified && <VerificationBadge />}
            {conversation.subscription_tier === 'pro' && <PremiumBadge />}
          </div>
          <span className="text-xs text-gray-500 shrink-0 ml-2">
            {formattedTime}
          </span>
        </div>
        
        <div className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
          <span className="shrink-0">
            {getMessageIcon(conversation.message_type)}
          </span>
          <span className={`truncate ${conversation.unread_count > 0 ? 'font-bold text-brand-black dark:text-white' : ''}`}>
            {conversation.message_type !== 'text' && !conversation.last_message
              ? `Sent a ${conversation.message_type}`
              : conversation.last_message}
          </span>
        </div>
      </div>
    </motion.button>
  );
};
