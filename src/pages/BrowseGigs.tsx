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

  const filteredGigs = gigs.filter(gig => 
    gig.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    gig.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    gig.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-screen">
      <section className="mb-12">
        <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-4">Browse Gigs</h1>
        <p className="text-gray-500 text-lg">Find your next big opportunity across the continent.</p>
      </section>

      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-grow">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Search by title, description, or location..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-brand-600 focus:border-transparent transition-all outline-none shadow-sm"
          />
        </div>
        <button className="flex items-center justify-center gap-2 px-6 py-4 rounded-2xl border border-gray-200 text-gray-600 font-bold hover:bg-gray-50 transition-all shadow-sm">
          <Filter className="w-5 h-5" />
          Filters
        </button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-10 h-10 animate-spin text-brand-600" />
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
              <div className="col-span-full text-center py-20 bg-gray-50 rounded-3xl border border-gray-100 border-dashed">
                <p className="text-gray-500 text-lg">No gigs found matching your search.</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default BrowseGigs;
