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
      .order('created_at', { ascending: false })
      .limit(100);
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

    try {
      // 1. Search gigs matching title or description
      const { data: gigs, error: gigsError } = await supabase
        .from('gigs')
        .select('*, poster_id(*)')
        .or(`title.ilike.%${normalized}%,description.ilike.%${normalized}%`);

      if (gigsError) console.error("Error searching gigs:", gigsError);

      // 2. Fetch blocklists if a logged in session is active to exclude blocked profiles & gigs
      let blockedIds: string[] = [];
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        const currentUserId = sessionData?.session?.user?.id;
        if (currentUserId) {
          const { data: blocks } = await supabase
            .from('blocked_users')
            .select('blocked_id, blocker_id')
            .or(`blocker_id.eq.${currentUserId},blocked_id.eq.${currentUserId}`);
          
          if (blocks) {
            blockedIds = blocks.map((b: any) => 
              b.blocker_id === currentUserId ? b.blocked_id : b.blocker_id
            );
          }
        }
      } catch (err) {
        console.error("Error fetching blocks during search:", err);
      }

      const filteredGigs = (gigs || []).filter((g: any) => {
        const pId = g.poster_id && typeof g.poster_id === 'object' ? g.poster_id.id : g.poster_id;
        if (pId && blockedIds.includes(pId)) {
          return false;
        }
        return true;
      });

      // 3. Fetch all profiles to perform precise case-insensitive matches across fields
      const { data: allProfiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, full_name, username, avatar_url, skills, city_town, country, verification_status, bio')
        .order('verification_status', { ascending: false })
        .limit(1000);

      if (profilesError) console.error("Error fetching profiles:", profilesError);

      // Filter profiles dynamically based on any typed letters
      const matchedUsers = (allProfiles || []).filter(u => {
        // Exclude blocked profiles
        if (blockedIds.includes(u.id)) {
          return false;
        }

        // 1. Filter out empty, incompleted or un-onboarded users
        if (!u.full_name || !u.full_name.trim() || !u.username || !u.username.trim()) {
          return false;
        }

        const fullNameLower = u.full_name.toLowerCase();
        const userNameLower = u.username.toLowerCase();

        // 2. Filter out platform/system official automation user
        if (fullNameLower.includes('gigsconnect') || userNameLower.includes('gigsconnect')) {
          return false;
        }

        // 3. Filter out test, demo, sample, placeholder, admin, or development seed accounts
        const isPlaceholder = [
          'test', 'demo', 'sample', 'placeholder', 'example', 'admin', 
          'new user', 'alex smith', 'john doe'
        ].some(keyword => fullNameLower.includes(keyword) || userNameLower.includes(keyword));
        
        if (isPlaceholder && !normalized.includes('test') && !normalized.includes('admin')) {
          return false;
        }

        // 4. Filter out anonymized deleted users
        if (
          fullNameLower.includes('deleted user') || 
          fullNameLower.includes('deleteduser') || 
          userNameLower.includes('deleted_user') || 
          userNameLower.includes('deleteduser')
        ) {
          return false;
        }

        // 5. Exclude profiles with completely empty skills database arrays AND no bio
        const hasSkills = Array.isArray(u.skills) && u.skills.length > 0;
        const hasBio = !!(u.bio && u.bio.trim());
        if (!hasSkills && !hasBio) {
          return false;
        }

        const nameMatch = u.full_name?.toLowerCase().includes(normalized);
        const usernameMatch = u.username?.toLowerCase().includes(normalized);
        const cityMatch = u.city_town?.toLowerCase().includes(normalized);
        const countryMatch = u.country?.toLowerCase().includes(normalized);
        
        const skillsMatch = Array.isArray(u.skills) && u.skills.some((skill: string) => 
          skill?.toLowerCase().includes(normalized)
        );

        return !!(nameMatch || usernameMatch || cityMatch || countryMatch || skillsMatch);
      });

      return {
        gigs: filteredGigs,
        users: matchedUsers,
      };
    } catch (err) {
      console.error("Search exception error:", err);
      return { gigs: [], users: [] };
    }
  }
};
