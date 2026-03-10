import React, { useState, useEffect } from 'react';
import { Search, Filter, Loader2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { gigsService } from '../services/gigsService';
import GigCard from '../components/GigCard';

const BrowseGigs: React.FC = () => {
  const navigate = useNavigate();
  const [gigs, setGigs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

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
    .filter(gig => 
      gig.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      gig.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      gig.location.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const planA = a.profiles?.subscription_plan || 'starter';
      const planB = b.profiles?.subscription_plan || 'starter';
      
      if (planA === 'premium' && planB !== 'premium') return -1;
      if (planA !== 'premium' && planB === 'premium') return 1;
      if (planA === 'pro' && planB === 'starter') return -1;
      if (planA === 'starter' && planB === 'pro') return 1;
      return 0;
    });

  return (
    <div className="pt-24 pb-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto min-h-screen bg-brand-gray">
      <section className="mb-8 px-2">
        <h1 className="text-3xl lg:text-4xl font-black text-brand-black tracking-tight mb-2">Discover <span className="text-brand-purple">Gigs</span></h1>
        <p className="text-brand-gray-dark text-sm lg:text-base font-medium">Find your next big opportunity across the continent.</p>
      </section>

      <div className="flex flex-col sm:flex-row gap-3 mb-8 px-2">
        <div className="relative flex-grow">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-gray-dark/40 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Search by title, skills, or location..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-brand-purple-light/10 focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple/30 transition-all outline-none shadow-sm bg-white text-brand-black text-sm font-medium"
          />
        </div>
        <button className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl border border-brand-purple-light/10 text-brand-black font-bold hover:bg-brand-purple-soft hover:text-brand-purple transition-all shadow-sm bg-white text-sm active:scale-95">
          <Filter className="w-4 h-4" />
          Filters
        </button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-10 h-10 animate-spin text-brand-purple opacity-50" />
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-100 rounded-[2rem] p-8 text-center mx-2">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-red-900 mb-2">Failed to load gigs</h3>
          <p className="text-red-600 text-sm">{error}</p>
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
              <div className="col-span-full text-center py-20 bg-white rounded-[2.5rem] border border-brand-purple-light/10 border-dashed mx-2">
                <p className="text-brand-gray-dark text-lg font-medium">No gigs found matching your search.</p>
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
