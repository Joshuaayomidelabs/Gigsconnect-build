import React from 'react';
import { CheckCircle } from 'lucide-react';

interface ProfileCardProps {
  profile: any;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ profile }) => {
  const isPro = profile?.subscription_plan === 'pro' || profile?.subscription_plan === 'premium';

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-4">
      <div className="w-16 h-16 rounded-full bg-brand-100 border-2 border-brand-600 overflow-hidden flex-shrink-0">
        {profile?.profile_photo ? (
          <img src={profile.profile_photo} alt={profile.full_name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-brand-600 font-bold text-xl">
            {profile?.full_name?.charAt(0).toUpperCase() || 'U'}
          </div>
        )}
      </div>
      <div className="flex-grow min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-bold text-gray-900 truncate">{profile?.full_name || 'Anonymous User'}</h3>
          {isPro && (
            <CheckCircle className="w-4 h-4 text-blue-500 fill-blue-500/10" />
          )}
        </div>
        <p className="text-sm text-gray-500 truncate">{profile?.role || 'Member'}</p>
        <div className="flex flex-wrap gap-1 mt-2">
          {profile?.skills?.slice(0, 3).map((skill: string, i: number) => (
            <span key={i} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-[10px] font-bold rounded-full border border-gray-200">
              {skill}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
