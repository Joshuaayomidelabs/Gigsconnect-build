import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  User, 
  Briefcase, 
  MapPin, 
  CheckCircle, 
  Camera, 
  Music, 
  Globe,
  Loader2,
  Sparkles,
  Phone,
  FileText,
  Sliders,
  Check
} from 'lucide-react';
import { supabase } from '../services/supabaseClient';
import { profilesService } from '../services/profilesService';
import { africanCountries, musicProfessions } from '../utils/locations';
import imageCompression from 'browser-image-compression';
import { toast } from 'sonner';

import { useAuth } from '../context/AuthContext';

const CreateProfile: React.FC = () => {
  const navigate = useNavigate();
  const { refreshProfile } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const isSubmittingRef = useRef(false);
  const [isFetching, setIsFetching] = useState(true);
  const [uploadStatus, setUploadStatus] = useState('');
  
  // Clean edit collapse states
  const [showEditor, setShowEditor] = useState(false);

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

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    let mounted = true;
    const fetchProfile = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          const { data } = await profilesService.getProfile(session.user.id);
          if (data && mounted) {
            setFormData(prev => ({
              ...prev,
              full_name: data.full_name || '',
              username: data.username || '',
              bio: data.bio || '',
              phone: data.phone || '',
              role: data.role || '',
              city: data.city || data.city_town || '',
              country: data.country || '',
              skills: data.skills || [],
              avatar_url: data.avatar_url || ''
            }));
          }
        }
      } catch (err) {
        console.error('Error fetching onboarding profile:', err);
      } finally {
        if (mounted) {
          setIsFetching(false);
        }
      }
    };
    fetchProfile();
    return () => {
      mounted = false;
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSkillsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const skills = e.target.value.split(',').map(s => s.trim()).filter(s => s !== '');
    setFormData(prev => ({ ...prev, skills }));
  };

  const toggleProfessionInSkills = (profession: string) => {
    setFormData(prev => {
      const skills = prev.skills.includes(profession)
        ? prev.skills.filter(s => s !== profession)
        : [...prev.skills, profession];
      return { ...prev, skills };
    });
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be under 5MB');
      return;
    }

    try {
      setIsLoading(true);
      setUploadStatus('optimizing image...');
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Login required');

      const options = {
        maxSizeMB: 0.8,
        maxWidthOrHeight: 1024,
        useWebWorker: true
      };
      
      const compressedFile = await imageCompression(file, options);
      setUploadStatus('uploading...');

      const publicUrl = await profilesService.uploadAvatar(session.user.id, compressedFile);
      setFormData(prev => ({ ...prev, avatar_url: publicUrl }));
      
      // Notify header and related elements
      window.dispatchEvent(new CustomEvent('profile-updated'));
      toast.success('Avatar updated successfully!');
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsLoading(false);
      setUploadStatus('');
    }
  };

  const handleSaveAndLaunch = async () => {
    if (!formData.full_name.trim()) {
      toast.error('Full Name is required');
      return;
    }
    if (!formData.username.trim()) {
      toast.error('Username handle is required');
      return;
    }

    if (isLoading || isSubmittingRef.current) return;
    isSubmittingRef.current = true;
    setIsLoading(true);

    try {
      // Server-side check if username is claimed by someone else
      const isTaken = await profilesService.isUsernameTaken(formData.username);
      
      // Fetch user session to ensure we are editing the right ID
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        // Double check username is indeed not claimed by another user
        const { data: existingUser } = await supabase
          .from('profiles')
          .select('id')
          .eq('username', formData.username.trim())
          .neq('id', session.user.id)
          .maybeSingle();

        if (existingUser) {
          toast.error('This username handle is already claimed by another musician.');
          setIsLoading(false);
          isSubmittingRef.current = false;
          return;
        }
      }

      // Sync and persist setup updates
      const { error } = await profilesService.updateProfile({
        full_name: formData.full_name,
        username: formData.username,
        bio: formData.bio,
        phone: formData.phone,
        role: formData.role || formData.skills[0] || 'Musician',
        city: formData.city,
        country: formData.country,
        skills: formData.skills,
        avatar_url: formData.avatar_url,
        onboarding_completed: true
      });

      if (error) throw error;
      
      await refreshProfile();
      window.dispatchEvent(new CustomEvent('profile-updated'));
      toast.success('Your space is officially live!');
      navigate('/creator-categories');
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Failed to save profile settings.');
    } finally {
      setIsLoading(false);
      isSubmittingRef.current = false;
    }
  };

  if (isFetching) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-brand-gray dark:bg-brand-black">
        <Loader2 className="w-10 h-10 animate-spin text-brand-purple" />
      </div>
    );
  }

  return (
    <div className="bg-brand-gray dark:bg-brand-black min-h-screen pt-24 md:pt-32 pb-32 px-4 sm:px-6 lg:px-8 transition-colors duration-500 relative">
      {/* Decorative ambient elements */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[600px] h-[600px] bg-brand-purple/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-[600px] h-[600px] bg-brand-purple/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-[1200px] mx-auto relative z-10 flex flex-col items-center">
        <div className="w-full max-w-2xl">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-brand-purple/10 text-brand-purple text-xs font-black uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            Registration Complete!
          </div>
          <h1 className="text-4xl font-black text-brand-black dark:text-brand-white tracking-tight">
            Review Your <span className="text-brand-purple">Musical Identity</span>
          </h1>
          <p className="text-gray-500 dark:text-gray-400 font-medium text-sm mt-1">
            We auto-populated your card using details from signup. Add a quick bio to complete your space.
          </p>
        </div>

        {/* Profile preview card */}
        <div className="bg-brand-white dark:bg-brand-dark-card rounded-[2.5rem] p-6 sm:p-8 shadow-xl border border-brand-purple/10 mb-8 overflow-hidden relative">
          <div className="absolute top-0 right-0 p-4">
            <span className="text-[10px] font-black uppercase tracking-wider bg-brand-purple/10 text-brand-purple px-2.5 py-1 rounded-md">
              LIVE PREVIEW
            </span>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start text-center sm:text-left mt-4 pb-6 border-b border-brand-gray dark:border-zinc-800">
            {/* Live Profile Circle Photo with camera overlay */}
            <div className="relative group flex-shrink-0">
              <div className="w-24 h-24 rounded-full bg-brand-gray dark:bg-brand-black overflow-hidden flex items-center justify-center border-4 border-brand-white dark:border-zinc-900 shadow-md">
                {formData.avatar_url ? (
                  <img 
                    src={formData.avatar_url} 
                    alt={formData.full_name} 
                    referrerPolicy="no-referrer" 
                    className="w-full h-full object-cover" 
                  />
                ) : (
                  <User className="w-10 h-10 text-gray-400 dark:text-gray-600" />
                )}
              </div>
              <label className="absolute bottom-0 right-0 p-1.5 bg-brand-purple text-white rounded-full shadow-md cursor-pointer hover:bg-brand-purple-hover active:scale-95 transition-all">
                <Camera className="w-3.5 h-3.5" />
                <input type="file" className="hidden" accept="image/*" onChange={handleAvatarUpload} />
              </label>
            </div>

            <div className="space-y-1">
              <h2 className="text-2xl font-black text-brand-black dark:text-brand-white tracking-tight">
                {formData.full_name || 'Anonymous Musician'}
              </h2>
              <p className="text-brand-purple font-bold text-sm">@{formData.username || 'username'}</p>
              
              <div className="flex flex-wrap justify-center sm:justify-start gap-4 text-xs font-bold text-gray-505 mt-2">
                <span className="flex items-center gap-1 bg-brand-gray dark:bg-brand-black px-2.5 py-1 rounded-md">
                  <Briefcase className="w-3.5 h-3.5 text-brand-purple" />
                  {formData.role || formData.skills[0] || 'Musician'}
                </span>
                {(formData.city || formData.country) && (
                  <span className="flex items-center gap-1 bg-brand-gray dark:bg-brand-black px-2.5 py-1 rounded-md">
                    <MapPin className="w-3.5 h-3.5 text-brand-purple" />
                    {[formData.city, formData.country].filter(Boolean).join(', ')}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="pt-6 space-y-5">
            {/* Bios Setup Area */}
            <div>
              <label className="block text-[10px] font-black text-gray-400 dark:text-gray-550 uppercase tracking-[0.15em] mb-2">
                Introduce Yourself (Bio) <span className="text-zinc-400 font-medium">(Optional)</span>
              </label>
              <textarea 
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows={3}
                placeholder="Tell bands or clients about your playing style, gig history, or equipment..."
                className="w-full p-4 rounded-xl border border-brand-gray dark:border-zinc-800 focus:ring-1 focus:ring-brand-purple focus:border-transparent transition-all outline-none bg-brand-gray dark:bg-brand-black focus:bg-white dark:focus:bg-brand-dark-card text-brand-black dark:text-brand-white font-medium text-sm placeholder:text-gray-400 resize-none"
              />
            </div>

            {/* Profession tags read state */}
            <div>
              <label className="block text-[10px] font-black text-gray-400 dark:text-gray-550 uppercase tracking-[0.15em] mb-2.5">
                My Specialties (Pills)
              </label>
              <div className="flex flex-wrap gap-1.5 p-3 rounded-xl bg-brand-gray dark:bg-brand-black text-xs border border-brand-purple/5">
                {formData.skills.map((skill, index) => (
                  <span 
                    key={index} 
                    className="px-2.5 py-1 bg-brand-purple/10 text-brand-purple border border-brand-purple/10 rounded-md text-[10px] font-black uppercase tracking-wider"
                  >
                    {skill}
                  </span>
                ))}
                {formData.skills.length === 0 && (
                  <span className="text-xs text-gray-400 italic">No skills specified yet.</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Option to toggle collapsible detailed editor */}
        <div className="mb-8">
          <button
            type="button"
            onClick={() => setShowEditor(!showEditor)}
            className="flex items-center gap-2 text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest hover:text-brand-purple transition-all outline-none"
          >
            <Sliders className="w-4 h-4 text-brand-purple animate-pulse" />
            {showEditor ? 'Hide Profile Details Editor' : 'Tweak Account Details (Name, Location, Username)'}
          </button>

          {showEditor && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-6 bg-brand-white dark:bg-brand-dark-card rounded-[2rem] border border-brand-purple/10 shadow-lg space-y-5"
            >
              <h3 className="text-sm font-black uppercase tracking-wider text-brand-black dark:text-brand-white">
                Edit Prefilled Details
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1.5">Display Name</label>
                  <input 
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleChange}
                    className="w-full p-3.5 rounded-xl border border-brand-gray dark:border-zinc-800 bg-brand-gray dark:bg-brand-black text-brand-black dark:text-brand-white text-sm outline-none focus:bg-white focus:ring-1 focus:ring-brand-purple"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1.5">Username Handle</label>
                  <input 
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className="w-full p-3.5 rounded-xl border border-brand-gray dark:border-zinc-800 bg-brand-gray dark:bg-brand-black text-brand-black dark:text-brand-white text-sm outline-none focus:bg-white focus:ring-1 focus:ring-brand-purple"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1.5">Primary Role</label>
                  <input 
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full p-3.5 rounded-xl border border-brand-gray dark:border-zinc-800 bg-brand-gray dark:bg-brand-black text-brand-black dark:text-brand-white text-sm outline-none focus:bg-white focus:ring-1 focus:ring-brand-purple"
                    placeholder="e.g. Bassist"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1.5">Phone Number</label>
                  <input 
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full p-3.5 rounded-xl border border-brand-gray dark:border-zinc-800 bg-brand-gray dark:bg-brand-black text-brand-black dark:text-brand-white text-sm outline-none focus:bg-white focus:ring-1 focus:ring-brand-purple"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1.5">Country</label>
                  <select 
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className="w-full p-3.5 rounded-xl border border-brand-gray dark:border-zinc-800 bg-brand-gray dark:bg-brand-black text-brand-black dark:text-brand-white text-sm outline-none focus:bg-white focus:ring-1 focus:ring-brand-purple"
                  >
                    <option value="">Select Country</option>
                    {africanCountries.map((c: any) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1.5">City / Town</label>
                  <input 
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full p-3.5 rounded-xl border border-brand-gray dark:border-zinc-800 bg-brand-gray dark:bg-brand-black text-brand-black dark:text-brand-white text-sm outline-none focus:bg-white focus:ring-1 focus:ring-brand-purple"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* CTA Launch actions */}
        <div className="flex flex-col gap-4">
          <button
            onClick={handleSaveAndLaunch}
            disabled={isLoading}
            className="w-full py-5 bg-brand-purple hover:bg-brand-purple-hover text-white text-sm font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-brand-purple/20 active:scale-[0.99] transition-all flex items-center justify-center gap-3 cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Launching My Profile...
              </>
            ) : (
              <>
                Lock It In & Launch Space 🚀
              </>
            )}
          </button>

          <button
            onClick={async () => {
              if (isLoading) return;
              setIsLoading(true);
              try {
                await profilesService.updateProfile({ onboarding_completed: true });
                await refreshProfile();
                window.dispatchEvent(new CustomEvent('profile-updated'));
                navigate('/creator-categories');
              } catch (err) {
                navigate('/creator-categories');
              } finally {
                setIsLoading(false);
              }
            }}
            disabled={isLoading}
            className="w-full py-4 text-gray-400 dark:text-gray-500 hover:text-brand-purple font-black text-xs uppercase tracking-[0.2em] transition-colors"
          >
            Skip for now &gt;
          </button>
        </div>
        </div>
      </div>
    </div>
  );
};

export default CreateProfile;
