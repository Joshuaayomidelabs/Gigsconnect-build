import React from 'react';
import { MessageCircle, Lock, ArrowLeft, Compass } from 'lucide-react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';

const Messages: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="pt-24 pb-24 px-4 sm:px-6 lg:px-8 min-h-screen bg-brand-gray dark:bg-brand-black flex items-center justify-center">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-white dark:bg-brand-dark-card rounded-[2.5rem] p-8 sm:p-12 shadow-soft border border-brand-gray dark:border-brand-black text-center"
      >
        <div className="w-20 h-20 bg-brand-purple/10 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-brand-purple/10">
          <Lock className="w-10 h-10 text-brand-purple" />
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-brand-black dark:text-brand-white tracking-tight mb-4 leading-tight">
          This service is not yet available in your country.
        </h1>
        
        <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base font-medium mb-10 leading-relaxed">
          We're working to bring this feature to your region soon. Stay tuned for updates!
        </p>

        <div className="flex flex-col gap-3">
          <button 
            onClick={() => navigate('/browse')}
            className="w-full py-4 bg-brand-purple text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-brand-purple-dark hover:shadow-glow transition-all active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <Compass className="w-4 h-4" />
            Explore Gigs
          </button>
          
          <button 
            onClick={() => navigate(-1)}
            className="w-full py-4 bg-brand-gray dark:bg-brand-black text-brand-black dark:text-brand-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-brand-gray-dark dark:hover:bg-brand-gray-dark/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2 border border-brand-gray dark:border-brand-black"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
        </div>

        <div className="mt-10 pt-8 border-t border-brand-gray dark:border-brand-black">
          <div className="flex items-center justify-center gap-2 text-brand-purple/40">
            <MessageCircle className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">GigsConnect Messenger</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Messages;

