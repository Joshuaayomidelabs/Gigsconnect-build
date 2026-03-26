import React from 'react';
import { MapPin, Calendar, ArrowRight, Trash2, Star, Clock, Loader2, Shield } from 'lucide-react';
import { motion } from 'framer-motion';
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
  const creator = Array.isArray(gig.profiles) ? gig.profiles[0] : gig.profiles;

  const goToProfile = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (creator?.id) {
      navigate(`/profile/${creator.id}`);
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
      </div>

      {/* Description */}
      <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed line-clamp-2 font-medium mb-6">
        {gig.description}
      </p>

      {/* Footer: Poster & Actions */}
      <div className="mt-auto pt-5 border-t border-brand-gray dark:border-white/5 flex items-center justify-between gap-3">
        <div 
          className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
          onClick={goToProfile}
        >
          <div className="w-8 h-8 rounded-lg bg-brand-purple/10 flex items-center justify-center text-brand-purple text-[10px] font-black border border-brand-purple/10">
            {creator?.full_name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <span className="text-xs font-bold text-brand-black dark:text-brand-white truncate max-w-[100px]">
            {creator?.full_name || 'Anonymous'}
          </span>
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
          
          {onViewApplicants && (
            <button 
              onClick={(e) => { e.stopPropagation(); onViewApplicants(gig); }}
              className="px-4 py-2.5 rounded-xl bg-brand-purple/5 text-brand-purple font-black text-[10px] uppercase tracking-wider hover:bg-brand-purple hover:text-white transition-all active:scale-95 border border-brand-purple/10"
            >
              Applicants
            </button>
          )}

          {showApply && onApply ? (
            <button 
              onClick={(e) => { e.stopPropagation(); onApply(gig.id); }}
              className="px-5 py-2.5 rounded-xl bg-brand-purple text-white font-black text-[10px] uppercase tracking-widest hover:bg-brand-purple-dark hover:shadow-glow transition-all active:scale-95 flex items-center gap-2"
            >
              Apply
              <ArrowRight className="w-3 h-3" />
            </button>
          ) : (
            onViewDetails && (
              <button 
                onClick={(e) => { e.stopPropagation(); onViewDetails(gig); }}
                className="p-2.5 rounded-xl bg-brand-purple/5 text-brand-purple hover:bg-brand-purple hover:text-white transition-all active:scale-90 border border-brand-purple/10"
              >
                <ArrowRight className="w-5 h-5" />
              </button>
            )
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default GigCard;
