import React, { useState, useEffect } from 'react';
import { X, Loader2, Check, XCircle, User, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { applicationsService } from '../services/applicationsService';
import { formatDate } from '../utils/helpers';
import { Link } from 'react-router-dom';
import { handleError } from '../utils/errorHandler';

interface ApplicantsModalProps {
  gig: any;
  onClose: () => void;
  highlightedAppId?: string | null;
}

const ApplicantsModal: React.FC<ApplicantsModalProps> = ({ gig, onClose, highlightedAppId }) => {
  const navigate = useNavigate();
  const [applicants, setApplicants] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState<string | null>(null);

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const { data, error } = await applicationsService.getApplicationsForGig(gig.id);
        if (error) throw error;
        setApplicants(data || []);
      } catch (err: any) {
        handleError(err, "Operation Error");
      } finally {
        setIsLoading(false);
      }
    };

    fetchApplicants();
  }, [gig.id]);

  const handleStatusUpdate = async (applicationId: string, status: 'Accepted' | 'Rejected') => {
    setIsProcessing(applicationId);
    try {
      const { error } = await applicationsService.updateApplicationStatus(applicationId, status);
      if (error) throw error;
      
      setApplicants(prev => prev.map(app => 
        app.id === applicationId ? { ...app, status } : app
      ));
    } catch (err: any) {
      handleError(err, "Operation Error");
    } finally {
      setIsProcessing(null);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 dark:bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white dark:bg-brand-dark-card w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300 border border-gray-200 dark:border-gray-700">
        <div className="p-6 sm:p-8 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-brand-purple/5 dark:bg-brand-purple/10">
          <div>
            <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Applicants</h2>
            <p className="text-sm font-bold text-brand-purple italic">{gig.title}</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white dark:hover:bg-brand-dark rounded-full transition-colors text-gray-500 dark:text-gray-400 hover:text-brand-purple"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-grow overflow-y-auto p-6 sm:p-8 space-y-6">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-10 h-10 animate-spin text-brand-purple opacity-50 mb-4" />
              <p className="text-gray-500 dark:text-gray-400 font-bold">Fetching applicants...</p>
            </div>
          ) : applicants.length > 0 ? (
            applicants.map((app) => (
              <div 
                key={app.id} 
                className={`bg-gray-50 dark:bg-brand-dark rounded-3xl p-6 border transition-all group ${
                  app.id === highlightedAppId 
                    ? 'border-brand-purple ring-2 ring-brand-purple/20 shadow-lg' 
                    : 'border-gray-200 dark:border-gray-700 hover:border-brand-purple/30'
                }`}
              >
                <div className="flex flex-col sm:flex-row justify-between gap-6">
                  <div className="flex gap-4">
                    <div 
                      className="w-14 h-14 rounded-2xl bg-white dark:bg-brand-dark-card border-2 border-gray-200 dark:border-gray-700 overflow-hidden flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={() => app.profiles?.user_id && (onClose(), navigate(`/profile/${app.profiles.user_id}`))}
                    >
                      {app.profiles?.avatar_url ? (
                        <img src={app.profiles.avatar_url} alt={app.profiles.full_name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-brand-purple">
                          <User className="w-6 h-6" />
                        </div>
                      )}
                    </div>
                    <div>
                      <h4 
                        className="text-lg font-black text-gray-900 dark:text-white flex items-center gap-2 cursor-pointer hover:text-brand-purple transition-colors"
                        onClick={() => app.profiles?.user_id && (onClose(), navigate(`/profile/${app.profiles.user_id}`))}
                      >
                        {app.profiles?.full_name}
                      </h4>
                      <p className="text-xs font-bold text-brand-purple uppercase tracking-widest mb-2">{app.profiles?.role || 'Talent'}</p>
                      <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2 italic">"{app.message}"</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end justify-between gap-4">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                      app.status === 'Accepted' ? 'bg-brand-purple/10 dark:bg-brand-purple/20 text-brand-purple border-brand-purple/10 dark:border-brand-purple/20' :
                      app.status === 'Rejected' ? 'bg-brand-black/5 dark:bg-brand-black/20 text-brand-black/50 dark:text-brand-white/50 border-brand-black/10 dark:border-brand-white/10' :
                      'bg-brand-purple/5 dark:bg-brand-purple/10 text-brand-purple/70 dark:text-brand-purple/60 border-brand-purple/10 dark:border-brand-purple/20'
                    }`}>
                      {app.status}
                    </span>
                    
                    {app.status === 'Pending' && (
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleStatusUpdate(app.id, 'Rejected')}
                          disabled={!!isProcessing}
                          className="p-3 rounded-xl bg-white dark:bg-brand-dark-card text-brand-black dark:text-brand-white hover:bg-brand-black/5 dark:hover:bg-brand-black/20 transition-all border border-brand-gray dark:border-brand-black shadow-sm disabled:opacity-50"
                        >
                          {isProcessing === app.id ? <Loader2 className="w-5 h-5 animate-spin text-brand-purple" /> : <XCircle className="w-5 h-5" />}
                        </button>
                        <button 
                          onClick={() => handleStatusUpdate(app.id, 'Accepted')}
                          disabled={!!isProcessing}
                          className="flex items-center gap-2 px-5 py-3 rounded-xl bg-brand-purple text-white dark:text-white font-bold hover:bg-brand-purple-hover transition-all shadow-md active:scale-95 disabled:opacity-50"
                        >
                          {isProcessing === app.id ? <Loader2 className="w-5 h-5 animate-spin" /> : <Check className="w-5 h-5" />}
                          Accept
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                
                {app.portfolio_link && (
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <a 
                      href={app.portfolio_link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-xs font-bold text-brand-purple hover:underline flex items-center gap-1"
                    >
                      <ExternalLink className="w-3 h-3" />
                      View Portfolio
                    </a>
                  </div>
                )}
                
                <div className="mt-2 text-[10px] text-gray-500 dark:text-gray-400 font-medium">
                  Applied on {formatDate(app.created_at)}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-20 bg-gray-50 dark:bg-gray-900/50 rounded-[2rem] border border-dashed border-gray-300 dark:border-gray-700">
              <p className="text-gray-500 dark:text-gray-400 font-bold">No applications yet for this gig.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApplicantsModal;
