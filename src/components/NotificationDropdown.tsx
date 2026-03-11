import React, { useState, useEffect, useRef } from 'react';
import { Bell, Check, ExternalLink, MessageSquare, Briefcase, Info, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { notificationsService, Notification } from '../services/notificationsService';
import { supabase } from '../services/supabaseClient';

const NotificationDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data, error } = await notificationsService.getNotifications(session.user.id);
      if (data) {
        setNotifications(data);
        setUnreadCount(data.filter(n => !n.is_read).length);
      }

      // Subscribe to real-time updates
      const subscription = notificationsService.subscribeToNotifications(session.user.id, (newNotif) => {
        setNotifications(prev => [newNotif, ...prev]);
        setUnreadCount(prev => prev + 1);
      });

      return () => {
        subscription.unsubscribe();
      };
    };

    fetchNotifications();

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
      case 'gig_new': return <Briefcase className="w-4 h-4 text-brand-purple" />;
      case 'message_new': return <MessageSquare className="w-4 h-4 text-blue-500" />;
      case 'application_update': return <Check className="w-4 h-4 text-emerald-500" />;
      default: return <Info className="w-4 h-4 text-brand-gray-dark" />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={handleToggle}
        className="relative p-2 rounded-full hover:bg-brand-gray transition-colors group"
        aria-label="Notifications"
      >
        <Bell className="w-6 h-6 text-brand-black group-hover:text-brand-purple transition-colors" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-5 h-5 bg-brand-purple text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white shadow-sm">
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
            className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-3xl shadow-2xl border border-brand-purple-light/10 overflow-hidden z-50"
          >
            <div className="p-4 border-b border-brand-purple-light/10 flex justify-between items-center bg-brand-gray/30">
              <h3 className="font-black text-brand-black tracking-tight">Notifications</h3>
              {unreadCount > 0 && (
                <button 
                  onClick={handleMarkAllAsRead}
                  className="text-xs font-bold text-brand-purple hover:underline"
                >
                  Mark all as read
                </button>
              )}
            </div>

            <div className="max-h-[400px] overflow-y-auto divide-y divide-brand-purple-light/5">
              {notifications.length > 0 ? (
                notifications.map((notif) => (
                  <div 
                    key={notif.id}
                    className={`p-4 flex gap-4 hover:bg-brand-purple-soft/30 transition-colors relative group ${!notif.is_read ? 'bg-brand-purple-soft/10' : ''}`}
                  >
                    <div className="flex-shrink-0 mt-1">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${!notif.is_read ? 'bg-brand-purple-soft' : 'bg-brand-gray'}`}>
                        {getIcon(notif.type)}
                      </div>
                    </div>
                    
                    <div className="flex-grow min-w-0">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className={`text-sm font-bold truncate ${!notif.is_read ? 'text-brand-black' : 'text-brand-gray-dark'}`}>
                          {notif.title}
                        </h4>
                        <span className="text-[10px] text-brand-gray-dark whitespace-nowrap ml-2">
                          {new Date(notif.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-xs text-brand-gray-dark line-clamp-2 mb-2">
                        {notif.content}
                      </p>
                      
                      <div className="flex items-center gap-3">
                        {notif.link && (
                          <Link 
                            to={notif.link}
                            onClick={() => {
                              handleMarkAsRead(notif.id);
                              setIsOpen(false);
                            }}
                            className="text-[10px] font-bold text-brand-purple flex items-center gap-1 hover:underline"
                          >
                            View details <ExternalLink className="w-2.5 h-2.5" />
                          </Link>
                        )}
                        {!notif.is_read && (
                          <button 
                            onClick={() => handleMarkAsRead(notif.id)}
                            className="text-[10px] font-bold text-brand-gray-dark hover:text-brand-purple transition-colors"
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
                  <Bell className="w-12 h-12 text-brand-gray-dark/20 mx-auto mb-4" />
                  <p className="text-sm text-brand-gray-dark font-medium">No notifications yet</p>
                </div>
              )}
            </div>

            <div className="p-3 border-t border-brand-purple-light/10 text-center bg-brand-gray/30">
              <Link 
                to="/notifications" 
                onClick={() => setIsOpen(false)}
                className="text-xs font-bold text-brand-purple hover:underline"
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
