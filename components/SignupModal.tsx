import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface SignupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SignupModal: React.FC<SignupModalProps> = ({ isOpen, onClose }) => {
  useEffect(() => {
    if (isOpen) {
      // Prevent scrolling on the body when modal is open
      document.body.style.overflow = 'hidden';
      
      // Load Youform script if it's not already loaded
      if (!document.querySelector('script[src="https://app.youform.com/js/embed.js"]')) {
        const script = document.createElement('script');
        script.src = 'https://app.youform.com/js/embed.js';
        script.async = true;
        document.body.appendChild(script);
      } else {
        // If script is already loaded, we might need to re-initialize it
        // Youform usually auto-initializes elements with data-youform-embed
        if (window.youform) {
          window.youform.init();
        }
      }
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>
      
      {/* Modal Content */}
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-white z-10">
          <h2 className="text-xl font-bold text-linktree-dark ml-2">Sign up for GigsConnect</h2>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-500 hover:text-black"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        {/* Form Container */}
        <div className="flex-1 overflow-y-auto w-full bg-gray-50">
          <div 
            data-youform-embed 
            data-form="ipkyc9tu" 
            data-base-url="https://app.youform.com" 
            data-width="100%" 
            data-height="700"
          ></div>
        </div>
      </div>
    </div>
  );
};

// Add type definition for window.youform if needed
declare global {
  interface Window {
    youform?: {
      init: () => void;
    };
  }
}

export default SignupModal;
