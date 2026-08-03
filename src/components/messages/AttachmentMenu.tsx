import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Image, Camera, Video, FileText, MapPin, User, X } from 'lucide-react';

interface AttachmentMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AttachmentMenu: React.FC<AttachmentMenuProps> = ({ isOpen, onClose }) => {
  const options = [
    { id: 'photo', icon: Image, label: 'Photo Library', desc: 'Send photos from your gallery', color: 'bg-blue-500' },
    { id: 'camera', icon: Camera, label: 'Camera', desc: 'Take a new photo', color: 'bg-indigo-500' },
    { id: 'video', icon: Video, label: 'Video', desc: 'Send a video', color: 'bg-pink-500' },
    { id: 'document', icon: FileText, label: 'Document', desc: 'Send a file', color: 'bg-purple-500' },
    { id: 'location', icon: MapPin, label: 'Location', desc: 'Share your location', color: 'bg-green-500' },
    { id: 'contact', icon: User, label: 'Contact', desc: 'Share a contact', color: 'bg-orange-500' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/20 dark:bg-black/40 sm:bg-transparent"
          />
          <motion.div 
            initial={{ opacity: 0, y: '100%', scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: '100%', scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="absolute bottom-full left-0 sm:left-4 right-0 sm:right-auto sm:w-80 mb-2 bg-brand-white dark:bg-brand-dark-card rounded-t-2xl sm:rounded-2xl shadow-xl border-t sm:border border-gray-200 dark:border-gray-800 z-50 overflow-hidden"
          >
            <div className="p-4 flex flex-col gap-2">
              <div className="flex items-center justify-between mb-2 sm:hidden">
                <h3 className="font-bold text-brand-black dark:text-brand-white">Attachments</h3>
                <button onClick={onClose} className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              <div className="grid grid-cols-1 gap-1">
                {options.map(opt => (
                  <button 
                    key={opt.id}
                    onClick={() => {
                      // Attachments are not fully built yet, just close
                      onClose();
                    }}
                    className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-left"
                  >
                    <div className={`w-10 h-10 rounded-full ${opt.color} flex items-center justify-center shrink-0`}>
                      <opt.icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="font-medium text-brand-black dark:text-brand-white text-sm">{opt.label}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">{opt.desc}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
