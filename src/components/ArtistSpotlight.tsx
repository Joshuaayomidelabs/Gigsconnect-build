import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';

const ArtistSpotlight: React.FC = () => {
  return (
    <section id="spotlight" className="py-24 lg:py-32 bg-brand-black relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-purple/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-[1200px] mx-auto px-6 relative z-10">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="order-1"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-purple/20 border border-brand-purple/30 text-brand-purple-light text-sm font-bold mb-6 tracking-wide uppercase">
              <span className="w-2 h-2 rounded-full bg-brand-purple animate-pulse"></span>
              Artist Spotlight
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 tracking-tighter leading-[1.1]">
              Discover <span className="text-brand-purple">African</span> Talent
            </h2>
            <p className="text-brand-gray-dark text-lg md:text-xl mb-8 leading-relaxed font-medium">
              Discover the incredible talent thriving on GigsConnect and landing their dream gigs across the continent.
            </p>
            
            <div className="bg-white rounded-3xl p-8 mb-8 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-purple/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700"></div>
              
              <div className="flex items-center gap-4 mb-6 relative z-10">
                <img 
                  src="https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&q=80&w=150" 
                  alt="Amina Diop" 
                  referrerPolicy="no-referrer" 
                  className="w-16 h-16 rounded-full object-cover border-2 border-brand-purple-light" 
                />
                <div>
                  <h3 className="font-bold text-brand-black text-xl">Amina Diop</h3>
                  <p className="text-brand-gray-dark font-medium">Afro-Soul Vocalist • Dakar, Senegal</p>
                </div>
              </div>
              <p className="text-brand-black font-medium text-lg italic relative z-10">
                "Since joining GigsConnect, Amina has headlined 3 major festivals across West Africa and collaborated with top producers."
              </p>
            </div>

            <Link to="/signup" className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-brand-purple text-white font-bold text-lg hover:bg-brand-purple-dark transition-all hover:scale-105 active:scale-95 purple-glow">
              Get started for free
            </Link>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
            className="order-2 relative"
          >
            <div className="relative w-full aspect-square max-w-md mx-auto">
              <div className="absolute inset-0 bg-brand-purple rounded-[3rem] transform rotate-6 opacity-20 blur-xl"></div>
              <div className="absolute inset-0 bg-gradient-to-br from-brand-purple to-brand-purple-dark rounded-[3rem] transform rotate-3"></div>
              <img 
                src="https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&q=80&w=800" 
                alt="African musician playing djembe" 
                referrerPolicy="no-referrer"
                className="absolute inset-0 w-full h-full object-cover rounded-[3rem] shadow-2xl transform -rotate-3 hover:rotate-0 transition-transform duration-500"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ArtistSpotlight;
