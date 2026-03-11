import React from 'react';
import { MapPin, Calendar, ArrowRight } from 'lucide-react';
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
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-[2rem] p-5 shadow-sm border border-brand-purple-light/10 hover:shadow-md transition-all duration-300 flex flex-col h-full group"
    >
      {/* Card Header: Creator Info */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-brand-purple-soft text-brand-purple flex items-center justify-center text-xs font-bold overflow-hidden border border-brand-purple-light/20">
            {creator?.avatar_url ? (
              <img src={creator.avatar_url} alt="" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
            ) : (
              <span>{creator?.full_name?.charAt(0).toUpperCase() || 'U'}</span>
            )}
          </div>
          <div>
            <h4 className="text-sm font-bold text-brand-black leading-none mb-1">{creator?.full_name || 'Anonymous'}</h4>
            <div className="flex items-center gap-1 text-[10px] text-brand-gray-dark font-medium">
              <MapPin className="w-3 h-3" />
              <span>{gig.location}</span>
            </div>
          </div>
        </div>
        <span className="text-[10px] font-black text-brand-purple bg-brand-purple-soft px-2 py-1 rounded-lg uppercase tracking-wider">
          {gig.gig_category}
        </span>
      </div>

      {/* Card Body: Content */}
      <div className="mb-4">
        <h3 className="text-lg font-black text-brand-black leading-tight mb-2 group-hover:text-brand-purple transition-colors">
          {gig.title}
        </h3>
        <p className="text-brand-gray-dark text-sm leading-relaxed line-clamp-3">
          {gig.description}
        </p>
      </div>

      {gig.skills && (
        <div className="flex flex-wrap gap-1 mb-4">
          {gig.skills.split(',').slice(0, 3).map((skill: string) => (
            <span key={skill} className="text-[9px] font-bold text-brand-purple bg-brand-purple-soft/50 px-2 py-0.5 rounded-md">
              {skill.trim()}
            </span>
          ))}
          {gig.skills.split(',').length > 3 && (
            <span className="text-[9px] font-bold text-brand-gray-dark px-1">+ {gig.skills.split(',').length - 3} more</span>
          )}
        </div>
      )}

      {/* Card Footer: Meta & Actions */}
      <div className="mt-auto pt-4 border-t border-brand-gray flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-[10px] text-brand-gray-dark font-bold uppercase tracking-widest mb-0.5">Budget</span>
          <span className="text-base font-black text-brand-black">{formatCurrency(gig.budget || 0)}</span>
        </div>
        
        <div className="flex items-center gap-2">
          {onViewDetails && (
            <button 
              onClick={() => onViewDetails(gig)}
              className="p-2.5 rounded-xl bg-brand-gray text-brand-gray-dark hover:bg-brand-purple-soft hover:text-brand-purple transition-all active:scale-90"
              title="View Details"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
          )}
          {showApply && onApply && (
            <button 
              onClick={() => onApply(gig.id)}
              className="px-5 py-2.5 rounded-xl bg-brand-purple text-white font-bold text-sm hover:bg-brand-purple-dark transition-all shadow-sm active:scale-95 hover:shadow-purple-500/20"
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
