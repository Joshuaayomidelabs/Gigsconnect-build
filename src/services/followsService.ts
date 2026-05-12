import { supabase } from './supabaseClient';

export const followsService = {
  async getFollowStats(userId: string) {
    try {
      const [{ count: followersCount }, { count: followingCount }] = await Promise.all([
        supabase.from('follows').select('*', { count: 'exact', head: true }).eq('following_id', userId),
        supabase.from('follows').select('*', { count: 'exact', head: true }).eq('follower_id', userId)
      ]);
      return { followers: followersCount || 0, following: followingCount || 0 };
    } catch (err) {
      console.error('Error fetching follow stats:', err);
      return { followers: 0, following: 0 };
    }
  },

  async checkIfFollowing(followerId: string, followingId: string) {
    try {
      const { data, error } = await supabase
        .from('follows')
        .select('id')
        .eq('follower_id', followerId)
        .eq('following_id', followingId)
        .maybeSingle();
      
      return { isFollowing: !!data, error: null };
    } catch (err: any) {
      console.error('Error checking follow status:', err);
      return { isFollowing: false, error: err };
    }
  },

  async toggleFollow(followerId: string, followingId: string, isCurrentlyFollowing: boolean) {
    try {
      if (isCurrentlyFollowing) {
        const { error } = await supabase
          .from('follows')
          .delete()
          .eq('follower_id', followerId)
          .eq('following_id', followingId);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('follows')
          .insert({ follower_id: followerId, following_id: followingId });
        if (error) throw error;
      }
      return { error: null };
    } catch (err: any) {
      console.error('Error toggling follow:', err);
      return { error: err };
    }
  }
};
