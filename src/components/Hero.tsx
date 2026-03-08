import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';

const Hero: React.FC = () => {
  return (
    <div className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-white min-h-screen flex items-center">
      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[800px] h-[800px] bg-brand-purple/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-[600px] h-[600px] bg-brand-purple/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-[1200px] mx-auto px-6 relative z-10 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          <div className="text-center lg:text-left relative max-w-2xl mx-auto lg:mx-0">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="inline-block px-4 py-1.5 mb-6 rounded-full bg-brand-purple-soft border border-brand-purple-light text-brand-purple text-sm font-bold tracking-wide uppercase"
            >
              The Future of African Talent
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="text-5xl sm:text-6xl lg:text-[5.5rem] font-black text-brand-black tracking-tighter leading-[1.05] mb-6 lg:mb-8"
            >
              Find Gigs. <span className="text-brand-purple">Connect</span> With Talent.
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
              className="text-base sm:text-lg lg:text-xl text-brand-gray-dark mb-8 lg:mb-10 leading-relaxed font-medium"
            >
              A modern platform where creators, freelancers, and professionals connect to collaborate and get work done.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <Link 
                to="/signup"
                className="px-8 py-4 rounded-full bg-brand-purple text-white font-bold hover:bg-brand-purple-dark transition-all hover:scale-105 shadow-lg hover:shadow-purple-500/25 purple-glow whitespace-nowrap w-full sm:w-auto min-w-[180px] text-lg text-center"
              >
                Sign Up Free
              </Link>
              <Link 
                to="/login"
                className="px-8 py-4 rounded-full bg-white text-brand-black font-bold border border-brand-purple-light hover:bg-brand-purple-soft transition-all hover:scale-105 shadow-sm hover:shadow-md whitespace-nowrap w-full sm:w-auto min-w-[180px] text-lg text-center"
              >
                Login
              </Link>
            </motion.div>
          </div>

          <div className="relative hidden lg:block h-[600px]">
             {/* Mockup representation */}
             <motion.div 
               initial={{ opacity: 0, scale: 0.9, rotate: 0 }}
               animate={{ opacity: 1, scale: 1, rotate: 2 }}
               transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
               className="absolute right-0 top-1/2 -translate-y-1/2 w-[300px] h-[600px] bg-brand-white rounded-[3rem] shadow-2xl overflow-hidden border-8 border-brand-black transform"
             >
                <div className="p-6 pt-12 flex flex-col items-center">
                  <div className="relative mb-4">
                    <img src="https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&q=80&w=150" alt="Profile" referrerPolicy="no-referrer" className="w-24 h-24 rounded-full border-4 border-brand-purple-light object-cover" />
                    <div className="absolute bottom-0 right-0 w-6 h-6 bg-green-500 border-2 border-white rounded-full"></div>
                  </div>
                  <h3 className="font-bold text-brand-black text-xl">Aisha Bello</h3>
                  <p className="text-sm text-brand-gray-dark mb-6">Vocalist • Songwriter</p>
                  
                  <div className="w-full space-y-3">
                    <div className="w-full py-3 bg-brand-purple-soft rounded-full text-center text-sm font-semibold text-brand-purple">Latest Release</div>
                    <div className="w-full py-3 bg-brand-purple-soft rounded-full text-center text-sm font-semibold text-brand-purple">Merch Store</div>
                    <div className="w-full py-3 bg-brand-purple-soft rounded-full text-center text-sm font-semibold text-brand-purple">Tour Dates</div>
                  </div>
                </div>
             </motion.div>
             
             {/* Floating element 1 */}
             <motion.div 
               initial={{ opacity: 0, x: -20, rotate: 0 }}
               animate={{ opacity: 1, x: 0, rotate: -6 }}
               transition={{ duration: 0.7, delay: 0.5, ease: "easeOut" }}
               className="absolute left-0 top-1/4 w-64 rounded-2xl overflow-hidden shadow-xl transform z-20 border-4 border-brand-white"
             >
                <img src="https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=400" alt="Music" referrerPolicy="no-referrer" className="w-full h-auto" />
                <div className="absolute inset-0 bg-brand-purple/20"></div>
                <h4 className="absolute bottom-4 left-4 text-white font-black text-3xl tracking-tighter">My Journey</h4>
             </motion.div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Hero;
