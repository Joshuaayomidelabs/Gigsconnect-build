import React, { useState } from 'react';
import { Bell, Home, Compass, PlusSquare, FileText, CreditCard, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import HomeTab from '../components/dashboard/HomeTab';
import ExploreTab from '../components/dashboard/ExploreTab';
import PostGigTab from '../components/dashboard/PostGigTab';
import ApplicationsTab from '../components/dashboard/ApplicationsTab';
import SubscriptionTab from '../components/dashboard/SubscriptionTab';
import ProfileTab from '../components/dashboard/ProfileTab';

const BackgroundSVGs = () => (
  <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-96 h-96 text-blue-900 opacity-[0.02] absolute top-20 -left-20 -rotate-12">
      <path d="M9 18V5l12-2v13"></path>
      <circle cx="6" cy="18" r="3"></circle>
      <circle cx="18" cy="16" r="3"></circle>
    </svg>
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[30rem] h-[30rem] text-purple-900 opacity-[0.02] absolute bottom-0 -right-20 rotate-12">
      <path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3"></path>
    </svg>
  </div>
);

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('home');

  const renderContent = () => {
    switch (activeTab) {
      case 'home': return <HomeTab />;
      case 'explore': return <ExploreTab />;
      case 'post': return <PostGigTab />;
      case 'applications': return <ApplicationsTab />;
      case 'subscription': return <SubscriptionTab />;
      case 'profile': return <ProfileTab />;
      default: return <HomeTab />;
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
      <main className="flex-1 md:ml-64 flex flex-col min-h-screen pb-20 md:pb-0 z-10 relative">
        {/* Top Navigation */}
        <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-30 px-6 py-4 flex items-center justify-between md:justify-end">
          <div className="md:hidden">
            <Link to="/" className="text-xl font-black text-gray-900 tracking-tighter">GigsConnect</Link>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors relative">
              <Bell className="w-6 h-6" />
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div onClick={() => setActiveTab('profile')} className="w-10 h-10 rounded-full bg-blue-100 border-2 border-blue-600 overflow-hidden cursor-pointer hover:opacity-80 transition-opacity">
              <img src="https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&q=80&w=150" alt="Avatar" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </div>
          </div>
        </header>

        <div className="p-6 max-w-6xl mx-auto w-full">
          {renderContent()}
        </div>
      </main>

      {/* Bottom Navigation (Mobile) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-gray-200 flex justify-around p-3 z-40 pb-safe shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
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
  <button onClick={onClick} className={`flex flex-col items-center gap-1 p-2 ${active ? 'text-blue-600' : 'text-gray-500 hover:text-gray-900'}`}>
    {React.cloneElement(icon, { className: 'w-6 h-6' })}
    <span className="text-[10px] font-medium">{label}</span>
  </button>
);

export default Dashboard;
