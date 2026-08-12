import { SEO } from '../components/SEO';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Check, Loader2, ArrowRight, Grid, Camera, Music, Video, PenTool, MonitorPlay, Shirt, Calendar, Code, Search } from 'lucide-react';
import { supabase } from '../services/supabaseClient';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';
import { notifyError } from '../utils/errorHandler';


interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
}

const getIconForCategory = (iconName: string, className: string = "w-8 h-8") => {
  const props = { className };
  switch (iconName?.toLowerCase()) {
    case 'camera': return <Camera {...props} />;
    case 'music': return <Music {...props} />;
    case 'video': return <Video {...props} />;
    case 'pentool': return <PenTool {...props} />;
    case 'monitorplay': return <MonitorPlay {...props} />;
    case 'shirt': return <Shirt {...props} />;
    case 'calendar': return <Calendar {...props} />;
    case 'code': return <Code {...props} />;
    default: return <Grid {...props} />;
  }
};

const CreatorCategories: React.FC = () => {
  const { user, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCategories = React.useMemo(() => {
    if (!searchQuery.trim()) return categories;
    const query = searchQuery.toLowerCase();
    return categories.filter(c => c.name.toLowerCase().includes(query) || c.description.toLowerCase().includes(query));
  }, [categories, searchQuery]);

  const popularToDisplay = React.useMemo(() => {
    return categories.slice(0, 4);
  }, [categories]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data, error } = await supabase
          .from('creator_categories')
          .select('*')
          .order('name');
        
        if (error) throw error;
        setCategories(data || []);
      } catch (err: any) {
        console.error('Error fetching categories:', err);
        notifyError('Failed to load categories');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCategories();
  }, []);

  const toggleCategory = (id: string) => {
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
    if (selectedIds.size === 0) {
      notifyError('Please select at least one category to continue.');
      return;
    }
    
    if (!user) return;
    
    setIsSaving(true);
    try {
      const inserts = Array.from(selectedIds).map(categoryId => ({
        profile_id: user.id,
        category_id: categoryId
      }));
      
      // Delete existing categories first to avoid duplicates (if they went back)
      await supabase
        .from('profile_categories')
        .delete()
        .eq('profile_id', user.id);
        
      const { error } = await supabase
        .from('profile_categories')
        .insert(inserts);
        
      if (error) throw error;
      
      await refreshProfile();
      
      // Navigate to skills
      navigate('/creator-skills', { replace: true });
    } catch (err: any) {
      console.error('Error saving categories:', err);
      notifyError('Failed to save your selections.');
    } finally {
      setIsSaving(false);
    }
  };

  const renderCategoryTile = (category: Category, index: number) => {
    const isSelected = selectedIds.has(category.id);
    return (
      <motion.div
        key={category.id}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: Math.min(index * 0.03, 0.3) }}
        onClick={() =>
      
 toggleCategory(category.id)}
        className={`relative cursor-pointer rounded-[20px] p-5 border transition-all duration-200 flex flex-col items-center justify-center text-center h-full min-h-[120px] ${
          isSelected 
            ? 'border-[#7C3AED] bg-[#7C3AED]/5 shadow-sm scale-[1.02]' 
            : 'border-[#E5E7EB] bg-white hover:border-[#7C3AED]/30 hover:bg-gray-50 hover:-translate-y-0.5 shadow-sm'
        }`}
      >
        {isSelected && (
          <div className="absolute top-3 right-3 text-[#7C3AED]">
            <Check className="w-5 h-5" strokeWidth={3} />
          </div>
        )}
        
        <div className={`mb-3 transition-colors ${isSelected ? 'text-[#7C3AED]' : 'text-[#6B7280]'}`}>
          {getIconForCategory(category.icon, "w-8 h-8")}
        </div>
        
        <h3 className={`text-sm sm:text-base font-bold leading-tight ${isSelected ? 'text-[#7C3AED]' : 'text-[#111827]'}`}>
          {category.name}
        </h3>
      </motion.div>
    );
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
          className="text-center mb-10"
        >
          <h1 className="text-3xl sm:text-4xl font-bold text-brand-black dark:text-brand-white mb-4 tracking-tight">
            What do you create?
          </h1>
          <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto text-lg">
            Choose one or more categories that best describe what you create.
          </p>
        </motion.div>

        {/* Search Input */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="max-w-md mx-auto mb-12 relative"
        >
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search creator category"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full h-[56px] rounded-[18px] border-0 pl-12 pr-5 text-base text-[#111827] shadow-sm ring-1 ring-inset ring-[#E5E7EB] focus:ring-2 focus:ring-inset focus:ring-[#7C3AED] transition-all duration-200 bg-white"
          />
        </motion.div>

        <div className="mb-12">
          {!searchQuery.trim() && popularToDisplay.length > 0 && (
            <div className="mb-10">
              <h2 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-5 px-1">Popular Categories</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                {popularToDisplay.map((category, index) => renderCategoryTile(category, index))}
              </div>
            </div>
          )}

          {!searchQuery.trim() && categories.length > 0 && (
            <h2 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-5 px-1">All Categories</h2>
          )}

          {filteredCategories.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-[24px] border border-gray-100 shadow-sm">
              <p className="text-gray-500 font-medium">No categories found matching "{searchQuery}"</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {filteredCategories.map((category, index) => renderCategoryTile(category, index))}
            </div>
          )}
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex justify-center"
        >
          <button
            onClick={handleContinue}
            disabled={selectedIds.size === 0 || isSaving}
            className={`flex items-center justify-center gap-2 px-10 py-4 rounded-[18px] font-bold text-lg transition-all shadow-lg w-full sm:w-auto min-w-[200px] ${
              selectedIds.size > 0 
                ? 'bg-[#7C3AED] text-white hover:bg-[#6D28D9] hover:shadow-xl hover:shadow-[#7C3AED]/20 hover:-translate-y-1 active:translate-y-0' 
                : 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none'
            }`}
          >
            {isSaving ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              <>
                Continue to Dashboard
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

export default CreatorCategories;
