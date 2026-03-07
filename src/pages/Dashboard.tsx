import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LayoutDashboard, Compass, PlusSquare, FileText, User, ArrowRight, Loader2 } from 'lucide-react';
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
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-10 h-10 animate-spin text-brand-600" />
      </div>
    );
  }

  const stats = [
    { label: 'Gigs Applied', value: '8', color: 'brand' },
    { label: 'Gigs Posted', value: '3', color: 'green' },
    { label: 'Profile Views', value: '142', color: 'blue' }
  ];

  return (
    <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Profile & Navigation */}
        <div className="lg:col-span-1 space-y-8">
          <ProfileCard profile={profile} />
          
          <div className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100 space-y-1">
            <h3 className="px-4 pt-2 pb-4 text-xs font-black text-gray-400 uppercase tracking-widest">Navigation</h3>
            <DashLink to="/dashboard" icon={<LayoutDashboard />} label="Overview" active />
            <DashLink to="/browse" icon={<Compass />} label="Browse Gigs" />
            <DashLink to="/post" icon={<PlusSquare />} label="Post a Gig" />
            <DashLink to="/applications" icon={<FileText />} label="My Applications" />
            <DashLink to="/my-gigs" icon={<PlusSquare />} label="My Posted Gigs" />
            <DashLink to="/profile" icon={<User />} label="Edit Profile" />
          </div>

          <div className="bg-brand-600 rounded-[2.5rem] p-8 text-white shadow-xl relative overflow-hidden group">
            <div className="relative z-10">
              <h3 className="text-2xl font-black mb-2">Go Pro</h3>
              <p className="text-brand-100 text-sm mb-6">Unlock unlimited applications and get a verified badge.</p>
              <Link to="/subscription" className="inline-flex items-center gap-2 bg-white text-brand-600 px-6 py-3 rounded-xl font-bold text-sm hover:bg-brand-50 transition-all active:scale-95">
                Upgrade Now
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-brand-500 rounded-full opacity-20 group-hover:scale-150 transition-transform duration-700" />
          </div>
        </div>

        {/* Right Column: Main Content */}
        <div className="lg:col-span-2 space-y-8">
          <section>
            <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-2">Dashboard</h1>
            <p className="text-gray-500 text-lg">Welcome back, {profile?.full_name?.split(' ')[0] || 'Musician'}!</p>
          </section>

          <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {stats.map((stat, i) => (
              <div key={i} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
                <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">{stat.label}</p>
                <p className="text-3xl font-black text-gray-900">{stat.value}</p>
              </div>
            ))}
          </section>

          <section className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-black text-gray-900">Recent Gigs</h2>
              <Link to="/browse" className="text-brand-600 font-bold text-sm hover:underline flex items-center gap-1">
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

          <section className="bg-gray-50 rounded-[2.5rem] p-10 border border-gray-100 text-center">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Complete Your Profile</h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">Profiles with a bio and skills get 3x more gig invitations.</p>
            <Link to="/profile" className="inline-flex items-center gap-2 bg-white border border-gray-200 text-gray-900 px-8 py-4 rounded-2xl font-bold hover:bg-gray-50 transition-all shadow-sm active:scale-95">
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
        ? 'bg-brand-50 text-brand-600 shadow-sm' 
        : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
    }`}
  >
    {React.cloneElement(icon, { className: 'w-5 h-5' })}
    {label}
  </Link>
);

export default Dashboard;
