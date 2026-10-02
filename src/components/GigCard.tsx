import React, { useState } from 'react';
import { MapPin, ArrowRight, Trash2, Clock, Loader2, CheckCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { formatCurrency, formatDate } from '../utils/helpers';
import VerificationBadge from './VerificationBadge';
import { useModeration } from '../hooks/useModeration';
import { getCategoryConfig } from '../utils/categoryStyles';

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

const GigCard: React.FC<GigCardProps> = ({ 
  gig, 
  onApply, 
  onViewDetails, 
  onViewApplicants, 
  onDelete, 
  isDeleting, 
  showApply = true, 
  initialIsApplied = false 
}) => {
  const navigate = useNavigate();
  const { isUserBlocked } = useModeration();
  const [isAppliedLocally, setIsAppliedLocally] = useState(initialIsApplied);
  
  // The poster info is now nested under 'poster_id' per query
  const creator = gig.poster_id;
  const profileId = creator?.id || creator?.user_id;

  // Hide gigs from blocked users automatically
  if (profileId && isUserBlocked(profileId)) {
    return null;
  }
  
  // Determine if the user has applied
  const isApplied = gig.hasApplied || isAppliedLocally;

  const goToProfile = (e: React.MouseEvent) => {
    e.stopPropagation();
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

  const mediaUrl = gig.image_url || gig.image || gig.media_url || gig.media || gig.cover_image;
  const categoryConfig = getCategoryConfig(gig.gig_category);
  const CategoryIcon = categoryConfig.icon;

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      onClick={() => onViewDetails && onViewDetails(gig)}
      className={`group relative bg-white dark:bg-brand-dark-card rounded-2xl p-4 sm:p-5 border transition-all duration-300 flex flex-col h-full cursor-pointer overflow-hidden ${
        isApplied 
          ? 'border-brand-purple/40 bg-brand-purple/[0.02] dark:bg-brand-purple/[0.06] shadow-sm ring-1 ring-brand-purple/20' 
          : 'border-gray-100 dark:border-brand-dark-card shadow-sm hover:shadow-md hover:border-brand-purple/30'
      }`}
    >
      {/* Top tile: Real image/media if available (16/9, object-cover); otherwise category gradient tile with icon */}
      <div className="aspect-video w-full overflow-hidden rounded-xl mb-3.5 bg-gray-100 dark:bg-brand-black shrink-0 relative">
        {mediaUrl ? (
          <img 
            src={mediaUrl} 
            alt={gig.title} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
          />
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${categoryConfig.gradient} flex items-center justify-center`}>
            <CategoryIcon className="w-12 h-12 stroke-[1.75] transition-transform duration-300 group-hover:scale-110" />
          </div>
        )}
      </div>

      {/* Category Pill (light purple) & Budget in bold */}
      <div className="flex justify-between items-center mb-2.5 gap-2">
        <span className="px-2.5 py-1 bg-brand-purple/10 dark:bg-brand-purple/20 border border-brand-purple/20 text-brand-purple text-xs font-bold rounded-full truncate">
          {gig.gig_category || 'Gig'}
        </span>
        <div className="text-right shrink-0">
          <span className="text-base sm:text-lg font-black text-brand-black dark:text-white whitespace-nowrap">
            {formatCurrency(gig.budget || 0, gig.currency || 'USD')}
          </span>
        </div>
      </div>

      {/* Body: Title (max 2 lines) & Location */}
      <div className="flex-grow">
        <h3 className="text-base sm:text-lg font-bold text-brand-black dark:text-brand-white leading-snug group-hover:text-brand-purple transition-colors line-clamp-2 mb-2">
          {gig.title}
        </h3>
        
        <div className="flex flex-wrap items-center gap-3 mb-2.5 text-xs text-gray-500 dark:text-gray-400 font-medium">
          <div className="flex items-center gap-1 min-w-0 truncate max-w-[180px]">
            <MapPin className="w-3.5 h-3.5 text-brand-purple shrink-0" />
            <span className="truncate">{gig.location || 'Remote'}</span>
          </div>
          {gig.created_at && (
            <div className="flex items-center gap-1 shrink-0">
              <Clock className="w-3.5 h-3.5 text-brand-purple shrink-0" />
              <span>{formatDate(gig.created_at)}</span>
            </div>
          )}
        </div>

        {/* Description Snippet */}
        {gig.description && (
          <p className="text-gray-600 dark:text-gray-400 text-xs leading-relaxed line-clamp-2 mb-3.5 font-normal">
            {gig.description}
          </p>
        )}
      </div>

      {/* Poster Section */}
      <div className="mb-3.5 pt-3 border-t border-gray-100 dark:border-brand-black/60 flex items-center justify-between">
        <button 
          onClick={goToProfile}
          className="group/poster flex items-center gap-2 hover:opacity-80 transition-all text-left min-w-0"
        >
          <div className="w-7 h-7 rounded-full bg-brand-purple/10 flex items-center justify-center text-brand-purple text-[10px] font-black overflow-hidden shrink-0 ring-1 ring-brand-purple/20">
            {creator?.avatar_url ? (
              <img 
                src={creator.avatar_url} 
                alt={creator.full_name} 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              (creator?.full_name)?.charAt(0).toUpperCase() || 'U'
            )}
          </div>
          <div className="flex items-center min-w-0">
            <span className="text-xs font-semibold text-brand-black dark:text-gray-300 group-hover/poster:text-brand-purple transition-colors truncate">
              {creator?.full_name || 'Anonymous'}
            </span>
            <VerificationBadge 
              verificationStatus={creator?.verification_status} 
            />
          </div>
        </button>

        {isApplied && (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-brand-purple bg-brand-purple/10 px-2 py-0.5 rounded-full shrink-0">
            <CheckCircle className="w-3 h-3" />
            Applied
          </span>
        )}
      </div>

      {/* Footer: Actions */}
      <div className="pt-1 flex items-center justify-end gap-2">
        {onDelete && (
          <button 
            onClick={(e) => { e.stopPropagation(); onDelete(gig.id); }}
            disabled={isDeleting}
            className="p-2 rounded-xl bg-gray-100 dark:bg-brand-black text-gray-500 hover:text-red-500 transition-all active:scale-95 disabled:opacity-50"
            title="Delete Gig"
          >
            {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
          </button>
        )}

        {showApply && onApply && (
          <button 
            onClick={handleApplyClick}
            disabled={isApplied}
            className={`w-full sm:w-auto px-4 py-2 rounded-xl font-bold text-xs transition-all active:scale-95 flex items-center justify-center gap-1.5 ${
              isApplied 
                ? 'bg-gray-100 dark:bg-zinc-800 text-gray-400 dark:text-zinc-500 cursor-not-allowed' 
                : 'bg-brand-purple text-white hover:bg-brand-purple-hover shadow-sm'
            }`}
          >
            {isApplied ? (
              <>
                <CheckCircle className="w-3.5 h-3.5" />
                Applied
              </>
            ) : (
              <>
                Apply Now
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        )}
        
        {!showApply && onViewApplicants && (
          <button 
            onClick={(e) => { e.stopPropagation(); onViewApplicants(gig); }}
            className="px-4 py-2 rounded-xl bg-brand-purple/10 text-brand-purple font-bold text-xs hover:bg-brand-purple hover:text-white transition-all active:scale-95"
          >
            Applicants
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default GigCard;
