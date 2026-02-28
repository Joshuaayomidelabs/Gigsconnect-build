import React, { useState, useEffect } from 'react';
import { Camera, Edit2, Save, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { supabase } from '../../src/supabaseClient';
import { motion } from 'motion/react';

const ProfileTab = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    stage_name: '',
    email: '',
    profileComplete: false
  });

  // Fetch user data on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data: authData, error: authError } = await supabase.auth.getUser();
        if (authError) throw authError;

        if (authData.user) {
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('*')
            .eq('id', authData.user.id)
            .single();

          if (userError) {
            // If no user record exists yet, set the email and ID from auth
            setFormData(prev => ({ ...prev, id: authData.user.id, email: authData.user.email || '' }));
            setIsEditing(true);
          } else if (userData) {
            setFormData({
              id: userData.id,
              name: userData.name || '',
              stage_name: userData.stage_name || '',
              email: userData.email || authData.user.email || '',
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      setMessage({ type: 'error', text: 'Name is required.' });
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
          name: formData.name,
          stage_name: formData.stage_name,
          email: formData.email,
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
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
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
        <div className="h-32 sm:h-48 bg-gradient-to-r from-blue-600 to-indigo-600 relative">
          <div className="absolute -bottom-12 sm:-bottom-16 left-6 sm:left-10 flex items-end gap-6">
            <div className="relative group">
              <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-white bg-white overflow-hidden shadow-md">
                <img 
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name || 'User')}&background=random&size=150`} 
                  alt="Profile" 
                  className="w-full h-full object-cover" 
                  referrerPolicy="no-referrer" 
                />
              </div>
              {isEditing && (
                <button className="absolute bottom-0 right-0 p-2 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-500 transition-colors active:scale-95">
                  <Camera className="w-4 h-4" />
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
                  <label className="block text-sm font-bold text-gray-700 mb-2">Name *</label>
                  <input 
                    name="name" 
                    value={formData.name} 
                    onChange={handleChange} 
                    placeholder="e.g. Alex Johnson"
                    className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Stage Name</label>
                  <input 
                    name="stage_name" 
                    value={formData.stage_name} 
                    onChange={handleChange} 
                    placeholder="e.g. AJ Beats"
                    className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all" 
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                  <input 
                    name="email" 
                    value={formData.email} 
                    disabled
                    className="w-full p-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed" 
                  />
                  <p className="text-xs text-gray-400 mt-2">Email is tied to your authentication and cannot be changed here.</p>
                </div>
              </div>
              
              <div className="flex justify-end gap-3 pt-6 border-t border-gray-100 mt-8">
                {formData.profileComplete && (
                  <button 
                    onClick={() => setIsEditing(false)} 
                    disabled={isSaving}
                    className="px-6 py-3 rounded-xl border border-gray-200 text-gray-700 font-bold hover:bg-gray-50 transition-colors active:scale-95 disabled:opacity-50"
                  >
                    Cancel
                  </button>
                )}
                <button 
                  onClick={handleSave} 
                  disabled={isSaving}
                  className="px-8 py-3 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-sm active:scale-95 disabled:opacity-70"
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
                  {formData.name} 
                  {formData.stage_name && <span className="text-gray-400 font-medium text-lg ml-2">({formData.stage_name})</span>}
                </h2>
                <div className="flex items-center gap-2 mt-2">
                  <span className={`px-3 py-1 text-xs font-bold rounded-full uppercase tracking-wider border ${formData.profileComplete ? 'bg-green-50 text-green-700 border-green-100' : 'bg-orange-50 text-orange-700 border-orange-100'}`}>
                    {formData.profileComplete ? 'Verified Profile' : 'Incomplete Profile'}
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-8 gap-x-12 pt-6 border-t border-gray-50">
                <div>
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Email Address</h3>
                  <p className="text-gray-900 font-medium text-lg">{formData.email}</p>
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
