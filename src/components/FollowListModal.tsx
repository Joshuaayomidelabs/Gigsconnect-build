import React, { useState, useEffect } from 'react';
import { X, Loader2, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { followsService } from '../services/followsService';

interface FollowListModalProps {
  userId: string;
  type: 'followers' | 'following';
  onClose: () => void;
}

const FollowListModal: React.FC<FollowListModalProps> = ({ userId, type, onClose }) => {
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        if (type === 'followers') {
          const { data } = await followsService.getFollowers(userId);
          setProfiles(data || []);
        } else {
          const { data } = await followsService.getFollowing(userId);
          setProfiles(data || []);
        }
      } catch (err: any) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfiles();
  }, [userId, type]);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 dark:bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white dark:bg-brand-dark-card w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[80vh] animate-in zoom-in-95 duration-300 border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-brand-purple/5 dark:bg-brand-purple/10">
          <div>
            <h2 className="text-xl font-black text-gray-900 dark:text-white tracking-tight capitalize">{type}</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white dark:hover:bg-brand-dark rounded-full transition-colors text-gray-500 dark:text-gray-400 hover:text-brand-purple"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-grow overflow-y-auto p-6 space-y-4">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-brand-purple opacity-50 mb-4" />
              <p className="text-gray-500 dark:text-gray-400 font-bold">Loading...</p>
            </div>
          ) : profiles.length > 0 ? (
            profiles.map((profile, i) => (
              <div 
                key={i} 
                className="flex items-center gap-4 p-3 rounded-2xl hover:bg-gray-50 dark:hover:bg-brand-dark transition-colors cursor-pointer group"
                onClick={() => {
                  if (profile?.user_id) {
                    onClose();
                    navigate(`/profile/${profile.user_id}`);
                  } else if (profile?.id) {
                    onClose();
                    navigate(`/profile/${profile.id}`);
                  }
                }}
              >
                <div className="w-12 h-12 rounded-full bg-brand-purple/5 dark:bg-brand-purple/10 border-2 border-transparent group-hover:border-brand-purple/30 overflow-hidden flex-shrink-0 transition-colors">
                  {profile?.avatar_url ? (
                    <img src={profile.avatar_url} alt={profile.full_name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-brand-purple font-black">
                      {profile?.full_name?.charAt(0).toUpperCase() || <User className="w-5 h-5" />}
                    </div>
                  )}
                </div>
                <div className="flex-grow min-w-0">
                  <h4 className="text-base font-bold text-gray-900 dark:text-white truncate group-hover:text-brand-purple transition-colors">
                    {profile?.full_name || 'Anonymous User'}
                  </h4>
                  <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest truncate">{profile?.role || 'Member'}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-16 bg-gray-50 dark:bg-gray-900/50 rounded-[2rem] border border-dashed border-gray-300 dark:border-gray-700">
              <p className="text-gray-500 dark:text-gray-400 font-bold">
                {type === 'followers' ? 'No followers yet.' : 'Not following anyone yet.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FollowListModal;
