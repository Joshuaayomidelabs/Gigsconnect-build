import React, { useState, useEffect } from 'react';
import { Camera, Loader2, Save, MapPin, User, Briefcase, Globe, Edit3, Phone, CheckCircle2, Facebook, Instagram, Music2, Video, Image as ImageIcon, Trash2, Plus, ExternalLink, Play } from 'lucide-react';
import { supabase } from '../services/supabaseClient';
import { profilesService } from '../services/profilesService';
import { motion, AnimatePresence } from 'motion/react';

interface PortfolioItem {
  url: string;
  type: 'image' | 'video';
  id: string;
  is_featured?: boolean;
}

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
    avatar_url: '',
    facebook_url: '',
    instagram_url: '',
    tiktok_url: '',
    portfolio_media: [] as PortfolioItem[]
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
          avatar_url: data.avatar_url || '',
          facebook_url: data.facebook_url || '',
          instagram_url: data.instagram_url || '',
          tiktok_url: data.tiktok_url || '',
          portfolio_media: data.portfolio_media || []
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

  const handlePortfolioUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'video') => {
    const file = e.target.files?.[0];
    if (!file) return;

    const currentMedia = formData.portfolio_media.filter(m => m.type === type);
    if (currentMedia.length >= 3) {
      alert(`You can only upload up to 3 ${type}s.`);
      return;
    }

    try {
      setIsLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Login required');

      const publicUrl = await profilesService.uploadPortfolioMedia(session.user.id, file, type);
      
      const newItem: PortfolioItem = {
        url: publicUrl,
        type,
        id: Math.random().toString(36).substring(2),
        is_featured: formData.portfolio_media.length === 0 // First item is featured by default
      };

      const updatedMedia = [...formData.portfolio_media, newItem];
      setFormData(prev => ({ ...prev, portfolio_media: updatedMedia }));
      
      // Auto-save the media update to the profile
      await profilesService.updateProfile({ ...formData, portfolio_media: updatedMedia });
      
      setSuccessMessage(`${type.charAt(0).toUpperCase() + type.slice(1)} uploaded!`);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleFeatured = async (id: string) => {
    const updatedMedia = formData.portfolio_media.map(item => ({
      ...item,
      is_featured: item.id === id
    }));

    setFormData(prev => ({ ...prev, portfolio_media: updatedMedia }));
    await profilesService.updateProfile({ ...formData, portfolio_media: updatedMedia });
    setSuccessMessage('Featured item updated!');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleDeleteMedia = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;

    try {
      setIsLoading(true);
      const itemToDelete = formData.portfolio_media.find(m => m.id === id);
      if (!itemToDelete) return;

      // Extract path from URL
      // URL format: .../storage/v1/object/public/portfolio/user_id/filename.ext
      const urlParts = itemToDelete.url.split('/portfolio/');
      if (urlParts.length > 1) {
        const filePath = urlParts[1].split('?')[0]; // Remove cache buster if any
        await profilesService.deletePortfolioMedia(filePath);
      }

      const updatedMedia = formData.portfolio_media.filter(m => m.id !== id);
      setFormData(prev => ({ ...prev, portfolio_media: updatedMedia }));
      
      await profilesService.updateProfile({ ...formData, portfolio_media: updatedMedia });
      
      setSuccessMessage('Item deleted!');
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
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
        <Loader2 className="w-10 h-10 animate-spin text-blue-500 dark:text-blue-400" />
      </div>
    );
  }

  return (
    <div className="pt-24 pb-32 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-500">
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
                <h1 className="text-4xl font-black text-gray-900 dark:text-gray-100 tracking-tight mb-2">My Profile</h1>
                <p className="text-gray-500 dark:text-gray-400 text-lg font-medium">This is how others see you on GigsConnect.</p>
              </div>
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-2xl text-blue-600 dark:text-blue-400 font-bold hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all active:scale-95 shadow-sm"
              >
                <Edit3 className="w-5 h-5" />
                Edit Profile
              </button>
            </section>

            {successMessage && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-900/40 text-emerald-700 dark:text-emerald-400 rounded-2xl font-bold flex items-center gap-3"
              >
                <CheckCircle2 className="w-5 h-5" />
                {successMessage}
              </motion.div>
            )}

            <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden transition-colors">
              {/* Header/Cover Placeholder */}
              <div className="h-32 bg-gradient-to-r from-blue-500 to-blue-700 opacity-10" />
              
              <div className="px-8 pb-8 -mt-16">
                <div className="flex flex-col sm:flex-row items-end gap-6 mb-8">
                  <div className="w-32 h-32 rounded-full bg-white dark:bg-gray-800 p-1 shadow-xl">
                    <div className="w-full h-full rounded-full bg-gray-100 dark:bg-gray-900 overflow-hidden flex items-center justify-center border-4 border-white dark:border-gray-800">
                      {formData.avatar_url ? (
                        <img src={formData.avatar_url} alt={formData.full_name} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-12 h-12 text-gray-400 dark:text-gray-600" />
                      )}
                    </div>
                  </div>
                  <div className="flex-grow pb-2">
                    <h2 className="text-3xl font-black text-gray-900 dark:text-gray-100 tracking-tight">{formData.full_name || 'Anonymous User'}</h2>
                    <p className="text-blue-600 dark:text-blue-400 font-bold">@{formData.username || 'username'}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                  <div className="lg:col-span-2 space-y-8">
                    <div>
                      <h3 className="text-xs font-black uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-4">About Me</h3>
                      <p className="text-gray-900 dark:text-gray-100 leading-relaxed whitespace-pre-wrap">
                        {formData.bio || "No bio provided yet. Tell the community about yourself!"}
                      </p>
                    </div>

                    <div>
                      <h3 className="text-xs font-black uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-4">Portfolio</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {formData.portfolio_media.length > 0 ? (
                          formData.portfolio_media.map((item) => (
                    <div key={item.id} className={`relative aspect-video rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-900 group ${item.is_featured ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}>
                              {item.type === 'image' ? (
                                <img src={item.url} alt="Portfolio" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                              ) : (
                                <div className="w-full h-full relative">
                                  <video src={item.url} className="w-full h-full object-cover" />
                                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-all">
                                    <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
                                      <Play className="w-6 h-6 fill-current" />
                                    </div>
                                  </div>
                                </div>
                              )}
                              <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                <a 
                                  href={item.url} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="p-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg hover:bg-white dark:hover:bg-gray-700"
                                >
                                  <ExternalLink className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                </a>
                              </div>
                              {item.is_featured && (
                                <div className="absolute bottom-2 left-2 px-2 py-1 bg-blue-500 dark:bg-blue-400 text-white dark:text-gray-900 text-[10px] font-black uppercase tracking-widest rounded-md">
                                  Featured
                                </div>
                              )}
                            </div>
                          ))
                        ) : (
                          <div className="col-span-full py-8 text-center bg-gray-50 dark:bg-gray-900/50 rounded-3xl border border-dashed border-gray-200 dark:border-gray-700">
                            <p className="text-gray-500 dark:text-gray-400 text-sm">No portfolio items added yet.</p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xs font-black uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-4">Skills & Expertise</h3>
                      <div className="flex flex-wrap gap-2">
                        {formData.skills.length > 0 ? (
                          formData.skills.map((skill, i) => (
                            <span key={i} className="px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-xl text-sm font-bold border border-blue-100 dark:border-blue-900/40">
                              {skill}
                            </span>
                          ))
                        ) : (
                          <p className="text-gray-500 dark:text-gray-400 italic text-sm">No skills listed yet.</p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="bg-gray-50 dark:bg-gray-900/50 rounded-3xl p-6 space-y-4 border border-gray-200 dark:border-gray-700">
                      <h3 className="text-xs font-black uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-2">Details</h3>
                      
                      <div className="flex items-center gap-3 text-gray-900 dark:text-gray-100">
                        <div className="w-8 h-8 rounded-lg bg-white dark:bg-gray-800 flex items-center justify-center shadow-sm">
                          <Briefcase className="w-4 h-4 text-blue-500 dark:text-blue-400" />
                        </div>
                        <div>
                          <p className="text-[10px] uppercase font-black text-gray-500 dark:text-gray-400 tracking-tighter">Role</p>
                          <p className="text-sm font-bold">{formData.role || 'Not specified'}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 text-gray-900 dark:text-gray-100">
                        <div className="w-8 h-8 rounded-lg bg-white dark:bg-gray-800 flex items-center justify-center shadow-sm">
                          <MapPin className="w-4 h-4 text-blue-500 dark:text-blue-400" />
                        </div>
                        <div>
                          <p className="text-[10px] uppercase font-black text-gray-500 dark:text-gray-400 tracking-tighter">Location</p>
                          <p className="text-sm font-bold">
                            {formData.city && formData.country ? `${formData.city}, ${formData.country}` : (formData.city || formData.country || 'Not specified')}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 text-gray-900 dark:text-gray-100">
                        <div className="w-8 h-8 rounded-lg bg-white dark:bg-gray-800 flex items-center justify-center shadow-sm">
                          <Phone className="w-4 h-4 text-blue-500 dark:text-blue-400" />
                        </div>
                        <div>
                          <p className="text-[10px] uppercase font-black text-gray-500 dark:text-gray-400 tracking-tighter">Contact</p>
                          <p className="text-sm font-bold">{formData.phone || 'Not specified'}</p>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                        <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-4">Social Links</h3>
                        <div className="flex gap-3">
                          {formData.facebook_url && (
                            <a href={formData.facebook_url} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-white dark:bg-gray-800 flex items-center justify-center shadow-sm hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 transition-all">
                              <Facebook className="w-5 h-5" />
                            </a>
                          )}
                          {formData.instagram_url && (
                            <a href={formData.instagram_url} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-white dark:bg-gray-800 flex items-center justify-center shadow-sm hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 transition-all">
                              <Instagram className="w-5 h-5" />
                            </a>
                          )}
                          {formData.tiktok_url && (
                            <a href={formData.tiktok_url} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-white dark:bg-gray-800 flex items-center justify-center shadow-sm hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 transition-all">
                              <Music2 className="w-5 h-5" />
                            </a>
                          )}
                          {!formData.facebook_url && !formData.instagram_url && !formData.tiktok_url && (
                            <p className="text-xs text-gray-500 dark:text-gray-400 italic">No social links added.</p>
                          )}
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
                <h1 className="text-4xl font-black text-gray-900 dark:text-gray-100 tracking-tight mb-4">Edit Profile</h1>
                <p className="text-gray-500 dark:text-gray-400 text-lg">Update your information to stand out.</p>
              </div>
              <button
                onClick={() => setIsEditing(false)}
                className="text-gray-500 dark:text-gray-400 font-bold hover:text-blue-600 dark:hover:text-blue-400 transition-colors mb-4"
              >
                Cancel
              </button>
            </section>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Avatar Section */}
              <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col items-center sm:flex-row gap-8 transition-colors">
                <div className="relative group">
                  <div className="w-32 h-32 rounded-full bg-gray-100 dark:bg-gray-900 border-4 border-white dark:border-gray-800 shadow-md overflow-hidden flex items-center justify-center">
                    {formData.avatar_url ? (
                      <img src={formData.avatar_url} alt="Profile" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-12 h-12 text-gray-400 dark:text-gray-600" />
                    )}
                  </div>
                  <label className="absolute bottom-0 right-0 p-2 bg-blue-500 dark:bg-blue-400 text-white dark:text-gray-900 rounded-full shadow-lg cursor-pointer hover:bg-blue-600 dark:hover:bg-blue-500 transition-all active:scale-90">
                    <Camera className="w-5 h-5" />
                    <input type="file" className="hidden" accept="image/*" onChange={handleAvatarUpload} />
                  </label>
                </div>
                <div className="text-center sm:text-left">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-1">Profile Photo</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Upload a clear photo of yourself. Max size 1MB.</p>
                </div>
              </div>

              {/* Basic Info */}
              <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-sm border border-gray-200 dark:border-gray-700 grid grid-cols-1 md:grid-cols-2 gap-6 transition-colors">
                <div className="md:col-span-2">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4 border-b border-gray-100 dark:border-gray-700 pb-2">Basic Information</h3>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-500 dark:text-gray-400 mb-2">Full Name</label>
                  <input 
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleChange}
                    className="w-full p-4 rounded-2xl border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none bg-gray-50 dark:bg-gray-900 focus:bg-white dark:focus:bg-gray-800 text-gray-900 dark:text-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-500 dark:text-gray-400 mb-2">Username</label>
                  <input 
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className="w-full p-4 rounded-2xl border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none bg-gray-50 dark:bg-gray-900 focus:bg-white dark:focus:bg-gray-800 text-gray-900 dark:text-gray-100"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-500 dark:text-gray-400 mb-2">Bio</label>
                  <textarea 
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    rows={4}
                    className="w-full p-4 rounded-2xl border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none bg-gray-50 dark:bg-gray-900 focus:bg-white dark:focus:bg-gray-800 resize-none text-gray-900 dark:text-gray-100"
                  />
                </div>
              </div>

              {/* Professional Info */}
              <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-sm border border-gray-200 dark:border-gray-700 grid grid-cols-1 md:grid-cols-2 gap-6 transition-colors">
                <div className="md:col-span-2">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4 border-b border-gray-100 dark:border-gray-700 pb-2">Professional Details</h3>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-500 dark:text-gray-400 mb-2 flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-blue-500 dark:text-blue-400" />
                    Primary Role
                  </label>
                  <input 
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    placeholder="e.g. Bassist, Producer"
                    className="w-full p-4 rounded-2xl border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none bg-gray-50 dark:bg-gray-900 focus:bg-white dark:focus:bg-gray-800 text-gray-900 dark:text-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-500 dark:text-gray-400 mb-2">Skills (comma separated)</label>
                  <input 
                    value={formData.skills.join(', ')}
                    onChange={handleSkillsChange}
                    placeholder="e.g. Slap Bass, Mixing, Logic Pro"
                    className="w-full p-4 rounded-2xl border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none bg-gray-50 dark:bg-gray-900 focus:bg-white dark:focus:bg-gray-800 text-gray-900 dark:text-gray-100"
                  />
                </div>
              </div>

              {/* Location Info */}
              <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-sm border border-gray-200 dark:border-gray-700 grid grid-cols-1 md:grid-cols-2 gap-6 transition-colors">
                <div className="md:col-span-2">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4 border-b border-gray-100 dark:border-gray-700 pb-2">Location & Contact</h3>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-500 dark:text-gray-400 mb-2 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-blue-500 dark:text-blue-400" />
                    City
                  </label>
                  <input 
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full p-4 rounded-2xl border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none bg-gray-50 dark:bg-gray-900 focus:bg-white dark:focus:bg-gray-800 text-gray-900 dark:text-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-500 dark:text-gray-400 mb-2 flex items-center gap-2">
                    <Globe className="w-4 h-4 text-blue-500 dark:text-blue-400" />
                    Country
                  </label>
                  <input 
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className="w-full p-4 rounded-2xl border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none bg-gray-50 dark:bg-gray-900 focus:bg-white dark:focus:bg-gray-800 text-gray-900 dark:text-gray-100"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-500 dark:text-gray-400 mb-2">Phone Number</label>
                  <input 
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full p-4 rounded-2xl border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none bg-gray-50 dark:bg-gray-900 focus:bg-white dark:focus:bg-gray-800 text-gray-900 dark:text-gray-100"
                  />
                </div>
              </div>

              {/* Social Links */}
              <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-sm border border-gray-200 dark:border-gray-700 grid grid-cols-1 md:grid-cols-3 gap-6 transition-colors">
                <div className="md:col-span-3">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4 border-b border-gray-100 dark:border-gray-700 pb-2">Social Media Links</h3>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-500 dark:text-gray-400 mb-2 flex items-center gap-2">
                    <Facebook className="w-4 h-4 text-blue-500 dark:text-blue-400" />
                    Facebook URL
                  </label>
                  <input 
                    name="facebook_url"
                    value={formData.facebook_url}
                    onChange={handleChange}
                    placeholder="https://facebook.com/..."
                    className="w-full p-4 rounded-2xl border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none bg-gray-50 dark:bg-gray-900 focus:bg-white dark:focus:bg-gray-800 text-gray-900 dark:text-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-500 dark:text-gray-400 mb-2 flex items-center gap-2">
                    <Instagram className="w-4 h-4 text-blue-500 dark:text-blue-400" />
                    Instagram URL
                  </label>
                  <input 
                    name="instagram_url"
                    value={formData.instagram_url}
                    onChange={handleChange}
                    placeholder="https://instagram.com/..."
                    className="w-full p-4 rounded-2xl border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none bg-gray-50 dark:bg-gray-900 focus:bg-white dark:focus:bg-gray-800 text-gray-900 dark:text-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-500 dark:text-gray-400 mb-2 flex items-center gap-2">
                    <Music2 className="w-4 h-4 text-blue-500 dark:text-blue-400" />
                    TikTok URL
                  </label>
                  <input 
                    name="tiktok_url"
                    value={formData.tiktok_url}
                    onChange={handleChange}
                    placeholder="https://tiktok.com/@..."
                    className="w-full p-4 rounded-2xl border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none bg-gray-50 dark:bg-gray-900 focus:bg-white dark:focus:bg-gray-800 text-gray-900 dark:text-gray-100"
                  />
                </div>
              </div>

              {/* Portfolio Media */}
              <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-sm border border-gray-200 dark:border-gray-700 space-y-6 transition-colors">
                <div className="flex justify-between items-center border-b border-gray-100 dark:border-gray-700 pb-2">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Portfolio Media</h3>
                  <div className="flex gap-2">
                    <label className="flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-xl text-xs font-bold cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-all">
                      <ImageIcon className="w-4 h-4" />
                      Add Image
                      <input type="file" className="hidden" accept="image/*" onChange={(e) => handlePortfolioUpload(e, 'image')} />
                    </label>
                    <label className="flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-xl text-xs font-bold cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-all">
                      <Video className="w-4 h-4" />
                      Add Video
                      <input type="file" className="hidden" accept="video/*" onChange={(e) => handlePortfolioUpload(e, 'video')} />
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {formData.portfolio_media.map((item) => (
                    <div key={item.id} className={`relative aspect-video rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-900 group ${item.is_featured ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}>
                      {item.type === 'image' ? (
                        <img src={item.url} alt="Portfolio" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      ) : (
                        <div className="w-full h-full relative">
                          <video src={item.url} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                            <Play className="w-8 h-8 text-white fill-current" />
                          </div>
                        </div>
                      )}
                      <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                        <button 
                          type="button"
                          onClick={() => toggleFeatured(item.id)}
                          className={`p-2 rounded-lg backdrop-blur-sm transition-all ${item.is_featured ? 'bg-blue-500 dark:bg-blue-400 text-white dark:text-gray-900' : 'bg-white/80 dark:bg-gray-800/80 text-gray-500 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-700'}`}
                          title={item.is_featured ? 'Featured' : 'Mark as Featured'}
                        >
                          <CheckCircle2 className="w-4 h-4" />
                        </button>
                        <button 
                          type="button"
                          onClick={() => handleDeleteMedia(item.id)}
                          className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      {item.is_featured && (
                        <div className="absolute bottom-2 left-2 px-2 py-1 bg-blue-500 dark:bg-blue-400 text-white dark:text-gray-900 text-[10px] font-black uppercase tracking-widest rounded-md">
                          Featured
                        </div>
                      )}
                    </div>
                  ))}
                  {formData.portfolio_media.length === 0 && (
                    <div className="col-span-full py-12 text-center bg-gray-50 dark:bg-gray-900/50 rounded-3xl border border-dashed border-gray-200 dark:border-gray-700">
                      <p className="text-gray-500 dark:text-gray-400 text-sm">No media uploaded. Add up to 3 images and 3 videos.</p>
                    </div>
                  )}
                </div>
                <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium">
                  * Max 3 images (5MB each) and 3 videos (50MB each).
                </p>
              </div>

              <div className="sticky bottom-24 lg:bottom-8 left-0 right-0 flex justify-end pt-4 pointer-events-none">
                <button 
                  type="submit"
                  disabled={isLoading}
                  className="pointer-events-auto px-10 py-4 rounded-2xl bg-blue-500 dark:bg-blue-400 text-white dark:text-gray-900 font-black hover:bg-blue-600 dark:hover:bg-blue-500 transition-all shadow-2xl shadow-blue-500/30 flex items-center justify-center gap-3 active:scale-95 disabled:opacity-70 border-2 border-white/20 dark:border-gray-800/20 backdrop-blur-sm"
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
