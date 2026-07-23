import { useEffect, useState } from "react";
import { CheckCircle, Loader2, UserPlus, UserCheck } from "lucide-react";
import { supabase } from "../services/supabaseClient";
import { followsService } from "../services/followsService";
import { useAuth } from "../context/AuthContext";
import FollowListModal from "./FollowListModal";

interface UserProfileProps {
  userId: string;
}

export default function UserProfile({ userId }: UserProfileProps) {
  const { user: currentUser } = useAuth();
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState({ followers: 0, following: 0 });
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isTogglingFollow, setIsTogglingFollow] = useState(false);
  const [showFollowersModal, setShowFollowersModal] = useState(false);
  const [showFollowingModal, setShowFollowingModal] = useState(false);

  useEffect(() => {
    // 1. Initial fetch
    const fetchUser = async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)   // MUST match auth.users.id
        .maybeSingle();

      if (error) console.error(error);
      if (data) setUser(data);
    };

    fetchUser();

    // Fetch Stats Data
    const fetchStatsAndFollowStatus = async () => {
      try {
        setIsLoadingStats(true);
        const statsData = await followsService.getFollowStats(userId);
        setStats(statsData);

        if (currentUser && currentUser.id !== userId) {
          const followStatus = await followsService.checkIfFollowing(currentUser.id, userId);
          setIsFollowing(followStatus.isFollowing);
        }
      } catch (err) {
        console.error("Error fetching stats:", err);
      } finally {
        setIsLoadingStats(false);
      }
    };

    fetchStatsAndFollowStatus();

    // 2. Realtime subscription (Supabase v2 syntax)
    const channel = supabase
      .channel(`profile-${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'profiles',
          filter: `id=eq.${userId}`,
        },
        (payload) => {
          setUser(payload.new);
        }
      )
      .subscribe();

    // 3. Cleanup on unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, currentUser]);

  const handleFollowToggle = async () => {
    if (!currentUser || isTogglingFollow) return;

    setIsTogglingFollow(true);
    const newFollowingState = !isFollowing;
    
    // Optimistic cache update
    setIsFollowing(newFollowingState);
    setStats(prev => ({
      ...prev,
      followers: newFollowingState ? prev.followers + 1 : Math.max(0, prev.followers - 1)
    }));

    const { error } = await followsService.toggleFollow(currentUser.id, userId, !newFollowingState);
    
    if (error) {
      // Revert on error
      setIsFollowing(!newFollowingState);
      setStats(prev => ({
        ...prev,
        followers: !newFollowingState ? prev.followers + 1 : Math.max(0, prev.followers - 1)
      }));
      console.error("Error toggling follow:", error);
    }
    
    setIsTogglingFollow(false);
  };

  if (!user) return <div className="p-2 text-gray-500 text-sm">Loading user...</div>;

  const isVerified = user.verification_status?.toLowerCase() === 'verified';

  const formatNumber = (num: number) => {
    return num >= 1000 ? (num / 1000).toFixed(1) + 'K' : num;
  };

  return (
    <div className="flex flex-col p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          {/* Avatar */}
          {user.avatar_url ? (
            <img
              src={user.avatar_url}
              alt={user.full_name}
              className="w-12 h-12 rounded-full object-cover border border-gray-200 dark:border-gray-600"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center border border-gray-200 dark:border-gray-600">
              <span className="text-gray-400 text-sm font-bold">
                {user.full_name?.charAt(0).toUpperCase()}
              </span>
            </div>
          )}

          <div className="flex flex-col">
            <div className="flex items-center space-x-1.5">
              <span className="font-semibold text-gray-800 dark:text-gray-100">
                {user.full_name}
              </span>
              {isVerified && (
                <span title="Verified">
                  <CheckCircle
                    className="w-4 h-4 text-brand-purple"
                  />
                </span>
              )}
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400">@{user.username || 'username'}</span>
          </div>
        </div>
        
        {currentUser && currentUser.id !== userId && (
          <button
            onClick={handleFollowToggle}
            disabled={isTogglingFollow || isLoadingStats}
            className={`px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all duration-200 active:scale-95 disabled:opacity-70 ${
              isFollowing
                ? 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600'
                : 'bg-brand-purple text-white hover:bg-brand-purple-hover shadow-sm'
            }`}
          >
            {isTogglingFollow ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : isFollowing ? (
              <UserCheck className="w-3.5 h-3.5" />
            ) : (
              <UserPlus className="w-3.5 h-3.5" />
            )}
            {isFollowing ? 'Following' : 'Follow'}
          </button>
        )}
      </div>

      <div className="flex items-center gap-4 border-t border-gray-100 dark:border-gray-700 pt-3 mt-1">
        <div className="flex flex-col cursor-pointer group" onClick={() => setShowFollowersModal(true)}>
          {isLoadingStats ? (
            <div className="h-5 w-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-1"></div>
          ) : (
            <span className="text-sm font-black text-gray-900 dark:text-gray-100 group-hover:text-brand-purple transition-colors">
              {formatNumber(stats.followers)}
            </span>
          )}
          <span className="text-[10px] uppercase tracking-wider font-bold text-gray-500">
            {stats.followers === 0 && !isLoadingStats ? "No followers yet" : "Followers"}
          </span>
        </div>
        
        <div className="w-px h-6 bg-gray-200 dark:bg-gray-700"></div>
        
        <div className="flex flex-col cursor-pointer group" onClick={() => setShowFollowingModal(true)}>
          {isLoadingStats ? (
            <div className="h-5 w-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-1"></div>
          ) : (
            <span className="text-sm font-black text-gray-900 dark:text-gray-100 group-hover:text-brand-purple transition-colors">
              {formatNumber(stats.following)}
            </span>
          )}
          <span className="text-[10px] uppercase tracking-wider font-bold text-gray-500">
            {stats.following === 0 && !isLoadingStats ? "None following" : "Following"}
          </span>
        </div>
      </div>

      {showFollowersModal && (
        <FollowListModal 
          userId={userId} 
          type="followers" 
          onClose={() => setShowFollowersModal(false)} 
        />
      )}

      {showFollowingModal && (
        <FollowListModal 
          userId={userId} 
          type="following" 
          onClose={() => setShowFollowingModal(false)} 
        />
      )}
    </div>
  );
}
