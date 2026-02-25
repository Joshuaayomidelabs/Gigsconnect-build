import React, { useEffect, useState } from 'react';
import Button from './Button';
import { Apple, Play } from 'lucide-react';
import Lottie from 'lottie-react';

const Hero: React.FC = () => {
  const [animationData, setAnimationData] = useState<any>(null);

  useEffect(() => {
    // Fetching a clean audio wave animation
    fetch('https://lottie.host/0a943645-1845-4228-ae70-348f654e9309/2r7s7x48M6.json')
      .then(response => {
        if (response.ok) return response.json();
        throw new Error('Network response was not ok.');
      })
      .then(data => setAnimationData(data))
      .catch((error) => {
        // Fallback or silent fail
        console.log("Animation load failed, falling back to static", error);
      });
  }, []);

  return (
    <div className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-gradient-to-b from-brand-50/50 to-gray-50">
      {/* Animated Background Blobs */}
      <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden transform-gpu">
        <div className="absolute top-[-10%] left-[-10%] w-[40rem] h-[40rem] bg-purple-200/60 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute top-[-10%] right-[-10%] w-[35rem] h-[35rem] bg-brand-200/60 rounded-full mix-blend-multiply filter blur-3xl animate-blob" style={{ animationDelay: '4s' }}></div>
        <div className="absolute bottom-[-20%] left-[20%] w-[45rem] h-[45rem] bg-indigo-200/60 rounded-full mix-blend-multiply filter blur-3xl animate-blob" style={{ animationDelay: '8s' }}></div>
        <div className="absolute bottom-[-10%] right-[-5%] w-[30rem] h-[30rem] bg-pink-200/50 rounded-full mix-blend-multiply filter blur-3xl animate-blob" style={{ animationDelay: '12s' }}></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          <div className="text-center lg:text-left relative">
            
            {/* Subtle Lottie Animation positioned behind/near text */}
            {animationData && (
              <div className="absolute -top-20 -left-20 w-64 h-64 opacity-30 pointer-events-none -z-10 hidden lg:block">
                <Lottie animationData={animationData} loop={true} />
              </div>
            )}

            <div className="inline-block px-4 py-2 rounded-full bg-white border border-brand-100 text-brand-600 font-bold text-sm mb-6 shadow-sm font-display tracking-wide">
              🚀 AFRICA'S #1 MUSIC MARKETPLACE
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 tracking-tight leading-[1.1] mb-6 font-display">
              Africa’s Stage for <br />
              <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-brand-600 via-purple-600 to-indigo-600">
                Music Talent
                <svg className="absolute w-full h-3 -bottom-1 left-0 text-accent-500 opacity-60" viewBox="0 0 200 9" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.00029 6.99997C33.1594 2.82296 113.824 -3.10705 197.999 4.39999" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/></svg>
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-medium font-sans">
              We connect African artists—musicians, vocalists, and bands—to verified gigs, collaborations, and career-changing opportunities. Your stage is waiting.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button variant="primary" className="flex items-center gap-3 px-8">
                <Play className="w-5 h-5 fill-current" />
                <div className="flex flex-col items-start leading-none">
                  <span className="text-[10px] opacity-90 uppercase tracking-wider font-sans">Get it on</span>
                  <span className="font-bold text-base font-display">Google Play</span>
                </div>
              </Button>
              <Button variant="outline" className="flex items-center gap-3 px-8 border-2 hover:border-gray-900 bg-white/50 backdrop-blur-sm">
                <Apple className="w-5 h-5 mb-0.5" />
                <div className="flex flex-col items-start leading-none">
                  <span className="text-[10px] opacity-80 uppercase tracking-wider font-sans">Download on</span>
                  <span className="font-bold text-base font-display">App Store</span>
                </div>
              </Button>
            </div>
            
            <div className="mt-10 flex items-center justify-center lg:justify-start gap-4 text-sm font-medium text-gray-500 relative">
               {/* Small Lottie decorative element near stats */}
               {animationData && (
                  <div className="absolute -right-10 top-0 w-24 h-24 opacity-20 pointer-events-none hidden lg:block">
                     <Lottie animationData={animationData} loop={true} />
                  </div>
               )}
              <div className="flex -space-x-3">
                 <img className="w-10 h-10 rounded-full border-2 border-white object-cover shadow-sm" src="https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&q=80&w=100" alt="User" />
                 <img className="w-10 h-10 rounded-full border-2 border-white object-cover shadow-sm" src="https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?auto=format&fit=crop&q=80&w=100" alt="User" />
                 <img className="w-10 h-10 rounded-full border-2 border-white object-cover shadow-sm" src="https://images.unsplash.com/photo-1589156280159-27698a70f29e?auto=format&fit=crop&q=80&w=100" alt="User" />
                 <div className="w-10 h-10 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600 shadow-sm">+5k</div>
              </div>
              <p>Trusted by <span className="text-brand-600 font-bold">5,000+</span> artists</p>
            </div>
          </div>

          <div className="relative">
             <div className="relative rounded-[2rem] overflow-hidden shadow-2xl transform rotate-2 hover:rotate-0 transition-all duration-700 ease-out border-4 border-white group">
                <img 
                  src="https://images.unsplash.com/photo-1546707012-c46675f12716?auto=format&fit=crop&q=80&w=800" 
                  alt="African Musician Performing" 
                  className="w-full h-auto object-cover scale-105 hover:scale-100 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                <div className="absolute bottom-6 left-6 right-6 backdrop-blur-md bg-white/10 border border-white/20 p-4 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div>
                        <p className="text-white font-bold text-lg font-display">The Lagos Jazz Collective</p>
                        <div className="flex items-center gap-2 text-white/90 text-sm mt-1 font-sans">
                            <span className="w-2 h-2 bg-accent-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(204,255,0,0.6)]"></span>
                            Booked 5 gigs this month
                        </div>
                    </div>
                    {/* Equalizer animation in the card */}
                    {animationData && (
                        <div className="w-12 h-12 opacity-80 filter invert brightness-200">
                             <Lottie animationData={animationData} loop={true} />
                        </div>
                    )}
                  </div>
                </div>
             </div>
             
             {/* Decorative element behind image */}
             <div className="absolute -z-10 -bottom-6 -right-6 w-full h-full rounded-[2rem] border-2 border-brand-200/50 hidden md:block"></div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Hero;