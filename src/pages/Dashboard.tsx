import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LayoutDashboard, Compass, PlusSquare, FileText, User, ArrowRight, Loader2, Zap } from 'lucide-react';
import { motion } from 'motion/react';
import { supabase } from '../services/supabaseClient';
import { gigsService } from '../services/gigsService';
import { profilesService } from '../services/profilesService';
import GigCard from '../components/GigCard';
import ProfileCard from '../components/ProfileCard';

const Dashboard: React.FC = () => {
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
    <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-screen bg-brand-gray">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Profile & Navigation */}
        <div className="lg:col-span-1 space-y-8">
          <ProfileCard profile={profile} />
          
          <div className="bg-white rounded-3xl p-4 shadow-sm border border-brand-purple-light/20 space-y-1">
            <h3 className="px-4 pt-2 pb-4 text-xs font-black text-brand-gray-dark uppercase tracking-widest">Navigation</h3>
            <DashLink to="/dashboard" icon={<LayoutDashboard />} label="Overview" active />
            <DashLink to="/browse" icon={<Compass />} label="Browse Gigs" />
            <DashLink to="/post" icon={<PlusSquare />} label="Post a Gig" />
            <DashLink to="/applications" icon={<FileText />} label="My Applications" />
            <DashLink to="/my-gigs" icon={<PlusSquare />} label="My Posted Gigs" />
            <DashLink to="/profile" icon={<User />} label="Edit Profile" />
          </div>

          {profile?.subscription_plan !== 'premium' && (
            <div className="bg-brand-black rounded-[2.5rem] p-8 text-white shadow-xl relative overflow-hidden group">
              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-purple/20 border border-brand-purple/30 text-brand-purple-light text-[10px] font-bold mb-4 tracking-wide uppercase">
                  <Zap className="w-3 h-3" />
                  Upgrade Available
                </div>
                <h3 className="text-2xl font-black mb-2">Go <span className="text-brand-purple">Premium</span></h3>
                <p className="text-brand-gray-dark text-sm mb-6">Unlock unlimited applications, priority ranking, and a premium badge.</p>
                <Link to="/subscription" className="inline-flex items-center gap-2 bg-brand-purple text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-brand-purple-dark transition-all active:scale-95 shadow-lg shadow-purple-500/20">
                  Upgrade Now
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-brand-purple rounded-full opacity-10 group-hover:scale-150 transition-transform duration-700 blur-2xl" />
            </div>
          )}
        </div>

        {/* Right Column: Main Content */}
        <div className="lg:col-span-2 space-y-8">
          <section className="flex justify-between items-end">
            <div>
              <h1 className="text-4xl font-black text-brand-black tracking-tight mb-2">Dashboard</h1>
              <p className="text-brand-gray-dark text-lg">Welcome back, {profile?.full_name?.split(' ')[0] || 'Musician'}!</p>
            </div>
            <div className="hidden sm:block">
              <span className={`px-4 py-2 rounded-2xl text-xs font-black uppercase tracking-widest border-2 ${
                profile?.subscription_plan === 'premium' 
                  ? 'bg-brand-purple-soft text-brand-purple border-brand-purple' 
                  : profile?.subscription_plan === 'pro'
                    ? 'bg-brand-purple text-white border-brand-purple'
                    : 'bg-brand-gray text-brand-gray-dark border-brand-purple-light/20'
              }`}>
                {profile?.subscription_plan || 'Starter'} Plan
              </span>
            </div>
          </section>

          <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {stats.map((stat, i) => (
              <div key={i} className="bg-white rounded-3xl p-6 border border-brand-purple-light/10 shadow-sm hover:shadow-md transition-shadow">
                <p className="text-brand-gray-dark text-xs font-bold uppercase tracking-wider mb-1">{stat.label}</p>
                <p className="text-3xl font-black text-brand-black">{stat.value}</p>
              </div>
            ))}
          </section>

          <section className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-black text-brand-black">Recent Gigs</h2>
              <Link to="/browse" className="text-brand-purple font-bold text-sm hover:underline flex items-center gap-1">
                View all
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {recentGigs.map((gig) => (
                <GigCard key={gig.id} gig={gig} />
              ))}
            </div>
          </section>

          <section className="bg-white rounded-[2.5rem] p-10 border border-brand-purple-light/10 text-center shadow-sm">
            <h3 className="text-xl font-bold text-brand-black mb-2">Complete Your Profile</h3>
            <p className="text-brand-gray-dark mb-6 max-w-md mx-auto">Profiles with a bio and skills get 3x more gig invitations.</p>
            <Link to="/profile" className="inline-flex items-center gap-2 bg-brand-purple-soft text-brand-purple px-8 py-4 rounded-2xl font-bold hover:bg-brand-purple-light transition-all shadow-sm active:scale-95 border border-brand-purple-light/20">
              Edit Profile
            </Link>
          </section>
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
