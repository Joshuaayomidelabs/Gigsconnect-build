import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Calendar, FileText, Loader2, CheckCircle, ArrowLeft, Trash2 } from 'lucide-react';
import { gigsService } from '../services/gigsService';
import { applicationsService } from '../services/applicationsService';
import { supabase } from '../services/supabaseClient';
import { formatCurrency, formatDate } from '../utils/helpers';

const GigDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [gig, setGig] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState('');
  const [portfolioLink, setPortfolioLink] = useState('');
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [hasAlreadyApplied, setHasAlreadyApplied] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchGigAndStatus = async () => {
      if (!id) return;
      try {
        console.log('Fetching gig details for ID:', id);
        const { data, error } = await gigsService.getGigById(id);
        if (error) throw error;
        setGig(data);

        // Check if current user has already applied
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          console.log('Checking application status for user:', session.user.id);
          const { hasApplied } = await applicationsService.checkIfApplied(id, session.user.id);
          setHasAlreadyApplied(hasApplied);
          
          // Check if owner
          if (data.poster_id?.user_id === session.user.id) {
            setIsOwner(true);
          }
          
          if (hasApplied) {
            console.log('User has already applied to this gig');
          }
        }
      } catch (err: any) {
        console.error('Error in fetchGigAndStatus:', err);
        alert(err.message);
        navigate('/browse');
      } finally {
        setIsLoading(false);
      }
    };
    fetchGigAndStatus();
  }, [id, navigate]);

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Apply button clicked');
    
    setIsSubmitting(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const applicantId = session?.user?.id;

      if (!applicantId) {
        alert("Please log in first");
        return;
      }

      // Ensure gig object exists
      if (!gig?.id) {
        alert("Gig details not loaded");
        return;
      }

      // Use gig.poster_id.user_id as owner_id
      const gigOwnerId = gig?.poster_id?.user_id || null;
      const applicationMessage = message;
      const userPortfolioLink = portfolioLink;

      // Submit gig application using service
      const { data: appData, error: appError } = await applicationsService.applyToGig({
        gig_id: gig.id,
        applicant_id: applicantId,
        gig_owner_id: gigOwnerId,
        message: applicationMessage || "",
        portfolio_link: userPortfolioLink || undefined,
      });

      if (appError) {
        console.error("Application error:", appError);
        if (appError.code === '23505') {
          alert("You have already applied to this gig.");
        } else {
          alert("Application failed: " + appError.message);
        }
        return;
      }

      console.log("Application data:", appData);
      setSuccess(true);
      setHasAlreadyApplied(true);
      alert("Application submitted successfully!");

    } catch (err) {
      console.error("Unexpected error:", err);
      alert("Something went wrong. Try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this gig? This action cannot be undone.')) {
      return;
    }

    setIsDeleting(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session || !gig) return;

      const { error: deleteError } = await gigsService.deleteGig(gig.id, session.user.id);
      if (deleteError) throw deleteError;

      alert('Gig deleted successfully.');
      navigate('/posted-gigs');
    } catch (err: any) {
      alert('Failed to delete gig: ' + err.message);
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

  return (
    <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto min-h-screen bg-brand-gray dark:bg-brand-black transition-colors duration-500">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-brand-black dark:text-brand-white hover:text-brand-purple font-bold mb-8 transition-colors group"
      >
        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        Back to Gigs
      </button>

      <div className="bg-brand-white dark:bg-brand-dark-card rounded-[2.5rem] shadow-xl border border-brand-gray dark:border-brand-black overflow-hidden transition-colors">
        <div className="p-8 sm:p-12 border-b border-brand-gray dark:border-brand-black">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-6">
            <div>
              <h1 className="text-4xl font-black text-brand-black dark:text-brand-white tracking-tight mb-4">{gig.title}</h1>
              <div className="flex flex-wrap gap-3">
                <span className="px-4 py-1.5 bg-brand-purple/10 dark:bg-brand-purple/20 text-brand-purple text-sm font-black rounded-full border border-brand-purple/10 dark:border-brand-purple/20">
                  {formatCurrency(gig.budget || 0, gig.currency || 'USD')}
                </span>
                <span className="px-4 py-1.5 bg-brand-purple/10 dark:bg-brand-purple/20 text-brand-purple text-sm font-black rounded-full border border-brand-purple/10 dark:border-brand-purple/20">
                  {gig.gig_category}
                </span>
              </div>
            </div>
            <div 
              className="flex items-center gap-4 bg-brand-gray dark:bg-brand-black p-4 rounded-2xl border border-brand-gray dark:border-brand-black cursor-pointer hover:bg-brand-purple/5 dark:hover:bg-brand-purple/20 transition-all group"
              onClick={() => gig.poster_id?.user_id && navigate(`/profile/${gig.poster_id.user_id}`)}
            >
              <div className="w-12 h-12 rounded-full bg-brand-purple/10 dark:bg-brand-purple/20 border-2 border-brand-purple overflow-hidden group-hover:scale-105 transition-transform">
                {gig.poster_id?.avatar_url ? (
                  <img src={gig.poster_id.avatar_url} alt="" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-brand-purple font-bold">
                    {gig.poster_id?.full_name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                )}
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">Posted by</p>
                <p className="text-sm font-black text-brand-black dark:text-brand-white group-hover:text-brand-purple transition-colors">{gig.poster_id?.full_name || 'Unknown'}</p>
              </div>
            </div>
          </div>
          
          {isOwner && (
            <div className="mt-6 flex justify-end">
              <button 
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-red-50 dark:bg-red-900/10 text-red-500 font-bold hover:bg-red-100 dark:hover:bg-red-900/20 transition-all active:scale-95 disabled:opacity-50"
              >
                {isDeleting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Trash2 className="w-5 h-5" />}
                Delete Gig
              </button>
            </div>
          )}
        </div>

        <div className="p-8 sm:p-12 space-y-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex items-center gap-4 p-6 rounded-3xl bg-brand-gray dark:bg-brand-black border border-brand-gray dark:border-brand-black">
              <div className="p-3 bg-brand-white dark:bg-brand-dark-card rounded-2xl shadow-sm">
                <MapPin className="w-6 h-6 text-brand-purple" />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">Location</p>
                <p className="text-lg font-black text-brand-black dark:text-brand-white">{gig.location}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-6 rounded-3xl bg-brand-gray dark:bg-brand-black border border-brand-gray dark:border-brand-black">
              <div className="p-3 bg-brand-white dark:bg-brand-dark-card rounded-2xl shadow-sm">
                <Calendar className="w-6 h-6 text-brand-purple" />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">Deadline</p>
                <p className="text-lg font-black text-brand-black dark:text-brand-white">{gig.deadline ? formatDate(gig.deadline) : 'TBD'}</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-black text-brand-black dark:text-brand-white mb-6 flex items-center gap-3">
              <FileText className="w-6 h-6 text-brand-purple" />
              Gig Description
            </h3>
            <div className="text-brand-black dark:text-brand-white text-lg leading-relaxed bg-brand-gray dark:bg-brand-black p-8 rounded-[2rem] border border-brand-gray dark:border-brand-black whitespace-pre-wrap">
              {gig.description}
            </div>
          </div>

          {!showApplyForm ? (
            <>
              <div className="pt-8 flex flex-col items-center gap-4">
                <button 
                  id="main-apply-btn"
                  onClick={() => !hasAlreadyApplied && setShowApplyForm(true)}
                  disabled={hasAlreadyApplied}
                  className={`w-full sm:w-auto px-12 py-5 rounded-2xl font-black transition-all shadow-xl active:scale-95 text-xl flex items-center justify-center gap-3 group ${
                    hasAlreadyApplied 
                      ? 'bg-brand-gray dark:bg-brand-dark-card text-gray-500 dark:text-gray-400 cursor-not-allowed' 
                      : 'bg-brand-purple text-brand-white font-black hover:bg-brand-purple-hover shadow-brand-purple/20'
                  }`}
                >
                  {hasAlreadyApplied ? 'Already Applied' : 'Apply for this Gig'}
                  {!hasAlreadyApplied && <ArrowLeft className="w-6 h-6 rotate-180 group-hover:translate-x-1 transition-transform" />}
                </button>
                <p className="text-sm font-bold text-gray-500 dark:text-gray-400">
                  {hasAlreadyApplied ? 'You have already submitted an application for this gig.' : 'Fast response expected • Secure payment'}
                </p>
              </div>

              {/* Mobile Sticky Apply Button */}
              {!hasAlreadyApplied && (
                <div className="fixed bottom-24 left-4 right-4 z-40 sm:hidden animate-in fade-in slide-in-from-bottom-10 duration-500">
                  <button 
                    onClick={() => {
                      setShowApplyForm(true);
                      window.scrollTo({ top: document.getElementById('main-apply-btn')?.offsetTop ? document.getElementById('main-apply-btn')!.offsetTop - 100 : 0, behavior: 'smooth' });
                    }}
                    className="w-full py-4 rounded-2xl bg-brand-purple text-brand-white font-black shadow-2xl shadow-brand-purple/40 flex items-center justify-center gap-2 active:scale-95 border-2 border-brand-white/20 dark:border-brand-dark-card/20 backdrop-blur-md"
                  >
                    Apply Now
                    <ArrowLeft className="w-5 h-5 rotate-180" />
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="bg-brand-purple/5 dark:bg-brand-purple/20 p-8 rounded-[2.5rem] border border-brand-purple/10 dark:border-brand-purple/20 space-y-6 animate-in fade-in slide-in-from-bottom-4">
              <h3 className="text-2xl font-black text-brand-black dark:text-brand-white">Submit Your Application</h3>
              {success ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
                  <p className="text-green-700 dark:text-green-400 text-xl font-black mb-2">Application Sent!</p>
                  <p className="text-green-600 dark:text-green-500">The creator has been notified. You can track this in your dashboard.</p>
                  <button 
                    onClick={() => navigate('/overview')}
                    className="mt-8 px-8 py-3 bg-green-600 text-brand-white rounded-xl font-bold"
                  >
                    Go to Overview
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApply} className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-brand-black dark:text-brand-white mb-2">Why are you a good fit? *</label>
                    <textarea 
                      required
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows={4}
                      className="w-full p-4 rounded-2xl border border-brand-gray dark:border-brand-black focus:ring-2 focus:ring-brand-purple focus:border-transparent transition-all outline-none bg-brand-white dark:bg-brand-dark-card text-brand-black dark:text-brand-white resize-none"
                      placeholder="Share your experience and why you want this gig..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-brand-black dark:text-brand-white mb-2">Portfolio Link (Optional)</label>
                    <input 
                      type="url"
                      value={portfolioLink}
                      onChange={(e) => setPortfolioLink(e.target.value)}
                      className="w-full p-4 rounded-2xl border border-brand-gray dark:border-brand-black focus:ring-2 focus:ring-brand-purple focus:border-transparent transition-all outline-none bg-brand-white dark:bg-brand-dark-card text-brand-black dark:text-brand-white"
                      placeholder="https://yourportfolio.com"
                    />
                  </div>
                  <div className="flex gap-4 pt-4">
                    <button 
                      type="button"
                      onClick={() => setShowApplyForm(false)}
                      className="flex-1 py-4 rounded-2xl border border-brand-gray dark:border-brand-black text-brand-black dark:text-brand-white font-bold hover:bg-brand-purple/5 dark:hover:bg-brand-purple/20 transition-all"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-[2] py-4 rounded-2xl bg-brand-purple text-brand-white font-black hover:bg-brand-purple-hover transition-all shadow-lg flex items-center justify-center gap-2 active:scale-95 disabled:opacity-70"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Submitting...
                        </>
                      ) : 'Submit Application'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GigDetails;
