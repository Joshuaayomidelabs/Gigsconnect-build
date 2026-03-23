import React, { useState, useEffect } from 'react';
import { Search, Filter, Loader2, AlertCircle, X, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { gigsService } from '../services/gigsService';
import GigCard from '../components/GigCard';
import { GIG_CATEGORIES } from '../utils/constants';

const BrowseGigs: React.FC = () => {
  const navigate = useNavigate();
  const [gigs, setGigs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [budgetRange, setBudgetRange] = useState({ min: '', max: '' });

  useEffect(() => {
    const fetchGigs = async () => {
      try {
        setIsLoading(true);
        const { data, error: fetchError } = await gigsService.getAllGigs();
        if (fetchError) throw fetchError;
        setGigs(data || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGigs();
  }, []);

  const filteredGigs = gigs
    .filter(gig => {
      const matchesSearch = 
        gig.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        gig.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        gig.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        gig.gig_category?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory = selectedCategory === 'All' || gig.gig_category === selectedCategory;
      
      const min = budgetRange.min ? parseFloat(budgetRange.min) : 0;
      const max = budgetRange.max ? parseFloat(budgetRange.max) : Infinity;
      const matchesBudget = gig.budget >= min && gig.budget <= max;

      return matchesSearch && matchesCategory && matchesBudget;
    });

  return (
    <div className="pt-24 pb-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto min-h-screen bg-brand-gray dark:bg-brand-black transition-colors duration-500">
      <section className="mb-8 px-2">
        <h1 className="text-3xl lg:text-4xl font-black text-brand-black dark:text-brand-white tracking-tight mb-2">Discover <span className="text-brand-purple">Gigs</span></h1>
        <p className="text-gray-700 dark:text-gray-200 text-sm lg:text-base font-medium">Find your next big opportunity across the continent.</p>
      </section>

      <div className="flex flex-col gap-4 mb-8 px-2">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-grow">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Search by title, skills, or location..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-brand-gray dark:border-brand-black focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple/30 transition-all outline-none shadow-sm bg-brand-white dark:bg-brand-dark-card text-brand-black dark:text-brand-white text-sm font-medium"
            />
          </div>
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl border transition-all shadow-sm text-sm font-bold active:scale-95 ${
              showFilters 
                ? 'bg-brand-purple text-brand-white border-brand-purple' 
                : 'bg-brand-white dark:bg-brand-dark-card text-brand-black dark:text-brand-white border-brand-gray dark:border-brand-black hover:bg-brand-purple/5 dark:hover:bg-brand-purple/10 hover:text-brand-purple'
            }`}
          >
            <Filter className="w-4 h-4" />
            {showFilters ? 'Hide Filters' : 'Filters'}
          </button>
        </div>

        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="bg-brand-white dark:bg-brand-dark-card rounded-3xl p-6 border border-brand-gray dark:border-brand-black shadow-md grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-3">Category</label>
                  <div className="relative">
                    <select 
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full p-3 rounded-xl border border-brand-gray dark:border-brand-black bg-brand-gray dark:bg-brand-black focus:bg-brand-white dark:focus:bg-brand-dark-card focus:ring-2 focus:ring-brand-purple/20 transition-all outline-none text-sm font-bold appearance-none text-brand-black dark:text-brand-white"
                    >
                      <option value="All">All Categories</option>
                      {GIG_CATEGORIES.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 dark:text-gray-400 pointer-events-none" />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-black uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-3">Budget Range (USD)</label>
                  <div className="flex items-center gap-3">
                    <div className="relative flex-1">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 text-xs font-bold">$</span>
                      <input 
                        type="number" 
                        placeholder="Min"
                        value={budgetRange.min}
                        onChange={(e) => setBudgetRange(prev => ({ ...prev, min: e.target.value }))}
                        className="w-full pl-7 pr-3 py-3 rounded-xl border border-brand-gray dark:border-brand-black bg-brand-gray dark:bg-brand-black focus:bg-brand-white dark:focus:bg-brand-dark-card focus:ring-2 focus:ring-brand-purple/20 transition-all outline-none text-sm font-bold text-brand-black dark:text-brand-white"
                      />
                    </div>
                    <div className="w-4 h-px bg-brand-gray dark:bg-brand-black"></div>
                    <div className="relative flex-1">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 text-xs font-bold">$</span>
                      <input 
                        type="number" 
                        placeholder="Max"
                        value={budgetRange.max}
                        onChange={(e) => setBudgetRange(prev => ({ ...prev, max: e.target.value }))}
                        className="w-full pl-7 pr-3 py-3 rounded-xl border border-brand-gray dark:border-brand-black bg-brand-gray dark:bg-brand-black focus:bg-brand-white dark:focus:bg-brand-dark-card focus:ring-2 focus:ring-brand-purple/20 transition-all outline-none text-sm font-bold text-brand-black dark:text-brand-white"
                      />
                    </div>
                    <button 
                      onClick={() => {
                        setBudgetRange({ min: '', max: '' });
                        setSelectedCategory('All');
                        setSearchTerm('');
                      }}
                      className="p-3 text-gray-500 dark:text-gray-400 hover:text-brand-purple transition-colors"
                      title="Reset Filters"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-10 h-10 animate-spin text-brand-purple opacity-50" />
        </div>
      ) : error ? (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/40 rounded-[2rem] p-8 text-center mx-2">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-red-900 dark:text-red-100 mb-2">Failed to load gigs</h3>
          <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AnimatePresence>
            {filteredGigs.length > 0 ? (
              filteredGigs.map((gig, i) => (
                <motion.div
                  key={gig.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <GigCard 
                    gig={gig} 
                    onViewDetails={(g) => navigate(`/gig/${g.id}`)}
                    onApply={(id) => navigate(`/gig/${id}`)}
                  />
                </motion.div>
              ))
            ) : (
              <div className="col-span-full text-center py-20 bg-brand-white dark:bg-brand-dark-card rounded-[2.5rem] border border-brand-gray dark:border-brand-black border-dashed mx-2">
                <p className="text-gray-500 dark:text-gray-400 text-lg font-medium">No gigs found matching your search.</p>
                <button onClick={() => setSearchTerm('')} className="mt-4 text-brand-purple font-bold hover:underline">Clear search</button>
              </div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default BrowseGigs;
