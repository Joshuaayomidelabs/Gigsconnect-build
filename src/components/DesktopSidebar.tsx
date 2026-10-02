import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Search, 
  Briefcase, 
  FileText, 
  MessageSquare, 
  BarChart2, 
  User, 
  Settings, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSubscription } from '../context/SubscriptionContext';
import { useNotificationContext } from '../context/NotificationContext';

interface DesktopSidebarProps {
  className?: string;
}

export const DesktopSidebar: React.FC<DesktopSidebarProps> = ({ className = '' }) => {
  const { user } = useAuth();
  const { subscription } = useSubscription();
  const { unreadMessagesCount } = useNotificationContext();

  const profilePath = user?.id ? `/profile/${user.id}` : '/edit-profile';

  // Check if user already has an active paid plan (not starter/free)
  const hasPaidPlan = Boolean(
    subscription &&
    subscription.status === 'active' &&
    subscription.plan?.name &&
    subscription.plan.name.toLowerCase() !== 'starter' &&
    ((subscription.plan.price_usd && subscription.plan.price_usd > 0) ||
      (subscription.plan.price_naira && subscription.plan.price_naira > 0))
  );

  const navItems = [
    { label: 'Dashboard', path: '/overview', icon: LayoutDashboard },
    { label: 'Discover Gigs', path: '/browse', icon: Search },
    { label: 'My Gigs', path: '/posted-gigs', icon: Briefcase },
    { label: 'Applications', path: '/applications', icon: FileText },
    { label: 'Messages', path: '/messages', icon: MessageSquare },
    { label: 'Analytics', path: '/analytics', icon: BarChart2 },
    { label: 'Profile', path: profilePath, icon: User },
    { label: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <aside 
      className={`hidden lg:flex flex-col fixed left-0 bottom-0 w-64 z-40 bg-white dark:bg-brand-dark-card border-r border-gray-100 dark:border-brand-dark-card top-[calc(4.5rem+env(safe-area-inset-top))] transition-colors ${className}`}
      aria-label="Desktop Sidebar"
    >
      {/* Scrollable Navigation Items */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1.5 no-scrollbar">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/overview'}
              className={({ isActive }) =>
                `flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-[#F5F2FF] dark:bg-brand-purple/15 text-brand-purple'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-brand-black/50 hover:text-brand-black dark:hover:text-white'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon className={`w-5 h-5 shrink-0 transition-colors ${
                    isActive ? 'text-brand-purple' : 'text-gray-400 dark:text-gray-400 group-hover:text-brand-black dark:group-hover:text-white'
                  }`} />
                  <span className="truncate">{item.label}</span>
                  {item.path === '/messages' && unreadMessagesCount > 0 && (
                    <span className="ml-auto inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 text-[10px] font-black text-white bg-red-500 rounded-full shadow-sm">
                      {unreadMessagesCount > 99 ? '99+' : unreadMessagesCount}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </div>

      {/* Upgrade to Pro purple gradient card (hidden if user already has paid plan) */}
      {!hasPaidPlan && (
        <div className="p-4 pt-2">
          <div className="relative overflow-hidden rounded-2xl p-4 bg-gradient-to-br from-brand-purple to-brand-purple-dark text-white shadow-lg shadow-brand-purple/20">
            {/* Decorative background glow */}
            <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full blur-xl pointer-events-none" />
            
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center backdrop-blur-sm">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="text-xs font-black uppercase tracking-wider text-white">Upgrade to Pro</span>
            </div>

            <p className="text-xs text-white/90 leading-relaxed mb-3 font-normal">
              Unlock more features and grow faster.
            </p>

            <NavLink
              to="/pricing"
              className="inline-flex items-center justify-center gap-1.5 w-full py-2 px-3 rounded-xl bg-white text-brand-purple text-xs font-bold shadow hover:bg-gray-50 active:scale-[0.98] transition-all"
            >
              <span>Get Started</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </NavLink>
          </div>
        </div>
      )}
    </aside>
  );
};

export default DesktopSidebar;
