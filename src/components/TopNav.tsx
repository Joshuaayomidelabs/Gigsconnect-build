import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Bell, Home, Search, Briefcase, User, Settings, LogOut, ChevronDown } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useNotificationContext } from "../context/NotificationContext";
import { supabase } from "../services/supabaseClient";
import Logo from "./Logo";
import CreateHubModal from "./CreateHubModal";
import { Plus, MessageCircle } from "lucide-react";

const TopNav: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { user } = useAuth();
  const { unreadCount, markAllAsRead } = useNotificationContext();
  const navigate = useNavigate();
  const location = useLocation();

  const toggleMobile = () => setMobileOpen(!mobileOpen);

  const isLoggedIn = !!user;
  const isLandingPage = location.pathname === "/";
  const isAuthPage = location.pathname === "/login" || location.pathname === "/signup";

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const navItems = [
    { icon: <Home className="w-5 h-5" />, label: "Home", path: "/overview" },
    { icon: <Search className="w-5 h-5" />, label: "Explore", path: "/browse" },
    { icon: <Briefcase className="w-5 h-5" />, label: "Gigs", path: "/applications" },
  ];

  const checkIsActive = (itemPath: string) => {
    if (itemPath === '/overview') return location.pathname === '/overview';
    return location.pathname.startsWith(itemPath);
  };

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isLandingPage 
        ? "bg-white/70 dark:bg-brand-black/70 backdrop-blur-md border-b border-white/20 dark:border-white/10 shadow-sm" 
        : "bg-brand-white dark:bg-brand-black shadow-md border-b border-brand-gray dark:border-brand-dark-card"
    } px-4 pb-4 pt-[calc(1rem+env(safe-area-inset-top))] flex items-center justify-between`}>
      
      {/* Left: Clickable Logo + App Name */}
      <Link 
        to={isLoggedIn ? "/overview" : "/"}
        className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity" 
      >
        <Logo iconClassName="w-8 h-8 sm:w-10 sm:h-10" />
        <span className="text-xl sm:text-2xl font-black text-brand-black dark:text-brand-white tracking-tighter">
          Gigs<span className="text-brand-purple">Connect</span>
        </span>
      </Link>

      {/* Center: Desktop Navigation */}
      <div className="hidden lg:flex items-center gap-8">
        {!isLoggedIn && isLandingPage && (
          <>
            <Link to="/browse" className="text-sm font-bold text-brand-gray-dark dark:text-gray-300 hover:text-brand-purple transition-colors">Find Gigs</Link>
            <Link to="/browse" className="text-sm font-bold text-brand-gray-dark dark:text-gray-300 hover:text-brand-purple transition-colors">Find Talent</Link>
            <a href="/#how-it-works" className="text-sm font-bold text-brand-gray-dark dark:text-gray-300 hover:text-brand-purple transition-colors">How it works</a>
          </>
        )}
        
        {isLoggedIn && navItems.map((item) => {
          const isActive = checkIsActive(item.path);
          return (
            <Link 
              key={item.path} 
              to={item.path} 
              className={`flex items-center gap-2 text-sm font-bold transition-colors ${isActive ? 'text-brand-purple' : 'text-brand-gray-dark dark:text-gray-300 hover:text-brand-purple'}`}
            >
              {item.icon}
              {item.label}
            </Link>
          );
        })}
      </div>

      {/* Right: Actions */}
      <div className="flex items-center space-x-2 sm:space-x-4">
        {!isLoggedIn && !isAuthPage && (
          <div className="hidden lg:flex items-center gap-4">
            <Link to="/login" className="text-sm font-bold text-brand-black dark:text-brand-white hover:text-brand-purple transition-colors">Log in</Link>
            <Link to="/signup" className="px-6 py-2.5 rounded-full bg-brand-purple text-white text-sm font-bold hover:bg-brand-purple-dark hover:shadow-glow transition-all active:scale-95 whitespace-nowrap">
              Join for free
            </Link>
          </div>
        )}

        {!isAuthPage && (
          <button 
            className="lg:hidden p-2 text-brand-black dark:text-gray-400 hover:bg-brand-gray dark:hover:bg-brand-dark-card rounded-lg transition-colors" 
            onClick={toggleMobile}
            aria-label="Toggle menu"
          >
            <span className="text-2xl">☰</span>
          </button>
        )}

        {isLoggedIn && (
          <div className="hidden lg:flex items-center gap-4">
            <button 
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-brand-purple text-white text-sm font-bold hover:bg-brand-purple-dark hover:shadow-glow transition-all active:scale-95 whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              Create
            </button>

            <Link 
              to="/notifications" 
              onClick={() => {
                if (unreadCount > 0) markAllAsRead();
              }}
              className="relative p-2 hover:bg-brand-gray dark:hover:bg-brand-dark-card rounded-full transition-colors group"
              aria-label="Notifications"
            >
              <Bell className="w-6 h-6 text-brand-black dark:text-gray-300 group-hover:text-brand-purple transition-colors" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 inline-flex items-center justify-center w-5 h-5 text-[10px] font-black text-brand-white bg-brand-purple rounded-full border-2 border-brand-white dark:border-brand-black shadow-sm">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </Link>

            <div className="relative">
              <button 
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2 p-1.5 pl-3 rounded-full hover:bg-brand-gray dark:hover:bg-brand-dark-card transition-colors border border-transparent hover:border-brand-gray-dark/20 dark:hover:border-gray-700"
              >
                <div className="w-8 h-8 rounded-full bg-brand-purple/10 flex items-center justify-center text-brand-purple">
                  <User className="w-5 h-5" />
                </div>
                <ChevronDown className="w-4 h-4 text-brand-gray-dark dark:text-gray-400" />
              </button>

              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-brand-black rounded-xl shadow-lg border border-brand-gray dark:border-brand-dark-card py-2 z-50">
                  <Link to="/edit-profile" className="block px-4 py-2 text-sm text-brand-black dark:text-white hover:bg-brand-gray dark:hover:bg-brand-dark-card" onClick={() => setProfileDropdownOpen(false)}>
                    Profile
                  </Link>
                  <Link to="/settings" className="block px-4 py-2 text-sm text-brand-black dark:text-white hover:bg-brand-gray dark:hover:bg-brand-dark-card" onClick={() => setProfileDropdownOpen(false)}>
                    Settings
                  </Link>
                  <div className="h-px bg-brand-gray dark:bg-brand-dark-card my-1" />
                  <button onClick={handleLogout} className="w-full text-left block px-4 py-2 text-sm text-red-500 hover:bg-brand-gray dark:hover:bg-brand-dark-card">
                    Log out
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <ul className="absolute top-16 right-4 bg-brand-white dark:bg-brand-black shadow-lg rounded-xl flex flex-col p-4 space-y-2 lg:hidden z-50 border border-brand-gray dark:border-brand-dark-card min-w-[200px]">
{isLoggedIn ? (
            <>
              <li>
                <Link to="/overview" className="block px-4 py-2 text-brand-black dark:text-gray-200 hover:text-brand-purple hover:bg-brand-purple/5 rounded-lg transition-colors" onClick={() => setMobileOpen(false)}>
                  Home
                </Link>
              </li>
              <li>
                <Link to="/messages" className="block px-4 py-2 text-brand-black dark:text-gray-200 hover:text-brand-purple hover:bg-brand-purple/5 rounded-lg transition-colors" onClick={() => setMobileOpen(false)}>
                  Messages
                </Link>
              </li>
              <li>
                <Link to="/applications" className="block px-4 py-2 text-brand-black dark:text-gray-200 hover:text-brand-purple hover:bg-brand-purple/5 rounded-lg transition-colors" onClick={() => setMobileOpen(false)}>
                  My Applications
                </Link>
              </li>
              <li>
                <Link to="/posted-gigs" className="block px-4 py-2 text-brand-black dark:text-gray-200 hover:text-brand-purple hover:bg-brand-purple/5 rounded-lg transition-colors" onClick={() => setMobileOpen(false)}>
                  My Posted Gigs
                </Link>
              </li>
              <div className="h-px bg-brand-gray dark:bg-brand-dark-card my-2" />
              <li>
                <Link to="/edit-profile" className="block px-4 py-2 text-brand-black dark:text-gray-200 hover:text-brand-purple hover:bg-brand-purple/5 rounded-lg transition-colors" onClick={() => setMobileOpen(false)}>
                  Profile
                </Link>
              </li>
              <li>
                <Link to="/settings" className="block px-4 py-2 text-brand-black dark:text-gray-200 hover:text-brand-purple hover:bg-brand-purple/5 rounded-lg transition-colors" onClick={() => setMobileOpen(false)}>
                  Settings
                </Link>
              </li>
              <div className="h-px bg-brand-gray dark:bg-brand-dark-card my-2" />
              <li>
                <button onClick={() => { handleLogout(); setMobileOpen(false); }} className="w-full text-left block px-4 py-2 text-red-500 font-bold hover:bg-brand-purple/5 rounded-lg transition-colors">
                  Log out
                </button>
              </li>
            </>
          ) : (
            <>
          <li>
            <Link 
              to="/browse" 
              className="block px-4 py-2 text-brand-black dark:text-gray-200 hover:text-brand-purple hover:bg-brand-purple/5 rounded-lg transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              Find Gigs
            </Link>
          </li>
          <li>
            <Link 
              to="/browse" 
              className="block px-4 py-2 text-brand-black dark:text-gray-200 hover:text-brand-purple hover:bg-brand-purple/5 rounded-lg transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              Find Talent
            </Link>
          </li>
          <li>
            <a 
              href="/#how-it-works" 
              className="block px-4 py-2 text-brand-black dark:text-gray-200 hover:text-brand-purple hover:bg-brand-purple/5 rounded-lg transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              How it works
            </a>
          </li>
          <div className="h-px bg-brand-gray dark:bg-brand-dark-card my-2" />
          <li>
            <Link 
              to="/login" 
              className="block px-4 py-2 text-brand-black dark:text-gray-200 hover:text-brand-purple hover:bg-brand-purple/5 rounded-lg transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              Log in
            </Link>
          </li>
          <li>
            <Link 
              to="/signup" 
              className="block px-4 py-2 text-brand-purple font-bold hover:bg-brand-purple/5 rounded-lg transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              Join for free
            </Link>
          </li>
            </>
          )}
        </ul>
      )}
    </nav>
      <CreateHubModal 
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </>
  );
};

export default TopNav;
