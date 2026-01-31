import React from 'react';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Play, Apple } from 'lucide-react';
import Logo from './Logo';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          
          <div className="col-span-1 md:col-span-2">
            <div className="mb-6">
              <Logo variant="white" />
            </div>
            <p className="text-gray-400 mb-6 max-w-md leading-relaxed">
              The premier Pan-African music marketplace connecting musicians, vocalists, and bands to paid gigs and verified opportunities across the continent.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-brand-400 hover:-translate-y-1 transition-all duration-200"><Facebook className="w-5 h-5" /></a>
              <a href="#" className="text-gray-400 hover:text-brand-400 hover:-translate-y-1 transition-all duration-200"><Twitter className="w-5 h-5" /></a>
              <a href="#" className="text-gray-400 hover:text-brand-400 hover:-translate-y-1 transition-all duration-200"><Instagram className="w-5 h-5" /></a>
              <a href="#" className="text-gray-400 hover:text-brand-400 hover:-translate-y-1 transition-all duration-200"><Linkedin className="w-5 h-5" /></a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li><a href="#about" className="text-gray-400 hover:text-brand-400 transition-all duration-200 hover:translate-x-1 inline-block">About Us</a></li>
              <li><a href="#how-it-works" className="text-gray-400 hover:text-brand-400 transition-all duration-200 hover:translate-x-1 inline-block">How It Works</a></li>
              <li><a href="#pricing" className="text-gray-400 hover:text-brand-400 transition-all duration-200 hover:translate-x-1 inline-block">Pricing</a></li>
              <li><a href="#" className="text-gray-400 hover:text-brand-400 transition-all duration-200 hover:translate-x-1 inline-block">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-400 hover:text-brand-400 transition-all duration-200 hover:translate-x-1 inline-block">Terms of Service</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-center text-gray-400">
                <Mail className="w-4 h-4 mr-2" />
                support@gigsconnect.com
              </li>
            </ul>
            <div className="mt-6 flex flex-col gap-3">
               <button className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-brand-900/20 group">
                  <Play className="w-5 h-5 mr-2 fill-current text-gray-300 group-hover:text-white transition-colors" />
                  <div className="text-left leading-none">
                    <span className="text-[10px] block text-gray-400 group-hover:text-gray-200">GET IT ON</span>
                    <span className="text-sm font-bold">Google Play</span>
                  </div>
               </button>
               <button className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-brand-900/20 group">
                  <Apple className="w-5 h-5 mr-2 text-gray-300 group-hover:text-white transition-colors" />
                  <div className="text-left leading-none">
                    <span className="text-[10px] block text-gray-400 group-hover:text-gray-200">Download on the</span>
                    <span className="text-sm font-bold">App Store</span>
                  </div>
               </button>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 text-center md:text-left flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} GigsConnect. All rights reserved.</p>
          <p className="mt-2 md:mt-0">Made with ❤️ for African Music</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;