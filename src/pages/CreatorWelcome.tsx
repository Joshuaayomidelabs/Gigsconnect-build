import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { CheckCircle2, ArrowRight, Loader2 } from 'lucide-react';
import { profilesService } from '../services/profilesService';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';
import { notifyError } from '../utils/errorHandler';

const CreatorWelcome: React.FC = () => {
  const { refreshProfile } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleContinue = async () => {
    setIsLoading(true);
    try {
      await profilesService.updateProfile({ 
        onboarding_completed: true,
        onboarding_progress: 100 
      });
      await refreshProfile();
      navigate('/overview', { replace: true });
    } catch (err: any) {
      console.error('Error completing onboarding:', err);
      notifyError('Failed to complete setup. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-gray dark:bg-brand-black flex flex-col pt-24 md:pt-32 pb-16 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-[1200px] mx-auto w-full flex flex-col items-center">
        <div className="w-full max-w-md">
          <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="bg-white dark:bg-brand-dark-card rounded-3xl p-8 sm:p-10 shadow-xl border border-gray-100 dark:border-gray-800 text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
            className="w-24 h-24 rounded-full bg-green-500/10 text-green-500 mx-auto flex items-center justify-center mb-6"
          >
            <CheckCircle2 className="w-12 h-12" />
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-3xl font-bold text-brand-black dark:text-brand-white mb-4 tracking-tight"
          >
            Welcome to GigsConnect.
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-gray-500 dark:text-gray-400 text-lg mb-10"
          >
            Your creator profile is ready. You can now discover local gigs, collaborate with others, and showcase your skills.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <button
              onClick={handleContinue}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-lg bg-brand-purple text-white hover:bg-brand-purple-hover hover:shadow-brand-purple/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <>
                  Go to Dashboard
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </motion.div>
        </motion.div>
        </div>
      </div>
    </div>
  );
};

export default CreatorWelcome;
