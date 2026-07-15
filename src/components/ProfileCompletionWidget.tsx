import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, Circle, ChevronRight, Image as ImageIcon, FileText, LayoutGrid, Award, MapPin, Briefcase, Link as LinkIcon, BadgeCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ProfileCompletionWidgetProps {
  profile: any;
  onOpenPortfolio?: () => void;
}

const ProfileCompletionWidget: React.FC<ProfileCompletionWidgetProps> = ({ profile, onOpenPortfolio }) => {
  const navigate = useNavigate();

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
      className="bg-white dark:bg-brand-dark-card rounded-3xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm mt-6 mb-6"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-bold text-brand-black dark:text-brand-white">Profile Completion</h3>
        <span className="text-sm font-black text-brand-purple bg-brand-purple/10 px-2 py-0.5 rounded-md">{percentage}%</span>
      </div>
      
      {/* Progress Bar */}
      <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2.5 mb-6 overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="bg-gradient-to-r from-brand-purple to-indigo-500 h-full rounded-full"
        />
      </div>

      {nextAction && (
        <div 
          onClick={() => handleActionClick(nextAction)}
          className="flex items-center justify-between p-4 rounded-2xl bg-brand-purple/5 hover:bg-brand-purple/10 border border-brand-purple/10 cursor-pointer transition-all active:scale-[0.98] group"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-white dark:bg-brand-black flex items-center justify-center text-brand-purple shadow-sm">
              <nextAction.icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-0.5">Next suggested step</p>
              <p className="text-sm font-bold text-brand-black dark:text-brand-white group-hover:text-brand-purple transition-colors">Add your {nextAction.label}</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-brand-purple transition-colors" />
        </div>
      )}

      <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-800">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {checks.map(check => (
            <div 
              key={check.id}
              onClick={() => !check.isComplete && handleActionClick(check)}
              className={`flex items-center gap-2.5 text-xs ${check.isComplete ? 'text-gray-400 dark:text-gray-500' : 'text-brand-black dark:text-brand-white hover:text-brand-purple transition-colors cursor-pointer'}`}
            >
              {check.isComplete ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              ) : (
                <Circle className="w-4 h-4 text-gray-300 dark:text-gray-600 shrink-0" />
              )}
              <span className="font-bold truncate">{check.label}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default ProfileCompletionWidget;
