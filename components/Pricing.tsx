import React, { useState } from 'react';
import Section from './Section';
import { Check } from 'lucide-react';
import { PRICING_DATA } from '../constants';
import Button from './Button';

const Pricing: React.FC = () => {
  const [region, setRegion] = useState<'nigeria' | 'international'>('nigeria');
  const data = PRICING_DATA[region];

  return (
    <Section id="pricing" dark>
      <div className="text-center max-w-3xl mx-auto mb-10">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-display">Simple, Transparent Pricing</h2>
        <p className="text-gray-600 text-lg mb-8 font-sans">Invest in your music career. Choose the plan that fits your stage.</p>
        
        {/* Toggle */}
        <div className="inline-flex bg-white p-1 rounded-full border border-gray-200 shadow-sm relative">
          <button
            onClick={() => setRegion('nigeria')}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              region === 'nigeria' 
                ? 'bg-brand-600 text-white shadow-md' 
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            Nigeria (₦)
          </button>
          <button
            onClick={() => setRegion('international')}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              region === 'international' 
                ? 'bg-brand-600 text-white shadow-md' 
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            International ($)
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {data.tiers.map((tier, index) => (
          <div 
            key={index} 
            className={`relative rounded-2xl p-8 transition-all duration-300 flex flex-col ${
              tier.recommended 
                ? 'bg-white border-2 border-brand-500 shadow-2xl scale-105 z-10 hover:shadow-brand-500/30' 
                : 'bg-white border border-gray-100 shadow-lg hover:shadow-2xl hover:-translate-y-2'
            }`}
          >
            {tier.recommended && (
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-accent-500 text-brand-900 px-4 py-1 rounded-full text-sm font-bold uppercase tracking-wide shadow-lg font-display">
                Most Popular
              </div>
            )}
            
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-900 font-display">{tier.name}</h3>
              <p className="text-sm text-gray-500 mt-2 h-10 font-sans">{tier.description}</p>
            </div>

            <div className="mb-8">
              <span className="text-4xl font-extrabold text-gray-900 font-display tracking-tight">{tier.price}</span>
              {tier.subPrice && (
                <span className="text-gray-500 text-sm block mt-1 font-sans">{tier.subPrice}</span>
              )}
            </div>

            <ul className="space-y-4 mb-8 flex-grow">
              {tier.features.map((feature, i) => (
                <li key={i} className="flex items-start">
                  <Check className={`w-5 h-5 mr-3 flex-shrink-0 mt-0.5 ${tier.recommended ? 'text-accent-600' : 'text-brand-600'}`} />
                  <span className="text-gray-600 text-sm font-sans">{feature}</span>
                </li>
              ))}
            </ul>

            <Button 
              variant={tier.recommended ? 'primary' : 'outline'} 
              className="w-full justify-center"
            >
              Get Started
            </Button>
          </div>
        ))}
      </div>
      
      <p className="text-center text-gray-400 text-sm mt-12 font-sans">
        * Pricing subject to change based on local currency fluctuations for international users.
      </p>
    </Section>
  );
};

export default Pricing;