import { supabase } from './supabaseClient';

export const applicationsService = {
  async applyToGig(applicationData: any) {
    const { data, error } = await supabase
      .from('applications')
      .insert([applicationData])
      .select();
    return { data, error };
  },

  async getMyApplications(userId: string) {
    const { data, error } = await supabase
      .from('applications')
      .select('*, gigs(title, budget, location)')
      .eq('applicant_id', userId)
      .order('created_at', { ascending: false });
    return { data, error };
  },

  async getApplicationsForGig(gigId: string) {
    const { data, error } = await supabase
      .from('applications')
      .select('*, profiles(full_name, profile_photo, role)')
      .eq('gig_id', gigId)
      .order('created_at', { ascending: false });
    return { data, error };
  }
};
