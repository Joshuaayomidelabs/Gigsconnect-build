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
      case 'accepted': return 'bg-green-100 text-green-700 border-green-200';
      case 'rejected': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    }
  };

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-bold text-gray-900 text-lg">{application.gigs?.title}</h3>
          <p className="text-xs text-gray-500 mt-1">Applied on {formatDate(application.created_at)}</p>
        </div>
        <span className={`px-3 py-1 text-[10px] font-bold rounded-full uppercase tracking-wider border ${getStatusColor(application.status)}`}>
          {application.status}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center gap-2 text-gray-600 text-xs">
          <MapPin className="w-3.5 h-3.5 text-gray-400" />
          <span className="truncate">{application.gigs?.location}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600 text-xs">
          <DollarSign className="w-3.5 h-3.5 text-gray-400" />
          <span>{formatCurrency(application.gigs?.budget || 0)}</span>
        </div>
      </div>

      <div className="pt-4 border-t border-gray-50 flex justify-end">
        <button 
          onClick={() => onView?.(application.id)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-brand-600 hover:border-brand-200 transition-colors text-xs font-bold"
        >
          <Eye className="w-4 h-4" />
          View Details
        </button>
      </div>
    </div>
  );
};

export default ApplicationCard;
