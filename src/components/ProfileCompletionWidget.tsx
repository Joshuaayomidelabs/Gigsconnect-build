import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CheckCircle2, 
  Circle, 
  ChevronRight, 
  ChevronDown, 
  ChevronUp, 
  Image as ImageIcon, 
  FileText, 
  LayoutGrid, 
  Award, 
  MapPin, 
  Briefcase, 
  Link as LinkIcon, 
  BadgeCheck 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ProfileCompletionWidgetProps {
  profile: any;
  onOpenPortfolio?: () => void;
}

const ProfileCompletionWidget: React.FC<ProfileCompletionWidgetProps> = ({ profile, onOpenPortfolio }) => {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);

  if (!profile) return null;

  // Define the fields to check
  const checks = [
    { id: 'avatar', label: 'Profile Photo', icon: ImageIcon, isComplete: !!profile.avatar_url, route: '/edit-profile' },
    { id: 'bio', label: 'Bio', icon: FileText, isComplete: !!profile.bio && profile.bio.trim().length > 0, route: '/edit-profile' },
    { id: 'categories', label: 'Categories', icon: LayoutGrid, isComplete: profile.categories_count > 0 || (profile.categories && profile.categories.length > 0), route: '/creator-categories' },
    { id: 'skills', label: 'Skills', icon: Award, isComplete: profile.skills_count > 0 || (profile.skills && profile.skills.length > 0), route: '/creator-skills' },
    { id: 'location', label: 'Location', icon: MapPin, isComplete: !!profile.country && (!!profile.city_town || !!profile.city), route: '/creator-location' },
    { id: 'portfolio', label: 'Portfolio', icon: Briefcase, isComplete: profile.portfolio_media && profile.portfolio_media.length > 0, action: 'open-portfolio' },
    { id: 'socials', label: 'Social Links', icon: LinkIcon, isComplete: !!profile.instagram_url || !!profile.twitter_url || !!profile.tiktok_url || !!profile.facebook_url || !!profile.linkedin_url, route: '/edit-profile' },
    { id: 'verification', label: 'Verification', icon: BadgeCheck, isComplete: profile.verification_status === 'approved' || profile.verification_status === 'pending', route: '/edit-profile' },
  ];

  const completedCount = checks.filter(c => c.isComplete).length;
  const totalCount = checks.length;
  const percentage = Math.round((completedCount / totalCount) * 100);

  // Hide if fully completed
  if (percentage === 100) return null; 

  const nextAction = checks.find(c => !c.isComplete);

  const handleActionClick = (check: any) => {
    if (check.route) {
      navigate(check.route);
    } else if (check.action === 'open-portfolio') {
      if (onOpenPortfolio) {
        onOpenPortfolio();
      }
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-brand-dark-card rounded-2xl sm:rounded-3xl border border-gray-150 dark:border-gray-800 shadow-sm mt-4 sm:mt-6 mb-6 overflow-hidden"
    >
      {/* 1. Collapsed Single-Line Summary */}
      <div 
        onClick={() => setIsExpanded(prev => !prev)}
        className="flex items-center justify-between gap-3 p-3.5 sm:p-4 cursor-pointer select-none hover:bg-gray-50/70 dark:hover:bg-brand-purple/5 transition-colors"
        role="button"
        tabIndex={0}
        aria-expanded={isExpanded}
      >
        <div className="flex items-center gap-2.5 sm:gap-4 min-w-0 flex-1">
          {/* Progress Bar & Percentage */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="w-16 sm:w-24 bg-gray-100 dark:bg-gray-800 rounded-full h-2 overflow-hidden shrink-0">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${percentage}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="bg-gradient-to-r from-brand-purple to-indigo-500 h-full rounded-full"
              />
            </div>
            <span className="text-xs font-black text-brand-purple bg-brand-purple/10 px-1.5 py-0.5 rounded">
              {percentage}%
            </span>
          </div>

          {/* Next suggested step */}
          {nextAction && (
            <div className="flex items-center gap-1.5 text-xs text-brand-black dark:text-brand-white min-w-0 truncate">
              <span className="text-gray-400 dark:text-gray-500 hidden sm:inline">Next:</span>
              <span className="font-bold truncate text-brand-purple">
                Add {nextAction.label}
              </span>
            </div>
          )}
        </div>

        {/* Expand / Collapse Indicator */}
        <div className="flex items-center gap-1.5 text-gray-400 text-xs font-semibold shrink-0">
          <span className="text-[11px] text-gray-500 hidden sm:inline">{isExpanded ? 'Collapse' : 'Checklist'}</span>
          {isExpanded ? (
            <ChevronUp className="w-4 h-4 text-brand-purple" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-400" />
          )}
        </div>
      </div>

      {/* 2. Expanded Checklist Section */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="border-t border-gray-100 dark:border-gray-800 px-4 sm:px-6 pb-5 pt-4 bg-[#FAF9FD]/50 dark:bg-transparent"
          >
            {nextAction && (
              <div 
                onClick={(e) => {
                  e.stopPropagation();
                  handleActionClick(nextAction);
                }}
                className="flex items-center justify-between p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-brand-black hover:bg-brand-purple/5 dark:hover:bg-brand-purple/10 border border-brand-purple/20 cursor-pointer transition-all active:scale-[0.98] group mb-4 shadow-sm"
              >
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-brand-purple/10 flex items-center justify-center text-brand-purple shadow-sm shrink-0">
                    <nextAction.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] sm:text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-0.5">Next suggested step</p>
                    <p className="text-xs sm:text-sm font-bold text-brand-black dark:text-brand-white group-hover:text-brand-purple transition-colors">Add your {nextAction.label}</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-brand-purple transition-colors shrink-0" />
              </div>
            )}

            <div>
              <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                Checklist ({completedCount}/{totalCount})
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
                {checks.map(check => (
                  <div 
                    key={check.id}
                    onClick={(e) => {
                      if (!check.isComplete) {
                        e.stopPropagation();
                        handleActionClick(check);
                      }
                    }}
                    className={`flex items-center gap-2 text-xs p-2.5 rounded-xl transition-colors ${
                      check.isComplete 
                        ? 'text-gray-400 dark:text-gray-500 bg-white/60 dark:bg-gray-900/40 border border-gray-100 dark:border-gray-800/60' 
                        : 'text-brand-black dark:text-brand-white hover:text-brand-purple bg-white dark:bg-brand-black border border-gray-200 dark:border-gray-800 hover:border-brand-purple/30 cursor-pointer font-bold shadow-xs'
                    }`}
                  >
                    {check.isComplete ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    ) : (
                      <Circle className="w-4 h-4 text-gray-300 dark:text-gray-600 shrink-0" />
                    )}
                    <span className="truncate">{check.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ProfileCompletionWidget;
