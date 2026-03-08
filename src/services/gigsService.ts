import { supabase } from './supabaseClient';

export const gigsService = {
  async getAllGigs() {
    const { data, error } = await supabase
      .from('gigs')
      .select('*, profiles(full_name, profile_photo, subscription_plan)')
      .order('created_at', { ascending: false });
    return { data, error };
  },

  async getGigById(id: string) {
    const { data, error } = await supabase
      .from('gigs')
      .select('*, profiles(full_name, profile_photo, subscription_plan)')
      .eq('id', id)
      .single();
    return { data, error };
  },

  async createGig(gigData: any) {
    const { data, error } = await supabase
      .from('gigs')
      .insert([gigData])
      .select();
    return { data, error };
  },

  async getMyGigs(userId: string) {
    const { data, error } = await supabase
      .from('gigs')
      .select('*')
      .eq('creator_id', userId)
      .order('created_at', { ascending: false });
    return { data, error };
  }
};
