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

    try {
      setIsLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Login required');

      const publicUrl = await profilesService.uploadAvatar(session.user.id, file);
      setFormData(prev => ({ ...prev, avatar_url: publicUrl }));
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsLoading(false);
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
      navigate('/dashboard');
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-brand-gray">
        <Loader2 className="w-10 h-10 animate-spin text-brand-purple" />
      </div>
    );
  }

  const progress = ((currentStep + 1) / STEPS.length) * 100;

  return (
    <div className="bg-brand-gray min-h-screen pt-24 pb-32 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Progress Header */}
        <div className="mb-12">
          <div className="flex justify-between items-end mb-4">
            <div>
              <h1 className="text-3xl font-black text-brand-black tracking-tight">
                Complete Your <span className="text-brand-purple">Profile</span>
              </h1>
              <p className="text-brand-gray-dark font-medium">Step {currentStep + 1} of {STEPS.length}: {STEPS[currentStep].title}</p>
            </div>
            <div className="text-right">
              <span className="text-2xl font-black text-brand-purple">{Math.round(progress)}%</span>
            </div>
          </div>
          <div className="h-3 w-full bg-white rounded-full overflow-hidden border border-brand-purple-light/10 shadow-inner">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              className="h-full bg-brand-purple shadow-[0_0_15px_rgba(124,58,237,0.5)]"
            />
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-[2.5rem] p-8 sm:p-12 shadow-xl border border-brand-purple-light/10 relative overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              {currentStep === 0 && (
                <div className="space-y-8">
                  <div className="flex flex-col items-center gap-6">
                    <div className="relative group">
                      <div className="w-32 h-32 rounded-full bg-brand-gray border-4 border-white shadow-lg overflow-hidden flex items-center justify-center">
                        {formData.avatar_url ? (
                          <img src={formData.avatar_url} alt="Profile" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        ) : (
                          <User className="w-12 h-12 text-brand-gray-dark/30" />
                        )}
                      </div>
                      <label className="absolute bottom-0 right-0 p-3 bg-brand-purple text-white rounded-full shadow-xl cursor-pointer hover:bg-brand-purple-dark transition-all active:scale-90 border-2 border-white">
                        <Camera className="w-5 h-5" />
                        <input type="file" className="hidden" accept="image/*" onChange={handleAvatarUpload} />
                      </label>
                    </div>
                    <div className="text-center">
                      <h3 className="text-xl font-black text-brand-black">Add a Profile Photo</h3>
                      <p className="text-sm text-brand-gray-dark font-medium">Help others recognize you in the community.</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-bold text-brand-black mb-2">Display Name</label>
                      <input 
                        name="full_name"
                        value={formData.full_name}
                        onChange={handleChange}
                        placeholder="e.g. John 'The Bass' Doe"
                        className="w-full p-4 rounded-2xl border border-brand-purple-light/20 focus:ring-2 focus:ring-brand-purple focus:border-transparent transition-all outline-none bg-brand-gray focus:bg-white text-brand-black font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-brand-black mb-2">Bio</label>
                      <textarea 
                        name="bio"
                        value={formData.bio}
                        onChange={handleChange}
                        rows={4}
                        placeholder="Tell the community about your musical journey..."
                        className="w-full p-4 rounded-2xl border border-brand-purple-light/20 focus:ring-2 focus:ring-brand-purple focus:border-transparent transition-all outline-none bg-brand-gray focus:bg-white text-brand-black font-medium resize-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 1 && (
                <div className="space-y-8">
                  <div>
                    <label className="block text-sm font-bold text-brand-black mb-4 flex items-center gap-2">
                      <Briefcase className="w-5 h-5 text-brand-purple" />
                      What is your primary role?
                    </label>
                    <input 
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      placeholder="e.g. Session Drummer, Music Producer"
                      className="w-full p-4 rounded-2xl border border-brand-purple-light/20 focus:ring-2 focus:ring-brand-purple focus:border-transparent transition-all outline-none bg-brand-gray focus:bg-white text-brand-black font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-brand-black mb-4">Select your top skills</label>
                    <div className="flex flex-wrap gap-2">
                      {['Mixing', 'Mastering', 'Live Performance', 'Songwriting', 'Vocalist', 'Guitarist', 'Pianist', 'Drummer', 'Bassist', 'Producer'].map(skill => (
                        <button
                          key={skill}
                          type="button"
                          onClick={() => toggleSkill(skill)}
                          className={`px-4 py-2 rounded-xl text-sm font-bold transition-all border ${
                            formData.skills.includes(skill)
                              ? 'bg-brand-purple text-white border-brand-purple shadow-md'
                              : 'bg-brand-gray text-brand-gray-dark border-brand-purple-light/10 hover:border-brand-purple/30'
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
                <div className="space-y-8">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-brand-black mb-2 flex items-center gap-2">
                        <Globe className="w-4 h-4 text-brand-purple" />
                        Country
                      </label>
                      <input 
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                        placeholder="e.g. Nigeria"
                        className="w-full p-4 rounded-2xl border border-brand-purple-light/20 focus:ring-2 focus:ring-brand-purple focus:border-transparent transition-all outline-none bg-brand-gray focus:bg-white text-brand-black font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-brand-black mb-2 flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-brand-purple" />
                        City
                      </label>
                      <input 
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        placeholder="e.g. Lagos"
                        className="w-full p-4 rounded-2xl border border-brand-purple-light/20 focus:ring-2 focus:ring-brand-purple focus:border-transparent transition-all outline-none bg-brand-gray focus:bg-white text-brand-black font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-brand-black mb-2">Phone Number</label>
                    <input 
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+234 ..."
                      className="w-full p-4 rounded-2xl border border-brand-purple-light/20 focus:ring-2 focus:ring-brand-purple focus:border-transparent transition-all outline-none bg-brand-gray focus:bg-white text-brand-black font-medium"
                    />
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="mt-12 flex items-center justify-between gap-4">
            <button
              onClick={prevStep}
              disabled={currentStep === 0 || isLoading}
              className={`flex items-center gap-2 px-6 py-4 rounded-2xl font-bold transition-all ${
                currentStep === 0 
                  ? 'opacity-0 pointer-events-none' 
                  : 'text-brand-gray-dark hover:bg-brand-gray'
              }`}
            >
              <ArrowLeft className="w-5 h-5" />
              Back
            </button>

            <button
              onClick={nextStep}
              disabled={isLoading}
              className="flex-1 sm:flex-none px-10 py-4 rounded-2xl bg-brand-purple text-white font-black hover:bg-brand-purple-dark transition-all shadow-xl shadow-brand-purple/20 flex items-center justify-center gap-3 active:scale-95 disabled:opacity-70"
            >
              {isLoading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <>
                  <span>{currentStep === STEPS.length - 1 ? 'Finish Setup' : 'Continue'}</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Skip Option */}
        <div className="mt-8 text-center">
          <button 
            onClick={() => navigate('/dashboard')}
            className="text-brand-gray-dark font-bold hover:text-brand-purple transition-colors"
          >
            Skip for now, I'll do this later
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateProfile;
