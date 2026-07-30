import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Camera, 
  User, 
  FileText, 
  Briefcase, 
  MapPin, 
  Check, 
  ChevronRight, 
  X, 
  ArrowRight,
  TrendingUp,
  Loader2,
  Trash2
} from 'lucide-react';
import { profilesService } from '../services/profilesService';
import { africanCountries, musicProfessions } from '../utils/locations';
import imageCompression from 'browser-image-compression';
import { toast } from 'sonner';
import { handleError, notifyError } from '../utils/errorHandler';

interface OnboardingPromptProps {
  profile: any;
  onRefresh: () => void;
}

export const OnboardingPrompt: React.FC<OnboardingPromptProps> = ({ profile, onRefresh }) => {
  const [activeSegment, setActiveSegment] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [bioText, setBioText] = useState(profile?.bio || '');
  const [selectedRole, setSelectedRole] = useState(profile?.role || '');
  const [clientCity, setClientCity] = useState(profile?.city || profile?.city_town || '');
  const [clientCountry, setClientCountry] = useState(profile?.country || '');
  const [selectedSkills, setSelectedSkills] = useState<string[]>(profile?.skills || []);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dismissedSteps, setDismissedSteps] = useState<string[]>([]);

  // Calculate fields dynamically
  const hasAvatar = !!profile?.avatar_url;
  const hasBio = !!profile?.bio && profile.bio.trim().length > 5;
  const hasRole = !!profile?.role && profile.role !== 'Musician' && profile.role !== '';
  const hasLocation = !!(profile?.city || profile?.city_town) && !!profile?.country;

  // Dynamically load dismissed steps from localStorage
  useEffect(() => {
    if (profile?.id) {
      const stored = localStorage.getItem(`dismissed_onboarding_steps_${profile.id}`);
      if (stored) {
        setDismissedSteps(JSON.parse(stored));
      }
    }
  }, [profile?.id]);

  const handleDismissStep = (stepKey: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const nextDismissed = [...dismissedSteps, stepKey];
    setDismissedSteps(nextDismissed);
    if (profile?.id) {
      localStorage.setItem(`dismissed_onboarding_steps_${profile.id}`, JSON.stringify(nextDismissed));
    }
    toast.info('Step hidden. You can update this anytime via Edit Profile!');
  };

  const handleSkipAll = () => {
    if (profile?.id) {
      localStorage.setItem(`onboarding_completed_${profile.id}`, 'true');
      localStorage.setItem(`onboarding_progress_${profile.id}`, '100');
    }
    
    setIsSubmitting(true);
    profilesService.updateProfile({
      onboarding_completed: true,
      onboarding_progress: 100
    }).then(() => {
      onRefresh();
      toast.success('Onboarding skipped! Have fun exploring.');
    }).catch(err => {
      console.error(err);
    }).finally(() => {
      setIsSubmitting(false);
    });
  };

  // Profile completion math
  let progress = 20; // 20% for signup
  if (hasAvatar) progress += 20;
  if (hasBio) progress += 20;
  if (hasRole) progress += 20;
  if (hasLocation) progress += 20;

  // Filter tasks to show
  const tasks = [
    {
      key: 'avatar',
      title: 'Add an Profile Photo',
      desc: 'Let other bandmates identify you at first glance.',
      complete: hasAvatar,
      icon: <Camera className="w-4 h-4 text-brand-purple" />
    },
    {
      key: 'bio',
      title: 'Tell Us Your Story',
      desc: 'Introduce your sound, gig experience, or gear.',
      complete: hasBio,
      icon: <FileText className="w-4 h-4 text-brand-purple" />
    },
    {
      key: 'role',
      title: 'Define Your Specialties',
      desc: 'What is your direct musical role or tags?',
      complete: hasRole,
      icon: <Briefcase className="w-4 h-4 text-brand-purple" />
    },
    {
      key: 'location',
      title: 'Pin Your Location',
      desc: 'Filter local live gigs and travel distance.',
      complete: hasLocation,
      icon: <MapPin className="w-4 h-4 text-brand-purple" />
    }
  ];

  const pendingTasks = tasks.filter(t => !t.complete && !dismissedSteps.includes(t.key));

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      notifyError('Image must be under 5MB');
      return;
    }

    try {
      setIsUploading(true);
      const options = {
        maxSizeMB: 0.8,
        maxWidthOrHeight: 1024,
        useWebWorker: true
      };
      
      const compressedFile = await imageCompression(file, options);
      const publicUrl = await profilesService.uploadAvatar(profile.id, compressedFile);

      // Re-calculate the next progress
      const nextProgress = progress + (hasAvatar ? 0 : 20);
      const isDone = nextProgress === 100;

      const { error } = await profilesService.updateProfile({
        avatar_url: publicUrl,
        onboarding_progress: nextProgress,
        onboarding_completed: isDone
      });

      if (error) throw error;
      
      window.dispatchEvent(new CustomEvent('profile-updated'));
      toast.success('Looking sharp! Photo uploaded.');
      setActiveSegment(null);
      onRefresh();
    } catch (err: any) {
      handleError(err, "Operation Error");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSaveBio = async () => {
    if (bioText.trim().length <= 5) {
      notifyError('Please enter a slightly longer bio (at least 6 characters).');
      return;
    }

    try {
      setIsSubmitting(true);
      const nextProgress = progress + (hasBio ? 0 : 20);
      const isDone = nextProgress === 100;

      const { error } = await profilesService.updateProfile({
        bio: bioText.trim(),
        onboarding_progress: nextProgress,
        onboarding_completed: isDone
      });

      if (error) throw error;

      window.dispatchEvent(new CustomEvent('profile-updated'));
      toast.success('Bio saved successfully!');
      setActiveSegment(null);
      onRefresh();
    } catch (err: any) {
      handleError(err, "Operation Error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveRoleAndSkills = async () => {
    if (!selectedRole) {
      notifyError('Please select your primary musical role.');
      return;
    }

    try {
      setIsSubmitting(true);
      const nextProgress = progress + (hasRole ? 0 : 20);
      const isDone = nextProgress === 100;

      const { error } = await profilesService.updateProfile({
        role: selectedRole,
        skills: selectedSkills,
        onboarding_progress: nextProgress,
        onboarding_completed: isDone
      });

      if (error) throw error;

      window.dispatchEvent(new CustomEvent('profile-updated'));
      toast.success('Role and specialized tags saved!');
      setActiveSegment(null);
      onRefresh();
    } catch (err: any) {
      handleError(err, "Operation Error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveLocation = async () => {
    if (!clientCountry || !clientCity.trim()) {
      notifyError('Country and City/Town are required.');
      return;
    }

    try {
      setIsSubmitting(true);
      const nextProgress = progress + (hasLocation ? 0 : 20);
      const isDone = nextProgress === 100;

      const { error } = await profilesService.updateProfile({
        country: clientCountry,
        city: clientCity.trim(),
        onboarding_progress: nextProgress,
        onboarding_completed: isDone
      });

      if (error) throw error;

      window.dispatchEvent(new CustomEvent('profile-updated'));
      toast.success('Location pin is live!');
      setActiveSegment(null);
      onRefresh();
    } catch (err: any) {
      handleError(err, "Operation Error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleTag = (tag: string) => {
    setSelectedSkills(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  // If completed or all remaining profiles tasks are dismissed, don't show the setup panel
  if (progress === 100 || pendingTasks.length === 0) {
    return null;
  }

  return (
    <div className="bg-brand-white dark:bg-brand-dark-card rounded-[2.5rem] p-5 sm:p-6 shadow-md border border-brand-purple/10 mb-6 relative overflow-hidden transition-colors">
      
      {/* ProgressBar */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-black uppercase tracking-wider bg-brand-purple/10 text-brand-purple px-2 py-0.5 rounded-md">
              Progressive Profile
            </span>
            <span className="text-xs text-brand-purple font-black">
              {progress}%
            </span>
          </div>
          <h3 className="text-lg font-black text-brand-black dark:text-brand-white tracking-tight mt-1">
            Build Your Musical Card
          </h3>
        </div>
        
        <button 
          onClick={handleSkipAll}
          className="text-[10px] font-black text-gray-400 hover:text-brand-purple uppercase tracking-widest transition-colors"
        >
          Skip All
        </button>
      </div>

      <div className="w-full bg-gray-100 dark:bg-zinc-800 h-2.5 rounded-full overflow-hidden mb-5">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          className="h-full bg-gradient-to-r from-brand-purple to-indigo-500 rounded-full"
        />
      </div>

      <AnimatePresence mode="wait">
        {activeSegment === null ? (
          <motion.div 
            key="list"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-2.5"
          >
            {pendingTasks.map((task) => (
              <div 
                key={task.key}
                onClick={() => setActiveSegment(task.key)}
                className="group flex items-center justify-between p-3.5 rounded-2xl bg-brand-gray dark:bg-brand-black/40 hover:bg-brand-purple/5 border border-transparent hover:border-brand-purple/10 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-brand-white dark:bg-brand-dark-card flex items-center justify-center border border-brand-purple/10 shadow-sm">
                    {task.icon}
                  </div>
                  <div className="min-w-0 text-left">
                    <span className="text-sm font-black text-brand-black dark:text-brand-white leading-tight block">
                      {task.title}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 truncate block mt-0.5">
                      {task.desc}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <button 
                    onClick={(e) => handleDismissStep(task.key, e)}
                    className="p-1 px-1.5 hover:bg-brand-purple/10 rounded-lg text-gray-400 hover:text-brand-purple transition-colors text-[10px] font-bold uppercase tracking-wider"
                    title="Skip task"
                  >
                    Skip
                  </button>
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key={activeSegment}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="p-4 bg-brand-gray dark:bg-brand-black/30 border border-brand-purple/10 rounded-2xl relative text-left"
          >
            <button 
              onClick={() => setActiveSegment(null)}
              className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-150 text-gray-400 hover:text-brand-black transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {activeSegment === 'avatar' && (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Camera className="w-5 h-5 text-brand-purple" />
                  <h4 className="text-sm font-black uppercase tracking-wider text-brand-black dark:text-brand-white">
                    Add a profile photo
                  </h4>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Musicians with photos get 5x more gig responses and applications.
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-white dark:bg-brand-dark-card border border-gray-200 dark:border-zinc-800 flex items-center justify-center overflow-hidden">
                    {profile?.avatar_url ? (
                      <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-6 h-6 text-gray-400" />
                    )}
                  </div>
                  <label className="px-4 py-2 bg-[#6C3BFF] text-white hover:bg-[#5b30db] rounded-xl text-xs font-black uppercase tracking-wider shadow-sm cursor-pointer transition-colors">
                    {isUploading ? 'Uploading...' : 'Choose Picture'}
                    <input type="file" className="hidden" accept="image/*" onChange={handleAvatarUpload} disabled={isUploading} />
                  </label>
                </div>
              </div>
            )}

            {activeSegment === 'bio' && (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-brand-purple" />
                  <h4 className="text-sm font-black uppercase tracking-wider text-brand-black dark:text-brand-white">
                    Introduce Your Sound
                  </h4>
                </div>
                <textarea 
                  value={bioText}
                  onChange={(e) => setBioText(e.target.value)}
                  placeholder="e.g. Afrobeats guitarist with touring experience. Session specialist. High-energy solos."
                  rows={3}
                  className="w-full p-3 rounded-xl bg-white dark:bg-brand-dark-card border border-brand-purple/10 text-xs text-brand-black dark:text-brand-white focus:outline-none focus:ring-1 focus:ring-brand-purple resize-none"
                />
                <div className="flex gap-2.5 justify-end">
                  <button 
                    onClick={() => setActiveSegment(null)}
                    className="px-3.5 py-1.5 text-xs text-gray-400 hover:text-gray-600 font-bold"
                  >
                    Back
                  </button>
                  <button 
                    onClick={handleSaveBio}
                    disabled={isSubmitting}
                    className="px-4 py-1.5 bg-[#6C3BFF] hover:bg-[#5b30db] text-white rounded-lg text-xs font-black uppercase tracking-wider"
                  >
                    {isSubmitting ? 'Saving...' : 'Save Bio'}
                  </button>
                </div>
              </div>
            )}

            {activeSegment === 'role' && (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Briefcase className="w-5 h-5 text-brand-purple" />
                  <h4 className="text-sm font-black uppercase tracking-wider text-brand-black dark:text-brand-white">
                    Define Specialties
                  </h4>
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider text-[#9CA3AF] mb-1">
                    Primary Role
                  </label>
                  <select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    className="w-full p-2.5 rounded-lg bg-white dark:bg-brand-dark-card border border-brand-purple/10 text-xs text-brand-black dark:text-brand-white outline-none focus:ring-1 focus:ring-brand-purple"
                  >
                    <option value="">Select Role</option>
                    <option value="Bassist">Bassist</option>
                    <option value="Guitarist">Guitarist</option>
                    <option value="Vocalist">Vocalist</option>
                    <option value="Keyboardist">Keyboardist</option>
                    <option value="Drummer">Drummer</option>
                    <option value="Music Producer">Music Producer</option>
                    <option value="Session Musician">Session Musician</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider text-[#9CA3AF] mb-1.5">
                    Musical Specialties Tags
                  </label>
                  <div className="flex flex-wrap gap-1 bg-white dark:bg-brand-dark-card p-2 rounded-lg border border-brand-purple/10 max-h-24 overflow-y-auto">
                    {musicProfessions.slice(0, 16).map(tag => {
                      const active = selectedSkills.includes(tag);
                      return (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => toggleTag(tag)}
                          className={`px-2 py-1 rounded text-[10px] font-bold ${
                            active 
                              ? 'bg-brand-purple text-white' 
                              : 'bg-brand-gray dark:bg-zinc-800 text-gray-500'
                          }`}
                        >
                          {tag}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex gap-2.5 justify-end pt-2">
                  <button 
                    onClick={() => setActiveSegment(null)}
                    className="px-3.5 py-1.5 text-xs text-gray-400 hover:text-gray-600 font-bold"
                  >
                    Back
                  </button>
                  <button 
                    onClick={handleSaveRoleAndSkills}
                    disabled={isSubmitting}
                    className="px-4 py-1.5 bg-[#6C3BFF] hover:bg-[#5b30db] text-white rounded-lg text-xs font-black uppercase tracking-wider"
                  >
                    {isSubmitting ? 'Saving...' : 'Save Specialties'}
                  </button>
                </div>
              </div>
            )}

            {activeSegment === 'location' && (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-brand-purple" />
                  <h4 className="text-sm font-black uppercase tracking-wider text-brand-black dark:text-brand-white">
                    Pin Location
                  </h4>
                </div>
                
                <div className="grid grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-wider text-[#9CA3AF] mb-1">Country</label>
                    <select
                      value={clientCountry}
                      onChange={(e) => setClientCountry(e.target.value)}
                      className="w-full p-2.5 rounded-lg bg-white dark:bg-brand-dark-card border border-brand-purple/10 text-xs text-brand-black dark:text-brand-white outline-none focus:ring-1 focus:ring-brand-purple"
                    >
                      <option value="">Select Country</option>
                      {africanCountries.map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-wider text-[#9CA3AF] mb-1">City / Town</label>
                    <input
                      type="text"
                      value={clientCity}
                      onChange={(e) => setClientCity(e.target.value)}
                      placeholder="e.g. Lagos"
                      className="w-full p-2.5 rounded-lg bg-white dark:bg-brand-dark-card border border-brand-purple/10 text-xs text-brand-black dark:text-brand-white outline-none focus:ring-1 focus:ring-brand-purple"
                    />
                  </div>
                </div>

                <div className="flex gap-2.5 justify-end">
                  <button 
                    onClick={() => setActiveSegment(null)}
                    className="px-3.5 py-1.5 text-xs text-gray-400 hover:text-gray-600 font-bold"
                  >
                    Back
                  </button>
                  <button 
                    onClick={handleSaveLocation}
                    disabled={isSubmitting}
                    className="px-4 py-1.5 bg-[#6C3BFF] hover:bg-[#5b30db] text-white rounded-lg text-xs font-black uppercase tracking-wider"
                  >
                    {isSubmitting ? 'Saving...' : 'Pin Location'}
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
