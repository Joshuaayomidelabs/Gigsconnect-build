import React from 'react';
import { CheckCircle, Shield } from 'lucide-react';

interface ProfileCardProps {
  profile: any;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ profile }) => {
  const isVerified = profile?.verification_status === 'Verified';

  return (
    <div className="bg-brand-white dark:bg-brand-dark-card rounded-[2.5rem] p-6 shadow-md border border-brand-gray dark:border-brand-black flex flex-col items-center text-center transition-colors">
      <div className="relative mb-4">
        <div className="w-20 h-20 rounded-full bg-brand-purple/5 dark:bg-brand-purple/10 border-4 border-brand-white dark:border-brand-black overflow-hidden shadow-md">
          {profile?.avatar_url ? (
            <img 
              src={profile.avatar_url.includes('?') ? profile.avatar_url : `${profile.avatar_url}?t=${Date.now()}`} 
              alt={profile.full_name} 
              className="w-full h-full object-cover" 
              referrerPolicy="no-referrer" 
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-brand-purple font-black text-2xl">
              {profile?.full_name?.charAt(0).toUpperCase() || 'U'}
            </div>
          )}
        </div>
        {isVerified && (
          <div className="absolute -bottom-1 -right-1 bg-brand-purple text-brand-white p-1.5 rounded-full border-2 border-brand-white dark:border-brand-black shadow-sm" title="Verified Professional">
            <CheckCircle className="w-3 h-3" />
          </div>
        )}
      </div>
      
      <div className="mb-4">
        <h3 className="text-xl font-black text-brand-black dark:text-brand-white leading-tight mb-1">
          {profile?.full_name || 'Anonymous User'}
        </h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-widest">{profile?.role || 'Member'}</p>
      </div>

      <div className="flex flex-wrap justify-center gap-1.5">
        {profile?.skills?.slice(0, 3).map((skill: string, i: number) => (
          <span key={i} className="px-3 py-1 bg-brand-gray dark:bg-brand-black text-brand-black dark:text-gray-300 text-[10px] font-bold rounded-full border border-brand-gray dark:border-brand-dark-card">
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
};

export default ProfileCard;
