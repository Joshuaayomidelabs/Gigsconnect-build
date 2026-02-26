import React, { useEffect, useState } from 'react';
import { Search, Filter, MapPin, Calendar, Loader2 } from 'lucide-react';
import { supabase } from '../../src/supabaseClient';

const StatCard = ({ title, value, trend }: { title: string, value: string, trend: string }) => (
  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 transition-shadow hover:shadow-md cursor-default">
    <h3 className="text-gray-500 text-sm font-medium mb-2">{title}</h3>
    <div className="flex items-end gap-3">
      <span className="text-3xl font-bold text-gray-900">{value}</span>
      <span className="text-sm font-medium text-blue-600 mb-1">{trend}</span>
    </div>
  </div>
);

export const GigCard = ({ id, title, location, pay, date, description, onApply }: { id: string, title: string, location: string, pay: string, date: string, description: string, onApply?: (id: string) => void }) => {
  const [applying, setApplying] = useState(false);

  const handleApply = async () => {
    if (!onApply) return;
    setApplying(true);
    await onApply(id);
    setApplying(false);
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 flex flex-col h-full hover:-translate-y-1 relative">
      <div className="flex justify-between items-start mb-4 gap-4">
        <h3 className="text-xl font-bold text-gray-900 leading-tight pr-8">{title}</h3>
        <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-bold rounded-full whitespace-nowrap flex-shrink-0">{pay}</span>
      </div>
      
      <div className="flex flex-col gap-2 mb-4">
        <div className="flex items-center gap-2 text-gray-600 text-sm font-medium">
          <MapPin className="w-4 h-4 text-gray-400" />
          {location}
        </div>
        <div className="flex items-center gap-2 text-gray-600 text-sm font-medium">
          <Calendar className="w-4 h-4 text-gray-400" />
          {date}
        </div>
      </div>
      
      <p className="text-gray-600 text-sm leading-relaxed mb-6 flex-grow">{description}</p>
      
      <div className="flex items-center gap-3 mt-auto">
        <button className="flex-1 py-2.5 px-4 rounded-xl border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition-colors text-sm">
          View Details
        </button>
        <button 
          onClick={handleApply}
          disabled={applying}
          className="flex-1 py-2.5 px-4 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-500 transition-colors text-sm shadow-sm disabled:opacity-70 flex justify-center items-center"
        >
          {applying ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Apply Now'}
        </button>
      </div>
    </div>
  );
};

const HomeTab = () => {
  const [gigs, setGigs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGigs = async () => {
      try {
        const { data, error } = await supabase
          .from('gigs')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(4);
        
        if (error) throw error;
        setGigs(data || []);
      } catch (error) {
        console.error('Error fetching gigs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGigs();
  }, []);

  const handleApply = async (gigId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return alert('Please log in to apply');

      const { error } = await supabase
        .from('applications')
        .insert([{ gig_id: gigId, applicant_id: user.id }]);

      if (error) {
        if (error.code === '23505') {
          alert('You have already applied for this gig.');
        } else {
          throw error;
        }
      } else {
        alert('Application submitted successfully!');
      }
    } catch (error: any) {
      console.error('Error applying:', error);
      alert('Failed to apply. ' + error.message);
    }
  };

  return (
    <div className="space-y-8 relative z-10">
      <section>
        <h1 className="text-3xl font-bold text-gray-900">Welcome back, Alex</h1>
        <p className="text-gray-500 mt-1 text-lg">Here are the latest gigs for you</p>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <StatCard title="Available Gigs" value="142" trend="+12 this week" />
        <StatCard title="My Applications" value="8" trend="3 pending" />
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-center transition-shadow hover:shadow-md cursor-default">
          <h3 className="text-gray-500 text-sm font-medium mb-2">Subscription Status</h3>
          <div className="flex items-center gap-3">
            <span className="text-2xl font-bold text-gray-900">Free Plan</span>
            <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-bold rounded-full uppercase tracking-wider">Basic</span>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900 w-full sm:w-auto">Recommended Gigs</h2>
          <div className="flex w-full sm:w-auto gap-3">
            <div className="relative flex-1 sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input type="text" placeholder="Search gigs..." className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all" />
            </div>
            <button className="p-2.5 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors flex items-center justify-center">
              <Filter className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {loading ? (
            <div className="col-span-1 lg:col-span-2 flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
          ) : gigs.length > 0 ? (
            gigs.map((gig) => (
              <GigCard 
                key={gig.id}
                id={gig.id}
                title={gig.title}
                location={gig.location}
                pay={gig.pay}
                date={gig.date_time}
                description={gig.description}
                onApply={handleApply}
              />
            ))
          ) : (
            <div className="col-span-1 lg:col-span-2 text-center py-12 text-gray-500">
              No gigs available right now. Be the first to post one!
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default HomeTab;
