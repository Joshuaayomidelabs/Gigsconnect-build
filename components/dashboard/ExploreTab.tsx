import React, { useState, useEffect } from 'react';
import { Search, MapPin, Calendar, Bookmark, Loader2, AlertCircle, Music } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { supabase } from '../../src/supabaseClient';
import GigDetailsModal from './GigDetailsModal';

// --- Types ---
export interface Gig {
  id: string;
  title: string;
  description: string;
  location: string;
  price: number;
  currency: string;
  category: string;
  event_type?: string;
  visibility: string;
  status: string;
  event_date?: string;
  posted_by: string;
  created_at: string;
  users?: {
    name: string;
  };
}

const GigCardExplore = ({ gig, onViewDetails }: { gig: Gig, onViewDetails: (gig: Gig) => void }) => {
  const [bookmarked, setBookmarked] = useState(false);
  
  // Format price with currency
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: gig.currency || 'USD',
    maximumFractionDigits: 0
  }).format(gig.price);

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3, type: "spring", bounce: 0.2 }}
      className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 flex flex-col h-full hover:-translate-y-1 relative group"
    >
      <button 
        onClick={() => setBookmarked(!bookmarked)}
        className="absolute top-5 sm:top-6 right-5 sm:right-6 text-gray-300 hover:text-blue-600 transition-colors active:scale-90"
      >
        <Bookmark className={`w-6 h-6 ${bookmarked ? 'fill-blue-600 text-blue-600' : ''}`} />
      </button>
      
      <div className="flex justify-between items-start mb-4 gap-4 pr-10">
        <h3 className="text-lg sm:text-xl font-bold text-gray-900 leading-tight group-hover:text-blue-600 transition-colors">
          {gig.title}
        </h3>
      </div>
      
      <div className="flex flex-col gap-2 mb-4">
        <div className="flex items-center gap-2">
          <span className="inline-block px-3 py-1 bg-green-50 text-green-700 text-xs sm:text-sm font-bold rounded-full whitespace-nowrap border border-green-100">
            {formattedPrice}
          </span>
          {gig.category && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-50 text-purple-700 text-xs sm:text-sm font-bold rounded-full whitespace-nowrap border border-purple-100">
              <Music className="w-3 h-3" />
              {gig.category}
            </span>
          )}
          {gig.event_type ? (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 text-xs sm:text-sm font-bold rounded-full whitespace-nowrap border border-blue-100">
              {gig.event_type}
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-50 text-gray-700 text-xs sm:text-sm font-bold rounded-full whitespace-nowrap border border-gray-200">
              General Event
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-2 text-gray-500 text-sm font-medium mt-1">
          <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-[10px] font-bold flex-shrink-0">
            {gig.users?.name ? gig.users.name.charAt(0) : 'U'}
          </div>
          <span className="truncate">Posted by {gig.users?.name || 'Unknown Poster'}</span>
        </div>
        
        <div className="flex items-center gap-2 text-gray-500 text-sm font-medium">
          <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <span className="truncate">{gig.location}</span>
        </div>
        {gig.event_date && (
          <div className="flex items-center gap-2 text-gray-500 text-sm font-medium">
            <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <span className="truncate">{new Date(gig.event_date).toLocaleDateString()}</span>
          </div>
        )}
      </div>
      
      <p className="text-gray-600 text-sm leading-relaxed mb-6 flex-grow line-clamp-3">
        {gig.description}
      </p>
      
      <div className="flex items-center gap-3 mt-auto pt-4 border-t border-gray-50">
        <button 
          onClick={() => onViewDetails(gig)}
          className="flex-1 py-3 px-4 rounded-xl border border-gray-200 text-gray-700 font-bold hover:bg-gray-50 transition-colors text-sm active:scale-95"
        >
          Details
        </button>
        <button 
          className="flex-1 py-3 px-4 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-colors text-sm shadow-sm flex justify-center items-center active:scale-95"
        >
          Apply Now
        </button>
      </div>
    </motion.div>
  );
};

