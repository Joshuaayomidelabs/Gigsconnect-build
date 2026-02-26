import React from 'react';
import { Bell, Search, Filter, Home, Compass, PlusSquare, FileText, CreditCard, User, MapPin, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row font-sans">
      {/* Sidebar (Desktop) */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200 fixed h-full z-10">
        <div className="p-6 border-b border-gray-200">
          <Link to="/" className="text-2xl font-black text-gray-900 tracking-tighter">GigsConnect</Link>
        </div>
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <NavItem icon={<Home />} label="Home" active />
          <NavItem icon={<Compass />} label="Explore Gigs" />
          <NavItem icon={<PlusSquare />} label="Post a Gig" />
          <NavItem icon={<FileText />} label="Applications" />
          <NavItem icon={<CreditCard />} label="Subscription" />
          <NavItem icon={<User />} label="Profile" />
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 flex flex-col min-h-screen pb-20 md:pb-0">
        {/* Top Navigation */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-20 px-6 py-4 flex items-center justify-between md:justify-end">
          <div className="md:hidden">
            <Link to="/" className="text-xl font-black text-gray-900 tracking-tighter">GigsConnect</Link>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors relative">
              <Bell className="w-6 h-6" />
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="w-10 h-10 rounded-full bg-blue-100 border-2 border-blue-600 overflow-hidden cursor-pointer">
              <img src="https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&q=80&w=150" alt="Avatar" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </div>
          </div>
        </header>

        <div className="p-6 max-w-6xl mx-auto w-full space-y-8">
          {/* Welcome Section */}
          <section>
            <h1 className="text-3xl font-bold text-gray-900">Welcome back, Alex</h1>
            <p className="text-gray-500 mt-1 text-lg">Here are the latest gigs for you</p>
          </section>

          {/* Subscription Banner */}
          <section className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 sm:p-8 text-white shadow-lg flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold mb-2">Upgrade to Premium for unlimited applications</h2>
              <p className="text-blue-100 text-base sm:text-lg">Get noticed by top organizers and land more gigs.</p>
            </div>
            <button className="px-8 py-3.5 bg-white text-blue-600 font-bold rounded-full hover:bg-blue-50 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] whitespace-nowrap shadow-sm hover:shadow-md text-lg">
              Upgrade Now
            </button>
          </section>

          {/* Quick Stats */}
          <section className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <StatCard title="Available Gigs" value="142" trend="+12 this week" />
            <StatCard title="My Applications" value="8" trend="3 pending" />
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-center transition-shadow hover:shadow-md cursor-default">
              <h3 className="text-gray-500 text-sm font-medium mb-2">Subscription Status</h3>
              <div className="flex items-center gap-3">
                <span className="text-2xl font-bold text-gray-900">Free Plan</span>
                <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-bold rounded-full uppercase tracking-wider">Basic</span>
              </div>
            </div>
          </section>

          {/* Gig Feed */}
          <section className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900 w-full sm:w-auto">Recommended Gigs</h2>
              <div className="flex w-full sm:w-auto gap-3">
                <div className="relative flex-1 sm:w-72">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input type="text" placeholder="Search gigs..." className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all" />
                </div>
                <button className="p-2.5 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors flex items-center justify-center">
                  <Filter className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <GigCard 
                title="Lead Guitarist for Afrobeats Tour"
                location="Lagos, Nigeria (Touring)"
                pay="₦500k - ₦800k"
                date="Oct 15 - Nov 20, 2026"
                description="Looking for an experienced lead guitarist comfortable with Afrobeats, Highlife, and contemporary pop for a 5-city tour."
              />
              <GigCard 
                title="Jazz Pianist for Corporate Gala"
                location="Accra, Ghana"
                pay="$400 / night"
                date="Sept 12, 2026"
                description="Need a smooth jazz pianist to provide background music for a high-end corporate networking event. 3-hour set."
              />
              <GigCard 
                title="Session Drummer - Studio Recording"
                location="Remote / Nairobi"
                pay="$150 / track"
                date="Flexible"
                description="Indie pop artist looking for a session drummer to record stems for an upcoming 5-track EP. Must have own recording setup if remote."
              />
              <GigCard 
                title="Wedding Band (4-piece)"
                location="Cape Town, SA"
                pay="R15,000"
                date="Dec 5, 2026"
                description="Seeking a lively 4-piece band (vocals, guitar, bass, drums) for a wedding reception. Mix of classics and modern hits."
              />
            </div>
          </section>
        </div>
      </main>

      {/* Bottom Navigation (Mobile) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around p-3 z-30 pb-safe shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <MobileNavItem icon={<Home />} label="Home" active />
        <MobileNavItem icon={<Compass />} label="Explore" />
        <MobileNavItem icon={<PlusSquare />} label="Post" />
        <MobileNavItem icon={<FileText />} label="Apps" />
        <MobileNavItem icon={<User />} label="Profile" />
      </nav>
    </div>
  );
};

const NavItem = ({ icon, label, active = false }: { icon: React.ReactElement, label: string, active?: boolean }) => (
  <a href="#" className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${active ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}>
    {React.cloneElement(icon, { className: 'w-5 h-5' })}
    {label}
  </a>
);

const MobileNavItem = ({ icon, label, active = false }: { icon: React.ReactElement, label: string, active?: boolean }) => (
  <a href="#" className={`flex flex-col items-center gap-1 p-2 ${active ? 'text-blue-600' : 'text-gray-500 hover:text-gray-900'}`}>
    {React.cloneElement(icon, { className: 'w-6 h-6' })}
    <span className="text-[10px] font-medium">{label}</span>
  </a>
);

const StatCard = ({ title, value, trend }: { title: string, value: string, trend: string }) => (
  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 transition-shadow hover:shadow-md cursor-default">
    <h3 className="text-gray-500 text-sm font-medium mb-2">{title}</h3>
    <div className="flex items-end gap-3">
      <span className="text-3xl font-bold text-gray-900">{value}</span>
      <span className="text-sm font-medium text-blue-600 mb-1">{trend}</span>
    </div>
  </div>
);

const GigCard = ({ title, location, pay, date, description }: { title: string, location: string, pay: string, date: string, description: string }) => (
  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 flex flex-col h-full hover:-translate-y-1">
    <div className="flex justify-between items-start mb-4 gap-4">
      <h3 className="text-xl font-bold text-gray-900 leading-tight">{title}</h3>
      <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-bold rounded-full whitespace-nowrap flex-shrink-0">{pay}</span>
    </div>
    
    <div className="flex flex-col gap-2 mb-4">
      <div className="flex items-center gap-2 text-gray-600 text-sm font-medium">
        <MapPin className="w-4 h-4 text-gray-400" />
        {location}
      </div>
      <div className="flex items-center gap-2 text-gray-600 text-sm font-medium">
        <Calendar className="w-4 h-4 text-gray-400" />
        {date}
      </div>
    </div>
    
    <p className="text-gray-600 text-sm leading-relaxed mb-6 flex-grow">{description}</p>
    
    <div className="flex items-center gap-3 mt-auto">
      <button className="flex-1 py-2.5 px-4 rounded-xl border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition-colors text-sm">
        View Details
      </button>
      <button className="flex-1 py-2.5 px-4 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-500 transition-colors text-sm shadow-sm">
        Apply Now
      </button>
    </div>
  </div>
);

export default Dashboard;
