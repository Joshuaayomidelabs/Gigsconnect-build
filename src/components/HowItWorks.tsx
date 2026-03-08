import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';

const HowItWorks: React.FC = () => {
  return (
    <section id="how-it-works" className="py-24 lg:py-32 bg-brand-white relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-brand-purple/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-[1200px] mx-auto px-6 relative z-10">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="order-1"
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-brand-black mb-6 tracking-tighter leading-[1.1]">
              How It <span className="text-brand-purple">Works</span>
            </h2>
            <p className="text-brand-gray-dark text-lg md:text-xl mb-8 leading-relaxed font-medium">
              Start your journey to consistent bookings in four simple steps.
            </p>
            
            <div className="space-y-6 mb-8">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-brand-purple text-white flex items-center justify-center font-bold text-xl flex-shrink-0 shadow-lg shadow-purple-500/20">1</div>
                <div>
                  <h3 className="font-bold text-brand-black text-xl mb-1">Sign Up</h3>
                  <p className="text-brand-gray-dark font-medium">Create your free account on GigsConnect in just a few seconds.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-brand-purple text-white flex items-center justify-center font-bold text-xl flex-shrink-0 shadow-lg shadow-purple-500/20">2</div>
                <div>
                  <h3 className="font-bold text-brand-black text-xl mb-1">Create Profile</h3>
                  <p className="text-brand-gray-dark font-medium">Upload your best photos, demo tracks, and list your instruments.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-brand-purple text-white flex items-center justify-center font-bold text-xl flex-shrink-0 shadow-lg shadow-purple-500/20">3</div>
                <div>
                  <h3 className="font-bold text-brand-black text-xl mb-1">Get Verified</h3>
                  <p className="text-brand-gray-dark font-medium">Complete our verification process to earn the trusted badge.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-brand-purple text-white flex items-center justify-center font-bold text-xl flex-shrink-0 shadow-lg shadow-purple-500/20">4</div>
                <div>
                  <h3 className="font-bold text-brand-black text-xl mb-1">Book & Earn</h3>
                  <p className="text-brand-gray-dark font-medium">Apply for gigs, perform, and receive secure payment instantly.</p>
                </div>
              </div>
            </div>

            <Link to="/signup" className="inline-block px-8 py-4 rounded-full bg-brand-purple text-white font-semibold text-lg hover:bg-brand-purple-dark transition-all hover:scale-105 shadow-lg hover:shadow-purple-500/20">
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
              <div className="absolute inset-0 bg-brand-purple-soft rounded-[3rem] transform rotate-6"></div>
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/Djembe_player.jpg/800px-Djembe_player.jpg" 
                alt="African Djembe Player" 
                referrerPolicy="no-referrer"
                className="absolute inset-0 w-full h-full object-cover rounded-[3rem] shadow-2xl transform -rotate-3 border-4 border-white"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;