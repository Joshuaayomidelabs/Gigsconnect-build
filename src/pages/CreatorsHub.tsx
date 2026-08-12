import { SEO } from '../components/SEO';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Search, ArrowRight, Play, Briefcase, Star, TrendingUp, Users, Download, ShieldCheck, PenTool, CheckCircle, Monitor } from 'lucide-react';


const CATEGORIES = [
  { name: 'Profile Building', icon: Briefcase },
  { name: 'Finding Opportunities', icon: Search },
  { name: 'Portfolio Growth', icon: PenTool },
  { name: 'Professional Communication', icon: Users },
  { name: 'Platform Success', icon: TrendingUp },
];

const GUIDES = [
  {
    title: 'Building a Strong Creator Profile',
    description: 'Learn how to present your skills and experience to attract the right clients on GigsConnect.',
    category: 'Profile Building',
    readTime: '3 min read',
    icon: Star
  },
  {
    title: 'How to Discover Opportunities',
    description: 'Navigate the Browse Gigs section effectively to find projects that match your unique skill set.',
    category: 'Finding Opportunities',
    readTime: '4 min read',
    icon: Search
  },
  {
    title: 'Curating Your Portfolio',
    description: 'Showcase your best work clearly. A strong portfolio speaks louder than words.',
    category: 'Portfolio Growth',
    readTime: '5 min read',
    icon: Briefcase
  },
  {
    title: 'Applying for Gigs Successfully',
    description: 'Read requirements carefully and tailor your application to stand out to clients.',
    category: 'Finding Opportunities',
    readTime: '4 min read',
    icon: ShieldCheck
  },
  {
    title: 'Professional Client Communication',
    description: 'Best practices for messaging clients, setting expectations, and delivering quality work.',
    category: 'Professional Communication',
    readTime: '5 min read',
    icon: Users
  },
  {
    title: 'Growing Your Presence',
    description: 'Use your community interactions and successful gigs to build long-term relationships.',
    category: 'Platform Success',
    readTime: '4 min read',
    icon: TrendingUp
  }
];

