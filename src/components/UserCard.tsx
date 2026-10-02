import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User, MapPin, Loader2, UserPlus, UserCheck } from 'lucide-react';
import { motion } from 'motion/react';
import VerificationBadge from './VerificationBadge';
import { useAuth } from '../context/AuthContext';
import { followsService } from '../services/followsService';
import { useModeration } from '../hooks/useModeration';

interface UserCardProps {
  user: {
    id: string;
    full_name: string;
    avatar_url?: string;
    skills?: string[];
    city?: string;
    country?: string;
  };
}

export const UserCard: React.FC<UserCardProps> = ({ user }) => {
  const { user: currentUser } = useAuth();
  const { isUserBlocked } = useModeration();
  const [isFollowing, setIsFollowing] = useState(false);
  const [isTogglingFollow, setIsTogglingFollow] = useState(false);

  // Filter blocked users out of listing grids completely
  if (isUserBlocked(user.id)) {
    return null;
  }
  
  useEffect(() => {
    let isMounted = true;
    if (currentUser && currentUser.id !== user.id) {
      followsService.checkIfFollowing(currentUser.id, user.id).then((status) => {
        if (isMounted) {
          setIsFollowing(status.isFollowing);
        }
      }).catch(err => console.error("Follow check error:", err));
    }
    return () => { isMounted = false; };
  }, [currentUser, user.id]);

  const handleFollowToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!currentUser || isTogglingFollow) return;

    setIsTogglingFollow(true);
    const newFollowingState = !isFollowing;
    
    // Optimistic UI update
    setIsFollowing(newFollowingState);

    const { error } = await followsService.toggleFollow(currentUser.id, user.id, !newFollowingState);
    
    if (error) {
      // Revert on error
      setIsFollowing(!newFollowingState);
      console.error("Error toggling follow:", error);
    }
    
    setIsTogglingFollow(false);
  };

  const avatarUrl = user.avatar_url;

  const location = user.city && user.country 
    ? `${user.city}, ${user.country}` 
    : (user.city || user.country || null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="bg-white dark:bg-brand-dark-card rounded-2xl shadow-sm border border-gray-100 dark:border-brand-dark-card overflow-hidden hover:shadow-md transition-all duration-300 relative"
    >
      <Link to={`/profile/${user.id}`} className="block p-5 pr-20">
        <div className="flex items-center gap-4">
          <div className="relative h-14 w-14 flex-shrink-0">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={user.full_name}
                className="h-full w-full rounded-full object-cover ring-2 ring-brand-purple/20"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="h-full w-full rounded-full bg-brand-purple/10 flex items-center justify-center text-brand-purple">
                <User className="h-6 w-6" />
              </div>
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-brand-black dark:text-white truncate text-base flex items-center gap-1">
              <span className="truncate">{user.full_name}</span>
              <VerificationBadge 
                verificationStatus={(user as any).verification_status} 
              />
            </h3>
            {location && (
              <div className="flex items-center text-gray-500 dark:text-gray-400 text-xs mt-1 truncate">
                <MapPin className="h-3.5 w-3.5 mr-1 text-brand-purple shrink-0" />
                <span className="truncate">{location}</span>
              </div>
            )}
          </div>
        </div>

        <div className="mt-3.5">
          <div className="flex flex-wrap gap-1.5">
            {user.skills && user.skills.length > 0 ? (
              user.skills.slice(0, 3).map((skill, index) => (
                <span
                  key={index}
                  className="px-2.5 py-0.5 bg-brand-purple/10 dark:bg-brand-purple/20 text-brand-purple text-xs font-medium rounded-full"
                >
                  {skill}
                </span>
              ))
            ) : (
              <span className="text-gray-400 dark:text-gray-500 text-xs italic">No skills listed</span>
            )}
            {user.skills && user.skills.length > 3 && (
              <span className="text-gray-400 dark:text-gray-500 text-xs self-center">
                +{user.skills.length - 3} more
              </span>
            )}
          </div>
        </div>
      </Link>
      
      {currentUser && currentUser.id !== user.id && (
        <div className="absolute top-5 right-5 z-10 block">
          <button
            onClick={handleFollowToggle}
            disabled={isTogglingFollow}
            className={`
              flex items-center justify-center p-2 rounded-full transition-all
              ${isFollowing 
                ? 'bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-zinc-700' 
                : 'bg-brand-purple text-white hover:bg-brand-purple-hover shadow-sm'
              }
            `}
            title={isFollowing ? "Unfollow" : "Follow"}
          >
            {isTogglingFollow ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : isFollowing ? (
              <UserCheck className="w-4 h-4" />
            ) : (
              <UserPlus className="w-4 h-4" />
            )}
          </button>
        </div>
      )}
    </motion.div>
  );
};
