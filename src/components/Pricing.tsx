import React, { useState } from 'react';
import { Check } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { PRICING_DATA } from '../utils/constants';

interface PricingTier {
  name: string;
  price: string;
  subPrice?: string;
  description: string;
  features: string[];
  recommended: boolean;
}

const Pricing: React.FC = () => {
  const [region, setRegion] = useState<'nigeria' | 'international'>('nigeria');
  const data = PRICING_DATA[region];

  return (
    <section id="pricing" className="py-24 lg:py-32 bg-brand-white">
      <div className="max-w-[1200px] mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-brand-black mb-6 tracking-tighter leading-[1.1]">
            Simple, <span className="text-brand-purple">Transparent</span> Pricing
          </h2>
          <p className="text-brand-gray-dark text-lg md:text-xl mb-10 leading-relaxed font-medium">
            Invest in your music career. Choose the plan that fits your stage.
          </p>
          
          {/* Toggle */}
          <div className="inline-flex bg-brand-gray p-1.5 rounded-full border border-brand-purple-light/20 shadow-sm relative">
            <button
              onClick={() => setRegion('nigeria')}
              className={`px-8 py-3 rounded-full text-base font-bold transition-all duration-200 ${
                region === 'nigeria' 
                  ? 'bg-brand-purple text-white shadow-md' 
                  : 'text-brand-gray-dark hover:bg-white'
              }`}
            >
              Nigeria (₦)
            </button>
            <button
              onClick={() => setRegion('international')}
              className={`px-8 py-3 rounded-full text-base font-bold transition-all duration-200 ${
                region === 'international' 
                  ? 'bg-brand-purple text-white shadow-md' 
                  : 'text-brand-gray-dark hover:bg-white'
              }`}
            >
              International ($)
            </button>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {data.tiers.map((tier: PricingTier, index: number) => (
            <motion.div 
              key={index} 
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, ease: "easeOut", delay: index * 0.15 }}
              className={`relative rounded-[2rem] p-8 md:p-10 transition-all duration-300 flex flex-col ${
                tier.recommended 
                  ? 'bg-brand-black text-white shadow-2xl scale-105 z-10 border-2 border-brand-purple' 
                  : 'bg-white text-brand-black border border-brand-purple-light/30 shadow-lg hover:shadow-xl'
              }`}
            >
              {tier.recommended && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-brand-purple text-white px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wide shadow-lg">
                  Most Popular
                </div>
              )}
              
              <div className="mb-6">
                <h3 className={`text-2xl font-bold mb-2 ${tier.recommended ? 'text-white' : 'text-brand-black'}`}>{tier.name}</h3>
                <p className={`text-base font-medium ${tier.recommended ? 'text-white/80' : 'text-brand-gray-dark'}`}>{tier.description}</p>
              </div>

              <div className="mb-8">
                <span className={`text-5xl font-black tracking-tighter ${tier.recommended ? 'text-white' : 'text-brand-black'}`}>{tier.price}</span>
                {tier.subPrice && (
                  <span className={`text-sm block mt-2 font-medium ${tier.recommended ? 'text-white/70' : 'text-brand-gray-dark'}`}>{tier.subPrice}</span>
                )}
              </div>

              <ul className="space-y-5 mb-10 flex-grow">
                {tier.features.map((feature: string, i: number) => (
                  <li key={i} className="flex items-start">
                    <Check className={`w-6 h-6 mr-3 flex-shrink-0 ${tier.recommended ? 'text-brand-purple-light' : 'text-brand-purple'}`} />
                    <span className={`text-base font-medium ${tier.recommended ? 'text-white/90' : 'text-brand-black/80'}`}>{feature}</span>
                  </li>
                ))}
              </ul>

              <Link 
                to="/signup"
                className={`w-full py-4 rounded-full font-semibold text-lg transition-all text-center inline-block hover:scale-105 ${
                  tier.recommended 
                    ? 'bg-brand-purple text-white hover:bg-brand-purple-dark shadow-lg shadow-purple-500/20' 
                    : 'bg-brand-purple-soft text-brand-purple hover:bg-brand-purple-light'
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
          className="text-center text-brand-gray-dark text-sm mt-16 font-medium"
        >
          * Pricing subject to change based on local currency fluctuations for international users.
        </motion.p>
      </div>
    </section>
  );
};

export default Pricing;