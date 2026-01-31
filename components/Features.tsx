import React from 'react';
import Section from './Section';
import { FEATURES } from '../constants';

const Features: React.FC = () => {
  return (
    <Section id="features">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-display">Why Artists Choose Us</h2>
        <p className="text-gray-600 text-lg font-sans">Built by musicians, for musicians. We understand the industry.</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {FEATURES.map((feature, index) => (
          <div key={index} className="group p-8 rounded-2xl bg-white border border-gray-100 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col items-start cursor-default relative overflow-hidden">
            {/* Hover decorative blob */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-brand-50 rounded-bl-[4rem] -mr-4 -mt-4 transition-all duration-500 group-hover:bg-brand-100 group-hover:scale-150"></div>
            
            <div className="w-12 h-12 bg-brand-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-brand-600 group-hover:text-white transition-all duration-300 relative z-10">
              <div className="group-hover:text-white transition-colors duration-300 [&>svg]:text-current">
                 {React.cloneElement(feature.icon as React.ReactElement, { className: "w-6 h-6 text-brand-600 group-hover:text-white" })}
              </div>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-brand-600 transition-colors duration-300 font-display relative z-10">{feature.title}</h3>
            <p className="text-gray-600 leading-relaxed font-sans relative z-10">{feature.description}</p>
          </div>
        ))}
      </div>
    </Section>
  );
};

export default Features;