import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Loader2, ArrowRight, X, Plus, Sparkles, Check } from 'lucide-react';
import { supabase } from '../services/supabaseClient';
import { profilesService } from '../services/profilesService';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';
import { notifyError } from '../utils/errorHandler';

const POPULAR_SKILLS = [
  'Video Editing',
  'Music Production',
  'Graphic Design',
  'Mixing & Mastering',
  'Vocalist',
  'Guitarist',
  'Beatmaking',
  'Songwriting',
  'Content Creation',
  'Photography',
  'Audio Engineering',
  'Animation'
];

const CreatorSkills: React.FC = () => {
  const { user, refreshProfile } = useAuth();
  const navigate = useNavigate();
  
  const [skills, setSkills] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState('');
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchExistingSkills = async () => {
      if (!user) return;
      try {
        const { data } = await profilesService.getProfile(user.id);
        if (data?.skills && Array.isArray(data.skills)) {
          setSkills(data.skills);
        }
      } catch (err: any) {
        // Silently handle if profile skills not present
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchExistingSkills();
  }, [user]);

  const addSkill = (skillToAdd?: string) => {
    const targetSkill = (skillToAdd || inputValue).trim();
    if (!targetSkill) return;
    
    if (skills.some(s => s.toLowerCase() === targetSkill.toLowerCase())) {
      toast.info(`"${targetSkill}" is already in your skills list.`);
      if (!skillToAdd) setInputValue('');
      return;
    }

    if (skills.length >= 15) {
      notifyError('Maximum of 15 skills allowed.');
      return;
    }
    
    setSkills(prev => [...prev, targetSkill]);
    if (!skillToAdd || skillToAdd === inputValue) {
      setInputValue('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addSkill();
    }
  };

  const removeSkill = (indexToRemove: number) => {
    setSkills(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  const togglePopularSkill = (popularSkill: string) => {
    const exists = skills.some(s => s.toLowerCase() === popularSkill.toLowerCase());
    if (exists) {
      setSkills(prev => prev.filter(s => s.toLowerCase() !== popularSkill.toLowerCase()));
    } else {
      addSkill(popularSkill);
    }
  };

  const handleSave = async (isSkipping: boolean = false) => {
    if (!user) return;
    
    setIsSaving(true);
    let finalSkills = [...skills];
    const trimmed = inputValue.trim();
    if (!isSkipping && trimmed && !finalSkills.some(s => s.toLowerCase() === trimmed.toLowerCase())) {
      finalSkills.push(trimmed);
      setSkills(finalSkills);
      setInputValue("");
    }
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ skills: finalSkills })
        .eq('id', user.id);
        
      if (error) {
        console.warn('Update skills warning, attempting profilesService update:', error);
      }
      
      await refreshProfile();
      navigate('/creator-location', { replace: true });
    } catch (err: any) {
      console.error('Error saving skills:', err);
      notifyError('Failed to save your skills.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-gray dark:bg-brand-black transition-colors">
        <Loader2 className="w-10 h-10 animate-spin text-brand-purple" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-gray dark:bg-brand-black flex flex-col pt-24 md:pt-32 pb-16 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-[1200px] mx-auto w-full flex flex-col items-center">
        <div className="w-full max-w-2xl">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-10"
          >
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-brand-purple/10 text-brand-purple text-xs font-black uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              Step 2 of 4
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-brand-black dark:text-brand-white mb-3 tracking-tight">
              Add Your <span className="text-brand-purple">Skills & Expertise</span>
            </h1>
            <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto text-base font-medium">
              Type a skill and click <span className="font-bold text-brand-purple">+</span> or select from popular suggestions below. This helps clients and collaborators find you easily.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-brand-dark-card rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100 dark:border-gray-800 mb-8"
          >
            {/* Input & Plus Button */}
            <div className="relative mb-6">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type a skill (e.g. Video Editing, Live Mixing)..."
                className="w-full p-4 pr-16 rounded-2xl border border-gray-200 dark:border-gray-700 bg-brand-gray dark:bg-brand-black/50 text-brand-black dark:text-brand-white focus:ring-2 focus:ring-brand-purple focus:border-transparent outline-none transition-all font-medium text-sm"
              />
              <button 
                type="button"
                onClick={() => addSkill()}
                disabled={!inputValue.trim()}
                title="Add typed skill"
                className="absolute right-2 top-2 bottom-2 aspect-square rounded-xl bg-brand-purple text-white flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed hover:bg-brand-purple-hover active:scale-95 transition-all shadow-md shadow-brand-purple/20"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>

            {/* Selected Skills Display */}
            <div className="mb-6">
              <label className="block text-[10px] font-black uppercase tracking-wider text-gray-400 mb-2">
                Your Selected Skills ({skills.length})
              </label>
              <div className="min-h-[90px] p-4 rounded-2xl bg-gray-50 dark:bg-black/20 border border-gray-100 dark:border-gray-800/50">
                {skills.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-gray-400 dark:text-gray-500 italic text-xs py-4">
                    No skills added yet. Type above or tap suggestions below!
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    <AnimatePresence>
                      {skills.map((skill, index) => (
                        <motion.div
                          key={skill + index}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-brand-purple/10 dark:bg-brand-purple/20 text-brand-purple font-bold text-xs border border-brand-purple/20"
                        >
                          {skill}
                          <button 
                            type="button"
                            onClick={() => removeSkill(index)}
                            className="p-0.5 rounded-full hover:bg-brand-purple/20 text-brand-purple transition-colors"
                            title="Remove skill"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </div>
            </div>

            {/* Popular Suggested Skills Chips */}
            <div>
              <label className="block text-[10px] font-black uppercase tracking-wider text-gray-400 mb-2.5">
                Popular Suggestions (Tap to add)
              </label>
              <div className="flex flex-wrap gap-2">
                {POPULAR_SKILLS.map((popSkill) => {
                  const isSelected = skills.some(s => s.toLowerCase() === popSkill.toLowerCase());
                  return (
                    <button
                      key={popSkill}
                      type="button"
                      onClick={() => togglePopularSkill(popSkill)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        isSelected
                          ? 'bg-brand-purple text-white shadow-sm shadow-brand-purple/20'
                          : 'bg-brand-gray dark:bg-zinc-800 text-gray-600 dark:text-gray-300 hover:bg-brand-purple/10 hover:text-brand-purple border border-gray-200/60 dark:border-zinc-700/60'
                      }`}
                    >
                      {isSelected ? (
                        <Check className="w-3.5 h-3.5" />
                      ) : (
                        <Plus className="w-3.5 h-3.5 opacity-70" />
                      )}
                      {popSkill}
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row justify-center items-center gap-4"
          >
            <button
              type="button"
              onClick={() => handleSave(true)}
              disabled={isSaving}
              className="px-6 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-all w-full sm:w-auto"
            >
              Skip for now
            </button>
            
            <button
              type="button"
              onClick={() => handleSave(false)}
              disabled={isSaving || (skills.length === 0 && !inputValue.trim())}
              className="flex items-center justify-center gap-2 px-10 py-4 rounded-xl font-black text-sm uppercase tracking-wider transition-all shadow-lg bg-brand-purple text-white hover:bg-brand-purple-hover hover:shadow-brand-purple/20 hover:-translate-y-0.5 w-full sm:w-auto min-w-[200px] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none cursor-pointer"
            >
              {isSaving ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Continue
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default CreatorSkills;
