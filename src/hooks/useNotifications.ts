import { useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient";
import { Notification, notificationsService } from "../services/notificationsService";
import { toast } from "sonner";

export const useNotifications = (userId: string | undefined) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setIsLoading(false);
      return;
    }

    const fetchNotifications = async () => {
      try {
        setIsLoading(true);
        const { data, error: fetchError } = await notificationsService.getNotifications(userId);

        if (fetchError) {
          setError(fetchError.message);
          return;
        }

        if (data) {
          setNotifications(data);
          setUnreadCount(data.filter(n => !n.is_read).length);
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
    const subscription = notificationsService.subscribeToNotifications(userId, (newNotif) => {
      setNotifications(prev => [newNotif, ...prev]);
      setUnreadCount(prev => prev + 1);
      
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
  }, [userId]);

  return { notifications, unreadCount, setNotifications, setUnreadCount, isLoading, error };
};
