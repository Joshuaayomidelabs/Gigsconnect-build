import React from 'react';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Play, Apple } from 'lucide-react';
import Logo from './Logo';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white text-linktree-dark pt-24 pb-12 border-t border-gray-100">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-12 mb-16">
          
          <div className="col-span-1 md:col-span-2">
            <div className="mb-6 flex items-center gap-2">
              <Logo variant="color" />
              <span className="font-bold text-2xl tracking-tighter text-linktree-dark">GigsConnect</span>
            </div>
            <p className="text-linktree-dark/80 mb-8 max-w-md leading-relaxed font-medium text-lg">
              The premier Pan-African music marketplace connecting musicians, vocalists, and bands to paid gigs and verified opportunities across the continent.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="p-3 bg-linktree-gray rounded-full text-linktree-dark hover:bg-gray-200 transition-colors"><Facebook className="w-5 h-5" /></a>
              <a href="#" className="p-3 bg-linktree-gray rounded-full text-linktree-dark hover:bg-gray-200 transition-colors"><Twitter className="w-5 h-5" /></a>
              <a href="#" className="p-3 bg-linktree-gray rounded-full text-linktree-dark hover:bg-gray-200 transition-colors"><Instagram className="w-5 h-5" /></a>
              <a href="#" className="p-3 bg-linktree-gray rounded-full text-linktree-dark hover:bg-gray-200 transition-colors"><Linkedin className="w-5 h-5" /></a>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-6 tracking-tight">Company</h3>
            <ul className="space-y-4">
              <li><a href="#about" className="text-linktree-dark/80 hover:text-linktree-dark hover:underline font-medium transition-colors">About Us</a></li>
              <li><a href="#how-it-works" className="text-linktree-dark/80 hover:text-linktree-dark hover:underline font-medium transition-colors">How It Works</a></li>
              <li><a href="#pricing" className="text-linktree-dark/80 hover:text-linktree-dark hover:underline font-medium transition-colors">Pricing</a></li>
              <li><a href="#" className="text-linktree-dark/80 hover:text-linktree-dark hover:underline font-medium transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-linktree-dark/80 hover:text-linktree-dark hover:underline font-medium transition-colors">Terms of Service</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-6 tracking-tight">Get the App</h3>
            <div className="flex flex-col gap-4">
               <button className="bg-linktree-dark text-white px-6 py-3 rounded-xl flex items-center transition-transform hover:scale-105 group w-full max-w-[200px]">
                  <Play className="w-6 h-6 mr-3 fill-current" />
                  <div className="text-left leading-none">
                    <span className="text-[10px] block text-white/80 uppercase tracking-wider mb-1">Get it on</span>
                    <span className="text-base font-bold">Google Play</span>
                  </div>
               </button>
               <button className="bg-linktree-dark text-white px-6 py-3 rounded-xl flex items-center transition-transform hover:scale-105 group w-full max-w-[200px]">
                  <Apple className="w-6 h-6 mr-3 fill-current" />
                  <div className="text-left leading-none">
                    <span className="text-[10px] block text-white/80 uppercase tracking-wider mb-1">Download on the</span>
                    <span className="text-base font-bold">App Store</span>
                  </div>
               </button>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-linktree-dark/60 font-medium">
          <p>&copy; {new Date().getFullYear()} GigsConnect. All rights reserved.</p>
          <p className="mt-4 md:mt-0">Made with ❤️ for African Music</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;