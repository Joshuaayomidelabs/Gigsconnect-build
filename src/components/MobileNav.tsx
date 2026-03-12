import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Search, PlusSquare, Briefcase, User } from 'lucide-react';
import { motion } from 'motion/react';

const MobileNav: React.FC = () => {
  const location = useLocation();
  
  const navItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Search, label: 'Browse', path: '/browse' },
    { icon: PlusSquare, label: 'Post', path: '/post', isCenter: true },
    { icon: Briefcase, label: 'Gigs', path: '/applications' },
    { icon: User, label: 'Profile', path: '/edit-profile' },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';
  if (isAuthPage) return null;

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 px-6 pb-8 pointer-events-none">
      <div className="max-w-md mx-auto bg-white/95 dark:bg-gray-900/95 backdrop-blur-2xl rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-white/20 dark:border-gray-800/50 flex items-center justify-between px-2 py-2 pointer-events-auto ring-1 ring-black/5">
        {navItems.map((item) => {
          const active = isActive(item.path);
          
          if (item.isCenter) {
            return (
              <Link
                key={item.path}
                to={item.path}
                className="relative -top-6"
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-14 h-14 bg-brand-600 rounded-2xl shadow-[0_8px_20px_rgba(37,99,235,0.4)] flex items-center justify-center text-white border-4 border-white dark:border-gray-900"
                >
                  <PlusSquare className="w-7 h-7" strokeWidth={2.5} />
                </motion.div>
                <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-brand-600 dark:text-brand-400">
                  {item.label}
                </span>
              </Link>
            );
          }

          return (
            <Link
              key={item.path}
              to={item.path}
              className="relative flex flex-col items-center justify-center py-2 px-4 flex-1 group"
            >
              <motion.div
                whileTap={{ scale: 0.9 }}
                className="relative flex flex-col items-center"
              >
                <item.icon 
                  className={`w-6 h-6 transition-all duration-300 ${
                    active 
                      ? 'text-brand-600 dark:text-brand-400' 
                      : 'text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300'
                  }`} 
                  strokeWidth={active ? 2.5 : 2}
                />
                <span className={`text-[10px] font-bold mt-1 transition-all duration-300 ${
                  active 
                    ? 'text-brand-600 dark:text-brand-400 opacity-100' 
                    : 'text-gray-400 dark:text-gray-500 opacity-80'
                }`}>
                  {item.label}
                </span>
                
                {active && (
                  <motion.div
                    layoutId="mobile-nav-active"
                    className="absolute -top-1 w-1 h-1 bg-brand-600 dark:bg-brand-400 rounded-full"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </motion.div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileNav;
