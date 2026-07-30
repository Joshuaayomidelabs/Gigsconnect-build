import React, { useState, useEffect } from 'react';
import { Loader2, AlertCircle } from 'lucide-react';
import { applicationsService } from '../services/applicationsService';
import { supabase } from '../services/supabaseClient';
import ApplicationCard from '../components/ApplicationCard';
import { getFriendlyErrorMessage } from '../utils/errorHandler';

const MyApplications: React.FC = () => {
  const [applications, setApplications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setIsLoading(true);
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;

        const { data, error: fetchError } = await applicationsService.getMyApplications(session.user.id);
        if (fetchError) throw fetchError;
        setApplications(data || []);
      } catch (err: any) {
        setError(getFriendlyErrorMessage(err));
      } finally {
        setIsLoading(false);
      }
    };

    fetchApplications();
  }, []);

  return (
    <div className="pt-main pb-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto min-h-screen bg-brand-gray dark:bg-brand-black transition-colors duration-500">
      <section className="mb-10">
        <h1 className="text-4xl font-black text-brand-black dark:text-brand-white tracking-tight mb-4">My <span className="text-brand-purple">Applications</span></h1>
        <p className="text-gray-500 dark:text-gray-400 text-lg">Track the status of gigs you've applied for.</p>
      </section>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-10 h-10 animate-spin text-brand-purple opacity-50" />
        </div>
      ) : error ? (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/40 rounded-2xl p-8 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-red-900 dark:text-red-100 mb-2">Failed to load applications</h3>
          <p className="text-red-600 dark:text-red-400">{error}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {applications.length > 0 ? (
            applications.map((app) => (
              <ApplicationCard key={app.id} application={app} />
            ))
          ) : (
            <div className="col-span-full text-center py-20 bg-brand-white dark:bg-brand-dark-card rounded-3xl border border-brand-gray dark:border-brand-black border-dashed">
              <p className="text-gray-500 dark:text-gray-400 text-lg">You haven't applied to any gigs yet.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MyApplications;
