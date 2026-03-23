import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Compass, PlusSquare, FileText, User, ArrowRight, Loader2, Zap } from 'lucide-react';
import { motion } from 'motion/react';
import { supabase } from '../services/supabaseClient';
import { gigsService } from '../services/gigsService';
import { profilesService } from '../services/profilesService';
import GigCard from '../components/GigCard';
import ProfileCard from '../components/ProfileCard';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [recentGigs, setRecentGigs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setUser(session.user);
        const [profileRes, gigsRes] = await Promise.all([
          profilesService.getProfile(session.user.id),
          gigsService.getAllGigs()
        ]);
        if (profileRes.data) setProfile(profileRes.data);
        if (gigsRes.data) setRecentGigs(gigsRes.data.slice(0, 2));
      }
      setIsLoading(false);
    };
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-brand-gray dark:bg-brand-black transition-colors">
        <Loader2 className="w-10 h-10 animate-spin text-brand-purple" />
      </div>
    );
  }

  const stats = [
    { label: 'Gigs Applied', value: '8', color: 'brand' },
    { label: 'Gigs Posted', value: '3', color: 'green' },
    { label: 'Profile Views', value: '142', color: 'blue' }
  ];

  return (
    <div className="pt-24 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-screen bg-brand-gray dark:bg-brand-black transition-colors duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
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
          <header className="flex justify-between items-center lg:items-end mb-2 px-2">
            <div>
              <h1 className="text-3xl lg:text-4xl font-black text-brand-black dark:text-brand-white tracking-tight">Feed</h1>
              <p className="text-gray-700 dark:text-gray-200 text-sm lg:text-base font-medium">Latest opportunities for you</p>
            </div>
          </header>

          {/* Mobile Stats (Horizontal Scroll) */}
          <section className="lg:hidden flex gap-3 overflow-x-auto pb-4 no-scrollbar px-2">
            {stats.map((stat, i) => (
              <div key={i} className="bg-brand-white dark:bg-brand-dark-card rounded-[1.5rem] p-4 border border-brand-gray dark:border-brand-black shadow-md min-w-[140px] flex-shrink-0 transition-colors">
                <p className="text-gray-500 dark:text-gray-400 text-[10px] font-bold uppercase tracking-wider mb-1 opacity-60">{stat.label}</p>
                <p className="text-xl font-black text-brand-black dark:text-brand-white">{stat.value}</p>
              </div>
            ))}
          </section>

          {/* Feed Items */}
          <section className="space-y-4 lg:space-y-6">
            {recentGigs.map((gig, i) => (
              <motion.div
                key={gig.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <GigCard gig={gig} onViewDetails={(g) => navigate(`/gig/${g.id}`)} onApply={(id) => navigate(`/gig/${id}`)} />
              </motion.div>
            ))}
            
            {recentGigs.length === 0 && !isLoading && (
              <div className="bg-brand-white dark:bg-brand-dark-card rounded-[2.5rem] p-12 text-center border border-dashed border-brand-gray dark:border-brand-dark-card mx-2">
                <Compass className="w-12 h-12 text-brand-purple mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-bold text-brand-black dark:text-brand-white">No gigs found</h3>
                <p className="text-gray-700 dark:text-gray-200 text-sm mb-6">Try broadening your search or check back later.</p>
                <Link to="/browse" className="inline-flex items-center gap-2 text-brand-purple font-bold hover:underline">
                  Browse all gigs
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            )}
          </section>

          {/* Load More Placeholder */}
          <div className="py-8 text-center">
            <button className="text-brand-purple font-bold text-sm hover:underline active:scale-95 transition-transform">Load more opportunities</button>
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
