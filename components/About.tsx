import React from 'react';
import Section from './Section';
import { CheckCircle } from 'lucide-react';

const About: React.FC = () => {
  return (
    <Section id="about">
      <div className="grid md:grid-cols-2 gap-16 items-center">
        <div className="order-2 md:order-1 relative">
           <div className="grid grid-cols-2 gap-4">
             <img 
               src="https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&q=80&w=500" 
               alt="Studio Recording Microphone" 
               className="rounded-2xl shadow-lg mt-8 object-cover h-64 w-full transform hover:scale-[1.02] transition-transform duration-500"
             />
             <img 
               src="https://images.unsplash.com/photo-1493225255756-d9584f8606e9?auto=format&fit=crop&q=80&w=500" 
               alt="Live Music Performance" 
               className="rounded-2xl shadow-lg object-cover h-64 w-full transform hover:scale-[1.02] transition-transform duration-500"
             />
           </div>
           {/* Floating stat card */}
           <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-4 rounded-xl shadow-xl flex items-center gap-3 min-w-[200px] border border-gray-50">
             <div className="bg-green-50 p-2 rounded-full">
               <CheckCircle className="w-6 h-6 text-green-600" />
             </div>
             <div>
               <p className="font-bold text-gray-900 font-display">Verified Gig</p>
               <p className="text-xs text-gray-500 font-sans">Payment Secured</p>
             </div>
           </div>
        </div>

        <div className="order-1 md:order-2">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 font-display">
            More Than Just a <br/><span className="text-brand-600">Booking App</span>
          </h2>
          <p className="text-gray-600 text-lg mb-6 leading-relaxed font-sans">
            GigsConnect is the digital bridge between raw African talent and the stages they deserve. We remove the chaos of finding work in the music industry.
          </p>
          <div className="space-y-4">
             <div className="flex gap-4 group">
               <div className="flex-shrink-0 w-1 bg-gray-200 group-hover:bg-brand-500 rounded-full h-full transition-colors duration-300"></div>
               <div>
                 <h3 className="font-bold text-gray-900 text-lg font-display group-hover:text-brand-600 transition-colors">For Musicians & Bands</h3>
                 <p className="text-gray-600 font-sans">Showcase your portfolio, set your rates, and get direct offers from reputable organizers without the middleman hassle.</p>
               </div>
             </div>
             <div className="flex gap-4 pt-4 group">
               <div className="flex-shrink-0 w-1 bg-gray-200 group-hover:bg-brand-500 rounded-full h-full transition-colors duration-300"></div>
               <div>
                 <h3 className="font-bold text-gray-900 text-lg font-display group-hover:text-brand-600 transition-colors">For Event Organizers</h3>
                 <p className="text-gray-600 font-sans">Discover vetted talent in seconds. Listen to demos, read reviews, and book securely with transparent pricing.</p>
               </div>
             </div>
          </div>
        </div>
      </div>
    </Section>
  );
};

export default About;