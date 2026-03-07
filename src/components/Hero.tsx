import React from 'react';
import { Apple, Play } from 'lucide-react';
import { motion } from 'motion/react';

const Hero: React.FC = () => {
  return (
    <div className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-linktree-green min-h-screen flex items-center">
      <div className="max-w-[1200px] mx-auto px-6 relative z-10 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          <div className="text-center lg:text-left relative max-w-2xl mx-auto lg:mx-0">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="text-5xl sm:text-6xl lg:text-[5.5rem] font-black text-linktree-lime tracking-tighter leading-[1.05] mb-6 lg:mb-8"
            >
              Africa’s Stage for Music Talent
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
              className="text-base sm:text-lg lg:text-xl text-linktree-lime mb-8 lg:mb-10 leading-relaxed font-medium"
            >
              We connect African artists—musicians, vocalists, and bands—to verified gigs, collaborations, and career-changing opportunities. Your stage is waiting.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <button className="px-6 py-3 rounded-xl bg-linktree-pink text-linktree-dark font-semibold hover:bg-[#d8a8d8] transition-transform hover:scale-105 whitespace-nowrap flex items-center justify-center gap-3 w-full sm:w-auto min-w-[200px]">
                <Play className="w-7 h-7 fill-current" />
                <div className="flex flex-col items-start leading-none">
                  <span className="text-[10px] opacity-90 uppercase tracking-wider mb-1">Get it on</span>
                  <span className="font-bold text-lg">Google Play</span>
                </div>
              </button>
              <button className="px-6 py-3 rounded-xl bg-white text-linktree-dark font-semibold hover:bg-gray-100 transition-transform hover:scale-105 whitespace-nowrap flex items-center justify-center gap-3 w-full sm:w-auto min-w-[200px]">
                <Apple className="w-7 h-7 mb-0.5 fill-current" />
                <div className="flex flex-col items-start leading-none">
                  <span className="text-[10px] opacity-80 uppercase tracking-wider mb-1">Download on the</span>
                  <span className="font-bold text-lg">App Store</span>
                </div>
              </button>
            </motion.div>
          </div>

          <div className="relative hidden lg:block h-[600px]">
             {/* Mockup representation */}
             <motion.div 
               initial={{ opacity: 0, scale: 0.9, rotate: 0 }}
               animate={{ opacity: 1, scale: 1, rotate: 2 }}
               transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
               className="absolute right-0 top-1/2 -translate-y-1/2 w-[300px] h-[600px] bg-[#f3a8b6] rounded-[3rem] shadow-2xl overflow-hidden border-8 border-linktree-green transform"
             >
                <div className="p-6 pt-12 flex flex-col items-center">
                  <img src="https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&q=80&w=150" alt="Profile" referrerPolicy="no-referrer" className="w-24 h-24 rounded-full border-4 border-white mb-4 object-cover" />
                  <h3 className="font-bold text-linktree-dark text-xl">Artist Name</h3>
                  <p className="text-sm text-linktree-dark/80 mb-6">Musician • Producer</p>
                  
                  <div className="w-full space-y-3">
                    <div className="w-full py-3 bg-white/50 rounded-full text-center text-sm font-semibold text-linktree-dark">Latest Release</div>
                    <div className="w-full py-3 bg-white/50 rounded-full text-center text-sm font-semibold text-linktree-dark">Merch Store</div>
                    <div className="w-full py-3 bg-white/50 rounded-full text-center text-sm font-semibold text-linktree-dark">Tour Dates</div>
                  </div>
                </div>
             </motion.div>
             
             {/* Floating element 1 */}
             <motion.div 
               initial={{ opacity: 0, x: -20, rotate: 0 }}
               animate={{ opacity: 1, x: 0, rotate: -6 }}
               transition={{ duration: 0.7, delay: 0.5, ease: "easeOut" }}
               className="absolute left-0 top-1/4 w-64 rounded-2xl overflow-hidden shadow-xl transform z-20"
             >
                <img src="https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=400" alt="Music" referrerPolicy="no-referrer" className="w-full h-auto" />
                <div className="absolute inset-0 bg-black/20"></div>
                <h4 className="absolute bottom-4 left-4 text-linktree-lime font-black text-3xl tracking-tighter">My Journey</h4>
             </motion.div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Hero;