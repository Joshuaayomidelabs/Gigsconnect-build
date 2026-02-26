import React from 'react';

const Features: React.FC = () => {
  return (
    <section id="features" className="py-24 lg:py-32 bg-white">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className="order-2 md:order-1 relative">
            <div className="relative w-full aspect-square max-w-md mx-auto">
              <div className="absolute inset-0 bg-linktree-gray rounded-[3rem] transform -rotate-6"></div>
              <img 
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800" 
                alt="Analytics Dashboard" 
                referrerPolicy="no-referrer"
                className="absolute inset-0 w-full h-full object-cover rounded-[3rem] shadow-2xl transform rotate-3"
              />
            </div>
          </div>

          <div className="order-1 md:order-2">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-linktree-dark mb-6 tracking-tighter leading-[1.1]">
              Why Artists Choose Us
            </h2>
            <p className="text-linktree-dark/80 text-lg md:text-xl mb-8 leading-relaxed font-medium">
              Built by musicians, for musicians. We understand the industry.
            </p>
            
            <div className="space-y-6 mb-8">
              <div className="flex items-start gap-4">
                <div className="w-2 h-2 mt-2.5 rounded-full bg-linktree-dark flex-shrink-0"></div>
                <div>
                  <h3 className="font-bold text-linktree-dark text-xl mb-1">Verified Artists</h3>
                  <p className="text-linktree-dark/80 font-medium">We vet every profile to ensure talent authenticity and quality for organizers.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-2 h-2 mt-2.5 rounded-full bg-linktree-dark flex-shrink-0"></div>
                <div>
                  <h3 className="font-bold text-linktree-dark text-xl mb-1">Secure Payments</h3>
                  <p className="text-linktree-dark/80 font-medium">Guaranteed payments for completed gigs. No more chasing invoices.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-2 h-2 mt-2.5 rounded-full bg-linktree-dark flex-shrink-0"></div>
                <div>
                  <h3 className="font-bold text-linktree-dark text-xl mb-1">Pan-African Reach</h3>
                  <p className="text-linktree-dark/80 font-medium">Access opportunities beyond your city. Connect with organizers across the continent.</p>
                </div>
              </div>
            </div>

            <button className="px-8 py-4 rounded-full bg-linktree-pink text-linktree-dark font-semibold text-lg hover:bg-[#d8a8d8] transition-colors">
              Get started for free
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;