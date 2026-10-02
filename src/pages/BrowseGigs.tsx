import { SEO } from '../components/SEO';
import React, { useState, useEffect } from 'react';
import { Search, Filter, Loader2, AlertCircle, X, ChevronDown, Banknote } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { gigsService } from '../services/gigsService';
import { applicationsService } from '../services/applicationsService';
import GigCard from '../components/GigCard';
import { UserCard } from '../components/UserCard';
import { GigCardSkeleton, UserCardSkeleton } from '../components/Skeleton';
import GigDetailsModal from '../components/GigDetailsModal';
import { GIG_CATEGORIES } from '../utils/constants';
import { getFriendlyErrorMessage } from '../utils/errorHandler';
import { getCategoryConfig } from '../utils/categoryStyles';

const BrowseGigs: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [gigs, setGigs] = useState<any[]>([]);
  const [appliedGigIds, setAppliedGigIds] = useState<Set<string>>(new Set());
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  // Fetch applied gig IDs
  useEffect(() => {
    const fetchAppliedGigs = async () => {
      if (!user?.id) return;
      try {
        const { data, error } = await applicationsService.getMyApplications(user.id);
        if (!error && data) {
          const ids = new Set(data.map((app: any) => app.gig_id));
          setAppliedGigIds(ids);
        }
      } catch (err) {
        console.error("Error fetching applied gigs:", err);
      }
    };
    fetchAppliedGigs();
  }, [user?.id]);

  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize and read search query "q" and "category" from URL
  const [searchTerm, setSearchTerm] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('q') || '';
  });
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('q') || '';
  });

  const [selectedCategory, setSelectedCategory] = useState<string>(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('category') || 'All';
  });

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get('q');
    if (q !== null && q !== searchTerm) {
      setSearchTerm(q);
    }
    const cat = params.get('category');
    if (cat !== null && cat !== selectedCategory) {
      setSelectedCategory(cat);
    } else if (cat === null && selectedCategory !== 'All') {
      setSelectedCategory('All');
    }
  }, [location.search]);

  const [showFilters, setShowFilters] = useState(false);
  const [budgetRange, setBudgetRange] = useState({ min: '', max: '' });
  const [selectedGig, setSelectedGig] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Unified Search (Gigs + Users)
  useEffect(() => {
    const performSearch = async () => {
      setError(null);
      
      if (!debouncedSearchTerm.trim()) {
        try {
          setIsLoading(true);
          const gigsRes = await gigsService.getAllGigs();
          if (gigsRes.error) throw gigsRes.error;

          setUsers([]);
          setGigs(gigsRes.data || []);
        } catch (err: any) {
          setError(getFriendlyErrorMessage(err));
        } finally {
          setIsLoading(false);
        }
        return;
      }

      try {
        setIsSearching(true);
        const { gigs: searchGigs, users: searchUsers } = await gigsService.searchGigsAndUsers(debouncedSearchTerm);
        setGigs(searchGigs || []);
        const mappedUsers = searchUsers?.map((u: any) => ({
          ...u,
          city: u.city || u.city_town
        })) || [];
        setUsers(mappedUsers);
      } catch (err: any) {
        console.error('Error during search:', err);
      } finally {
        setIsSearching(false);
      }
    };

    performSearch();
  }, [debouncedSearchTerm]);

  // Category change handler that synchronizes URL ?category= param
  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    const params = new URLSearchParams(location.search);
    if (category === 'All') {
      params.delete('category');
    } else {
      params.set('category', category);
    }
    const searchString = params.toString();
    navigate(searchString ? `/browse?${searchString}` : '/browse', { replace: true });
  };

  // Filter Gigs by Category & Budget locally
  const filteredGigs = gigs
    .filter(gig => {
      const matchesCategory = selectedCategory === 'All' || gig.gig_category === selectedCategory;
      
      const min = budgetRange.min ? parseFloat(budgetRange.min) : 0;
      const max = budgetRange.max ? parseFloat(budgetRange.max) : Infinity;
      const matchesBudget = gig.budget >= min && gig.budget <= max;

      return matchesCategory && matchesBudget;
    });

  const handleViewDetails = (gig: any) => {
    setSelectedGig(gig);
    setIsModalOpen(true);
  };

  const handleApply = (id: string) => {
    navigate(`/gig/${id}`);
  };

  return (
    <div className="pt-main pb-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto min-h-screen bg-brand-gray dark:bg-brand-black transition-colors duration-500">
      <SEO title="Explore | GigsConnect" canonical="https://gigsconnect.africa/browse" />

      {/* Page Header (Task 1) */}
      <section className="mb-6 px-1">
        <h1 className="text-3xl lg:text-4xl font-black text-brand-black dark:text-brand-white tracking-tight mb-2">
          Explore
        </h1>
        <p className="text-gray-600 dark:text-gray-300 text-sm lg:text-base font-normal">
          Find people and opportunities across the continent.
        </p>
      </section>

      {/* Search Input & Filter Toggle */}
      <div className="flex flex-col gap-4 mb-6 px-1">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-grow">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Search creators and gigs by name, title, description, or skills..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-gray-200 dark:border-brand-black focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple/40 transition-all outline-none shadow-sm bg-white dark:bg-brand-dark-card text-brand-black dark:text-brand-white text-sm font-medium"
            />
          </div>
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl border transition-all shadow-sm text-sm font-bold active:scale-95 ${
              showFilters 
                ? 'bg-brand-purple text-white border-brand-purple' 
                : 'bg-white dark:bg-brand-dark-card text-brand-black dark:text-brand-white border-gray-200 dark:border-brand-black hover:bg-brand-purple/5 dark:hover:bg-brand-purple/10 hover:text-brand-purple'
            }`}
          >
            <Filter className="w-4 h-4" />
            {showFilters ? 'Hide Filters' : 'Filters'}
          </button>
        </div>

        {/* Collapsible Filter Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="bg-white dark:bg-brand-dark-card rounded-2xl p-6 border border-gray-200 dark:border-brand-dark-card shadow-sm grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-3">Category</label>
                  <div className="relative">
                    <select 
                      value={selectedCategory}
                      onChange={(e) => handleCategorySelect(e.target.value)}
                      className="w-full p-3 rounded-xl border border-gray-200 dark:border-brand-black bg-gray-50 dark:bg-brand-black focus:bg-white dark:focus:bg-brand-dark-card focus:ring-2 focus:ring-brand-purple/20 transition-all outline-none text-sm font-bold appearance-none text-brand-black dark:text-brand-white"
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
                  <label className="block text-xs font-black uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-3">Budget Range</label>
                  <div className="flex items-center gap-3">
                    <div className="relative flex-1">
                      <Banknote className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 w-3.5 h-3.5" />
                      <input 
                        type="number" 
                        placeholder="Min"
                        value={budgetRange.min}
                        onChange={(e) => setBudgetRange(prev => ({ ...prev, min: e.target.value }))}
                        className="w-full pl-9 pr-3 py-3 rounded-xl border border-gray-200 dark:border-brand-black bg-gray-50 dark:bg-brand-black focus:bg-white dark:focus:bg-brand-dark-card focus:ring-2 focus:ring-brand-purple/20 transition-all outline-none text-sm font-bold text-brand-black dark:text-brand-white"
                      />
                    </div>
                    <div className="w-4 h-px bg-gray-300 dark:bg-zinc-800"></div>
                    <div className="relative flex-1">
                      <Banknote className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 w-3.5 h-3.5" />
                      <input 
                        type="number" 
                        placeholder="Max"
                        value={budgetRange.max}
                        onChange={(e) => setBudgetRange(prev => ({ ...prev, max: e.target.value }))}
                        className="w-full pl-9 pr-3 py-3 rounded-xl border border-gray-200 dark:border-brand-black bg-gray-50 dark:bg-brand-black focus:bg-white dark:focus:bg-brand-dark-card focus:ring-2 focus:ring-brand-purple/20 transition-all outline-none text-sm font-bold text-brand-black dark:text-brand-white"
                      />
                    </div>
                    <button 
                      onClick={() => {
                        setBudgetRange({ min: '', max: '' });
                        handleCategorySelect('All');
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

      {/* Task 1: Horizontally scrollable row of category chips above results (All + GIG_CATEGORIES with icon) */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-3 mb-8 px-1 snap-x">
        {['All', ...GIG_CATEGORIES].map((category) => {
          const isSelected = selectedCategory === category;
          const config = getCategoryConfig(category);
          const Icon = config.icon;

          return (
            <button
              key={category}
              onClick={() => handleCategorySelect(category)}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all snap-start active:scale-95 ${
                isSelected
                  ? 'bg-brand-purple text-white shadow-sm'
                  : 'bg-white dark:bg-brand-dark-card text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-brand-dark-card hover:bg-brand-purple/5 hover:text-brand-purple dark:hover:bg-brand-purple/10 hover:border-brand-purple/30'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-white' : 'text-brand-purple'}`} />
              <span>{category === 'All' ? 'All Gigs' : category}</span>
            </button>
          );
        })}
      </div>

      {isLoading || isSearching ? (
        <div className="space-y-12">
          {/* Creators Skeletons */}
          {searchTerm.trim() !== '' && (
            <div className="px-1">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-brand-black dark:text-brand-white tracking-tight">
                  Searching <span className="text-brand-purple">Creators</span>
                </h2>
                <Loader2 className="w-5 h-5 animate-spin text-brand-purple" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
                {[...Array(3)].map((_, i) => (
                  <UserCardSkeleton key={i} />
                ))}
              </div>
            </div>
          )}

          {/* Gigs Skeletons: 1 col on mobile, 2 on md, 3 on lg */}
          <div className="px-1">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-brand-black dark:text-brand-white tracking-tight">
                {searchTerm.trim() !== '' ? 'Searching ' : 'Loading '} 
                <span className="text-brand-purple">Gigs</span>
              </h2>
              <Loader2 className="w-5 h-5 animate-spin text-brand-purple" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
              {[...Array(6)].map((_, i) => (
                <GigCardSkeleton key={i} />
              ))}
            </div>
          </div>
        </div>
      ) : error ? (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/40 rounded-2xl p-8 text-center mx-1">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-red-900 dark:text-red-100 mb-2">Failed to load search results</h3>
          <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
        </div>
      ) : (
        <>
          {/* Creators Section */}
          {searchTerm.trim() !== '' && (
            <div className="mb-12 px-1">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-brand-black dark:text-brand-white tracking-tight">
                  Matched <span className="text-brand-purple">Creators</span>
                </h2>
              </div>

              {users.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
                  <AnimatePresence>
                    {users.map((item, i) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                      >
                        <UserCard user={item} />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="text-center py-12 bg-white dark:bg-brand-dark-card rounded-2xl border border-gray-200 dark:border-[#1F1F23] border-dashed">
                  <p className="text-gray-500 dark:text-gray-400 font-medium">No creators matched your search.</p>
                </div>
              )}
            </div>
          )}

          {/* Gigs Section: 1 col on mobile, 2 on md, 3 on lg */}
          <div className="mb-12 px-1">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-brand-black dark:text-brand-white tracking-tight">
                {searchTerm.trim() !== '' ? 'Matched ' : ''}<span className="text-brand-purple">Gigs</span>
              </h2>
            </div>

            {filteredGigs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
                <AnimatePresence>
                  {filteredGigs.map((gig, i) => (
                    <motion.div
                      key={gig.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <GigCard 
                        gig={gig} 
                        onViewDetails={handleViewDetails}
                        onApply={handleApply}
                        initialIsApplied={appliedGigIds.has(gig.id)}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              <div className="col-span-full text-center py-16 sm:py-20 bg-white dark:bg-brand-dark-card rounded-2xl border border-gray-200 dark:border-[#1F1F23]/80 border-dashed mx-1">
                <p className="text-gray-600 dark:text-gray-300 text-base sm:text-lg font-medium">
                  No gigs found. Try another category or search.
                </p>
                {(searchTerm.trim() !== '' || selectedCategory !== 'All' || budgetRange.min || budgetRange.max) && (
                  <button 
                    onClick={() => {
                      setSearchTerm('');
                      handleCategorySelect('All');
                      setBudgetRange({ min: '', max: '' });
                    }} 
                    className="mt-4 text-brand-purple font-bold hover:underline text-sm inline-block"
                  >
                    Reset all filters
                  </button>
                )}
              </div>
            )}
          </div>
        </>
      )}

      <GigDetailsModal 
        gig={selectedGig}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onApply={handleApply}
        isApplied={selectedGig ? appliedGigIds.has(selectedGig.id) : false}
      />
    </div>
  );
};

export default BrowseGigs;
