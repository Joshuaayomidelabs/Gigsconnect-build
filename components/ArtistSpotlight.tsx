import React from 'react';

const ArtistSpotlight: React.FC = () => {
  return (
    <section id="spotlight" className="py-24 lg:py-32 bg-[#502274]">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className="order-1">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-[#e9c0e9] mb-6 tracking-tighter leading-[1.1]">
              Artist Spotlight
            </h2>
            <p className="text-[#e9c0e9] text-lg md:text-xl mb-8 leading-relaxed font-medium">
              Discover the incredible talent thriving on GigsConnect and landing their dream gigs.
            </p>
            
            <div className="bg-[#e9c0e9] rounded-3xl p-8 mb-8">
              <div className="flex items-center gap-4 mb-6">
                <img src="https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&q=80&w=150" alt="Amina Diop" referrerPolicy="no-referrer" className="w-16 h-16 rounded-full object-cover border-2 border-[#502274]" />
                <div>
                  <h3 className="font-bold text-[#502274] text-xl">Amina Diop</h3>
                  <p className="text-[#502274]/80 font-medium">Afro-Soul Vocalist • Dakar, Senegal</p>
                </div>
              </div>
              <p className="text-[#502274] font-medium text-lg italic">
                "Since joining GigsConnect, Amina has headlined 3 major festivals across West Africa and collaborated with top producers."
              </p>
            </div>

            <button className="px-8 py-4 rounded-full bg-[#e9c0e9] text-[#502274] font-semibold text-lg hover:bg-white transition-colors">
              Get started for free
            </button>
          </div>

          <div className="order-2 relative">
            <div className="relative w-full aspect-square max-w-md mx-auto">
              <div className="absolute inset-0 bg-linktree-pink rounded-[3rem] transform rotate-6"></div>
              <img 
                src="https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=800" 
                alt="Content Sharing" 
                referrerPolicy="no-referrer"
                className="absolute inset-0 w-full h-full object-cover rounded-[3rem] shadow-2xl transform -rotate-3"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ArtistSpotlight;
