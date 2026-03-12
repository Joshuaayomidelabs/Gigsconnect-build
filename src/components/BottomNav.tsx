import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, Search, PlusCircle, MessageCircle, User } from 'lucide-react';
import { motion } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { profilesService } from '../services/profilesService';

const BottomNav: React.FC = () => {
  const location = useLocation();
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);

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
    { icon: <Search />, label: 'Search', path: '/browse' },
    { icon: <PlusCircle />, label: 'Post', path: '/post', isAction: true },
    { icon: <MessageCircle />, label: 'Messages', path: '/messages' },
    { 
      icon: profile?.avatar_url ? (
        <img src={profile.avatar_url} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
      ) : (
        <User />
      ), 
      label: 'Profile', 
      path: '/edit-profile',
      isProfile: true
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-2xl border-t border-brand-purple-light/10 px-6 pb-safe pt-2 lg:hidden">
      <div className="max-w-md mx-auto flex items-center justify-between h-16">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          
          if (item.isAction) {
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className="relative -top-6 flex flex-col items-center justify-center"
              >
                <div className="w-14 h-14 rounded-full bg-brand-purple flex items-center justify-center text-white shadow-lg shadow-purple-500/30 border-4 border-white active:scale-90 transition-all duration-300">
                  {React.cloneElement(item.icon as React.ReactElement, { className: 'w-7 h-7' })}
                </div>
              </NavLink>
            );
          }

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className="flex flex-col items-center justify-center gap-1 group relative flex-1"
            >
              <div className={`p-2.5 rounded-2xl transition-all duration-300 overflow-hidden ${
                isActive 
                  ? 'text-brand-purple bg-brand-purple-soft/50' 
                  : 'text-brand-gray-dark group-hover:text-brand-purple group-hover:bg-brand-purple-soft/30'
              } ${item.isProfile ? 'w-10 h-10 flex items-center justify-center' : ''}`}>
                {item.isProfile ? (
                  <div className={`w-full h-full rounded-full overflow-hidden flex items-center justify-center ${isActive ? 'ring-2 ring-brand-purple' : ''}`}>
                    {item.icon}
                  </div>
                ) : (
                  React.cloneElement(item.icon as React.ReactElement, { 
                    className: `w-5 h-5 transition-all duration-300 ${isActive ? 'scale-110 stroke-[2.5px]' : 'group-active:scale-90'}` 
                  })
                )}
              </div>
              {isActive && (
                <motion.div 
                  layoutId="nav-indicator"
                  className="absolute -bottom-1 w-1 h-1 rounded-full bg-brand-purple shadow-[0_0_8px_rgba(124,58,237,0.5)]"
                />
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
