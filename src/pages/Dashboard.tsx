import { SEO } from '../components/SEO';
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  PlusSquare, 
  FileText, 
  User, 
  Users, 
  UserCheck, 
  Loader2, 
  MapPin, 
  CheckCircle2, 
  TrendingUp, 
  Award, 
  Sparkles,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { supabase } from '../services/supabaseClient';
import { gigsService } from '../services/gigsService';
import { profilesService } from '../services/profilesService';
import { followsService } from '../services/followsService';
import { applicationsService } from '../services/applicationsService';
import { useModeration } from '../hooks/useModeration';
import GigDetailsModal from '../components/GigDetailsModal';
import CommunityFeed from '../components/CommunityFeed';
import GigsFeed from '../components/GigsFeed';
import { OnboardingPrompt } from '../components/OnboardingPrompt';
import { GIG_CATEGORIES } from '../utils/constants';
import { formatCurrency } from '../utils/helpers';
import { getCategoryConfig } from '../utils/categoryStyles';

const CreatorBadge = ({ type }: { type: string }) => {
  const configs: Record<string, { icon: any, color: string, bg: string }> = {
    'Verified': { icon: <CheckCircle2 className="w-3 h-3" />, color: 'text-brand-purple', bg: 'bg-brand-purple/10' },
    'Trending': { icon: <TrendingUp className="w-3 h-3" />, color: 'text-brand-purple', bg: 'bg-brand-purple/10' },
    'Top Performer': { icon: <Award className="w-3 h-3" />, color: 'text-brand-purple', bg: 'bg-brand-purple/10' },
  };

  const config = configs[type] || configs['Verified'];

  return (
    <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full ${config.bg} ${config.color} text-[9px] font-black uppercase tracking-wider`}>
      {config.icon}
      {type}
    </div>
  );
};

interface RecommendedGigCardProps {
  gig: any;
  onClick: () => void;
}

const RecommendedGigCard: React.FC<RecommendedGigCardProps> = ({ gig, onClick }) => {
  const mediaUrl = gig.image_url || gig.image || gig.media_url || gig.media || gig.cover_image;
  const categoryConfig = getCategoryConfig(gig.gig_category);
  const CategoryIcon = categoryConfig.icon;
  
  const isNew = (() => {
    if (!gig.created_at) return false;
    const createdDate = new Date(gig.created_at).getTime();
    return (Date.now() - createdDate) < 7 * 24 * 60 * 60 * 1000;
  })();

  return (
    <div
      onClick={onClick}
      className="group bg-white dark:bg-brand-dark-card rounded-2xl p-3.5 border border-gray-100 dark:border-brand-dark-card shadow-sm hover:shadow-md hover:-translate-y-1 hover:border-brand-purple/30 transition-all duration-200 cursor-pointer flex flex-col justify-between w-[240px] h-[280px] shrink-0 snap-start"
    >
      <div>
        {/* Soft category gradient tile with larger centered icon */}
        <div className={`relative aspect-[16/10] w-full rounded-xl overflow-hidden mb-3 bg-gradient-to-br ${categoryConfig.gradient} flex items-center justify-center`}>
          {mediaUrl ? (
            <img 
              src={mediaUrl} 
              alt={gig.title} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <CategoryIcon className="w-10 h-10 stroke-[1.75] transition-transform duration-300 group-hover:scale-110" />
          )}

          {isNew && (
            <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-brand-purple text-white text-[9px] font-black uppercase tracking-wider shadow-sm">
              New
            </span>
          )}
        </div>

        {/* Category pill */}
        <div className="mb-1.5">
          <span className={`inline-block px-2.5 py-0.5 rounded-full border text-[10px] font-bold truncate max-w-full ${categoryConfig.pillBg} ${categoryConfig.pillText}`}>
            {gig.gig_category || 'Gig'}
          </span>
        </div>

        {/* Title (max 2 lines) */}
        <h4 className="text-sm font-bold text-brand-black dark:text-white line-clamp-2 leading-snug group-hover:text-brand-purple transition-colors">
          {gig.title}
        </h4>
      </div>

      {/* Footer: Location (one line truncate) & Budget (whitespace-nowrap) */}
      <div className="pt-2 border-t border-gray-100 dark:border-zinc-800/60 mt-1 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1 text-[11px] text-gray-500 dark:text-gray-400 font-medium min-w-0 truncate">
          <MapPin className="w-3.5 h-3.5 text-brand-purple shrink-0" />
          <span className="truncate">{gig.location || 'Remote'}</span>
        </div>

        <span className="text-xs sm:text-sm font-black text-brand-black dark:text-white shrink-0 whitespace-nowrap">
          {formatCurrency(gig.budget || 0, gig.currency || 'USD')}
        </span>
      </div>
    </div>
  );
};

const Toggle = ({ activeTab, setActiveTab }: { activeTab: 'community' | 'gigs', setActiveTab: (v: 'community' | 'gigs') => void }) => {
  return (
    <div className="flex w-[260px] bg-gray-100 dark:bg-[#121214] rounded-full p-1 border border-gray-200 dark:border-[#1F1F23]/80 relative shrink-0">
      <button
        onClick={() => setActiveTab("community")}
        className={`relative flex-1 py-2 text-xs sm:text-sm font-bold rounded-full transition-all duration-200 z-10 outline-none ${
          activeTab === "community" ? "text-gray-900 dark:text-white" : "text-[#9CA3AF] hover:text-gray-900 dark:hover:text-gray-200"
        }`}
      >
        {activeTab === "community" && (
          <motion.div
            layoutId="dashboardTabIndicator"
            className="absolute inset-0 bg-white dark:bg-[#27272A] rounded-full shadow-md z-[-1]"
            transition={{ type: "spring", stiffness: 350, damping: 30 }}
          />
        )}
        <span className="relative z-10 inline-block active:scale-95">Community</span>
      </button>

      <button
        onClick={() => setActiveTab("gigs")}
        className={`relative flex-1 py-2 text-xs sm:text-sm font-bold rounded-full transition-all duration-200 z-10 outline-none ${
          activeTab === "gigs" ? "text-gray-900 dark:text-white" : "text-[#9CA3AF] hover:text-gray-900 dark:hover:text-gray-200"
        }`}
      >
        {activeTab === "gigs" && (
          <motion.div
            layoutId="dashboardTabIndicator"
            className="absolute inset-0 bg-white dark:bg-[#27272A] rounded-full shadow-md z-[-1]"
            transition={{ type: "spring", stiffness: 350, damping: 30 }}
          />
        )}
        <span className="relative z-10 inline-block active:scale-95">Gigs</span>
      </button>
    </div>
  );
};

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { isUserBlocked } = useModeration();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [gigs, setGigs] = useState<any[]>([]);
  const [appliedGigIds, setAppliedGigIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(8);
  const [selectedGig, setSelectedGig] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'community' | 'gigs'>('community');
  const [topCreators, setTopCreators] = useState<any[]>([]);

  // Horizontal scroll row ref & position tracking
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScrollPosition = () => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 5);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 5);
  };

  const scrollRow = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 256; // 240px card + 16px gap
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
      setTimeout(checkScrollPosition, 350);
    }
  };

  // Real Stats state
  const [stats, setStats] = useState<{
    postedGigs: number;
    applications: number;
    followers: number;
    following: number;
  }>({
    postedGigs: 0,
    applications: 0,
    followers: 0,
    following: 0,
  });
  const [statsLoading, setStatsLoading] = useState(true);

  // Top Creators Following state
  const [followingIds, setFollowingIds] = useState<Set<string>>(new Set());
  const [followLoadingIds, setFollowLoadingIds] = useState<Set<string>>(new Set());

  // Trending Skills state (real data from profiles, excluding Other)
  const [trendingSkills, setTrendingSkills] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          setUser(session.user);
          
          const [
            profileRes, 
            gigsRes, 
            followStats, 
            gigsCountRes, 
            appsCountRes, 
            skillsProfilesRes,
            appsRes,
            followsDataRes,
            profilesDataRes
          ] = await Promise.all([
            profilesService.getProfile(session.user.id),
            gigsService.getAllGigs(),
            followsService.getFollowStats(session.user.id),
            gigsService.getMyGigsCount(session.user.id),
            applicationsService.getMyApplicationsCount(session.user.id),
            supabase.from('profiles').select('skills').not('skills', 'is', null).limit(100),
            applicationsService.getMyApplications(session.user.id),
            supabase.from('follows').select('follower_id, following_id'),
            supabase.from('profiles').select('id, full_name, username, avatar_url, bio, skills, role, verification_status').not('full_name', 'is', null).limit(60)
          ]);
          
          if (profileRes.data) setProfile(profileRes.data);
          if (gigsRes.data) setGigs(gigsRes.data);
          if (appsRes.data) {
            setAppliedGigIds(new Set(appsRes.data.map((app: any) => app.gig_id)));
          }

          // Real Stats Row
          setStats({
            postedGigs: gigsCountRes.count,
            applications: appsCountRes.count,
            followers: followStats.followers,
            following: followStats.following,
          });
          setStatsLoading(false);

          // Task 3: Top Creators aggregation
          const followerCounts: Record<string, number> = {};
          const alreadyFollowingIds = new Set<string>();

          if (followsDataRes.data) {
            followsDataRes.data.forEach((f: any) => {
              if (f.following_id) {
                followerCounts[f.following_id] = (followerCounts[f.following_id] || 0) + 1;
              }
              if (f.follower_id === session.user.id && f.following_id) {
                alreadyFollowingIds.add(f.following_id);
              }
            });
          }

          const placeholderWords = ['test', 'demo', 'sample', 'placeholder', 'admin', 'new user', 'alex smith', 'john doe'];

          let candidates: any[] = [];
          if (profilesDataRes.data) {
            candidates = profilesDataRes.data.filter((p: any) => {
              // Exclude current user
              if (p.id === session.user.id) return false;
              // Exclude already followed
              if (alreadyFollowingIds.has(p.id)) return false;

              const fullName = (p.full_name || '').trim().toLowerCase();
              const username = (p.username || '').trim().toLowerCase();
              if (!fullName || !username) return false;
              if (placeholderWords.some(w => fullName.includes(w) || username.includes(w))) return false;

              // Completed profile: has name and avatar OR bio
              const hasAvatar = Boolean(p.avatar_url && p.avatar_url.trim());
              const hasBio = Boolean(p.bio && p.bio.trim());
              if (!hasAvatar && !hasBio) return false;

              return true;
            });

            // Sort: verified first, then by follower count descending
            candidates.sort((a: any, b: any) => {
              const aVer = a.verification_status?.toLowerCase() === 'verified' ? 1 : 0;
              const bVer = b.verification_status?.toLowerCase() === 'verified' ? 1 : 0;
              if (aVer !== bVer) return bVer - aVer;

              const aCount = followerCounts[a.id] || 0;
              const bCount = followerCounts[b.id] || 0;
              return bCount - aCount;
            });
          }

          setTopCreators(candidates.slice(0, 5));

          // Task 2: Real Trending Skills (excluding "Other" and generic terms)
          if (skillsProfilesRes?.data && skillsProfilesRes.data.length > 0) {
            const skillCounts: Record<string, number> = {};
            const excludedSkills = new Set([
              'other', 'others', 'none', 'n/a', 'na', 'general', 'unknown', 
              'null', 'undefined', 'skill', 'skills', 'etc'
            ]);

            skillsProfilesRes.data.forEach((row: any) => {
              if (Array.isArray(row.skills)) {
                row.skills.forEach((s: any) => {
                  if (typeof s === 'string' && s.trim()) {
                    const skill = s.trim();
                    const skillLower = skill.toLowerCase();
                    if (!excludedSkills.has(skillLower) && skill.length > 1) {
                      skillCounts[skill] = (skillCounts[skill] || 0) + 1;
                    }
                  }
                });
              }
            });

            const topSkills = Object.entries(skillCounts)
              .sort((a, b) => b[1] - a[1])
              .map(([skill]) => skill)
              .slice(0, 8);

            setTrendingSkills(topSkills);
          }
        }
      } catch (err) {
        console.error('Error fetching data on dashboard mount:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const refreshProfileOnly = async () => {
    if (user?.id) {
      const profileRes = await profilesService.getProfile(user.id);
      if (profileRes.data) setProfile(profileRes.data);
    } else {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.id) {
        const profileRes = await profilesService.getProfile(session.user.id);
        if (profileRes.data) setProfile(profileRes.data);
      }
    }
  };

  useEffect(() => {
    window.addEventListener('profile-updated', refreshProfileOnly);
    return () => window.removeEventListener('profile-updated', refreshProfileOnly);
  }, [user]);

  const handleToggleFollow = async (e: React.MouseEvent, creatorId: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user?.id) {
      navigate('/login');
      return;
    }

    const isCurrentlyFollowing = followingIds.has(creatorId);
    setFollowLoadingIds(prev => new Set(prev).add(creatorId));

    // Optimistic UI Update
    setFollowingIds(prev => {
      const next = new Set(prev);
      if (isCurrentlyFollowing) next.delete(creatorId);
      else next.add(creatorId);
      return next;
    });

    setStats(prev => ({
      ...prev,
      following: isCurrentlyFollowing ? Math.max(0, prev.following - 1) : prev.following + 1
    }));

    const { error } = await followsService.toggleFollow(user.id, creatorId, isCurrentlyFollowing);
    if (error) {
      // Revert on error
      setFollowingIds(prev => {
        const next = new Set(prev);
        if (isCurrentlyFollowing) next.add(creatorId);
        else next.delete(creatorId);
        return next;
      });
      setStats(prev => ({
        ...prev,
        following: isCurrentlyFollowing ? prev.following + 1 : Math.max(0, prev.following - 1)
      }));
    }

    setFollowLoadingIds(prev => {
      const next = new Set(prev);
      next.delete(creatorId);
      return next;
    });
  };

  const handleViewDetails = (gig: any) => {
    setSelectedGig(gig);
    setIsModalOpen(true);
  };

  const handleApply = (id: string) => {
    navigate(`/gig/${id}`);
  };

  // Filter out blocked users from top creators
  const visibleTopCreators = useMemo(() => {
    return topCreators.filter(c => !isUserBlocked(c.id));
  }, [topCreators, isUserBlocked]);

  // Task 6: Greeting with first word of full_name; fall back to username; never show "undefined"
  const firstName = (() => {
    const rawFullName = profile?.full_name?.trim() || user?.user_metadata?.full_name?.trim() || '';
    if (rawFullName && rawFullName.toLowerCase() !== 'undefined') {
      const firstWord = rawFullName.split(/\s+/)[0];
      if (firstWord && firstWord.toLowerCase() !== 'undefined') {
        return firstWord;
      }
    }
    const rawUsername = profile?.username?.trim() || user?.user_metadata?.username?.trim() || '';
    if (rawUsername && rawUsername.toLowerCase() !== 'undefined') {
      return rawUsername;
    }
    return '';
  })();

  // Task 1: Recommended for you sorting (matching user category/skills first, then newest, max 8)
  const recommendedGigs = useMemo(() => {
    if (!gigs || gigs.length === 0) return [];

    const userSkills: string[] = Array.isArray(profile?.skills) 
      ? profile.skills.map((s: string) => s.toLowerCase().trim()) 
      : [];
    const userRole = (profile?.role || '').toLowerCase().trim();

    // Filter blocked creators
    const unblockedGigs = gigs.filter(g => {
      const posterId = g.poster_id?.id || g.poster_id?.user_id;
      return !posterId || !isUserBlocked(posterId);
    });

    const sorted = [...unblockedGigs].sort((a, b) => {
      const aCat = (a.gig_category || '').toLowerCase().trim();
      const bCat = (b.gig_category || '').toLowerCase().trim();

      const aMatches = (userRole && aCat.includes(userRole)) ||
        userSkills.some(s => aCat.includes(s) || (Array.isArray(a.skills) && a.skills.some((ask: string) => ask.toLowerCase().includes(s))));

      const bMatches = (userRole && bCat.includes(userRole)) ||
        userSkills.some(s => bCat.includes(s) || (Array.isArray(b.skills) && b.skills.some((bsk: string) => bsk.toLowerCase().includes(s))));

      if (aMatches && !bMatches) return -1;
      if (!aMatches && bMatches) return 1;

      // Otherwise newest first
      const aTime = new Date(a.created_at || 0).getTime();
      const bTime = new Date(b.created_at || 0).getTime();
      return bTime - aTime;
    });

    return sorted.slice(0, 8);
  }, [gigs, profile, isUserBlocked]);

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;

    checkScrollPosition();
    el.addEventListener('scroll', checkScrollPosition, { passive: true });
    window.addEventListener('resize', checkScrollPosition);

    return () => {
      el.removeEventListener('scroll', checkScrollPosition);
      window.removeEventListener('resize', checkScrollPosition);
    };
  }, [recommendedGigs]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-brand-gray dark:bg-brand-black transition-colors">
        <Loader2 className="w-10 h-10 animate-spin text-brand-purple" />
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-7xl mx-auto pt-[calc(6.5rem+env(safe-area-inset-top))] pb-12 px-6 lg:px-8 min-h-screen transition-colors duration-500">
      <SEO title="Dashboard | GigsConnect" noindex={true} />
      
      {/* Background ambient glow */}
      <div className="fixed inset-0 pointer-events-none -z-10 bg-brand-gray dark:bg-[#0a0a0c]">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-brand-purple/5 sm:bg-brand-purple/10 blur-[120px] rounded-full opacity-50 dark:opacity-20 hidden sm:block"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
      </div>

      <div className="space-y-8 relative z-0">
        
        {/* Welcome Header */}
        <header className="px-1 pt-1 sm:pt-2">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-brand-black dark:text-brand-white tracking-tight">
            {firstName ? `Welcome back, ${firstName} 👋` : 'Welcome back 👋'}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base font-medium mt-1">
            Discover opportunities. Connect. Get paid.
          </p>
        </header>

        {/* 4-Card Stats Row (4th card PURPLE) */}
        <div>
          {statsLoading ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white dark:bg-brand-dark-card rounded-2xl p-4 border border-gray-100 dark:border-brand-dark-card shadow-sm animate-pulse flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-gray-200 dark:bg-zinc-800 shrink-0" />
                  <div className="space-y-1.5 flex-1">
                    <div className="w-8 h-5 bg-gray-200 dark:bg-zinc-800 rounded" />
                    <div className="w-16 h-3 bg-gray-200 dark:bg-zinc-800 rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {/* 1. Posted Gigs */}
              <Link 
                to="/posted-gigs" 
                className="bg-white dark:bg-brand-dark-card rounded-2xl p-4 border border-gray-100 dark:border-brand-dark-card shadow-sm hover:shadow-md hover:border-brand-purple/30 transition-all group flex items-center gap-3.5 active:scale-[0.98]"
              >
                <div className="w-11 h-11 rounded-xl bg-brand-purple/10 text-brand-purple flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <PlusSquare className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="text-xl sm:text-2xl font-black text-brand-black dark:text-brand-white leading-tight">
                    {stats.postedGigs}
                  </div>
                  <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 truncate">
                    Posted Gigs
                  </div>
                </div>
              </Link>

              {/* 2. Applications */}
              <Link 
                to="/applications" 
                className="bg-white dark:bg-brand-dark-card rounded-2xl p-4 border border-gray-100 dark:border-brand-dark-card shadow-sm hover:shadow-md hover:border-blue-500/30 transition-all group flex items-center gap-3.5 active:scale-[0.98]"
              >
                <div className="w-11 h-11 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="text-xl sm:text-2xl font-black text-brand-black dark:text-brand-white leading-tight">
                    {stats.applications}
                  </div>
                  <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 truncate">
                    Applications
                  </div>
                </div>
              </Link>

              {/* 3. Followers */}
              <Link 
                to={user?.id ? `/profile/${user.id}` : "/edit-profile"} 
                className="bg-white dark:bg-brand-dark-card rounded-2xl p-4 border border-gray-100 dark:border-brand-dark-card shadow-sm hover:shadow-md hover:border-emerald-500/30 transition-all group flex items-center gap-3.5 active:scale-[0.98]"
              >
                <div className="w-11 h-11 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <Users className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="text-xl sm:text-2xl font-black text-brand-black dark:text-brand-white leading-tight">
                    {stats.followers}
                  </div>
                  <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 truncate">
                    Followers
                  </div>
                </div>
              </Link>

              {/* 4. Following (PURPLE CARD) */}
              <Link 
                to={user?.id ? `/profile/${user.id}` : "/edit-profile"} 
                className="bg-brand-purple text-white rounded-2xl p-4 shadow-md shadow-brand-purple/20 hover:bg-brand-purple-hover hover:shadow-lg transition-all group flex items-center gap-3.5 active:scale-[0.98]"
              >
                <div className="w-11 h-11 rounded-xl bg-white/20 text-white flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform backdrop-blur-sm">
                  <UserCheck className="w-5 h-5 text-white" />
                </div>
                <div className="min-w-0">
                  <div className="text-xl sm:text-2xl font-black text-white leading-tight">
                    {stats.following}
                  </div>
                  <div className="text-xs font-semibold text-white/90 truncate">
                    Following
                  </div>
                </div>
              </Link>
            </div>
          )}
        </div>

        {/* Task 5: Explore by category chip row (with Briefcase icon for Other/unknown) */}
        <section className="space-y-3">
          <div className="flex justify-between items-center px-1">
            <h2 className="text-lg sm:text-xl font-black text-brand-black dark:text-brand-white tracking-tight">
              Explore by category
            </h2>
            <Link to="/browse" className="text-xs font-bold text-brand-purple hover:underline">
              All categories
            </Link>
          </div>
          <div className="flex gap-2.5 overflow-x-auto pb-2 no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
            {GIG_CATEGORIES.map((cat) => {
              const config = getCategoryConfig(cat);
              const Icon = config.icon;
              return (
                <Link
                  key={cat}
                  to={`/browse?category=${encodeURIComponent(cat)}`}
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-bold bg-white dark:bg-brand-dark-card border border-gray-100 dark:border-brand-dark-card text-gray-700 dark:text-gray-300 hover:border-brand-purple/40 hover:bg-brand-purple/5 hover:text-brand-purple dark:hover:text-brand-purple-light shadow-sm transition-all whitespace-nowrap active:scale-95 shrink-0 group"
                >
                  <Icon className="w-3.5 h-3.5 text-brand-purple shrink-0 group-hover:scale-110 transition-transform" />
                  <span>{cat}</span>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Task 1: Recommended for you (between Explore by category and Activity Feed) */}
        {loading ? (
          <section className="space-y-3">
            <div className="flex justify-between items-center px-1">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-brand-purple" />
                <h2 className="text-lg sm:text-xl font-black text-brand-black dark:text-brand-white tracking-tight">
                  Recommended for you
                </h2>
              </div>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-3 pt-1 no-scrollbar snap-x -mx-4 px-4 sm:mx-0 sm:px-0">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="w-[240px] h-[280px] rounded-2xl bg-white dark:bg-brand-dark-card border border-gray-100 dark:border-brand-dark-card p-3.5 animate-pulse flex flex-col justify-between shrink-0">
                  <div>
                    <div className="aspect-[16/10] w-full rounded-xl bg-gray-200 dark:bg-zinc-800 mb-3" />
                    <div className="w-16 h-4 rounded-full bg-gray-200 dark:bg-zinc-800 mb-2" />
                    <div className="w-full h-4 rounded bg-gray-200 dark:bg-zinc-800 mb-1" />
                    <div className="w-2/3 h-4 rounded bg-gray-200 dark:bg-zinc-800" />
                  </div>
                  <div className="flex justify-between items-center pt-2">
                    <div className="w-16 h-3 rounded bg-gray-200 dark:bg-zinc-800" />
                    <div className="w-14 h-4 rounded bg-gray-200 dark:bg-zinc-800" />
                  </div>
                </div>
              ))}
            </div>
          </section>
        ) : recommendedGigs.length > 0 ? (
          <section className="space-y-3">
            <div className="flex justify-between items-center px-1">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-brand-purple" />
                <h2 className="text-lg sm:text-xl font-black text-brand-black dark:text-brand-white tracking-tight">
                  Recommended for you
                </h2>
              </div>
              <Link to="/browse" className="text-xs font-bold text-brand-purple hover:underline">
                View all
              </Link>
            </div>
            
            {/* Horizontal row with desktop scroll buttons (Task 2) */}
            <div className="relative group/scroll">
              {canScrollLeft && (
                <button
                  type="button"
                  onClick={() => scrollRow('left')}
                  className="hidden lg:flex absolute left-2 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white/95 dark:bg-brand-dark-card/95 backdrop-blur-sm border border-gray-200/80 dark:border-zinc-700/80 shadow-lg shadow-black/10 dark:shadow-black/40 items-center justify-center text-gray-700 dark:text-gray-200 hover:text-brand-purple hover:scale-105 active:scale-95 transition-all opacity-0 group-hover/scroll:opacity-100 focus:opacity-100 cursor-pointer"
                  aria-label="Scroll left"
                >
                  <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
                </button>
              )}

              <div 
                ref={scrollContainerRef}
                className="flex gap-4 overflow-x-auto pb-3 pt-1 no-scrollbar snap-x -mx-4 px-4 sm:mx-0 sm:px-0 scroll-smooth"
              >
                {recommendedGigs.map((gig) => (
                  <RecommendedGigCard 
                    key={gig.id} 
                    gig={gig} 
                    onClick={() => handleViewDetails(gig)} 
                  />
                ))}
              </div>

              {canScrollRight && (
                <button
                  type="button"
                  onClick={() => scrollRow('right')}
                  className="hidden lg:flex absolute right-2 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white/95 dark:bg-brand-dark-card/95 backdrop-blur-sm border border-gray-200/80 dark:border-zinc-700/80 shadow-lg shadow-black/10 dark:shadow-black/40 items-center justify-center text-gray-700 dark:text-gray-200 hover:text-brand-purple hover:scale-105 active:scale-95 transition-all opacity-0 group-hover/scroll:opacity-100 focus:opacity-100 cursor-pointer"
                  aria-label="Scroll right"
                >
                  <ChevronRight className="w-4 h-4 stroke-[2.5]" />
                </button>
              )}
            </div>
          </section>
        ) : null}

        {/* Main Feed + Right Sidebar Grid (Task 3 & Task 4) */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 pt-2">
          
          {/* Main Feed Column */}
          <div className="xl:col-span-8 space-y-6 min-w-0">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center px-1 gap-4">
              <div>
                <h3 className="text-xl font-black text-brand-black dark:text-brand-white tracking-tight">Activity Feed</h3>
                <p className="text-gray-500 dark:text-gray-400 text-xs font-medium">Join conversations and discover new listings</p>
              </div>
              <Toggle activeTab={activeTab} setActiveTab={setActiveTab} />
            </div>

            {profile && (
              <OnboardingPrompt profile={profile} onRefresh={refreshProfileOnly} />
            )}

            {/* Feed Items (full width, aligned with heading) */}
            <div className="w-full">
              <AnimatePresence mode="wait">
                {activeTab === "community" ? (
                  <motion.div
                    key="community"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.3 }}
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    onDragEnd={(_event, info) => {
                      if (info.offset.x < -50) {
                        setActiveTab("gigs"); // swipe left
                      }
                    }}
                    className="w-full"
                  >
                    <CommunityFeed />
                  </motion.div>
                ) : (
                  <motion.div
                    key="gigs"
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 50 }}
                    transition={{ duration: 0.3 }}
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    onDragEnd={(_event, info) => {
                      if (info.offset.x > 50) {
                        setActiveTab("community"); // swipe right
                      }
                    }}
                    className="w-full"
                  >
                    <GigsFeed
                      gigs={gigs}
                      visibleCount={visibleCount}
                      setVisibleCount={setVisibleCount}
                      loading={loading}
                      handleViewDetails={handleViewDetails}
                      handleApply={handleApply}
                      appliedGigIds={appliedGigIds}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Task 3: Right Column: Top Creators & Trending Skills (xl and up only, sticky) */}
          <div className="hidden xl:block xl:col-span-4 space-y-6 sticky top-24 h-fit min-w-0">
            {/* Top Creators (real profiles, verified first, fill with most-followed, non-followed, max 5) */}
            {visibleTopCreators.length > 0 && (
              <div className="bg-white dark:bg-brand-dark-card rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-brand-dark-card transition-colors">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-[0.2em]">Top Creators</h3>
                  <Link to="/featured-creators" className="text-[10px] font-bold text-brand-purple hover:underline">
                    View all
                  </Link>
                </div>
                <div className="space-y-3.5">
                  {visibleTopCreators.map(creator => (
                    <div key={creator.id} className="flex items-center gap-3 group">
                      <Link to={`/profile/${creator.id}`} className="shrink-0">
                        {creator.avatar_url ? (
                          <img 
                            src={creator.avatar_url} 
                            alt={creator.full_name} 
                            className="w-10 h-10 rounded-full object-cover shadow-sm group-hover:scale-105 transition-transform"
                            referrerPolicy="no-referrer" 
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-brand-purple/10 flex items-center justify-center text-brand-purple font-bold text-xs">
                            <User className="w-5 h-5" />
                          </div>
                        )}
                      </Link>
                      <div className="flex-grow min-w-0">
                        <Link to={`/profile/${creator.id}`}>
                          <p className="text-xs font-bold text-brand-black dark:text-brand-white truncate hover:text-brand-purple transition-colors">
                            {creator.full_name}
                          </p>
                        </Link>
                        <p className="text-[11px] text-gray-500 dark:text-gray-400 font-medium truncate">
                          {creator.role || (Array.isArray(creator.skills) && creator.skills.length > 0 ? creator.skills[0] : 'Creator')}
                        </p>
                      </div>
                      <button 
                        onClick={(e) => handleToggleFollow(e, creator.id)}
                        disabled={followLoadingIds.has(creator.id)}
                        className={`px-3 py-1 rounded-full text-xs font-bold transition-all whitespace-nowrap active:scale-95 shrink-0 ${
                          followingIds.has(creator.id)
                            ? 'bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-zinc-700'
                            : 'bg-brand-purple text-white hover:bg-brand-purple-hover shadow-sm'
                        }`}
                      >
                        {followingIds.has(creator.id) ? 'Following' : 'Follow'}
                      </button>
                    </div>
                  ))}
                </div>
                <Link 
                  to="/featured-creators" 
                  className="w-full mt-5 py-2.5 block text-center rounded-xl bg-brand-gray dark:bg-brand-black text-brand-black dark:text-gray-300 text-xs font-bold hover:bg-brand-purple/5 dark:hover:bg-brand-purple/10 hover:text-brand-purple transition-all border border-gray-100 dark:border-brand-dark-card"
                >
                  View more
                </Link>
              </div>
            )}

            {/* Trending Skills (Real data only, excluding Other, hidden if empty) */}
            {trendingSkills.length > 0 && (
              <div className="bg-white dark:bg-brand-dark-card rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-brand-dark-card transition-colors">
                <h3 className="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-[0.2em] mb-3">Trending Skills</h3>
                <div className="flex flex-wrap gap-1.5">
                  {trendingSkills.map(skill => (
                    <Link 
                      key={skill} 
                      to={`/browse?q=${encodeURIComponent(skill)}`}
                      className="px-3 py-1.5 rounded-xl bg-brand-gray dark:bg-brand-black text-brand-black dark:text-gray-300 text-xs font-semibold hover:bg-brand-purple/10 hover:text-brand-purple cursor-pointer transition-all border border-gray-100 dark:border-zinc-800"
                    >
                      #{skill.replace(/\s+/g, '')}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

        </div>

      </div>

      <GigDetailsModal 
        gig={selectedGig}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onApply={handleApply}
        isApplied={selectedGig ? appliedGigIds.has(selectedGig.id) : false}
      />
    </div>
  );
};

export default Dashboard;
