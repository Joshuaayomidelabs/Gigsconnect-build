import React, { useState, useEffect, useRef } from 'react';
import { Bell, Check, ExternalLink, MessageSquare, Briefcase, Info, X, User } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotificationContext } from '../context/NotificationContext';
import { notificationsService } from '../services/notificationsService';
import { supabase } from '../services/supabaseClient';

const NotificationDropdown: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotificationContext();
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

  const handleToggle = () => {
    const newIsOpen = !isOpen;
    setIsOpen(newIsOpen);
    
    // Auto-mark as read when opening the panel
    if (newIsOpen && unreadCount > 0) {
      handleMarkAllAsRead();
    }
  };

  const handleMarkAsRead = async (id: string) => {
    await markAsRead(id);
  };

  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'gig_new': return <Briefcase className="w-4 h-4 text-brand-purple" />;
      case 'message_new': return <MessageSquare className="w-4 h-4 text-brand-purple" />;
      case 'application_update': return <Check className="w-4 h-4 text-brand-purple" />;
      default: return <Info className="w-4 h-4 text-gray-500 dark:text-gray-400" />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={handleToggle}
        className="relative p-2 rounded-full hover:bg-brand-gray dark:hover:bg-brand-black transition-colors group"
        aria-label="Notifications"
      >
        <Bell className="w-6 h-6 text-brand-black dark:text-brand-white group-hover:text-brand-purple transition-colors" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-5 h-5 bg-brand-purple text-brand-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-brand-white dark:border-brand-dark-card shadow-sm">
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
            className="absolute right-0 mt-2 w-80 sm:w-96 bg-brand-white dark:bg-brand-dark-card rounded-3xl shadow-2xl border border-brand-gray dark:border-brand-black overflow-hidden z-50"
          >
            <div className="p-4 border-b border-brand-gray dark:border-brand-black flex justify-between items-center bg-brand-gray dark:bg-brand-black/50">
              <h3 className="font-black text-brand-black dark:text-brand-white tracking-tight">Notifications</h3>
            </div>

            <div className="max-h-[400px] overflow-y-auto divide-y divide-brand-gray dark:divide-brand-black">
              {notifications.length > 0 ? (
                notifications.map((notif) => (
                  <div 
                    key={notif.id}
                    className={`p-4 flex gap-4 hover:bg-brand-purple/5 dark:hover:bg-brand-purple/20 transition-colors relative group ${!notif.is_read ? 'bg-brand-purple/5 dark:bg-brand-purple/10' : ''}`}
                  >
                    <div className="flex-shrink-0 mt-1">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${!notif.is_read ? 'bg-brand-purple/10 dark:bg-brand-purple/30' : 'bg-brand-gray dark:bg-brand-black'}`}>
                        {getIcon(notif.type)}
                      </div>
                    </div>
                    
                    <div className="flex-grow min-w-0">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className={`text-sm font-black truncate ${!notif.is_read ? 'text-brand-black dark:text-brand-white' : 'text-gray-500 dark:text-gray-400 font-bold'}`}>
                          {notif.title}
                        </h4>
                        <span className="text-[10px] text-gray-500 dark:text-gray-400 whitespace-nowrap ml-2">
                          {new Date(notif.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      
                      {notif.type === 'gig_application' && notif.metadata?.applicant_name && (
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-6 h-6 rounded-full overflow-hidden bg-brand-purple-soft flex items-center justify-center">
                            {notif.metadata.applicant_avatar ? (
                              <img src={notif.metadata.applicant_avatar} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <User className="w-3 h-3 text-brand-purple" />
                            )}
                          </div>
                          <span className={`text-xs font-bold ${!notif.is_read ? 'text-brand-black dark:text-brand-white' : 'text-gray-600 dark:text-gray-400'}`}>
                            {notif.metadata.applicant_name}
                          </span>
                          {notif.metadata.role && (
                            <span className="text-[10px] text-gray-500 dark:text-gray-400 bg-brand-gray dark:bg-brand-black px-1.5 py-0.5 rounded">
                              {notif.metadata.role}
                            </span>
                          )}
                        </div>
                      )}

                      <p className={`text-xs line-clamp-2 mb-3 ${!notif.is_read ? 'text-brand-black dark:text-brand-white font-bold' : 'text-gray-700 dark:text-gray-300 font-medium'}`}>
                        {notif.message}
                      </p>
                      
                      <div className="flex items-center gap-2">
                        {notif.link && (
                          <button 
                            onClick={() => {
                              handleMarkAsRead(notif.id);
                              setIsOpen(false);

                              switch (notif.type) {
                                case "gig_application":
                                  navigate(`/applications/${notif.reference_id}`);
                                  break;

                                case "application_update":
                                  navigate(`/applications/${notif.reference_id}`);
                                  break;

                                default:
                                  console.warn("Unknown notification type:", notif.type);
                                  break;
                              }
                            }}
                            className={`text-[10px] font-bold px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 ${
                              notif.type === 'gig_application' 
                                ? 'bg-brand-purple text-brand-white hover:bg-brand-purple-dark' 
                                : 'text-brand-purple hover:bg-brand-purple-soft'
                            }`}
                          >
                            {notif.type === 'gig_application' ? 'View Application' : 'View Details'}
                            {notif.type !== 'gig_application' && <ExternalLink className="w-2.5 h-2.5" />}
                          </button>
                        )}
                        
                        {notif.type === 'gig_application' && (
                          <Link 
                            to="/messages"
                            onClick={() => {
                              handleMarkAsRead(notif.id);
                              setIsOpen(false);
                            }}
                            className="text-[10px] font-bold text-brand-purple border border-brand-purple px-3 py-1.5 rounded-lg hover:bg-brand-purple-soft transition-all"
                          >
                            Message Applicant
                          </Link>
                        )}

                        {!notif.is_read && notif.type !== 'gig_application' && (
                          <button 
                            onClick={() => handleMarkAsRead(notif.id)}
                            className="text-[10px] font-bold text-gray-500 dark:text-gray-400 hover:text-brand-purple transition-colors ml-auto"
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

            <div className="p-3 border-t border-brand-gray dark:border-brand-black text-center bg-brand-gray dark:bg-brand-black/50">
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
