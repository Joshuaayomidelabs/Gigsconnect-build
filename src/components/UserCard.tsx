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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300 relative"
    >
      <Link to={`/profile/${user.id}`} className="block p-5 pr-20">
        <div className="flex items-center gap-4">
          <div className="relative h-16 w-16 flex-shrink-0">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={user.full_name}
                className="h-full w-full rounded-full object-cover border-2 border-primary/10"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="h-full w-full rounded-full bg-gray-100 flex items-center justify-center border-2 border-gray-50">
                <User className="h-8 w-8 text-gray-400" />
              </div>
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-gray-900 truncate text-lg flex items-center">
              {user.full_name}
              <VerificationBadge 
                verificationStatus={(user as any).verification_status} 
              />
            </h3>
            {location && (
              <div className="flex items-center text-gray-500 text-sm mt-1">
                <MapPin className="h-3.5 w-3.5 mr-1" />
                <span className="truncate">{location}</span>
              </div>
            )}
          </div>
        </div>

        <div className="mt-4">
          <div className="flex flex-wrap gap-2">
            {user.skills && user.skills.length > 0 ? (
              user.skills.slice(0, 3).map((skill, index) => (
                <span
                  key={index}
                  className="px-2.5 py-1 bg-primary/5 text-primary text-xs font-medium rounded-full border border-primary/10"
                >
                  {skill}
                </span>
              ))
            ) : (
              <span className="text-gray-400 text-xs italic">No skills listed</span>
            )}
            {user.skills && user.skills.length > 3 && (
              <span className="text-gray-400 text-xs self-center">
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
              flex items-center justify-center p-2 rounded-full transition-all border
              ${isFollowing 
                ? 'bg-gray-100/50 text-gray-700 border-transparent hover:bg-red-50 hover:text-red-600 hover:border-red-100' 
                : 'bg-primary text-white border-transparent hover:bg-primary/90 hover:shadow-sm'
              }
            `}
            title={isFollowing ? "Unfollow" : "Follow"}
          >
            {isTogglingFollow ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : isFollowing ? (
              <UserCheck className="w-5 h-5" />
            ) : (
              <UserPlus className="w-5 h-5" />
            )}
          </button>
        </div>
      )}
    </motion.div>
  );
};
