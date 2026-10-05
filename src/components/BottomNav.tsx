import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, Search, Plus, MessageCircle, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNotificationContext } from '../context/NotificationContext';
import { profilesService } from '../services/profilesService';
import CreateHubModal from './CreateHubModal';

const BottomNav: React.FC = () => {
  const location = useLocation();
  const { user, profile: authProfile } = useAuth();
  const { unreadMessagesCount } = useNotificationContext();
  const [profile, setProfile] = useState<any>(authProfile);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  useEffect(() => {
    if (authProfile) {
      setProfile(authProfile);
      return;
    }

    const fetchProfile = async () => {
      if (user) {
        const { data } = await profilesService.getProfile(user.id);
        if (data) setProfile(data);
      } else {
        setProfile(null);
      }
    };
    fetchProfile();
  }, [user, authProfile]);

  const profilePath = user?.id ? `/profile/${user.id}` : '/edit-profile';

  const navItems = [
    { icon: <Home className="w-5 h-5" />, label: 'Home', path: '/overview' },
    { icon: <Search className="w-5 h-5" />, label: 'Explore', path: '/browse' },
    { icon: <Plus className="w-6 h-6 stroke-[2.5px]" />, label: 'Create', path: '/post', isAction: true },
    { icon: <MessageCircle className="w-5 h-5" />, label: 'Messages', path: '/messages' },
    { 
      icon: profile?.avatar_url ? (
        <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover rounded-full block" referrerPolicy="no-referrer" />
      ) : (
        <User className="w-5 h-5" />
      ), 
      label: 'Profile', 
      path: profilePath,
      isProfile: true,
    },
  ];

  const checkIsActive = (itemPath: string) => {
    if (itemPath === '/overview') return location.pathname === '/overview';
    if (itemPath === '/browse') return location.pathname.startsWith('/browse');
    if (itemPath === '/messages') return location.pathname.startsWith('/messages') || location.pathname.startsWith('/chat');
    if (user?.id && itemPath.includes(user.id)) {
      return location.pathname.startsWith(`/profile/${user.id}`) || location.pathname.startsWith('/edit-profile');
    }
    return location.pathname.startsWith(itemPath);
  };

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-brand-black/95 backdrop-blur-2xl border-t border-gray-100 dark:border-brand-dark-card px-2 pb-[env(safe-area-inset-bottom)] pt-1.5 lg:hidden transition-colors shadow-[0_-4px_25px_rgba(0,0,0,0.06)]">
        <div className="max-w-md mx-auto flex items-center justify-between h-14 px-1">
          {navItems.map((item) => {
            if (item.isAction) {
              return (
                <button
                  key={item.path}
                  onClick={() => setIsCreateModalOpen(true)}
                  className="relative -top-5 flex flex-col items-center justify-center flex-1 h-full"
                  aria-label="Create Post or Gig"
                >
                  <div className="w-12 h-12 rounded-full bg-brand-purple flex items-center justify-center text-white shadow-lg shadow-brand-purple/30 border-4 border-white dark:border-brand-black active:scale-95 transition-all duration-300">
                    {item.icon}
                  </div>
                  <span className="text-[10px] font-bold text-brand-purple mt-1 opacity-90">
                    {item.label}
                  </span>
                </button>
              );
            }

            const isActive = checkIsActive(item.path);
            
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className="flex flex-col items-center justify-center gap-0.5 group relative flex-1 h-full"
              >
                <div className={`relative ${
                  item.isProfile ? 'w-8 h-8 p-0' : 'px-3 py-1'
                } rounded-full transition-all duration-300 flex items-center justify-center ${
                  isActive 
                    ? 'bg-brand-purple/10 dark:bg-brand-purple/20 text-brand-purple' 
                    : 'text-gray-400 dark:text-gray-500 hover:text-brand-purple'
                }`}>
                  
                  {item.isProfile ? (
                    <div className={`w-7 h-7 rounded-full overflow-hidden shrink-0 flex items-center justify-center transition-all ${
                      isActive ? 'ring-2 ring-brand-purple ring-offset-2 dark:ring-offset-brand-black' : ''
                    }`}>
                      {item.icon}
                    </div>
                  ) : (
                    React.cloneElement(item.icon as React.ReactElement, { 
                      className: `w-5 h-5 transition-transform duration-300 ${isActive ? 'scale-105 stroke-[2.5px]' : 'scale-100'}` 
                    })
                  )}
                  {item.path === '/messages' && unreadMessagesCount > 0 && (
                    <span className="absolute top-0 right-2 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white dark:ring-brand-black shadow-sm" />
                  )}
                </div>
                
                <span className={`text-[10px] transition-all duration-200 ${
                  isActive 
                    ? 'font-bold text-brand-purple' 
                    : 'font-medium text-gray-400 dark:text-gray-500'
                }`}>
                  {item.label}
                </span>
              </NavLink>
            );
          })}
        </div>
      </nav>
      <CreateHubModal 
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </>
  );
};

export default BottomNav;
