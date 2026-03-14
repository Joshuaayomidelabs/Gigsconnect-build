import React from 'react';
import { MapPin, Calendar, ArrowRight, Trash2 } from 'lucide-react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { formatCurrency, formatDate } from '../utils/helpers';

interface GigCardProps {
  gig: any;
  onApply?: (id: string) => void;
  onViewDetails?: (gig: any) => void;
  onViewApplicants?: (gig: any) => void;
  onDelete?: (id: string) => void;
  showApply?: boolean;
}

const GigCard: React.FC<GigCardProps> = ({ gig, onApply, onViewDetails, onViewApplicants, onDelete, showApply = true }) => {
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
      className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-md border border-gray-200 dark:border-gray-700 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg hover:bg-gray-50 dark:hover:bg-gray-700 flex flex-col h-full group"
    >
      {/* Card Header: Creator Info */}
      <div className="flex items-center justify-between mb-4">
        <div 
          className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
          onClick={goToProfile}
        >
          <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 text-blue-600 dark:text-blue-400 flex items-center justify-center text-xs font-bold overflow-hidden border border-gray-200 dark:border-gray-600">
            {creator?.avatar_url ? (
              <img src={creator.avatar_url} alt="" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
            ) : (
              <span>{creator?.full_name?.charAt(0).toUpperCase() || 'U'}</span>
            )}
          </div>
          <div>
            <h4 className="text-sm font-bold text-blue-600 dark:text-blue-400 leading-none mb-1 hover:underline transition-colors">{creator?.full_name || 'Anonymous'}</h4>
            <div className="flex items-center gap-1 text-[10px] text-gray-500 dark:text-gray-400 font-medium">
              <MapPin className="w-3 h-3" />
              <span>{gig.location}</span>
            </div>
          </div>
        </div>
        <span className="text-[10px] font-black text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded-lg uppercase tracking-wider">
          {gig.gig_category}
        </span>
      </div>

      {/* Card Body: Content */}
      <div className="mb-4">
        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 leading-tight mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {gig.title}
        </h3>
        <p className="text-gray-700 dark:text-gray-200 text-sm leading-relaxed line-clamp-3">
          {gig.description}
        </p>
      </div>

      {/* Card Footer: Meta & Actions */}
      <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-[10px] text-gray-500 dark:text-gray-400 font-bold uppercase tracking-widest mb-0.5">Budget</span>
          <span className="text-base font-black text-gray-900 dark:text-gray-100">{formatCurrency(gig.budget || 0, gig.currency || 'USD')}</span>
        </div>
        
        <div className="flex items-center gap-2">
          {onViewApplicants && (
            <button 
              onClick={() => onViewApplicants(gig)}
              className="px-4 py-2.5 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-bold text-sm hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-all active:scale-95"
            >
              Applicants
            </button>
          )}
          {onViewDetails && (
            <button 
              onClick={() => onViewDetails(gig)}
              className="p-2.5 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 transition-all active:scale-90"
              title="View Details"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
          )}
          {onDelete && (
            <button 
              onClick={() => onDelete(gig.id)}
              className="p-2.5 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/40 transition-all active:scale-90"
              title="Delete Gig"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          )}
          {showApply && onApply && (
            <button 
              onClick={() => onApply(gig.id)}
              className="px-5 py-2.5 rounded-xl bg-blue-500 dark:bg-blue-400 text-white dark:text-gray-900 font-bold text-sm hover:bg-blue-600 dark:hover:bg-blue-300 transition-all shadow-sm active:scale-95"
            >
              Apply
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default GigCard;
