import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Calendar, DollarSign, FileText, Loader2, CheckCircle, ArrowLeft } from 'lucide-react';
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

  useEffect(() => {
    const fetchGig = async () => {
      if (!id) return;
      try {
        const { data, error } = await gigsService.getGigById(id);
        if (error) throw error;
        setGig(data);
      } catch (err: any) {
        alert(err.message);
        navigate('/browse');
      } finally {
        setIsLoading(false);
      }
    };
    fetchGig();
  }, [id, navigate]);

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!gig) return;
    
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
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-10 h-10 animate-spin text-brand-600" />
      </div>
    );
  }

  if (!gig) return null;

  return (
    <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto min-h-screen">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-500 hover:text-brand-600 font-bold mb-8 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Gigs
      </button>

      <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-8 sm:p-12 border-b border-gray-50">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-6">
            <div>
              <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-4">{gig.title}</h1>
              <div className="flex flex-wrap gap-3">
                <span className="px-4 py-1.5 bg-green-50 text-green-700 text-sm font-black rounded-full border border-green-100">
                  {formatCurrency(gig.budget || 0)}
                </span>
                <span className="px-4 py-1.5 bg-brand-50 text-brand-700 text-sm font-black rounded-full border border-brand-100">
                  {gig.gig_category}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-100">
              <div className="w-12 h-12 rounded-full bg-brand-100 border-2 border-brand-600 overflow-hidden">
                {gig.profiles?.profile_photo ? (
                  <img src={gig.profiles.profile_photo} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-brand-600 font-bold">
                    {gig.profiles?.full_name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                )}
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Posted by</p>
                <p className="text-sm font-black text-gray-900">{gig.profiles?.full_name || 'Unknown'}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-8 sm:p-12 space-y-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex items-center gap-4 p-6 rounded-3xl bg-gray-50 border border-gray-100">
              <div className="p-3 bg-white rounded-2xl shadow-sm">
                <MapPin className="w-6 h-6 text-brand-600" />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Location</p>
                <p className="text-lg font-black text-gray-900">{gig.location}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-6 rounded-3xl bg-gray-50 border border-gray-100">
              <div className="p-3 bg-white rounded-2xl shadow-sm">
                <Calendar className="w-6 h-6 text-brand-600" />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Deadline</p>
                <p className="text-lg font-black text-gray-900">{gig.deadline ? formatDate(gig.deadline) : 'TBD'}</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3">
              <FileText className="w-6 h-6 text-brand-600" />
              Gig Description
            </h3>
            <div className="text-gray-600 text-lg leading-relaxed bg-gray-50 p-8 rounded-[2rem] border border-gray-100 whitespace-pre-wrap">
              {gig.description}
            </div>
          </div>

          {!showApplyForm ? (
            <div className="pt-8 flex justify-center">
              <button 
                onClick={() => setShowApplyForm(true)}
                className="px-12 py-5 rounded-2xl bg-brand-600 text-white font-black hover:bg-brand-700 transition-all shadow-xl active:scale-95 text-lg"
              >
                Apply for this Gig
              </button>
            </div>
          ) : (
            <div className="bg-brand-50 p-8 rounded-[2.5rem] border border-brand-100 space-y-6 animate-in fade-in slide-in-from-bottom-4">
              <h3 className="text-2xl font-black text-brand-900">Submit Your Application</h3>
              {success ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
                  <p className="text-green-700 text-xl font-black mb-2">Application Sent!</p>
                  <p className="text-green-600">The creator has been notified. You can track this in your dashboard.</p>
                  <button 
                    onClick={() => navigate('/dashboard')}
                    className="mt-8 px-8 py-3 bg-green-600 text-white rounded-xl font-bold"
                  >
                    Go to Dashboard
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApply} className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-brand-800 mb-2">Why are you a good fit? *</label>
                    <textarea 
                      required
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows={4}
                      className="w-full p-4 rounded-2xl border border-brand-200 focus:ring-2 focus:ring-brand-600 focus:border-transparent transition-all outline-none bg-white resize-none"
                      placeholder="Share your experience and why you want this gig..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-brand-800 mb-2">Portfolio Link (Optional)</label>
                    <input 
                      type="url"
                      value={portfolioLink}
                      onChange={(e) => setPortfolioLink(e.target.value)}
                      className="w-full p-4 rounded-2xl border border-brand-200 focus:ring-2 focus:ring-brand-600 focus:border-transparent transition-all outline-none bg-white"
                      placeholder="https://yourportfolio.com"
                    />
                  </div>
                  <div className="flex gap-4 pt-4">
                    <button 
                      type="button"
                      onClick={() => setShowApplyForm(false)}
                      className="flex-1 py-4 rounded-2xl border border-brand-200 text-brand-700 font-bold hover:bg-brand-100 transition-all"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-[2] py-4 rounded-2xl bg-brand-600 text-white font-black hover:bg-brand-700 transition-all shadow-lg flex items-center justify-center gap-2 active:scale-95 disabled:opacity-70"
                    >
                      {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Submit Application'}
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
