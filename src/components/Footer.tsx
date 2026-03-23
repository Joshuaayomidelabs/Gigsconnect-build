import React from 'react';
import { Link } from 'react-router-dom';

import Logo from './Logo';

const Footer: React.FC = () => {
  return (
    <footer className="bg-brand-black py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative glow */}
      <div className="absolute bottom-0 right-0 translate-y-1/2 translate-x-1/4 w-[400px] h-[400px] bg-brand-purple/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 relative z-10">
        <div className="col-span-1 md:col-span-2">
          <Link to="/" className="flex items-center gap-2 text-3xl font-black text-brand-white tracking-tighter">
            <Logo iconClassName="w-10 h-10" />
            Gigs<span className="text-brand-purple">Connect</span>
          </Link>
          <p className="mt-6 text-gray-400 max-w-sm text-lg leading-relaxed">
            Connecting Africa's finest musical talents with the best opportunities. 100% free for everyone.
          </p>
          <div className="mt-8">
            <h4 className="font-bold text-brand-white mb-2 text-sm uppercase tracking-wider">Support</h4>
            <a href="mailto:support@gigsconnect.africa" className="text-brand-purple font-bold hover:underline">
              support@gigsconnect.africa
            </a>
          </div>
        </div>
        <div>
          <h4 className="font-bold text-brand-white mb-6 text-lg">Platform</h4>
          <ul className="space-y-4 text-gray-400">
            <li><Link to="/browse" className="hover:text-brand-purple transition-colors">Browse Gigs</Link></li>
            <li><Link to="/post" className="hover:text-brand-purple transition-colors">Post a Gig</Link></li>
            <li><Link to="/signup" className="hover:text-brand-purple transition-colors">Join Free</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-brand-white mb-6 text-lg">Legal</h4>
          <ul className="space-y-4 text-gray-400">
            <li><Link to="#" className="hover:text-brand-purple transition-colors">About</Link></li>
            <li><Link to="#" className="hover:text-brand-purple transition-colors">Terms of Service</Link></li>
            <li><Link to="#" className="hover:text-brand-purple transition-colors">Privacy Policy</Link></li>
            <li><Link to="#" className="hover:text-brand-purple transition-colors">Contact</Link></li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-brand-white/5 flex flex-col md:flex-row justify-between items-center gap-4 relative z-10">
        <div className="text-gray-500 text-sm">
          © 2026 GigsConnect. All rights reserved.
        </div>
        <div className="flex gap-6 text-gray-500 text-sm">
          <Link to="#" className="hover:text-brand-white transition-colors">Twitter</Link>
          <Link to="#" className="hover:text-brand-white transition-colors">Instagram</Link>
          <Link to="#" className="hover:text-white transition-colors">LinkedIn</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
