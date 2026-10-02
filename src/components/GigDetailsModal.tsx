import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { X, MapPin, Calendar, CheckCircle, ChevronDown, ChevronUp, ArrowRight, ShieldCheck } from 'lucide-react';
import { formatCurrency, formatDate } from '../utils/helpers';
import VerificationBadge from './VerificationBadge';
import { getCategoryConfig } from '../utils/categoryStyles';

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
  const mediaUrl = gig.image_url || gig.image || gig.media_url || gig.media || gig.cover_image;
  const categoryConfig = getCategoryConfig(gig.gig_category);
  const CategoryIcon = categoryConfig.icon;

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
            className="relative w-full max-w-2xl bg-white dark:bg-brand-dark-card rounded-2xl shadow-2xl border border-gray-100 dark:border-brand-dark-card overflow-hidden flex flex-col max-h-[90vh]"
          >
            {/* Category Gradient Header (or image if gig has one) with Close Button */}
            <div className="relative w-full overflow-hidden shrink-0">
              {mediaUrl ? (
                <div className="aspect-[21/9] w-full bg-gray-100 dark:bg-brand-black">
                  <img 
                    src={mediaUrl} 
                    alt={gig.title} 
                    className="w-full h-full object-cover" 
                  />
                </div>
              ) : (
                <div className={`h-36 sm:h-44 w-full bg-gradient-to-br ${categoryConfig.gradient} flex items-center justify-center`}>
                  <CategoryIcon className="w-14 h-14 sm:w-16 sm:h-16 stroke-[1.75] opacity-90 transition-transform hover:scale-105 duration-300" />
                </div>
              )}

              {/* Close Button */}
              <button
                onClick={onClose}
                aria-label="Close"
                className="absolute top-3.5 right-3.5 z-10 p-2 rounded-full bg-white/80 dark:bg-brand-black/80 backdrop-blur-md text-brand-black dark:text-brand-white hover:bg-white dark:hover:bg-brand-black transition-all shadow-sm active:scale-95"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Header Section */}
            <div className="p-5 sm:p-6 border-b border-gray-100 dark:border-brand-dark-card shrink-0">
              <div className="flex flex-wrap items-center gap-2 mb-2.5">
                <span className="px-3 py-1 bg-brand-purple/10 dark:bg-brand-purple/20 border border-brand-purple/20 text-brand-purple text-xs font-bold rounded-full">
                  {gig.gig_category || 'Gig'}
                </span>
                <span className="px-3 py-1 bg-brand-purple/10 dark:bg-brand-purple/20 text-brand-purple text-xs font-black rounded-full">
                  {formatCurrency(gig.budget || 0, gig.currency || 'USD')}
                </span>
                <span className="px-3 py-1 bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-300 text-xs font-semibold rounded-full flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-brand-purple" />
                  {gig.location || 'Remote'}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-brand-black dark:text-brand-white tracking-tight leading-tight">
                {gig.title}
              </h2>
            </div>

            {/* Scrollable Content */}
            <div className="flex-grow overflow-y-auto p-5 sm:p-6 space-y-6 custom-scrollbar">
              
              {/* Compact Poster Info & Key Stats */}
              <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center bg-gray-50 dark:bg-brand-black/50 p-4 rounded-2xl border border-gray-100 dark:border-brand-black">
                {/* Poster */}
                <div 
                  className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity min-w-0"
                  onClick={() => {
                    const profileId = creator?.id || creator?.user_id;
                    if (profileId) {
                      onClose();
                      navigate(`/profile/${profileId}`);
                    }
                  }}
                >
                  <div className="w-10 h-10 rounded-full bg-brand-purple/10 border border-brand-purple/20 overflow-hidden flex items-center justify-center shrink-0">
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
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Posted by</p>
                    <div className="text-sm font-bold text-brand-black dark:text-brand-white flex items-center gap-1 truncate">
                      <span className="truncate">{creator?.full_name || 'Anonymous'}</span>
                      <VerificationBadge verificationStatus={creator?.verification_status} />
                    </div>
                  </div>
                </div>

                {/* Deadline */}
                {gig.deadline && (
                  <div className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-300 font-semibold shrink-0">
                    <Calendar className="w-4 h-4 text-brand-purple" />
                    <span>Deadline: {formatDate(gig.deadline)}</span>
                  </div>
                )}
              </div>

              {/* Description with Read More */}
              <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
                  About this gig
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

              {/* Skills required ONLY if gig has a skills array with items */}
              {Array.isArray(gig.skills) && gig.skills.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                    Skills required
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {gig.skills.map((skill: string, index: number) => (
                      <span 
                        key={index}
                        className="px-3 py-1 bg-brand-purple/10 dark:bg-brand-purple/20 text-brand-purple text-xs font-semibold rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Prominent Full-Width Apply Button in #6C3BFF */}
            <div className="p-4 sm:p-5 bg-gray-50 dark:bg-brand-black/80 border-t border-gray-100 dark:border-brand-dark-card flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
              <div className="hidden sm:flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 font-medium">
                <ShieldCheck className="w-4 h-4 text-brand-purple shrink-0" />
                <span>Your profile will be shared with the poster.</span>
              </div>
              
              <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
                <button
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 text-brand-black dark:text-brand-white font-bold hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors text-xs active:scale-95"
                >
                  Close
                </button>
                <button
                  onClick={() => !isApplied && onApply(gig.id)}
                  disabled={isApplied}
                  className={`flex-1 sm:flex-initial px-6 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 active:scale-95 ${
                    isApplied
                      ? 'bg-gray-100 dark:bg-zinc-800 text-gray-400 dark:text-zinc-500 cursor-not-allowed'
                      : 'bg-brand-purple text-white hover:bg-brand-purple-hover shadow-md'
                  }`}
                >
                  {isApplied ? (
                    <>
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Applied
                    </>
                  ) : (
                    <>
                      Apply Now
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default GigDetailsModal;
