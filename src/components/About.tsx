import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';

const About: React.FC = () => {
  return (
    <section id="about" className="py-24 lg:py-32 bg-brand-white">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="order-2 md:order-1 relative"
          >
            <div className="relative w-full aspect-square max-w-md mx-auto">
              <div className="absolute inset-0 bg-brand-purple-soft rounded-[3rem] transform -rotate-6"></div>
              <img 
                src="https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&q=80&w=800" 
                alt="Studio Recording Microphone" 
                referrerPolicy="no-referrer"
                className="absolute inset-0 w-full h-full object-cover rounded-[3rem] shadow-2xl transform rotate-3 border-4 border-white"
              />
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
            className="order-1 md:order-2"
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-brand-black mb-6 tracking-tighter leading-[1.1]">
              More Than Just a <span className="text-brand-purple">Booking</span> Platform
            </h2>
            <p className="text-brand-gray-dark text-lg md:text-xl mb-8 leading-relaxed font-medium">
              GigsConnect is the digital bridge between raw African talent and the stages they deserve. We remove the chaos of finding work in the music industry.
            </p>
            <div className="space-y-6 mb-8">
               <div className="flex gap-4">
                 <div className="flex-shrink-0 w-1 bg-brand-purple rounded-full"></div>
                 <div>
                   <h3 className="font-bold text-brand-black text-xl mb-2">For Musicians & Bands</h3>
                   <p className="text-brand-gray-dark font-medium">Showcase your portfolio, set your rates, and get direct offers from reputable organizers without the middleman hassle.</p>
                 </div>
               </div>
               <div className="flex gap-4">
                 <div className="flex-shrink-0 w-1 bg-brand-purple rounded-full"></div>
                 <div>
                   <h3 className="font-bold text-brand-black text-xl mb-2">For Event Organizers</h3>
                   <p className="text-brand-gray-dark font-medium">Discover vetted talent in seconds. Listen to demos, read reviews, and book securely with transparent pricing.</p>
                 </div>
               </div>
            </div>
            <Link to="/signup" className="inline-block px-8 py-4 rounded-full bg-brand-purple text-white font-semibold text-lg hover:bg-brand-purple-dark transition-all hover:scale-105 shadow-lg hover:shadow-purple-500/20">
              Get started for free
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;