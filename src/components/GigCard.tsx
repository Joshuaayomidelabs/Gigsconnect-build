import React, { useState } from 'react';
import { MapPin, Calendar, ArrowRight, Trash2, Star, Clock, Loader2, Shield, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { formatCurrency, formatDate } from '../utils/helpers';
import VerificationBadge from './VerificationBadge';

interface GigCardProps {
  gig: any;
  onApply?: (id: string) => void;
  onViewDetails?: (gig: any) => void;
  onViewApplicants?: (gig: any) => void;
  onDelete?: (id: string) => void;
  isDeleting?: boolean;
  showApply?: boolean;
  initialIsApplied?: boolean;
}

const GigCard: React.FC<GigCardProps> = ({ gig, onApply, onViewDetails, onViewApplicants, onDelete, isDeleting, showApply = true, initialIsApplied = false }) => {
  const navigate = useNavigate();
  const [isAppliedLocally, setIsAppliedLocally] = useState(initialIsApplied);
  
  // The poster info is now nested under 'poster_id' per the new query
  const creator = gig.poster_id;
  
  // Determine if the user has applied (either passed from parent or set locally after click)
  const isApplied = gig.hasApplied || isAppliedLocally;

  const goToProfile = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Access id from the nested profile object
    const profileId = creator?.id || creator?.user_id;
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
      className={`group relative bg-white dark:bg-brand-dark-card rounded-[1.5rem] p-6 border transition-all duration-500 flex flex-col h-full cursor-pointer min-h-[280px] overflow-hidden ${
        isApplied 
          ? 'border-brand-purple bg-brand-purple/[0.03] dark:bg-brand-purple/[0.08] ring-4 ring-brand-purple/10 shadow-xl' 
          : 'border-brand-gray dark:border-white/5 shadow-sm hover:shadow-2xl hover:border-brand-purple/40 hover:ring-1 hover:ring-brand-purple/20'
      }`}
    >
      {/* Applied Badge - Top Right */}
      {isApplied && (
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="absolute top-0 right-0 z-20"
        >
          <div className="bg-brand-purple text-white px-4 py-1.5 rounded-bl-2xl text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 shadow-lg">
            <CheckCircle className="w-3 h-3" />
            Applied
          </div>
        </motion.div>
      )}

      {/* Colorful Accent Gradient */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-purple via-brand-purple-dark to-brand-purple opacity-70 group-hover:opacity-100 transition-opacity" />
      
      {/* Background Glow Effect */}
      <div className="absolute -top-16 -right-16 w-32 h-32 bg-brand-purple/5 rounded-full blur-3xl group-hover:bg-brand-purple/15 transition-colors duration-500" />
      
      {/* Shimmer Effect on Hover */}
      <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-[-20deg] pointer-events-none" />

      {/* Header: Category & Budget */}
      <div className="flex justify-between items-center mb-4">
        <span className="px-3 py-1 bg-brand-purple/10 dark:bg-brand-purple/20 text-brand-purple text-[9px] font-black uppercase tracking-[0.1em] rounded-full border border-brand-purple/10">
          {gig.gig_category}
        </span>
        <div className="flex flex-col items-end">
          <div className="text-brand-purple font-black text-xl tracking-tighter">
            {formatCurrency(gig.budget || 0, gig.currency || 'USD')}
          </div>
        </div>
      </div>

      {/* Body: Title & Meta */}
      <div className="flex-grow">
        <h3 className="text-lg font-black text-brand-black dark:text-brand-white leading-[1.2] tracking-tight group-hover:text-brand-purple transition-colors line-clamp-2 mb-3">
          {gig.title}
        </h3>
        
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-brand-gray/50 dark:bg-brand-black/50 border border-brand-gray dark:border-white/5 text-brand-black dark:text-brand-white text-[10px] font-black tracking-tight">
            <MapPin className="w-3 h-3 text-brand-purple" />
            {gig.location}
          </div>
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-brand-gray/50 dark:bg-brand-black/50 border border-brand-gray dark:border-white/5 text-brand-black dark:text-brand-white text-[10px] font-black tracking-tight">
            <Clock className="w-3 h-3 text-brand-purple" />
            {formatDate(gig.created_at)}
          </div>
        </div>

        {/* Description Snippet */}
        <p className="text-gray-600 dark:text-gray-400 text-xs leading-relaxed line-clamp-2 mb-6 font-medium opacity-80 group-hover:opacity-100 transition-opacity">
          {gig.description}
        </p>
      </div>

      {/* Poster Section - Compact Vertical Layout */}
      <div className="mb-6 flex items-center justify-between">
        <button 
          onClick={goToProfile}
          className="group/poster flex items-center gap-2.5 hover:opacity-80 transition-all"
        >
          <div className="w-8 h-8 rounded-lg bg-brand-purple/10 flex items-center justify-center text-brand-purple text-[9px] font-black border border-brand-purple/10 group-hover/poster:bg-brand-purple group-hover/poster:text-white transition-all overflow-hidden">
            {creator?.avatar_url ? (
              <img 
                src={creator.avatar_url} 
                alt={creator.full_name} 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                  (e.target as HTMLImageElement).parentElement!.innerText = (creator?.full_name)?.charAt(0).toUpperCase() || 'U';
                }}
              />
            ) : (
              (creator?.full_name)?.charAt(0).toUpperCase() || 'U'
            )}
          </div>
          <div className="flex flex-col items-start">
            <div className="flex items-center">
              <span className="text-[11px] font-black text-brand-black dark:text-brand-white group-hover/poster:text-brand-purple transition-colors">
                {creator?.full_name || 'Anonymous'}
              </span>
              <VerificationBadge 
                isVerified={creator?.is_verified} 
                verificationStatus={creator?.verification_status} 
              />
            </div>
          </div>
        </button>
      </div>

      {/* Footer: Actions */}
      <div className="pt-4 border-t border-brand-gray dark:border-white/5 flex items-center justify-end gap-2">
        {onDelete && (
          <button 
            onClick={(e) => { e.stopPropagation(); onDelete(gig.id); }}
            disabled={isDeleting}
            className="p-2 rounded-xl bg-red-50 dark:bg-red-900/10 text-red-500 hover:bg-red-500 hover:text-white transition-all active:scale-90 disabled:opacity-50 border border-red-100 dark:border-red-900/20"
          >
            {isDeleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
          </button>
        )}

        {showApply && onApply && (
          <button 
            onClick={handleApplyClick}
            disabled={isApplied}
            className={`flex-grow sm:flex-grow-0 px-5 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all active:scale-95 flex items-center justify-center gap-2 ${
              isApplied 
                ? 'bg-brand-gray dark:bg-brand-black text-gray-400 cursor-not-allowed border border-brand-gray dark:border-brand-black' 
                : 'bg-brand-purple text-white hover:bg-brand-purple-dark hover:shadow-glow shadow-lg shadow-brand-purple/20'
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
            className="px-4 py-2 rounded-xl bg-brand-purple/5 text-brand-purple font-black text-[10px] uppercase tracking-widest hover:bg-brand-purple hover:text-white transition-all active:scale-95 border border-brand-purple/10"
          >
            Applicants
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default GigCard;
