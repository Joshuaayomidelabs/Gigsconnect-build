import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Loader2, ArrowRight, X, Plus } from 'lucide-react';
import { supabase } from '../services/supabaseClient';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';

const POPULAR_SKILLS = [
  "Singer",
  "Songwriter",
  "Music Producer",
  "Instrumentalist",
  "DJ",
  "Sound Engineer",
  "Photographer",
  "Videographer",
  "Video Editor",
  "Graphic Designer",
  "UI/UX Designer",
  "Motion Designer",
  "Web Developer",
  "Mobile App Developer",
  "Content Creator",
  "Influencer",
  "Copywriter",
  "Writer",
  "Social Media Manager",
  "Digital Marketer",
  "Makeup Artist",
  "Fashion Designer",
  "Event Planner",
  "MC",
  "Voice Over Artist",
  "Animator",
  "Podcaster",
  "Actor",
  "Model"
];

const normalizeSkill = (skill: string) => {
  const trimmed = skill.trim().replace(/\s+/g, ' ');
  if (!trimmed) return '';
  const match = POPULAR_SKILLS.find(s => s.toLowerCase() === trimmed.toLowerCase());
  if (match) return match;
  return trimmed.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
};

const CreatorSkills: React.FC = () => {
  const { user, refreshProfile } = useAuth();
  const navigate = useNavigate();
  
  const [skills, setSkills] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState('');
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [focusedIndex, setFocusedIndex] = useState(-1);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchExistingSkills = async () => {
      if (!user) return;
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('skills')
          .eq('id', user.id)
          .single();
          
        if (error) throw error;
        
        if (data?.skills && Array.isArray(data.skills)) {
          setSkills(data.skills);
        }
      } catch (err: any) {
        console.error('Error fetching skills:', err);
        toast.error('Failed to load your skills');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchExistingSkills();
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node) &&
          inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const suggestions = useMemo(() => {
    if (!inputValue.trim()) return [];
    const query = inputValue.trim().toLowerCase();
    return POPULAR_SKILLS.filter(s => 
      s.toLowerCase().includes(query) && 
      !skills.some(existing => existing.toLowerCase() === s.toLowerCase())
    );
  }, [inputValue, skills]);

  const addSkill = (skillToAdd: string) => {
    if (skills.length >= 10) {
      toast.error('Maximum of 10 skills allowed.');
      setInputValue('');
      return;
    }
    
    const normalized = normalizeSkill(skillToAdd);
    if (!normalized) return;

    if (skills.some(s => s.toLowerCase() === normalized.toLowerCase())) {
      setInputValue('');
      return;
    }
    
    setSkills(prev => [...prev, normalized]);
    setInputValue('');
    setShowSuggestions(false);
    setFocusedIndex(-1);
    inputRef.current?.focus();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    setShowSuggestions(true);
    setFocusedIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      if (showSuggestions && focusedIndex >= 0 && focusedIndex < suggestions.length) {
        addSkill(suggestions[focusedIndex]);
      } else {
        addSkill(inputValue);
      }
    } else if (e.key === 'Tab' && inputValue.trim()) {
      e.preventDefault();
      if (showSuggestions && focusedIndex >= 0 && focusedIndex < suggestions.length) {
        addSkill(suggestions[focusedIndex]);
      } else {
        addSkill(inputValue);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (showSuggestions && suggestions.length > 0) {
        setFocusedIndex(prev => (prev < suggestions.length - 1 ? prev + 1 : prev));
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (showSuggestions && suggestions.length > 0) {
        setFocusedIndex(prev => (prev > 0 ? prev - 1 : 0));
      }
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
      setFocusedIndex(-1);
    }
  };

  const removeSkill = (indexToRemove: number) => {
    setSkills(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleSave = async (isSkipping: boolean = false) => {
    if (!user) return;
    
    setIsSaving(true);
    let finalSkills = [...skills];
    const trimmed = inputValue.trim();
    if (!isSkipping && trimmed && !finalSkills.some(s => s.toLowerCase() === trimmed.toLowerCase())) {
      if (finalSkills.length < 10) {
        finalSkills.push(normalizeSkill(trimmed));
        setInputValue("");
      }
    }
    
    // Normalize and remove duplicates
    const uniqueSkills: string[] = [];
    finalSkills.forEach(skill => {
      const norm = normalizeSkill(skill);
      if (norm && !uniqueSkills.some(s => s.toLowerCase() === norm.toLowerCase())) {
        uniqueSkills.push(norm);
      }
    });
    finalSkills = uniqueSkills;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ skills: finalSkills })
        .eq('id', user.id);
        
      if (error) throw error;
      
      await refreshProfile();
      navigate('/creator-location', { replace: true });
    } catch (err: any) {
      console.error('Error saving skills:', err);
      toast.error('Failed to save your skills.');
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
            className="text-center mb-12"
          >
            <h1 className="text-3xl sm:text-4xl font-bold text-brand-black dark:text-brand-white mb-4 tracking-tight">
              Add your skills
            </h1>
            <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto text-lg">
              Type a skill and press Enter or comma to add it. This helps clients find you based on your specific expertise.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-brand-dark-card rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100 dark:border-gray-800 mb-10"
          >
            <div className="relative mb-6" ref={suggestionsRef}>
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                onFocus={() => setShowSuggestions(true)}
                placeholder="Type a skill and press Enter..."
                className="w-full p-4 pr-16 rounded-2xl border border-gray-200 dark:border-gray-700 bg-brand-gray dark:bg-brand-black/50 text-brand-black dark:text-brand-white focus:ring-2 focus:ring-brand-purple focus:border-transparent outline-none transition-all"
                aria-label="Add a skill"
              />
              <button 
                onClick={() => addSkill(inputValue)}
                disabled={!inputValue.trim()}
                className="absolute right-2 top-2 bottom-2 aspect-square rounded-xl bg-brand-purple text-white flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-brand-purple-hover transition-colors"
                aria-label="Add skill"
              >
                <Plus className="w-5 h-5" />
              </button>
              
              <AnimatePresence>
                {showSuggestions && suggestions.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute z-50 top-full left-0 right-0 mt-2 bg-white dark:bg-[#1A1A1E] border border-gray-100 dark:border-gray-800 rounded-xl shadow-xl overflow-hidden max-h-60 overflow-y-auto"
                  >
                    {suggestions.map((suggestion, index) => (
                      <div
                        key={suggestion}
                        onClick={() => addSkill(suggestion)}
                        onMouseEnter={() => setFocusedIndex(index)}
                        className={`px-4 py-3 cursor-pointer transition-colors ${
                          index === focusedIndex 
                            ? 'bg-brand-purple/10 text-brand-purple dark:bg-brand-purple/20' 
                            : 'text-brand-black dark:text-brand-white hover:bg-gray-50 dark:hover:bg-brand-black'
                        }`}
                        role="option"
                        aria-selected={index === focusedIndex}
                      >
                        {suggestion}
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 font-medium">
              Add up to 10 skills to help others discover you. ({skills.length}/10)
            </p>
            
            <div className="min-h-[100px] p-4 rounded-2xl bg-gray-50 dark:bg-black/20 border border-gray-100 dark:border-gray-800/50 mb-8">
              {skills.length === 0 ? (
                <div className="h-full flex items-center justify-center text-gray-400 dark:text-gray-500 italic text-sm py-6">
                  No skills added yet. Type above to add some!
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
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-purple/10 dark:bg-brand-purple/20 text-brand-purple font-medium text-sm border border-brand-purple/20"
                      >
                        {skill}
                        <button 
                          onClick={() => removeSkill(index)}
                          className="p-0.5 rounded-full hover:bg-brand-purple/20 transition-colors"
                          title="Remove skill"
                          aria-label={`Remove ${skill}`}
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>

            <div>
              <h3 className="text-sm font-bold text-brand-black dark:text-brand-white mb-4">Popular Skills</h3>
              <div className="flex flex-wrap gap-2">
                {POPULAR_SKILLS.map((skill) => {
                  const isSelected = skills.some(s => s.toLowerCase() === skill.toLowerCase());
                  if (isSelected) return null;
                  return (
                    <button
                      key={skill}
                      onClick={() => addSkill(skill)}
                      className="px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-600 dark:text-gray-300 hover:border-brand-purple hover:text-brand-purple dark:hover:border-brand-purple dark:hover:text-brand-purple transition-colors bg-white dark:bg-brand-black shadow-sm"
                    >
                      + {skill}
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
              onClick={() => handleSave(true)}
              disabled={isSaving}
              className="px-8 py-4 rounded-xl font-bold text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all w-full sm:w-auto"
            >
              Skip for now
            </button>
            
            <button
              onClick={() => handleSave(false)}
              disabled={isSaving || (skills.length === 0 && !inputValue.trim())}
              className="flex items-center justify-center gap-2 px-10 py-4 rounded-xl font-bold text-lg transition-all shadow-lg bg-brand-purple text-white hover:bg-brand-purple-hover hover:shadow-brand-purple/20 hover:-translate-y-1 w-full sm:w-auto min-w-[200px] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
            >
              {isSaving ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <>
                  Continue
                  <ArrowRight className="w-5 h-5" />
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
