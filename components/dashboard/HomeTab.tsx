import React, { useState } from 'react';
import { Search, Filter, MapPin, Calendar } from 'lucide-react';
import { Gig } from '../../pages/Dashboard';
import GigDetailsModal from './GigDetailsModal';

const StatCard = ({ title, value, trend }: { title: string, value: string, trend: string }) => (
  <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-gray-100 transition-all hover:shadow-md cursor-default">
    <h3 className="text-gray-500 text-sm font-medium mb-1">{title}</h3>
    <div className="flex items-baseline gap-3">
      <span className="text-3xl font-black text-gray-900 tracking-tight">{value}</span>
      <span className="text-sm font-semibold text-blue-600">{trend}</span>
    </div>
  </div>
);

export const GigCard = ({ gig, onViewDetails }: { gig: Gig, onViewDetails: (gig: Gig) => void }) => {
  return (
    <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 flex flex-col h-full hover:-translate-y-1 relative group">
      <div className="flex justify-between items-start mb-4 gap-4">
        <h3 className="text-lg sm:text-xl font-bold text-gray-900 leading-tight pr-2 group-hover:text-blue-600 transition-colors">{gig.title}</h3>
        <span className="px-3 py-1 bg-green-50 text-green-700 text-xs sm:text-sm font-bold rounded-full whitespace-nowrap flex-shrink-0 border border-green-100">{gig.pay}</span>
      </div>
      
      <div className="flex flex-col gap-2 mb-4">
        <div className="flex items-center gap-2 text-gray-500 text-sm font-medium">
          <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <span className="truncate">{gig.location}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-500 text-sm font-medium">
          <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <span className="truncate">{gig.date}</span>
        </div>
      </div>
      
      <p className="text-gray-600 text-sm leading-relaxed mb-6 flex-grow line-clamp-3">{gig.description}</p>
      
      <div className="flex items-center gap-3 mt-auto pt-4 border-t border-gray-50">
        <button 
          onClick={() => onViewDetails(gig)}
          className="flex-1 py-3 px-4 rounded-xl border border-gray-200 text-gray-700 font-bold hover:bg-gray-50 transition-colors text-sm active:scale-95"
        >
          Details
        </button>
        <button 
          className="flex-1 py-3 px-4 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-colors text-sm shadow-sm flex justify-center items-center active:scale-95"
        >
          Apply Now
        </button>
      </div>
    </div>
  );
};

const HomeTab = ({ gigs }: { gigs: Gig[] }) => {
  const [selectedGig, setSelectedGig] = useState<Gig | null>(null);

  return (
    <div className="space-y-8 relative z-10">
      <section>
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">Welcome back, Alex</h1>
        <p className="text-gray-500 mt-1 text-base sm:text-lg">Here are the latest gigs for you</p>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        <StatCard title="Available Gigs" value="142" trend="+12 this week" />
        <StatCard title="My Applications" value="8" trend="3 pending" />
        <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-gray-100 flex flex-col justify-center transition-all hover:shadow-md cursor-default">
          <h3 className="text-gray-500 text-sm font-medium mb-1">Subscription Status</h3>
          <div className="flex items-center gap-3">
            <span className="text-2xl font-black text-gray-900 tracking-tight">Free</span>
            <span className="px-3 py-1 bg-blue-50 text-blue-700 text-[10px] font-bold rounded-full uppercase tracking-wider border border-blue-100">Basic</span>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 w-full sm:w-auto tracking-tight">Recommended Gigs</h2>
          <div className="flex w-full sm:w-auto gap-3">
            <div className="relative flex-1 sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input type="text" placeholder="Search gigs..." className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all text-sm" />
            </div>
            <button className="p-3 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors flex items-center justify-center active:scale-95">
              <Filter className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {gigs.length > 0 ? (
            gigs.map((gig) => (
              <GigCard 
                key={gig.id}
                gig={gig}
                onViewDetails={setSelectedGig}
              />
            ))
          ) : (
            <div className="col-span-1 lg:col-span-2 text-center py-12 text-gray-500">
              No gigs available right now. Be the first to post one!
            </div>
          )}
        </div>
      </section>

      <GigDetailsModal 
        gig={selectedGig} 
        isOpen={!!selectedGig} 
        onClose={() => setSelectedGig(null)} 
      />
    </div>
  );
};

export default HomeTab;
