import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Bell, Sun, Moon } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useDarkMode } from "../context/DarkModeContext";
import { useNotifications } from "../hooks/useNotifications";
import { supabase } from "../services/supabaseClient";
import Logo from "./Logo";

const TopNav: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isDark, toggleDarkMode } = useDarkMode();
  const { user } = useAuth();
  const { unreadCount } = useNotifications(user?.id);
  const navigate = useNavigate();

  const toggleMobile = () => setMobileOpen(!mobileOpen);

  // Only show links for logged-in users
  const isLoggedIn = !!user;

  return (
    <nav className="bg-white dark:bg-brand-dark shadow-md p-4 flex items-center justify-between relative z-50 transition-colors">
      {/* Left: Clickable Logo + App Name */}
      <div 
        className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity" 
        onClick={() => navigate("/")}
      >
        <Logo iconClassName="w-8 h-8" />
        <span className="text-xl font-bold text-brand-black dark:text-white tracking-tighter">
          Gigs<span className="text-brand-purple">Connect</span>
        </span>
      </div>

      {/* Right: Notifications + Toggle */}
      <div className="flex items-center space-x-2 sm:space-x-4">
        {/* Dark Mode Toggle */}
        <button 
          onClick={toggleDarkMode}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-700 dark:text-gray-300"
          title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

        {isLoggedIn && (
          <>
            {/* Notifications always visible */}
            <Link to="/notifications" className="relative p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
              <Bell className="w-6 h-6 text-gray-700 dark:text-gray-300" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 inline-flex items-center justify-center w-5 h-5 text-[10px] font-black text-white bg-red-500 rounded-full border-2 border-white dark:border-brand-dark shadow-sm">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </Link>

            {/* Mobile toggle */}
            <button 
              className="md:hidden p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors" 
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              <span className="text-2xl">☰</span>
            </button>
          </>
        )}
      </div>

      {/* Mobile menu */}
      {mobileOpen && isLoggedIn && (
        <ul className="absolute top-16 right-4 bg-white dark:bg-brand-dark shadow-lg rounded-xl flex flex-col p-4 space-y-2 md:hidden z-50 border border-gray-100 dark:border-gray-800 min-w-[200px]">
          <li>
            <Link 
              to="/overview" 
              className="block px-4 py-2 text-brand-black dark:text-gray-200 hover:text-brand-purple hover:bg-brand-purple-soft dark:hover:bg-brand-purple/10 rounded-lg transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              Overview
            </Link>
          </li>
          <li>
            <Link 
              to="/applications" 
              className="block px-4 py-2 text-brand-black dark:text-gray-200 hover:text-brand-purple hover:bg-brand-purple-soft dark:hover:bg-brand-purple/10 rounded-lg transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              My Applications
            </Link>
          </li>
          <li>
            <Link 
              to="/posted-gigs" 
              className="block px-4 py-2 text-brand-black dark:text-gray-200 hover:text-brand-purple hover:bg-brand-purple-soft dark:hover:bg-brand-purple/10 rounded-lg transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              My Posted Gigs
            </Link>
          </li>
          <li>
            <Link 
              to="/edit-profile" 
              className="block px-4 py-2 text-brand-black dark:text-gray-200 hover:text-brand-purple hover:bg-brand-purple-soft dark:hover:bg-brand-purple/10 rounded-lg transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              Edit Profile
            </Link>
          </li>
          <li>
            <Link 
              to="/subscription" 
              className="block px-4 py-2 text-brand-black dark:text-gray-200 hover:text-brand-purple hover:bg-brand-purple-soft dark:hover:bg-brand-purple/10 rounded-lg transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              Subscription
            </Link>
          </li>
        </ul>
      )}
    </nav>
  );
};

export default TopNav;
