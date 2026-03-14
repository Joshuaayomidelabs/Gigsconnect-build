import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';

const Features: React.FC = () => {
  return (
    <section id="features" className="py-24 lg:py-32 bg-gray-50 dark:bg-gray-900 transition-colors duration-500">
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
              <div className="absolute inset-0 bg-blue-50 dark:bg-blue-900/20 rounded-[3rem] transform -rotate-6"></div>
              <img 
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800" 
                alt="Analytics Dashboard" 
                referrerPolicy="no-referrer"
                className="absolute inset-0 w-full h-full object-cover rounded-[3rem] shadow-2xl transform rotate-3 border-4 border-white dark:border-gray-800"
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
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 dark:text-gray-100 mb-6 tracking-tighter leading-[1.1]">
              Why Artists <span className="text-blue-600 dark:text-blue-400">Choose</span> Us
            </h2>
            <p className="text-gray-700 dark:text-gray-200 text-lg md:text-xl mb-8 leading-relaxed font-medium">
              Built by musicians, for musicians. We understand the industry.
            </p>
            
            <div className="space-y-6 mb-8">
              <div className="flex items-start gap-4">
                <div className="w-2 h-2 mt-2.5 rounded-full bg-blue-500 dark:bg-blue-400 flex-shrink-0"></div>
                <div>
                   <h3 className="font-bold text-gray-900 dark:text-gray-100 text-xl mb-1">Verified Artists</h3>
                   <p className="text-gray-700 dark:text-gray-200 font-medium">We vet every profile to ensure talent authenticity and quality for organizers.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-2 h-2 mt-2.5 rounded-full bg-blue-500 dark:bg-blue-400 flex-shrink-0"></div>
                <div>
                   <h3 className="font-bold text-gray-900 dark:text-gray-100 text-xl mb-1">Secure Payments</h3>
                   <p className="text-gray-700 dark:text-gray-200 font-medium">Guaranteed payments for completed gigs. No more chasing invoices.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-2 h-2 mt-2.5 rounded-full bg-blue-500 dark:bg-blue-400 flex-shrink-0"></div>
                <div>
                   <h3 className="font-bold text-gray-900 dark:text-gray-100 text-xl mb-1">Pan-African Reach</h3>
                   <p className="text-gray-700 dark:text-gray-200 font-medium">Access opportunities beyond your city. Connect with organizers across the continent.</p>
                </div>
              </div>
            </div>

            <Link to="/signup" className="inline-block px-8 py-4 rounded-full bg-blue-500 dark:bg-blue-400 text-white dark:text-gray-900 font-semibold text-lg hover:bg-blue-600 dark:hover:bg-blue-500 transition-all hover:scale-105 shadow-lg hover:shadow-blue-500/20">
              Get started for free
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Features;