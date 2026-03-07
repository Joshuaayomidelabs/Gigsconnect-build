import React, { useState, useEffect } from 'react';
import { Camera, Loader2, Save, MapPin, User, Briefcase, Globe } from 'lucide-react';
import { supabase } from '../services/supabaseClient';
import { profilesService } from '../services/profilesService';

const EditProfile: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [formData, setFormData] = useState({
    full_name: '',
    username: '',
    bio: '',
    phone: '',
    role: '',
    city: '',
    country: '',
    skills: [] as string[],
    profile_photo: ''
  });

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data } = await profilesService.getProfile(session.user.id);
        if (data) {
          setFormData({
            full_name: data.full_name || '',
            username: data.username || '',
            bio: data.bio || '',
            phone: data.phone || '',
            role: data.role || '',
            city: data.city || '',
            country: data.country || '',
            skills: data.skills || [],
            profile_photo: data.profile_photo || ''
          });
        }
      }
      setIsFetching(false);
    };
    fetchProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSkillsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const skills = e.target.value.split(',').map(s => s.trim());
    setFormData(prev => ({ ...prev, skills }));
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Login required');

      const publicUrl = await profilesService.uploadAvatar(session.user.id, file);
      setFormData(prev => ({ ...prev, profile_photo: publicUrl }));
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Login required');

      const { error } = await profilesService.updateProfile(session.user.id, formData);
      if (error) throw error;
      alert('Profile updated successfully!');
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-10 h-10 animate-spin text-brand-600" />
      </div>
    );
  }

  return (
    <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto min-h-screen">
      <section className="mb-10">
        <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-4">Edit Profile</h1>
        <p className="text-gray-500 text-lg">Keep your profile up to date to attract more opportunities.</p>
      </section>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Avatar Section */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex flex-col items-center sm:flex-row gap-8">
          <div className="relative group">
            <div className="w-32 h-32 rounded-full bg-gray-100 border-4 border-white shadow-md overflow-hidden flex items-center justify-center">
              {formData.profile_photo ? (
                <img src={formData.profile_photo} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <User className="w-12 h-12 text-gray-300" />
              )}
            </div>
            <label className="absolute bottom-0 right-0 p-2 bg-brand-600 text-white rounded-full shadow-lg cursor-pointer hover:bg-brand-700 transition-all active:scale-90">
              <Camera className="w-5 h-5" />
              <input type="file" className="hidden" accept="image/*" onChange={handleAvatarUpload} />
            </label>
          </div>
          <div className="text-center sm:text-left">
            <h3 className="text-xl font-bold text-gray-900 mb-1">Profile Photo</h3>
            <p className="text-sm text-gray-500">Upload a clear photo of yourself. Max size 2MB.</p>
          </div>
        </div>

        {/* Basic Info */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <h3 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-50 pb-2">Basic Information</h3>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
            <input 
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              className="w-full p-4 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-brand-600 focus:border-transparent transition-all outline-none bg-gray-50 focus:bg-white"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Username</label>
            <input 
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full p-4 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-brand-600 focus:border-transparent transition-all outline-none bg-gray-50 focus:bg-white"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-bold text-gray-700 mb-2">Bio</label>
            <textarea 
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows={4}
              className="w-full p-4 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-brand-600 focus:border-transparent transition-all outline-none bg-gray-50 focus:bg-white resize-none"
            />
          </div>
        </div>

        {/* Professional Info */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <h3 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-50 pb-2">Professional Details</h3>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-brand-600" />
              Primary Role
            </label>
            <input 
              name="role"
              value={formData.role}
              onChange={handleChange}
              placeholder="e.g. Bassist, Producer"
              className="w-full p-4 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-brand-600 focus:border-transparent transition-all outline-none bg-gray-50 focus:bg-white"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Skills (comma separated)</label>
            <input 
              value={formData.skills.join(', ')}
              onChange={handleSkillsChange}
              placeholder="e.g. Slap Bass, Mixing, Logic Pro"
              className="w-full p-4 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-brand-600 focus:border-transparent transition-all outline-none bg-gray-50 focus:bg-white"
            />
          </div>
        </div>

        {/* Location Info */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <h3 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-50 pb-2">Location & Contact</h3>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-brand-600" />
              City
            </label>
            <input 
              name="city"
              value={formData.city}
              onChange={handleChange}
              className="w-full p-4 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-brand-600 focus:border-transparent transition-all outline-none bg-gray-50 focus:bg-white"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
              <Globe className="w-4 h-4 text-brand-600" />
              Country
            </label>
            <input 
              name="country"
              value={formData.country}
              onChange={handleChange}
              className="w-full p-4 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-brand-600 focus:border-transparent transition-all outline-none bg-gray-50 focus:bg-white"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-bold text-gray-700 mb-2">Phone Number</label>
            <input 
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full p-4 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-brand-600 focus:border-transparent transition-all outline-none bg-gray-50 focus:bg-white"
            />
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button 
            type="submit"
            disabled={isLoading}
            className="px-10 py-4 rounded-2xl bg-brand-600 text-white font-bold hover:bg-brand-700 transition-all shadow-lg flex items-center justify-center gap-2 active:scale-95 disabled:opacity-70"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProfile;
