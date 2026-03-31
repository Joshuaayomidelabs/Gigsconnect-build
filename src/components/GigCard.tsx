import React, { useState } from 'react';
import { MapPin, Calendar, ArrowRight, Trash2, Star, Clock, Loader2, Shield, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { formatCurrency, formatDate } from '../utils/helpers';

interface GigCardProps {
  gig: any;
  onApply?: (id: string) => void;
  onViewDetails?: (gig: any) => void;
  onViewApplicants?: (gig: any) => void;
  onDelete?: (id: string) => void;
  isDeleting?: boolean;
  showApply?: boolean;
}

const GigCard: React.FC<GigCardProps> = ({ gig, onApply, onViewDetails, onViewApplicants, onDelete, isDeleting, showApply = true }) => {
  const navigate = useNavigate();
  const [isAppliedLocally, setIsAppliedLocally] = useState(false);
  
  // The poster info is now nested under 'poster_id' per the new query
  const creator = gig.poster_id;
  
  // Determine if the user has applied (either passed from parent or set locally after click)
  const isApplied = gig.hasApplied || isAppliedLocally;

  const goToProfile = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Access user_id from the nested profile object
    const profileId = creator?.user_id;
    if (profileId) {
      navigate(`/profile/${profileId}`);
    }
  };

  const handleApplyClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onApply && !isApplied) {
      onApply(gig.id);
      setIsAppliedLocally(true);
    }
  };

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      onClick={() => onViewDetails && onViewDetails(gig)}
      className={`group relative bg-white dark:bg-brand-dark-card rounded-3xl p-6 border transition-all duration-300 flex flex-col h-full cursor-pointer min-h-[320px] ${
        isApplied 
          ? 'border-brand-purple ring-2 ring-brand-purple/10 shadow-lg' 
          : 'border-brand-gray dark:border-white/5 shadow-sm hover:shadow-md'
      }`}
    >
      {/* Category Tag */}
      <div className="flex mb-4">
        <span className="px-3 py-1 bg-brand-purple/10 dark:bg-brand-purple/20 text-brand-purple text-[10px] font-black uppercase tracking-widest rounded-lg border border-brand-purple/10">
          {gig.gig_category}
        </span>
      </div>

      {/* Title & Meta */}
      <div className="mb-4">
        <div className="flex justify-between items-start gap-2 mb-2">
          <h3 className="text-xl font-black text-brand-black dark:text-brand-white leading-tight group-hover:text-brand-purple transition-colors line-clamp-2">
            {gig.title}
          </h3>
          <div className="text-brand-purple font-black text-lg whitespace-nowrap">
            {formatCurrency(gig.budget || 0, gig.currency || 'USD')}
          </div>
        </div>
        
        <div className="flex items-center gap-4 text-gray-500 dark:text-gray-400 text-xs font-bold mb-6">
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-brand-purple/60" />
            {gig.location}
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-brand-purple/60" />
            {formatDate(gig.created_at)}
          </div>
        </div>

        {/* Description Snippet */}
        <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed line-clamp-3 mb-6 font-medium">
          {gig.description}
        </p>

        {/* Poster Name as Clickable Link */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Posted by</span>
          <button 
            onClick={goToProfile}
            className="text-xs font-black text-brand-purple hover:underline flex items-center gap-1 transition-all"
          >
            {creator?.full_name || 'Anonymous'}
            {(creator?.verification_status === 'Verified' || creator?.is_verified) && (
              <Shield className="w-3 h-3" />
            )}
          </button>
        </div>
      </div>

      {/* Footer: Actions */}
      <div className="mt-auto pt-5 border-t border-brand-gray dark:border-white/5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {isApplied && (
            <div className="flex items-center gap-1.5 text-brand-purple">
              <CheckCircle className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-widest">Applied</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {onDelete && (
            <button 
              onClick={(e) => { e.stopPropagation(); onDelete(gig.id); }}
              disabled={isDeleting}
              className="p-2.5 rounded-xl bg-red-50 dark:bg-red-900/10 text-red-500 hover:bg-red-500 hover:text-white transition-all active:scale-90 disabled:opacity-50 border border-red-100 dark:border-red-900/20"
            >
              {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
            </button>
          )}

          {showApply && onApply && (
            <button 
              onClick={handleApplyClick}
              disabled={isApplied}
              className={`px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all active:scale-95 flex items-center gap-2 ${
                isApplied 
                  ? 'bg-brand-gray dark:bg-brand-black text-gray-400 cursor-not-allowed border border-brand-gray dark:border-brand-black' 
                  : 'bg-brand-purple text-white hover:bg-brand-purple-dark hover:shadow-glow'
              }`}
            >
              {isApplied ? (
                <>
                  <CheckCircle className="w-3.5 h-3.5" />
                  Applied
                </>
              ) : (
                <>
                  Apply
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          )}
          
          {!showApply && onViewApplicants && (
            <button 
              onClick={(e) => { e.stopPropagation(); onViewApplicants(gig); }}
              className="px-4 py-2.5 rounded-xl bg-brand-purple/5 text-brand-purple font-black text-[10px] uppercase tracking-wider hover:bg-brand-purple hover:text-white transition-all active:scale-95 border border-brand-purple/10"
            >
              Applicants
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default GigCard;
