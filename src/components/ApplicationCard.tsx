import React from 'react';
import { Eye, Calendar, DollarSign, MapPin } from 'lucide-react';
import { formatDate, formatCurrency } from '../utils/helpers';

interface ApplicationCardProps {
  application: any;
  onView?: (id: string) => void;
}

const ApplicationCard: React.FC<ApplicationCardProps> = ({ application, onView }) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'accepted': return 'bg-brand-purple/10 dark:bg-brand-purple/20 text-brand-purple border-brand-purple/10 dark:border-brand-purple/20';
      case 'rejected': return 'bg-brand-black/5 dark:bg-brand-black/20 text-brand-black/50 dark:text-brand-white/50 border-brand-black/10 dark:border-brand-white/10';
      default: return 'bg-brand-purple/5 dark:bg-brand-purple/10 text-brand-purple/70 dark:text-brand-purple/60 border-brand-purple/10 dark:border-brand-purple/20';
    }
  };

  return (
    <div className="bg-white dark:bg-brand-dark-card rounded-3xl p-6 shadow-md border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 group">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-bold text-gray-900 dark:text-white text-lg group-hover:text-brand-purple transition-colors">{application.gigs?.title}</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-medium">Applied on {formatDate(application.created_at)}</p>
        </div>
        <span className={`px-3 py-1 text-[10px] font-black rounded-full uppercase tracking-widest border shadow-sm ${getStatusColor(application.status)}`}>
          {application.status}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6 bg-gray-50 dark:bg-brand-dark p-4 rounded-2xl border border-gray-100 dark:border-gray-700">
        <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300 text-xs font-semibold">
          <MapPin className="w-3.5 h-3.5 text-brand-purple" />
          <span className="truncate">{application.gigs?.location}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300 text-xs font-semibold">
          <DollarSign className="w-3.5 h-3.5 text-brand-purple" />
          <span>{formatCurrency(application.gigs?.budget || 0, application.gigs?.currency || 'USD')}</span>
        </div>
      </div>

      <div className="pt-4 border-t border-gray-100 dark:border-gray-700 flex justify-end">
        <button 
          onClick={() => onView?.(application.id)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white hover:bg-brand-purple/10 hover:text-brand-purple transition-all text-xs font-bold shadow-sm"
        >
          <Eye className="w-4 h-4" />
          View Details
        </button>
      </div>
    </div>
  );
};

export default ApplicationCard;
