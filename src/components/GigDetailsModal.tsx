import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { X, MapPin, Calendar, Banknote, Shield, CheckCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { formatCurrency, formatDate } from '../utils/helpers';

interface GigDetailsModalProps {
  gig: any;
  isOpen: boolean;
  onClose: () => void;
  onApply: (id: string) => void;
  isApplied?: boolean;
}

const GigDetailsModal: React.FC<GigDetailsModalProps> = ({ gig, isOpen, onClose, onApply, isApplied = false }) => {
  const navigate = useNavigate();
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  if (!gig) return null;

  const creator = gig.poster_id;
  const isLongDescription = gig.description && gig.description.length > 250;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-brand-black/60 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="relative w-full max-w-2xl bg-brand-white dark:bg-brand-dark-card rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-brand-gray dark:bg-brand-black text-gray-500 hover:text-brand-black dark:hover:text-brand-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header Section */}
            <div className="p-6 sm:p-8 border-b border-brand-gray dark:border-brand-black">
              <div className="flex flex-wrap gap-2 mb-3">
                <span className="px-3 py-1 bg-brand-purple/10 text-brand-purple text-xs font-bold uppercase tracking-wider rounded-full">
                  {gig.gig_category}
                </span>
                {gig.verified && (
                  <span className="px-3 py-1 bg-green-500/10 text-green-600 dark:text-green-400 text-xs font-bold uppercase tracking-wider rounded-full flex items-center gap-1">
                    <Shield className="w-3 h-3" />
                    Verified
                  </span>
                )}
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-brand-black dark:text-brand-white tracking-tight leading-tight pr-8">
                {gig.title}
              </h2>
            </div>

            {/* Scrollable Content */}
            <div className="flex-grow overflow-y-auto p-6 sm:p-8 space-y-6 custom-scrollbar">
              
              {/* Compact Poster Info & Key Stats */}
              <div className="flex flex-col sm:flex-row gap-6 justify-between items-start sm:items-center bg-brand-gray dark:bg-brand-black/50 p-4 rounded-2xl border border-brand-gray dark:border-brand-black">
                {/* Poster */}
                <div 
                  className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => {
                    const profileId = creator?.id || creator?.user_id;
                    if (profileId) navigate(`/profile/${profileId}`);
                  }}
                >
                  <div className="w-10 h-10 rounded-full bg-brand-purple/10 border border-brand-purple/20 overflow-hidden flex items-center justify-center flex-shrink-0">
                    {creator?.avatar_url ? (
                      <img 
                        src={creator.avatar_url} 
                        alt={creator.full_name} 
                        referrerPolicy="no-referrer" 
                        className="w-full h-full object-cover" 
                      />
                    ) : (
                      <div className="text-sm font-black text-brand-purple">
                        {(creator?.full_name)?.charAt(0).toUpperCase() || 'U'}
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Posted by</p>
                    <h4 className="text-sm font-black text-brand-black dark:text-brand-white">{creator?.full_name || 'Anonymous'}</h4>
                  </div>
                </div>

                {/* Stats Row */}
                <div className="flex flex-wrap gap-4 sm:gap-6">
                  <div className="flex items-center gap-2">
                    <Banknote className="w-4 h-4 text-brand-purple" />
                    <span className="text-sm font-bold text-brand-black dark:text-brand-white">
                      {formatCurrency(gig.budget || 0, gig.currency || 'USD')}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-brand-purple" />
                    <span className="text-sm font-bold text-brand-black dark:text-brand-white">
                      {gig.location}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-brand-purple" />
                    <span className="text-sm font-bold text-brand-black dark:text-brand-white">
                      {gig.deadline ? formatDate(gig.deadline) : 'TBD'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Description with Read More */}
              <div>
                <h3 className="text-sm font-black text-gray-500 uppercase tracking-widest mb-2">
                  Description
                </h3>
                <div className="relative">
                  <p className={`text-brand-black dark:text-gray-300 text-sm sm:text-base leading-relaxed whitespace-pre-wrap ${!isDescriptionExpanded && isLongDescription ? 'line-clamp-4' : ''}`}>
                    {gig.description}
                  </p>
                  
                  {isLongDescription && (
                    <button 
                      onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                      className="mt-2 flex items-center gap-1 text-brand-purple font-bold text-sm hover:underline"
                    >
                      {isDescriptionExpanded ? (
                        <>Show Less <ChevronUp className="w-4 h-4" /></>
                      ) : (
                        <>Read More <ChevronDown className="w-4 h-4" /></>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Compact Footer Actions */}
            <div className="p-4 sm:p-6 bg-brand-gray dark:bg-brand-black/80 border-t border-brand-gray dark:border-brand-black flex justify-end gap-3">
              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 text-brand-black dark:text-brand-white font-bold hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-sm"
              >
                Cancel
              </button>
              <button
                onClick={() => !isApplied && onApply(gig.id)}
                disabled={isApplied}
                className={`px-8 py-2.5 rounded-xl font-black text-sm transition-all flex items-center justify-center gap-2 ${
                  isApplied
                    ? 'bg-gray-200 dark:bg-gray-800 text-gray-500 cursor-not-allowed'
                    : 'bg-brand-purple text-white hover:bg-brand-purple-dark active:scale-95 shadow-md shadow-brand-purple/20'
                }`}
              >
                {isApplied ? (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Applied
                  </>
                ) : (
                  'Accept Gig'
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default GigDetailsModal;
