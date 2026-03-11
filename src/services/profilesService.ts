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

  async updateProfile(profileData: {
    full_name?: string;
    country?: string;
    city?: string;
    phone?: string;
    bio?: string;
    avatar_url?: string;
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
  }
};
