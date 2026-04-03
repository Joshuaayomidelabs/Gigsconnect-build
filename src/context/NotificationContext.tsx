import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Notification, notificationsService } from '../services/notificationsService';
import { useAuth } from './AuthContext';
import { toast } from 'sonner';

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const unreadCount = notifications.filter(n => !n.is_read).length;
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.id) {
      setNotifications([]);
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
      } catch (err: any) {
        console.error("Unexpected notification error:", err);
        setError(err.message || "An unexpected error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotifications();

    // Subscribe to real-time updates
    const subscription = notificationsService.subscribeToNotifications(user.id, (newNotif) => {
      setNotifications(prev => {
        // Avoid duplicates
        if (prev.some(n => n.id === newNotif.id)) return prev;
        return [newNotif, ...prev];
      });
      
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
      subscription.unsubscribe();
    };
  }, [user?.id]);

  const markAsRead = async (id: string) => {
    const { error } = await notificationsService.markAsRead(id);
    if (!error) {
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
    }
  };

  const markAllAsRead = async () => {
    if (!user?.id) return;
    const { error } = await notificationsService.markAllAsRead(user.id);
    if (!error) {
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    }
  };

  return (
    <NotificationContext.Provider value={{ 
      notifications, 
      unreadCount, 
      isLoading, 
      error, 
      markAsRead, 
      markAllAsRead,
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
