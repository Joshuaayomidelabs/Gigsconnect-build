import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  User, 
  MapPin, 
  Music, 
  Globe, 
  Loader2, 
  Briefcase,
  ArrowLeft,
  Mail,
  Phone,
  Instagram,
  Facebook,
  Twitter,
  Linkedin,
  CheckCircle2,
  Music2,
  Clock,
  UserPlus,
  UserCheck,
  MessageCircle,
  LayoutGrid,
  Bookmark
} from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'sonner';
import { profilesService } from '../services/profilesService';
import { followsService } from '../services/followsService';
import { supabase } from '../services/supabaseClient';
import { useAuth } from '../context/AuthContext';
import VerificationBadge from '../components/VerificationBadge';
import FollowListModal from '../components/FollowListModal';

const PublicProfile: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  
  const [profile, setProfile] = useState<any>(null);
  const [appliedGigIds, setAppliedGigIds] = useState<Set<string>>(new Set());
  
  // Social Stats State
  const [stats, setStats] = useState({ followers: 0, following: 0 });
  const [isFollowing, setIsFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState<'portfolio'>('portfolio');
  const [showFollowersModal, setShowFollowersModal] = useState(false);
  const [showFollowingModal, setShowFollowingModal] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<{type: string, url: string} | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isOwnProfile = currentUser?.id === userId;

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      if (!userId) return;
      
      try {
        setIsLoading(true);
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          // Fetch applied gig IDs
          const { data: applications } = await supabase
            .from('applications')
            .select('gig_id')
            .eq('applicant_id', session.user.id);
          
          if (applications && isMounted) {
            setAppliedGigIds(new Set(applications.map(app => app.gig_id)));
          }
        }

        const [profileRes, statsData] = await Promise.all([
          profilesService.getProfile(userId),
          followsService.getFollowStats(userId)
        ]);

        if (profileRes.error) throw profileRes.error;
        
        if (isMounted) {
          setProfile(profileRes.data);
          setStats(statsData);
        }

        if (currentUser && !isOwnProfile) {
          const followStatus = await followsService.checkIfFollowing(currentUser.id, userId);
          if (isMounted) {
            setIsFollowing(followStatus.isFollowing);
          }
        }
      } catch (err: any) {
        if (isMounted) setError(err.message || 'Failed to load profile');
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchData();

    // Realtime subscription for profile updates (verification status, etc.)
    const channel = supabase
      .channel(`public-profile-${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'profiles',
          filter: `id=eq.${userId}`,
        },
        (payload) => {
          if (isMounted) setProfile(payload.new);
        }
      )
      .subscribe();

    return () => {
      isMounted = false;
      supabase.removeChannel(channel);
    };
  }, [userId, currentUser, isOwnProfile]);

  const handleFollowToggle = async () => {
    if (!currentUser) {
      toast.error("Please sign in to follow users.");
      return;
    }
    if (!userId) return;

    // Optimistic UI Update
    const newFollowingState = !isFollowing;
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
      toast.error("Failed to update follow status.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-brand-gray dark:bg-brand-black transition-colors">
        <Loader2 className="w-10 h-10 animate-spin text-brand-purple" />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="pt-24 pb-12 px-4 text-center min-h-screen bg-brand-gray dark:bg-brand-black transition-colors">
        <div className="max-w-md mx-auto bg-brand-white dark:bg-brand-dark-card p-12 rounded-[3rem] shadow-xl border border-brand-gray dark:border-brand-black">
          <User className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-6" />
          <h2 className="text-2xl font-black text-brand-black dark:text-brand-white mb-2">Profile Not Found</h2>
          <p className="text-gray-700 dark:text-gray-200 mb-8">{error || "The profile you're looking for doesn't exist."}</p>
          <button 
            onClick={() => navigate(-1)}
            className="px-8 py-3 bg-brand-purple text-brand-white font-bold rounded-2xl hover:bg-brand-purple-hover transition-all"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-brand-gray dark:bg-brand-black min-h-screen pt-20 sm:pt-24 pb-24 transition-colors duration-500">
      {/* Top Banner Gradient */}
      <div className="h-40 bg-gradient-to-r from-[#6C2BD9]/80 to-[#4C1D95]/90 w-full relative">
        {/* Back Button */}
        <button 
          onClick={() => navigate(-1)}
          className="absolute top-6 left-4 sm:left-8 flex items-center justify-center w-10 h-10 bg-black/20 backdrop-blur-md rounded-full text-white hover:bg-black/40 transition-colors z-10"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
      </div>
      
      <div className="max-w-3xl mx-auto px-4 sm:px-6 relative -mt-12 sm:-mt-16 z-10">
        {/* Profile Header Card */}
        <div className="bg-brand-white dark:bg-brand-dark-card rounded-[2rem] shadow-md border border-brand-gray dark:border-brand-black p-5 sm:p-8 mb-6 relative">
          
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 mb-6">
            {/* Avatar */}
            <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full border-4 border-brand-white dark:border-brand-dark-card shadow-lg overflow-hidden bg-brand-gray dark:bg-brand-black flex-shrink-0 flex items-center justify-center relative -mt-14 sm:-mt-16 z-20 mx-auto sm:mx-0">
              {profile.avatar_url ? (
                <img 
                  src={profile.avatar_url.includes('?') ? profile.avatar_url : `${profile.avatar_url}?t=${Date.now()}`} 
                  alt={profile.full_name} 
                  className="w-full h-full object-cover object-center" 
                  referrerPolicy="no-referrer" 
                />
              ) : (
                <User className="w-12 h-12 text-gray-400 dark:text-gray-600" />
              )}
            </div>

            <div className="text-center sm:text-left flex-1 min-w-0 w-full">
              <h1 className="text-2xl font-black text-brand-black dark:text-brand-white tracking-tight flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                <span className="truncate">{profile.full_name || 'Anonymous User'}</span>
                <VerificationBadge 
                  isVerified={profile.is_verified} 
                  verificationStatus={profile.verification_status} 
                />
              </h1>
              {profile.username && (
                <p className="text-gray-500 dark:text-gray-400 font-medium truncate">@{profile.username}</p>
              )}
              
              <div className="flex items-center justify-center sm:justify-start gap-1 text-gray-500 dark:text-gray-400 text-sm font-medium mt-1 truncate">
                <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="truncate">{profile.city ? `${profile.city}, ${profile.country}` : profile.country || 'Global'}</span>
              </div>
            </div>
          </div>

          {/* Social Stats Row */}
          <div className="flex items-center justify-center sm:justify-start gap-8 sm:gap-10 py-5 border-t border-brand-gray dark:border-[#1F1F23] mb-6">
            <div className="flex flex-col items-center sm:items-start group cursor-pointer" onClick={() => setShowFollowersModal(true)}>
              <span className="text-xl font-black text-brand-black dark:text-brand-white group-hover:text-brand-purple transition-colors">
                {stats.followers >= 1000 ? (stats.followers / 1000).toFixed(1) + 'K' : stats.followers}
              </span>
              <span className="text-[11px] uppercase tracking-wider font-bold text-gray-500 text-center sm:text-left">
                {stats.followers === 0 ? "No followers" : "Followers"}
              </span>
            </div>
            <div className="flex flex-col items-center sm:items-start group cursor-pointer" onClick={() => setShowFollowingModal(true)}>
              <span className="text-xl font-black text-brand-black dark:text-brand-white group-hover:text-brand-purple transition-colors">
                {stats.following >= 1000 ? (stats.following / 1000).toFixed(1) + 'K' : stats.following}
              </span>
              <span className="text-[11px] uppercase tracking-wider font-bold text-gray-500 text-center sm:text-left">
                {stats.following === 0 ? "None following" : "Following"}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col xs:flex-row sm:flex-row gap-3 justify-center sm:justify-start mb-6">
            {isOwnProfile ? (
              <button 
                onClick={() => navigate('/edit-profile')} 
                className="w-full sm:flex-1 sm:max-w-[200px] py-2.5 rounded-xl font-bold text-sm bg-gray-100 dark:bg-[#1F1F23] text-brand-black dark:text-brand-white hover:bg-gray-200 dark:hover:bg-[#2A2A2F] active:scale-95 transition-all"
              >
                Edit Profile
              </button>
            ) : (
              <>
                <button 
                  onClick={handleFollowToggle} 
                  className={`w-full sm:flex-1 sm:max-w-[160px] py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all duration-200 active:scale-95 ${
                    isFollowing 
                      ? 'bg-gray-100 dark:bg-[#1F1F23] text-brand-black dark:text-brand-white hover:bg-gray-200 dark:hover:bg-[#2A2A2F]' 
                      : 'bg-[#6C2BD9] hover:bg-[#8A4DFF] text-white shadow-md shadow-[#6C2BD9]/20'
                  }`}
                >
                  {isFollowing ? (
                    <><UserCheck className="w-4 h-4" /> Following</>
                  ) : (
                    <><UserPlus className="w-4 h-4" /> Follow</>
                  )}
                </button>
                <button 
                  onClick={() => toast("Messaging coming soon")}
                  className="w-full sm:flex-1 sm:max-w-[160px] py-2.5 rounded-xl font-bold text-sm bg-gray-100 dark:bg-[#1F1F23] text-brand-black dark:text-brand-white hover:bg-gray-200 dark:hover:bg-[#2A2A2F] active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" /> Message
                </button>
              </>
            )}
          </div>

          {/* Bio */}
          <div className="text-center sm:text-left w-full break-words">
            {profile.bio && (
              <p className="text-gray-800 dark:text-gray-200 text-sm whitespace-pre-wrap leading-relaxed">{profile.bio}</p>
            )}
            
            {profile.skills && profile.skills.length > 0 && (
              <div className="mt-4 flex flex-wrap justify-center sm:justify-start gap-2">
                {profile.skills.map((skill: string) => (
                  <span key={skill} className="px-3 py-1 bg-gray-50 dark:bg-[#161618] rounded-lg text-xs font-bold text-gray-500 dark:text-gray-400 border border-gray-100 dark:border-[#1F1F23] max-w-full truncate">
                    {skill}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Content Render */}
        <div className="mb-12 min-h-[300px]">
          <h3 className="text-xl font-black text-brand-black dark:text-brand-white mb-6">Portfolio</h3>
          {profile.portfolio_media && profile.portfolio_media.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-4">
              {profile.portfolio_media.map((item: any, index: number) => (
                <div key={index} className="relative aspect-square rounded-xl overflow-hidden bg-brand-gray dark:bg-brand-black border border-brand-gray dark:border-[#1F1F23] group">
                  {item.type === 'video' ? (
                    <video 
                      src={item.url} 
                      className="w-full h-full object-cover"
                      onClick={(e) => {
                        e.preventDefault();
                        setSelectedMedia({ type: "video", url: item.url });
                      }}
                      style={{ cursor: "pointer" }}
                    />
                  ) : (
                    <img 
                      src={item.url} 
                      alt={`Portfolio ${index + 1}`} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 cursor-pointer"
                      referrerPolicy="no-referrer"
                      onClick={() =>
                        setSelectedMedia({
                          type: "image",
                          url: item.url,
                        })
                      }
                    />
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-brand-white dark:bg-brand-dark-card rounded-3xl p-12 text-center border border-brand-gray dark:border-[#1F1F23]">
              <Globe className="w-10 h-10 text-[#9CA3AF] dark:text-gray-600 mx-auto mb-3" />
              <p className="text-gray-700 dark:text-gray-400 font-medium text-sm">No portfolio items saved.</p>
            </div>
          )}
        </div>
        
      </div>
      
      {userId && showFollowersModal && (
        <FollowListModal 
          userId={userId} 
          type="followers" 
          onClose={() => setShowFollowersModal(false)} 
        />
      )}

      {userId && showFollowingModal && (
        <FollowListModal 
          userId={userId} 
          type="following" 
          onClose={() => setShowFollowingModal(false)} 
        />
      )}

      {selectedMedia && (
        <div
          onClick={() => setSelectedMedia(null)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.9)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
          }}
        >
          {selectedMedia.type === "image" && (
            <img
              src={selectedMedia.url}
              style={{
                maxWidth: "90%",
                maxHeight: "90%",
                objectFit: "contain",
              }}
            />
          )}

          {selectedMedia.type === "video" && (
            <video
              src={selectedMedia.url}
              controls
              autoPlay
              style={{
                maxWidth: "90%",
                maxHeight: "90%",
              }}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default PublicProfile;
