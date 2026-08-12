import { SEO } from '../components/SEO';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Quote, ArrowUpRight, CheckCircle } from 'lucide-react';


const SuccessStories: React.FC = () => {
  const accentColor = '#6C2BFF';
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-full bg-gray-50 flex flex-col font-sans min-h-screen">
      <SEO title="Success Stories | GigsConnect Africa" canonical="https://gigsconnect.africa/success-stories" />

      
      {/* Hero Section */}
      <div className="pt-32 pb-24 px-6 md:px-8 bg-white border-b border-gray-100 relative overflow-hidden flex-shrink-0">
        <div 
          className="absolute top-0 right-0 w-[800px] h-[800px] rounded-full blur-[120px] pointer-events-none -translate-y-1/2 translate-x-1/4 opacity-10"
          style={{ backgroundColor: accentColor }}
        ></div>
        <div 
          className="absolute bottom-0 left-0 w-[600px] h-[600px] rounded-full blur-[100px] pointer-events-none translate-y-1/3 -translate-x-1/4 opacity-10"
          style={{ backgroundColor: accentColor }}
        ></div>
        
        <div className={`max-w-4xl mx-auto text-center relative z-10 transition-all duration-1000 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="inline-flex items-center justify-center p-3 px-5 bg-[#4B0082]/5 rounded-full mb-8 border border-[#4B0082]/10">
            <span className="text-[#4B0082] font-bold text-sm tracking-wide uppercase flex items-center gap-2">
              <Star className="w-4 h-4 fill-current" /> Stories & Opportunities
            </span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-black text-[#111827] tracking-tight mb-8">
            Highlighting African <br className="hidden md:block" />
            <span style={{ color: accentColor }}>Creative Excellence.</span>
          </h1>
          
          <p className="text-xl font-medium text-gray-600 max-w-2xl mx-auto leading-relaxed mb-10">
            As GigsConnect grows, this space will feature real experiences and successful collaborations from creators and clients across the continent.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              to="/browse"
              className="inline-flex items-center justify-center h-14 px-8 rounded-xl text-white font-bold transition-all shadow-xl hover:shadow-2xl hover:-translate-y-0.5 gap-2"
              style={{ backgroundColor: accentColor }}
            >
              Explore Gigs <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1440px] mx-auto w-full px-6 md:px-8 py-20 space-y-24">
        
        {/* Placeholder Information State */}
        <div className="max-w-4xl mx-auto bg-white rounded-3xl p-10 md:p-16 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] text-center">
          <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mx-auto mb-6">
            <Quote className="w-6 h-6 text-gray-400" />
          </div>
          <h2 className="text-3xl font-bold text-[#111827] mb-6">Creator Stories Are Coming Soon</h2>
          <p className="text-gray-500 text-lg leading-relaxed max-w-2xl mx-auto mb-10">
            Every day, creators and brands are connecting on GigsConnect. Once projects are completed and feedback is gathered, we will begin highlighting these real collaborations. Expect to see transparent, honest stories about how creators are building their careers.
          </p>
          <div className="grid md:grid-cols-3 gap-6 pt-10 border-t border-gray-100">
            <div className="text-center">
              <h3 className="font-bold text-[#111827] mb-2">Creator Journeys</h3>
              <p className="text-sm text-gray-500">How individuals build their profiles and land their first opportunities.</p>
            </div>
            <div className="text-center">
              <h3 className="font-bold text-[#111827] mb-2">Brand Collaborations</h3>
              <p className="text-sm text-gray-500">Case studies of successful projects delivered by GigsConnect talent.</p>
            </div>
            <div className="text-center">
              <h3 className="font-bold text-[#111827] mb-2">Community Milestones</h3>
              <p className="text-sm text-gray-500">Highlights from the broader creator community and feed interactions.</p>
            </div>
          </div>
        </div>

      </div>

      {/* CTA Section */}
      <div className="bg-white py-24 px-6 border-t border-gray-100 mt-auto">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-black text-[#111827] mb-8 tracking-tight">
            Start Your Journey Today
          </h2>
          <p className="text-xl text-gray-500 mb-10 max-w-2xl mx-auto">
            Create your profile, showcase your portfolio, and discover opportunities to collaborate with brands and other creators.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              to="/signup"
              className="inline-flex items-center justify-center h-14 px-10 rounded-xl text-white font-bold transition-all shadow-xl hover:shadow-2xl hover:-translate-y-0.5"
              style={{ backgroundColor: accentColor }}
            >
              Join GigsConnect
            </Link>
            <Link 
              to="/browse"
              className="inline-flex items-center justify-center h-14 px-10 rounded-xl bg-white text-[#111827] font-bold border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all"
            >
              Browse Gigs
            </Link>
          </div>
        </div>
      </div>
      
    </div>
  );
};

export default SuccessStories;
