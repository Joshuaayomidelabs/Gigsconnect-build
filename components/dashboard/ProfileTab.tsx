import React, { useState, useEffect, useRef } from 'react';
import { Camera, Edit2, Save, Loader2, CheckCircle2, AlertCircle, Upload } from 'lucide-react';
import { supabase } from '../../src/supabaseClient';
import { motion } from 'motion/react';

const ProfileTab = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    id: '',
    full_name: '',
    email: '',
    phone: '',
    role: 'musician',
    bio: '',
    location: '',
    genre: '',
    experience_level: 'beginner',
    avatar_url: '',
    profileComplete: false
  });

  // Fetch user data on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data: authData, error: authError } = await supabase.auth.getSession();
        if (authError) throw authError;

        if (authData.session?.user) {
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('*')
            .eq('id', authData.session.user.id)
            .single();

          if (userError && userError.code !== 'PGRST116') {
            console.error('Error fetching profile:', userError);
          }

          if (!userData) {
            // If no user record exists yet, set the email and ID from auth
            setFormData(prev => ({ ...prev, id: authData.session.user.id, email: authData.session.user.email || '' }));
            setIsEditing(true);
          } else {
            setFormData({
              id: userData.id,
              full_name: userData.full_name || '',
              email: userData.email || authData.session.user.email || '',
              phone: userData.phone || '',
              role: userData.role || 'musician',
              bio: userData.bio || '',
              location: userData.location || '',
              genre: userData.genre || '',
              experience_level: userData.experience_level || 'beginner',
              avatar_url: userData.avatar_url || '',
              profileComplete: userData.profileComplete || false
            });
            // If profile is incomplete, automatically open edit mode
            if (!userData.profileComplete) {
              setIsEditing(true);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setIsUploading(true);
      setMessage(null);

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.');
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${formData.id}-${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      // Upload image to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
      
      // Update local state immediately
      setFormData(prev => ({ ...prev, avatar_url: data.publicUrl }));
      
      // Also update the database if we are not in edit mode
      if (!isEditing && formData.id) {
        await supabase
          .from('users')
          .update({ avatar_url: data.publicUrl })
          .eq('id', formData.id);
      }

      setMessage({ type: 'success', text: 'Avatar uploaded successfully!' });
      setTimeout(() => setMessage(null), 3000);
    } catch (error: any) {
      console.error('Error uploading avatar:', error);
      setMessage({ type: 'error', text: error.message || 'Error uploading avatar.' });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async () => {
    if (!formData.full_name.trim()) {
      setMessage({ type: 'error', text: 'Full Name is required.' });
      return;
    }

    setIsSaving(true);
    setMessage(null);

    try {
      // Update the users table in Supabase
      const { error } = await supabase
        .from('users')
        .upsert({
          id: formData.id,
          full_name: formData.full_name,
          email: formData.email,
          phone: formData.phone,
          role: formData.role,
          bio: formData.bio,
          location: formData.location,
          genre: formData.genre,
          experience_level: formData.experience_level,
          avatar_url: formData.avatar_url,
          profileComplete: true // Set to true upon saving
        });

      if (error) throw error;

      // Update local state immediately
      setFormData(prev => ({ ...prev, profileComplete: true }));
      setIsEditing(false);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      
      // Clear success message after 3 seconds
      setTimeout(() => setMessage(null), 3000);
      
    } catch (error: any) {
      console.error('Error updating profile:', error);
      setMessage({ type: 'error', text: error.message || 'Failed to update profile.' });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-brand-600" />
      </div>
    );
  }

  return (
    <div className="space-y-8 relative z-10 max-w-4xl mx-auto">
      {/* Header */}
      <section className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">My Profile</h1>
          <p className="text-gray-500 mt-1 text-lg">Manage your personal information</p>
        </div>
        {!isEditing && (
          <button 
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-700 font-bold hover:bg-gray-50 transition-colors shadow-sm active:scale-95"
          >
            <Edit2 className="w-4 h-4" />
            Edit Profile
          </button>
        )}
      </section>

      {/* Status Message */}
      {message && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-xl flex items-center gap-3 ${
            message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'
          }`}
        >
          {message.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          <p className="font-medium text-sm">{message.text}</p>
        </motion.div>
      )}

      {/* Profile Card */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Cover Photo Area */}
        <div className="h-32 sm:h-48 bg-gradient-to-r from-brand-600 to-brand-800 relative">
          <div className="absolute -bottom-12 sm:-bottom-16 left-6 sm:left-10 flex items-end gap-6">
            <div className="relative group">
              <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-white bg-white overflow-hidden shadow-md flex items-center justify-center">
                {formData.avatar_url ? (
                  <img 
                    src={formData.avatar_url} 
                    alt="Profile" 
                    className="w-full h-full object-cover" 
                    referrerPolicy="no-referrer" 
                  />
                ) : (
                  <img 
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(formData.full_name || 'User')}&background=random&size=150`} 
                    alt="Profile Placeholder" 
                    className="w-full h-full object-cover" 
                    referrerPolicy="no-referrer" 
                  />
                )}
              </div>
              <input 
                type="file" 
                accept="image/jpeg, image/png" 
                className="hidden" 
                ref={fileInputRef} 
                onChange={handleAvatarUpload}
                disabled={isUploading}
              />
              {isEditing && (
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="absolute bottom-0 right-0 p-2 bg-brand-600 text-white rounded-full shadow-lg hover:bg-brand-500 transition-colors active:scale-95 disabled:opacity-50"
                >
                  {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Camera className="w-4 h-4" />}
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="pt-16 sm:pt-20 px-6 sm:px-10 pb-10">
          {isEditing ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Full Name *</label>
                  <input 
                    name="full_name" 
                    value={formData.full_name} 
                    onChange={handleChange} 
                    placeholder="e.g. Alex Johnson"
                    className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-600 focus:border-transparent transition-all" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                  <input 
                    name="email" 
                    value={formData.email} 
                    disabled
                    className="w-full p-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed" 
                  />
                  <p className="text-xs text-gray-400 mt-2">Email is tied to your authentication and cannot be changed here.</p>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Phone</label>
                  <input 
                    name="phone" 
                    value={formData.phone} 
                    onChange={handleChange} 
                    placeholder="e.g. +1 555-123-4567"
                    className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-600 focus:border-transparent transition-all" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Role</label>
                  <select 
                    name="role" 
                    value={formData.role} 
                    onChange={handleChange} 
                    className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-600 focus:border-transparent transition-all bg-white"
                  >
                    <option value="musician">Musician</option>
                    <option value="organizer">Organizer</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Genre (for musicians)</label>
                  <input 
                    name="genre" 
                    value={formData.genre} 
                    onChange={handleChange} 
                    placeholder="e.g. Jazz, Rock, Classical"
                    className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-600 focus:border-transparent transition-all" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Experience Level</label>
                  <select 
                    name="experience_level" 
                    value={formData.experience_level} 
                    onChange={handleChange} 
                    className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-600 focus:border-transparent transition-all bg-white"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="professional">Professional</option>
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-bold text-gray-700 mb-2">Location</label>
                  <input 
                    name="location" 
                    value={formData.location} 
                    onChange={handleChange} 
                    placeholder="e.g. New York, NY"
                    className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-600 focus:border-transparent transition-all" 
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-bold text-gray-700 mb-2">Bio</label>
                  <textarea 
                    name="bio" 
                    value={formData.bio} 
                    onChange={handleChange} 
                    placeholder="Tell us a bit about yourself..."
                    rows={4}
                    className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-600 focus:border-transparent transition-all resize-none" 
                  />
                </div>
              </div>
              
              <div className="flex justify-end gap-3 pt-6 border-t border-gray-100 mt-8">
                {formData.profileComplete && (
                  <button 
                    onClick={() => setIsEditing(false)} 
                    disabled={isSaving || isUploading}
                    className="px-6 py-3 rounded-xl border border-gray-200 text-gray-700 font-bold hover:bg-gray-50 transition-colors active:scale-95 disabled:opacity-50"
                  >
                    Cancel
                  </button>
                )}
                <button 
                  onClick={handleSave} 
                  disabled={isSaving || isUploading}
                  className="px-8 py-3 rounded-xl bg-brand-600 text-white font-bold hover:bg-brand-700 transition-colors flex items-center gap-2 shadow-sm active:scale-95 disabled:opacity-70"
                >
                  {isSaving ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Save className="w-5 h-5" />
                  )}
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-8"
            >
              <div>
                <h2 className="text-2xl font-black text-gray-900 tracking-tight">
                  {formData.full_name} 
                </h2>
                <div className="flex items-center gap-2 mt-2">
                  <span className={`px-3 py-1 text-xs font-bold rounded-full uppercase tracking-wider border ${formData.profileComplete ? 'bg-green-50 text-green-700 border-green-100' : 'bg-orange-50 text-orange-700 border-orange-100'}`}>
                    {formData.profileComplete ? 'Verified Profile' : 'Incomplete Profile'}
                  </span>
                  <span className="px-3 py-1 text-xs font-bold rounded-full uppercase tracking-wider border bg-brand-50 text-brand-700 border-brand-100">
                    {formData.role}
                  </span>
                  {formData.experience_level && (
                    <span className="px-3 py-1 text-xs font-bold rounded-full uppercase tracking-wider border bg-brand-50 text-brand-700 border-brand-100">
                      {formData.experience_level}
                    </span>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-8 gap-x-12 pt-6 border-t border-gray-50">
                <div>
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Email Address</h3>
                  <p className="text-gray-900 font-medium text-lg">{formData.email}</p>
                </div>
                <div>
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Phone</h3>
                  <p className="text-gray-900 font-medium text-lg">{formData.phone || 'Not provided'}</p>
                </div>
                <div>
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Location</h3>
                  <p className="text-gray-900 font-medium text-lg">{formData.location || 'Not provided'}</p>
                </div>
                <div>
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Genre</h3>
                  <p className="text-gray-900 font-medium text-lg">{formData.genre || 'Not provided'}</p>
                </div>
                <div className="sm:col-span-2">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Bio</h3>
                  <p className="text-gray-900 text-base leading-relaxed whitespace-pre-wrap">{formData.bio || 'No bio provided.'}</p>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileTab;

