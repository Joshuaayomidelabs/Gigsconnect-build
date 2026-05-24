import React, { useState, useEffect } from 'react';
import { Menu, X, LogOut, LayoutDashboard, User, MessageCircle, Bell } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { profilesService } from '../services/profilesService';
import Logo from './Logo';
import NotificationDropdown from './NotificationDropdown';

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        console.log('Header: Fetching profile for User ID:', user.id);
        const { data } = await profilesService.getProfile(user.id);
        setProfile(data);
      } else {
        setProfile(null);
      }
    };

    fetchProfile();

    // Listen for profile updates from other components
    window.addEventListener('profile-updated', fetchProfile);
    return () => window.removeEventListener('profile-updated', fetchProfile);
  }, [user]);

  const handleSignOut = async () => {
    await signOut();
    setIsOpen(false);
    navigate('/');
  };

  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';
  const isLandingPage = location.pathname === '/';
  if (isAuthPage) return null;

  const authLinks = [
    { name: 'Home', path: '/' },
    { name: 'Overview', path: '/overview' },
    { name: 'My Applications', path: '/applications' },
    { name: 'My Posted Gigs', path: '/posted-gigs' },
    { name: 'Edit Profile', path: '/edit-profile' },
  ];

  return (
    <div className={`fixed top-0 left-0 right-0 z-50 flex justify-center px-4 pt-4 sm:pt-6 transition-all duration-500 pointer-events-none ${scrolled ? 'translate-y-[-10px]' : ''}`}>
      <nav 
        className={`relative flex items-center justify-between w-full max-w-[1200px] px-6 py-3 bg-white/80 backdrop-blur-xl rounded-full transition-all duration-300 pointer-events-auto ${
          scrolled ? 'shadow-lg border border-brand-purple-light/20' : 'shadow-sm border border-transparent'
        }`}
      >
        <Link to="/" className="flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity flex items-center gap-2">
          <Logo iconClassName="w-8 h-8" />
          <span className="font-black text-xl tracking-tighter text-brand-black">Gigs<span className="text-brand-purple">Connect</span></span>
        </Link>
        
        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center space-x-1 ml-8">
          {!user ? (
            <>
              <Link to="/" className={`px-4 py-2 rounded-xl font-bold text-sm transition-all ${location.pathname === '/' ? 'bg-brand-purple text-white' : 'text-brand-gray-dark hover:text-brand-purple hover:bg-brand-purple-soft'}`}>Home</Link>
              <Link to="/browse" className={`px-4 py-2 rounded-xl font-bold text-sm transition-all ${location.pathname === '/browse' ? 'bg-brand-purple text-white' : 'text-brand-gray-dark hover:text-brand-purple hover:bg-brand-purple-soft'}`}>Discover</Link>
              <Link to="/post" className={`px-4 py-2 rounded-xl font-bold text-sm transition-all ${location.pathname === '/post' ? 'bg-brand-purple text-white' : 'text-brand-gray-dark hover:text-brand-purple hover:bg-brand-purple-soft'}`}>Post Gig</Link>
            </>
          ) : (
            authLinks.map(link => (
              <Link 
                key={link.path} 
                to={link.path} 
                className={`px-4 py-2 rounded-xl font-bold text-sm transition-all ${location.pathname === link.path ? 'bg-brand-purple text-white' : 'text-brand-gray-dark hover:text-brand-purple hover:bg-brand-purple-soft'}`}
              >
                {link.name}
              </Link>
            ))
          )}
        </div>

        <div className="flex items-center gap-2 ml-auto">
          {user ? (
            <>
              <div className="hidden lg:flex items-center gap-2">
                <NotificationDropdown />
                <Link to="/messages" className="p-2 text-brand-gray-dark hover:bg-brand-purple-soft hover:text-brand-purple rounded-full transition-all">
                  <MessageCircle className="w-5 h-5" />
                </Link>
                <Link to="/edit-profile" className="w-10 h-10 rounded-full bg-brand-purple-soft flex items-center justify-center overflow-hidden border-2 border-white shadow-sm hover:scale-110 transition-transform">
                  {profile?.avatar_url ? (
                    <img 
                      src={profile.avatar_url} 
                      alt="" 
                      className="w-full h-full object-cover" 
                      referrerPolicy="no-referrer" 
                    />
                  ) : (
                    <User className="w-5 h-5 text-brand-purple" />
                  )}
                </Link>
                <button onClick={handleSignOut} className="p-2 text-gray-500 hover:bg-brand-purple/10 hover:text-brand-purple rounded-full transition-all">
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
              
              {/* Mobile Notification/Action */}
              <div className="lg:hidden flex items-center gap-2">
                <NotificationDropdown />
                <button 
                  onClick={() => setIsOpen(!isOpen)} 
                  className="w-10 h-10 rounded-full bg-brand-purple-soft flex items-center justify-center overflow-hidden border-2 border-white shadow-sm"
                >
                  {profile?.avatar_url ? (
                    <img 
                      src={profile.avatar_url} 
                      alt="" 
                      className="w-full h-full object-cover" 
                      referrerPolicy="no-referrer" 
                    />
                  ) : (
                    <User className="w-5 h-5 text-brand-purple" />
                  )}
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="py-2.5 px-5 text-sm font-bold text-brand-gray-dark hover:text-brand-purple transition-colors">
                Log in
              </Link>
              <Link to="/signup" className="py-2.5 px-6 text-sm font-bold text-white bg-brand-purple hover:bg-brand-purple-dark rounded-full transition-all shadow-md active:scale-95">
                Join Free
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu toggle */}
        <div className="lg:hidden flex items-center ml-2">
          <button 
            onClick={() => setIsOpen(!isOpen)} 
            className="text-brand-gray-dark hover:text-brand-black p-2 bg-brand-gray rounded-full transition-colors"
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile menu panel */}
        <div 
          className={`fixed top-4 left-4 right-4 z-50 bg-white rounded-[2rem] shadow-xl p-4 transition-all duration-300 ease-out lg:hidden origin-top pointer-events-auto ${
            isOpen ? 'opacity-100 scale-100 visible' : 'opacity-0 scale-95 invisible'
          }`}
        >
          <div className="flex items-center justify-between mb-4 px-2">
            <div className="flex items-center gap-2">
              <Logo iconClassName="w-8 h-8" />
              <span className="font-bold text-xl tracking-tighter text-brand-black">GigsConnect</span>
            </div>
            <button 
              onClick={() => setIsOpen(false)} 
              className="text-brand-gray-dark hover:text-brand-black p-2 bg-brand-gray rounded-full transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          <div className="flex flex-col space-y-2">
            {!user ? (
              <>
                <Link to="/" className="block px-6 py-4 text-lg font-semibold text-brand-black hover:bg-brand-purple-soft rounded-2xl transition-colors" onClick={() => setIsOpen(false)}>Home</Link>
                <Link to="/browse" className="block px-6 py-4 text-lg font-semibold text-brand-black hover:bg-brand-purple-soft rounded-2xl transition-colors" onClick={() => setIsOpen(false)}>Browse Gigs</Link>
                <Link to="/post" className="block px-6 py-4 text-lg font-semibold text-brand-black hover:bg-brand-purple-soft rounded-2xl transition-colors" onClick={() => setIsOpen(false)}>Post a Gig</Link>
                <div className="pt-4 pb-2 px-2 flex flex-col gap-3">
                  <Link to="/login" className="w-full flex justify-center py-4 rounded-xl font-semibold text-lg text-brand-black bg-brand-gray hover:bg-gray-200 transition-colors" onClick={() => setIsOpen(false)}>
                    Log in
                  </Link>
                  <Link to="/signup" className="w-full flex justify-center py-4 rounded-full font-semibold text-lg text-white bg-brand-purple hover:bg-brand-purple-dark transition-colors shadow-md" onClick={() => setIsOpen(false)}>
                    Sign up free
                  </Link>
                </div>
              </>
            ) : (
              <>
                {authLinks.map(link => (
                  <Link 
                    key={link.path} 
                    to={link.path} 
                    className="block px-6 py-4 text-lg font-semibold text-brand-black hover:bg-brand-purple-soft rounded-2xl transition-colors" 
                    onClick={() => setIsOpen(false)}
                  >
                    {link.name}
                  </Link>
                ))}
                <button 
                  onClick={handleSignOut} 
                  className="w-full flex items-center gap-3 px-6 py-4 text-lg font-semibold text-gray-700 dark:text-gray-300 hover:text-brand-purple hover:bg-brand-purple/10 rounded-2xl transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  Sign Out
                </button>
              </>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Header;
