import React, { useState, useEffect, useRef } from 'react';
import { Bell, Check, ExternalLink, MessageSquare, Briefcase, Info, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../hooks/useNotifications';
import { notificationsService } from '../services/notificationsService';
import { supabase } from '../services/supabaseClient';

const NotificationDropdown: React.FC = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const { notifications, unreadCount, setNotifications, setUnreadCount } = useNotifications(user?.id);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggle = () => setIsOpen(!isOpen);

  const handleMarkAsRead = async (id: string) => {
    const { error } = await notificationsService.markAsRead(id);
    if (!error) {
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    }
  };

  const handleMarkAllAsRead = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const { error } = await notificationsService.markAllAsRead(session.user.id);
    if (!error) {
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
      setUnreadCount(0);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'gig_new': return <Briefcase className="w-4 h-4 text-blue-600 dark:text-blue-400" />;
      case 'message_new': return <MessageSquare className="w-4 h-4 text-blue-500" />;
      case 'application_update': return <Check className="w-4 h-4 text-emerald-500" />;
      default: return <Info className="w-4 h-4 text-gray-500 dark:text-gray-400" />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={handleToggle}
        className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
        aria-label="Notifications"
      >
        <Bell className="w-6 h-6 text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-5 h-5 bg-blue-500 dark:bg-blue-400 text-white dark:text-gray-900 text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white dark:border-gray-800 shadow-sm">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50"
          >
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-900/50">
              <h3 className="font-black text-gray-900 dark:text-gray-100 tracking-tight">Notifications</h3>
              {unreadCount > 0 && (
                <button 
                  onClick={handleMarkAllAsRead}
                  className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Mark all as read
                </button>
              )}
            </div>

            <div className="max-h-[400px] overflow-y-auto divide-y divide-gray-100 dark:divide-gray-700">
              {notifications.length > 0 ? (
                notifications.map((notif) => (
                  <div 
                    key={notif.id}
                    className={`p-4 flex gap-4 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors relative group ${!notif.is_read ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}`}
                  >
                    <div className="flex-shrink-0 mt-1">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${!notif.is_read ? 'bg-blue-100 dark:bg-blue-900/30' : 'bg-gray-100 dark:bg-gray-700'}`}>
                        {getIcon(notif.type)}
                      </div>
                    </div>
                    
                    <div className="flex-grow min-w-0">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className={`text-sm font-bold truncate ${!notif.is_read ? 'text-gray-900 dark:text-gray-100' : 'text-gray-500 dark:text-gray-400'}`}>
                          {notif.title}
                        </h4>
                        <span className="text-[10px] text-gray-500 dark:text-gray-400 whitespace-nowrap ml-2">
                          {new Date(notif.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-xs text-gray-700 dark:text-gray-300 line-clamp-2 mb-2">
                        {notif.message}
                      </p>
                      
                      <div className="flex items-center gap-3">
                        {notif.link && (
                          <Link 
                            to={notif.link}
                            onClick={() => {
                              handleMarkAsRead(notif.id);
                              setIsOpen(false);
                            }}
                            className="text-[10px] font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1 hover:underline"
                          >
                            View details <ExternalLink className="w-2.5 h-2.5" />
                          </Link>
                        )}
                        {!notif.is_read && (
                          <button 
                            onClick={() => handleMarkAsRead(notif.id)}
                            className="text-[10px] font-bold text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                          >
                            Mark as read
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-12 text-center">
                  <Bell className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                  <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">No notifications yet</p>
                </div>
              )}
            </div>

            <div className="p-3 border-t border-gray-200 dark:border-gray-700 text-center bg-gray-50 dark:bg-gray-900/50">
              <Link 
                to="/notifications" 
                onClick={() => setIsOpen(false)}
                className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
              >
                View all notifications
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationDropdown;
