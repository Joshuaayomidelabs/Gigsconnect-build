import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, MessageSquare, Briefcase, Image as ImageIcon } from 'lucide-react';
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
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-[101] max-w-[600px] mx-auto bg-white dark:bg-[#1a1a1a] rounded-t-[32px] sm:rounded-[32px] sm:bottom-auto sm:top-1/2 sm:-translate-y-1/2 sm:initial={{ scale: 0.95, opacity: 0, y: '-50%', x: '-50%' }} sm:animate={{ scale: 1, opacity: 1, y: '-50%', x: '-50%', left: '50%' }} sm:exit={{ scale: 0.95, opacity: 0, y: '-50%', x: '-50%' }} shadow-2xl p-6 pb-safe"
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
                  <span className="font-bold text-[16px] text-gray-900 dark:text-white mb-0.5">Offer a service</span>
                  <span className="text-[14px] text-gray-500 dark:text-gray-400">Skills, jobs, opportunities</span>
                </div>
              </button>

              {/* OPTIONAL FUTURE SECTION */}
              <div
                className="flex items-center gap-4 p-4 rounded-[20px] bg-gray-50 dark:bg-[#111111] border border-transparent opacity-60 text-left mt-2"
              >
                <div className="w-14 h-14 rounded-[14px] bg-gray-200 dark:bg-[#2a2a2a] flex items-center justify-center shrink-0">
                  <ImageIcon className="w-7 h-7 text-gray-400 dark:text-gray-600" />
                </div>
                <div className="flex flex-col flex-1">
                  <span className="font-bold text-[16px] text-gray-900 dark:text-gray-400 mb-0.5">Upload Media</span>
                  <span className="text-[14px] text-gray-500">Coming soon</span>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
