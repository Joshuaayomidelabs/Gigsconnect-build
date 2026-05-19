import React from 'react';
import { motion } from 'motion/react';
import { Compass, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import GigCard from './GigCard';
import { GigCardSkeleton } from './Skeleton';

interface GigsFeedProps {
  gigs: any[];
  visibleCount: number;
  setVisibleCount: React.Dispatch<React.SetStateAction<number>>;
  loading: boolean;
  handleViewDetails: (gig: any) => void;
  handleApply: (gigId: string) => void;
  appliedGigIds: Set<string>;
}

export default function GigsFeed({
  gigs,
  visibleCount,
  setVisibleCount,
  loading,
  handleViewDetails,
  handleApply,
  appliedGigIds
}: GigsFeedProps) {
  return (
    <section className="space-y-4 lg:space-y-6">
      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <GigCardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <div>
          {gigs.slice(0, visibleCount).map((gig, i) => (
            <motion.div
              key={`gig-${gig.id}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: (i % 8) * 0.05 }}
            >
              <GigCard 
                gig={gig} 
                onViewDetails={handleViewDetails} 
                onApply={handleApply} 
                initialIsApplied={appliedGigIds.has(gig.id)}
              />
            </motion.div>
          ))}
        </div>
      )}

      {gigs.length === 0 && !loading && (
        <div className="bg-brand-white dark:bg-brand-dark-card rounded-[2.5rem] p-12 text-center border border-dashed border-brand-gray dark:border-brand-dark-card mx-2">
          <Compass className="w-12 h-12 text-brand-purple mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-bold text-brand-black dark:text-brand-white">No gigs found</h3>
          <p className="text-gray-700 dark:text-gray-200 text-sm mb-6">Try broadening your search or check back later.</p>
          <Link to="/browse" className="inline-flex items-center gap-2 text-brand-purple font-bold hover:underline">
            Browse all gigs
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}

      {/* Load More Button */}
      {visibleCount < gigs.length && (
        <div className="py-8 text-center">
          <button 
            onClick={() => setVisibleCount(prev => prev + 8)}
            className="text-brand-purple font-black text-sm uppercase tracking-widest hover:underline active:scale-95 transition-transform"
          >
            Load more opportunities
          </button>
        </div>
      )}
    </section>
  );
}
