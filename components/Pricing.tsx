import React, { useState } from 'react';
import { Check } from 'lucide-react';
import { PRICING_DATA } from '../constants';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';

const Pricing: React.FC = () => {
  const [region, setRegion] = useState<'nigeria' | 'international'>('nigeria');
  const data = PRICING_DATA[region];

  return (
    <section id="pricing" className="py-24 lg:py-32 bg-[#f3f3f1]">
      <div className="max-w-[1200px] mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-linktree-dark mb-6 tracking-tighter leading-[1.1]">
            Simple, Transparent Pricing
          </h2>
          <p className="text-linktree-dark/80 text-lg md:text-xl mb-10 leading-relaxed font-medium">
            Invest in your music career. Choose the plan that fits your stage.
          </p>
          
          {/* Toggle */}
          <div className="inline-flex bg-white p-1.5 rounded-full border border-gray-200 shadow-sm relative">
            <button
              onClick={() => setRegion('nigeria')}
              className={`px-8 py-3 rounded-full text-base font-bold transition-all duration-200 ${
                region === 'nigeria' 
                  ? 'bg-linktree-dark text-white shadow-md' 
                  : 'text-linktree-dark/70 hover:bg-gray-50'
              }`}
            >
              Nigeria (₦)
            </button>
            <button
              onClick={() => setRegion('international')}
              className={`px-8 py-3 rounded-full text-base font-bold transition-all duration-200 ${
                region === 'international' 
                  ? 'bg-linktree-dark text-white shadow-md' 
                  : 'text-linktree-dark/70 hover:bg-gray-50'
              }`}
            >
              International ($)
            </button>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {data.tiers.map((tier, index) => (
            <motion.div 
              key={index} 
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, ease: "easeOut", delay: index * 0.15 }}
              className={`relative rounded-[2rem] p-8 md:p-10 transition-all duration-300 flex flex-col ${
                tier.recommended 
                  ? 'bg-linktree-dark text-white shadow-2xl scale-105 z-10' 
                  : 'bg-white text-linktree-dark border border-gray-100 shadow-lg'
              }`}
            >
              {tier.recommended && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-linktree-lime text-linktree-dark px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wide shadow-lg">
                  Most Popular
                </div>
              )}
              
              <div className="mb-6">
                <h3 className={`text-2xl font-bold mb-2 ${tier.recommended ? 'text-white' : 'text-linktree-dark'}`}>{tier.name}</h3>
                <p className={`text-base font-medium ${tier.recommended ? 'text-white/80' : 'text-linktree-dark/70'}`}>{tier.description}</p>
              </div>

              <div className="mb-8">
                <span className={`text-5xl font-black tracking-tighter ${tier.recommended ? 'text-white' : 'text-linktree-dark'}`}>{tier.price}</span>
                {tier.subPrice && (
                  <span className={`text-sm block mt-2 font-medium ${tier.recommended ? 'text-white/70' : 'text-linktree-dark/60'}`}>{tier.subPrice}</span>
                )}
              </div>

              <ul className="space-y-5 mb-10 flex-grow">
                {tier.features.map((feature, i) => (
                  <li key={i} className="flex items-start">
                    <Check className={`w-6 h-6 mr-3 flex-shrink-0 ${tier.recommended ? 'text-linktree-lime' : 'text-linktree-dark'}`} />
                    <span className={`text-base font-medium ${tier.recommended ? 'text-white/90' : 'text-linktree-dark/80'}`}>{feature}</span>
                  </li>
                ))}
              </ul>

              <Link 
                to="/signup"
                className={`w-full py-4 rounded-full font-semibold text-lg transition-colors text-center inline-block ${
                  tier.recommended 
                    ? 'bg-linktree-lime text-linktree-dark hover:bg-[#b5e853]' 
                    : 'bg-linktree-gray text-linktree-dark hover:bg-gray-200'
                }`}
              >
                Get Started
              </Link>
            </motion.div>
          ))}
        </div>
        
        <motion.p 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-center text-linktree-dark/50 text-sm mt-16 font-medium"
        >
          * Pricing subject to change based on local currency fluctuations for international users.
        </motion.p>
      </div>
    </section>
  );
};

export default Pricing;