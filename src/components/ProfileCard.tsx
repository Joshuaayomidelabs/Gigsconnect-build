import React from 'react';
import { CheckCircle, Shield } from 'lucide-react';

interface ProfileCardProps {
  profile: any;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ profile }) => {
  const isPremium = profile?.subscription_plan === 'premium';
  const isPro = profile?.subscription_plan === 'pro' || isPremium;

  return (
    <div className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-brand-purple-light/10 flex flex-col items-center text-center">
      <div className="relative mb-4">
        <div className="w-20 h-20 rounded-full bg-brand-purple-soft border-4 border-white overflow-hidden shadow-md">
          {profile?.profile_photo ? (
            <img src={profile.profile_photo} alt={profile.full_name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-brand-purple font-black text-2xl">
              {profile?.full_name?.charAt(0).toUpperCase() || 'U'}
            </div>
          )}
        </div>
        {isPro && (
          <div className="absolute -bottom-1 -right-1 bg-brand-purple text-white p-1.5 rounded-full border-2 border-white shadow-sm">
            {isPremium ? <Shield className="w-3 h-3" /> : <CheckCircle className="w-3 h-3" />}
          </div>
        )}
      </div>
      
      <div className="mb-4">
        <h3 className="text-xl font-black text-brand-black leading-tight mb-1">{profile?.full_name || 'Anonymous User'}</h3>
        <p className="text-xs text-brand-gray-dark font-bold uppercase tracking-widest">{profile?.role || 'Member'}</p>
      </div>

      <div className="flex flex-wrap justify-center gap-1.5">
        {profile?.skills?.slice(0, 3).map((skill: string, i: number) => (
          <span key={i} className="px-3 py-1 bg-brand-gray text-brand-gray-dark text-[10px] font-bold rounded-full border border-brand-purple-light/5">
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
};

export default ProfileCard;
