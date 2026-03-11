import React, { useState, useEffect } from 'react';
import { Bell, Check, ExternalLink, MessageSquare, Briefcase, Info, Trash2, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { notificationsService, Notification } from '../services/notificationsService';
import { supabase } from '../services/supabaseClient';

const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setIsLoading(true);
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;

        const { data, error: fetchError } = await notificationsService.getNotifications(session.user.id);
        if (fetchError) throw fetchError;
        setNotifications(data || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (id: string) => {
    const { error } = await notificationsService.markAsRead(id);
    if (!error) {
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
    }
  };

  const handleMarkAllAsRead = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const { error } = await notificationsService.markAllAsRead(session.user.id);
    if (!error) {
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'gig_new': return <Briefcase className="w-6 h-6 text-brand-purple" />;
      case 'message_new': return <MessageSquare className="w-6 h-6 text-blue-500" />;
      case 'application_update': return <Check className="w-6 h-6 text-emerald-500" />;
      default: return <Info className="w-6 h-6 text-brand-gray-dark" />;
    }
  };

  return (
    <div className="pt-24 pb-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto min-h-screen bg-brand-gray">
      <header className="mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-brand-black tracking-tight mb-2">Notifications</h1>
          <p className="text-brand-gray-dark text-lg">Stay updated with your music career.</p>
        </div>
        {notifications.some(n => !n.is_read) && (
          <button 
            onClick={handleMarkAllAsRead}
            className="px-6 py-2 bg-white border border-brand-purple-light/20 rounded-xl text-sm font-bold text-brand-purple hover:bg-brand-purple-soft transition-all shadow-sm"
          >
            Mark all as read
          </button>
        )}
      </header>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-10 h-10 animate-spin text-brand-purple" />
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-100 rounded-3xl p-12 text-center">
          <p className="text-red-600 font-bold">{error}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {notifications.length > 0 ? (
            notifications.map((notif, i) => (
              <motion.div
                key={notif.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`bg-white rounded-[2rem] p-6 shadow-sm border border-brand-purple-light/10 flex gap-6 items-start relative group transition-all hover:shadow-md ${!notif.is_read ? 'ring-2 ring-brand-purple/10' : ''}`}
              >
                <div className={`flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center ${!notif.is_read ? 'bg-brand-purple-soft' : 'bg-brand-gray'}`}>
                  {getIcon(notif.type)}
                </div>

                <div className="flex-grow">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className={`text-lg font-black tracking-tight ${!notif.is_read ? 'text-brand-black' : 'text-brand-gray-dark'}`}>
                        {notif.title}
                      </h3>
                      <span className="text-xs text-brand-gray-dark font-medium">
                        {new Date(notif.created_at).toLocaleString()}
                      </span>
                    </div>
                    {!notif.is_read && (
                      <button 
                        onClick={() => handleMarkAsRead(notif.id)}
                        className="p-2 text-brand-purple hover:bg-brand-purple-soft rounded-full transition-all"
                        title="Mark as read"
                      >
                        <Check className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                  
                  <p className="text-brand-gray-dark mb-4 leading-relaxed">
                    {notif.content}
                  </p>

                  {notif.link && (
                    <Link 
                      to={notif.link}
                      onClick={() => handleMarkAsRead(notif.id)}
                      className="inline-flex items-center gap-2 text-sm font-bold text-brand-purple hover:underline"
                    >
                      View details <ExternalLink className="w-4 h-4" />
                    </Link>
                  )}
                </div>
              </motion.div>
            ))
          ) : (
            <div className="bg-white rounded-[3rem] p-20 text-center border border-brand-purple-light/10 border-dashed">
              <Bell className="w-16 h-16 text-brand-gray-dark/20 mx-auto mb-6" />
              <h3 className="text-xl font-bold text-brand-black mb-2">All caught up!</h3>
              <p className="text-brand-gray-dark">You don't have any notifications at the moment.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Notifications;
