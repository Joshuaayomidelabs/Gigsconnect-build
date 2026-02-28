import React, { useState, useEffect } from 'react';
import { Search, Filter, MapPin, Calendar, Loader2, AlertCircle, Music } from 'lucide-react';
// Import framer-motion for smooth animations
import { motion, AnimatePresence } from 'motion/react';
// Import the Supabase client
import { supabase } from '../../src/supabaseClient';

// --- Types ---
// In a real TS project, these would be in a separate types file
interface User {
  id: string;
  name: string;
  profileComplete: boolean;
}

interface Gig {
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

// --- Sub-components ---

// StatCard component for dashboard metrics
const StatCard = ({ title, value, trend }: { title: string, value: string | number, trend: string }) => (
  <motion.div 
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-gray-100 transition-all hover:shadow-md cursor-default"
  >
    <h3 className="text-gray-500 text-sm font-medium mb-1">{title}</h3>
    <div className="flex items-baseline gap-3">
      <span className="text-3xl font-black text-gray-900 tracking-tight">{value}</span>
      <span className="text-sm font-semibold text-blue-600">{trend}</span>
    </div>
  </motion.div>
);

// GigCard component showing individual gig details
const GigCard = ({ gig, onApply }: { gig: Gig, onApply: (id: string) => void }) => {
  // Format price with currency
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: gig.currency || 'USD',
    maximumFractionDigits: 0
  }).format(gig.price);

  return (
    <motion.div 
      layout // Enables smooth layout animations when items are added/removed
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3, type: "spring", bounce: 0.2 }}
      className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 flex flex-col h-full hover:-translate-y-1 relative group"
    >
      <div className="flex justify-between items-start mb-4 gap-4">
        <h3 className="text-lg sm:text-xl font-bold text-gray-900 leading-tight pr-2 group-hover:text-blue-600 transition-colors">
          {gig.title}
        </h3>
        <span className="px-3 py-1 bg-green-50 text-green-700 text-xs sm:text-sm font-bold rounded-full whitespace-nowrap flex-shrink-0 border border-green-100">
          {formattedPrice}
        </span>
      </div>
      
      <div className="flex flex-col gap-2 mb-4">
        <div className="flex items-center gap-2 mb-1">
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
        
        <div className="flex items-center gap-2 text-gray-500 text-sm font-medium">
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
          onClick={() => onApply(gig.id)}
          className="flex-1 py-3 px-4 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-colors text-sm shadow-sm flex justify-center items-center active:scale-95"
        >
          Apply Now
        </button>
      </div>
    </motion.div>
  );
};

// --- Main Component ---

const HomeScreen = () => {
  const [user, setUser] = useState<User | null>(null);
  const [gigs, setGigs] = useState<Gig[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 1. Fetch initial data and setup subscriptions
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Initial fetch for user profile
        // Get current authenticated user
        const { data: authData } = await supabase.auth.getUser();
        
        if (authData.user) {
          // Fetch user profile data
          const { data: userData } = await supabase
            .from('users')
            .select('*')
            .eq('id', authData.user.id)
            .single();
            
          if (userData) setUser(userData);
        }

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
        console.error("Error fetching data:", err);
        setError(err.message || "Failed to load gigs. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();

    // Realtime subscription for gigs
    // Subscribe to real-time INSERT events on the gigs table so new gigs appear automatically.
    const gigsSubscription = supabase
      .channel('public:gigs:home')
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'gigs' 
      }, async (payload) => {
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

    // Realtime subscription for user updates
    // Subscribe to user profile updates (e.g., completing profile)
    const userSubscription = supabase
      .channel('public:users')
      .on('postgres_changes', { 
        event: 'UPDATE', 
        schema: 'public', 
        table: 'users' 
      }, (payload) => {
        // Update local user state if the updated record matches the current user
        setUser((currentUser) => {
          if (currentUser && payload.new.id === currentUser.id) {
            return payload.new as User;
          }
          return currentUser;
        });
      })
      .subscribe();

    // Cleanup subscriptions on unmount
    return () => {
      supabase.removeChannel(gigsSubscription);
      supabase.removeChannel(userSubscription);
    };
  }, [user?.id]);

  const handleApply = (gigId: string) => {
    // Implement apply logic here
    console.log(`Applying to gig: ${gigId}`);
    alert('Application submitted successfully!');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-8 relative z-10">
      
      {/* Updating welcome message dynamically */}
      <section>
        <div className="h-[80px] sm:h-[88px] flex flex-col justify-center">
          <AnimatePresence mode="wait">
            <motion.div 
              key={user?.profileComplete ? 'complete' : 'incomplete'}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
                {user?.profileComplete ? `Welcome, ${user.name?.split(' ')[0] || 'User'}!` : 'Welcome, New User!'}
              </h1>
              <p className="text-gray-500 mt-1 text-base sm:text-lg">
                {user?.profileComplete 
                  ? 'Here are the latest gigs for you' 
                  : 'Complete your profile to unlock more opportunities'}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* Stats Section */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        <StatCard title="Available Gigs" value={gigs.length} trend="Live Updates" />
        <StatCard title="My Applications" value="0" trend="0 pending" />
        <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-gray-100 flex flex-col justify-center transition-all hover:shadow-md cursor-default">
          <h3 className="text-gray-500 text-sm font-medium mb-1">Profile Status</h3>
          <div className="flex items-center gap-3">
            <span className="text-2xl font-black text-gray-900 tracking-tight">
              {user?.profileComplete ? 'Complete' : 'Incomplete'}
            </span>
            <span className={`px-3 py-1 text-[10px] font-bold rounded-full uppercase tracking-wider border ${user?.profileComplete ? 'bg-green-50 text-green-700 border-green-100' : 'bg-orange-50 text-orange-700 border-orange-100'}`}>
              {user?.profileComplete ? 'Verified' : 'Action Needed'}
            </span>
          </div>
        </div>
      </section>

      {/* 2. Real-Time Gig Feed */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 w-full sm:w-auto tracking-tight">
            Live Gig Feed
          </h2>
          <div className="flex w-full sm:w-auto gap-3">
            <div className="relative flex-1 sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input type="text" placeholder="Search gigs..." className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all text-sm" />
            </div>
            <button className="p-3 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors flex items-center justify-center active:scale-95">
              <Filter className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Animated Feed Logic */}
        {error ? (
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
          <motion.div layout className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AnimatePresence>
              {/* Mapping gigs to cards */}
              {/* Map over the gigs array and render a GigCard for each, passing the gig details 
                  (poster name, category, and event details). */}
              {gigs.length > 0 ? (
                gigs.map((gig) => (
                  <GigCard 
                    key={gig.id}
                    gig={gig}
                    onApply={handleApply}
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
                  <p className="text-gray-500 text-sm">Check back later for new opportunities!</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </section>
    </div>
  );
};

export default HomeScreen;
