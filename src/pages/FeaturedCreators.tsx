import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Loader2, Award, Zap, Star } from 'lucide-react';
import { motion } from 'motion/react';
import { supabase } from '../services/supabaseClient';
import { UserCard } from '../components/UserCard';
import { UserCardSkeleton } from '../components/Skeleton';

export const FeaturedCreators: React.FC = () => {
  const navigate = useNavigate();
  const [creators, setCreators] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Pagination state
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const ITEMS_PER_PAGE = 12;

  useEffect(() => {
    const fetchFeaturedCreators = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Calculate range for pagination
        const from = page * ITEMS_PER_PAGE;
        const to = from + ITEMS_PER_PAGE - 1;

        // Query profiles with verification_status = 'verified' 
        const { data, error: fetchError, count } = await supabase
          .from('profiles')
          .select('*', { count: 'exact' })
          .eq('verification_status', 'verified')
          .order('created_at', { ascending: false })
          .range(from, to);

        if (fetchError) throw fetchError;

        if (data) {
          // Filter out empty, platform system, developer placeholders, and empty shell records
          const filteredData = data.filter((u: any) => {
            if (!u.full_name || !u.full_name.trim() || !u.username || !u.username.trim()) {
              return false;
            }

            const fullNameLower = u.full_name.toLowerCase();
            const userNameLower = u.username.toLowerCase();

            // Exclude platform/system official automation accounts
            if (fullNameLower.includes('gigsconnect') || userNameLower.includes('gigsconnect')) {
              return false;
            }

            // Exclude test, demo, sample, placeholder, admin, or developer seed profiles
            const isPlaceholder = [
              'test', 'demo', 'sample', 'placeholder', 'example', 'admin', 
              'new user', 'alex smith', 'john doe'
            ].some(keyword => fullNameLower.includes(keyword) || userNameLower.includes(keyword));
            
            if (isPlaceholder) {
              return false;
            }

            // Exclude empty shell profiles with zero skills and zero biography
            const hasSkills = Array.isArray(u.skills) && u.skills.length > 0;
            const hasBio = !!(u.bio && u.bio.trim());
            if (!hasSkills && !hasBio) {
              return false;
            }

            return true;
          });

          // Map backend 'city_town' to frontend 'city'
          const mappedData = filteredData.map((u: any) => ({
            ...u,
            city: u.city_town
          }));

          setCreators(prev => page === 0 ? mappedData : [...prev, ...mappedData]);
          
          // Check if there are more items to load
          if (count !== null) {
            setHasMore(from + data.length < count);
          } else {
            setHasMore(data.length === ITEMS_PER_PAGE);
          }
        }
      } catch (err: any) {
        console.error('Error loading featured creators:', err);
        setError(err.message || 'Failed to load featured creators.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeaturedCreators();
  }, [page]);

  const handleLoadMore = () => {
    if (!isLoading && hasMore) {
      setPage(prev => prev + 1);
    }
  };

  return (
    <div className="relative pt-main pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-screen transition-colors duration-500">
      {/* Background glow effects to keep design consistent and premium */}
      <div className="fixed inset-0 pointer-events-none -z-10 bg-brand-gray dark:bg-[#0a0a0c]">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-brand-purple/5 sm:bg-brand-purple/10 blur-[120px] rounded-full opacity-50 dark:opacity-20 hidden sm:block"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
      </div>

      <div className="space-y-8 relative z-10">
        
        {/* Header Actions & Title */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-150 dark:border-[#1F1F23]/80 pb-6">
          <div className="space-y-1">
            <button 
              onClick={() => navigate('/overview')}
              className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-gray-500 dark:text-gray-400 hover:text-brand-purple dark:hover:text-brand-purple transition-colors mb-3 outline-none"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </button>
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-2xl bg-brand-purple/10 text-brand-purple">
                <Award className="w-6 h-6" />
              </div>
              <h1 className="text-3xl lg:text-4xl font-black text-brand-black dark:text-brand-white tracking-tight">
                Featured Creators
              </h1>
            </div>
            <p className="text-gray-700 dark:text-gray-200 text-sm lg:text-base font-medium">
              Top verified talent and industry professionals active in GigsConnect.
            </p>
          </div>
        </div>

        {/* Dynamic Display */}
        {error ? (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/40 rounded-3xl p-12 text-center max-w-xl mx-auto">
            <p className="text-red-600 dark:text-red-400 font-bold mb-4">{error}</p>
            <button 
              onClick={() => { setPage(0); setCreators([]); }}
              className="px-6 py-2.5 bg-brand-purple text-white font-bold rounded-xl hover:bg-brand-purple-hover transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : creators.length === 0 && isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <UserCardSkeleton key={i} />
            ))}
          </div>
        ) : creators.length === 0 && !isLoading ? (
          <div className="bg-white dark:bg-brand-dark-card rounded-3xl p-16 text-center border border-gray-150 dark:border-[#1F1F23] max-w-lg mx-auto">
            <Star className="w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto mb-4 animate-pulse" />
            <h3 className="text-lg font-black text-brand-black dark:text-brand-white uppercase tracking-wider mb-2">No Featured Creators</h3>
            <p className="text-gray-600 dark:text-gray-400 font-bold text-sm">
              We couldn't find any verified profiles listed at the moment. Check back soon!
            </p>
          </div>
        ) : (
          <div className="space-y-10">
            {/* Grid of Verified Creators */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {creators.map((creator) => (
                <UserCard key={creator.id} user={creator} />
              ))}
            </div>

            {/* Pagination & Load More */}
            {hasMore && (
              <div className="flex justify-center pt-4">
                <button
                  onClick={handleLoadMore}
                  disabled={isLoading}
                  className="inline-flex items-center gap-2 px-8 py-3.5 bg-white dark:bg-brand-dark-card border border-gray-150 dark:border-[#1F1F23]/80 hover:border-brand-purple dark:hover:border-brand-purple text-sm font-black uppercase tracking-wider text-brand-black dark:text-brand-white hover:text-brand-purple dark:hover:text-brand-purple rounded-2xl transition-all shadow-soft cursor-pointer disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-brand-purple" />
                      Loading creators...
                    </>
                  ) : (
                    'Load More Creators'
                  )}
                </button>
              </div>
            )}
            
            {/* Loading placeholder when appending next page */}
            {isLoading && page > 0 && (
              <div className="flex justify-center p-6">
                <Loader2 className="w-8 h-8 animate-spin text-brand-purple" />
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
