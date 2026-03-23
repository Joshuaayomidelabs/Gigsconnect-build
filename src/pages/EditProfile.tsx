import React, { useState, useEffect } from 'react';
import { Camera, Loader2, Save, MapPin, User, Briefcase, Globe, Edit3, Phone, CheckCircle2, Facebook, Instagram, Music2, Video, Image as ImageIcon, Trash2, Plus, ExternalLink, Play, ShieldCheck, Upload, AlertCircle } from 'lucide-react';
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
    portfolio_media: [] as PortfolioItem[],
    verification_status: 'Unverified' as 'Unverified' | 'Pending' | 'Verified'
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
          portfolio_media: data.portfolio_media || [],
          verification_status: data.verification_status || 'Unverified'
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

  const handleVerificationUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Login required');

      await profilesService.uploadVerificationDoc(session.user.id, file);
      setFormData(prev => ({ ...prev, verification_status: 'Pending' }));
      setSuccessMessage('Verification document submitted!');
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
      <div className="flex items-center justify-center min-h-screen bg-brand-gray dark:bg-brand-black transition-colors">
        <Loader2 className="w-10 h-10 animate-spin text-brand-purple" />
      </div>
    );
  }

  return (
    <div className="pt-24 pb-32 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto min-h-screen bg-brand-gray dark:bg-brand-black transition-colors duration-500">
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
                <h1 className="text-4xl font-black text-brand-black dark:text-brand-white tracking-tight mb-2">My Profile</h1>
                <p className="text-gray-700 dark:text-gray-200 text-lg font-medium">This is how others see you on GigsConnect.</p>
              </div>
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-6 py-3 bg-brand-white dark:bg-brand-dark-card border-2 border-brand-gray dark:border-brand-black rounded-2xl text-brand-purple font-bold hover:bg-brand-purple/5 dark:hover:bg-brand-purple/10 transition-all active:scale-95 shadow-sm"
              >
                <Edit3 className="w-5 h-5" />
                Edit Profile
              </button>
            </section>

            {successMessage && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-4 bg-brand-purple/10 dark:bg-brand-purple/20 border border-brand-purple/10 dark:border-brand-purple/20 text-brand-purple rounded-2xl font-bold flex items-center gap-3"
              >
                <CheckCircle2 className="w-5 h-5" />
                {successMessage}
              </motion.div>
            )}

            <div className="bg-brand-white dark:bg-brand-dark-card rounded-[2.5rem] shadow-xl border border-brand-gray dark:border-brand-black overflow-hidden transition-colors">
              {/* Header/Cover Placeholder */}
              <div className="h-32 bg-gradient-to-r from-brand-purple to-brand-purple-dark opacity-10" />
              
              <div className="px-8 pb-8 -mt-16">
                <div className="flex flex-col sm:flex-row items-end gap-6 mb-8">
                  <div className="w-32 h-32 rounded-full bg-brand-white dark:bg-brand-dark-card p-1 shadow-xl">
                    <div className="w-full h-full rounded-full bg-brand-gray dark:bg-brand-black overflow-hidden flex items-center justify-center border-4 border-brand-white dark:border-brand-dark-card">
                      {formData.avatar_url ? (
                        <img src={formData.avatar_url} alt={formData.full_name} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-12 h-12 text-gray-400 dark:text-gray-600" />
                      )}
                    </div>
                  </div>
                  <div className="flex-grow pb-2">
                    <h2 className="text-3xl font-black text-brand-black dark:text-brand-white tracking-tight">{formData.full_name || 'Anonymous User'}</h2>
                    <p className="text-brand-purple font-bold">@{formData.username || 'username'}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                  <div className="lg:col-span-2 space-y-8">
                    <div>
                      <h3 className="text-xs font-black uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-4">About Me</h3>
                      <p className="text-brand-black dark:text-brand-white leading-relaxed whitespace-pre-wrap">
                        {formData.bio || "No bio provided yet. Tell the community about yourself!"}
                      </p>
                    </div>

                    <div>
                      <h3 className="text-xs font-black uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-4">Portfolio</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {formData.portfolio_media.length > 0 ? (
                          formData.portfolio_media.map((item) => (
                    <div key={item.id} className={`relative aspect-video rounded-2xl overflow-hidden bg-brand-gray dark:bg-brand-black group ${item.is_featured ? 'ring-2 ring-brand-purple ring-offset-2' : ''}`}>
                              {item.type === 'image' ? (
                                <img src={item.url} alt="Portfolio" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                              ) : (
                                <div className="w-full h-full relative">
                                  <video src={item.url} className="w-full h-full object-cover" />
                                  <div className="absolute inset-0 flex items-center justify-center bg-brand-black/20 group-hover:bg-brand-black/40 transition-all">
                                    <div className="w-12 h-12 rounded-full bg-brand-white/20 backdrop-blur-md flex items-center justify-center text-brand-white">
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
                                  className="p-2 bg-brand-white/80 dark:bg-brand-dark-card/80 backdrop-blur-sm rounded-lg hover:bg-brand-white dark:hover:bg-brand-dark-card"
                                >
                                  <ExternalLink className="w-4 h-4 text-brand-purple" />
                                </a>
                              </div>
                              {item.is_featured && (
                                <div className="absolute bottom-2 left-2 px-2 py-1 bg-brand-purple text-brand-white text-[10px] font-black uppercase tracking-widest rounded-md">
                                  Featured
                                </div>
                              )}
                            </div>
                          ))
                        ) : (
                          <div className="col-span-full py-8 text-center bg-brand-gray dark:bg-brand-black/50 rounded-3xl border border-dashed border-brand-gray dark:border-brand-black">
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
                            <span key={i} className="px-4 py-2 bg-brand-purple/10 dark:bg-brand-purple/20 text-brand-purple rounded-xl text-sm font-bold border border-brand-purple/10 dark:border-brand-purple/20">
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
                    <div className="bg-brand-gray dark:bg-brand-black/50 rounded-3xl p-6 space-y-4 border border-brand-gray dark:border-brand-black">
                      <h3 className="text-xs font-black uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-2">Details</h3>
                      
                      <div className="flex items-center gap-3 text-brand-black dark:text-brand-white">
                        <div className="w-8 h-8 rounded-lg bg-brand-white dark:bg-brand-dark-card flex items-center justify-center shadow-sm">
                          <Briefcase className="w-4 h-4 text-brand-purple" />
                        </div>
                        <div>
                          <p className="text-[10px] uppercase font-black text-gray-500 dark:text-gray-400 tracking-tighter">Role</p>
                          <p className="text-sm font-bold">{formData.role || 'Not specified'}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 text-brand-black dark:text-brand-white">
                        <div className="w-8 h-8 rounded-lg bg-brand-white dark:bg-brand-dark-card flex items-center justify-center shadow-sm">
                          <MapPin className="w-4 h-4 text-brand-purple" />
                        </div>
                        <div>
                          <p className="text-[10px] uppercase font-black text-gray-500 dark:text-gray-400 tracking-tighter">Location</p>
                          <p className="text-sm font-bold">
                            {formData.city && formData.country ? `${formData.city}, ${formData.country}` : (formData.city || formData.country || 'Not specified')}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 text-brand-black dark:text-brand-white">
                        <div className="w-8 h-8 rounded-lg bg-brand-white dark:bg-brand-dark-card flex items-center justify-center shadow-sm">
                          <Phone className="w-4 h-4 text-brand-purple" />
                        </div>
                        <div>
                          <p className="text-[10px] uppercase font-black text-gray-500 dark:text-gray-400 tracking-tighter">Contact</p>
                          <p className="text-sm font-bold">{formData.phone || 'Not specified'}</p>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-brand-gray dark:border-brand-black">
                        <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-4">Social Links</h3>
                        <div className="flex gap-3">
                          {formData.facebook_url && (
                            <a href={formData.facebook_url} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-brand-white dark:bg-brand-dark-card flex items-center justify-center shadow-sm hover:bg-brand-purple/5 dark:hover:bg-brand-purple/20 hover:text-brand-purple transition-all">
                              <Facebook className="w-5 h-5" />
                            </a>
                          )}
                          {formData.instagram_url && (
                            <a href={formData.instagram_url} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-brand-white dark:bg-brand-dark-card flex items-center justify-center shadow-sm hover:bg-brand-purple/5 dark:hover:bg-brand-purple/20 hover:text-brand-purple transition-all">
                              <Instagram className="w-5 h-5" />
                            </a>
                          )}
                          {formData.tiktok_url && (
                            <a href={formData.tiktok_url} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-brand-white dark:bg-brand-dark-card flex items-center justify-center shadow-sm hover:bg-brand-purple/5 dark:hover:bg-brand-purple/20 hover:text-brand-purple transition-all">
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
                <h1 className="text-4xl font-black text-brand-black dark:text-brand-white tracking-tight mb-4">Edit Profile</h1>
                <p className="text-gray-700 dark:text-gray-200 text-lg">Update your information to stand out.</p>
              </div>
              <button
                onClick={() => setIsEditing(false)}
                className="text-gray-500 dark:text-gray-400 font-bold hover:text-brand-purple transition-colors mb-4"
              >
                Cancel
              </button>
            </section>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Avatar Section */}
              <div className="bg-brand-white dark:bg-brand-dark-card rounded-3xl p-8 shadow-sm border border-brand-gray dark:border-brand-black flex flex-col items-center sm:flex-row gap-8 transition-colors">
                <div className="relative group">
                  <div className="w-32 h-32 rounded-full bg-brand-gray dark:bg-brand-black border-4 border-brand-white dark:border-brand-dark-card shadow-md overflow-hidden flex items-center justify-center">
                    {formData.avatar_url ? (
                      <img src={formData.avatar_url} alt="Profile" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-12 h-12 text-gray-400 dark:text-gray-600" />
                    )}
                  </div>
                  <label className="absolute bottom-0 right-0 p-2 bg-brand-purple text-brand-white rounded-full shadow-lg cursor-pointer hover:bg-brand-purple-hover transition-all active:scale-90">
                    <Camera className="w-5 h-5" />
                    <input type="file" className="hidden" accept="image/*" onChange={handleAvatarUpload} />
                  </label>
                </div>
                <div className="text-center sm:text-left">
                  <h3 className="text-xl font-bold text-brand-black dark:text-brand-white mb-1">Profile Photo</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Upload a clear photo of yourself. Max size 1MB.</p>
                </div>
              </div>

              {/* Verification Section */}
              <div className="bg-brand-white dark:bg-brand-dark-card rounded-3xl p-8 shadow-sm border border-brand-gray dark:border-brand-black transition-colors">
                <div className="flex items-center gap-3 mb-6">
                  <ShieldCheck className="w-6 h-6 text-brand-purple" />
                  <h3 className="text-xl font-bold text-brand-black dark:text-brand-white">Identity Verification</h3>
                </div>

                <div className="flex flex-col md:flex-row items-center gap-8">
                  <div className="flex-grow space-y-4">
                    <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                      Verify your identity to build trust within the GigsConnect community. Verified users get a badge on their profile and are more likely to be hired.
                    </p>
                    
                    <div className="flex items-center gap-4">
                      <div className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest border ${
                        formData.verification_status === 'Verified' 
                          ? 'bg-brand-purple/10 dark:bg-brand-purple/20 text-brand-purple border-brand-purple/10 dark:border-brand-purple/20' 
                          : formData.verification_status === 'Pending'
                          ? 'bg-brand-purple/5 dark:bg-brand-purple/10 text-brand-purple/70 border-brand-purple/10 dark:border-brand-purple/20'
                          : 'bg-brand-gray dark:bg-brand-black/50 text-gray-500 dark:text-gray-400 border-brand-gray dark:border-brand-black'
                      }`}>
                        Status: {formData.verification_status}
                      </div>
                      
                      {formData.verification_status === 'Verified' && (
                        <div className="flex items-center gap-1.5 text-brand-purple font-bold text-sm">
                          <CheckCircle2 className="w-4 h-4" />
                          Verified
                        </div>
                      )}
                    </div>
                  </div>

                  {formData.verification_status === 'Unverified' && (
                    <div className="w-full md:w-auto">
                      <label className="flex flex-col items-center justify-center w-full md:w-64 h-32 border-2 border-dashed border-brand-gray dark:border-brand-black rounded-2xl cursor-pointer hover:bg-brand-purple/5 dark:hover:bg-brand-purple/10 hover:border-brand-purple/30 dark:hover:border-brand-purple/40 transition-all group">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload className="w-8 h-8 text-gray-400 group-hover:text-brand-purple transition-colors mb-2" />
                          <p className="text-xs font-bold text-gray-500 dark:text-gray-400">Upload ID Document</p>
                          <p className="text-[10px] text-gray-400 mt-1">PDF, JPG or PNG (Max 10MB)</p>
                        </div>
                        <input type="file" className="hidden" accept=".pdf,image/*" onChange={handleVerificationUpload} />
                      </label>
                    </div>
                  )}

                  {formData.verification_status === 'Pending' && (
                    <div className="w-full md:w-64 p-6 bg-brand-purple/5 dark:bg-brand-purple/10 rounded-2xl border border-brand-purple/10 dark:border-brand-purple/20 text-center">
                      <AlertCircle className="w-8 h-8 text-brand-purple/70 mx-auto mb-2" />
                      <p className="text-xs font-bold text-brand-purple">Verification Pending</p>
                      <p className="text-[10px] text-brand-purple/70 mt-1">Our team is reviewing your document. This usually takes 24-48 hours.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Basic Info */}
              <div className="bg-brand-white dark:bg-brand-dark-card rounded-3xl p-8 shadow-sm border border-brand-gray dark:border-brand-black grid grid-cols-1 md:grid-cols-2 gap-6 transition-colors">
                <div className="md:col-span-2">
                  <h3 className="text-lg font-bold text-brand-black dark:text-brand-white mb-4 border-b border-brand-gray dark:border-brand-black pb-2">Basic Information</h3>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-500 dark:text-gray-400 mb-2">Full Name</label>
                  <input 
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleChange}
                    className="w-full p-4 rounded-2xl border border-brand-gray dark:border-brand-black focus:ring-2 focus:ring-brand-purple focus:border-transparent transition-all outline-none bg-brand-gray dark:bg-brand-black focus:bg-brand-white dark:focus:bg-brand-dark-card text-brand-black dark:text-brand-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-500 dark:text-gray-400 mb-2">Username</label>
                  <input 
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className="w-full p-4 rounded-2xl border border-brand-gray dark:border-brand-black focus:ring-2 focus:ring-brand-purple focus:border-transparent transition-all outline-none bg-brand-gray dark:bg-brand-black focus:bg-brand-white dark:focus:bg-brand-dark-card text-brand-black dark:text-brand-white"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-500 dark:text-gray-400 mb-2">Bio</label>
                  <textarea 
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    rows={4}
                    className="w-full p-4 rounded-2xl border border-brand-gray dark:border-brand-black focus:ring-2 focus:ring-brand-purple focus:border-transparent transition-all outline-none bg-brand-gray dark:bg-brand-black focus:bg-brand-white dark:focus:bg-brand-dark-card resize-none text-brand-black dark:text-brand-white"
                  />
                </div>
              </div>

              {/* Professional Info */}
              <div className="bg-brand-white dark:bg-brand-dark-card rounded-3xl p-8 shadow-sm border border-brand-gray dark:border-brand-black grid grid-cols-1 md:grid-cols-2 gap-6 transition-colors">
                <div className="md:col-span-2">
                  <h3 className="text-lg font-bold text-brand-black dark:text-brand-white mb-4 border-b border-brand-gray dark:border-brand-black pb-2">Professional Details</h3>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-500 dark:text-gray-400 mb-2 flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-brand-purple" />
                    Primary Role
                  </label>
                  <input 
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    placeholder="e.g. Bassist, Producer"
                    className="w-full p-4 rounded-2xl border border-brand-gray dark:border-brand-black focus:ring-2 focus:ring-brand-purple focus:border-transparent transition-all outline-none bg-brand-gray dark:bg-brand-black focus:bg-brand-white dark:focus:bg-brand-dark-card text-brand-black dark:text-brand-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-500 dark:text-gray-400 mb-2">Skills (comma separated)</label>
                  <input 
                    value={formData.skills.join(', ')}
                    onChange={handleSkillsChange}
                    placeholder="e.g. Slap Bass, Mixing, Logic Pro"
                    className="w-full p-4 rounded-2xl border border-brand-gray dark:border-brand-black focus:ring-2 focus:ring-brand-purple focus:border-transparent transition-all outline-none bg-brand-gray dark:bg-brand-black focus:bg-brand-white dark:focus:bg-brand-dark-card text-brand-black dark:text-brand-white"
                  />
                </div>
              </div>

              {/* Location Info */}
              <div className="bg-brand-white dark:bg-brand-dark-card rounded-3xl p-8 shadow-sm border border-brand-gray dark:border-brand-black grid grid-cols-1 md:grid-cols-2 gap-6 transition-colors">
                <div className="md:col-span-2">
                  <h3 className="text-lg font-bold text-brand-black dark:text-brand-white mb-4 border-b border-brand-gray dark:border-brand-black pb-2">Location & Contact</h3>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-500 dark:text-gray-400 mb-2 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-brand-purple" />
                    City
                  </label>
                  <input 
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full p-4 rounded-2xl border border-brand-gray dark:border-brand-black focus:ring-2 focus:ring-brand-purple focus:border-transparent transition-all outline-none bg-brand-gray dark:bg-brand-black focus:bg-brand-white dark:focus:bg-brand-dark-card text-brand-black dark:text-brand-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-500 dark:text-gray-400 mb-2 flex items-center gap-2">
                    <Globe className="w-4 h-4 text-brand-purple" />
                    Country
                  </label>
                  <input 
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className="w-full p-4 rounded-2xl border border-brand-gray dark:border-brand-black focus:ring-2 focus:ring-brand-purple focus:border-transparent transition-all outline-none bg-brand-gray dark:bg-brand-black focus:bg-brand-white dark:focus:bg-brand-dark-card text-brand-black dark:text-brand-white"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-500 dark:text-gray-400 mb-2">Phone Number</label>
                  <input 
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full p-4 rounded-2xl border border-brand-gray dark:border-brand-black focus:ring-2 focus:ring-brand-purple focus:border-transparent transition-all outline-none bg-brand-gray dark:bg-brand-black focus:bg-brand-white dark:focus:bg-brand-dark-card text-brand-black dark:text-brand-white"
                  />
                </div>
              </div>

              {/* Social Links */}
              <div className="bg-brand-white dark:bg-brand-dark-card rounded-3xl p-8 shadow-sm border border-brand-gray dark:border-brand-black grid grid-cols-1 md:grid-cols-3 gap-6 transition-colors">
                <div className="md:col-span-3">
                  <h3 className="text-lg font-bold text-brand-black dark:text-brand-white mb-4 border-b border-brand-gray dark:border-brand-black pb-2">Social Media Links</h3>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-500 dark:text-gray-400 mb-2 flex items-center gap-2">
                    <Facebook className="w-4 h-4 text-brand-purple" />
                    Facebook URL
                  </label>
                  <input 
                    name="facebook_url"
                    value={formData.facebook_url}
                    onChange={handleChange}
                    placeholder="https://facebook.com/..."
                    className="w-full p-4 rounded-2xl border border-brand-gray dark:border-brand-black focus:ring-2 focus:ring-brand-purple focus:border-transparent transition-all outline-none bg-brand-gray dark:bg-brand-black focus:bg-brand-white dark:focus:bg-brand-dark-card text-brand-black dark:text-brand-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-500 dark:text-gray-400 mb-2 flex items-center gap-2">
                    <Instagram className="w-4 h-4 text-brand-purple" />
                    Instagram URL
                  </label>
                  <input 
                    name="instagram_url"
                    value={formData.instagram_url}
                    onChange={handleChange}
                    placeholder="https://instagram.com/..."
                    className="w-full p-4 rounded-2xl border border-brand-gray dark:border-brand-black focus:ring-2 focus:ring-brand-purple focus:border-transparent transition-all outline-none bg-brand-gray dark:bg-brand-black focus:bg-brand-white dark:focus:bg-brand-dark-card text-brand-black dark:text-brand-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-500 dark:text-gray-400 mb-2 flex items-center gap-2">
                    <Music2 className="w-4 h-4 text-brand-purple" />
                    TikTok URL
                  </label>
                  <input 
                    name="tiktok_url"
                    value={formData.tiktok_url}
                    onChange={handleChange}
                    placeholder="https://tiktok.com/@..."
                    className="w-full p-4 rounded-2xl border border-brand-gray dark:border-brand-black focus:ring-2 focus:ring-brand-purple focus:border-transparent transition-all outline-none bg-brand-gray dark:bg-brand-black focus:bg-brand-white dark:focus:bg-brand-dark-card text-brand-black dark:text-brand-white"
                  />
                </div>
              </div>

              {/* Portfolio Media */}
              <div className="bg-brand-white dark:bg-brand-dark-card rounded-3xl p-8 shadow-sm border border-brand-gray dark:border-brand-black space-y-6 transition-colors">
                <div className="flex justify-between items-center border-b border-brand-gray dark:border-brand-black pb-2">
                  <h3 className="text-lg font-bold text-brand-black dark:text-brand-white">Portfolio Media</h3>
                  <div className="flex gap-2">
                    <label className="flex items-center gap-2 px-4 py-2 bg-brand-purple/10 dark:bg-brand-purple/20 text-brand-purple rounded-xl text-xs font-bold cursor-pointer hover:bg-brand-purple/20 dark:hover:bg-brand-purple/30 transition-all">
                      <ImageIcon className="w-4 h-4" />
                      Add Image
                      <input type="file" className="hidden" accept="image/*" onChange={(e) => handlePortfolioUpload(e, 'image')} />
                    </label>
                    <label className="flex items-center gap-2 px-4 py-2 bg-brand-purple/10 dark:bg-brand-purple/20 text-brand-purple rounded-xl text-xs font-bold cursor-pointer hover:bg-brand-purple/20 dark:hover:bg-brand-purple/30 transition-all">
                      <Video className="w-4 h-4" />
                      Add Video
                      <input type="file" className="hidden" accept="video/*" onChange={(e) => handlePortfolioUpload(e, 'video')} />
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {formData.portfolio_media.map((item) => (
                    <div key={item.id} className={`relative aspect-video rounded-2xl overflow-hidden bg-brand-gray dark:bg-brand-black group ${item.is_featured ? 'ring-2 ring-brand-purple ring-offset-2' : ''}`}>
                      {item.type === 'image' ? (
                        <img src={item.url} alt="Portfolio" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      ) : (
                        <div className="w-full h-full relative">
                          <video src={item.url} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 flex items-center justify-center bg-brand-black/20">
                            <Play className="w-8 h-8 text-brand-white fill-current" />
                          </div>
                        </div>
                      )}
                      <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                        <button 
                          type="button"
                          onClick={() => toggleFeatured(item.id)}
                          className={`p-2 rounded-lg backdrop-blur-sm transition-all ${item.is_featured ? 'bg-brand-purple text-brand-white' : 'bg-brand-white/80 dark:bg-brand-dark-card/80 text-gray-500 dark:text-gray-400 hover:bg-brand-white dark:hover:bg-brand-dark-card'}`}
                          title={item.is_featured ? 'Featured' : 'Mark as Featured'}
                        >
                          <CheckCircle2 className="w-4 h-4" />
                        </button>
                        <button 
                          type="button"
                          onClick={() => handleDeleteMedia(item.id)}
                          className="p-2 bg-red-500 text-brand-white rounded-lg hover:bg-red-600 transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      {item.is_featured && (
                        <div className="absolute bottom-2 left-2 px-2 py-1 bg-brand-purple text-brand-white text-[10px] font-black uppercase tracking-widest rounded-md">
                          Featured
                        </div>
                      )}
                    </div>
                  ))}
                  {formData.portfolio_media.length === 0 && (
                    <div className="col-span-full py-12 text-center bg-brand-gray dark:bg-brand-black/50 rounded-3xl border border-dashed border-brand-gray dark:border-brand-black">
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
                  className="pointer-events-auto px-10 py-4 rounded-2xl bg-brand-purple text-brand-white font-black hover:bg-brand-purple-hover transition-all shadow-2xl shadow-brand-purple/30 flex items-center justify-center gap-3 active:scale-95 disabled:opacity-70 border-2 border-brand-white/20 dark:border-brand-black/20 backdrop-blur-sm"
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
