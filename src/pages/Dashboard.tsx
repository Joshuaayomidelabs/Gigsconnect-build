import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Compass, PlusSquare, FileText, User, ArrowRight, Loader2, Zap, MapPin, CheckCircle2, TrendingUp, Award, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { supabase } from '../services/supabaseClient';
import { gigsService } from '../services/gigsService';
import { profilesService } from '../services/profilesService';
import { communityService } from '../services/communityService';
import GigCard from '../components/GigCard';
import ProfileCard from '../components/ProfileCard';
import GigDetailsModal from '../components/GigDetailsModal';
import PostCard from '../components/PostCard';
import CommunityFeed from '../components/CommunityFeed';
import GigsFeed from '../components/GigsFeed';

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

const Toggle = ({ activeTab, setActiveTab }: { activeTab: 'community' | 'gigs', setActiveTab: (v: 'community' | 'gigs') => void }) => {
  return (
    <div className="flex w-[280px] mx-auto sm:mx-0 bg-gray-100 dark:bg-[#121214] rounded-full p-1 border border-gray-200 dark:border-[#1F1F23]/80 mb-6 relative">
      <button
        onClick={() => setActiveTab("community")}
        className={`relative flex-1 py-2.5 text-sm font-bold rounded-full transition-all duration-200 z-10 outline-none ${
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
        <span className="relative z-10 transition-transform duration-200 inline-block active:scale-95">Community</span>
      </button>

      <button
        onClick={() => setActiveTab("gigs")}
        className={`relative flex-1 py-2.5 text-sm font-bold rounded-full transition-all duration-200 z-10 outline-none ${
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
        <span className="relative z-10 transition-transform duration-200 inline-block active:scale-95">Gigs</span>
      </button>
    </div>
  );
};

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [gigs, setGigs] = useState<any[]>([]);
  const [appliedGigIds, setAppliedGigIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(8);
  const [selectedGig, setSelectedGig] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'community' | 'gigs'>('community');
  const [featuredCreators, setFeaturedCreators] = useState<any[]>([]);

  console.log("ACTIVE TAB:", activeTab);

  useEffect(() => {
    const fetchData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        console.log('Dashboard: Fetching data for User ID:', session.user.id);
        setUser(session.user);
        
        // Fetch applied gig IDs
        const { data: applications } = await supabase
          .from('applications')
          .select('gig_id')
          .eq('applicant_id', session.user.id);
        
        if (applications) {
          setAppliedGigIds(new Set(applications.map(app => app.gig_id)));
        }

        const [profileRes, gigsRes, creatorsRes] = await Promise.all([
          profilesService.getProfile(session.user.id),
          gigsService.getAllGigs(),
          supabase.from('profiles').select('*').eq('verification_status', 'verified').limit(10)
        ]);
        
        if (profileRes.data) setProfile(profileRes.data);
        if (gigsRes.data) setGigs(gigsRes.data);
        if (creatorsRes.data) setFeaturedCreators(creatorsRes.data);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleViewDetails = (gig: any) => {
    setSelectedGig(gig);
    setIsModalOpen(true);
  };

  const handleApply = (id: string) => {
    navigate(`/gig/${id}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-brand-gray dark:bg-brand-black transition-colors">
        <Loader2 className="w-10 h-10 animate-spin text-brand-purple" />
      </div>
    );
  }

  return (
    <div className="relative pt-24 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-screen transition-colors duration-500">
      
      {/* Background glow effects to make glass cards pop */}
      <div className="fixed inset-0 pointer-events-none -z-10 bg-brand-gray dark:bg-[#0a0a0c]">
        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-brand-purple/5 sm:bg-brand-purple/10 blur-[120px] rounded-full opacity-50 dark:opacity-20 hidden sm:block"></div>
        {/* Subtle Grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-0">
        
        {/* Left Column: Profile (Hidden on mobile, sidebar on desktop) */}
        <div className="hidden lg:block lg:col-span-3 space-y-6 sticky top-24 h-fit">
          <ProfileCard profile={profile} />
          
          <div className="bg-brand-white dark:bg-brand-dark-card rounded-[2rem] p-4 shadow-md border border-brand-gray dark:border-brand-black space-y-1 transition-colors">
            <h3 className="px-4 pt-2 pb-4 text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-[0.2em]">Quick Access</h3>
            <DashLink to="/overview" icon={<LayoutDashboard />} label="Overview" active />
            <DashLink to="/applications" icon={<FileText />} label="My Applications" />
            <DashLink to="/posted-gigs" icon={<PlusSquare />} label="My Posted Gigs" />
            <DashLink to="/edit-profile" icon={<User />} label="Edit Profile" />
          </div>
        </div>

        {/* Center Column: Main Feed */}
        <div className="lg:col-span-6 space-y-6">
          <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2 px-2 gap-4">
            <div>
              <h1 className="text-3xl lg:text-4xl font-black text-brand-black dark:text-brand-white tracking-tight">Feed</h1>
              <p className="text-gray-700 dark:text-gray-200 text-sm lg:text-base font-medium">Latest opportunities for you</p>
            </div>
            
            {/* Toggle Switch */}
            <Toggle activeTab={activeTab} setActiveTab={setActiveTab} />
          </header>

          {/* Featured Creators (Horizontal Scroll) */}
          <section className="space-y-3">
            <div className="flex justify-between items-center px-2">
              <h3 className="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-[0.2em]">Featured Creators</h3>
              <button className="text-[10px] font-black text-brand-purple uppercase tracking-widest hover:underline">View All</button>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar px-2 snap-x">
              {featuredCreators.map((creator) => (
                <Link 
                  to={`/profile/${creator.id}`}
                  key={creator.id} 
                  className="bg-brand-white dark:bg-brand-dark-card rounded-[2rem] p-5 border border-brand-gray dark:border-brand-black shadow-soft min-w-[240px] flex-shrink-0 transition-all hover:shadow-md snap-start group block cursor-pointer"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="relative">
                      {creator.avatar_url ? (
                        <img 
                          src={creator.avatar_url} 
                          alt={creator.full_name} 
                          className="w-14 h-14 rounded-2xl object-cover shadow-sm group-hover:scale-105 transition-transform duration-300"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="w-14 h-14 rounded-2xl bg-brand-purple/10 flex items-center justify-center text-brand-purple">
                          <User className="w-6 h-6" />
                        </div>
                      )}
                      
                      <div className="absolute -bottom-1 -right-1 bg-brand-purple text-white p-1 rounded-lg shadow-sm">
                        <Zap className="w-3 h-3 fill-current" />
                      </div>
                    </div>
                    <div className="flex-grow min-w-0">
                      <h4 className="text-base font-black text-brand-black dark:text-brand-white truncate">{creator.full_name}</h4>
                      <p className="text-xs font-bold text-brand-purple mb-1">{(creator.skills && creator.skills.length > 0) ? creator.skills[0] : 'Creator'}</p>
                      <div className="flex items-center gap-1 text-[10px] text-gray-500 dark:text-gray-400 font-medium">
                        <MapPin className="w-3 h-3" />
                        {[creator.city, creator.country].filter(Boolean).join(', ') || 'Unknown'}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between gap-3 mt-auto">
                    <CreatorBadge type="Verified" />
                    <div className="flex gap-2">
                      <div className="p-2 rounded-xl bg-brand-gray dark:bg-brand-black text-brand-black dark:text-brand-white group-hover:bg-brand-purple/10 group-hover:text-brand-purple transition-all flex items-center justify-center">
                        <MessageSquare className="w-4 h-4" />
                      </div>
                      <div className="px-4 py-2 rounded-xl bg-brand-purple text-white text-[10px] font-black uppercase tracking-widest group-hover:bg-brand-purple-dark transition-all shadow-glow flex items-center justify-center">
                        Profile
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* Feed Items */}
          <div className="-mx-4 sm:mx-0">
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
                  onDragEnd={(event, info) => {
                    if (info.offset.x < -50) {
                      setActiveTab("gigs"); // swipe left
                    }
                  }}
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
                  onDragEnd={(event, info) => {
                    if (info.offset.x > 50) {
                      setActiveTab("community"); // swipe right
                    }
                  }}
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

        {/* Right Column: Suggestions & Trending (Hidden on mobile) */}
        <div className="hidden lg:block lg:col-span-3 space-y-6 sticky top-24 h-fit">
          <div className="bg-brand-white dark:bg-brand-dark-card rounded-[2rem] p-6 shadow-md border border-brand-gray dark:border-brand-black transition-colors">
            <h3 className="text-[10px] font-black text-brand-black dark:text-brand-white uppercase tracking-[0.2em] mb-4">Trending Skills</h3>
            <div className="flex flex-wrap gap-2">
              {['Afrobeats', 'Music Production', 'Live Performance', 'Songwriting', 'Mixing'].map(skill => (
                <span key={skill} className="px-3 py-1.5 rounded-xl bg-brand-gray dark:bg-brand-black text-brand-black dark:text-gray-400 text-[10px] font-bold hover:bg-brand-purple/5 dark:hover:bg-brand-purple/10 hover:text-brand-purple cursor-pointer transition-all border border-transparent hover:border-brand-purple/10 dark:hover:border-brand-purple/20">
                  #{skill.replace(' ', '')}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-brand-white dark:bg-brand-dark-card rounded-[2rem] p-6 shadow-md border border-brand-gray dark:border-brand-black transition-colors">
            <h3 className="text-[10px] font-black text-brand-black dark:text-brand-white uppercase tracking-[0.2em] mb-4">Top Creators</h3>
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex items-center gap-3 group cursor-pointer">
                  <div className="w-10 h-10 rounded-full bg-brand-purple/5 dark:bg-brand-purple/10 flex items-center justify-center text-brand-purple font-bold text-xs border border-brand-purple/10 dark:border-brand-purple/20 group-hover:scale-110 transition-transform">
                    {String.fromCharCode(64 + i)}
                  </div>
                  <div className="flex-grow min-w-0">
                    <p className="text-xs font-bold text-brand-black dark:text-brand-white truncate">Creator Name {i}</p>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium">Music Professional</p>
                  </div>
                  <button className="text-brand-purple font-bold text-[10px] hover:underline whitespace-nowrap">Follow</button>
                </div>
              ))}
            </div>
            <button className="w-full mt-6 py-3 rounded-xl bg-brand-gray dark:bg-brand-black text-brand-black dark:text-gray-400 text-[10px] font-bold hover:bg-brand-purple/5 dark:hover:bg-brand-purple/10 hover:text-brand-purple transition-all border border-transparent hover:border-brand-purple/10 dark:hover:border-brand-purple/20">
              View more
            </button>
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

const DashLink = ({ to, icon, label, active = false }: { to: string, icon: React.ReactElement, label: string, active?: boolean }) => (
  <Link 
    to={to} 
    className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${
      active 
        ? 'bg-brand-purple/5 dark:bg-brand-purple/10 text-brand-purple shadow-sm border border-brand-purple/10' 
        : 'text-gray-700 dark:text-gray-400 hover:bg-brand-gray dark:hover:bg-brand-black hover:text-brand-black dark:hover:text-brand-white'
    }`}
  >
    {React.cloneElement(icon, { className: 'w-5 h-5' })}
    {label}
  </Link>
);

export default Dashboard;
