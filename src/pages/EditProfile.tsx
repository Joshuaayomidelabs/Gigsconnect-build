import React, { useState, useEffect } from 'react';
import { Camera, Loader2, Save, MapPin, User, Briefcase, Globe, Edit3, Phone, CheckCircle2 } from 'lucide-react';
import { supabase } from '../services/supabaseClient';
import { profilesService } from '../services/profilesService';
import { motion, AnimatePresence } from 'motion/react';

const EditProfile: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
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
    avatar_url: ''
  });

  const fetchProfile = async () => {
    setIsFetching(true);
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
          avatar_url: data.avatar_url || ''
        });
      }
    }
    setIsFetching(false);
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSkillsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const skills = e.target.value.split(',').map(s => s.trim()).filter(s => s !== '');
    setFormData(prev => ({ ...prev, skills }));
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Login required');

      const publicUrl = await profilesService.uploadAvatar(session.user.id, file);
      setFormData(prev => ({ ...prev, avatar_url: publicUrl }));
      setSuccessMessage('Photo updated!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await profilesService.updateProfile(formData);
      if (error) throw error;
      setSuccessMessage('Profile updated successfully!');
      setIsEditing(false);
      // Re-fetch to be sure we have the latest
      await fetchProfile();
      setTimeout(() => setSuccessMessage(''), 5000);
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
      <AnimatePresence mode="wait">
        {!isEditing ? (
          <motion.div
            key="view"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            <section className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-4xl font-black text-brand-black tracking-tight mb-2">My Profile</h1>
                <p className="text-brand-gray-dark text-lg font-medium">This is how others see you on GigsConnect.</p>
              </div>
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-brand-purple-light/20 rounded-2xl text-brand-purple font-bold hover:bg-brand-purple-soft transition-all active:scale-95 shadow-sm"
              >
                <Edit3 className="w-5 h-5" />
                Edit Profile
              </button>
            </section>

            {successMessage && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-4 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-2xl font-bold flex items-center gap-3"
              >
                <CheckCircle2 className="w-5 h-5" />
                {successMessage}
              </motion.div>
            )}

            <div className="bg-white rounded-[2.5rem] shadow-xl shadow-brand-purple/5 border border-brand-purple-light/10 overflow-hidden">
              {/* Header/Cover Placeholder */}
              <div className="h-32 bg-gradient-to-r from-brand-purple to-brand-purple-dark opacity-10" />
              
              <div className="px-8 pb-8 -mt-16">
                <div className="flex flex-col sm:flex-row items-end gap-6 mb-8">
                  <div className="w-32 h-32 rounded-full bg-white p-1 shadow-xl">
                    <div className="w-full h-full rounded-full bg-brand-gray overflow-hidden flex items-center justify-center border-4 border-white">
                      {formData.avatar_url ? (
                        <img src={formData.avatar_url} alt={formData.full_name} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-12 h-12 text-brand-gray-dark/30" />
                      )}
                    </div>
                  </div>
                  <div className="flex-grow pb-2">
                    <h2 className="text-3xl font-black text-brand-black tracking-tight">{formData.full_name || 'Anonymous User'}</h2>
                    <p className="text-brand-purple font-bold">@{formData.username || 'username'}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                  <div className="lg:col-span-2 space-y-8">
                    <div>
                      <h3 className="text-xs font-black uppercase tracking-widest text-brand-gray-dark mb-4">About Me</h3>
                      <p className="text-brand-black leading-relaxed whitespace-pre-wrap">
                        {formData.bio || "No bio provided yet. Tell the community about yourself!"}
                      </p>
                    </div>

                    <div>
                      <h3 className="text-xs font-black uppercase tracking-widest text-brand-gray-dark mb-4">Skills & Expertise</h3>
                      <div className="flex flex-wrap gap-2">
                        {formData.skills.length > 0 ? (
                          formData.skills.map((skill, i) => (
                            <span key={i} className="px-4 py-2 bg-brand-purple-soft text-brand-purple rounded-xl text-sm font-bold border border-brand-purple-light/10">
                              {skill}
                            </span>
                          ))
                        ) : (
                          <p className="text-brand-gray-dark italic text-sm">No skills listed yet.</p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="bg-brand-gray/50 rounded-3xl p-6 space-y-4 border border-brand-purple-light/5">
                      <h3 className="text-xs font-black uppercase tracking-widest text-brand-gray-dark mb-2">Details</h3>
                      
                      <div className="flex items-center gap-3 text-brand-black">
                        <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-sm">
                          <Briefcase className="w-4 h-4 text-brand-purple" />
                        </div>
                        <div>
                          <p className="text-[10px] uppercase font-black text-brand-gray-dark tracking-tighter">Role</p>
                          <p className="text-sm font-bold">{formData.role || 'Not specified'}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 text-brand-black">
                        <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-sm">
                          <MapPin className="w-4 h-4 text-brand-purple" />
                        </div>
                        <div>
                          <p className="text-[10px] uppercase font-black text-brand-gray-dark tracking-tighter">Location</p>
                          <p className="text-sm font-bold">
                            {formData.city && formData.country ? `${formData.city}, ${formData.country}` : (formData.city || formData.country || 'Not specified')}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 text-brand-black">
                        <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-sm">
                          <Phone className="w-4 h-4 text-brand-purple" />
                        </div>
                        <div>
                          <p className="text-[10px] uppercase font-black text-brand-gray-dark tracking-tighter">Contact</p>
                          <p className="text-sm font-bold">{formData.phone || 'Not specified'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="edit"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <section className="mb-10 flex justify-between items-end">
              <div>
                <h1 className="text-4xl font-black text-brand-black tracking-tight mb-4">Edit Profile</h1>
                <p className="text-brand-gray-dark text-lg">Update your information to stand out.</p>
              </div>
              <button
                onClick={() => setIsEditing(false)}
                className="text-brand-gray-dark font-bold hover:text-brand-purple transition-colors mb-4"
              >
                Cancel
              </button>
            </section>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Avatar Section */}
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-brand-purple-light/10 flex flex-col items-center sm:flex-row gap-8">
                <div className="relative group">
                  <div className="w-32 h-32 rounded-full bg-brand-gray border-4 border-white shadow-md overflow-hidden flex items-center justify-center">
                    {formData.avatar_url ? (
                      <img src={formData.avatar_url} alt="Profile" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
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
                  <p className="text-sm text-brand-gray-dark">Upload a clear photo of yourself. Max size 1MB.</p>
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
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EditProfile;
