import React, { useState } from 'react';
import { Search, MapPin, Calendar, Bookmark } from 'lucide-react';
import { Gig } from '../../pages/Dashboard';
import GigDetailsModal from './GigDetailsModal';

const GigCardExplore = ({ gig, onViewDetails }: { gig: Gig, onViewDetails: (gig: Gig) => void }) => {
  const [bookmarked, setBookmarked] = useState(false);
  
  return (
    <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 flex flex-col h-full hover:-translate-y-1 relative group">
      <button 
        onClick={() => setBookmarked(!bookmarked)}
        className="absolute top-5 sm:top-6 right-5 sm:right-6 text-gray-300 hover:text-blue-600 transition-colors active:scale-90"
      >
        <Bookmark className={`w-6 h-6 ${bookmarked ? 'fill-blue-600 text-blue-600' : ''}`} />
      </button>
      <div className="flex justify-between items-start mb-4 gap-4 pr-10">
        <h3 className="text-lg sm:text-xl font-bold text-gray-900 leading-tight group-hover:text-blue-600 transition-colors">{gig.title}</h3>
      </div>
      
      <div className="flex flex-col gap-2 mb-4">
        <span className="inline-block px-3 py-1 bg-green-50 text-green-700 text-xs sm:text-sm font-bold rounded-full whitespace-nowrap w-max mb-1 border border-green-100">{gig.pay}</span>
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

const ExploreTab = ({ gigs }: { gigs: Gig[] }) => {
  const [selectedGig, setSelectedGig] = useState<Gig | null>(null);

  return (
    <div className="space-y-8 relative z-10">
      <section>
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">Explore Gigs</h1>
        <p className="text-gray-500 mt-1 text-base sm:text-lg">Find your next opportunity</p>
      </section>

      <section className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
        <div className="relative w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input type="text" placeholder="Search by keyword, genre, or artist..." className="w-full pl-12 pr-4 py-3 sm:py-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all text-base" />
        </div>
        
        <div className="flex overflow-x-auto hide-scrollbar gap-3 pb-2 sm:pb-0 sm:grid sm:grid-cols-3 sm:gap-4">
          <select className="flex-shrink-0 w-auto sm:w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white text-gray-700 text-sm appearance-none">
            <option value="">All Genres</option>
            <option value="afrobeats">Afrobeats</option>
            <option value="jazz">Jazz</option>
            <option value="pop">Pop</option>
            <option value="rock">Rock</option>
          </select>
          <select className="flex-shrink-0 w-auto sm:w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white text-gray-700 text-sm appearance-none">
            <option value="">Any Location</option>
            <option value="lagos">Lagos, Nigeria</option>
            <option value="accra">Accra, Ghana</option>
            <option value="nairobi">Nairobi, Kenya</option>
            <option value="remote">Remote</option>
          </select>
          <select className="flex-shrink-0 w-auto sm:w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white text-gray-700 text-sm appearance-none">
            <option value="">Any Pay Range</option>
            <option value="0-100">$0 - $100</option>
            <option value="100-500">$100 - $500</option>
            <option value="500+">$500+</option>
          </select>
        </div>
      </section>

      <section>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {gigs.length > 0 ? (
            gigs.map((gig) => (
              <GigCardExplore 
                key={gig.id}
                gig={gig}
                onViewDetails={setSelectedGig}
              />
            ))
          ) : (
            <div className="col-span-1 lg:col-span-2 text-center py-12 text-gray-500">
              No gigs found.
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

export default ExploreTab;
