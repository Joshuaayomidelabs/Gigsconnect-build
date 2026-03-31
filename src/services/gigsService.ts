import { supabase } from './supabaseClient';
import { notificationsService } from './notificationsService';

export const gigsService = {
  async getAllGigs() {
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
    
    const { data, error } = await supabase
      .from('gigs')
      .select('*, poster_id(*)')
      .gte('created_at', threeDaysAgo.toISOString())
      .order('created_at', { ascending: false });
    return { data, error };
  },

  async getGigById(id: string) {
    const { data, error } = await supabase
      .from('gigs')
      .select('*, poster_id(*)')
      .eq('id', id)
      .single();
    return { data, error };
  },

  async deleteGig(id: string, userId: string) {
    const { data, error } = await supabase
      .from('gigs')
      .delete()
      .eq('id', id)
      .eq('poster_id', userId) // Security: Ensure only owner can delete
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
        recipient_id: data.poster_id,
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
      .select('*, poster_id(*)')
      .eq('poster_id', userId)
      .order('created_at', { ascending: false });
    return { data, error };
  },

  async searchGigsAndUsers(searchTerm: string) {
    if (!searchTerm || !searchTerm.trim()) return { gigs: [], users: [] };

    const normalized = searchTerm.toLowerCase().trim();

    // 1. Search gigs
    const { data: gigs, error: gigsError } = await supabase
      .from('gigs')
      .select('*, poster_id(*)')
      .or(`title.ilike.%${normalized}%,description.ilike.%${normalized}%`);

    if (gigsError) console.error("Error searching gigs:", gigsError);

    // 2. Search users by skills
    const { data: users, error: usersError } = await supabase
      .from('profiles')
      .select('id, full_name, avatar_url, skills, city, country, verification_status, is_verified')
      .overlaps('skills', [normalized]);

    if (usersError) console.error("Error searching users:", usersError);

    return {
      gigs: gigs || [],
      users: users || [],
    };
  }
};
