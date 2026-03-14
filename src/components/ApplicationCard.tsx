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
      case 'accepted': return 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-100 dark:border-green-900/40';
      case 'rejected': return 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-red-100 dark:border-red-900/40';
      default: return 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-900/40';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-md border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 group">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-bold text-gray-900 dark:text-gray-100 text-lg group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{application.gigs?.title}</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-medium">Applied on {formatDate(application.created_at)}</p>
        </div>
        <span className={`px-3 py-1 text-[10px] font-black rounded-full uppercase tracking-widest border shadow-sm ${getStatusColor(application.status)}`}>
          {application.status}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6 bg-gray-50 dark:bg-gray-900/50 p-4 rounded-2xl border border-gray-100 dark:border-gray-700">
        <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300 text-xs font-semibold">
          <MapPin className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400" />
          <span className="truncate">{application.gigs?.location}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300 text-xs font-semibold">
          <DollarSign className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400" />
          <span>{formatCurrency(application.gigs?.budget || 0, application.gigs?.currency || 'USD')}</span>
        </div>
      </div>

      <div className="pt-4 border-t border-gray-100 dark:border-gray-700 flex justify-end">
        <button 
          onClick={() => onView?.(application.id)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 transition-all text-xs font-bold shadow-sm"
        >
          <Eye className="w-4 h-4" />
          View Details
        </button>
      </div>
    </div>
  );
};

export default ApplicationCard;
