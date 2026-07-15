import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Check, Loader2, ArrowRight } from 'lucide-react';
import { supabase } from '../services/supabaseClient';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';

interface Category {
  id: string;
  name: string;
}

interface Skill {
  id: string;
  name: string;
  category_id: string;
}

const CreatorSkills: React.FC = () => {
  const { user, refreshProfile } = useAuth();
  const navigate = useNavigate();
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchDependencies = async () => {
      if (!user) return;
      try {
        // 1. Fetch user's selected categories
        const { data: profileCats, error: pcErr } = await supabase
          .from('profile_categories')
          .select('category_id')
          .eq('profile_id', user.id);
          
        if (pcErr) throw pcErr;
        
        const categoryIds = profileCats?.map(pc => pc.category_id) || [];
        if (categoryIds.length === 0) {
          toast.error("Please select categories first.");
          navigate('/creator-categories');
          return;
        }

        // 2. Fetch category details for headers
        const { data: catData, error: catErr } = await supabase
          .from('creator_categories')
          .select('id, name')
          .in('id', categoryIds);
          
        if (catErr) throw catErr;
        setCategories(catData || []);

        // 3. Fetch skills belonging to these categories
        const { data: skillsData, error: skillsErr } = await supabase
          .from('skills')
          .select('id, name, category_id')
          .in('category_id', categoryIds)
          .order('name');
          
        if (skillsErr) throw skillsErr;
        setSkills(skillsData || []);
        
        // 4. Fetch already selected skills (if going back/editing)
        const { data: existingSkills, error: esErr } = await supabase
          .from('profile_skills')
          .select('skill_id')
          .eq('profile_id', user.id);
          
        if (!esErr && existingSkills) {
          setSelectedIds(new Set(existingSkills.map(s => s.skill_id)));
        }

      } catch (err: any) {
        console.error('Error fetching skills data:', err);
        toast.error('Failed to load skills');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDependencies();
  }, [user, navigate]);

  const toggleSkill = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleContinue = async () => {
    if (!user) return;
    
    setIsSaving(true);
    try {
      const inserts = Array.from(selectedIds).map(skillId => ({
        profile_id: user.id,
        skill_id: skillId
      }));
      
      // Delete existing to avoid duplicates
      await supabase
        .from('profile_skills')
        .delete()
        .eq('profile_id', user.id);
        
      if (inserts.length > 0) {
        const { error } = await supabase
          .from('profile_skills')
          .insert(inserts);
          
        if (error) throw error;
      }
      
      // Navigate to location setup after skills are selected
      await refreshProfile();
      navigate('/creator-location', { replace: true });
    } catch (err: any) {
      console.error('Error saving skills:', err);
      toast.error('Failed to save your selections.');
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
        <div className="w-full max-w-4xl">
          <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl sm:text-4xl font-bold text-brand-black dark:text-brand-white mb-4 tracking-tight">
            Select your skills
          </h1>
          <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto text-lg">
            Choose the specific skills you offer. This will highlight your expertise on your profile.
          </p>
        </motion.div>

        <div className="space-y-10 mb-12">
          {categories.map((category, catIndex) => {
            const categorySkills = skills.filter(s => s.category_id === category.id);
            if (categorySkills.length === 0) return null;

            return (
              <motion.div 
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: catIndex * 0.1 }}
                className="bg-white dark:bg-brand-dark-card rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100 dark:border-gray-800"
              >
                <h3 className="text-xl font-bold text-brand-black dark:text-brand-white mb-6 border-b border-gray-100 dark:border-gray-800 pb-4">
                  {category.name}
                </h3>
                <div className="flex flex-wrap gap-3">
                  {categorySkills.map((skill, index) => {
                    const isSelected = selectedIds.has(skill.id);
                    return (
                      <motion.button
                        key={skill.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: (catIndex * 0.1) + (index * 0.02) }}
                        onClick={() => toggleSkill(skill.id)}
                        className={`flex items-center gap-2 px-5 py-3 rounded-full text-sm font-medium transition-all duration-300 border-2 ${
                          isSelected 
                            ? 'bg-brand-purple text-white border-brand-purple shadow-md' 
                            : 'bg-transparent text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-brand-purple/50'
                        }`}
                      >
                        {skill.name}
                        {isSelected && <Check className="w-4 h-4" />}
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex justify-center"
        >
          <button
            onClick={handleContinue}
            disabled={isSaving}
            className="flex items-center justify-center gap-2 px-10 py-4 rounded-xl font-bold text-lg transition-all shadow-lg bg-brand-purple text-white hover:bg-brand-purple-hover hover:shadow-brand-purple/20 hover:-translate-y-1 w-full sm:w-auto"
          >
            {isSaving ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              <>
                Complete Profile
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
