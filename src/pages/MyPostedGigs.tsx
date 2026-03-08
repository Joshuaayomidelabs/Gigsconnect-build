import React, { useState, useEffect } from 'react';
import { Loader2, AlertCircle, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { gigsService } from '../services/gigsService';
import { supabase } from '../services/supabaseClient';
import GigCard from '../components/GigCard';

const MyPostedGigs: React.FC = () => {
  const [gigs, setGigs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGigs = async () => {
      try {
        setIsLoading(true);
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;

        const { data, error: fetchError } = await gigsService.getMyGigs(session.user.id);
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

  return (
    <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto min-h-screen bg-brand-gray">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-4xl font-black text-brand-black tracking-tight mb-2">My Posted <span className="text-brand-purple">Gigs</span></h1>
          <p className="text-brand-gray-dark text-lg">Manage the gigs you've created.</p>
        </div>
        <Link to="/post" className="hidden sm:flex items-center gap-2 bg-brand-purple text-white px-6 py-3 rounded-xl font-bold hover:bg-brand-purple-dark transition-all shadow-md active:scale-95 purple-glow">
          <Plus className="w-5 h-5" />
          Post New Gig
        </Link>
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {gigs.length > 0 ? (
            gigs.map((gig) => (
              <GigCard key={gig.id} gig={gig} showApply={false} />
            ))
          ) : (
            <div className="col-span-full text-center py-20 bg-white rounded-3xl border border-brand-purple-light/20 border-dashed">
              <p className="text-brand-gray-dark text-lg mb-6">You haven't posted any gigs yet.</p>
              <Link to="/post" className="inline-flex items-center gap-2 bg-brand-purple text-white px-8 py-4 rounded-2xl font-bold hover:bg-brand-purple-dark transition-all shadow-lg purple-glow">
                Post Your First Gig
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MyPostedGigs;
