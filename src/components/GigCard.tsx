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
      className="bg-white rounded-3xl p-6 shadow-sm border border-brand-purple-light/20 hover:shadow-xl transition-all duration-300 flex flex-col h-full hover:-translate-y-1 relative group overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-24 h-24 bg-brand-purple/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700"></div>

      <div className="flex justify-between items-start mb-4 gap-4 relative z-10">
        <h3 className="text-xl font-bold text-brand-black leading-tight pr-2 group-hover:text-brand-purple transition-colors line-clamp-2">
          {gig.title}
        </h3>
        <span className="px-3 py-1 bg-green-50 text-green-700 text-sm font-bold rounded-full whitespace-nowrap flex-shrink-0 border border-green-100 shadow-sm">
          {formatCurrency(gig.budget || 0)}
        </span>
      </div>
      
      <div className="flex flex-wrap items-center gap-2 mb-4 relative z-10">
        <span className="inline-flex items-center px-2.5 py-1 bg-brand-purple-soft text-brand-purple text-xs font-bold rounded-lg border border-brand-purple-light/30">
          {gig.gig_category}
        </span>
      </div>
      
      <p className="text-brand-gray-dark text-sm leading-relaxed mb-6 flex-grow line-clamp-3 relative z-10">
        {gig.description}
      </p>
      
      <div className="space-y-3 mb-6 bg-brand-gray p-4 rounded-2xl border border-brand-purple-light/10 relative z-10">
        <div className="flex items-center gap-3 text-brand-gray-dark text-sm font-medium">
          <MapPin className="w-4 h-4 text-brand-purple flex-shrink-0" />
          <span className="truncate">{gig.location}</span>
        </div>
        {gig.deadline && (
          <div className="flex items-center gap-3 text-brand-gray-dark text-sm font-medium">
            <Calendar className="w-4 h-4 text-brand-purple flex-shrink-0" />
            <span className="truncate">{formatDate(gig.deadline)}</span>
          </div>
        )}
        <div className="flex items-center gap-3 text-brand-gray-dark text-sm font-medium">
          <div className="w-6 h-6 rounded-full bg-brand-purple-soft text-brand-purple flex items-center justify-center text-[10px] font-bold flex-shrink-0 overflow-hidden border border-brand-purple-light/30">
            {creator?.profile_photo ? (
              <img src={creator.profile_photo} alt="" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
            ) : (
              <span>{creator?.full_name?.charAt(0).toUpperCase() || 'U'}</span>
            )}
          </div>
          <span className="truncate">By <span className="text-brand-black font-semibold">{creator?.full_name || 'Unknown Poster'}</span></span>
        </div>
      </div>
      
      <div className="flex items-center gap-3 mt-auto pt-2 relative z-10">
        {onViewDetails && (
          <button 
            onClick={() => onViewDetails(gig)}
            className="flex-1 py-3.5 px-4 rounded-xl border border-brand-purple-light/30 text-brand-black font-bold hover:bg-brand-purple-soft hover:text-brand-purple transition-all text-sm active:scale-95 bg-white"
          >
            Details
          </button>
        )}
        {showApply && onApply && (
          <button 
            onClick={() => onApply(gig.id)}
            className={`flex-1 py-3.5 px-4 rounded-xl bg-brand-purple text-white font-bold hover:bg-brand-purple-dark transition-all text-sm shadow-md flex justify-center items-center active:scale-95 hover:shadow-purple-500/20 ${!onViewDetails ? 'w-full' : ''}`}
          >
            Apply Now
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default GigCard;
