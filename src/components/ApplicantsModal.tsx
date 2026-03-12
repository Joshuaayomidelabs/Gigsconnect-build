import React, { useState, useEffect } from 'react';
import { X, Loader2, Check, XCircle, User, ExternalLink } from 'lucide-react';
import { applicationsService } from '../services/applicationsService';
import { formatDate } from '../utils/helpers';
import { Link } from 'react-router-dom';

interface ApplicantsModalProps {
  gig: any;
  onClose: () => void;
}

const ApplicantsModal: React.FC<ApplicantsModalProps> = ({ gig, onClose }) => {
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
        alert(err.message);
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
      alert(err.message);
    } finally {
      setIsProcessing(null);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-brand-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300">
        <div className="p-6 sm:p-8 border-b border-brand-purple-light/10 flex justify-between items-center bg-brand-purple-soft/30">
          <div>
            <h2 className="text-2xl font-black text-brand-black tracking-tight">Applicants</h2>
            <p className="text-sm font-bold text-brand-purple italic">{gig.title}</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white rounded-full transition-colors text-brand-gray-dark hover:text-brand-purple"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-grow overflow-y-auto p-6 sm:p-8 space-y-6">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-10 h-10 animate-spin text-brand-purple mb-4" />
              <p className="text-brand-gray-dark font-bold">Fetching applicants...</p>
            </div>
          ) : applicants.length > 0 ? (
            applicants.map((app) => (
              <div key={app.id} className="bg-brand-gray rounded-3xl p-6 border border-brand-purple-light/10 hover:border-brand-purple/30 transition-all group">
                <div className="flex flex-col sm:flex-row justify-between gap-6">
                  <div className="flex gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-white border-2 border-brand-purple-light/20 overflow-hidden flex-shrink-0">
                      {app.profiles?.avatar_url ? (
                        <img src={app.profiles.avatar_url} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-brand-purple">
                          <User className="w-6 h-6" />
                        </div>
                      )}
                    </div>
                    <div>
                      <h4 className="text-lg font-black text-brand-black flex items-center gap-2">
                        {app.profiles?.full_name}
                      </h4>
                      <p className="text-xs font-bold text-brand-purple-dark uppercase tracking-widest mb-2">{app.profiles?.role || 'Talent'}</p>
                      <p className="text-sm text-brand-gray-dark line-clamp-2 italic">"{app.message}"</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end justify-between gap-4">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                      app.status === 'Accepted' ? 'bg-green-50 text-green-600 border-green-100' :
                      app.status === 'Rejected' ? 'bg-red-50 text-red-600 border-red-100' :
                      'bg-brand-purple-soft text-brand-purple border-brand-purple-light/30'
                    }`}>
                      {app.status}
                    </span>
                    
                    {app.status === 'Pending' && (
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleStatusUpdate(app.id, 'Rejected')}
                          disabled={!!isProcessing}
                          className="p-3 rounded-xl bg-white text-red-500 hover:bg-red-50 transition-all border border-red-100 shadow-sm disabled:opacity-50"
                        >
                          {isProcessing === app.id ? <Loader2 className="w-5 h-5 animate-spin" /> : <XCircle className="w-5 h-5" />}
                        </button>
                        <button 
                          onClick={() => handleStatusUpdate(app.id, 'Accepted')}
                          disabled={!!isProcessing}
                          className="flex items-center gap-2 px-5 py-3 rounded-xl bg-brand-purple text-white font-bold hover:bg-brand-purple-dark transition-all shadow-md active:scale-95 disabled:opacity-50"
                        >
                          {isProcessing === app.id ? <Loader2 className="w-5 h-5 animate-spin" /> : <Check className="w-5 h-5" />}
                          Accept
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                
                {app.portfolio_link && (
                  <div className="mt-4 pt-4 border-t border-brand-purple-light/10">
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
                
                <div className="mt-2 text-[10px] text-brand-gray-dark font-medium">
                  Applied on {formatDate(app.created_at)}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-20 bg-brand-gray rounded-[2rem] border border-dashed border-brand-purple-light/20">
              <p className="text-brand-gray-dark font-bold">No applications yet for this gig.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApplicantsModal;