const CreatorsHub: React.FC = () => {
  const accentColor = '#6C2BFF';
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && email.includes('@')) {
      setSubscribed(true);
    }
  };

  return (
    <div className="w-full bg-gray-50 flex flex-col font-sans min-h-screen">
      <SEO title="Creators Hub | Resources & Community for African Freelancers" canonical="https://gigsconnect.africa/creators-hub" />

      
      {/* Hero Section */}
      <div className="pt-32 pb-24 px-6 md:px-8 bg-white border-b border-gray-100 relative overflow-hidden flex-shrink-0">
        <div 
          className="absolute top-0 right-0 w-[800px] h-[800px] rounded-full blur-[120px] pointer-events-none -translate-y-1/2 translate-x-1/4 opacity-10"
          style={{ backgroundColor: accentColor }}
        ></div>
        <div 
          className="absolute bottom-0 left-0 w-[600px] h-[600px] rounded-full blur-[100px] pointer-events-none translate-y-1/3 -translate-x-1/4 opacity-10"
          style={{ backgroundColor: accentColor }}
        ></div>

        <div className={`max-w-4xl mx-auto text-center relative z-10 transition-all duration-1000 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="inline-flex items-center justify-center p-3 px-5 bg-[#4B0082]/5 rounded-full mb-8 border border-[#4B0082]/10">
            <span className="text-[#4B0082] font-bold text-sm tracking-wide uppercase flex items-center gap-2">
              <BookOpen className="w-4 h-4 fill-current" /> Education & Resources
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-[#111827] tracking-tight mb-8">
            Creators <span style={{ color: accentColor }}>Hub.</span>
          </h1>
          <p className="text-xl font-medium text-gray-600 max-w-2xl mx-auto leading-relaxed mb-10">
            Learn how to optimize your profile, showcase your portfolio, and find the right opportunities on GigsConnect.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1440px] mx-auto w-full px-6 md:px-8 py-16 space-y-24">
        
        {/* Creator Education Guides */}
        <div>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#111827] mb-4">Creator Education</h2>
            <div className="w-16 h-1 rounded-full mx-auto mb-6" style={{ backgroundColor: accentColor }}></div>
            <p className="text-gray-500 max-w-2xl mx-auto">
              Essential guides to help you navigate the platform and build a professional presence.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {GUIDES.map((guide, idx) => (
              <div key={idx} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.02)] hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col group">
                <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center text-[#111827] mb-6 group-hover:bg-[#6C2BFF]/10 group-hover:text-[#6C2BFF] transition-colors">
                  <guide.icon className="w-6 h-6" />
                </div>
                <div className="mb-4">
                  <span className="text-xs font-bold text-[#6C2BFF] uppercase tracking-wider bg-[#6C2BFF]/10 px-3 py-1 rounded-full mb-4 inline-block">
                    {guide.category}
                  </span>
                  <h3 className="text-xl font-bold text-[#111827] mb-3 leading-snug">
                    {guide.title}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed mb-6">
                    {guide.description}
                  </p>
                </div>
                <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between text-sm">
                  <span className="text-gray-400 font-medium">{guide.readTime}</span>
                  <span className="text-[#6C2BFF] font-semibold opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                    Read <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Coming Soon Section */}
        <div className="bg-white p-10 md:p-16 rounded-[2.5rem] border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center justify-center p-3 px-5 bg-gray-100 rounded-full mb-6">
            <span className="text-gray-600 font-bold text-sm tracking-wide uppercase">
              Coming Soon
            </span>
          </div>
          <h2 className="text-3xl font-bold text-[#111827] mb-4">More Tools & Resources</h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto leading-relaxed">
            We are working on adding downloadable templates, video tutorials, and deep-dive case studies designed to help creators discover opportunities and grow their careers on GigsConnect.
          </p>
        </div>

        {/* Newsletter & Community CTA */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          
          {/* Newsletter */}
          <div className="bg-white p-10 rounded-3xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col justify-center">
            <div className="w-12 h-12 rounded-xl bg-[#6C2BFF]/10 text-[#6C2BFF] flex items-center justify-center mb-6">
              <Star className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold text-[#111827] mb-3">Stay Updated</h3>
            <p className="text-gray-500 mb-8 leading-relaxed">
              Get notified when new learning resources and platform updates are available.
            </p>
            {subscribed ? (
              <div className="bg-gray-50 text-gray-600 p-4 rounded-xl font-medium border border-gray-200">
                Newsletter signup is coming soon.
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email" 
                  className="flex-1 h-12 px-4 rounded-xl border border-gray-200 focus:outline-none focus:border-[#6C2BFF] text-[#111827]"
                />
                <button 
                  type="submit"
                  className="h-12 px-6 rounded-xl text-white font-bold transition-all hover:opacity-90 whitespace-nowrap"
                  style={{ backgroundColor: accentColor }}
                >
                  Subscribe
                </button>
              </form>
            )}
          </div>

          {/* Community */}
          <div className="bg-[#111827] p-10 rounded-3xl border border-gray-800 shadow-xl relative overflow-hidden group flex flex-col justify-center">
            <div 
              className="absolute top-0 right-0 w-64 h-64 rounded-full blur-[80px] pointer-events-none -translate-y-1/2 translate-x-1/3 opacity-30 group-hover:opacity-50 transition-opacity duration-500"
              style={{ backgroundColor: accentColor }}
            ></div>
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-xl bg-white/10 text-white flex items-center justify-center mb-6">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Learn Together.</h3>
              <p className="text-gray-400 mb-8 leading-relaxed">
                Connect with other creators in our community, share experiences, and find potential collaborators.
              </p>
              <div className="flex gap-3"> 
                <Link 
                  to="/overview"
                  className="h-12 px-6 rounded-xl bg-white text-[#111827] font-bold flex items-center justify-center hover:bg-gray-100 transition-colors flex-1 text-center"
                >
                  Join Community
                </Link>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default CreatorsHub;
