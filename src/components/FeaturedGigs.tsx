import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';
import GigCard from './GigCard';
import GigDetailsModal from './GigDetailsModal';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const FeaturedGigs: React.FC = () => {
  const navigate = useNavigate();
  const [gigs, setGigs] = useState<any[]>([]);
  const [appliedGigIds, setAppliedGigIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [selectedGig, setSelectedGig] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchFeaturedGigs = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          // Fetch applied gig IDs
          const { data: applications } = await supabase
            .from('gig_applications')
            .select('gig_id')
            .eq('applicant_id', session.user.id);
          
          if (applications) {
            setAppliedGigIds(new Set(applications.map(app => app.gig_id)));
          }
        }

        const { data, error } = await supabase
          .from('gigs')
          .select('*, poster:profiles(*)')
          .order('created_at', { ascending: false })
          .limit(4);

        if (error) throw error;
        setGigs(data || []);
      } catch (err) {
        console.error('Error fetching featured gigs:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedGigs();
  }, []);

  if (loading) {
    return (
      <section className="py-24 bg-brand-light dark:bg-brand-dark transition-colors duration-500">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="h-12 w-64 bg-gray-200 dark:bg-gray-800 rounded-full mb-12 animate-pulse"></div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-[450px] bg-gray-200 dark:bg-gray-800 rounded-[2.5rem] animate-pulse"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (gigs.length === 0) return null;

  const handleViewDetails = (gig: any) => {
    setSelectedGig(gig);
    setIsModalOpen(true);
  };

  const handleApply = (id: string) => {
    navigate(`/gig/${id}`);
  };

  return (
    <section className="py-24 bg-brand-light dark:bg-brand-dark transition-colors duration-500">
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-brand-purple/10 border border-brand-purple/20 text-brand-purple text-xs font-black tracking-wide uppercase">
              <Sparkles className="w-4 h-4 fill-current" />
              Featured Opportunities
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-brand-black dark:text-white tracking-tighter mb-4">
              Recently Posted <span className="text-brand-purple">Gigs</span>
            </h2>
            <p className="text-lg text-gray-500 dark:text-gray-400 font-medium">
              Check out the latest musical projects looking for talent right now.
            </p>
          </div>
          <Link 
            to="/browse" 
            className="flex items-center gap-3 px-8 py-4 bg-white dark:bg-brand-dark-card rounded-full font-black text-brand-black dark:text-white border border-gray-100 dark:border-gray-800 hover:shadow-xl hover:shadow-brand-purple/5 transition-all group"
          >
            View All Gigs
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {gigs.map((gig, index) => (
            <motion.div
              key={gig.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <GigCard 
                gig={gig} 
                showApply={false} 
                onViewDetails={handleViewDetails} 
                initialIsApplied={appliedGigIds.has(gig.id)}
              />
            </motion.div>
          ))}
        </div>
      </div>

      <GigDetailsModal 
        gig={selectedGig}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onApply={handleApply}
        isApplied={selectedGig ? appliedGigIds.has(selectedGig.id) : false}
      />
    </section>
  );
};

export default FeaturedGigs;
