import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Bell } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useNotificationContext } from "../context/NotificationContext";
import { supabase } from "../services/supabaseClient";
import Logo from "./Logo";

const TopNav: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user } = useAuth();
  const { unreadCount, markAllAsRead } = useNotificationContext();
  const navigate = useNavigate();
  const location = useLocation();

  const toggleMobile = () => setMobileOpen(!mobileOpen);

  // Only show links for logged-in users
  const isLoggedIn = !!user;
  const isLandingPage = location.pathname === "/";
  const isHomePage = location.pathname === "/overview";
  const isAuthPage = location.pathname === "/login" || location.pathname === "/signup";

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isLandingPage 
        ? "bg-white/70 dark:bg-brand-black/70 backdrop-blur-md border-b border-white/20 dark:border-white/10 shadow-sm" 
        : "bg-brand-white dark:bg-brand-black shadow-md border-b border-brand-gray dark:border-brand-dark-card"
    } px-4 pb-4 pt-[calc(1rem+env(safe-area-inset-top))] flex items-center justify-between`}>
      {/* Left: Clickable Logo + App Name */}
      <Link 
        to="/"
        className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity" 
      >
        <Logo iconClassName="w-8 h-8 sm:w-10 sm:h-10" />
        <span className="text-xl sm:text-2xl font-black text-brand-black dark:text-brand-white tracking-tighter">
          Gigs<span className="text-brand-purple">Connect</span>
        </span>
      </Link>

      {/* Center: Landing Page Links (Hidden on mobile) */}
      {isLandingPage && (
        <div className="hidden md:flex items-center gap-8">
          <Link to={isLoggedIn ? "/browse" : "/login"} className="text-sm font-bold text-brand-gray-dark dark:text-gray-300 hover:text-brand-purple transition-colors">Find Gigs</Link>
          <Link to={isLoggedIn ? "/browse" : "/login"} className="text-sm font-bold text-brand-gray-dark dark:text-gray-300 hover:text-brand-purple transition-colors">Find Talent</Link>
          <a href="/#how-it-works" className="text-sm font-bold text-brand-gray-dark dark:text-gray-300 hover:text-brand-purple transition-colors">How it works</a>
        </div>
      )}

      {/* Right: Actions */}
      <div className="flex items-center space-x-2 sm:space-x-4">
        {!isLoggedIn && !isAuthPage && (
          <>
            <div className="hidden md:flex items-center gap-4">
              <Link to="/login" className="text-sm font-bold text-brand-black dark:text-brand-white hover:text-brand-purple transition-colors">Log in</Link>
              <Link to="/signup" className="px-6 py-2.5 rounded-full bg-brand-purple text-white text-sm font-bold hover:bg-brand-purple-dark hover:shadow-glow transition-all active:scale-95 whitespace-nowrap">
                Join for free
              </Link>
            </div>
            {isLandingPage && (
              <button 
                className="md:hidden p-2 text-brand-black dark:text-gray-400 hover:bg-brand-gray dark:hover:bg-brand-dark-card rounded-lg transition-colors" 
                onClick={() => setMobileOpen(!mobileOpen)}
              >
                <span className="text-2xl">☰</span>
              </button>
            )}
          </>
        )}

        {isLoggedIn && (
          <>
            {/* Notifications visible only on dashboard/homepage */}
            {(isHomePage || location.pathname === "/notifications") && (
              <Link 
                to="/notifications" 
                onClick={() => {
                  if (unreadCount > 0) {
                    markAllAsRead();
                  }
                }}
                className="relative p-2 hover:bg-brand-gray dark:hover:bg-brand-dark-card rounded-full transition-colors group"
              >
                <Bell className="w-6 h-6 text-brand-black dark:text-gray-300 group-hover:text-brand-purple transition-colors" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 inline-flex items-center justify-center w-5 h-5 text-[10px] font-black text-brand-white bg-brand-purple rounded-full border-2 border-brand-white dark:border-brand-black shadow-sm">
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </span>
                )}
              </Link>
            )}

            {/* Mobile toggle visible only on dashboard/homepage */}
            {isHomePage && (
              <button 
                className="md:hidden p-2 text-brand-black dark:text-gray-400 hover:bg-brand-gray dark:hover:bg-brand-dark-card rounded-lg transition-colors" 
                onClick={() => setMobileOpen(!mobileOpen)}
              >
                <span className="text-2xl">☰</span>
              </button>
            )}
          </>
        )}
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <ul className="absolute top-16 right-4 bg-brand-white dark:bg-brand-black shadow-lg rounded-xl flex flex-col p-4 space-y-2 md:hidden z-50 border border-brand-gray dark:border-brand-dark-card min-w-[200px]">
          {isLoggedIn ? (
            <>
              <li>
                <Link 
                  to="/overview" 
                  className="block px-4 py-2 text-brand-black dark:text-gray-200 hover:text-brand-purple hover:bg-brand-purple/5 dark:hover:bg-brand-purple/10 rounded-lg transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  Overview
                </Link>
              </li>
              <li>
                <Link 
                  to="/applications" 
                  className="block px-4 py-2 text-brand-black dark:text-gray-200 hover:text-brand-purple hover:bg-brand-purple/5 dark:hover:bg-brand-purple/10 rounded-lg transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  My Applications
                </Link>
              </li>
              <li>
                <Link 
                  to="/posted-gigs" 
                  className="block px-4 py-2 text-brand-black dark:text-gray-200 hover:text-brand-purple hover:bg-brand-purple/5 dark:hover:bg-brand-purple/10 rounded-lg transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  My Posted Gigs
                </Link>
              </li>
              <li>
                <Link 
                  to="/edit-profile" 
                  className="block px-4 py-2 text-brand-black dark:text-gray-200 hover:text-brand-purple hover:bg-brand-purple/5 dark:hover:bg-brand-purple/10 rounded-lg transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  Edit Profile
                </Link>
              </li>
              <li>
                <Link 
                  to="/settings" 
                  className="block px-4 py-2 text-brand-black dark:text-gray-200 hover:text-brand-purple hover:bg-brand-purple/5 dark:hover:bg-brand-purple/10 rounded-lg transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  Settings
                </Link>
              </li>
              <li>
                <Link 
                  to="/#pricing-section" 
                  className="block px-4 py-2 text-brand-black dark:text-gray-200 hover:text-brand-purple hover:bg-brand-purple/5 dark:hover:bg-brand-purple/10 rounded-lg transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  Subscription Plans
                </Link>
              </li>
            </>
          ) : (
            <>
              {isLandingPage && (
                <>
                  <li>
                    <Link 
                      to={isLoggedIn ? "/browse" : "/login"} 
                      className="block px-4 py-2 text-brand-black dark:text-gray-200 hover:text-brand-purple hover:bg-brand-purple/5 dark:hover:bg-brand-purple/10 rounded-lg transition-colors"
                      onClick={() => setMobileOpen(false)}
                    >
                      Find Gigs
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to={isLoggedIn ? "/browse" : "/login"} 
                      className="block px-4 py-2 text-brand-black dark:text-gray-200 hover:text-brand-purple hover:bg-brand-purple/5 dark:hover:bg-brand-purple/10 rounded-lg transition-colors"
                      onClick={() => setMobileOpen(false)}
                    >
                      Find Talent
                    </Link>
                  </li>
                  <li>
                    <a 
                      href="/#how-it-works" 
                      className="block px-4 py-2 text-brand-black dark:text-gray-200 hover:text-brand-purple hover:bg-brand-purple/5 dark:hover:bg-brand-purple/10 rounded-lg transition-colors"
                      onClick={() => setMobileOpen(false)}
                    >
                      How it works
                    </a>
                  </li>
                </>
              )}
            </>
          )}
        </ul>
      )}
    </nav>
  );
};

export default TopNav;
