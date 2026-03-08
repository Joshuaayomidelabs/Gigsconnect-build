import React from 'react';
import Hero from '../components/Hero';
import Features from '../components/Features';
import HowItWorks from '../components/HowItWorks';
import Pricing from '../components/Pricing';
import ArtistSpotlight from '../components/ArtistSpotlight';
import FAQ from '../components/FAQ';
import About from '../components/About';

const Landing: React.FC = () => {
  return (
    <div className="bg-white">
      <Hero />
      <Features />
      <HowItWorks />
      <ArtistSpotlight />
      <About />
      <Pricing />
      <FAQ />
    </div>
  );
};

export default Landing;
