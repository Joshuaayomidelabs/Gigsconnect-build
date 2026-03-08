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
    <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-screen bg-white">
      <section className="mb-12">
        <h1 className="text-4xl font-black text-brand-black tracking-tight mb-4">Browse <span className="text-brand-purple">Gigs</span></h1>
        <p className="text-brand-gray-dark text-lg">Find your next big opportunity across the continent.</p>
      </section>

      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-grow">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-gray-dark/50 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Search by title, description, or location..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-4 rounded-2xl border border-brand-purple-light/20 focus:ring-2 focus:ring-brand-purple focus:border-transparent transition-all outline-none shadow-sm bg-brand-gray focus:bg-white text-brand-black"
          />
        </div>
        <button className="flex items-center justify-center gap-2 px-6 py-4 rounded-2xl border border-brand-purple-light/20 text-brand-black font-bold hover:bg-brand-purple-soft hover:text-brand-purple transition-all shadow-sm bg-white">
          <Filter className="w-5 h-5" />
          Filters
        </button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-10 h-10 animate-spin text-brand-purple" />
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-100 rounded-2xl p-8 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-red-900 mb-2">Failed to load gigs</h3>
          <p className="text-red-600">{error}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredGigs.length > 0 ? (
              filteredGigs.map((gig) => (
                <GigCard 
                  key={gig.id} 
                  gig={gig} 
                  onViewDetails={(g) => navigate(`/gig/${g.id}`)}
                  onApply={(id) => navigate(`/gig/${id}`)}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-20 bg-brand-gray rounded-3xl border border-brand-purple-light/20 border-dashed">
                <p className="text-brand-gray-dark text-lg">No gigs found matching your search.</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default BrowseGigs;
