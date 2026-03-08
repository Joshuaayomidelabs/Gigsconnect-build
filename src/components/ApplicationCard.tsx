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
      case 'accepted': return 'bg-green-50 text-green-700 border-green-100';
      case 'rejected': return 'bg-red-50 text-red-700 border-red-100';
      default: return 'bg-brand-purple-soft text-brand-purple border-brand-purple-light/20';
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-brand-purple-light/20 hover:shadow-xl transition-all duration-300 group">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-bold text-brand-black text-lg group-hover:text-brand-purple transition-colors">{application.gigs?.title}</h3>
          <p className="text-xs text-brand-gray-dark mt-1 font-medium">Applied on {formatDate(application.created_at)}</p>
        </div>
        <span className={`px-3 py-1 text-[10px] font-black rounded-full uppercase tracking-widest border shadow-sm ${getStatusColor(application.status)}`}>
          {application.status}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6 bg-brand-gray p-4 rounded-2xl border border-brand-purple-light/10">
        <div className="flex items-center gap-2 text-brand-gray-dark text-xs font-semibold">
          <MapPin className="w-3.5 h-3.5 text-brand-purple" />
          <span className="truncate">{application.gigs?.location}</span>
        </div>
        <div className="flex items-center gap-2 text-brand-gray-dark text-xs font-semibold">
          <DollarSign className="w-3.5 h-3.5 text-brand-purple" />
          <span>{formatCurrency(application.gigs?.budget || 0)}</span>
        </div>
      </div>

      <div className="pt-4 border-t border-brand-gray flex justify-end">
        <button 
          onClick={() => onView?.(application.id)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-brand-purple-light/30 text-brand-black hover:bg-brand-purple-soft hover:text-brand-purple transition-all text-xs font-bold shadow-sm"
        >
          <Eye className="w-4 h-4" />
          View Details
        </button>
      </div>
    </div>
  );
};

export default ApplicationCard;
