import React, { useState, useEffect } from 'react';
import { Search, Filter, Loader2, AlertCircle, X, ChevronDown, Banknote, User } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { gigsService } from '../services/gigsService';
import { profilesService } from '../services/profilesService';
import { applicationsService } from '../services/applicationsService';
import { supabase } from '../services/supabaseClient';
import GigCard from '../components/GigCard';
import { UserCard } from '../components/UserCard';
import { GigCardSkeleton, UserCardSkeleton } from '../components/Skeleton';
import GigDetailsModal from '../components/GigDetailsModal';
import { GIG_CATEGORIES } from '../utils/constants';
import VerificationBadge from '../components/VerificationBadge';

const BrowseGigs: React.FC = () => {
  const navigate = useNavigate();
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
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
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
      // If no search term, just fetch all gigs (initial state)
      if (!debouncedSearchTerm.trim()) {
        setUsers([]);
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
        return;
      }

      // If there is a search term, use the combined search service
      try {
        setIsSearching(true);
        const { gigs: searchGigs, users: searchUsers } = await gigsService.searchGigsAndUsers(debouncedSearchTerm);
        setGigs(searchGigs || []);
        setUsers(searchUsers || []);
      } catch (err: any) {
        console.error('Error during search:', err);
      } finally {
        setIsSearching(false);
      }
    };

    performSearch();
  }, [debouncedSearchTerm]);

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
    <div className="pt-24 pb-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto min-h-screen bg-brand-gray dark:bg-brand-black transition-colors duration-500">
      <section className="mb-8 px-2">
        <h1 className="text-3xl lg:text-4xl font-black text-brand-black dark:text-brand-white tracking-tight mb-2">Search</h1>
        <p className="text-gray-700 dark:text-gray-200 text-sm lg:text-base font-medium">Find people and opportunities across the continent.</p>
      </section>

      <div className="flex flex-col gap-4 mb-8 px-2">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-grow">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Search people, gigs, skills..." 
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
                  <label className="block text-xs font-black uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-3">Budget Range</label>
                  <div className="flex items-center gap-3">
                    <div className="relative flex-1">
                      <Banknote className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 w-3.5 h-3.5" />
                      <input 
                        type="number" 
                        placeholder="Min"
                        value={budgetRange.min}
                        onChange={(e) => setBudgetRange(prev => ({ ...prev, min: e.target.value }))}
                        className="w-full pl-9 pr-3 py-3 rounded-xl border border-brand-gray dark:border-brand-black bg-brand-gray dark:bg-brand-black focus:bg-brand-white dark:focus:bg-brand-dark-card focus:ring-2 focus:ring-brand-purple/20 transition-all outline-none text-sm font-bold text-brand-black dark:text-brand-white"
                      />
                    </div>
                    <div className="w-4 h-px bg-brand-gray dark:bg-brand-black"></div>
                    <div className="relative flex-1">
                      <Banknote className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 w-3.5 h-3.5" />
                      <input 
                        type="number" 
                        placeholder="Max"
                        value={budgetRange.max}
                        onChange={(e) => setBudgetRange(prev => ({ ...prev, max: e.target.value }))}
                        className="w-full pl-9 pr-3 py-3 rounded-xl border border-brand-gray dark:border-brand-black bg-brand-gray dark:bg-brand-black focus:bg-brand-white dark:focus:bg-brand-dark-card focus:ring-2 focus:ring-brand-purple/20 transition-all outline-none text-sm font-bold text-brand-black dark:text-brand-white"
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

      {isLoading || isSearching ? (
        <div className="space-y-12">
          {searchTerm.trim() !== '' && (
            <div className="px-2">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-brand-black dark:text-brand-white tracking-tight">
                  Searching <span className="text-brand-purple">People</span>
                </h2>
                <Loader2 className="w-5 h-5 animate-spin text-brand-purple" />
              </div>
              <div className="flex flex-col">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center gap-4 p-3 rounded-2xl animate-pulse">
                    <div className="w-14 h-14 bg-gray-200 dark:bg-gray-800 rounded-full flex-shrink-0"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/3 mb-2"></div>
                      <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="px-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-brand-black dark:text-brand-white tracking-tight">
                {searchTerm.trim() !== '' ? 'Searching ' : 'Loading '} 
                <span className="text-brand-purple">{searchTerm.trim() !== '' ? 'Posts' : 'Gigs'}</span>
              </h2>
              <Loader2 className="w-5 h-5 animate-spin text-brand-purple" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <GigCardSkeleton key={i} />
              ))}
            </div>
          </div>
        </div>
      ) : error ? (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/40 rounded-[2rem] p-8 text-center mx-2">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-red-900 dark:text-red-100 mb-2">Failed to load gigs</h3>
          <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
        </div>
      ) : (
        <>
          {searchTerm.trim() !== '' && (
            <div className="mb-10 px-2">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-brand-black dark:text-brand-white tracking-tight">
                  People
                </h2>
              </div>

              {users.length > 0 ? (
                <div className="flex flex-col">
                  {users.map((user, i) => (
                    <motion.div
                      key={user.id}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.03 }}
                    >
                      <Link 
                        to={`/profile/${user.id}`} 
                        className="flex items-center gap-4 p-3 rounded-2xl hover:bg-black/5 dark:hover:bg-white/5 active:scale-[0.98] transition-all cursor-pointer"
                      >
                        <div className="w-14 h-14 rounded-full bg-brand-gray dark:bg-brand-black flex-shrink-0 flex items-center justify-center overflow-hidden border border-brand-gray dark:border-brand-black">
                          {user.avatar_url ? (
                            <img src={user.avatar_url} alt={user.username || user.full_name} className="w-full h-full object-cover" />
                          ) : (
                            <User className="w-6 h-6 text-gray-400" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-brand-black dark:text-brand-white text-base truncate flex items-center gap-1">
                            {user.username || user.full_name || 'User'}
                            {user.verification_status === 'verified' && (
                              <VerificationBadge verificationStatus="verified" className="ml-0" />
                            )}
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                            {user.full_name}
                            {user.skills && user.skills.length > 0 && ` • ${user.skills[0]}`}
                          </p>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500 dark:text-gray-400 font-medium">No people found.</p>
                </div>
              )}
            </div>
          )}

          <div className="mb-4 px-2">
            <h2 className="text-xl font-bold text-brand-black dark:text-brand-white tracking-tight">
              {searchTerm.trim() !== '' ? 'Posts' : 'Gigs'}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                    onViewDetails={handleViewDetails}
                    onApply={handleApply}
                    initialIsApplied={appliedGigIds.has(gig.id)}
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
