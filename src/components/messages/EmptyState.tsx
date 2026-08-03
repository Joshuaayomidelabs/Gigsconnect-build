import React from 'react';
import { MessageSquare } from 'lucide-react';
import { motion } from 'motion/react';

export const EmptyState: React.FC = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-20 px-4 text-center"
    >
      <div className="w-20 h-20 bg-brand-gray dark:bg-brand-dark-card rounded-[2rem] flex items-center justify-center mb-6 border border-gray-200 dark:border-gray-800">
        <MessageSquare className="w-10 h-10 text-gray-400" />
      </div>
      <h3 className="text-xl font-bold text-brand-black dark:text-brand-white mb-2">No conversations yet</h3>
      <p className="text-gray-500 dark:text-gray-400 max-w-[280px]">
        When you connect with other creators or apply to gigs, your messages will appear here.
      </p>
    </motion.div>
  );
};
