import { supabase } from './supabaseClient';

export interface ReportPayload {
  reporter_id: string;
  content_type: 'post' | 'profile' | 'comment' | 'gig';
  content_id: string;
  reason: string;
  details?: string;
}

export const moderationService = {
  /**
   * Submits a report for a post, profile, comment, or gig.
   */
  async reportContent(payload: ReportPayload) {
    try {
      const { data, error } = await supabase
        .from('content_reports')
        .insert([payload])
        .select()
        .single();

      if (error) {
        // Code 23505 is PostgreSQL unique constraint violation
        if (error.code === '23505') {
          return { data: null, error: null, alreadyReported: true };
        }
        return { data: null, error, alreadyReported: false };
      }
      return { data, error: null, alreadyReported: false };
    } catch (err: any) {
      console.error('Unexpected error in reportContent:', err);
      return { data: null, error: err, alreadyReported: false };
    }
  },

  /**
   * Blocks a specific user.
   */
  async blockUser(blockerId: string, blockedId: string) {
    if (blockerId === blockedId) {
      return { data: null, error: new Error('You cannot block yourself.'), alreadyBlocked: false };
    }
    try {
      const { data, error } = await supabase
        .from('blocked_users')
        .insert([{ blocker_id: blockerId, blocked_id: blockedId }])
        .select()
        .single();

      if (error) {
        if (error.code === '23505') {
          return { data: null, error: null, alreadyBlocked: true };
        }
        return { data: null, error, alreadyBlocked: false };
      }

      // Dispatch event so layout feeds refresh of the blocked posts/content
      window.dispatchEvent(new CustomEvent('user-blocked-changed', { detail: { blockerId, blockedId } }));

      return { data, error: null, alreadyBlocked: false };
    } catch (err: any) {
      console.error('Unexpected error in blockUser:', err);
      return { data: null, error: err, alreadyBlocked: false };
    }
  },

  /**
   * Unblocks a specific user.
   */
  async unblockUser(blockerId: string, blockedId: string) {
    try {
      const { error } = await supabase
        .from('blocked_users')
        .delete()
        .eq('blocker_id', blockerId)
        .eq('blocked_id', blockedId);

      if (error) return { error };

      // Dispatch event to update layout feeds
      window.dispatchEvent(new CustomEvent('user-blocked-changed', { detail: { blockerId, blockedId } }));

      return { error: null };
    } catch (err: any) {
      console.error('Unexpected error in unblockUser:', err);
      return { error: err };
    }
  },

  /**
   * Fetches the user IDs blocked by the current user.
   */
  async getBlockedUsers(blockerId: string) {
    try {
      const { data, error } = await supabase
        .from('blocked_users')
        .select('blocked_id')
        .eq('blocker_id', blockerId);

      if (error) return { data: null, error };
      return { data: data.map((b: any) => b.blocked_id), error: null };
    } catch (err: any) {
      console.error('Unexpected error in getBlockedUsers:', err);
      return { data: null, error: err };
    }
  },

  /**
   * Fetches user IDs that have blocked the current user.
   */
  async getUsersWhoBlockedMe(userId: string) {
    try {
      const { data, error } = await supabase
        .from('blocked_users')
        .select('blocker_id')
        .eq('blocked_id', userId);

      if (error) return { data: null, error };
      return { data: data.map((b: any) => b.blocker_id), error: null };
    } catch (err: any) {
      console.error('Unexpected error in getUsersWhoBlockedMe:', err);
      return { data: null, error: err };
    }
  }
};
