import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Bell, Search, User, ChevronDown, MessageCircle, Plus } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { profilesService } from "../services/profilesService";
import { useNotificationContext } from "../context/NotificationContext";
import { supabase } from "../services/supabaseClient";
import Logo from "./Logo";
import CreateHubModal from "./CreateHubModal";

const TopNav: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [navSearch, setNavSearch] = useState("");
  const { user, profile: authProfile } = useAuth();
  const [profile, setProfile] = useState<any>(authProfile);
  const { unreadCount, unreadMessagesCount, markAllAsRead } = useNotificationContext();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (authProfile) {
      setProfile(authProfile);
      return;
    }

    const fetchProfile = async () => {
      if (user?.id) {
        const { data } = await profilesService.getProfile(user.id);
        if (data) setProfile(data);
      } else {
        setProfile(null);
      }
    };
    fetchProfile();
  }, [user, authProfile]);

  const toggleMobile = () => setMobileOpen(!mobileOpen);

  const isLoggedIn = !!user;
  const isLandingPage = location.pathname === "/";
  const isAuthPage = 
    location.pathname === "/login" || 
    location.pathname === "/signup" ||
    location.pathname === "/forgot-password" ||
    location.pathname === "/reset-password";
  const profilePath = user?.id ? `/profile/${user.id}` : "/edit-profile";

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isLandingPage 
          ? "bg-white/70 dark:bg-brand-black/70 backdrop-blur-md border-b border-white/20 dark:border-white/10 shadow-sm" 
          : "bg-brand-white dark:bg-brand-black shadow-md border-b border-brand-gray dark:border-brand-dark-card"
      } px-4 pb-4 pt-[calc(1rem+env(safe-area-inset-top))] flex items-center justify-between gap-4`}>
      
        {/* Left: Clickable Logo */}
        <div className="flex items-center gap-4 shrink-0">
          <Link 
            to={isLoggedIn ? "/overview" : "/"}
            className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity shrink-0" 
          >
            <Logo iconClassName="w-8 h-8 sm:w-10 sm:h-10" />
            <span className="text-xl sm:text-2xl font-black text-brand-black dark:text-brand-white tracking-tighter">
              Gigs<span className="text-brand-purple">Connect</span>
            </span>
          </Link>
        </div>

        {/* Center: Wide rounded search input (Desktop logged-in) or Landing links (Desktop logged-out) */}
        {isLoggedIn ? (
          <div className="hidden lg:flex items-center flex-1 max-w-xl mx-4">
            <div className="relative w-full">
              <Search className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search gigs, skills, creators..."
                value={navSearch}
                onChange={(e) => setNavSearch(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && navSearch.trim()) {
                    navigate(`/browse?q=${encodeURIComponent(navSearch.trim())}`);
                  }
                }}
                className="w-full pl-10 pr-4 py-2 text-sm rounded-full bg-gray-100 dark:bg-brand-dark-card border border-transparent hover:border-gray-200 dark:hover:border-zinc-800 focus:border-brand-purple/40 dark:focus:border-brand-purple/40 focus:bg-white dark:focus:bg-[#121214] text-brand-black dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none transition-all shadow-sm"
              />
            </div>
          </div>
        ) : (
          isLandingPage && (
            <div className="hidden lg:flex items-center gap-6 xl:gap-8">
              <Link to="/browse" className="text-sm font-bold text-brand-gray-dark dark:text-gray-300 hover:text-brand-purple transition-colors">Find Gigs</Link>
              <Link to="/browse" className="text-sm font-bold text-brand-gray-dark dark:text-gray-300 hover:text-brand-purple transition-colors">Find Talent</Link>
              <a href="/#how-it-works" className="text-sm font-bold text-brand-gray-dark dark:text-gray-300 hover:text-brand-purple transition-colors">How it works</a>
            </div>
          )
        )}

        {/* Right: Actions */}
        <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
          {/* Logged out: Desktop Login/Signup */}
          {!isLoggedIn && !isAuthPage && (
            <div className="hidden lg:flex items-center gap-4">
              <Link to="/login" className="text-sm font-bold text-brand-black dark:text-brand-white hover:text-brand-purple transition-colors">Log in</Link>
              <Link to="/signup" className="px-6 py-2.5 rounded-full bg-brand-purple text-white text-sm font-bold hover:bg-brand-purple-dark hover:shadow-glow transition-all active:scale-95 whitespace-nowrap">
                Join for free
              </Link>
            </div>
          )}

          {/* Logged out: Mobile Hamburger Menu Button */}
          {!isLoggedIn && !isAuthPage && (
            <button 
              className="lg:hidden p-2 text-brand-black dark:text-gray-400 hover:bg-brand-gray dark:hover:bg-brand-dark-card rounded-lg transition-colors" 
              onClick={toggleMobile}
              aria-label="Toggle menu"
            >
              <span className="text-2xl">☰</span>
            </button>
          )}

          {/* Logged in: Mobile Header Controls (Notifications Bell + User Avatar) */}
          {isLoggedIn && (
            <div className="flex items-center gap-1.5 lg:hidden">
              <Link 
                to="/notifications" 
                onClick={() => {
                  if (unreadCount > 0) markAllAsRead();
                }}
                className="relative p-2 hover:bg-brand-gray dark:hover:bg-brand-dark-card rounded-full transition-colors group"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5 text-brand-black dark:text-gray-300 group-hover:text-brand-purple transition-colors" />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 inline-flex items-center justify-center min-w-[16px] h-4 px-1 text-[9px] font-black text-brand-white bg-brand-purple rounded-full border-2 border-brand-white dark:border-brand-black shadow-sm">
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </span>
                )}
              </Link>

              <div className="relative">
                <button 
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center ring-2 ring-transparent active:ring-brand-purple transition-all focus:outline-none"
                  aria-label="User profile menu"
                >
                  {profile?.avatar_url ? (
                    <img 
                      src={profile.avatar_url} 
                      alt="Profile" 
                      className="w-full h-full object-cover rounded-full" 
                      referrerPolicy="no-referrer" 
                    />
                  ) : (
                    <div className="w-full h-full bg-brand-purple/10 flex items-center justify-center text-brand-purple">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </button>

                {profileDropdownOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setProfileDropdownOpen(false)} 
                    />
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-brand-black rounded-xl shadow-lg border border-brand-gray dark:border-brand-dark-card py-2 z-50">
                      <Link 
                        to={profilePath} 
                        className="block px-4 py-2 text-sm text-brand-black dark:text-white hover:bg-brand-purple/5 dark:hover:bg-brand-dark-card font-medium transition-colors" 
                        onClick={() => setProfileDropdownOpen(false)}
                      >
                        Profile
                      </Link>
                      <Link 
                        to="/settings" 
                        className="block px-4 py-2 text-sm text-brand-black dark:text-white hover:bg-brand-purple/5 dark:hover:bg-brand-dark-card font-medium transition-colors" 
                        onClick={() => setProfileDropdownOpen(false)}
                      >
                        Settings
                      </Link>
                      <div className="h-px bg-brand-gray dark:bg-brand-dark-card my-1" />
                      <button 
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          handleLogout();
                        }} 
                        className="w-full text-left block px-4 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 font-medium transition-colors"
                      >
                        Log out
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Logged in: Desktop Actions (Create + Messages + Bell + Avatar Dropdown) */}
          {isLoggedIn && (
            <div className="hidden lg:flex items-center gap-3">
              {/* Task 2: Desktop Create (+) Button */}
              <button 
                onClick={() => setIsCreateModalOpen(true)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-brand-purple text-white text-xs sm:text-sm font-bold hover:bg-brand-purple-hover hover:shadow-md transition-all active:scale-95 whitespace-nowrap shadow-sm shadow-brand-purple/20 cursor-pointer"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span>Create</span>
              </button>

              {/* Messages Link with Unread Dot/Badge */}
              <Link 
                to="/messages" 
                className="relative p-2.5 hover:bg-gray-100 dark:hover:bg-brand-dark-card rounded-full transition-colors group"
                aria-label="Messages"
              >
                <MessageCircle className="w-5 h-5 text-gray-700 dark:text-gray-300 group-hover:text-brand-purple transition-colors" />
                {unreadMessagesCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-white dark:ring-brand-black shadow-sm" />
                )}
              </Link>

              {/* Notifications Bell */}
              <Link 
                to="/notifications" 
                onClick={() => {
                  if (unreadCount > 0) markAllAsRead();
                }}
                className="relative p-2.5 hover:bg-gray-100 dark:hover:bg-brand-dark-card rounded-full transition-colors group"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5 text-gray-700 dark:text-gray-300 group-hover:text-brand-purple transition-colors" />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 inline-flex items-center justify-center min-w-[18px] h-4.5 px-1 text-[10px] font-black text-brand-white bg-brand-purple rounded-full border-2 border-brand-white dark:border-brand-black shadow-sm">
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </span>
                )}
              </Link>

              {/* Profile button with real avatar_url or fallback */}
              <div className="relative">
                <button 
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2 p-1 pl-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-brand-dark-card transition-colors border border-transparent hover:border-gray-200 dark:hover:border-zinc-800 focus:outline-none"
                  aria-label="Profile menu"
                >
                  <div className="w-8 h-8 rounded-full bg-brand-purple/10 flex items-center justify-center text-brand-purple overflow-hidden ring-1 ring-brand-purple/20 shrink-0">
                    {profile?.avatar_url ? (
                      <img 
                        src={profile.avatar_url} 
                        alt={profile.full_name || "Profile"} 
                        className="w-full h-full object-cover rounded-full" 
                        referrerPolicy="no-referrer" 
                      />
                    ) : (
                      <User className="w-4 h-4" />
                    )}
                  </div>
                  <ChevronDown className="w-4 h-4 text-brand-gray-dark dark:text-gray-400 mr-1" />
                </button>

                {profileDropdownOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setProfileDropdownOpen(false)} 
                    />
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-brand-black rounded-xl shadow-lg border border-brand-gray dark:border-brand-dark-card py-2 z-50">
                      <Link 
                        to={profilePath} 
                        className="block px-4 py-2 text-sm text-brand-black dark:text-white hover:bg-brand-purple/5 dark:hover:bg-brand-dark-card font-medium transition-colors" 
                        onClick={() => setProfileDropdownOpen(false)}
                      >
                        Profile
                      </Link>
                      <Link 
                        to="/settings" 
                        className="block px-4 py-2 text-sm text-brand-black dark:text-white hover:bg-brand-purple/5 dark:hover:bg-brand-dark-card font-medium transition-colors" 
                        onClick={() => setProfileDropdownOpen(false)}
                      >
                        Settings
                      </Link>
                      <div className="h-px bg-brand-gray dark:bg-brand-dark-card my-1" />
                      <button 
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          handleLogout();
                        }} 
                        className="w-full text-left block px-4 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 font-medium transition-colors" 
                      >
                        Log out
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Mobile menu (logged-out users only) */}
        {!isLoggedIn && mobileOpen && (
          <ul className="absolute top-16 right-4 bg-brand-white dark:bg-brand-black shadow-lg rounded-xl flex flex-col p-4 space-y-2 lg:hidden z-50 border border-brand-gray dark:border-brand-dark-card min-w-[200px]">
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
