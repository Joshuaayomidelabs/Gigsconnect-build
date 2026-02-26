import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import HowItWorks from './components/HowItWorks';
import Features from './components/Features';
import ArtistSpotlight from './components/ArtistSpotlight';
import Pricing from './components/Pricing';
import FAQ from './components/FAQ';
import Footer from './components/Footer';
import SignUp from './pages/SignUp';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

const LandingPage = () => (
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
  </div>
);

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  );
};

export default App;