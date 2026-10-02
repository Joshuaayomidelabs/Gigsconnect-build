import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Notification, notificationsService } from '../services/notificationsService';
import { getUnreadMessagesCount } from '../services/messagesService';
import { useAuth } from './AuthContext';
import { supabase } from '../services/supabaseClient';
import { toast } from 'sonner';
import { getFriendlyErrorMessage } from '../utils/errorHandler';

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  unreadMessagesCount: number;
  isLoading: boolean;
  error: string | null;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  refreshUnreadMessagesCount: () => Promise<void>;
  setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshNotificationCount = async () => {
    if (!user?.id) return;
    const { count, error } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('is_read', false);

    if (error) {
      console.error(error);
      return;
    }
    setUnreadCount(count || 0);
  };

  const refreshUnreadMessagesCount = async () => {
    if (!user?.id) {
      setUnreadMessagesCount(0);
      return;
    }
    try {
      const total = await getUnreadMessagesCount(user.id);
      setUnreadMessagesCount(total);
    } catch (err) {
      console.error('Failed to fetch unread messages count:', err);
    }
  };

  useEffect(() => {
    if (!user?.id) {
      setNotifications([]);
      setUnreadCount(0);
      setIsLoading(false);
      return;
    }

    const fetchNotifications = async () => {
      try {
        setIsLoading(true);
        const { data, error: fetchError } = await notificationsService.getNotifications(user.id);

        if (fetchError) {
          setError(fetchError.message);
          return;
        }

        if (data) {
          setNotifications(data);
        }
        await refreshNotificationCount();
        await refreshUnreadMessagesCount();
      } catch (err: any) {
        console.error("Unexpected notification error:", err);
        setError(getFriendlyErrorMessage(err));
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotifications();

    const handleMessagesUpdated = () => {
      refreshUnreadMessagesCount();
    };

    window.addEventListener('messages-updated', handleMessagesUpdated);
    window.addEventListener('messages-read', handleMessagesUpdated);

    // Subscribe to real-time updates for notifications
    const subscription = notificationsService.subscribeToNotifications(user.id, (newNotif) => {
      setNotifications(prev => {
        // Avoid duplicates
        if (prev.some(n => n.id === newNotif.id)) return prev;
        return [newNotif, ...prev];
      });
      refreshNotificationCount();
      
      // Show toast notification
      toast.info(newNotif.title, {
        description: newNotif.message,
        action: newNotif.link ? {
          label: 'View',
          onClick: () => window.location.href = newNotif.link!
        } : undefined
      });
    });

    return () => {
      window.removeEventListener('messages-updated', handleMessagesUpdated);
      window.removeEventListener('messages-read', handleMessagesUpdated);
      subscription.unsubscribe();
    };
  }, [user?.id]);

  const markAsRead = async (id: string) => {
    const { error } = await notificationsService.markAsRead(id);
    if (error) {
      console.error("Failed to mark notification as read:", error);
    } else {
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
      await refreshNotificationCount();
    }
  };

  const markAllAsRead = async () => {
    if (!user?.id) return;

    // Update DB first
    const { error } = await notificationsService.markAllAsRead();
    if (!error) {
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
      // THEN refresh count from DB
      await refreshNotificationCount();
    } else {
      console.error("Failed to mark all as read:", error);
    }
  };

  return (
    <NotificationContext.Provider value={{ 
      notifications, 
      unreadCount, 
      unreadMessagesCount,
      isLoading, 
      error, 
      markAsRead, 
      markAllAsRead,
      refreshUnreadMessagesCount,
      setNotifications
    }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotificationContext = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotificationContext must be used within a NotificationProvider');
  }
  return context;
};
