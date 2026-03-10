import React, { useState, useEffect } from 'react';
import { Camera, Loader2, Save, MapPin, User, Briefcase, Globe } from 'lucide-react';
import { supabase } from '../services/supabaseClient';
import { profilesService } from '../services/profilesService';

const EditProfile: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');
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
      const { error } = await profilesService.updateProfile(formData);
      if (error) throw error;
      setSuccessMessage('Profile updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-10 h-10 animate-spin text-brand-purple" />
      </div>
    );
  }

  return (
    <div className="pt-24 pb-32 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto min-h-screen">
      <section className="mb-10">
        <h1 className="text-4xl font-black text-brand-black tracking-tight mb-4">Edit Profile</h1>
        <p className="text-brand-gray-dark text-lg">Keep your profile up to date to attract more opportunities.</p>
        {successMessage && (
          <div className="mt-4 p-4 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-2xl font-bold animate-in fade-in slide-in-from-top-2">
            {successMessage}
          </div>
        )}
      </section>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Avatar Section */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-brand-purple-light/10 flex flex-col items-center sm:flex-row gap-8">
          <div className="relative group">
            <div className="w-32 h-32 rounded-full bg-brand-gray border-4 border-white shadow-md overflow-hidden flex items-center justify-center">
              {formData.profile_photo ? (
                <img src={formData.profile_photo} alt="Profile" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
              ) : (
                <User className="w-12 h-12 text-brand-gray-dark/30" />
              )}
            </div>
            <label className="absolute bottom-0 right-0 p-2 bg-brand-purple text-white rounded-full shadow-lg cursor-pointer hover:bg-brand-purple-dark transition-all active:scale-90">
              <Camera className="w-5 h-5" />
              <input type="file" className="hidden" accept="image/*" onChange={handleAvatarUpload} />
            </label>
          </div>
          <div className="text-center sm:text-left">
            <h3 className="text-xl font-bold text-brand-black mb-1">Profile Photo</h3>
            <p className="text-sm text-brand-gray-dark">Upload a clear photo of yourself. Max size 2MB.</p>
          </div>
        </div>

        {/* Basic Info */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-brand-purple-light/10 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <h3 className="text-lg font-bold text-brand-black mb-4 border-b border-brand-gray pb-2">Basic Information</h3>
          </div>
          <div>
            <label className="block text-sm font-bold text-brand-gray-dark mb-2">Full Name</label>
            <input 
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              className="w-full p-4 rounded-2xl border border-brand-purple-light/20 focus:ring-2 focus:ring-brand-purple focus:border-transparent transition-all outline-none bg-brand-gray focus:bg-white"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-brand-gray-dark mb-2">Username</label>
            <input 
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full p-4 rounded-2xl border border-brand-purple-light/20 focus:ring-2 focus:ring-brand-purple focus:border-transparent transition-all outline-none bg-brand-gray focus:bg-white"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-bold text-brand-gray-dark mb-2">Bio</label>
            <textarea 
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows={4}
              className="w-full p-4 rounded-2xl border border-brand-purple-light/20 focus:ring-2 focus:ring-brand-purple focus:border-transparent transition-all outline-none bg-brand-gray focus:bg-white resize-none"
            />
          </div>
        </div>

        {/* Professional Info */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-brand-purple-light/10 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <h3 className="text-lg font-bold text-brand-black mb-4 border-b border-brand-gray pb-2">Professional Details</h3>
          </div>
          <div>
            <label className="block text-sm font-bold text-brand-gray-dark mb-2 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-brand-purple" />
              Primary Role
            </label>
            <input 
              name="role"
              value={formData.role}
              onChange={handleChange}
              placeholder="e.g. Bassist, Producer"
              className="w-full p-4 rounded-2xl border border-brand-purple-light/20 focus:ring-2 focus:ring-brand-purple focus:border-transparent transition-all outline-none bg-brand-gray focus:bg-white"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-brand-gray-dark mb-2">Skills (comma separated)</label>
            <input 
              value={formData.skills.join(', ')}
              onChange={handleSkillsChange}
              placeholder="e.g. Slap Bass, Mixing, Logic Pro"
              className="w-full p-4 rounded-2xl border border-brand-purple-light/20 focus:ring-2 focus:ring-brand-purple focus:border-transparent transition-all outline-none bg-brand-gray focus:bg-white"
            />
          </div>
        </div>

        {/* Location Info */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-brand-purple-light/10 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <h3 className="text-lg font-bold text-brand-black mb-4 border-b border-brand-gray pb-2">Location & Contact</h3>
          </div>
          <div>
            <label className="block text-sm font-bold text-brand-gray-dark mb-2 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-brand-purple" />
              City
            </label>
            <input 
              name="city"
              value={formData.city}
              onChange={handleChange}
              className="w-full p-4 rounded-2xl border border-brand-purple-light/20 focus:ring-2 focus:ring-brand-purple focus:border-transparent transition-all outline-none bg-brand-gray focus:bg-white"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-brand-gray-dark mb-2 flex items-center gap-2">
              <Globe className="w-4 h-4 text-brand-purple" />
              Country
            </label>
            <input 
              name="country"
              value={formData.country}
              onChange={handleChange}
              className="w-full p-4 rounded-2xl border border-brand-purple-light/20 focus:ring-2 focus:ring-brand-purple focus:border-transparent transition-all outline-none bg-brand-gray focus:bg-white"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-bold text-brand-gray-dark mb-2">Phone Number</label>
            <input 
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full p-4 rounded-2xl border border-brand-purple-light/20 focus:ring-2 focus:ring-brand-purple focus:border-transparent transition-all outline-none bg-brand-gray focus:bg-white"
            />
          </div>
        </div>

        <div className="sticky bottom-24 lg:bottom-8 left-0 right-0 flex justify-end pt-4 pointer-events-none">
          <button 
            type="submit"
            disabled={isLoading}
            className="pointer-events-auto px-10 py-4 rounded-2xl bg-brand-purple text-white font-black hover:bg-brand-purple-dark transition-all shadow-2xl shadow-brand-purple/30 flex items-center justify-center gap-3 active:scale-95 disabled:opacity-70 border-2 border-white/20 backdrop-blur-sm"
          >
            {isLoading ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              <>
                <Save className="w-6 h-6" />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProfile;
