import React from 'react';
import { CheckCircle, Shield } from 'lucide-react';

interface ProfileCardProps {
  profile: any;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ profile }) => {
  const isPremium = profile?.subscription_plan === 'premium';
  const isPro = profile?.subscription_plan === 'pro' || isPremium;

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-brand-purple-light/20 flex items-center gap-5">
      <div className="w-16 h-16 rounded-full bg-brand-purple-soft border-2 border-brand-purple overflow-hidden flex-shrink-0 shadow-sm">
        {profile?.profile_photo ? (
          <img src={profile.profile_photo} alt={profile.full_name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-brand-purple font-bold text-xl">
            {profile?.full_name?.charAt(0).toUpperCase() || 'U'}
          </div>
        )}
      </div>
      <div className="flex-grow min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-bold text-brand-black truncate">{profile?.full_name || 'Anonymous User'}</h3>
          {isPremium ? (
            <div className="flex items-center gap-1 px-2 py-0.5 bg-brand-purple text-white text-[8px] font-black rounded-md uppercase tracking-tighter shadow-sm">
              <Shield className="w-2 h-2" />
              Premium
            </div>
          ) : isPro ? (
            <CheckCircle className="w-4 h-4 text-brand-purple" />
          ) : null}
        </div>
        <p className="text-sm text-brand-gray-dark truncate font-medium">{profile?.role || 'Member'}</p>
        <div className="flex flex-wrap gap-1 mt-2">
          {profile?.skills?.slice(0, 3).map((skill: string, i: number) => (
            <span key={i} className="px-2 py-0.5 bg-brand-gray text-brand-gray-dark text-[10px] font-bold rounded-full border border-brand-purple-light/10">
              {skill}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
