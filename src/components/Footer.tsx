import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-brand-black py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative glow */}
      <div className="absolute bottom-0 right-0 translate-y-1/2 translate-x-1/4 w-[400px] h-[400px] bg-brand-purple/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 relative z-10">
        <div className="col-span-1 md:col-span-2">
          <Link to="/" className="text-3xl font-black text-white tracking-tighter">
            Gigs<span className="text-brand-purple">Connect</span>
          </Link>
          <p className="mt-6 text-brand-gray-dark max-w-sm text-lg leading-relaxed">
            Connecting Africa's finest musical talents with the best opportunities. Empowering creators to build sustainable careers.
          </p>
        </div>
        <div>
          <h4 className="font-bold text-white mb-6 text-lg">Platform</h4>
          <ul className="space-y-4 text-brand-gray-dark">
            <li><Link to="/browse" className="hover:text-brand-purple transition-colors">Browse Gigs</Link></li>
            <li><Link to="/post" className="hover:text-brand-purple transition-colors">Post a Gig</Link></li>
            <li><Link to="/signup" className="hover:text-brand-purple transition-colors">Join as Talent</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-white mb-6 text-lg">Support</h4>
          <ul className="space-y-4 text-brand-gray-dark">
            <li><Link to="#" className="hover:text-brand-purple transition-colors">Help Center</Link></li>
            <li><Link to="#" className="hover:text-brand-purple transition-colors">Terms of Service</Link></li>
            <li><Link to="#" className="hover:text-brand-purple transition-colors">Privacy Policy</Link></li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 relative z-10">
        <div className="text-brand-gray-dark text-sm">
          © {new Date().getFullYear()} GigsConnect. All rights reserved.
        </div>
        <div className="flex gap-6 text-brand-gray-dark text-sm">
          <Link to="#" className="hover:text-white transition-colors">Twitter</Link>
          <Link to="#" className="hover:text-white transition-colors">Instagram</Link>
          <Link to="#" className="hover:text-white transition-colors">LinkedIn</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
