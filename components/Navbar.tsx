import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { NAV_LINKS } from '../constants';
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
    <div className="absolute top-0 left-0 right-0 z-50 flex justify-center px-4 pt-4 sm:pt-6 transition-all duration-500 pointer-events-none">
      <nav 
        className={`relative flex items-center justify-between w-full max-w-[1200px] px-6 py-4 bg-white rounded-full transition-shadow duration-300 pointer-events-auto ${
          scrolled ? 'shadow-md' : 'shadow-sm'
        }`}
      >
        <div className="flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity flex items-center gap-2" onClick={() => window.scrollTo(0,0)}>
          <Logo variant="color" />
          <span className="font-bold text-2xl tracking-tighter text-linktree-dark hidden sm:block">GigsConnect</span>
        </div>
        
        {/* Desktop Links */}
        <div className="hidden lg:flex items-center space-x-1 ml-8">
          {NAV_LINKS.map((link) => (
            <a 
              key={link.name} 
              href={link.href} 
              className="text-linktree-dark/70 hover:text-linktree-dark hover:bg-linktree-gray px-4 py-2 rounded-lg font-semibold text-base transition-colors"
            >
              {link.name}
            </a>
          ))}
        </div>

        <div className="hidden lg:flex items-center gap-3 ml-auto">
          <Link to="/login" className="py-3 px-6 text-base font-semibold text-linktree-dark bg-linktree-gray hover:bg-gray-200 rounded-lg transition-colors">
            Log in
          </Link>
          <Link to="/signup" className="py-3 px-6 text-base font-semibold text-linktree-dark bg-linktree-lime hover:bg-[#b5e853] rounded-full transition-colors">
            Sign up free
          </Link>
        </div>

        <div className="lg:hidden flex items-center ml-auto">
          <button 
            onClick={() => setIsOpen(!isOpen)} 
            className="text-linktree-dark hover:text-black p-2 bg-linktree-gray rounded-full transition-colors"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile menu overlay */}
        <div 
          className={`fixed inset-0 z-40 bg-black/20 backdrop-blur-sm transition-opacity lg:hidden pointer-events-auto ${
            isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
          }`}
          onClick={() => setIsOpen(false)}
        />

        {/* Mobile menu panel */}
        <div 
          className={`fixed top-4 left-4 right-4 z-50 bg-white rounded-[2rem] shadow-xl p-4 transition-all duration-300 ease-out lg:hidden origin-top pointer-events-auto ${
            isOpen ? 'opacity-100 scale-100 visible' : 'opacity-0 scale-95 invisible'
          }`}
        >
          <div className="flex items-center justify-between mb-4 px-2">
            <div className="flex items-center gap-2">
              <Logo variant="color" />
              <span className="font-bold text-xl tracking-tighter text-linktree-dark">GigsConnect</span>
            </div>
            <button 
              onClick={() => setIsOpen(false)} 
              className="text-linktree-dark hover:text-black p-2 bg-linktree-gray rounded-full transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          <div className="flex flex-col space-y-2">
            {NAV_LINKS.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="block px-6 py-4 text-lg font-semibold text-linktree-dark hover:bg-linktree-gray rounded-2xl transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </a>
            ))}
            <div className="pt-4 pb-2 px-2 flex flex-col gap-3">
              <Link to="/login" className="w-full flex justify-center py-4 rounded-xl font-semibold text-lg text-linktree-dark bg-linktree-gray hover:bg-gray-200 transition-colors">
                Log in
              </Link>
              <Link to="/signup" className="w-full flex justify-center py-4 rounded-full font-semibold text-lg text-linktree-dark bg-linktree-lime hover:bg-[#b5e853] transition-colors">
                Sign up free
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;