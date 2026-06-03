import React, { useState, useEffect } from 'react';
import { Loader2, AlertCircle, Plus, Trash2, AlertTriangle, X } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { gigsService } from '../services/gigsService';
import { supabase } from '../services/supabaseClient';
import GigCard from '../components/GigCard';
import { GigCardSkeleton } from '../components/Skeleton';
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
  const [gigToDelete, setGigToDelete] = useState<string | null>(null);

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

  const handleDelete = (id: string) => {
    setGigToDelete(id);
  };

  const handleConfirmDelete = async () => {
    if (!gigToDelete) return;

    const targetId = gigToDelete;
    setGigToDelete(null); // immediately close modal

    try {
      setDeletingIds(prev => new Set(prev).add(targetId));
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { error: deleteError } = await gigsService.deleteGig(targetId, session.user.id);
      if (deleteError) throw deleteError;

      setGigs(prev => prev.filter(gig => gig.id !== targetId));
      toast.success('Gig deleted successfully.');
    } catch (err: any) {
      toast.error('Failed to delete gig: ' + err.message);
    } finally {
      setDeletingIds(prev => {
        const next = new Set(prev);
        next.delete(targetId);
        return next;
      });
    }
  };

  return (
    <div className="pt-main pb-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto min-h-screen bg-brand-gray dark:bg-brand-black transition-colors duration-500">
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <GigCardSkeleton key={i} />
          ))}
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

      {/* CUSTOM GIG DELETION CONFIRMATION DIALOG */}
      {gigToDelete && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div 
            className="bg-white dark:bg-brand-dark-card p-6 sm:p-8 rounded-[2rem] max-w-sm w-full shadow-2xl border border-gray-105 dark:border-[#2A2A2F] text-center animate-in fade-in zoom-in-95 duration-200"
          >
            <div className="w-16 h-16 rounded-2xl bg-red-50 dark:bg-red-950/20 flex items-center justify-center mb-6 text-red-600 dark:text-red-400 mx-auto">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <h3 className="text-xl font-bold text-brand-black dark:text-brand-white mb-2">Delete Gig Listing?</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium leading-relaxed mb-6">
              Are you sure you want to delete this listing? This action cannot be undone and all associated application logs will follow.
            </p>

            <div className="flex gap-3">
              <button 
                type="button"
                onClick={() => setGigToDelete(null)}
                className="flex-1 py-3.5 px-4 rounded-xl border border-gray-200 dark:border-brand-black text-brand-black dark:text-brand-white text-sm font-bold hover:bg-brand-gray dark:hover:bg-brand-black active:scale-95 transition-all"
              >
                Cancel
              </button>
              <button 
                type="button"
                onClick={handleConfirmDelete}
                className="flex-1 py-3.5 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-bold active:scale-95 transition-all text-center flex items-center justify-center gap-2 shadow-md hover:shadow-red-500/10"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyPostedGigs;
