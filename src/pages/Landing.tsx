import React from 'react';
import Hero from '../components/Hero';
import About from '../components/About';
import HowItWorks from '../components/HowItWorks';
import Features from '../components/Features';
import ArtistSpotlight from '../components/ArtistSpotlight';
import Pricing from '../components/Pricing';
import FAQ from '../components/FAQ';

const Landing: React.FC = () => {
  return (
    <div className="min-h-screen font-sans selection:bg-brand-purple-soft selection:text-brand-purple">
      <main>
        <Hero />
        <About />
        <HowItWorks />
        <Features />
        <ArtistSpotlight />
        <Pricing />
        <FAQ />
      </main>
    </div>
  );
};

export default Landing;
