import { supabase } from './supabaseClient';

export type NotificationType = 'gig_new' | 'application_received' | 'application_update' | 'message_new' | 'system' | 'gig_application';

export interface Notification {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  message: string;
  link?: string;
  is_read: boolean;
  created_at: string;
  reference_id?: string;
  metadata?: {
    applicant_name?: string;
    applicant_avatar?: string;
    gig_title?: string;
    role?: string;
    [key: string]: any;
  };
}

export const notificationsService = {
  async getNotifications(userId: string) {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    return { data: data as Notification[] | null, error };
  },

  async markAsRead(notificationId: string) {
    const { data, error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', notificationId);
    
    return { data, error };
  },

  async markAllAsRead(userId: string) {
    const { data, error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', userId);
    
    return { data, error };
  },

  async createNotification(notification: Omit<Notification, 'id' | 'created_at' | 'is_read'>) {
    if (!notification.user_id) {
      console.error("Notification blocked: missing user_id");
      return { data: null, error: new Error("Missing user_id") };
    }

    const { data, error } = await supabase
      .from('notifications')
      .insert([{ ...notification, is_read: false }])
      .select();
    
    return { data, error };
  },

  subscribeToNotifications(userId: string, onNewNotification: (notification: Notification) => void) {
    return supabase
      .channel(`notifications:${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          onNewNotification(payload.new as Notification);
        }
      )
      .subscribe();
  }
};
