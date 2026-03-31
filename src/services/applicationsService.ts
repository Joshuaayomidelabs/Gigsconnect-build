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
      .select('*, gigs(title), applicant:profiles!applicant_id(user_id, full_name, avatar_url, role)')
      .single();

    if (!error && data) {
      // Notify gig creator
      await notificationsService.createNotification({
        recipient_id: applicationData.gig_owner_id,
        type: 'application_received',
        title: 'New Application',
        message: `${(data as any).applicant?.full_name || 'Someone'} applied to your gig: ${(data as any).gigs.title}`,
        link: `/posted-gigs?gigId=${data.gig_id}&appId=${data.id}`,
        metadata: {
          application_id: data.id,
          applicant_name: (data as any).applicant?.full_name,
          applicant_avatar: (data as any).applicant?.avatar_url,
          gig_title: (data as any).gigs.title,
          role: (data as any).applicant?.role
        }
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
        message: `Your application for "${(data as any).gigs.title}" has been ${status}.`,
        link: '/applications',
        metadata: {
          gig_title: (data as any).gigs.title,
          status: status
        }
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
      .select('*, gigs(title, budget, location, currency)')
      .eq('applicant_id', userId)
      .order('created_at', { ascending: false });
    return { data, error };
  },

  async getApplicationsForGig(gigId: string) {
    const { data, error } = await supabase
      .from('gig_applications')
      .select('*, profiles(user_id, full_name, avatar_url, role)')
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
