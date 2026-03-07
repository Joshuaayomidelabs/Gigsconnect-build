import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="col-span-1 md:col-span-2">
          <Link to="/" className="text-2xl font-black text-gray-900 tracking-tighter">GigsConnect</Link>
          <p className="mt-4 text-gray-500 max-w-xs">
            Connecting Africa's finest musical talents with the best opportunities.
          </p>
        </div>
        <div>
          <h4 className="font-bold text-gray-900 mb-4">Platform</h4>
          <ul className="space-y-2 text-sm text-gray-600">
            <li><Link to="/browse" className="hover:text-brand-600 transition-colors">Browse Gigs</Link></li>
            <li><Link to="/post" className="hover:text-brand-600 transition-colors">Post a Gig</Link></li>
            <li><Link to="/signup" className="hover:text-brand-600 transition-colors">Join as Talent</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-gray-900 mb-4">Support</h4>
          <ul className="space-y-2 text-sm text-gray-600">
            <li><Link to="#" className="hover:text-brand-600 transition-colors">Help Center</Link></li>
            <li><Link to="#" className="hover:text-brand-600 transition-colors">Terms of Service</Link></li>
            <li><Link to="#" className="hover:text-brand-600 transition-colors">Privacy Policy</Link></li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-gray-50 text-center text-xs text-gray-400">
        © {new Date().getFullYear()} GigsConnect. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
