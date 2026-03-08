import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { MapPin, Calendar, DollarSign, FileText, Loader2, CheckCircle, ArrowLeft, AlertCircle, Zap, Shield } from 'lucide-react';
import { gigsService } from '../services/gigsService';
import { applicationsService } from '../services/applicationsService';
import { supabase } from '../services/supabaseClient';
import { formatCurrency, formatDate } from '../utils/helpers';
import { motion, AnimatePresence } from 'motion/react';

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
  const [userPlan, setUserPlan] = useState('starter');
  const [appCount, setAppCount] = useState(0);
  const [isLimitReached, setIsLimitReached] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      try {
        // Fetch Gig
        const { data: gigData, error: gigError } = await gigsService.getGigById(id);
        if (gigError) throw gigError;
        setGig(gigData);

        // Fetch User Plan and App Count
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('subscription_plan')
            .eq('id', session.user.id)
            .single();
          
          const plan = profile?.subscription_plan || 'starter';
          setUserPlan(plan);

          if (plan === 'starter') {
            const { count } = await applicationsService.getApplicationsCountThisMonth(session.user.id);
            setAppCount(count || 0);
            if ((count || 0) >= 20) {
              setIsLimitReached(true);
            }
          }
        }
      } catch (err: any) {
        console.error(err.message);
        navigate('/browse');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [id, navigate]);

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!gig) return;

    if (isLimitReached) {
      alert('You have reached your monthly limit of 20 gig applications. Please upgrade to continue.');
      return;
    }
    
    setIsSubmitting(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Login required to apply');

      const { error } = await applicationsService.applyToGig({
        gig_id: gig.id,
        applicant_id: session.user.id,
        message,
        portfolio_link: portfolioLink
      });

      if (error) {
        if (error.code === '23505') throw new Error('You have already applied to this gig.');
        throw error;
      }

      setSuccess(true);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-brand-gray">
        <Loader2 className="w-10 h-10 animate-spin text-brand-purple" />
      </div>
    );
  }

  if (!gig) return null;

  return (
    <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto min-h-screen bg-brand-gray">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-brand-gray-dark hover:text-brand-purple font-bold mb-8 transition-colors group"
      >
        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        Back to Gigs
      </button>

      <div className="bg-white rounded-[2.5rem] shadow-xl border border-brand-purple-light/20 overflow-hidden">
        <div className="p-8 sm:p-12 border-b border-brand-gray">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-6">
            <div className="flex-1">
              <h1 className="text-4xl font-black text-brand-black tracking-tight mb-4 leading-tight">{gig.title}</h1>
              <div className="flex flex-wrap gap-3">
                <span className="px-4 py-1.5 bg-green-50 text-green-700 text-sm font-black rounded-full border border-green-100 shadow-sm">
                  {formatCurrency(gig.budget || 0)}
                </span>
                <span className="px-4 py-1.5 bg-brand-purple-soft text-brand-purple text-sm font-black rounded-full border border-brand-purple-light/30 shadow-sm">
                  {gig.gig_category}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-4 bg-brand-gray p-4 rounded-2xl border border-brand-purple-light/10">
              <div className="w-12 h-12 rounded-full bg-brand-purple-soft border-2 border-brand-purple overflow-hidden shadow-sm">
                {gig.profiles?.profile_photo ? (
                  <img src={gig.profiles.profile_photo} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-brand-purple font-bold">
                    {gig.profiles?.full_name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                )}
              </div>
              <div>
                <p className="text-xs font-bold text-brand-gray-dark uppercase tracking-widest">Posted by</p>
                <p className="text-sm font-black text-brand-black">{gig.profiles?.full_name || 'Unknown'}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-8 sm:p-12 space-y-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex items-center gap-4 p-6 rounded-3xl bg-brand-gray border border-brand-purple-light/10">
              <div className="p-3 bg-white rounded-2xl shadow-sm">
                <MapPin className="w-6 h-6 text-brand-purple" />
              </div>
              <div>
                <p className="text-xs font-bold text-brand-gray-dark uppercase tracking-widest">Location</p>
                <p className="text-lg font-black text-brand-black">{gig.location}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-6 rounded-3xl bg-brand-gray border border-brand-purple-light/10">
              <div className="p-3 bg-white rounded-2xl shadow-sm">
                <Calendar className="w-6 h-6 text-brand-purple" />
              </div>
              <div>
                <p className="text-xs font-bold text-brand-gray-dark uppercase tracking-widest">Deadline</p>
                <p className="text-lg font-black text-brand-black">{gig.deadline ? formatDate(gig.deadline) : 'TBD'}</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-black text-brand-black mb-6 flex items-center gap-3">
              <FileText className="w-6 h-6 text-brand-purple" />
              Gig Description
            </h3>
            <div className="text-brand-gray-dark text-lg leading-relaxed bg-brand-gray p-8 rounded-[2rem] border border-brand-purple-light/10 whitespace-pre-wrap">
              {gig.description}
            </div>
          </div>

          <AnimatePresence mode="wait">
            {!showApplyForm ? (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="pt-8 flex justify-center"
              >
                <button 
                  onClick={() => setShowApplyForm(true)}
                  className="px-12 py-5 rounded-2xl bg-brand-purple text-white font-black hover:bg-brand-purple-dark transition-all shadow-xl active:scale-95 text-lg purple-glow"
                >
                  Apply for this Gig
                </button>
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-brand-purple-soft/30 p-8 sm:p-10 rounded-[2.5rem] border border-brand-purple-light/30 space-y-8"
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-2xl font-black text-brand-purple">Submit Your Application</h3>
                  {userPlan === 'starter' && (
                    <div className="text-xs font-bold text-brand-purple px-3 py-1 bg-white rounded-full border border-brand-purple-light/20">
                      {appCount}/20 Applications Used
                    </div>
                  )}
                </div>

                {isLimitReached ? (
                  <div className="bg-white p-8 rounded-3xl border-2 border-brand-purple shadow-xl text-center space-y-6">
                    <div className="w-16 h-16 bg-brand-purple-soft rounded-full flex items-center justify-center mx-auto">
                      <AlertCircle className="w-8 h-8 text-brand-purple" />
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-xl font-black text-brand-black">Application Limit Reached</h4>
                      <p className="text-brand-gray-dark">
                        You have reached your monthly limit of 20 gig applications. Upgrade to Pro or Premium to continue applying for gigs and unlock more opportunities.
                      </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                      <Link 
                        to="/subscription"
                        className="flex-1 py-4 rounded-xl bg-brand-purple text-white font-black hover:bg-brand-purple-dark transition-all flex items-center justify-center gap-2 shadow-md"
                      >
                        <Zap className="w-4 h-4" />
                        Upgrade to Pro
                      </Link>
                      <Link 
                        to="/subscription"
                        className="flex-1 py-4 rounded-xl bg-brand-black text-white font-black hover:bg-black transition-all flex items-center justify-center gap-2 shadow-md"
                      >
                        <Shield className="w-4 h-4" />
                        Upgrade to Premium
                      </Link>
                    </div>
                  </div>
                ) : success ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center py-8 text-center"
                  >
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                      <CheckCircle className="w-12 h-12 text-green-500" />
                    </div>
                    <p className="text-green-700 text-2xl font-black mb-2">Application Sent!</p>
                    <p className="text-brand-gray-dark max-w-md">The creator has been notified. You can track this in your dashboard.</p>
                    <button 
                      onClick={() => navigate('/dashboard')}
                      className="mt-8 px-10 py-4 bg-brand-purple text-white rounded-2xl font-black hover:bg-brand-purple-dark transition-all shadow-lg"
                    >
                      Go to Dashboard
                    </button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleApply} className="space-y-6">
                    <div>
                      <label className="block text-sm font-bold text-brand-black mb-2">Why are you a good fit? *</label>
                      <textarea 
                        required
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        rows={4}
                        className="w-full p-5 rounded-2xl border border-brand-purple-light/20 focus:ring-2 focus:ring-brand-purple focus:border-transparent transition-all outline-none bg-white resize-none text-brand-black"
                        placeholder="Share your experience and why you want this gig..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-brand-black mb-2">Portfolio Link (Optional)</label>
                      <input 
                        type="url"
                        value={portfolioLink}
                        onChange={(e) => setPortfolioLink(e.target.value)}
                        className="w-full p-5 rounded-2xl border border-brand-purple-light/20 focus:ring-2 focus:ring-brand-purple focus:border-transparent transition-all outline-none bg-white text-brand-black"
                        placeholder="https://yourportfolio.com"
                      />
                    </div>
                    <div className="flex gap-4 pt-4">
                      <button 
                        type="button"
                        onClick={() => setShowApplyForm(false)}
                        className="flex-1 py-4 rounded-2xl border border-brand-purple-light/30 text-brand-black font-bold hover:bg-white transition-all bg-transparent"
                      >
                        Cancel
                      </button>
                      <button 
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-[2] py-4 rounded-2xl bg-brand-purple text-white font-black hover:bg-brand-purple-dark transition-all shadow-lg flex items-center justify-center gap-2 active:scale-95 disabled:opacity-70 purple-glow"
                      >
                        {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Submit Application'}
                      </button>
                    </div>
                  </form>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default GigDetails;
