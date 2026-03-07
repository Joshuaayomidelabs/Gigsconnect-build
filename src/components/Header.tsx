import React, { useState, useEffect } from 'react';
import { Menu, X, LogOut, LayoutDashboard, User } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';
import Logo from './Logo';

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
    };

    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: any, session: any) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';
  if (isAuthPage) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 pt-4 sm:pt-6 transition-all duration-500 pointer-events-none">
      <nav 
        className={`relative flex items-center justify-between w-full max-w-[1200px] px-6 py-4 bg-white rounded-full transition-shadow duration-300 pointer-events-auto ${
          scrolled ? 'shadow-md' : 'shadow-sm'
        }`}
      >
        <Link to="/" className="flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity flex items-center gap-2">
          <Logo variant="color" />
          <span className="font-bold text-2xl tracking-tighter text-gray-900 hidden sm:block">GigsConnect</span>
        </Link>
        
        <div className="hidden lg:flex items-center space-x-1 ml-8">
          <Link to="/browse" className="text-gray-600 hover:text-brand-600 hover:bg-gray-50 px-4 py-2 rounded-lg font-semibold text-base transition-colors">Browse Gigs</Link>
          <Link to="/post" className="text-gray-600 hover:text-brand-600 hover:bg-gray-50 px-4 py-2 rounded-lg font-semibold text-base transition-colors">Post a Gig</Link>
        </div>

        <div className="hidden lg:flex items-center gap-3 ml-auto">
          {user ? (
            <>
              <Link to="/dashboard" className="py-3 px-6 text-base font-semibold text-gray-900 bg-brand-50 hover:bg-brand-100 rounded-full transition-colors flex items-center gap-2">
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </Link>
              <Link to="/profile" className="p-3 text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
                <User className="w-5 h-5" />
              </Link>
              <button onClick={handleSignOut} className="p-3 text-red-600 hover:bg-red-50 rounded-full transition-colors">
                <LogOut className="w-5 h-5" />
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="py-3 px-6 text-base font-semibold text-gray-600 hover:text-brand-600 transition-colors">
                Log in
              </Link>
              <Link to="/signup" className="py-3 px-8 text-base font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-full transition-colors shadow-md">
                Sign up free
              </Link>
            </>
          )}
        </div>

        <div className="lg:hidden flex items-center ml-auto">
          <button 
            onClick={() => setIsOpen(!isOpen)} 
            className="text-gray-600 hover:text-gray-900 p-2 bg-gray-100 rounded-full transition-colors"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
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
              <Logo variant="color" />
              <span className="font-bold text-xl tracking-tighter text-gray-900">GigsConnect</span>
            </div>
            <button 
              onClick={() => setIsOpen(false)} 
              className="text-gray-600 hover:text-gray-900 p-2 bg-gray-100 rounded-full transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          <div className="flex flex-col space-y-2">
            <Link to="/browse" className="block px-6 py-4 text-lg font-semibold text-gray-900 hover:bg-gray-50 rounded-2xl transition-colors" onClick={() => setIsOpen(false)}>Browse Gigs</Link>
            <Link to="/post" className="block px-6 py-4 text-lg font-semibold text-gray-900 hover:bg-gray-50 rounded-2xl transition-colors" onClick={() => setIsOpen(false)}>Post a Gig</Link>
            
            <div className="pt-4 pb-2 px-2 flex flex-col gap-3">
              {user ? (
                <>
                  <Link to="/dashboard" className="w-full flex justify-center items-center gap-2 py-4 rounded-full font-semibold text-lg text-gray-900 bg-brand-50 hover:bg-brand-100 transition-colors" onClick={() => setIsOpen(false)}>
                    <LayoutDashboard className="w-5 h-5" />
                    Dashboard
                  </Link>
                  <Link to="/profile" className="w-full flex justify-center items-center gap-2 py-4 rounded-xl font-semibold text-lg text-gray-900 bg-gray-50 hover:bg-gray-100 transition-colors" onClick={() => setIsOpen(false)}>
                    <User className="w-5 h-5" />
                    Profile
                  </Link>
                  <button onClick={handleSignOut} className="w-full flex justify-center items-center gap-2 py-4 rounded-xl font-semibold text-lg text-red-600 bg-red-50 hover:bg-red-100 transition-colors">
                    <LogOut className="w-5 h-5" />
                    Sign out
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="w-full flex justify-center py-4 rounded-xl font-semibold text-lg text-gray-900 bg-gray-100 hover:bg-gray-200 transition-colors" onClick={() => setIsOpen(false)}>
                    Log in
                  </Link>
                  <Link to="/signup" className="w-full flex justify-center py-4 rounded-full font-semibold text-lg text-white bg-brand-600 hover:bg-brand-700 transition-colors shadow-md" onClick={() => setIsOpen(false)}>
                    Sign up free
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Header;
