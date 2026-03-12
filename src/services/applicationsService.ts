import { supabase } from './supabaseClient';
import { notificationsService } from './notificationsService';

export const applicationsService = {
  async applyToGig(applicationData: {
    gig_id: string;
    applicant_id: string;
    gig_owner_id: string;
    message?: string;
    portfolio_link?: string;
  }) {
    const { data, error } = await supabase
      .from('gig_applications')
      .insert([applicationData])
      .select('*, gigs(title)')
      .single();

    if (!error && data) {
      // Notify gig creator
      await notificationsService.createNotification({
        recipient_id: applicationData.gig_owner_id,
        type: 'application_update',
        title: 'New Application',
        message: `Someone applied to your gig: ${data.gigs.title}`,
        link: `/posted-gigs`
      });
    }

    return { data, error };
  },

  async updateApplicationStatus(applicationId: string, status: string) {
    const { data, error } = await supabase
      .from('gig_applications')
      .update({ status })
      .eq('id', applicationId)
      .select('*, gigs(title), applicant_id')
      .single();

    if (!error && data) {
      // Notify applicant
      await notificationsService.createNotification({
        recipient_id: data.applicant_id,
        type: 'application_update',
        title: 'Application Update',
        message: `Your application for "${data.gigs.title}" has been ${status}.`,
        link: '/applications'
      });
    }

    return { data, error };
  },

  async getApplicationsCountThisMonth(userId: string) {
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    
    const { count, error } = await supabase
      .from('gig_applications')
      .select('*', { count: 'exact', head: true })
      .eq('applicant_id', userId)
      .gte('created_at', firstDayOfMonth);
      
    return { count: count || 0, error };
  },

  async getMyApplications(userId: string) {
    const { data, error } = await supabase
      .from('gig_applications')
      .select('*, gigs(title, budget, location)')
      .eq('applicant_id', userId)
      .order('created_at', { ascending: false });
    return { data, error };
  },

  async getApplicationsForGig(gigId: string) {
    const { data, error } = await supabase
      .from('gig_applications')
      .select('*, profiles(full_name, avatar_url, role)')
      .eq('gig_id', gigId)
      .order('created_at', { ascending: false });
    return { data, error };
  },

  async checkIfApplied(gigId: string, userId: string) {
    const { data, error } = await supabase
      .from('gig_applications')
      .select('id')
      .eq('gig_id', gigId)
      .eq('applicant_id', userId)
      .maybeSingle();
    
    return { hasApplied: !!data, error };
  }
};