const ExploreTab = () => {
  const [selectedGig, setSelectedGig] = useState<Gig | null>(null);
  const [gigs, setGigs] = useState<Gig[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 1. Fetch initial data and setup subscriptions
  useEffect(() => {
    const fetchGigs = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Initial fetch for gigs
        // Fetch all gigs where visibility = 'public' and status = 'open'.
        // Join the users table on gigs.posted_by = users.id to get users.name.
        // Order by created_at descending.
        const { data: gigsData, error: fetchError } = await supabase
          .from('gigs')
          .select('id, title, description, price, currency, location, posted_by, visibility, status, created_at, category, event_type, event_date, users(name)')
          .eq('visibility', 'public')
          .eq('status', 'open')
          .order('created_at', { ascending: false });
          
        if (fetchError) throw fetchError;
        if (gigsData) setGigs(gigsData as Gig[]);
        
      } catch (err: any) {
        console.error("Error fetching gigs:", err);
        setError(err.message || "Failed to load gigs. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchGigs();

    // Realtime subscription for gigs
    // Subscribe to real-time INSERT events on the gigs table so new gigs appear automatically.
    const gigsSubscription = supabase
      .channel('public:gigs:explore')
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'gigs' 
      }, async (payload) => {
        // We need to fetch the user details for the new gig since the payload only contains the raw row
        const newGigRaw = payload.new as Gig;
        
        // Only add if it's public and open
        if (newGigRaw.visibility === 'public' && newGigRaw.status === 'open') {
          try {
            // Fetch the user's full name to attach to the gig
            const { data: userData } = await supabase
              .from('users')
              .select('name')
              .eq('id', newGigRaw.posted_by)
              .single();
              
            const newGigWithUser = {
              ...newGigRaw,
              users: userData || undefined
            };
            
            // 3. React state updates:
            // Update the state with the new gig, placing it at the top of the list.
            setGigs((currentGigs) => [newGigWithUser, ...currentGigs]);
          } catch (e) {
            // Fallback if user fetch fails
            setGigs((currentGigs) => [newGigRaw, ...currentGigs]);
          }
        }
      })
      .subscribe();

    // Cleanup subscription on unmount
    return () => {
      supabase.removeChannel(gigsSubscription);
    };
  }, []);

  return (
    <div className="space-y-8 relative z-10">
      <section>
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">Explore Gigs</h1>
        <p className="text-gray-500 mt-1 text-base sm:text-lg">Find your next opportunity</p>
      </section>

      <section className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
        <div className="relative w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input type="text" placeholder="Search by keyword, genre, or artist..." className="w-full pl-12 pr-4 py-3 sm:py-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all text-base" />
        </div>
        
        <div className="flex overflow-x-auto hide-scrollbar gap-3 pb-2 sm:pb-0 sm:grid sm:grid-cols-3 sm:gap-4">
          <select className="flex-shrink-0 w-auto sm:w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white text-gray-700 text-sm appearance-none">
            <option value="">All Genres</option>
            <option value="afrobeats">Afrobeats</option>
            <option value="jazz">Jazz</option>
            <option value="pop">Pop</option>
            <option value="rock">Rock</option>
          </select>
          <select className="flex-shrink-0 w-auto sm:w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white text-gray-700 text-sm appearance-none">
            <option value="">Any Location</option>
            <option value="lagos">Lagos, Nigeria</option>
            <option value="accra">Accra, Ghana</option>
            <option value="nairobi">Nairobi, Kenya</option>
            <option value="remote">Remote</option>
          </select>
          <select className="flex-shrink-0 w-auto sm:w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white text-gray-700 text-sm appearance-none">
            <option value="">Any Pay Range</option>
            <option value="0-100">$0 - $100</option>
            <option value="100-500">$100 - $500</option>
            <option value="500+">$500+</option>
          </select>
        </div>
      </section>

      <section>
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-100 rounded-2xl p-6 text-center flex flex-col items-center justify-center">
            <AlertCircle className="w-10 h-10 text-red-500 mb-3" />
            <h3 className="text-lg font-bold text-red-800 mb-1">Oops! Something went wrong</h3>
            <p className="text-red-600 text-sm">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-red-100 text-red-700 rounded-lg font-semibold hover:bg-red-200 transition-colors text-sm"
            >
              Try Again
            </button>
          </div>
        ) : (
          <motion.div layout className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <AnimatePresence>
              {/* Mapping gigs to cards */}
              {gigs.length > 0 ? (
                gigs.map((gig) => (
                  <GigCardExplore 
                    key={gig.id}
                    gig={gig}
                    onViewDetails={setSelectedGig}
                  />
                ))
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="col-span-1 lg:col-span-2 text-center py-16 bg-gray-50 rounded-2xl border border-gray-100 border-dashed"
                >
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">No gigs posted yet</h3>
                  <p className="text-gray-500 text-sm">Be the first to post a new gig opportunity!</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </section>

      {/* Note: GigDetailsModal would need to be updated to accept the new Gig interface */}
      <GigDetailsModal 
        gig={selectedGig as any} 
        isOpen={!!selectedGig} 
        onClose={() => setSelectedGig(null)} 
      />
    </div>
  );
};

export default ExploreTab;
