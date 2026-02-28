import React, { useState } from 'react';
import { Bell, Home, Compass, PlusSquare, FileText, CreditCard, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import HomeScreen from '../components/dashboard/HomeScreen';
import ExploreTab from '../components/dashboard/ExploreTab';
import PostGigTab from '../components/dashboard/PostGigTab';
import ApplicationsTab from '../components/dashboard/ApplicationsTab';
import SubscriptionTab from '../components/dashboard/SubscriptionTab';
import ProfileTab from '../components/dashboard/ProfileTab';

export interface Gig {
  id: string;
  title: string;
  description: string;
  location: string;
  price: number;
  currency: string;
  category: string;
  event_type?: string;
  visibility: string;
  status: string;
  event_date?: string;
  posted_by: string;
  created_at: string;
  users?: {
    name: string;
  };
}

const initialGigs: Gig[] = [];

const BackgroundSVGs = () => (
  <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden text-gray-900 opacity-[0.03]">
    {/* Music Note */}
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-64 h-64 absolute top-10 -left-10 -rotate-12">
      <path d="M9 18V5l12-2v13"></path>
      <circle cx="6" cy="18" r="3"></circle>
      <circle cx="18" cy="16" r="3"></circle>
    </svg>
    {/* Microphone */}
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-80 h-80 absolute bottom-20 -right-20 rotate-12">
      <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path>
      <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
      <line x1="12" x2="12" y1="19" y2="22"></line>
    </svg>
    {/* Headphones */}
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-48 h-48 absolute top-1/4 right-10 rotate-45">
      <path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3"></path>
    </svg>
    {/* Guitar */}
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-72 h-72 absolute bottom-10 left-1/4 -rotate-45">
      <path d="m11.5 8.5 4 4"></path>
      <path d="m14.5 5.5 4 4"></path>
      <path d="M15 4.5 19.5 9"></path>
      <path d="m7.5 12.5 4 4"></path>
      <path d="m4.5 15.5 4 4"></path>
      <path d="M4.5 19.5 9 15"></path>
      <path d="m13 11-2 2"></path>
      <circle cx="9" cy="15" r="4"></circle>
      <circle cx="15" cy="9" r="4"></circle>
      <path d="m18 6-2-2"></path>
      <path d="m6 18-2-2"></path>
    </svg>
    {/* Soundwave */}
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-56 h-56 absolute top-1/2 left-10 -rotate-6">
      <path d="M2 10v3"></path>
      <path d="M6 6v11"></path>
      <path d="M10 3v18"></path>
      <path d="M14 8v7"></path>
      <path d="M18 5v13"></path>
      <path d="M22 10v3"></path>
    </svg>
  </div>
);

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [gigs, setGigs] = useState<Gig[]>(initialGigs);

  const handleAddGig = (newGig: any) => {
    const gig: Gig = {
      ...newGig,
      id: Math.random().toString(36).substr(2, 9),
      visibility: 'public',
      status: 'open',
      posted_by: 'me',
      created_at: new Date().toISOString()
    };
    setGigs([gig, ...gigs]);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'home': return <HomeScreen />;
      case 'explore': return <ExploreTab gigs={gigs} />;
      case 'post': return <PostGigTab onAddGig={handleAddGig} onGigPosted={() => setActiveTab('home')} />;
      case 'applications': return <ApplicationsTab />;
      case 'subscription': return <SubscriptionTab />;
      case 'profile': return <ProfileTab />;
      default: return <HomeScreen />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row font-sans relative">
      <BackgroundSVGs />
      
      {/* Sidebar (Desktop) */}
      <aside className="hidden md:flex flex-col w-64 bg-white/80 backdrop-blur-md border-r border-gray-200 fixed h-full z-20">
        <div className="p-6 border-b border-gray-200">
          <Link to="/" className="text-2xl font-black text-gray-900 tracking-tighter">GigsConnect</Link>
        </div>
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <NavItem icon={<Home />} label="Home" active={activeTab === 'home'} onClick={() => setActiveTab('home')} />
          <NavItem icon={<Compass />} label="Explore Gigs" active={activeTab === 'explore'} onClick={() => setActiveTab('explore')} />
          <NavItem icon={<PlusSquare />} label="Post a Gig" active={activeTab === 'post'} onClick={() => setActiveTab('post')} />
          <NavItem icon={<FileText />} label="Applications" active={activeTab === 'applications'} onClick={() => setActiveTab('applications')} />
          <NavItem icon={<CreditCard />} label="Subscription" active={activeTab === 'subscription'} onClick={() => setActiveTab('subscription')} />
          <NavItem icon={<User />} label="Profile" active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} />
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 flex flex-col min-h-screen pb-24 md:pb-0 z-10 relative">
        {/* Top Navigation */}
        <header className="bg-white/80 backdrop-blur-xl border-b border-gray-100 sticky top-0 z-30 px-4 sm:px-6 py-4 flex items-center justify-between md:justify-end">
          <div className="md:hidden">
            <Link to="/" className="text-xl font-black text-gray-900 tracking-tighter">GigsConnect</Link>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors relative active:scale-95">
              <Bell className="w-6 h-6" />
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div onClick={() => setActiveTab('profile')} className="w-10 h-10 rounded-full bg-blue-100 border-2 border-blue-600 overflow-hidden cursor-pointer hover:opacity-80 transition-opacity active:scale-95">
              <img src="https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&q=80&w=150" alt="Avatar" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </div>
          </div>
        </header>

        <div className="p-4 sm:p-6 max-w-6xl mx-auto w-full">
          {renderContent()}
        </div>
      </main>

      {/* Bottom Navigation (Mobile) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-gray-100 flex justify-around p-2 z-40 pb-safe shadow-[0_-8px_30px_rgba(0,0,0,0.04)]">
        <MobileNavItem icon={<Home />} label="Home" active={activeTab === 'home'} onClick={() => setActiveTab('home')} />
        <MobileNavItem icon={<Compass />} label="Explore" active={activeTab === 'explore'} onClick={() => setActiveTab('explore')} />
        <MobileNavItem icon={<PlusSquare />} label="Post" active={activeTab === 'post'} onClick={() => setActiveTab('post')} />
        <MobileNavItem icon={<FileText />} label="Apps" active={activeTab === 'applications'} onClick={() => setActiveTab('applications')} />
        <MobileNavItem icon={<User />} label="Profile" active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} />
      </nav>
    </div>
  );
};

const NavItem = ({ icon, label, active = false, onClick }: { icon: React.ReactElement, label: string, active?: boolean, onClick: () => void }) => (
  <button onClick={onClick} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${active ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}>
    {React.cloneElement(icon, { className: 'w-5 h-5' })}
    {label}
  </button>
);

const MobileNavItem = ({ icon, label, active = false, onClick }: { icon: React.ReactElement, label: string, active?: boolean, onClick: () => void }) => (
  <button onClick={onClick} className={`flex flex-col items-center gap-1 p-2 flex-1 active:scale-95 transition-transform ${active ? 'text-blue-600' : 'text-gray-500 hover:text-gray-900'}`}>
    {React.cloneElement(icon, { className: 'w-6 h-6' })}
    <span className="text-[10px] font-medium tracking-tight">{label}</span>
  </button>
);

export default Dashboard;
