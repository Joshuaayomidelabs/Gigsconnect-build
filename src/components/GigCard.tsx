import React from 'react';
import { MapPin, Calendar, ArrowRight, Trash2, Star, Clock, DollarSign, Loader2 } from 'lucide-react';
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

  // Placeholder images based on category
  const getCategoryImage = (category: string) => {
    const images: Record<string, string> = {
      'Vocalist': 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&q=80&w=600',
      'Producer': 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&q=80&w=600',
      'Instrumentalist': 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&q=80&w=600',
      'DJ': 'https://images.unsplash.com/photo-1571266028243-3716f02d2d2e?auto=format&fit=crop&q=80&w=600',
      'Songwriter': 'https://images.unsplash.com/photo-1516057305968-23a24488f242?auto=format&fit=crop&q=80&w=600',
      'Mixing/Mastering': 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&q=80&w=600'
    };
    return images[category] || 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=600';
  };

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      className="bg-brand-white dark:bg-brand-dark-card rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-2xl border border-brand-gray dark:border-brand-black transition-all duration-500 flex flex-col h-full group"
    >
      {/* Gig Image / Category Visual */}
      <div className="relative h-56 overflow-hidden bg-brand-gray dark:bg-brand-black">
        <img 
          src={getCategoryImage(gig.gig_category)} 
          alt={gig.title} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        
        <div className="absolute top-6 left-6 px-4 py-1.5 bg-brand-white/90 dark:bg-brand-dark-card/90 backdrop-blur-md rounded-full text-[10px] font-black text-brand-purple uppercase tracking-widest shadow-sm border border-brand-white/20 dark:border-brand-white/5">
          {gig.gig_category}
        </div>

        <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500">
           <div className="flex items-center gap-1.5 text-brand-white text-xs font-black">
              <Star className="w-3.5 h-3.5 fill-brand-purple text-brand-purple" />
              <span>4.9 (12)</span>
           </div>
           <div className="flex items-center gap-1.5 text-brand-white text-xs font-black">
              <Clock className="w-3.5 h-3.5" />
              <span>{formatDate(gig.created_at)}</span>
           </div>
        </div>
      </div>

      <div className="p-8 flex flex-col flex-grow">
        {/* Creator Info */}
        <div className="flex items-center gap-3 mb-6">
          <div 
            className="w-10 h-10 rounded-full bg-brand-gray dark:bg-brand-black overflow-hidden border-2 border-brand-white dark:border-brand-dark-card cursor-pointer hover:border-brand-purple transition-all shadow-sm"
            onClick={goToProfile}
          >
            {creator?.avatar_url ? (
              <img src={creator.avatar_url} alt="" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-xs font-black text-brand-purple">
                {creator?.full_name?.charAt(0).toUpperCase() || 'U'}
              </div>
            )}
          </div>
          <div className="flex flex-col">
            <span 
              className="text-sm font-black text-brand-black dark:text-brand-white hover:text-brand-purple transition-colors cursor-pointer leading-none mb-1"
              onClick={goToProfile}
            >
              {creator?.full_name || 'Anonymous'}
            </span>
            <div className="flex items-center gap-1 text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-wider">
              <MapPin className="w-2.5 h-2.5" />
              <span>{gig.location}</span>
            </div>
          </div>
        </div>

        {/* Gig Content */}
        <div className="mb-8">
          <h3 
            className="text-xl font-black text-brand-black dark:text-brand-white leading-tight mb-3 group-hover:text-brand-purple transition-colors line-clamp-2 cursor-pointer"
            onClick={() => onViewDetails && onViewDetails(gig)}
          >
            {gig.title}
          </h3>
          <p className="text-gray-500 dark:text-gray-400 text-base leading-relaxed line-clamp-2 font-medium">
            {gig.description}
          </p>
        </div>

        {/* Footer */}
        <div className="mt-auto pt-6 border-t border-brand-gray dark:border-brand-black flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] text-gray-400 dark:text-gray-500 font-black uppercase tracking-widest mb-1">Budget</span>
            <div className="flex items-center text-brand-black dark:text-brand-white font-black">
              <span className="text-xl">{formatCurrency(gig.budget || 0, gig.currency || 'USD')}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {onViewApplicants && (
              <button 
                onClick={() => onViewApplicants(gig)}
                className="px-5 py-2.5 rounded-xl bg-brand-purple/10 text-brand-purple font-black text-xs hover:bg-brand-purple/20 transition-all active:scale-95"
              >
                Applicants
              </button>
            )}
            
            {onDelete && (
              <button 
                onClick={() => onDelete(gig.id)}
                disabled={isDeleting}
                className="p-2.5 rounded-xl bg-red-50 dark:bg-red-900/10 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/20 transition-all active:scale-90 disabled:opacity-50"
                title="Delete Gig"
              >
                {isDeleting ? <Loader2 className="w-4.5 h-4.5 animate-spin" /> : <Trash2 className="w-4.5 h-4.5" />}
              </button>
            )}

            {showApply && onApply && (
              <button 
                onClick={() => onApply(gig.id)}
                className="px-8 py-3 rounded-2xl bg-brand-purple text-brand-white font-black text-sm hover:bg-brand-purple-hover transition-all shadow-xl shadow-brand-purple/20 active:scale-95"
              >
                Apply
              </button>
            )}

            {!showApply && onViewDetails && (
               <button 
                onClick={() => onViewDetails(gig)}
                className="p-3 rounded-2xl bg-brand-gray dark:bg-brand-black text-gray-400 hover:text-brand-purple hover:bg-brand-purple/10 transition-all active:scale-90 border border-transparent hover:border-brand-purple/20"
              >
                <ArrowRight className="w-6 h-6" />
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default GigCard;
