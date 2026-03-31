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
  const [isApplied, setIsApplied] = useState(false);
  const creator = Array.isArray(gig.profiles) ? gig.profiles[0] : gig.profiles;

  const goToProfile = (e: React.MouseEvent) => {
    e.stopPropagation();
    const profileId = creator?.id;
    if (profileId) {
      navigate(`/profile/${profileId}`);
    }
  };

  const handleApplyClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onApply) {
      onApply(gig.id);
      setIsApplied(true);
    }
  };

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      onClick={() => onViewDetails && onViewDetails(gig)}
      className="group relative bg-white dark:bg-brand-dark-card rounded-2xl p-6 border border-brand-gray dark:border-white/5 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full cursor-pointer min-h-[280px]"
    >
      {/* Top Row: Category & Price */}
      <div className="flex justify-between items-start mb-5">
        <div className="flex flex-wrap gap-2">
          <span className="px-3 py-1 bg-brand-purple/5 text-brand-purple text-[10px] font-black uppercase tracking-widest rounded-lg border border-brand-purple/10">
            {gig.gig_category}
          </span>
          {gig.verified && (
            <span className="px-3 py-1 bg-green-500/5 text-green-600 text-[10px] font-black uppercase tracking-widest rounded-lg border border-green-500/10 flex items-center gap-1">
              <Shield className="w-3 h-3" />
              Verified
            </span>
          )}
        </div>
        <div className="text-brand-purple font-black text-xl tracking-tight">
          {formatCurrency(gig.budget || 0, gig.currency || 'USD')}
        </div>
      </div>

      {/* Title & Meta */}
      <div className="mb-4">
        <h3 className="text-xl font-black text-brand-black dark:text-brand-white leading-tight mb-2 group-hover:text-brand-purple transition-colors line-clamp-1">
          {gig.title}
        </h3>
        <div className="flex items-center gap-4 text-gray-500 dark:text-gray-400 text-xs font-bold">
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-brand-purple/60" />
            {gig.location}
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-brand-purple/60" />
            {formatDate(gig.created_at)}
          </div>
        </div>
        
        {/* Poster Name Clickable - Added per user request */}
        {!isApplied && (
          <p 
            className="mt-3 text-brand-purple font-bold text-xs cursor-pointer hover:underline flex items-center gap-1"
            onClick={goToProfile}
          >
            <span className="text-gray-400 font-medium">Posted by</span>
            {creator?.full_name || 'Anonymous'}
            {(creator?.verification_status === 'Verified' || creator?.is_verified) && (
              <CheckCircle className="w-3 h-3" />
            )}
          </p>
        )}
      </div>

      {/* Skills/Tags */}
      {gig.skills && gig.skills.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {gig.skills.slice(0, 3).map((skill: string) => (
            <span key={skill} className="px-2 py-0.5 bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 text-[10px] font-bold rounded-md">
              {skill}
            </span>
          ))}
          {gig.skills.length > 3 && (
            <span className="text-[10px] font-bold text-gray-400">+{gig.skills.length - 3}</span>
          )}
        </div>
      )}

      {/* Description or Success Message */}
      <AnimatePresence mode="wait">
        {isApplied ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-4 bg-green-50 dark:bg-green-900/10 rounded-xl border border-green-100 dark:border-green-900/20 mb-6"
          >
            <CheckCircle className="w-8 h-8 text-green-500 mb-2" />
            <p className="text-green-600 dark:text-green-400 font-black text-xs uppercase tracking-widest">Application Sent</p>
          </motion.div>
        ) : (
          <motion.p 
            exit={{ opacity: 0, scale: 0.9 }}
            className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed line-clamp-2 font-medium mb-6"
          >
            {gig.description}
          </motion.p>
        )}
      </AnimatePresence>

      {/* Footer: Poster & Actions */}
      <div className="mt-auto pt-5 border-t border-brand-gray dark:border-white/5 flex items-center justify-between gap-3">
        {!isApplied ? (
          <div 
            className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={goToProfile}
          >
            <div className="relative">
              {creator?.avatar_url ? (
                <img 
                  src={creator.avatar_url.includes('?') ? creator.avatar_url : `${creator.avatar_url}?t=${Date.now()}`}
                  alt={creator.full_name}
                  className="w-8 h-8 rounded-lg object-cover border border-brand-purple/10"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-8 h-8 rounded-lg bg-brand-purple/10 flex items-center justify-center text-brand-purple text-[10px] font-black border border-brand-purple/10">
                  {creator?.full_name?.charAt(0).toUpperCase() || 'U'}
                </div>
              )}
              {(creator?.verification_status === 'Verified' || creator?.is_verified) && (
                <div className="absolute -top-1 -right-1 bg-brand-purple text-white p-0.5 rounded-full border border-white dark:border-brand-dark-card shadow-sm">
                  <CheckCircle className="w-2.5 h-2.5" />
                </div>
              )}
            </div>
            <div className="flex items-center gap-1 min-w-0">
              <span className="text-xs font-bold text-brand-black dark:text-brand-white truncate max-w-[100px] hover:text-brand-purple transition-colors">
                {creator?.full_name || 'Anonymous'}
              </span>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
            <CheckCircle className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-widest">Application Logged</span>
          </div>
        )}

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
          
          {onViewApplicants && (
            <button 
              onClick={(e) => { e.stopPropagation(); onViewApplicants(gig); }}
              className="px-4 py-2.5 rounded-xl bg-brand-purple/5 text-brand-purple font-black text-[10px] uppercase tracking-wider hover:bg-brand-purple hover:text-white transition-all active:scale-95 border border-brand-purple/10"
            >
              Applicants
            </button>
          )}

          {showApply && onApply && !isApplied && (
            <button 
              onClick={handleApplyClick}
              className="px-5 py-2.5 rounded-xl bg-brand-purple text-white font-black text-[10px] uppercase tracking-widest hover:bg-brand-purple-dark hover:shadow-glow transition-all active:scale-95 flex items-center gap-2"
            >
              Apply
              <ArrowRight className="w-3 h-3" />
            </button>
          )}
          
          {(!showApply || isApplied) && onViewDetails && (
            <button 
              onClick={(e) => { e.stopPropagation(); onViewDetails(gig); }}
              className="p-2.5 rounded-xl bg-brand-purple/5 text-brand-purple hover:bg-brand-purple hover:text-white transition-all active:scale-90 border border-brand-purple/10"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default GigCard;
