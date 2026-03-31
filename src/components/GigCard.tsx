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
      whileHover={{ y: -6, scale: 1.01 }}
      onClick={() => onViewDetails && onViewDetails(gig)}
      className={`group relative bg-white dark:bg-brand-dark-card rounded-[2rem] p-8 border transition-all duration-500 flex flex-col h-full cursor-pointer min-h-[340px] ${
        isApplied 
          ? 'border-brand-purple/30 bg-brand-purple/[0.02] dark:bg-brand-purple/[0.05] ring-4 ring-brand-purple/5 shadow-xl' 
          : 'border-brand-gray dark:border-white/5 shadow-sm hover:shadow-xl hover:border-brand-purple/20'
      }`}
    >
      {/* Header: Category & Budget */}
      <div className="flex justify-between items-center mb-6">
        <span className="px-4 py-1.5 bg-brand-purple/10 dark:bg-brand-purple/20 text-brand-purple text-[10px] font-black uppercase tracking-[0.15em] rounded-full border border-brand-purple/10">
          {gig.gig_category}
        </span>
        <div className="flex flex-col items-end">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Budget</span>
          <div className="text-brand-purple font-black text-2xl tracking-tighter">
            {formatCurrency(gig.budget || 0, gig.currency || 'USD')}
          </div>
        </div>
      </div>

      {/* Body: Title & Meta */}
      <div className="flex-grow">
        <h3 className="text-2xl font-black text-brand-black dark:text-brand-white leading-[1.1] tracking-tight group-hover:text-brand-purple transition-colors line-clamp-2 mb-4">
          {gig.title}
        </h3>
        
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-gray-500 dark:text-gray-400 text-[11px] font-bold mb-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-brand-gray dark:bg-brand-black flex items-center justify-center">
              <MapPin className="w-3.5 h-3.5 text-brand-purple" />
            </div>
            {gig.location}
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-brand-gray dark:bg-brand-black flex items-center justify-center">
              <Clock className="w-3.5 h-3.5 text-brand-purple" />
            </div>
            {formatDate(gig.created_at)}
          </div>
        </div>

        {/* Description Snippet */}
        <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed line-clamp-3 mb-8 font-medium opacity-80 group-hover:opacity-100 transition-opacity">
          {gig.description}
        </p>
      </div>

      {/* Poster Section */}
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-purple/10 flex items-center justify-center text-brand-purple text-xs font-black border border-brand-purple/10">
            {creator?.full_name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div>
            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-0.5">Posted by</p>
            <button 
              onClick={goToProfile}
              className="text-sm font-black text-brand-black dark:text-brand-white hover:text-brand-purple flex items-center gap-1.5 transition-all"
            >
              {creator?.full_name || 'Anonymous'}
              {(creator?.verification_status === 'Verified' || creator?.is_verified) && (
                <Shield className="w-3.5 h-3.5 text-brand-purple" />
              )}
            </button>
          </div>
        </div>
        
        {isApplied && (
          <motion.div 
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 px-3 py-1.5 bg-brand-purple text-white rounded-xl shadow-glow"
          >
            <CheckCircle className="w-3.5 h-3.5" />
            <span className="text-[9px] font-black uppercase tracking-widest">Applied</span>
          </motion.div>
        )}
      </div>

      {/* Footer: Actions */}
      <div className="pt-6 border-t border-brand-gray dark:border-white/5 flex items-center justify-end gap-3">
        {onDelete && (
          <button 
            onClick={(e) => { e.stopPropagation(); onDelete(gig.id); }}
            disabled={isDeleting}
            className="p-3 rounded-2xl bg-red-50 dark:bg-red-900/10 text-red-500 hover:bg-red-500 hover:text-white transition-all active:scale-90 disabled:opacity-50 border border-red-100 dark:border-red-900/20"
          >
            {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
          </button>
        )}

        {showApply && onApply && (
          <button 
            onClick={handleApplyClick}
            disabled={isApplied}
            className={`flex-grow sm:flex-grow-0 px-8 py-3.5 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] transition-all active:scale-95 flex items-center justify-center gap-3 ${
              isApplied 
                ? 'bg-brand-gray dark:bg-brand-black text-gray-400 cursor-not-allowed border border-brand-gray dark:border-brand-black' 
                : 'bg-brand-purple text-white hover:bg-brand-purple-dark hover:shadow-glow shadow-lg shadow-brand-purple/20'
            }`}
          >
            {isApplied ? (
              <>
                <CheckCircle className="w-4 h-4" />
                Applied
              </>
            ) : (
              <>
                Apply Now
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        )}
        
        {!showApply && onViewApplicants && (
          <button 
            onClick={(e) => { e.stopPropagation(); onViewApplicants(gig); }}
            className="px-6 py-3.5 rounded-2xl bg-brand-purple/5 text-brand-purple font-black text-[11px] uppercase tracking-widest hover:bg-brand-purple hover:text-white transition-all active:scale-95 border border-brand-purple/10"
          >
            View Applicants
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default GigCard;
