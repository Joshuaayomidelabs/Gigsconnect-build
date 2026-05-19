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
    // Optimistic update
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
    const { error } = await notificationsService.markAsRead(id);
    if (error) {
      // Revert optimism if error
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: false } : n));
      console.error("Failed to mark notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    if (!user?.id) return;
    
    // Find unread IDs before optimistic update
    const unreadIds = notifications.filter(n => !n.is_read).map(n => n.id);
    if (unreadIds.length === 0) return;

    // Optimistic update for instant UI response
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    
    const { error } = await notificationsService.markAllAsRead(user.id);
    if (error) {
      console.error("Failed to mark all as read (batch), falling back to individual updates:", error);
      // Fallback if bulk update is forbidden or fails
      for (const id of unreadIds) {
        await notificationsService.markAsRead(id);
      }
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
