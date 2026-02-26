import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import HowItWorks from './components/HowItWorks';
import Features from './components/Features';
import ArtistSpotlight from './components/ArtistSpotlight';
import Pricing from './components/Pricing';
import FAQ from './components/FAQ';
import Footer from './components/Footer';
import SignupModal from './components/SignupModal';

const App: React.FC = () => {
  const [isSignupOpen, setIsSignupOpen] = useState(false);

  useEffect(() => {
    const handleOpenSignup = () => setIsSignupOpen(true);
    window.addEventListener('open-signup', handleOpenSignup);
    return () => window.removeEventListener('open-signup', handleOpenSignup);
  }, []);

  return (
    <div className="min-h-screen font-sans selection:bg-linktree-lime selection:text-linktree-green">
      <Navbar />
      <main>
        <Hero />
        <About />
        <HowItWorks />
        <Features />
        <ArtistSpotlight />
        <Pricing />
        <FAQ />
      </main>
      <Footer />
      <SignupModal isOpen={isSignupOpen} onClose={() => setIsSignupOpen(false)} />
    </div>
  );
};

export default App;