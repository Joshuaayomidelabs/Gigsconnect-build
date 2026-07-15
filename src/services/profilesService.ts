import { supabase } from './supabaseClient';

export const profilesService = {
  async isUsernameTaken(username: string, currentUserId?: string) {
    if (!username || !username.trim()) return false;
    try {
      let query = supabase
        .from('profiles')
        .select('id')
        .ilike('username', username.trim());
        
      if (currentUserId) {
        query = query.neq('id', currentUserId);
      }
      
      const { data, error } = await query.maybeSingle();
      if (error && error.code !== 'PGRST116') {
        console.error('Error checking username:', error);
      }
      return !!data;
    } catch (err) {
      console.error('Unexpected error checking username:', err);
      return false;
    }
  },

  async getProfile(identifier: string) {
    console.log('Fetching profile for identifier:', identifier);
    
    if (identifier.startsWith('@')) {
      const username = identifier.substring(1);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .ilike('username', username)
        .maybeSingle();
        
      if (error) console.error(error);
      if (data) {
        data.city = data.city_town;
        if (data.onboarding_completed === undefined) {
          const storedCompleted = localStorage.getItem(`onboarding_completed_${data.id}`);
          data.onboarding_completed = storedCompleted === 'true';
        }
        if (data.onboarding_progress === undefined) {
          const storedProgress = localStorage.getItem(`onboarding_progress_${data.id}`);
          data.onboarding_progress = storedProgress ? parseInt(storedProgress, 10) : 0;
        }
      }
      return { data, error };
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', identifier)   // MUST match auth.users.id
      .maybeSingle();
    
    if (error) console.error(error);
    console.log(data);

    if (data) {
      // Map backend 'city_town' to frontend 'city'
      data.city = data.city_town;
      if (data.onboarding_completed === undefined) {
        const storedCompleted = localStorage.getItem(`onboarding_completed_${data.id}`);
        data.onboarding_completed = storedCompleted === 'true';
      }
      if (data.onboarding_progress === undefined) {
        const storedProgress = localStorage.getItem(`onboarding_progress_${data.id}`);
        data.onboarding_progress = storedProgress ? parseInt(storedProgress, 10) : 0;
      }
    } else {
      console.warn('No profile found for userId:', identifier);
    }
    
    return { data, error };
  },

  async updateProfile(profileData: any) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Explicitly define allowed columns to prevent errors from extra fields
      const allowedColumns = [
        'full_name', 'phone', 'country', 
        'genres', 'bio', 'avatar_url', 'username', 
        'role', 'skills', 'facebook_url', 'instagram_url', 'tiktok_url', 
        'twitter_url', 'linkedin_url',
        'portfolio_media', 'verification_status', 'verification_doc_path',
        'onboarding_completed', 'onboarding_progress'
      ];

      const sanitizedData: any = {};
      
      // Only include fields that are in allowedColumns and present in profileData
      allowedColumns.forEach(col => {
        if (profileData[col] !== undefined) {
          sanitizedData[col] = profileData[col];
        }
      });

      // Handle special mapping for city
      if (profileData.city !== undefined) {
        sanitizedData.city_town = profileData.city;
      } else if (profileData.city_town !== undefined) {
        sanitizedData.city_town = profileData.city_town;
      }

      // Format skills if present
      if (sanitizedData.skills && Array.isArray(sanitizedData.skills)) {
        sanitizedData.skills = (sanitizedData.skills as string[])
          .map((s: string) => s.toLowerCase().trim())
          .filter((s: string) => s !== '');
      }

      sanitizedData.updated_at = new Date().toISOString();

      console.log('Updating profile with data:', sanitizedData);

      let { data, error } = await supabase
        .from('profiles')
        .update(sanitizedData)
        .eq('id', user.id)   // MUST match auth.users.id
        .select();

      if (error) {
        const isMissingOnboarding = 
          error.message?.includes('onboarding_completed') || 
          error.message?.includes('onboarding_progress') ||
          error.code === 'PGRST104' || 
          error.code === '42703';

        if (isMissingOnboarding) {
          console.warn('Onboarding columns lacking in DB Table; saving in localStorage as fallback.');
          try {
            if (profileData.onboarding_completed !== undefined) {
              localStorage.setItem(`onboarding_completed_${user.id}`, String(!!profileData.onboarding_completed));
            }
            if (profileData.onboarding_progress !== undefined) {
              localStorage.setItem(`onboarding_progress_${user.id}`, String(profileData.onboarding_progress));
            }
          } catch (storageErr) {
            console.error('Fallback storage write fail:', storageErr);
          }

          delete sanitizedData.onboarding_completed;
          delete sanitizedData.onboarding_progress;

          const retryResult = await supabase
            .from('profiles')
            .update(sanitizedData)
            .eq('id', user.id)
            .select();
          
          data = retryResult.data;
          error = retryResult.error;
        }
      }

      if (error) {
        console.error('Supabase error updating profile:', error);
        throw error;
      }

      return { data, error: null };
    } catch (err: any) {
      console.error('Unexpected error in updateProfile:', err);
      return { data: null, error: err };
    }
  },

  async uploadPortfolioMedia(userId: string, file: File, type: 'image' | 'video') {
    const maxSize = type === 'image' ? 5 * 1024 * 1024 : 50 * 1024 * 1024; // 5MB for images, 50MB for videos
    if (file.size > maxSize) {
      throw new Error(`File size must be less than ${maxSize / (1024 * 1024)}MB.`);
    }

    const fileExt = file.name.split('.').pop();
    const uniqueFileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `portfolio/${userId}/${uniqueFileName}`;

    try {
      const { error: uploadError } = await supabase.storage
        .from('portfolio')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
          contentType: file.type
        });

      if (uploadError) {
        console.error('Portfolio upload error:', uploadError);
        if (uploadError.message.includes('bucket not found')) {
          throw new Error('Storage bucket "portfolio" not found. Please ensure it is created in Supabase storage.');
        }
        throw uploadError;
      }

      const { data } = supabase.storage.from('portfolio').getPublicUrl(filePath);
      
      if (!data || !data.publicUrl) {
        throw new Error('Failed to generate public URL for portfolio item');
      }

      return data.publicUrl;
    } catch (err: any) {
      console.error('Unexpected error in uploadPortfolioMedia:', err);
      throw err;
    }
  },

  async deletePortfolioMedia(filePath: string) {
    // filePath should be the path within the bucket, e.g., "user_id/filename.ext"
    const { error } = await supabase.storage
      .from('portfolio')
      .remove([filePath]);
    
    if (error) throw error;
  },

  async uploadAvatar(userId: string, file: File) {
    // 9. Restrict uploads to jpg, jpeg, and png only, with a maximum file size of 1MB.
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      throw new Error('Only JPG, JPEG, and PNG files are allowed.');
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      throw new Error('Image must be under 5MB');
    }

    // Use extension to ensure better compatibility with browsers and storage providers
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}-${Date.now()}.${fileExt}`;
    const filePath = `${userId}/${fileName}`; 

    // 4. The upload should replace the previous image if the user uploads a new one (use upsert).
    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file, {
        contentType: file.type
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      throw uploadError;
    }

    // 5. After upload, generate the public URL of the image.
    const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
    if (!data || !data.publicUrl) {
      throw new Error('Failed to generate public URL for avatar');
    }
    
    const publicUrl = data.publicUrl;
    
    // 6. Save this public URL to the avatar_url column in the profiles table.
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ avatar_url: publicUrl })
      .eq('id', userId);   // MUST match auth.users.id

    if (updateError) {
      console.error('Update profile error:', updateError);
      throw updateError;
    }

    return publicUrl;
  },

  async uploadVerificationDoc(userId: string, file: File) {
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      throw new Error('File size must be less than 10MB.');
    }

    const filePath = `${userId}/${file.name}`;

    const { error: uploadError } = await supabase.storage
      .from('verification-docs')
      .upload(filePath, file, {
        contentType: file.type
      });

    if (uploadError) {
      console.error('Verification doc upload error:', uploadError);
      if (uploadError.message.includes('bucket not found')) {
        throw new Error('Storage bucket "verification-docs" not found. Please ensure it is created in Supabase storage (private bucket recommended).');
      }
      throw uploadError;
    }

    // We don't necessarily want public URLs for ID documents for security reasons.
    // But for this implementation, we'll store the path.
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ 
        verification_status: 'pending',
        verification_requested_at: new Date().toISOString(),
        verification_doc_path: filePath
      })
      .eq('id', userId);   // MUST match auth.users.id

    if (updateError) throw updateError;

    return filePath;
  },

  async searchUsersBySkills(searchTerm: string, currentUserId?: string) {
    try {
      if (!searchTerm || !searchTerm.trim()) return { data: [], error: null };

      let query = supabase
        .from('profiles')
        .select('id, full_name, username, avatar_url, skills, city_town, country, verification_status, bio')
        .overlaps('skills', [searchTerm.toLowerCase().trim()]);

      if (currentUserId) {
        query = query.neq('id', currentUserId);
      }

      const { data, error } = await query;
      
      // Filter out empty/un-onboarded profiles, deactivated/deleted accounts, system accounts, and placeholders
      const filteredData = (data || []).filter(u => {
        if (!u.full_name || !u.full_name.trim() || !u.username || !u.username.trim()) {
          return false;
        }

        const fullNameLower = u.full_name.toLowerCase();
        const userNameLower = u.username.toLowerCase();

        // 1. Exclude platform/system official automation accounts
        if (fullNameLower.includes('gigsconnect') || userNameLower.includes('gigsconnect')) {
          return false;
        }

        // 2. Exclude test, demo, sample, placeholder, admin, or developer seed profiles
        const isPlaceholder = [
          'test', 'demo', 'sample', 'placeholder', 'example', 'admin', 
          'new user', 'alex smith', 'john doe'
        ].some(keyword => fullNameLower.includes(keyword) || userNameLower.includes(keyword));
        
        if (isPlaceholder) {
          return false;
        }

        // 3. Exclude deleted / anonymized accounts
        if (
          fullNameLower.includes('deleted user') || 
          fullNameLower.includes('deleteduser') || 
          userNameLower.includes('deleted_user') || 
          userNameLower.includes('deleteduser')
        ) {
          return false;
        }

        // 4. Exclude empty shell profiles with zero skills and zero biography
        const hasSkills = Array.isArray(u.skills) && u.skills.length > 0;
        const hasBio = !!(u.bio && u.bio.trim());
        if (!hasSkills && !hasBio) {
          return false;
        }

        return true;
      });

      // Map city_town to city for frontend consistency
      const mappedData = filteredData.map(user => ({
        ...user,
        city: user.city_town
      }));

      // Limit results after filtering
      const finalData = mappedData.slice(0, 10);

      return { data: finalData, error };
    } catch (err: any) {
      console.error("Unexpected error searching users:", err);
      return { data: [], error: err };
    }
  },

  async deleteAccount(userId: string) {
    try {
      console.log('Initiating total account deletion & data scrubbing for user:', userId);

      // 1. Delete professions
      try {
        await supabase.from('user_professions').delete().eq('user_id', userId);
      } catch (e) {
        console.warn('Non-blocking user_professions cleanup warning:', e);
      }

      // 2. Delete bookmarks
      try {
        await supabase.from('bookmarks').delete().eq('user_id', userId);
      } catch (e) {
        console.warn('Non-blocking bookmarks cleanup warning:', e);
      }

      // 3. Delete comments & comment likes
      try {
        await supabase.from('comments').delete().eq('user_id', userId);
      } catch (e) {
        console.warn('Non-blocking comments cleanup warning:', e);
      }
      try {
        await supabase.from('post_comments').delete().eq('user_id', userId);
      } catch (e) {
        console.warn('Non-blocking post_comments cleanup warning:', e);
      }
      try {
        await supabase.from('comment_likes').delete().eq('user_id', userId);
      } catch (e) {
        console.warn('Non-blocking comment_likes cleanup warning:', e);
      }

      // 4. Delete likes
      try {
        await supabase.from('likes').delete().eq('user_id', userId);
      } catch (e) {
        console.warn('Non-blocking likes cleanup warning:', e);
      }
      try {
        await supabase.from('post_likes').delete().eq('user_id', userId);
      } catch (e) {
        console.warn('Non-blocking post_likes cleanup warning:', e);
      }

      // 5. Delete gigs posted by user
      try {
        await supabase.from('gigs').delete().eq('poster_id', userId);
      } catch (e) {
        console.warn('Non-blocking gigs cleanup warning:', e);
      }

      // 6. Delete posts
      try {
        await supabase.from('posts').delete().eq('user_id', userId);
      } catch (e) {
        console.warn('Non-blocking posts cleanup warning:', e);
      }

      // 7. Delete follows where user is either follower or following
      try {
        await supabase.from('follows').delete().eq('follower_id', userId);
        await supabase.from('follows').delete().eq('following_id', userId);
      } catch (e) {
        console.warn('Non-blocking follows cleanup warning:', e);
      }

      // 8. Try deleting profile directly first (if a delete policy is configured)
      const { error: profileDeleteError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);

      if (profileDeleteError) {
        console.log('Could not hard-delete profile row, performing complete anonymization scrubbing:', profileDeleteError);
        
        // 9. Scrub/anonymize profile row to erase all GDPR/App Store PII
        const anonymizedData = {
          full_name: 'Deleted User',
          username: `deleted_user_${Math.random().toString(36).substring(2, 10)}`,
          email: '',
          phone: '',
          country: '',
          city_town: '',
          genres: '',
          bio: 'This account has been deleted.',
          avatar_url: null,
          portfolio_media: [],
          verification_status: 'Unverified',
          verification_doc_path: null,
          facebook_url: null,
          instagram_url: null,
          tiktok_url: null,
          twitter_url: null,
          linkedin_url: null,
          updated_at: new Date().toISOString()
        };

        const { error: scrubError } = await supabase
          .from('profiles')
          .update(anonymizedData)
          .eq('id', userId);

        if (scrubError) {
          console.error('Fatal: Could not scrub profile row during account deletion:', scrubError);
          throw scrubError;
        }
      }

      console.log('Account scrubbing completed successfully.');
      return { success: true, error: null };
    } catch (err: any) {
      console.error('Error in deleteAccount:', err);
      return { success: false, error: err };
    }
  }
};
