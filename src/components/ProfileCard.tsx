import React from 'react';
import { CheckCircle, Shield } from 'lucide-react';

interface ProfileCardProps {
  profile: any;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ profile }) => {
  const isPremium = profile?.subscription_plan === 'premium';
  const isPro = profile?.subscription_plan === 'pro' || isPremium;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] p-6 shadow-md border border-gray-200 dark:border-gray-700 flex flex-col items-center text-center transition-colors">
      <div className="relative mb-4">
        <div className="w-20 h-20 rounded-full bg-blue-50 dark:bg-blue-900/20 border-4 border-white dark:border-gray-800 overflow-hidden shadow-md">
          {profile?.avatar_url ? (
            <img src={profile.avatar_url} alt={profile.full_name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-blue-600 dark:text-blue-400 font-black text-2xl">
              {profile?.full_name?.charAt(0).toUpperCase() || 'U'}
            </div>
          )}
        </div>
        {isPro && (
          <div className="absolute -bottom-1 -right-1 bg-blue-500 dark:bg-blue-400 text-white dark:text-gray-900 p-1.5 rounded-full border-2 border-white dark:border-gray-800 shadow-sm">
            {isPremium ? <Shield className="w-3 h-3" /> : <CheckCircle className="w-3 h-3" />}
          </div>
        )}
      </div>
      
      <div className="mb-4">
        <h3 className="text-xl font-black text-gray-900 dark:text-gray-100 leading-tight mb-1">{profile?.full_name || 'Anonymous User'}</h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-widest">{profile?.role || 'Member'}</p>
      </div>

      <div className="flex flex-wrap justify-center gap-1.5">
        {profile?.skills?.slice(0, 3).map((skill: string, i: number) => (
          <span key={i} className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-[10px] font-bold rounded-full border border-gray-200 dark:border-gray-600">
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
};

export default ProfileCard;
