import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Loader2, User, FileText, Globe, CheckCircle2, XCircle } from 'lucide-react';
import { supabase } from '../services/supabaseClient';
import { applicationsService } from '../services/applicationsService';
import VerificationBadge from '../components/VerificationBadge';

const ApplicationDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [application, setApplication] = useState<any>(null);
  const [portfolio, setPortfolio] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        
        // 1. Fetch Application + Profile
        const { data: appData, error: appError } = await supabase
          .from("applications")
          .select(`
            id,
            message,
            applicant_id,
            status,
            portfolio_link,
            created_at,
            gig_id,
            gigs:gig_id (
              title
            ),
            profiles:applicant_id (
              id,
              full_name,
              avatar_url,
              role,
              bio,
              verification_status
            )
          `)
          .eq("id", id)
          .single();

        if (appError) throw appError;
        setApplication(appData);

        // 2. Fetch Portfolio (profile_media)
        if (appData?.applicant_id) {
          const { data: portfolioData, error: portfolioError } = await supabase
            .from("profile_media")
            .select("*")
            .eq("user_id", appData.applicant_id)
            .order("created_at", { ascending: false });
            
          if (!portfolioError && portfolioData) {
            setPortfolio(portfolioData);
          }
        }
      } catch (err: any) {
        console.error("Error fetching application details:", err);
        setError(err.message || "Failed to load application details");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetails();
  }, [id]);

  const handleUpdateStatus = async (status: string) => {
    if (!id) return;
    try {
      setIsUpdating(true);
      await applicationsService.updateApplicationStatus(id, status);
      setApplication((prev: any) => ({ ...prev, status }));
    } catch (err) {
      console.error("Error updating status:", err);
      alert("Failed to update application status");
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-brand-gray dark:bg-brand-black transition-colors">
        <Loader2 className="w-10 h-10 animate-spin text-brand-purple" />
      </div>
    );
  }

  if (error || !application) {
    return (
      <div className="pt-main pb-12 px-4 text-center min-h-screen bg-brand-gray dark:bg-brand-black transition-colors">
        <div className="max-w-md mx-auto bg-brand-white dark:bg-brand-dark-card p-12 rounded-[3rem] shadow-xl border border-brand-gray dark:border-brand-black">
          <FileText className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-6" />
          <h2 className="text-2xl font-black text-brand-black dark:text-brand-white mb-2">Application Not Found</h2>
          <p className="text-gray-700 dark:text-gray-200 mb-8">{error || "This application doesn't exist or you don't have permission to view it."}</p>
          <button 
            onClick={() => navigate(-1)}
            className="px-8 py-3 bg-brand-purple text-brand-white font-bold rounded-2xl hover:bg-brand-purple-hover transition-all"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const applicant = application.profiles;

  return (
    <div className="bg-brand-gray dark:bg-brand-black min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 transition-colors duration-500">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <button 
          onClick={() => navigate(-1)}
          className="mb-8 flex items-center gap-2 text-brand-black dark:text-brand-white font-bold hover:text-brand-purple transition-colors group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Back
        </button>

        <div className="bg-brand-white dark:bg-brand-dark-card rounded-[2.5rem] p-8 md:p-10 shadow-xl border border-brand-gray dark:border-brand-black mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 pb-8 border-b border-brand-gray dark:border-brand-black">
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-brand-black dark:text-brand-white tracking-tight mb-2">
                Application for {application.gigs?.title || 'Gig'}
              </h1>
              <p className="text-gray-500 dark:text-gray-400 font-medium">
                Submitted on {new Date(application.created_at).toLocaleDateString()}
              </p>
            </div>
            
            <div className="flex gap-3">
              {application.status === 'pending' ? (
                <>
                  <button 
                    onClick={() => handleUpdateStatus('rejected')}
                    disabled={isUpdating}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-brand-black dark:text-brand-white bg-brand-gray dark:bg-brand-black border border-brand-gray dark:border-brand-black hover:bg-brand-purple/10 dark:hover:bg-brand-purple/20 transition-colors disabled:opacity-50"
                  >
                    <XCircle className="w-5 h-5" />
                    Decline
                  </button>
                  <button 
                    onClick={() => handleUpdateStatus('accepted')}
                    disabled={isUpdating}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-brand-white bg-brand-purple hover:bg-brand-purple-hover transition-colors disabled:opacity-50 shadow-lg"
                  >
                    <CheckCircle2 className="w-5 h-5" />
                    Accept
                  </button>
                </>
              ) : (
                <div className={`px-6 py-3 rounded-xl font-bold flex items-center gap-2 ${
                  application.status === 'accepted' 
                    ? 'bg-brand-purple/10 text-brand-purple dark:bg-brand-purple/20' 
                    : 'bg-brand-gray text-gray-600 dark:bg-brand-black dark:text-gray-400'
                }`}>
                  {application.status === 'accepted' ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                  {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Left Col: Applicant Info */}
            <div className="md:col-span-1 space-y-6">
              <h3 className="text-sm font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-4">Applicant Profile</h3>
              
              <Link to={`/profile/${applicant?.id}`} className="block group">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-full bg-brand-gray dark:bg-brand-black border-2 border-brand-purple/20 overflow-hidden flex-shrink-0">
                    {applicant?.avatar_url ? (
                      <img src={applicant.avatar_url} alt={applicant.full_name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <User className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div>
                    <h4 className="font-black text-brand-black dark:text-brand-white group-hover:text-brand-purple transition-colors flex items-center">
                      {applicant?.full_name || 'Anonymous'}
                      <VerificationBadge 
                        verificationStatus={applicant?.verification_status} 
                      />
                    </h4>
                    <p className="text-sm text-brand-purple font-bold">{applicant?.role || 'Professional'}</p>
                  </div>
                </div>
              </Link>

              {applicant?.bio && (
                <div className="bg-brand-gray dark:bg-brand-black rounded-2xl p-4">
                  <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-4">
                    {applicant.bio}
                  </p>
                </div>
              )}
            </div>

            {/* Right Col: Application Message & Portfolio */}
            <div className="md:col-span-2 space-y-8">
              <div>
                <h3 className="text-sm font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-4">Cover Message</h3>
                <div className="bg-brand-gray dark:bg-brand-black rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
                  <p className="text-brand-black dark:text-gray-200 whitespace-pre-wrap leading-relaxed">
                    {application.message || 'No message provided.'}
                  </p>
                </div>
              </div>

              {application.portfolio_link && (
                <div>
                  <h3 className="text-sm font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-4">External Portfolio</h3>
                  <a 
                    href={application.portfolio_link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-brand-purple/10 text-brand-purple font-bold rounded-xl hover:bg-brand-purple/20 transition-colors"
                  >
                    <Globe className="w-5 h-5" />
                    View External Link
                  </a>
                </div>
              )}

              {/* Portfolio Media */}
              <div>
                <h3 className="text-sm font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-4">GigsConnect Portfolio</h3>
                
                {portfolio.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {portfolio.map((item: any) => (
                      <div key={item.id} className="relative aspect-video rounded-2xl overflow-hidden bg-brand-gray dark:bg-brand-black border border-gray-200 dark:border-gray-800 group">
                        {item.type === 'video' ? (
                          <video 
                            src={item.url} 
                            className="w-full h-full object-cover"
                            controls
                          />
                        ) : (
                          <img 
                            src={item.url} 
                            alt={item.title || 'Portfolio item'} 
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            referrerPolicy="no-referrer"
                          />
                        )}
                        {item.title && (
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                            <p className="text-white font-bold text-sm truncate">{item.title}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-brand-gray dark:bg-brand-black rounded-2xl p-8 text-center border border-dashed border-gray-300 dark:border-gray-700">
                    <p className="text-gray-500 dark:text-gray-400 font-medium">No portfolio items uploaded yet.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationDetails;
