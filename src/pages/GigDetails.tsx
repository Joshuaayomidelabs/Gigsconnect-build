import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Calendar, Loader2, CheckCircle, ArrowLeft, ArrowRight, Trash2, AlertTriangle, ShieldCheck } from 'lucide-react';
import { SEO } from '../components/SEO';
import { toast } from 'sonner';
import { gigsService } from '../services/gigsService';
import { applicationsService } from '../services/applicationsService';
import { supabase } from '../services/supabaseClient';
import { formatCurrency, formatDate } from '../utils/helpers';
import VerificationBadge from '../components/VerificationBadge';
import { handleError, notifyError } from '../utils/errorHandler';
import { getCategoryConfig } from '../utils/categoryStyles';

const GigDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [gig, setGig] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [, setSuccess] = useState(false);
  const [hasAlreadyApplied, setHasAlreadyApplied] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    const fetchGigAndStatus = async () => {
      if (!id) return;
      try {
        const { data, error } = await gigsService.getGigById(id);
        if (error) throw error;
        setGig(data);

        // Check if current user has already applied
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          const { hasApplied } = await applicationsService.checkIfApplied(id, session.user.id);
          setHasAlreadyApplied(hasApplied);
          
          // Check if owner
          const posterUserId = data.poster_id?.id || data.poster_id?.user_id;
          if (posterUserId === session.user.id) {
            setIsOwner(true);
          }
        }
      } catch (err: any) {
        console.error('Error in fetchGigAndStatus:', err);
        handleError(err, "Operation Error");
        navigate('/browse');
      } finally {
        setIsLoading(false);
      }
    };
    fetchGigAndStatus();
  }, [id, navigate]);

  const handleApply = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    setIsSubmitting(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const applicantId = session?.user?.id;

      if (!applicantId) {
        notifyError("Please log in first");
        navigate('/login');
        return;
      }

      if (!gig?.id) {
        notifyError("Gig details not loaded");
        return;
      }

      const { data: appData, error: appError } = await applicationsService.applyToGig({
        gig_id: gig.id,
        message: "I am interested in this gig.",
      });

      if (appError) {
        if ((appError as any).code === '23505') {
          notifyError("You have already applied to this gig.");
          setHasAlreadyApplied(true);
        } else {
          handleError(appError, "Operation Error");
        }
        return;
      }

      console.log("Application data:", appData);
      setSuccess(true);
      setHasAlreadyApplied(true);
      toast.success("Application submitted successfully!");
    } catch (err) {
      console.error("Unexpected error:", err);
      notifyError("Something went wrong. Try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = () => {
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    setShowDeleteConfirm(false);
    setIsDeleting(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session || !gig) return;

      const { error: deleteError } = await gigsService.deleteGig(gig.id, session.user.id);
      if (deleteError) throw deleteError;

      toast.success('Gig deleted successfully.');
      navigate('/posted-gigs');
    } catch (err: any) {
      handleError(err, "Operation Error");
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-brand-gray dark:bg-brand-black transition-colors">
        <Loader2 className="w-10 h-10 animate-spin text-brand-purple" />
      </div>
    );
  }

  if (!gig) return null;

  const posterId = gig.poster_id?.id || gig.poster_id?.user_id;
  const mediaUrl = gig.image_url || gig.image || gig.media_url || gig.media || gig.cover_image;
  const categoryConfig = getCategoryConfig(gig.gig_category);
  const CategoryIcon = categoryConfig.icon;

  return (
    <div className="pt-main pb-28 sm:pb-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto min-h-screen bg-brand-gray dark:bg-brand-black transition-colors duration-500">
      <SEO 
        title={`${gig.title} | GigsConnect`}
        description={gig.description ? gig.description.substring(0, 150) + '...' : 'Gig opportunity on GigsConnect'}
        type="article"
        canonical={`https://gigsconnect.africa/gig/${gig.id}`}
      />

      {/* Back button above card */}
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-brand-black dark:text-brand-white hover:text-brand-purple font-bold mb-4 transition-colors group text-sm"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Back to Gigs
      </button>

      {/* Main Gig Details Card */}
      <div className="bg-white dark:bg-brand-dark-card rounded-2xl shadow-sm border border-gray-100 dark:border-brand-dark-card overflow-hidden transition-all">
        
        {/* Category Gradient Header (or image if gig has one) with Back Button */}
        <div className="relative w-full overflow-hidden">
          {mediaUrl ? (
            <div className="aspect-[21/9] sm:aspect-[24/9] w-full bg-gray-100 dark:bg-brand-black">
              <img 
                src={mediaUrl} 
                alt={gig.title} 
                className="w-full h-full object-cover" 
              />
            </div>
          ) : (
            <div className={`h-40 sm:h-52 w-full bg-gradient-to-br ${categoryConfig.gradient} flex items-center justify-center`}>
              <CategoryIcon className="w-16 h-16 sm:w-20 sm:h-20 stroke-[1.75] opacity-90 transition-transform hover:scale-105 duration-300" />
            </div>
          )}

          {/* Quick Back Button inside header badge */}
          <button 
            onClick={() => navigate(-1)}
            aria-label="Back"
            className="absolute top-4 left-4 p-2 rounded-full bg-white/80 dark:bg-brand-black/80 backdrop-blur-md text-brand-black dark:text-brand-white hover:bg-white dark:hover:bg-brand-black transition-all shadow-sm active:scale-95"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
        </div>

        {/* Header Section */}
        <div className="p-6 sm:p-8 border-b border-gray-100 dark:border-brand-dark-card">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-6">
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-brand-black dark:text-white tracking-tight mb-4">
                {gig.title}
              </h1>

              {/* Pills for budget, location, and category */}
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <span className="px-3.5 py-1.5 bg-brand-purple/10 dark:bg-brand-purple/20 text-brand-purple text-sm font-black rounded-full">
                  {formatCurrency(gig.budget || 0, gig.currency || 'USD')}
                </span>
                <span className="px-3.5 py-1.5 bg-brand-purple/10 dark:bg-brand-purple/20 border border-brand-purple/20 text-brand-purple text-xs font-bold rounded-full">
                  {gig.gig_category || 'Gig'}
                </span>
                <span className="px-3.5 py-1.5 bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-300 text-xs font-semibold rounded-full flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-brand-purple" />
                  {gig.location || 'Remote'}
                </span>
                {gig.deadline && (
                  <span className="px-3.5 py-1.5 bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-300 text-xs font-semibold rounded-full flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-brand-purple" />
                    Deadline: {formatDate(gig.deadline)}
                  </span>
                )}
              </div>
            </div>

            {/* Poster Info Card */}
            <div 
              className="flex items-center gap-3 bg-gray-50 dark:bg-brand-black/60 p-3.5 rounded-2xl border border-gray-100 dark:border-zinc-800 cursor-pointer hover:border-brand-purple/30 transition-all shrink-0"
              onClick={() => posterId && navigate(`/profile/${posterId}`)}
            >
              <div className="w-11 h-11 rounded-full bg-brand-purple/10 overflow-hidden ring-1 ring-brand-purple/20 flex items-center justify-center shrink-0">
                {gig.poster_id?.avatar_url ? (
                  <img src={gig.poster_id.avatar_url} alt="" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-brand-purple font-black text-sm">
                    {gig.poster_id?.full_name?.charAt(0).toUpperCase() || 'U'}
                  </span>
                )}
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Posted by</p>
                <div className="text-sm font-bold text-brand-black dark:text-white flex items-center gap-1 truncate">
                  <span className="truncate">{gig.poster_id?.full_name || 'Anonymous'}</span>
                  <VerificationBadge 
                    verificationStatus={gig.poster_id?.verification_status} 
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Owner actions */}
          {isOwner && (
            <div className="mt-6 pt-4 border-t border-gray-100 dark:border-zinc-800/80 flex justify-end">
              <button 
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 text-xs font-bold hover:bg-red-100 dark:hover:bg-red-900/30 transition-all active:scale-95 disabled:opacity-50"
              >
                {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                Delete Gig Listing
              </button>
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="p-6 sm:p-8 space-y-8">
          {/* About this gig section */}
          <div>
            <h2 className="text-xl font-bold text-brand-black dark:text-white mb-3">
              About this gig
            </h2>
            <div className="text-gray-700 dark:text-gray-300 text-sm sm:text-base leading-relaxed whitespace-pre-wrap font-normal">
              {gig.description}
            </div>
          </div>

          {/* Skills Required Chips Row (Rendered ONLY if gig has a skills field with items) */}
          {Array.isArray(gig.skills) && gig.skills.length > 0 && (
            <div>
              <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                Skills required
              </h3>
              <div className="flex flex-wrap gap-2">
                {gig.skills.map((skill: string, index: number) => (
                  <span 
                    key={index}
                    className="px-3.5 py-1.5 rounded-full bg-brand-purple/10 dark:bg-brand-purple/20 text-brand-purple text-xs font-semibold"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Desktop Prominent Full-Width Apply Button */}
          <div className="hidden sm:block pt-6 border-t border-gray-100 dark:border-brand-dark-card">
            {!hasAlreadyApplied ? (
              <div className="space-y-3">
                <button 
                  onClick={handleApply}
                  disabled={isSubmitting}
                  className="w-full py-4 px-8 rounded-2xl font-bold text-base bg-brand-purple text-white hover:bg-brand-purple-hover active:scale-[0.99] transition-all shadow-md flex items-center justify-center gap-2.5 disabled:opacity-70 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Submitting Application...
                    </>
                  ) : (
                    <>
                      Apply Now
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
                <p className="text-center text-xs text-gray-500 dark:text-gray-400 font-medium flex items-center justify-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-brand-purple" />
                  Your profile and contact info will be sent to the gig poster.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <button 
                  disabled
                  className="w-full py-4 px-8 rounded-2xl font-bold text-base bg-gray-100 dark:bg-zinc-800 text-gray-400 dark:text-zinc-500 cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  Already Applied for this Gig
                </button>
                <p className="text-center text-xs text-gray-500 dark:text-gray-400">
                  You have already submitted an application for this gig. Track it under My Applications.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sticky Bottom Apply Button on Mobile above bottom nav and safe area */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-30 p-3 bg-white/95 dark:bg-brand-black/95 backdrop-blur-md border-t border-gray-100 dark:border-brand-dark-card pb-[calc(0.75rem+env(safe-area-inset-bottom))] shadow-lg">
        {!hasAlreadyApplied ? (
          <button 
            onClick={handleApply}
            disabled={isSubmitting}
            className="w-full py-3.5 px-6 rounded-2xl font-bold text-base bg-brand-purple text-white hover:bg-brand-purple-hover active:scale-95 transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Applying...
              </>
            ) : (
              <>
                Apply Now
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        ) : (
          <button 
            disabled
            className="w-full py-3.5 px-6 rounded-2xl font-bold text-base bg-gray-100 dark:bg-zinc-800 text-gray-400 dark:text-zinc-500 cursor-not-allowed flex items-center justify-center gap-2"
          >
            <CheckCircle className="w-5 h-5 text-green-500" />
            Already Applied
          </button>
        )}
      </div>

      {/* Deletion Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div 
            className="bg-white dark:bg-brand-dark-card p-6 sm:p-8 rounded-2xl max-w-sm w-full shadow-2xl border border-gray-100 dark:border-zinc-800 text-center animate-in fade-in zoom-in-95 duration-200"
          >
            <div className="w-14 h-14 rounded-2xl bg-red-50 dark:bg-red-950/20 flex items-center justify-center mb-4 text-red-600 dark:text-red-400 mx-auto">
              <AlertTriangle className="w-7 h-7" />
            </div>

            <h3 className="text-lg font-bold text-brand-black dark:text-brand-white mb-2">Delete Gig Listing?</h3>
            <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm font-medium leading-relaxed mb-6">
              Are you sure you want to delete this listing? All applicant submissions will be permanently removed.
            </p>

            <div className="flex gap-3">
              <button 
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 py-3 px-4 rounded-xl border border-gray-200 dark:border-zinc-700 text-brand-black dark:text-brand-white text-xs font-bold hover:bg-gray-50 dark:hover:bg-zinc-800 active:scale-95 transition-all"
              >
                Cancel
              </button>
              <button 
                type="button"
                onClick={handleConfirmDelete}
                className="flex-1 py-3 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold active:scale-95 transition-all flex items-center justify-center gap-2 shadow-sm"
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

export default GigDetails;
