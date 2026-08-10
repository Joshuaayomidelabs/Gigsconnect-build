import React from 'react';
import { PricingSection } from '../components/PricingSection';

const Pricing: React.FC = () => {
  return (
    <div className="min-h-screen bg-brand-gray dark:bg-brand-black pt-24 pb-20 px-6 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-black text-brand-black dark:text-brand-white tracking-tight mb-6">
            Simple, Transparent Pricing
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed font-medium">
            Choose the plan that best fits your creative journey. Upgrade anytime as your career grows.
          </p>
        </div>
        
        <PricingSection />
      </div>
    </div>
  );
};

export default Pricing;
