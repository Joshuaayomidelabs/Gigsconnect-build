import React, { useState, useEffect } from 'react';
import { Loader2, AlertCircle, Plus } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { gigsService } from '../services/gigsService';
import { supabase } from '../services/supabaseClient';
import GigCard from '../components/GigCard';
import ApplicantsModal from '../components/ApplicantsModal';

const MyPostedGigs: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [gigs, setGigs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedGig, setSelectedGig] = useState<any | null>(null);
  const [highlightedAppId, setHighlightedAppId] = useState<string | null>(null);
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchGigs = async () => {
      try {
        setIsLoading(true);
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;

        const { data, error: fetchError } = await gigsService.getMyGigs(session.user.id);
        if (fetchError) throw fetchError;
        setGigs(data || []);

        // Check for gigId in URL to auto-open modal
        const params = new URLSearchParams(location.search);
        const gigId = params.get('gigId');
        const appId = params.get('appId');
        if (gigId && data) {
          const gig = data.find((g: any) => g.id === gigId);
          if (gig) {
            setSelectedGig(gig);
            setHighlightedAppId(appId);
          }
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGigs();
  }, [location.search]);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this gig? This action cannot be undone.')) {
      return;
    }

    try {
      setDeletingIds(prev => new Set(prev).add(id));
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { error: deleteError } = await gigsService.deleteGig(id, session.user.id);
      if (deleteError) throw deleteError;

      setGigs(prev => prev.filter(gig => gig.id !== id));
      alert('Gig deleted successfully.');
    } catch (err: any) {
      alert('Failed to delete gig: ' + err.message);
    } finally {
      setDeletingIds(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };

  return (
    <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto min-h-screen bg-brand-gray dark:bg-brand-black transition-colors duration-500">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-4xl font-black text-brand-black dark:text-brand-white tracking-tight mb-2">My Posted <span className="text-brand-purple">Gigs</span></h1>
          <p className="text-gray-500 dark:text-gray-400 text-lg">Manage the gigs you've created.</p>
        </div>
        <Link to="/post" className="hidden sm:flex items-center gap-2 bg-brand-purple text-brand-white px-6 py-3 rounded-xl font-bold hover:bg-brand-purple-hover transition-all shadow-md active:scale-95">
          <Plus className="w-5 h-5" />
          Post New Gig
        </Link>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-10 h-10 animate-spin text-brand-purple opacity-50" />
        </div>
      ) : error ? (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/40 rounded-2xl p-8 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-red-900 dark:text-red-100 mb-2">Failed to load gigs</h3>
          <p className="text-red-600 dark:text-red-400">{error}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {gigs.length > 0 ? (
            gigs.map((gig) => (
              <GigCard 
                key={gig.id} 
                gig={gig} 
                showApply={false} 
                onViewDetails={(g) => navigate(`/gig/${g.id}`)}
                onViewApplicants={(g) => setSelectedGig(g)}
                onDelete={handleDelete}
                isDeleting={deletingIds.has(gig.id)}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-20 bg-brand-white dark:bg-brand-dark-card rounded-3xl border border-brand-gray dark:border-brand-black border-dashed">
              <p className="text-gray-500 dark:text-gray-400 text-lg mb-6">You haven't posted any gigs yet.</p>
              <Link to="/post" className="inline-flex items-center gap-2 bg-brand-purple text-brand-white px-8 py-4 rounded-2xl font-bold hover:bg-brand-purple-hover transition-all shadow-lg">
                Post Your First Gig
              </Link>
            </div>
          )}
        </div>
      )}

      {selectedGig && (
        <ApplicantsModal 
          gig={selectedGig} 
          highlightedAppId={highlightedAppId}
          onClose={() => {
            setSelectedGig(null);
            setHighlightedAppId(null);
            // Clear query params
            navigate('/posted-gigs', { replace: true });
          }} 
        />
      )}
    </div>
  );
};

export default MyPostedGigs;
