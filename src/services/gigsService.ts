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
      .maybeSingle();
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
      .maybeSingle();

    if (error) {
      console.error("Gig creation error:", error);
    }

    if (!error && data) {
      // Notify creator
      await notificationsService.createNotification({
        user_id: data.poster_id,
        type: 'gig_new',
        title: 'Gig Posted Successfully',
        message: `Your gig "${data.title}" is now live!`,
        link: `/gig/${data.id}`,
        reference_id: data.id
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

    // 2. Search users by full_name, username
    const { data: nameUsers, error: nameError } = await supabase
      .from('profiles')
      .select('id, full_name, username, avatar_url, skills, city, country, verification_status')
      .or(`full_name.ilike.%${normalized}%,username.ilike.%${normalized}%`)
      .order('verification_status', { ascending: false });

    if (nameError) console.error("Error searching users by name:", nameError);

    // 3. Search users by skills
    const { data: skillUsers, error: skillError } = await supabase
      .from('profiles')
      .select('id, full_name, username, avatar_url, skills, city, country, verification_status')
      .overlaps('skills', [normalized])
      .order('verification_status', { ascending: false });

    if (skillError) console.error("Error searching users by skills:", skillError);

    // Merge and deduplicate users
    const allUsersMap = new Map();
    if (nameUsers) nameUsers.forEach(u => allUsersMap.set(u.id, u));
    if (skillUsers) skillUsers.forEach(u => {
      if (!allUsersMap.has(u.id)) allUsersMap.set(u.id, u);
    });
    
    // Convert to array and prioritize verified users
    const combinedUsers = Array.from(allUsersMap.values()).sort((a, b) => {
      if (a.verification_status === 'verified' && b.verification_status !== 'verified') return -1;
      if (a.verification_status !== 'verified' && b.verification_status === 'verified') return 1;
      return 0;
    });

    return {
      gigs: gigs || [],
      users: combinedUsers,
    };
  }
};
