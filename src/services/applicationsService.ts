import { supabase } from './supabaseClient';
import { notificationsService } from './notificationsService';

export const applicationsService = {
  async applyToGig(applicationData: any) {
    const { data, error } = await supabase
      .from('applications')
      .insert([applicationData])
      .select('*, gigs(title, creator_id)')
      .single();

    if (!error && data) {
      // Notify gig creator
      await notificationsService.createNotification({
        user_id: data.gigs.creator_id,
        type: 'application_update',
        title: 'New Application',
        content: `Someone applied to your gig: ${data.gigs.title}`,
        link: `/my-gigs`
      });
    }

    return { data, error };
  },

  async updateApplicationStatus(applicationId: string, status: string) {
    const { data, error } = await supabase
      .from('applications')
      .update({ status })
      .eq('id', applicationId)
      .select('*, gigs(title), applicant_id')
      .single();

    if (!error && data) {
      // Notify applicant
      await notificationsService.createNotification({
        user_id: data.applicant_id,
        type: 'application_update',
        title: 'Application Update',
        content: `Your application for "${data.gigs.title}" has been ${status}.`,
        link: '/applications'
      });
    }

    return { data, error };
  },

  async getApplicationsCountThisMonth(userId: string) {
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    
    const { count, error } = await supabase
      .from('applications')
      .select('*', { count: 'exact', head: true })
      .eq('applicant_id', userId)
      .gte('created_at', firstDayOfMonth);
      
    return { count: count || 0, error };
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
      .select('*, profiles(full_name, avatar_url, role)')
      .eq('gig_id', gigId)
      .order('created_at', { ascending: false });
    return { data, error };
  }
};
