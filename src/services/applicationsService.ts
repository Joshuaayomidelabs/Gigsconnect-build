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

    // Get applicant profile for notification
    const { data: applicant } = await supabase
      .from("profiles")
      .select("full_name")
      .eq("id", applicant_id)
      .single();

    // 4. Send notification to gig owner
    if (gigOwnerId) {
      const { data: notifData, error: notifError } = await supabase
        .from("notifications")
        .insert([
          {
            user_id: gig.poster_id, // VERY IMPORTANT
            title: "New Gig Application",
            message: `${applicant?.full_name || 'Someone'} applied to your gig`,
            type: "gig_application",
            reference_id: application.id,
            link: `/applications/${application.id}`, // now VALID
            is_read: false,
          },
        ]);

      if (notifError) {
        console.error("Notification failed:", notifError);
      } else {
        console.log("Notification created:", notifData);
      }
    }

    return { data: application, error: null };
  },

  async updateApplicationStatus(applicationId: string, status: string) {
    const normalizedStatus = status.toLowerCase();
    const { data, error } = await supabase
      .from("applications")
      .update({ status: normalizedStatus })
      .eq("id", applicationId)
      .select(`
        id,
        gig_id,
        applicant_id,
        gigs(title)
      `)
      .single();

    if (error) {
      console.error("Error updating application status:", error);
      return { error };
    }

    // 🔥 NOTIFY APPLICANT
    const { error: notifError } = await supabase.from("notifications").insert([
      {
        user_id: data.applicant_id,
        title: "Application Update",
        message:
          normalizedStatus === "accepted"
            ? `🎉 Your application for "${(data.gigs as any).title}" was accepted!`
            : `Your application for "${(data.gigs as any).title}" was not accepted.`,
        type: "application_update",
        reference_id: data.id,
        link: `/applications/${data.id}`,
        is_read: false,
      },
    ]);

    if (notifError) {
      console.error("Error inserting notification:", notifError);
    }

    return { data };
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
      .select('*, gigs(title, budget, location, currency)')
      .eq('applicant_id', userId)
      .order('created_at', { ascending: false });
    return { data, error };
  },

  async getApplicationsForGig(gigId: string) {
    const { data, error } = await supabase
      .from('applications')
      .select('*, profiles(id, full_name, avatar_url, role)')
      .eq('gig_id', gigId)
      .order('created_at', { ascending: false });
    return { data, error };
  },

  async checkIfApplied(gigId: string, userId: string) {
    const { data, error } = await supabase
      .from('applications')
      .select('id')
      .eq('gig_id', gigId)
      .eq('applicant_id', userId)
      .maybeSingle();
    
    return { hasApplied: !!data, error };
  }
};
