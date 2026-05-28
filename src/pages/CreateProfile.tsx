import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, 
  Briefcase, 
  MapPin, 
  CheckCircle, 
  ArrowRight, 
  ArrowLeft, 
  Camera, 
  Music, 
  Globe,
  Loader2
} from 'lucide-react';
import { supabase } from '../services/supabaseClient';
import { profilesService } from '../services/profilesService';
import { GIG_CATEGORIES } from '../utils/constants';
import imageCompression from 'browser-image-compression';

const STEPS = [
  { id: 'basics', title: 'The Basics', icon: <User className="w-5 h-5" /> },
  { id: 'craft', title: 'Your Craft', icon: <Music className="w-5 h-5" /> },
  { id: 'location', title: 'Where & How', icon: <MapPin className="w-5 h-5" /> }
];

const CreateProfile: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [uploadStatus, setUploadStatus] = useState('');
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

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data } = await profilesService.getProfile(session.user.id);
        if (data) {
          setFormData(prev => ({
            ...prev,
            full_name: data.full_name || '',
            username: data.username || '',
            bio: data.bio || '',
            phone: data.phone || '',
            role: data.role || '',
            city: data.city || '',
            country: data.country || '',
            skills: data.skills || [],
            avatar_url: data.avatar_url || ''
          }));
        }
      }
      setIsFetching(false);
    };
    fetchProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const toggleSkill = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }));
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('Image must be under 5MB');
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
      
      // Notify other components (like Header) to refresh
      window.dispatchEvent(new CustomEvent('profile-updated'));
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsLoading(false);
      setUploadStatus('');
    }
  };

  const nextStep = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      handleSubmit();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const { error } = await profilesService.updateProfile(formData);
      if (error) throw error;
      
      // Notify other components (like Header) to refresh
      window.dispatchEvent(new CustomEvent('profile-updated'));
      
      navigate('/overview');
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-brand-gray dark:bg-brand-black">
        <Loader2 className="w-10 h-10 animate-spin text-brand-purple" />
      </div>
    );
  }

  const progress = ((currentStep + 1) / STEPS.length) * 100;

  return (
    <div className="bg-brand-white dark:bg-brand-black min-h-screen pt-main pb-32 px-4 sm:px-6 lg:px-8 transition-colors duration-500 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[600px] h-[600px] bg-brand-purple/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-[600px] h-[600px] bg-brand-purple/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-2xl mx-auto relative z-10">
        {/* Progress Header */}
        <div className="mb-12">
          <div className="flex justify-between items-end mb-6">
            <div>
              <h1 className="text-4xl font-black text-brand-black dark:text-brand-white tracking-tighter leading-none mb-3">
                Complete Your <span className="text-brand-purple">Profile</span>
              </h1>
              <p className="text-gray-500 dark:text-gray-400 font-bold text-sm uppercase tracking-widest">Step {currentStep + 1} of {STEPS.length}: {STEPS[currentStep].title}</p>
            </div>
            <div className="text-right">
              <span className="text-3xl font-black text-brand-purple">{Math.round(progress)}%</span>
            </div>
          </div>
          <div className="h-4 w-full bg-brand-gray dark:bg-brand-black rounded-full overflow-hidden border border-brand-gray dark:border-brand-black shadow-inner p-1">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              className="h-full bg-brand-purple rounded-full shadow-[0_0_20px_rgba(124,58,237,0.4)]"
            />
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-brand-white dark:bg-brand-dark-card rounded-[3rem] p-8 sm:p-12 shadow-2xl shadow-brand-purple/5 border border-brand-gray dark:border-brand-black relative overflow-hidden transition-all duration-500">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="space-y-10"
            >
              {currentStep === 0 && (
                <div className="space-y-10">
                  <div className="flex flex-col items-center gap-8">
                    <div className="relative group">
                      <div className="w-40 h-40 rounded-[2.5rem] bg-brand-gray dark:bg-brand-black border-8 border-brand-white dark:border-brand-dark-card shadow-2xl overflow-hidden flex items-center justify-center transition-transform duration-500 group-hover:scale-105">
                        {formData.avatar_url ? (
                          <img 
                            src={formData.avatar_url} 
                            alt="Profile" 
                            className="w-full h-full object-cover object-center" 
                            referrerPolicy="no-referrer" 
                          />
                        ) : (
                          <User className="w-16 h-16 text-gray-300 dark:text-gray-600" />
                        )}
                      </div>
                      <label className="absolute -bottom-2 -right-2 p-4 bg-brand-purple text-brand-white rounded-2xl shadow-2xl cursor-pointer hover:bg-brand-purple-hover transition-all active:scale-90 border-4 border-brand-white dark:border-brand-dark-card">
                        <Camera className="w-6 h-6" />
                        <input type="file" className="hidden" accept="image/*" onChange={handleAvatarUpload} />
                      </label>
                    </div>
                    <div className="text-center">
                      <h3 className="text-2xl font-black text-brand-black dark:text-brand-white tracking-tight">Add a Profile Photo</h3>
                      <p className="text-gray-500 dark:text-gray-400 font-medium mt-1">Help others recognize you in the community. Max size 5MB.</p>
                      {uploadStatus && (
                        <p className="text-[14px] text-brand-purple mt-2 flex items-center justify-center gap-2">
                           <Loader2 className="w-4 h-4 animate-spin" />
                           {uploadStatus}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-8">
                    <div>
                      <label className="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-3">Display Name</label>
                      <input 
                        name="full_name"
                        value={formData.full_name}
                        onChange={handleChange}
                        placeholder="e.g. John 'The Bass' Doe"
                        className="w-full p-5 rounded-2xl border border-brand-gray dark:border-brand-black focus:ring-2 focus:ring-brand-purple focus:border-transparent transition-all outline-none bg-brand-gray dark:bg-brand-black focus:bg-brand-white dark:focus:bg-brand-dark-card text-brand-black dark:text-brand-white font-bold text-lg placeholder:text-gray-300 dark:placeholder:text-gray-700"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-3">Bio</label>
                      <textarea 
                        name="bio"
                        value={formData.bio}
                        onChange={handleChange}
                        rows={4}
                        placeholder="Tell the community about your musical journey..."
                        className="w-full p-5 rounded-2xl border border-brand-gray dark:border-brand-black focus:ring-2 focus:ring-brand-purple focus:border-transparent transition-all outline-none bg-brand-gray dark:bg-brand-black focus:bg-brand-white dark:focus:bg-brand-dark-card text-brand-black dark:text-brand-white font-bold text-lg placeholder:text-gray-300 dark:placeholder:text-gray-700 resize-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 1 && (
                <div className="space-y-10">
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-4 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-brand-purple/10 flex items-center justify-center text-brand-purple border border-brand-purple/20">
                        <Briefcase className="w-4 h-4" />
                      </div>
                      What is your primary role?
                    </label>
                    <input 
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      placeholder="e.g. Session Drummer, Music Producer"
                      className="w-full p-5 rounded-2xl border border-brand-gray dark:border-brand-black focus:ring-2 focus:ring-brand-purple focus:border-transparent transition-all outline-none bg-brand-gray dark:bg-brand-black focus:bg-brand-white dark:focus:bg-brand-dark-card text-brand-black dark:text-brand-white font-bold text-lg placeholder:text-gray-300 dark:placeholder:text-gray-700"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-6">Select your top skills</label>
                    <div className="flex flex-wrap gap-3">
                      {['Mixing', 'Mastering', 'Live Performance', 'Songwriting', 'Vocalist', 'Guitarist', 'Pianist', 'Drummer', 'Bassist', 'Producer'].map(skill => (
                        <button
                          key={skill}
                          type="button"
                          onClick={() => toggleSkill(skill)}
                          className={`px-6 py-3.5 rounded-2xl text-xs font-black transition-all border tracking-tight ${
                            formData.skills.includes(skill)
                              ? 'bg-brand-purple text-brand-white border-brand-purple shadow-xl shadow-brand-purple/20 scale-105'
                              : 'bg-brand-gray dark:bg-brand-black text-gray-500 dark:text-gray-400 border-brand-gray dark:border-brand-black hover:border-brand-purple/50'
                          }`}
                        >
                          {skill}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-10">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    <div>
                      <label className="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-3 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-brand-purple/10 flex items-center justify-center text-brand-purple border border-brand-purple/20">
                          <Globe className="w-4 h-4" />
                        </div>
                        Country
                      </label>
                      <input 
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                        placeholder="e.g. Nigeria"
                        className="w-full p-5 rounded-2xl border border-brand-gray dark:border-brand-black focus:ring-2 focus:ring-brand-purple focus:border-transparent transition-all outline-none bg-brand-gray dark:bg-brand-black focus:bg-brand-white dark:focus:bg-brand-dark-card text-brand-black dark:text-brand-white font-bold text-lg placeholder:text-gray-300 dark:placeholder:text-gray-700"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-3 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-brand-purple/10 flex items-center justify-center text-brand-purple border border-brand-purple/20">
                          <MapPin className="w-4 h-4" />
                        </div>
                        City
                      </label>
                      <input 
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        placeholder="e.g. Lagos"
                        className="w-full p-5 rounded-2xl border border-brand-gray dark:border-brand-black focus:ring-2 focus:ring-brand-purple focus:border-transparent transition-all outline-none bg-brand-gray dark:bg-brand-black focus:bg-brand-white dark:focus:bg-brand-dark-card text-brand-black dark:text-brand-white font-bold text-lg placeholder:text-gray-300 dark:placeholder:text-gray-700"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-3">Phone Number</label>
                    <input 
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+234 ..."
                      className="w-full p-5 rounded-2xl border border-brand-gray dark:border-brand-black focus:ring-2 focus:ring-brand-purple focus:border-transparent transition-all outline-none bg-brand-gray dark:bg-brand-black focus:bg-brand-white dark:focus:bg-brand-dark-card text-brand-black dark:text-brand-white font-bold text-lg placeholder:text-gray-300 dark:placeholder:text-gray-700"
                    />
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="mt-16 flex items-center justify-between gap-6">
            <button
              onClick={prevStep}
              disabled={currentStep === 0 || isLoading}
              className={`flex items-center gap-3 px-8 py-5 rounded-2xl font-black text-sm uppercase tracking-widest transition-all ${
                currentStep === 0 
                  ? 'opacity-0 pointer-events-none' 
                  : 'text-gray-400 dark:text-gray-500 hover:bg-brand-gray dark:hover:bg-brand-black'
              }`}
            >
              <ArrowLeft className="w-5 h-5" />
              Back
            </button>

            <button
              onClick={nextStep}
              disabled={isLoading}
              className="flex-1 sm:flex-none px-12 py-5 rounded-2xl bg-brand-purple text-brand-white font-black hover:bg-brand-purple-hover transition-all shadow-2xl shadow-brand-purple/30 flex items-center justify-center gap-4 active:scale-95 disabled:opacity-70 group"
            >
              {isLoading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <>
                  <span className="uppercase tracking-widest text-sm">{currentStep === STEPS.length - 1 ? 'Finish Setup' : 'Continue'}</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Skip Option */}
        <div className="mt-10 text-center">
          <button 
            onClick={() => navigate('/overview')}
            className="text-gray-400 dark:text-gray-500 font-black text-xs uppercase tracking-[0.2em] hover:text-brand-purple transition-colors"
          >
            Skip for now, I'll do this later
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateProfile;
