import React, { useState } from 'react';
import { Search, MapPin, Calendar, Bookmark } from 'lucide-react';
import { Gig } from '../../pages/Dashboard';

const GigCardExplore = ({ title, location, pay, date, description }: { title: string, location: string, pay: string, date: string, description: string }) => {
  const [bookmarked, setBookmarked] = useState(false);
  
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 flex flex-col h-full hover:-translate-y-1 relative">
      <button 
        onClick={() => setBookmarked(!bookmarked)}
        className="absolute top-6 right-6 text-gray-400 hover:text-blue-600 transition-colors"
      >
        <Bookmark className={`w-6 h-6 ${bookmarked ? 'fill-blue-600 text-blue-600' : ''}`} />
      </button>
      <div className="flex justify-between items-start mb-4 gap-4 pr-10">
        <h3 className="text-xl font-bold text-gray-900 leading-tight">{title}</h3>
      </div>
      
      <div className="flex flex-col gap-2 mb-4">
        <span className="inline-block px-3 py-1 bg-green-100 text-green-700 text-sm font-bold rounded-full whitespace-nowrap w-max mb-1">{pay}</span>
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
          className="flex-1 py-2.5 px-4 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-500 transition-colors text-sm shadow-sm flex justify-center items-center"
        >
          Apply Now
        </button>
      </div>
    </div>
  );
};

const ExploreTab = ({ gigs }: { gigs: Gig[] }) => {
  return (
    <div className="space-y-8 relative z-10">
      <section>
        <h1 className="text-3xl font-bold text-gray-900">Explore Gigs</h1>
        <p className="text-gray-500 mt-1 text-lg">Find your next opportunity</p>
      </section>

      <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
        <div className="relative w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input type="text" placeholder="Search by keyword, genre, or artist..." className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all text-lg" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <select className="w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white text-gray-700">
            <option value="">All Genres</option>
            <option value="afrobeats">Afrobeats</option>
            <option value="jazz">Jazz</option>
            <option value="pop">Pop</option>
            <option value="rock">Rock</option>
          </select>
          <select className="w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white text-gray-700">
            <option value="">Any Location</option>
            <option value="lagos">Lagos, Nigeria</option>
            <option value="accra">Accra, Ghana</option>
            <option value="nairobi">Nairobi, Kenya</option>
            <option value="remote">Remote</option>
          </select>
          <select className="w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white text-gray-700">
            <option value="">Any Pay Range</option>
            <option value="0-100">$0 - $100</option>
            <option value="100-500">$100 - $500</option>
            <option value="500+">$500+</option>
          </select>
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {gigs.length > 0 ? (
          gigs.map((gig) => (
            <GigCardExplore 
              key={gig.id}
              title={gig.title}
              location={gig.location}
              pay={gig.pay}
              date={gig.date}
              description={gig.description}
            />
          ))
        ) : (
          <div className="col-span-1 lg:col-span-2 text-center py-12 text-gray-500">
            No gigs found.
          </div>
        )}
      </section>
    </div>
  );
};

export default ExploreTab;
