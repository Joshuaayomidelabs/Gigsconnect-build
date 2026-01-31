import React from 'react';
import Section from './Section';
import { Download, UserPlus, BadgeCheck, Banknote } from 'lucide-react';

const steps = [
  {
    icon: <Download className="w-8 h-8 text-white" />,
    title: 'Download App',
    description: 'Get the GigsConnect app from the App Store or Google Play Store.',
  },
  {
    icon: <UserPlus className="w-8 h-8 text-white" />,
    title: 'Create Profile',
    description: 'Upload your best photos, demo tracks, and list your instruments.',
  },
  {
    icon: <BadgeCheck className="w-8 h-8 text-white" />,
    title: 'Get Verified',
    description: 'Complete our verification process to earn the trusted badge.',
  },
  {
    icon: <Banknote className="w-8 h-8 text-white" />,
    title: 'Book & Earn',
    description: 'Apply for gigs, perform, and receive secure payment instantly.',
  },
];

const HowItWorks: React.FC = () => {
  return (
    <Section id="how-it-works" dark>
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-display">How It Works</h2>
        <p className="text-gray-600 text-lg font-sans">Start your journey to consistent bookings in four simple steps.</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        {steps.map((step, index) => (
          <div key={index} className="relative flex flex-col items-center text-center group hover:-translate-y-2 transition-transform duration-300">
            <div className="w-16 h-16 bg-brand-600 rounded-2xl flex items-center justify-center shadow-lg shadow-brand-500/20 mb-6 group-hover:scale-110 group-hover:bg-gray-900 group-hover:shadow-xl transition-all duration-300 relative z-10">
              {step.icon}
            </div>
            
            {/* Connector Line (Desktop Only) */}
            {index < steps.length - 1 && (
              <div className="hidden lg:block absolute top-8 left-1/2 w-full h-0.5 bg-gray-200 -z-0 transform translate-x-8"></div>
            )}
            
            <h3 className="text-xl font-bold text-gray-900 mb-2 font-display">{step.title}</h3>
            <p className="text-gray-600 leading-relaxed font-sans">{step.description}</p>
          </div>
        ))}
      </div>
    </Section>
  );
};

export default HowItWorks;