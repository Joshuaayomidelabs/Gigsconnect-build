const fs = require('fs');
const content = `import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, MessageSquare, Briefcase } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface CreateHubModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateHubModal({ isOpen, onClose }: CreateHubModalProps) {
  const navigate = useNavigate();

  const handleNavigate = (mode: string) => {
    onClose();
    // In a real app we'd likely open different routes, for now we pass mode to /post
    setTimeout(() => {
      navigate('/post', { state: { initialMode: mode } });
    }, 150);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[100] bg-black/60 dark:bg-black/80 backdrop-blur-sm"
          />
          <div className="fixed inset-0 z-[101] flex items-end sm:items-center justify-center pointer-events-none p-0 sm:p-4">
            <motion.div
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="w-full max-w-[600px] bg-white dark:bg-[#1a1a1a] rounded-t-[32px] sm:rounded-[32px] shadow-2xl p-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))] sm:pb-6 pointer-events-auto border border-transparent dark:border-brand-dark-card"
            >
              <div className="w-12 h-1.5 bg-gray-200 dark:bg-[#2a2a2a] rounded-full mx-auto mb-6 sm:hidden" />
              
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-[22px] font-black text-gray-900 dark:text-white">Create</h2>
                <button 
                  onClick={onClose}
                  className="p-2 rounded-full bg-gray-100 dark:bg-[#2a2a2a] text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex flex-col gap-3 mb-4">
                {/* SECTION 1: COMMUNITY */}
                <button
                  onClick={() => handleNavigate('post')}
                  className="flex items-center gap-4 p-4 rounded-[20px] bg-white dark:bg-[#1a1a1a] border border-gray-100 dark:border-[#2a2a2a] shadow-sm hover:shadow-md hover:border-[#4B0082]/30 dark:hover:border-[#4B0082]/50 transition-all text-left group"
                >
                  <div className="w-14 h-14 rounded-[14px] bg-[#4B0082]/10 dark:bg-[#4B0082]/20 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <MessageSquare className="w-7 h-7 text-[#4B0082] dark:text-[#b088f5]" />
                  </div>
                  <div className="flex flex-col flex-1">
                    <span className="font-bold text-[16px] text-gray-900 dark:text-white mb-0.5">Share with your community</span>
                    <span className="text-[14px] text-gray-500 dark:text-gray-400">Text, thoughts, updates</span>
                  </div>
                </button>

                {/* SECTION 2: MARKETPLACE */}
                <button
                  onClick={() => handleNavigate('gig')}
                  className="flex items-center gap-4 p-4 rounded-[20px] bg-white dark:bg-[#1a1a1a] border border-gray-100 dark:border-[#2a2a2a] shadow-sm hover:shadow-md hover:border-[#4B0082]/30 dark:hover:border-[#4B0082]/50 transition-all text-left group"
                >
                  <div className="w-14 h-14 rounded-[14px] bg-[#4B0082]/10 dark:bg-[#4B0082]/20 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <Briefcase className="w-7 h-7 text-[#4B0082] dark:text-[#b088f5]" />
                  </div>
                  <div className="flex flex-col flex-1">
                    <span className="font-bold text-[16px] text-gray-900 dark:text-white mb-0.5">Offer a skill, job or opportunity</span>
                    <span className="text-[14px] text-gray-500 dark:text-gray-400">Post a gig to the marketplace</span>
                  </div>
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
`;
fs.writeFileSync('src/components/CreateHubModal.tsx', content, 'utf-8');
console.log('Rewrote CreateHubModal completely');
