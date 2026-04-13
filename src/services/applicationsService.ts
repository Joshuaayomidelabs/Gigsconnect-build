import { supabase } from './supabaseClient';
import { notificationsService } from './notificationsService';

export const applicationsService = {
  async applyToGig({
    gig_id,
    message,
    portfolio_link,
  }: {
    gig_id: string;
    message?: string;
    portfolio_link?: string;
  }) {
    // 1. Get logged-in user (applicant)
    const { data: userData } = await supabase.auth.getUser();

    const applicant_id = userData?.user?.id;

    if (!applicant_id) {
      return { data: null, error: new Error("User not authenticated") };
    }

    // 2. Get gig + owner (poster_id)
    const { data: gig, error: gigError } = await supabase
      .from("gigs")
      .select("poster_id, title")
      .eq("id", gig_id)
      .single();

    if (gigError || !gig) {
      return { data: null, error: new Error("Gig not found") };
    }

    const gigOwnerId = gig.poster_id;

    // 3. Insert application (IMPORTANT: correct schema)
    const { data: application, error: appError } = await supabase
      .from("applications")
      .insert([
        {
          gig_id,
          applicant_id,
          message,
          portfolio_link,
        },
      ])
      .select()
      .single();

    if (appError) {
      return { data: null, error: appError };
    }

    // 4. Send notification to gig owner
    if (gigOwnerId) {
      await notificationsService.createNotification({
        user_id: gigOwnerId, // recipient = owner
        type: "gig_application",
        title: "New Gig Application",
        message: `Someone applied to your gig: ${gig.title}`,
        link: `/posted-gigs?gigId=${application.gig_id}&appId=${application.id}`,
        reference_id: gig_id,
      });
    }

    return { data: application, error: null };
  },

  async updateApplicationStatus(applicationId: string, status: string) {
    const { data, error } = await supabase
      .from('gig_applications')
      .update({ status })
      .eq('id', applicationId)
      .select('*, gigs(title), applicant_id')
      .maybeSingle();

    if (!error && data) {
      // Notify applicant
      await notificationsService.createNotification({
        user_id: data.applicant_id,
        type: 'application_update',
        title: 'Application Update',
        message: `Your application for "${(data as any).gigs.title}" has been ${status}.`,
        link: '/applications',
        reference_id: data.gig_id,
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
      .select('*, profiles(id, full_name, avatar_url, role)')
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
