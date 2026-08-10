import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, Search, Briefcase, Bell, User } from 'lucide-react';
import { motion } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { profilesService } from '../services/profilesService';
import { useNotificationContext } from '../context/NotificationContext';

const BottomNav: React.FC = () => {
  const location = useLocation();
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const { unreadCount } = useNotificationContext();

  useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        const { data } = await profilesService.getProfile(user.id);
        setProfile(data);
      } else {
        setProfile(null);
      }
    };
    fetchProfile();
  }, [user]);

  const navItems = [
    { icon: <Home />, label: 'Home', path: '/overview' },
    { icon: <Search />, label: 'Explore', path: '/browse' },
    { icon: <Briefcase />, label: 'Gigs', path: '/applications', matchPrefix: true },
    { 
      icon: <Bell />, 
      label: 'Notifications', 
      path: '/notifications',
      badge: unreadCount
    },
    { 
      icon: profile?.avatar_url ? (
        <img src={profile.avatar_url} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
      ) : (
        <User />
      ), 
      label: 'Profile', 
      path: '/edit-profile',
      isProfile: true,
      matchPrefix: true // matches /edit-profile, /create-profile etc if needed, or we just use it for profile
    },
  ];

  const checkIsActive = (itemPath: string, matchPrefix?: boolean) => {
    if (itemPath === '/overview') {
      return location.pathname === '/overview';
    }
    if (matchPrefix) {
      if (itemPath === '/applications' && location.pathname.startsWith('/applications')) return true;
      if (itemPath === '/applications' && location.pathname.startsWith('/posted-gigs')) return true;
      if (itemPath === '/edit-profile' && (location.pathname.startsWith('/edit-profile') || location.pathname.startsWith('/profile/'))) return true;
    }
    return location.pathname.startsWith(itemPath);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-brand-white dark:bg-brand-black/95 backdrop-blur-2xl border-t border-brand-gray dark:border-brand-dark-card px-2 pb-[env(safe-area-inset-bottom)] pt-2 lg:hidden transition-colors shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
      <div className="max-w-md mx-auto flex items-center justify-between h-14 px-2">
        {navItems.map((item) => {
          const isActive = checkIsActive(item.path, item.matchPrefix);
          
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className="flex flex-col items-center justify-center gap-1 group relative flex-1 h-full"
            >
              <div className={`relative p-1.5 rounded-xl transition-all duration-300 ${
                isActive 
                  ? 'text-brand-purple' 
                  : 'text-gray-400 dark:text-gray-500 hover:text-brand-purple'
              } ${item.isProfile ? 'w-8 h-8 flex items-center justify-center' : ''}`}>
                
                {item.isProfile ? (
                  <div className={`w-full h-full rounded-full overflow-hidden flex items-center justify-center ${isActive ? 'ring-2 ring-brand-purple ring-offset-1 dark:ring-offset-brand-black' : ''}`}>
                    {item.icon}
                  </div>
                ) : (
                  React.cloneElement(item.icon as React.ReactElement, { 
                    className: `w-6 h-6 transition-transform duration-300 ${isActive ? 'scale-110 stroke-[2.5px]' : 'scale-100'}` 
                  })
                )}

                {item.badge && item.badge > 0 ? (
                  <span className="absolute -top-0.5 -right-0.5 inline-flex items-center justify-center w-4 h-4 text-[9px] font-bold text-white bg-red-500 rounded-full border-2 border-white dark:border-brand-black">
                    {item.badge > 99 ? '99+' : item.badge}
                  </span>
                ) : null}
              </div>
              
              <span className={`text-[10px] font-semibold transition-all duration-300 ${
                isActive 
                  ? 'text-brand-purple opacity-100' 
                  : 'text-gray-400 dark:text-gray-500 opacity-80'
              }`}>
                {item.label}
              </span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
