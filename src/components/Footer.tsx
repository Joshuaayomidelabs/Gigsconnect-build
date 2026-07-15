import React from 'react';
import { Link } from 'react-router-dom';
import { Share2, Heart, ArrowRight } from 'lucide-react';

import Logo from './Logo';

const Footer: React.FC = () => {
  return (
    <footer className="bg-brand-black py-16 lg:py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden text-white">
      {/* Decorative glow */}
      <div className="absolute bottom-0 right-0 translate-y-1/2 translate-x-1/4 w-[400px] h-[400px] bg-brand-purple/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16 mb-16 lg:mb-20">
          <div>
            <Link to="/" className="text-2xl font-black tracking-tighter mb-8 flex items-center gap-2 text-white">
              <Logo iconClassName="w-10 h-10" />
              GigsConnect
            </Link>
            <p className="text-gray-400 leading-relaxed mb-8">
              Africa's leading creator ecosystem. Showcase your portfolio, discover opportunities, and build your creative career.
            </p>
            <div className="flex gap-4">
              <button className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-brand-purple transition-all"><Share2 className="w-5 h-5" /></button>
              <button className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-brand-purple transition-all"><Heart className="w-5 h-5" /></button>
            </div>
          </div>

          <div>
            <h4 className="font-black uppercase tracking-widest text-xs mb-8 text-brand-purple">Platform</h4>
            <ul className="space-y-4">
              <li><Link to="/browse" className="text-gray-400 hover:text-white transition-colors">Browse Gigs</Link></li>
              <li><Link to="/post" className="text-gray-400 hover:text-white transition-colors">Post a Gig</Link></li>
              <li><Link to="/signup" className="text-gray-400 hover:text-white transition-colors">Join Free</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-black uppercase tracking-widest text-xs mb-8 text-brand-purple">Support</h4>
            <ul className="space-y-4">
              <li><a href="mailto:support@gigsconnect.africa" className="text-gray-400 hover:text-white transition-colors">support@gigsconnect.africa</a></li>
              <li><Link to="#" className="text-gray-400 hover:text-white transition-colors">Help Center</Link></li>
              <li><Link to="#" className="text-gray-400 hover:text-white transition-colors">Safety Tips</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-black uppercase tracking-widest text-xs mb-8 text-brand-purple">Newsletter</h4>
            <p className="text-sm text-gray-400 mb-6">Get the latest gigs and news delivered to your inbox.</p>
            <div className="flex gap-2">
              <input type="email" placeholder="Email address" className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-brand-purple w-full text-white" />
              <button className="p-2 rounded-xl bg-brand-purple hover:bg-brand-purple-dark transition-all"><ArrowRight className="w-5 h-5" /></button>
            </div>
          </div>
        </div>

        <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-gray-500 text-sm font-medium">
            © {new Date().getFullYear()} GigsConnect. All rights reserved.
          </p>
          <div className="flex gap-8">
            <Link to="#" className="text-gray-500 hover:text-white text-sm">Privacy Policy</Link>
            <Link to="#" className="text-gray-500 hover:text-white text-sm">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
