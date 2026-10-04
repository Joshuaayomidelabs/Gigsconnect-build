import { supabase } from './supabaseClient';

export interface UserSettings {
  user_id: string;
  notify_messages: boolean;
  notify_applications: boolean;
  notify_social: boolean;
  notify_gigs: boolean;
  who_can_message: 'everyone' | 'following';
  updated_at?: string;
}

export const DEFAULT_USER_SETTINGS: Omit<UserSettings, 'user_id'> = {
  notify_messages: true,
  notify_applications: true,
  notify_social: true,
  notify_gigs: true,
  who_can_message: 'everyone'
};

export const settingsService = {
  /**
   * Selects user settings row; if none exists, returns default settings without inserting.
   */
  async getSettings(userId: string): Promise<{ data: UserSettings; error: any }> {
    try {
      const { data, error } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching user settings:', error);
        return {
          data: { user_id: userId, ...DEFAULT_USER_SETTINGS },
          error
        };
      }

      if (!data) {
        return {
          data: { user_id: userId, ...DEFAULT_USER_SETTINGS },
          error: null
        };
      }

      return {
        data: {
          user_id: userId,
          notify_messages: data.notify_messages ?? DEFAULT_USER_SETTINGS.notify_messages,
          notify_applications: data.notify_applications ?? DEFAULT_USER_SETTINGS.notify_applications,
          notify_social: data.notify_social ?? DEFAULT_USER_SETTINGS.notify_social,
          notify_gigs: data.notify_gigs ?? DEFAULT_USER_SETTINGS.notify_gigs,
          who_can_message: data.who_can_message ?? DEFAULT_USER_SETTINGS.who_can_message,
          updated_at: data.updated_at
        },
        error: null
      };
    } catch (err: any) {
      console.error('Unexpected error fetching user settings:', err);
      return {
        data: { user_id: userId, ...DEFAULT_USER_SETTINGS },
        error: err
      };
    }
  },

  /**
   * Upserts on user_id with updated_at = now().
   */
  async updateSettings(
    userId: string,
    partial: Partial<Omit<UserSettings, 'user_id'>>
  ): Promise<{ data: UserSettings | null; error: any }> {
    try {
      const payload = {
        user_id: userId,
        ...partial,
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('user_settings')
        .upsert(payload, { onConflict: 'user_id' })
        .select()
        .single();

      if (error) {
        console.error('Error updating user settings:', error);
        return { data: null, error };
      }

      return { data, error: null };
    } catch (err: any) {
      console.error('Unexpected error updating user settings:', err);
      return { data: null, error: err };
    }
  }
};

export default settingsService;
