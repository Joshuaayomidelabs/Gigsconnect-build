import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { NAV_LINKS } from '../constants';
import Button from './Button';
import Logo from './Logo';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 pt-4 sm:pt-6 transition-all duration-500 pointer-events-none">
      <nav 
        className={`relative flex items-center justify-between w-full max-w-6xl px-4 py-3 sm:px-6 transition-all duration-500 rounded-full pointer-events-auto ${
          scrolled 
            ? 'bg-white/70 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-white/50' 
            : 'bg-transparent border border-transparent'
        }`}
      >
        <div className="flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity" onClick={() => window.scrollTo(0,0)}>
          <Logo variant="color" />
        </div>
        
        {/* Desktop Links - Figma Style Segmented Control */}
        <div className="hidden md:flex items-center p-1 space-x-1 bg-surface-100/50 backdrop-blur-md border border-surface-200/50 rounded-full">
          {NAV_LINKS.map((link) => (
            <a 
              key={link.name} 
              href={link.href} 
              className="text-surface-600 hover:text-surface-900 font-medium text-sm transition-all duration-300 hover:bg-white hover:shadow-sm px-5 py-2 rounded-full"
            >
              {link.name}
            </a>
          ))}
        </div>

        <div className="hidden md:flex items-center">
          <Button variant="primary" className="py-2.5 px-6 text-sm font-semibold shadow-brand-500/20">
            Download App
          </Button>
        </div>

        <div className="md:hidden flex items-center">
          <button 
            onClick={() => setIsOpen(!isOpen)} 
            className="text-surface-700 hover:text-surface-900 p-2 bg-surface-100/50 rounded-full backdrop-blur-md border border-surface-200/50 transition-colors"
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        <div 
          className={`absolute top-full left-0 right-0 mt-4 origin-top transition-all duration-300 ease-out ${
            isOpen ? 'opacity-100 scale-100 visible' : 'opacity-0 scale-95 invisible'
          }`}
        >
          <div className="bg-white/90 backdrop-blur-2xl border border-white/50 rounded-3xl shadow-[0_20px_40px_rgb(0,0,0,0.1)] p-3 flex flex-col space-y-1 mx-2">
            {NAV_LINKS.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="block px-4 py-3.5 text-base font-medium text-surface-700 hover:text-brand-600 hover:bg-brand-50/50 rounded-2xl transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </a>
            ))}
            <div className="pt-2 pb-1 px-2">
              <Button variant="primary" className="w-full justify-center py-3.5 rounded-2xl font-semibold">
                Download App
              </Button>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;