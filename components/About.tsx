import React from 'react';

const About: React.FC = () => {
  return (
    <section id="about" className="py-24 lg:py-32 bg-linktree-pink">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className="order-2 md:order-1 relative">
            <div className="relative w-full aspect-square max-w-md mx-auto">
              <div className="absolute inset-0 bg-linktree-lime rounded-[3rem] transform -rotate-6"></div>
              <img 
                src="https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&q=80&w=800" 
                alt="Studio Recording Microphone" 
                referrerPolicy="no-referrer"
                className="absolute inset-0 w-full h-full object-cover rounded-[3rem] shadow-2xl transform rotate-3"
              />
            </div>
          </div>

          <div className="order-1 md:order-2">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-linktree-purple mb-6 tracking-tighter leading-[1.1]">
              More Than Just a Booking App
            </h2>
            <p className="text-linktree-purple text-lg md:text-xl mb-8 leading-relaxed font-medium">
              GigsConnect is the digital bridge between raw African talent and the stages they deserve. We remove the chaos of finding work in the music industry.
            </p>
            <div className="space-y-6 mb-8">
               <div className="flex gap-4">
                 <div className="flex-shrink-0 w-1 bg-linktree-purple rounded-full"></div>
                 <div>
                   <h3 className="font-bold text-linktree-purple text-xl mb-2">For Musicians & Bands</h3>
                   <p className="text-linktree-purple/80 font-medium">Showcase your portfolio, set your rates, and get direct offers from reputable organizers without the middleman hassle.</p>
                 </div>
               </div>
               <div className="flex gap-4">
                 <div className="flex-shrink-0 w-1 bg-linktree-purple rounded-full"></div>
                 <div>
                   <h3 className="font-bold text-linktree-purple text-xl mb-2">For Event Organizers</h3>
                   <p className="text-linktree-purple/80 font-medium">Discover vetted talent in seconds. Listen to demos, read reviews, and book securely with transparent pricing.</p>
                 </div>
               </div>
            </div>
            <button className="px-8 py-4 rounded-full bg-linktree-purple text-white font-semibold text-lg hover:bg-[#3a1853] transition-colors">
              Get started for free
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;