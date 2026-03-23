import { supabase } from './supabaseClient';

export const profilesService = {
  async getProfile(userId: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    return { data, error };
  },

  async ensureProfileExists(user: any) {
    const { data, error } = await supabase
      .from('profiles')
      .upsert({
        id: user.id,
        full_name: user.user_metadata?.full_name || 'Anonymous',
        avatar_url: user.user_metadata?.avatar_url || '',
        email: user.email,
        bio: '',
        role: '',
        updated_at: new Date().toISOString(),
      }, { onConflict: 'id' })
      .select()
      .single();
    
    return { data, error };
  },

  async updateProfile(profileData: {
    full_name?: string;
    country?: string;
    city?: string;
    phone?: string;
    bio?: string;
    avatar_url?: string;
    facebook_url?: string;
    instagram_url?: string;
    tiktok_url?: string;
    portfolio_media?: any[];
    [key: string]: any;
  }) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not logged in');

      // Sanitize data: remove fields that are known to be missing from the DB schema
      // to prevent "column not found" errors.
      const { availability, preferences, ...sanitizedData } = profileData;

      const { data, error } = await supabase
        .from('profiles')
        .update(sanitizedData)
        .eq('id', user.id)
        .select();

      if (error) throw error;
      return { data, error: null };
    } catch (error: any) {
      console.error('Error updating profile:', error.message);
      return { data: null, error };
    }
  },

  async uploadPortfolioMedia(userId: string, file: File, type: 'image' | 'video') {
    const maxSize = type === 'image' ? 5 * 1024 * 1024 : 50 * 1024 * 1024; // 5MB for images, 50MB for videos
    if (file.size > maxSize) {
      throw new Error(`File size must be less than ${maxSize / (1024 * 1024)}MB.`);
    }

    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
    const filePath = `${userId}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('portfolio')
      .upload(filePath, file, {
        contentType: file.type
      });

    if (uploadError) throw uploadError;

    const { data } = supabase.storage.from('portfolio').getPublicUrl(filePath);
    return data.publicUrl;
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

    // 3. The image file should be stored using the user's unique ID as the filename: avatars/{user.id}
    // Note: We don't necessarily need the extension if we want a fixed path, 
    // but usually it's better to keep it or just use the ID. 
    // The requirement says avatars/{user.id}.
    const filePath = `${userId}`; 

    // 4. The upload should replace the previous image if the user uploads a new one (use upsert).
    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file, {
        upsert: true,
        contentType: file.type
      });

    if (uploadError) throw uploadError;

    // 5. After upload, generate the public URL of the image.
    const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
    const cleanUrl = data.publicUrl;
    // Add a cache buster to the returned URL to ensure the browser fetches the new image immediately
    const publicUrlWithCacheBuster = `${cleanUrl}?t=${new Date().getTime()}`;

    // 6. Save this public URL to the avatar_url column in the profiles table.
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ avatar_url: cleanUrl })
      .eq('id', userId);

    if (updateError) throw updateError;

    return publicUrlWithCacheBuster;
  },

  async uploadVerificationDoc(userId: string, file: File) {
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      throw new Error('File size must be less than 10MB.');
    }

    const fileExt = file.name.split('.').pop();
    const fileName = `verification_${userId}_${Date.now()}.${fileExt}`;
    const filePath = `${userId}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('verification_docs')
      .upload(filePath, file, {
        contentType: file.type
      });

    if (uploadError) throw uploadError;

    // We don't necessarily want public URLs for ID documents for security reasons.
    // But for this implementation, we'll store the path.
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ 
        verification_status: 'Pending',
        verification_doc_path: filePath
      })
      .eq('id', userId);

    if (updateError) throw updateError;

    return filePath;
  }
};
