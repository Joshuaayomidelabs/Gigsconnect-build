const fs = require('fs');

const code = `import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, ArrowRight, CheckCircle2 } from 'lucide-react';
import Logo from './Logo';

const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  return (
    <footer className="bg-[#111827] text-white pt-20 pb-8 px-6 md:px-8 lg:px-12 relative overflow-hidden">
      {/* Decorative glow */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#4B0082]/10 rounded-full blur-[120px] pointer-events-none -translate-y-1/2"></div>
      
      <div className="max-w-[1440px] mx-auto relative z-10">
        
        {/* Top 5 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8 mb-16">
          
          {/* Column 1: Brand */}
          <div className="lg:col-span-1 flex flex-col">
            <Link to="/" className="flex items-center gap-2 mb-6 group">
              <Logo iconClassName="w-8 h-8" />
              <span className="text-xl font-black tracking-tight text-white group-hover:text-[#4B0082] transition-colors">
                GigsConnect
              </span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-8">
              Africa's leading creator ecosystem. Showcase your portfolio, discover opportunities, collaborate with brands, and grow your creative career across Africa.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" aria-label="Twitter" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-[#4B0082] hover:text-white transition-all duration-300">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" aria-label="Instagram" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-[#4B0082] hover:text-white transition-all duration-300">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" aria-label="LinkedIn" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-[#4B0082] hover:text-white transition-all duration-300">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href="#" aria-label="Facebook" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-[#4B0082] hover:text-white transition-all duration-300">
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Platform */}
          <div>
            <h4 className="text-white font-bold mb-6">Platform</h4>
            <ul className="space-y-4">
              <li><Link to="/browse" className="text-gray-400 hover:text-[#4B0082] text-sm font-medium transition-colors">Browse Gigs</Link></li>
              <li><Link to="/post" className="text-gray-400 hover:text-[#4B0082] text-sm font-medium transition-colors">Post a Gig</Link></li>
              <li><Link to="/signup" className="text-gray-400 hover:text-[#4B0082] text-sm font-medium transition-colors">Join Free</Link></li>
              <li><Link to="/pricing" className="text-gray-400 hover:text-[#4B0082] text-sm font-medium transition-colors">Pricing</Link></li>
            </ul>
          </div>

          {/* Column 3: Support */}
          <div>
            <h4 className="text-white font-bold mb-6">Support</h4>
            <ul className="space-y-4">
              <li><Link to="/help-center" className="text-gray-400 hover:text-[#4B0082] text-sm font-medium transition-colors">Help Center</Link></li>
              <li><Link to="/safety-center" className="text-gray-400 hover:text-[#4B0082] text-sm font-medium transition-colors">Safety Center</Link></li>
              <li><Link to="/faqs" className="text-gray-400 hover:text-[#4B0082] text-sm font-medium transition-colors">FAQs</Link></li>
              <li><a href="mailto:support@gigsconnect.africa" className="text-gray-400 hover:text-[#4B0082] text-sm font-medium transition-colors">Contact Support</a></li>
            </ul>
          </div>

          {/* Column 4: Legal */}
          <div>
            <h4 className="text-white font-bold mb-6">Legal</h4>
            <ul className="space-y-4">
              <li><Link to="/terms-and-conditions" className="text-gray-400 hover:text-[#4B0082] text-sm font-medium transition-colors">Terms & Conditions</Link></li>
              <li><Link to="/privacy-policy" className="text-gray-400 hover:text-[#4B0082] text-sm font-medium transition-colors">Privacy Policy</Link></li>
              <li><Link to="/community-guidelines" className="text-gray-400 hover:text-[#4B0082] text-sm font-medium transition-colors">Community Guidelines</Link></li>
              <li><Link to="/cookie-policy" className="text-gray-400 hover:text-[#4B0082] text-sm font-medium transition-colors">Cookie Policy</Link></li>
            </ul>
          </div>

          {/* Column 5: Newsletter */}
          <div className="lg:col-span-1">
            <h4 className="text-white font-bold mb-4">Stay Updated</h4>
            <p className="text-gray-400 text-sm mb-6 leading-relaxed">
              Get creator tips, platform updates, and new opportunities delivered to your inbox.
            </p>
            {subscribed ? (
              <div className="flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                <p className="text-emerald-400 text-sm font-medium">Thanks for subscribing!</p>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row lg:flex-col xl:flex-row gap-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full bg-white/5 border border-gray-800 rounded-xl px-4 h-12 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#4B0082] focus:ring-1 focus:ring-[#4B0082] transition-all"
                />
                <button
                  type="submit"
                  className="h-12 px-6 rounded-xl bg-[#4B0082] hover:bg-[#3a0066] text-white font-semibold flex items-center justify-center transition-colors shrink-0"
                >
                  Subscribe
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <p className="text-gray-500 text-sm">
              &copy; {new Date().getFullYear()} GigsConnect Africa. All rights reserved.
            </p>
            <span className="hidden sm:inline text-gray-700">&bull;</span>
            <span className="hidden sm:inline text-gray-500 text-sm">Version 1.0</span>
          </div>
          <div className="flex flex-wrap justify-center gap-6 md:gap-8">
            <Link to="/privacy-policy" className="text-gray-500 hover:text-[#4B0082] text-sm font-medium transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms-and-conditions" className="text-gray-500 hover:text-[#4B0082] text-sm font-medium transition-colors">
              Terms & Conditions
            </Link>
            <Link to="/community-guidelines" className="text-gray-500 hover:text-[#4B0082] text-sm font-medium transition-colors">
              Community Guidelines
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
`;

fs.writeFileSync('src/components/Footer.tsx', code);
console.log('Footer updated');
