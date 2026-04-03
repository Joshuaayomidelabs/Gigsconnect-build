import { supabase } from './supabaseClient';

export const profilesService = {
  async getProfile(userId: string) {
    console.log('Fetching profile for userId:', userId);
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)   // MUST match auth.users.id
      .maybeSingle();
    
    if (error) console.error(error);
    console.log(data);

    if (data) {
      // Map backend 'city_town' to frontend 'city'
      data.city = data.city_town;
    } else {
      console.warn('No profile found for userId:', userId);
    }
    
    return { data, error };
  },

  async ensureProfileExists(user: any) {
    try {
      console.log('Ensuring profile exists for User ID:', user.id);
      // 1. Check if profile already exists to avoid overwriting custom data
      const { data: existingProfile, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)   // MUST match auth.users.id
        .maybeSingle();

      if (fetchError) console.error(fetchError);
      console.log(existingProfile);

      if (existingProfile) {
        // If profile exists but lacks some basic info, we could update it, 
        // but we definitely don't want to overwrite avatar_url if it's already set.
        return { data: existingProfile, error: null };
      }

      // 2. If it doesn't exist, create it using metadata
      const fullName = user.user_metadata?.full_name || user.user_metadata?.name || 'Anonymous';
      const avatarUrl = user.user_metadata?.avatar_url || user.user_metadata?.picture || '';
      const phone = user.user_metadata?.phone || '';
      const country = user.user_metadata?.country || '';
      const cityTown = user.user_metadata?.city || '';

      const { data, error } = await supabase
        .from('profiles')
        .insert({
          id: user.id,   // MUST match auth.users.id
          full_name: fullName,
          avatar_url: avatarUrl,
          email: user.email,
          phone: phone,
          country: country,
          city_town: cityTown,
          bio: '',
          role: '',
          updated_at: new Date().toISOString(),
        })
        .select()
        .maybeSingle();
      
      return { data, error };
    } catch (err: any) {
      console.error('Error in ensureProfileExists:', err.message);
      return { data: null, error: err };
    }
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
        'portfolio_media', 'verification_status', 'verification_doc_path'
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

      const { data, error } = await supabase
        .from('profiles')
        .update(sanitizedData)
        .eq('id', user.id)   // MUST match auth.users.id
        .select();

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

    const maxSize = 1 * 1024 * 1024; // 1MB
    if (file.size > maxSize) {
      throw new Error('File size must be less than 1MB.');
    }

    // Use extension to ensure better compatibility with browsers and storage providers
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}-${Date.now()}.${fileExt}`;
    const filePath = `${userId}/${fileName}`; 

    // 4. The upload should replace the previous image if the user uploads a new one (use upsert).
    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file, {
        upsert: true,
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
    // Add a cache buster to the returned URL to ensure the browser fetches the new image immediately
    const publicUrlWithCacheBuster = `${publicUrl}?t=${new Date().getTime()}`;

    // 6. Save this public URL to the avatar_url column in the profiles table.
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ avatar_url: publicUrl })
      .eq('id', userId);   // MUST match auth.users.id

    if (updateError) {
      console.error('Update profile error:', updateError);
      throw updateError;
    }

    return publicUrlWithCacheBuster;
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
        verification_status: 'Pending',
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
        .select('id, full_name, avatar_url, skills, city_town, country')
        .overlaps('skills', [searchTerm.toLowerCase().trim()])
        .limit(10);

      if (currentUserId) {
        query = query.neq('id', currentUserId);
      }

      const { data, error } = await query;
      
      // Map city_town to city for frontend consistency
      const mappedData = data?.map(user => ({
        ...user,
        city: user.city_town
      })) || [];

      return { data: mappedData, error };
    } catch (err: any) {
      console.error("Unexpected error searching users:", err);
      return { data: [], error: err };
    }
  }
};
