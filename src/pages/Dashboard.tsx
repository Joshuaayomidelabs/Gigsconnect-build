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
      <div className="flex items-center justify-center min-h-screen bg-brand-gray">
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
    <div className="pt-24 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-screen bg-brand-gray">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Profile (Hidden on mobile, sidebar on desktop) */}
        <div className="hidden lg:block lg:col-span-3 space-y-6 sticky top-24 h-fit">
          <ProfileCard profile={profile} />
          
          <div className="bg-white rounded-[2rem] p-4 shadow-sm border border-brand-purple-light/10 space-y-1">
            <h3 className="px-4 pt-2 pb-4 text-[10px] font-black text-brand-gray-dark uppercase tracking-[0.2em]">Quick Access</h3>
            <DashLink to="/dashboard" icon={<LayoutDashboard />} label="Overview" active />
            <DashLink to="/applications" icon={<FileText />} label="My Applications" />
            <DashLink to="/my-gigs" icon={<PlusSquare />} label="My Posted Gigs" />
            <DashLink to="/profile" icon={<User />} label="Edit Profile" />
          </div>

          {profile?.subscription_plan !== 'premium' && (
            <div className="bg-brand-black rounded-[2.5rem] p-6 text-white shadow-xl relative overflow-hidden group">
              <div className="relative z-10">
                <h3 className="text-xl font-black mb-1">Go <span className="text-brand-purple">Premium</span></h3>
                <p className="text-brand-gray-dark text-xs mb-4">Unlock unlimited applications and priority ranking.</p>
                <Link to="/subscription" className="inline-flex items-center gap-2 bg-brand-purple text-white px-5 py-2.5 rounded-xl font-bold text-xs hover:bg-brand-purple-dark transition-all active:scale-95 shadow-lg shadow-purple-500/20">
                  Upgrade
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
              <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-brand-purple rounded-full opacity-10 blur-2xl group-hover:scale-150 transition-transform duration-700" />
            </div>
          )}
        </div>

        {/* Center Column: Main Feed */}
        <div className="lg:col-span-6 space-y-6">
          <header className="flex justify-between items-center lg:items-end mb-2 px-2">
            <div>
              <h1 className="text-3xl lg:text-4xl font-black text-brand-black tracking-tight">Feed</h1>
              <p className="text-brand-gray-dark text-sm lg:text-base font-medium">Latest opportunities for you</p>
            </div>
            <div className="lg:hidden">
              <span className="px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest bg-brand-purple-soft text-brand-purple border border-brand-purple-light/20 shadow-sm">
                {profile?.subscription_plan || 'Starter'}
              </span>
            </div>
          </header>

          {/* Mobile Stats (Horizontal Scroll) */}
          <section className="lg:hidden flex gap-3 overflow-x-auto pb-4 no-scrollbar px-2">
            {stats.map((stat, i) => (
              <div key={i} className="bg-white rounded-[1.5rem] p-4 border border-brand-purple-light/5 shadow-sm min-w-[140px] flex-shrink-0">
                <p className="text-brand-gray-dark text-[10px] font-bold uppercase tracking-wider mb-1 opacity-60">{stat.label}</p>
                <p className="text-xl font-black text-brand-black">{stat.value}</p>
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
              <div className="bg-white rounded-[2.5rem] p-12 text-center border border-dashed border-brand-purple-light/30 mx-2">
                <Compass className="w-12 h-12 text-brand-purple-light mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-bold text-brand-black">No gigs found</h3>
                <p className="text-brand-gray-dark text-sm mb-6">Try broadening your search or check back later.</p>
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
          <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-brand-purple-light/10">
            <h3 className="text-[10px] font-black text-brand-black uppercase tracking-[0.2em] mb-4">Trending Skills</h3>
            <div className="flex flex-wrap gap-2">
              {['Afrobeats', 'Music Production', 'Live Performance', 'Songwriting', 'Mixing'].map(skill => (
                <span key={skill} className="px-3 py-1.5 rounded-xl bg-brand-gray text-brand-gray-dark text-[10px] font-bold hover:bg-brand-purple-soft hover:text-brand-purple cursor-pointer transition-all border border-transparent hover:border-brand-purple-light/20">
                  #{skill.replace(' ', '')}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-brand-purple-light/10">
            <h3 className="text-[10px] font-black text-brand-black uppercase tracking-[0.2em] mb-4">Top Creators</h3>
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex items-center gap-3 group cursor-pointer">
                  <div className="w-10 h-10 rounded-full bg-brand-purple-soft flex items-center justify-center text-brand-purple font-bold text-xs border border-brand-purple-light/10 group-hover:scale-110 transition-transform">
                    {String.fromCharCode(64 + i)}
                  </div>
                  <div className="flex-grow min-w-0">
                    <p className="text-xs font-bold text-brand-black truncate">Creator Name {i}</p>
                    <p className="text-[10px] text-brand-gray-dark font-medium">Music Producer</p>
                  </div>
                  <button className="text-brand-purple font-bold text-[10px] hover:underline whitespace-nowrap">Follow</button>
                </div>
              ))}
            </div>
            <button className="w-full mt-6 py-3 rounded-xl bg-brand-gray text-brand-gray-dark text-[10px] font-bold hover:bg-brand-purple-soft hover:text-brand-purple transition-all border border-transparent hover:border-brand-purple-light/20">
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
        ? 'bg-brand-purple-soft text-brand-purple shadow-sm border border-brand-purple-light/20' 
        : 'text-brand-gray-dark hover:bg-brand-gray hover:text-brand-black'
    }`}
  >
    {React.cloneElement(icon, { className: 'w-5 h-5' })}
    {label}
  </Link>
);

export default Dashboard;
