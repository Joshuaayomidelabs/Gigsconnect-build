import React, { useState, useEffect } from 'react';
import { Bell, Check, ExternalLink, MessageSquare, Briefcase, Info, Loader2, XCircle, CheckCircle, UserPlus, User } from 'lucide-react';
import { motion } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotificationContext } from '../context/NotificationContext';
import { notificationsService } from '../services/notificationsService';
import { applicationsService } from '../services/applicationsService';

const Notifications: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { 
    notifications, 
    setNotifications, 
    isLoading, 
    error, 
    markAsRead, 
    markAllAsRead 
  } = useNotificationContext();

  const [isProcessing, setIsProcessing] = useState<string | null>(null);
  
  // Auto-mark as read when opening the page
  useEffect(() => {
    if (notifications.some(n => !n.is_read)) {
      markAllAsRead();
    }
  }, [notifications, markAllAsRead]);

  const handleMarkAsRead = async (id: string) => {
    await markAsRead(id);
  };

  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
  };

  const handleStatusUpdate = async (notificationId: string, link: string | undefined, metadata: any, status: 'Accepted' | 'Rejected') => {
    const appId = metadata?.application_id || (link ? new URL(link, window.location.origin).searchParams.get('appId') : null);
    
    if (!appId) return;

    setIsProcessing(notificationId);
    try {
      const { error } = await applicationsService.updateApplicationStatus(appId, status);
      if (error) throw error;
      
      // Mark notification as read after action
      await handleMarkAsRead(notificationId);
      
      // Update local state to show it's processed
      setNotifications(prev => prev.map(n => n.id === notificationId ? { ...n, is_processed: true, processed_status: status } : n));
      
      alert(`Application ${status.toLowerCase()} successfully!`);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsProcessing(null);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'gig_new': return <Briefcase className="w-6 h-6 text-brand-purple" />;
      case 'gig_application': return <Briefcase className="w-6 h-6 text-brand-purple" />;
      case 'message_new': return <MessageSquare className="w-6 h-6 text-brand-purple" />;
      case 'application_update': return <Check className="w-6 h-6 text-brand-purple" />;
      case 'follow': return <UserPlus className="w-6 h-6 text-brand-purple" />;
      default: return <Info className="w-6 h-6 text-gray-500 dark:text-gray-400" />;
    }
  };

  return (
    <div className="pt-24 pb-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto min-h-screen bg-brand-gray dark:bg-brand-black">
      <header className="mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-brand-black dark:text-brand-white tracking-tight mb-2">Notifications</h1>
          <p className="text-gray-500 dark:text-gray-400 text-lg">Stay updated with your music career.</p>
        </div>
      </header>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-10 h-10 animate-spin text-brand-purple" />
        </div>
      ) : error ? (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/40 rounded-3xl p-12 text-center">
          <p className="text-red-600 dark:text-red-400 font-bold">{error}</p>
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
                className={`bg-brand-white dark:bg-brand-dark-card rounded-[2rem] p-6 shadow-sm border border-brand-gray dark:border-brand-black flex gap-6 items-start relative group transition-all hover:shadow-md ${!notif.is_read ? 'ring-2 ring-brand-purple/10' : ''}`}
              >
                <div className="flex-shrink-0">
                  {notif.actor ? (
                    <div 
                      className={`w-12 h-12 rounded-2xl overflow-hidden cursor-pointer ring-2 ${!notif.is_read ? 'ring-brand-purple' : 'ring-transparent'}`}
                      onClick={(e) => { 
                        e.stopPropagation(); 
                        navigate(`/profile/${notif.actor!.id}`); 
                      }}
                    >
                      {notif.actor.avatar_url ? (
                        <img src={notif.actor.avatar_url} alt={notif.actor.username} className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-full h-full p-2 bg-brand-gray text-gray-500" />
                      )}
                    </div>
                  ) : (
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${!notif.is_read ? 'bg-brand-purple/10' : 'bg-brand-gray dark:bg-brand-black'}`}>
                      {getIcon(notif.type)}
                    </div>
                  )}
                </div>

                <div className="flex-grow">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className={`text-lg font-black tracking-tight ${!notif.is_read ? 'text-brand-black dark:text-brand-white' : 'text-gray-500 dark:text-gray-400'}`}>
                        {notif.title}
                      </h3>
                      <span className="text-xs text-gray-500 dark:text-gray-500 font-medium">
                        {new Date(notif.created_at).toLocaleString()}
                      </span>
                    </div>
                    {!notif.is_read && (
                      <button 
                        onClick={() => handleMarkAsRead(notif.id)}
                        className="p-2 text-brand-purple hover:bg-brand-purple/10 rounded-full transition-all"
                        title="Mark as read"
                      >
                        <Check className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                  
                  <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                    {notif.actor && (
                      <span 
                        onClick={(e) => { 
                          e.stopPropagation(); 
                          navigate(`/profile/${notif.actor!.id}`); 
                        }}
                        className="font-bold text-gray-900 dark:text-white hover:underline cursor-pointer mr-1"
                      >
                        {notif.actor.username}
                      </span>
                    )}
                    {(() => {
                       if (notif.actor) {
                         if (notif.type === "like") return "liked your post";
                         if (notif.type === "follow") return "started following you";
                         if (notif.type === "comment") return "commented on your post";
                       }
                       return notif.message;
                    })()}
                  </p>

                  <div className="flex flex-wrap items-center gap-4">
                    {notif.link && (
                      <button 
                        onClick={() => {
                          handleMarkAsRead(notif.id);

                          switch (notif.type) {
                            case "gig_application":
                              navigate(`/applications/${notif.reference_id}`);
                              break;

                            case "application_update":
                              navigate(`/applications/${notif.reference_id}`);
                              break;

                            case "follow":
                              if (notif.link) navigate(notif.link);
                              break;

                            default:
                              if (notif.link?.startsWith('/')) {
                                navigate(notif.link);
                              } else {
                                console.warn("Unknown notification type:", notif.type);
                              }
                              break;
                          }
                        }}
                        className="inline-flex items-center gap-2 text-sm font-bold text-brand-purple hover:underline"
                      >
                        View details <ExternalLink className="w-4 h-4" />
                      </button>
                    )}

                    {notif.type === 'gig_application' && !notif.is_read && !(notif as any).is_processed && (
                      <div className="flex gap-2 ml-auto">
                        <button 
                          onClick={() => handleStatusUpdate(notif.id, notif.link, notif.metadata, 'Rejected')}
                          disabled={!!isProcessing}
                          className="flex items-center gap-1 px-4 py-2 rounded-xl bg-brand-gray dark:bg-brand-black text-brand-black dark:text-brand-white text-xs font-bold hover:bg-brand-purple/10 dark:hover:bg-brand-purple/20 transition-all border border-brand-gray dark:border-brand-black disabled:opacity-50"
                        >
                          {isProcessing === notif.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <XCircle className="w-3 h-3" />}
                          Reject
                        </button>
                        <button 
                          onClick={() => handleStatusUpdate(notif.id, notif.link, notif.metadata, 'Accepted')}
                          disabled={!!isProcessing}
                          className="flex items-center gap-1 px-4 py-2 rounded-xl bg-brand-purple text-white text-xs font-bold hover:bg-brand-purple-hover transition-all shadow-sm disabled:opacity-50"
                        >
                          {isProcessing === notif.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <CheckCircle className="w-3 h-3" />}
                          Accept
                        </button>
                      </div>
                    )}

                    {(notif as any).is_processed && (
                      <div className={`ml-auto px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 ${(notif as any).processed_status === 'Accepted' ? 'bg-brand-purple/10 text-brand-purple dark:bg-brand-purple/20' : 'bg-brand-gray text-gray-600 dark:bg-brand-black dark:text-gray-400'}`}>
                        <CheckCircle className="w-3 h-3" />
                        {(notif as any).processed_status}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="bg-brand-white dark:bg-brand-dark-card rounded-[3rem] p-20 text-center border border-brand-gray dark:border-brand-black border-dashed">
              <Bell className="w-16 h-16 text-gray-400/20 dark:text-gray-700 mx-auto mb-6" />
              <h3 className="text-xl font-bold text-brand-black dark:text-brand-white mb-2">All caught up!</h3>
              <p className="text-gray-500 dark:text-gray-400">You don't have any notifications at the moment.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Notifications;
