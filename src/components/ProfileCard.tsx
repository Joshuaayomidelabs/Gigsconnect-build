import React, { useState, useEffect } from 'react';
import { CheckCircle, Shield, Users, UserPlus, UserCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { followsService } from '../services/followsService';
import { profilesService } from '../services/profilesService';
import { supabase } from '../services/supabaseClient';
import { toast } from 'sonner';
import FollowListModal from './FollowListModal';

interface ProfileCardProps {
  profile?: any;
  userId?: string;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ profile: initialProfile, userId }) => {
  const { user: currentUser } = useAuth();
  
  const targetUserId = userId || initialProfile?.id || currentUser?.id;
  const isOwnProfile = currentUser?.id === targetUserId;
  
  const [localProfile, setLocalProfile] = useState<any>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  
  const [stats, setStats] = useState({ followers: 0, following: 0 });
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [showFollowersModal, setShowFollowersModal] = useState(false);
  const [showFollowingModal, setShowFollowingModal] = useState(false);

  // Fetch Profile Data
  useEffect(() => {
    let isMounted = true;
    
    const fetchProfileData = async () => {
      if (!targetUserId) {
        setIsLoadingProfile(false);
        return;
      }
      
      setIsLoadingProfile(true);
      try {
        const { data, error } = await profilesService.getProfile(targetUserId);
        if (error) throw error;
        
        if (isMounted && data) {
          console.log("Fetched Profile Data:", data);
          setLocalProfile(data);
        }
      } catch (err) {
        console.error("Error fetching profile for ProfileCard:", err);
      } finally {
        if (isMounted) setIsLoadingProfile(false);
      }
    };

    // If we receive a profile prop and it's full, we might set it initially, 
    // but the requirement says to fetch and store in a reactive state.
    fetchProfileData();

    // Subscribe to realtime updates for this profile
    if (!targetUserId) return;
    
    const channel = supabase
      .channel(`public:profiles:id=eq.${targetUserId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profiles',
          filter: `id=eq.${targetUserId}`,
        },
        (payload) => {
          if (isMounted) {
            console.log("Realtime Profile Update received:", payload.new);
            setLocalProfile(payload.new);
          }
        }
      )
      .subscribe();

    return () => {
      isMounted = false;
      supabase.removeChannel(channel);
    };
  }, [targetUserId, initialProfile?.updated_at]);

  // Fetch Stats Data
  useEffect(() => {
    let isMounted = true;
    
    const fetchFollowData = async () => {
      if (!targetUserId) return;
      
      try {
        const statsData = await followsService.getFollowStats(targetUserId);
        if (isMounted) setStats(statsData);

        if (currentUser && !isOwnProfile) {
          const followStatus = await followsService.checkIfFollowing(currentUser.id, targetUserId);
          if (isMounted) setIsFollowing(followStatus.isFollowing);
        }
      } catch (err) {
        console.error("Error fetching follow data", err);
      } finally {
        if (isMounted) setIsLoadingStats(false);
      }
    };

    fetchFollowData();

    return () => {
      isMounted = false;
    };
  }, [targetUserId, currentUser, isOwnProfile]);

  // Sync to debug log UI bindings
  useEffect(() => {
    if (localProfile) {
      console.log("UI Rendering with Profile:", {
        id: localProfile.id,
        avatar_url: localProfile.avatar_url,
        username: localProfile.username,
        full_name: localProfile.full_name,
        bio: localProfile.bio,
        role: localProfile.role,
        skills: localProfile.skills,
        updated_at: localProfile.updated_at
      });
    }
  }, [localProfile]);

  const handleFollowToggle = async () => {
    if (!currentUser) {
      toast.error("Please sign in to follow users.");
      return;
    }
    if (!targetUserId) return;

    // Optimistic UI Update
    const newFollowingState = !isFollowing;
    setIsFollowing(newFollowingState);
    setStats(prev => ({
      ...prev,
      followers: newFollowingState ? prev.followers + 1 : Math.max(0, prev.followers - 1)
    }));

    const { error } = await followsService.toggleFollow(currentUser.id, targetUserId, !newFollowingState);
    
    if (error) {
      // Revert on error
      setIsFollowing(!newFollowingState);
      setStats(prev => ({
        ...prev,
        followers: !newFollowingState ? prev.followers + 1 : Math.max(0, prev.followers - 1)
      }));
      toast.error("Failed to update follow status. Please ensure the 'follows' table exists in Supabase.");
    }
  };

  if (isLoadingProfile) {
    return (
      <div className="bg-brand-white dark:bg-brand-dark-card rounded-[2.5rem] p-6 shadow-md border border-brand-gray dark:border-brand-black flex flex-col items-center text-center animate-pulse">
        <div className="w-20 h-20 rounded-full bg-gray-200 dark:bg-gray-800 mb-4"></div>
        <div className="h-5 w-32 bg-gray-200 dark:bg-gray-800 rounded mb-2"></div>
        <div className="h-3 w-20 bg-gray-200 dark:bg-gray-800 rounded mb-5"></div>
        <div className="flex gap-2 mb-5">
          <div className="h-4 w-12 bg-gray-200 dark:bg-gray-800 rounded-full"></div>
          <div className="h-4 w-12 bg-gray-200 dark:bg-gray-800 rounded-full"></div>
        </div>
        <div className="flex gap-6 w-full mb-5 justify-center">
          <div className="h-8 w-10 bg-gray-200 dark:bg-gray-800 rounded"></div>
          <div className="w-px h-8 bg-gray-200 dark:bg-[#1F1F23]"></div>
          <div className="h-8 w-10 bg-gray-200 dark:bg-gray-800 rounded"></div>
        </div>
      </div>
    );
  }

  if (!localProfile) {
    return null;
  }

  const isVerified = localProfile.verification_status === 'Verified';

  // Construct full image URL with cache busting if available
  const displayAvatar = localProfile.avatar_url 
    ? (localProfile.avatar_url.includes('?') ? localProfile.avatar_url : `${localProfile.avatar_url}?t=${Date.now()}`)
    : null;

  return (
    <div className="bg-brand-white dark:bg-brand-dark-card rounded-[2.5rem] p-6 shadow-md border border-brand-gray dark:border-brand-black flex flex-col items-center text-center transition-colors">
      <div className="relative mb-4">
        <div className="w-20 h-20 rounded-full bg-brand-purple/5 dark:bg-brand-purple/10 border-4 border-brand-white dark:border-brand-black overflow-hidden shadow-md">
          {displayAvatar ? (
            <img 
              src={displayAvatar} 
              alt={localProfile.full_name || 'User'} 
              className="w-full h-full object-cover" 
              referrerPolicy="no-referrer" 
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-brand-purple font-black text-2xl">
              {localProfile.full_name?.charAt(0).toUpperCase() || 'U'}
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
          {localProfile.full_name || 'Anonymous User'}
        </h3>
        {localProfile.username && (
          <p className="text-xs text-gray-500 dark:text-gray-400 font-bold mb-1">@{localProfile.username}</p>
        )}
        <p className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-widest">{localProfile.role || 'Member'}</p>
      </div>

      {/* Bio Section - Conditional Render */}
      {localProfile.bio && (
        <div className="mb-4 w-full">
          <p className="text-sm text-gray-700 dark:text-gray-300 italic line-clamp-3">"{localProfile.bio}"</p>
        </div>
      )}

      {localProfile.skills && localProfile.skills.length > 0 && (
        <div className="flex flex-wrap justify-center gap-1.5 mb-5">
          {localProfile.skills.slice(0, 3).map((skill: string, i: number) => (
            <span key={i} className="px-3 py-1 bg-brand-gray dark:bg-brand-black text-brand-black dark:text-gray-300 text-[10px] font-bold rounded-full border border-brand-gray dark:border-brand-dark-card">
              {skill}
            </span>
          ))}
        </div>
      )}

      {/* Social Stats Section */}
      <div className="flex items-center justify-center gap-6 w-full mb-5">
        <div className="flex flex-col items-center cursor-pointer group" onClick={() => setShowFollowersModal(true)}>
          {isLoadingStats ? (
             <div className="h-6 w-8 bg-gray-200 dark:bg-gray-800 rounded mb-1 animate-pulse"></div>
          ) : (
            <span className="text-lg font-black text-brand-black dark:text-brand-white group-hover:text-brand-purple transition-colors">
              {stats.followers >= 1000 ? (stats.followers / 1000).toFixed(1) + 'K' : stats.followers}
            </span>
          )}
          <span className="text-[10px] uppercase tracking-wider font-bold text-gray-500">
            {stats.followers === 0 && !isLoadingStats ? "No followers yet" : "Followers"}
          </span>
        </div>
        
        <div className="w-px h-8 bg-gray-200 dark:bg-[#1F1F23]"></div>
        
        <div className="flex flex-col items-center cursor-pointer group" onClick={() => setShowFollowingModal(true)}>
          {isLoadingStats ? (
             <div className="h-6 w-8 bg-gray-200 dark:bg-gray-800 rounded mb-1 animate-pulse"></div>
          ) : (
            <span className="text-lg font-black text-brand-black dark:text-brand-white group-hover:text-brand-purple transition-colors">
              {stats.following >= 1000 ? (stats.following / 1000).toFixed(1) + 'K' : stats.following}
            </span>
          )}
          <span className="text-[10px] uppercase tracking-wider font-bold text-gray-500">
            {stats.following === 0 && !isLoadingStats ? "None following" : "Following"}
          </span>
        </div>
      </div>

      {/* Follow Button (Hide for owner) */}
      {!isOwnProfile && currentUser && !isLoadingStats && (
        <button
          onClick={handleFollowToggle}
          className={`w-full max-w-[200px] py-2.5 rounded-full font-bold text-sm flex items-center justify-center gap-2 transition-all duration-200 active:scale-95 ${
            isFollowing 
              ? 'bg-gray-100 dark:bg-[#1F1F23] text-brand-black dark:text-brand-white hover:bg-gray-200 dark:hover:bg-[#2A2A2F]' 
              : 'bg-[#6C3BFF] hover:bg-[#A78BFA] text-white shadow-md shadow-[#6C3BFF]/20'
          }`}
        >
          {isFollowing ? (
            <>
              <UserCheck className="w-4 h-4" />
              Following
            </>
          ) : (
            <>
              <UserPlus className="w-4 h-4" />
              Follow
            </>
          )}
        </button>
      )}

      {showFollowersModal && (
        <FollowListModal 
          userId={targetUserId} 
          type="followers" 
          onClose={() => setShowFollowersModal(false)} 
        />
      )}

      {showFollowingModal && (
        <FollowListModal 
          userId={targetUserId} 
          type="following" 
          onClose={() => setShowFollowingModal(false)} 
        />
      )}
    </div>
  );
};

export default ProfileCard;
