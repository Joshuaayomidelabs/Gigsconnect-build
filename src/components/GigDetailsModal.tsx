import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { X, MapPin, Calendar, Banknote, Briefcase, Clock, User, Shield, ArrowRight } from 'lucide-react';
import { formatCurrency, formatDate } from '../utils/helpers';

interface GigDetailsModalProps {
  gig: any;
  isOpen: boolean;
  onClose: () => void;
  onApply: (id: string) => void;
}

const GigDetailsModal: React.FC<GigDetailsModalProps> = ({ gig, isOpen, onClose, onApply }) => {
  const navigate = useNavigate();
  if (!gig) return null;

  const creator = Array.isArray(gig.profiles) ? gig.profiles[0] : gig.profiles;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-brand-black/60 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-3xl bg-brand-white dark:bg-brand-dark-card rounded-[3rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-6 right-6 z-10 p-3 rounded-2xl bg-brand-white/10 backdrop-blur-md text-white hover:bg-brand-white/20 transition-all active:scale-90 border border-white/20"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Header Visual */}
            <div className="relative h-48 sm:h-64 flex-shrink-0">
              <img
                src={gig.image_url || 'https://images.unsplash.com/photo-1514525253361-bee8718a300a?auto=format&fit=crop&q=80&w=1200'}
                alt={gig.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-brand-black/20 to-transparent" />
              
              <div className="absolute bottom-8 left-8 right-8">
                <div className="flex flex-wrap gap-3 mb-4">
                  <span className="px-4 py-1.5 bg-brand-purple text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-glow">
                    {gig.gig_category}
                  </span>
                  {gig.verified && (
                    <span className="px-4 py-1.5 bg-green-500 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg flex items-center gap-1.5">
                      <Shield className="w-3 h-3" />
                      Verified
                    </span>
                  )}
                </div>
                <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">
                  {gig.title}
                </h2>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-grow overflow-y-auto p-8 sm:p-10 space-y-10 custom-scrollbar">
              {/* Quick Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-6 rounded-3xl bg-brand-gray dark:bg-brand-black border border-brand-gray dark:border-brand-black flex flex-col gap-1">
                  <span className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Budget</span>
                  <div className="flex items-center gap-2 text-brand-purple font-black text-xl">
                    <Banknote className="w-5 h-5" />
                    {formatCurrency(gig.budget || 0, gig.currency || 'USD')}
                  </div>
                </div>
                <div className="p-6 rounded-3xl bg-brand-gray dark:bg-brand-black border border-brand-gray dark:border-brand-black flex flex-col gap-1">
                  <span className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Location</span>
                  <div className="flex items-center gap-2 text-brand-black dark:text-brand-white font-black text-lg">
                    <MapPin className="w-5 h-5 text-brand-purple" />
                    {gig.location}
                  </div>
                </div>
                <div className="p-6 rounded-3xl bg-brand-gray dark:bg-brand-black border border-brand-gray dark:border-brand-black flex flex-col gap-1">
                  <span className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Deadline</span>
                  <div className="flex items-center gap-2 text-brand-black dark:text-brand-white font-black text-lg">
                    <Calendar className="w-5 h-5 text-brand-purple" />
                    {gig.deadline ? formatDate(gig.deadline) : 'TBD'}
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-4">
                <h3 className="text-xl font-black text-brand-black dark:text-brand-white flex items-center gap-3">
                  <Briefcase className="w-6 h-6 text-brand-purple" />
                  About the Gig
                </h3>
                <p className="text-brand-gray-dark dark:text-gray-300 text-lg leading-relaxed whitespace-pre-wrap">
                  {gig.description}
                </p>
              </div>

              {/* Poster Info */}
              <div className="pt-8 border-t border-brand-purple/5">
                <div className="flex items-center justify-between bg-brand-gray dark:bg-brand-black p-6 rounded-[2rem] border border-brand-gray dark:border-brand-black">
                  <div 
                    className="flex items-center gap-4 cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => creator?.user_id && navigate(`/profile/${creator.user_id}`)}
                  >
                    <div className="w-16 h-16 rounded-2xl bg-brand-purple/10 border-2 border-brand-purple/20 overflow-hidden shadow-lg">
                      {creator?.avatar_url ? (
                        <img 
                          src={creator.avatar_url.includes('?') ? creator.avatar_url : `${creator.avatar_url}?t=${Date.now()}`} 
                          alt="" 
                          referrerPolicy="no-referrer" 
                          className="w-full h-full object-cover" 
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xl font-black text-brand-purple">
                          {creator?.full_name?.charAt(0).toUpperCase() || 'U'}
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1">Posted by</p>
                      <h4 className="text-xl font-black text-brand-black dark:text-brand-white">{creator?.full_name || 'Anonymous'}</h4>
                      <div className="flex items-center gap-2 mt-1 text-xs font-bold text-brand-purple">
                        <Shield className="w-3.5 h-3.5" />
                        Verified Creator
                      </div>
                    </div>
                  </div>
                  <div className="hidden sm:flex flex-col items-end">
                    <span className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1">Posted on</span>
                    <div className="flex items-center gap-2 text-brand-black dark:text-brand-white font-bold">
                      <Clock className="w-4 h-4 text-brand-purple" />
                      {formatDate(gig.created_at)}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="p-8 bg-brand-gray dark:bg-brand-black/50 border-t border-brand-gray dark:border-brand-black flex flex-col sm:flex-row gap-4">
              <button
                onClick={onClose}
                className="flex-1 px-8 py-4 rounded-2xl border-2 border-brand-gray dark:border-brand-black text-brand-black dark:text-brand-white font-black hover:bg-brand-gray dark:hover:bg-brand-black transition-all active:scale-95"
              >
                Close
              </button>
              <button
                onClick={() => onApply(gig.id)}
                className="flex-[2] px-10 py-4 rounded-2xl bg-brand-purple text-white font-black text-lg hover:bg-brand-purple-dark hover:shadow-glow hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 shadow-xl shadow-brand-purple/20"
              >
                Apply for this Gig
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default GigDetailsModal;
