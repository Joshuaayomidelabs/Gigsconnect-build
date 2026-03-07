import React from 'react';
import { MapPin, Calendar } from 'lucide-react';
import { motion } from 'motion/react';
import { formatCurrency, formatDate } from '../utils/helpers';

interface GigCardProps {
  gig: any;
  onApply?: (id: string) => void;
  onViewDetails?: (gig: any) => void;
  showApply?: boolean;
}

const GigCard: React.FC<GigCardProps> = ({ gig, onApply, onViewDetails, showApply = true }) => {
  const creator = Array.isArray(gig.profiles) ? gig.profiles[0] : gig.profiles;

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3, type: "spring", bounce: 0.2 }}
      className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 flex flex-col h-full hover:-translate-y-1 relative group"
    >
      <div className="flex justify-between items-start mb-3 gap-4">
        <h3 className="text-lg sm:text-xl font-bold text-gray-900 leading-tight pr-2 group-hover:text-brand-600 transition-colors line-clamp-2">
          {gig.title}
        </h3>
        <span className="px-3 py-1 bg-green-50 text-green-700 text-xs sm:text-sm font-bold rounded-full whitespace-nowrap flex-shrink-0 border border-green-100 shadow-sm">
          {formatCurrency(gig.budget || 0)}
        </span>
      </div>
      
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <span className="inline-flex items-center px-2.5 py-1 bg-brand-50 text-brand-700 text-xs font-bold rounded-md border border-brand-100">
          {gig.gig_category}
        </span>
      </div>
      
      <p className="text-gray-600 text-sm leading-relaxed mb-5 flex-grow line-clamp-3">
        {gig.description}
      </p>
      
      <div className="space-y-2.5 mb-5 bg-gray-50 p-3.5 rounded-xl border border-gray-100/50">
        <div className="flex items-center gap-2.5 text-gray-600 text-sm font-medium">
          <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <span className="truncate">{gig.location}</span>
        </div>
        {gig.deadline && (
          <div className="flex items-center gap-2.5 text-gray-600 text-sm font-medium">
            <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <span className="truncate">{formatDate(gig.deadline)}</span>
          </div>
        )}
        <div className="flex items-center gap-2.5 text-gray-600 text-sm font-medium">
          <div className="w-4 h-4 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center text-[8px] font-bold flex-shrink-0 overflow-hidden">
            {creator?.profile_photo ? (
              <img src={creator.profile_photo} alt="" className="w-full h-full object-cover" />
            ) : (
              <span>{creator?.full_name?.charAt(0).toUpperCase() || 'U'}</span>
            )}
          </div>
          <span className="truncate">Posted by <span className="text-gray-900 font-semibold">{creator?.full_name || 'Unknown Poster'}</span></span>
        </div>
      </div>
      
      <div className="flex items-center gap-3 mt-auto pt-2">
        {onViewDetails && (
          <button 
            onClick={() => onViewDetails(gig)}
            className="flex-1 py-3 px-4 rounded-xl border border-gray-200 text-gray-700 font-bold hover:bg-gray-50 transition-all text-sm active:scale-95"
          >
            Details
          </button>
        )}
        {showApply && onApply && (
          <button 
            onClick={() => onApply(gig.id)}
            className={`flex-1 py-3 px-4 rounded-xl bg-gray-900 text-white font-bold hover:bg-black transition-all text-sm shadow-sm flex justify-center items-center active:scale-95 hover:shadow-md ${!onViewDetails ? 'w-full' : ''}`}
          >
            Apply Now
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default GigCard;
