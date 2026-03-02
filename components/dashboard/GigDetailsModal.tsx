import React, { useEffect } from 'react';
import { X, MapPin, Calendar, DollarSign, FileText } from 'lucide-react';
import { Gig } from '../../pages/Dashboard';

interface GigDetailsModalProps {
  gig: Gig | null;
  isOpen: boolean;
  onClose: () => void;
}

const GigDetailsModal: React.FC<GigDetailsModalProps> = ({ gig, isOpen, onClose }) => {
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen || !gig) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex justify-between items-start p-6 sm:p-8 border-b border-gray-100">
          <div className="pr-8">
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight leading-tight mb-2">
              {gig.title}
            </h2>
            <span className="inline-block px-3 py-1 bg-green-50 text-green-700 text-sm font-bold rounded-full border border-green-100">
              {new Intl.NumberFormat('en-US', { style: 'currency', currency: gig.currency || 'USD', maximumFractionDigits: 0 }).format(gig.price)}
            </span>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors absolute top-6 right-6"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Body (Scrollable) */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-grow space-y-8">
          
          {/* Key Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-gray-50 border border-gray-100">
              <div className="p-2 bg-white rounded-xl shadow-sm">
                <MapPin className="w-5 h-5 text-brand-600" />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Location</p>
                <p className="text-sm font-bold text-gray-900">{gig.location}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-gray-50 border border-gray-100">
              <div className="p-2 bg-white rounded-xl shadow-sm">
                <Calendar className="w-5 h-5 text-brand-600" />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Date & Time</p>
                <p className="text-sm font-bold text-gray-900">{gig.event_date ? new Date(gig.event_date).toLocaleDateString() : 'TBD'}</p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
              <FileText className="w-5 h-5 text-gray-400" />
              Gig Description
            </h3>
            <div className="text-gray-600 text-sm sm:text-base leading-relaxed space-y-4 bg-gray-50 p-6 rounded-2xl border border-gray-100">
              {gig.description.split('\n').map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </div>

          {/* Attachments (Mocked for now) */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-3">Reference Files</h3>
            <div className="flex items-center gap-3 p-4 rounded-2xl border border-gray-200 hover:border-brand-300 hover:bg-brand-50 transition-colors cursor-pointer group">
              <div className="w-10 h-10 rounded-xl bg-brand-100 flex items-center justify-center text-brand-600 group-hover:bg-brand-200 transition-colors">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900 group-hover:text-brand-700 transition-colors">reference_track.mp3</p>
                <p className="text-xs text-gray-500">Audio • 4.2 MB</p>
              </div>
            </div>
          </div>

        </div>

        {/* Footer (Sticky) */}
        <div className="p-6 sm:p-8 border-t border-gray-100 bg-white flex flex-col sm:flex-row gap-4 items-center justify-between">
          <p className="text-sm text-gray-500 font-medium text-center sm:text-left">
            Posted 2 days ago
          </p>
          <div className="flex gap-3 w-full sm:w-auto">
            <button 
              onClick={onClose}
              className="px-6 py-3 rounded-xl border border-gray-200 text-gray-700 font-bold hover:bg-gray-50 transition-colors text-sm active:scale-95 w-full sm:w-auto"
            >
              Cancel
            </button>
            <button 
              className="px-8 py-3 rounded-xl bg-brand-600 text-white font-bold hover:bg-brand-700 transition-colors text-sm shadow-md active:scale-95 w-full sm:w-auto"
            >
              Apply Now
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default GigDetailsModal;
