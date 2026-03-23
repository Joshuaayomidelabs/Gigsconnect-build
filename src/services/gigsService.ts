import { supabase } from './supabaseClient';
import { notificationsService } from './notificationsService';

export const gigsService = {
  async getAllGigs() {
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
    
    const { data, error } = await supabase
      .from('gigs')
      .select('*, profiles(id, full_name, avatar_url)')
      .gte('created_at', threeDaysAgo.toISOString())
      .order('created_at', { ascending: false });
    return { data, error };
  },

  async getGigById(id: string) {
    const { data, error } = await supabase
      .from('gigs')
      .select('*, profiles(id, full_name, avatar_url)')
      .eq('id', id)
      .single();
    return { data, error };
  },

  async deleteGig(id: string, userId: string) {
    const { data, error } = await supabase
      .from('gigs')
      .delete()
      .eq('id', id)
      .eq('user_id', userId) // Security: Ensure only owner can delete
      .select();
    
    return { data, error };
  },

  async createGig(gigData: any) {
    const { data, error } = await supabase
      .from('gigs')
      .insert([gigData])
      .select()
      .single();

    if (error) {
      console.error("Gig creation error:", error);
    }

    if (!error && data) {
      // Notify creator
      await notificationsService.createNotification({
        recipient_id: data.creator_id || data.user_id,
        type: 'gig_new',
        title: 'Gig Posted Successfully',
        message: `Your gig "${data.title}" is now live!`,
        link: `/gig/${data.id}`
      });
    }

    return { data, error };
  },

  async getMyGigs(userId: string) {
    const { data, error } = await supabase
      .from('gigs')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    return { data, error };
  }
};
