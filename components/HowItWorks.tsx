import React from 'react';
import { motion } from 'motion/react';

const HowItWorks: React.FC = () => {
  return (
    <section id="how-it-works" className="py-24 lg:py-32 bg-linktree-red">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="order-1"
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-linktree-pink mb-6 tracking-tighter leading-[1.1]">
              How It Works
            </h2>
            <p className="text-linktree-pink text-lg md:text-xl mb-8 leading-relaxed font-medium">
              Start your journey to consistent bookings in four simple steps.
            </p>
            
            <div className="space-y-6 mb-8">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-linktree-pink text-linktree-red flex items-center justify-center font-bold text-xl flex-shrink-0">1</div>
                <div>
                  <h3 className="font-bold text-linktree-pink text-xl mb-1">Download App</h3>
                  <p className="text-linktree-pink/80 font-medium">Get the GigsConnect app from the App Store or Google Play Store.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-linktree-pink text-linktree-red flex items-center justify-center font-bold text-xl flex-shrink-0">2</div>
                <div>
                  <h3 className="font-bold text-linktree-pink text-xl mb-1">Create Profile</h3>
                  <p className="text-linktree-pink/80 font-medium">Upload your best photos, demo tracks, and list your instruments.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-linktree-pink text-linktree-red flex items-center justify-center font-bold text-xl flex-shrink-0">3</div>
                <div>
                  <h3 className="font-bold text-linktree-pink text-xl mb-1">Get Verified</h3>
                  <p className="text-linktree-pink/80 font-medium">Complete our verification process to earn the trusted badge.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-linktree-pink text-linktree-red flex items-center justify-center font-bold text-xl flex-shrink-0">4</div>
                <div>
                  <h3 className="font-bold text-linktree-pink text-xl mb-1">Book & Earn</h3>
                  <p className="text-linktree-pink/80 font-medium">Apply for gigs, perform, and receive secure payment instantly.</p>
                </div>
              </div>
            </div>

            <button className="px-8 py-4 rounded-full bg-linktree-pink text-linktree-dark font-semibold text-lg hover:bg-[#d8a8d8] transition-colors">
              Get started for free
            </button>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
            className="order-2 relative"
          >
            <div className="relative w-full aspect-square max-w-md mx-auto">
              <div className="absolute inset-0 bg-linktree-purple rounded-[3rem] transform rotate-6"></div>
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/Djembe_player.jpg/800px-Djembe_player.jpg" 
                alt="African Djembe Player" 
                referrerPolicy="no-referrer"
                className="absolute inset-0 w-full h-full object-cover rounded-[3rem] shadow-2xl transform -rotate-3"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;