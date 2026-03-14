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
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
        <Loader2 className="w-10 h-10 animate-spin text-blue-500 dark:text-blue-400" />
      </div>
    );
  }

  const stats = [
    { label: 'Gigs Applied', value: '8', color: 'brand' },
    { label: 'Gigs Posted', value: '3', color: 'green' },
    { label: 'Profile Views', value: '142', color: 'blue' }
  ];

  return (
    <div className="pt-24 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Profile (Hidden on mobile, sidebar on desktop) */}
        <div className="hidden lg:block lg:col-span-3 space-y-6 sticky top-24 h-fit">
          <ProfileCard profile={profile} />
          
          <div className="bg-white dark:bg-gray-800 rounded-[2rem] p-4 shadow-md border border-gray-200 dark:border-gray-700 space-y-1 transition-colors">
            <h3 className="px-4 pt-2 pb-4 text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-[0.2em]">Quick Access</h3>
            <DashLink to="/overview" icon={<LayoutDashboard />} label="Overview" active />
            <DashLink to="/applications" icon={<FileText />} label="My Applications" />
            <DashLink to="/posted-gigs" icon={<PlusSquare />} label="My Posted Gigs" />
            <DashLink to="/edit-profile" icon={<User />} label="Edit Profile" />
          </div>

          {profile?.subscription_plan !== 'premium' && (
            <div className="bg-gray-900 dark:bg-blue-900/20 rounded-[2.5rem] p-6 text-white shadow-xl relative overflow-hidden group transition-colors">
              <div className="relative z-10">
                <h3 className="text-xl font-black mb-1">Go <span className="text-blue-400">Premium</span></h3>
                <p className="text-gray-400 text-xs mb-4">Unlock unlimited applications and priority ranking.</p>
                <Link to="/subscription" className="inline-flex items-center gap-2 bg-blue-500 dark:bg-blue-400 text-white dark:text-gray-900 px-5 py-2.5 rounded-xl font-bold text-xs hover:bg-blue-600 dark:hover:bg-blue-300 transition-all active:scale-95 shadow-lg shadow-blue-500/20">
                  Upgrade
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
              <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-blue-500 rounded-full opacity-10 blur-2xl group-hover:scale-150 transition-transform duration-700" />
            </div>
          )}
        </div>

        {/* Center Column: Main Feed */}
        <div className="lg:col-span-6 space-y-6">
          <header className="flex justify-between items-center lg:items-end mb-2 px-2">
            <div>
              <h1 className="text-3xl lg:text-4xl font-black text-gray-900 dark:text-gray-100 tracking-tight">Feed</h1>
              <p className="text-gray-700 dark:text-gray-200 text-sm lg:text-base font-medium">Latest opportunities for you</p>
            </div>
            <div className="lg:hidden">
              <span className="px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/40 shadow-sm">
                {profile?.subscription_plan || 'Starter'}
              </span>
            </div>
          </header>

          {/* Mobile Stats (Horizontal Scroll) */}
          <section className="lg:hidden flex gap-3 overflow-x-auto pb-4 no-scrollbar px-2">
            {stats.map((stat, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-[1.5rem] p-4 border border-gray-200 dark:border-gray-700 shadow-md min-w-[140px] flex-shrink-0 transition-colors">
                <p className="text-gray-500 dark:text-gray-400 text-[10px] font-bold uppercase tracking-wider mb-1 opacity-60">{stat.label}</p>
                <p className="text-xl font-black text-gray-900 dark:text-gray-100">{stat.value}</p>
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
              <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] p-12 text-center border border-dashed border-gray-300 dark:border-gray-700 mx-2">
                <Compass className="w-12 h-12 text-blue-400 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">No gigs found</h3>
                <p className="text-gray-700 dark:text-gray-200 text-sm mb-6">Try broadening your search or check back later.</p>
                <Link to="/browse" className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold hover:underline">
                  Browse all gigs
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            )}
          </section>

          {/* Load More Placeholder */}
          <div className="py-8 text-center">
            <button className="text-blue-600 dark:text-blue-400 font-bold text-sm hover:underline active:scale-95 transition-transform">Load more opportunities</button>
          </div>
        </div>

        {/* Right Column: Suggestions & Trending (Hidden on mobile) */}
        <div className="hidden lg:block lg:col-span-3 space-y-6 sticky top-24 h-fit">
          <div className="bg-white dark:bg-gray-800 rounded-[2rem] p-6 shadow-md border border-gray-200 dark:border-gray-700 transition-colors">
            <h3 className="text-[10px] font-black text-gray-900 dark:text-gray-100 uppercase tracking-[0.2em] mb-4">Trending Skills</h3>
            <div className="flex flex-wrap gap-2">
              {['Afrobeats', 'Music Production', 'Live Performance', 'Songwriting', 'Mixing'].map(skill => (
                <span key={skill} className="px-3 py-1.5 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-400 text-[10px] font-bold hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer transition-all border border-transparent hover:border-blue-100 dark:hover:border-blue-900/40">
                  #{skill.replace(' ', '')}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-[2rem] p-6 shadow-md border border-gray-200 dark:border-gray-700 transition-colors">
            <h3 className="text-[10px] font-black text-gray-900 dark:text-gray-100 uppercase tracking-[0.2em] mb-4">Top Creators</h3>
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex items-center gap-3 group cursor-pointer">
                  <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-xs border border-blue-100 dark:border-blue-900/40 group-hover:scale-110 transition-transform">
                    {String.fromCharCode(64 + i)}
                  </div>
                  <div className="flex-grow min-w-0">
                    <p className="text-xs font-bold text-gray-900 dark:text-gray-100 truncate">Creator Name {i}</p>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium">Music Professional</p>
                  </div>
                  <button className="text-blue-600 dark:text-blue-400 font-bold text-[10px] hover:underline whitespace-nowrap">Follow</button>
                </div>
              ))}
            </div>
            <button className="w-full mt-6 py-3 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-400 text-[10px] font-bold hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 transition-all border border-transparent hover:border-blue-100 dark:hover:border-blue-900/40">
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
        ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 shadow-sm border border-blue-100 dark:border-blue-900/40' 
        : 'text-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
    }`}
  >
    {React.cloneElement(icon, { className: 'w-5 h-5' })}
    {label}
  </Link>
);

export default Dashboard;
