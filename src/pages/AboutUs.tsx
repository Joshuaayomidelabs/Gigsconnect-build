import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, Users, Globe, Briefcase, Heart, 
  Shield, Zap, Star, MessageCircle, FileImage, 
  MapPin, CheckCircle, Video, Music, Palette, PenTool,
  Code, Megaphone, Smartphone, Headphones, Camera, Mic,
  Scissors, Linkedin, Mail
} from 'lucide-react';

const VALUES = [
  { icon: Palette, title: 'Creativity', description: 'We believe in the power of original ideas and the unique expression of African talent.' },
  { icon: Users, title: 'Collaboration', description: 'Great things happen when diverse minds come together to solve problems and create art.' },
  { icon: Briefcase, title: 'Opportunity', description: 'We strive to provide equitable access to meaningful work and professional growth.' },
  { icon: Globe, title: 'Inclusivity', description: 'Our platform welcomes creators from all backgrounds, regions, and creative disciplines.' },
  { icon: Shield, title: 'Trust', description: 'We foster a safe, transparent environment where creators and clients can work with confidence.' },
  { icon: Zap, title: 'Innovation', description: 'We constantly evolve our tools and features to empower the modern digital creator.' },
];

const CATEGORIES = [
  { name: 'Musicians', icon: Music },
  { name: 'Photographers', icon: Camera },
  { name: 'Videographers', icon: Video },
  { name: 'Graphic Designers', icon: Palette },
  { name: 'UI/UX Designers', icon: Smartphone },
  { name: 'Developers', icon: Code },
  { name: 'Writers', icon: PenTool },
  { name: 'Content Creators', icon: Megaphone },
  { name: 'Podcasters', icon: Headphones },
  { name: 'Voice-over Artists', icon: Mic },
  { name: 'Fashion Designers', icon: Scissors },
];

const FEATURES = [
  { icon: MessageCircle, title: 'Community Feed', description: 'Share updates, seek advice, and connect with peers.' },
  { icon: Briefcase, title: 'Marketplace', description: 'Discover paid gigs and apply directly to clients.' },
  { icon: Star, title: 'Creator Profiles', description: 'Showcase your skills, experience, and professional identity.' },
  { icon: FileImage, title: 'Portfolio Showcase', description: 'Upload images and videos to highlight your best work.' },
];

const STATS = [
  { label: 'African Creators', value: '50k+', icon: Users },
  { label: 'Countries Represented', value: '45+', icon: MapPin },
  { label: 'Successful Collaborations', value: '100k+', icon: Briefcase },
];

const AboutUs: React.FC = () => {
  const accentColor = '#6C2BFF';
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    // Simple fade-in effect on mount
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-full bg-gray-50 flex flex-col font-sans min-h-screen">
      
      {/* Hero Section */}
      <div className="pt-32 pb-24 px-6 md:px-8 bg-white border-b border-gray-100 relative overflow-hidden flex-shrink-0">
        {/* Abstract Background Elements */}
        <div 
          className="absolute top-0 right-0 w-[800px] h-[800px] rounded-full blur-[120px] pointer-events-none -translate-y-1/2 translate-x-1/4 opacity-10"
          style={{ backgroundColor: accentColor }}
        ></div>
        <div 
          className="absolute bottom-0 left-0 w-[600px] h-[600px] rounded-full blur-[100px] pointer-events-none translate-y-1/3 -translate-x-1/4 opacity-10"
          style={{ backgroundColor: accentColor }}
        ></div>

        <div className={`max-w-4xl mx-auto text-center relative z-10 transition-all duration-1000 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="inline-flex items-center justify-center p-4 bg-gray-50 rounded-2xl mb-8 border border-gray-100 shadow-sm">
            <img src="/logo.svg" alt="GigsConnect Logo" className="h-10 w-auto" onError={(e) => {
                // Fallback if logo doesn't exist in public
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                target.parentElement!.innerHTML = '<div class="text-xl font-black text-[#4B0082]">GigsConnect</div>';
            }}/>
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-[#111827] tracking-tight mb-8">
            Empowering Africa's <span style={{ color: accentColor }}>Creators.</span>
          </h1>
          <p className="text-xl md:text-2xl font-medium text-gray-600 max-w-3xl mx-auto leading-relaxed mb-12">
            GigsConnect is Africa's creator marketplace where talented people discover opportunities, showcase their work, collaborate with others, and build sustainable creative careers.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              to="/signup"
              className="inline-flex items-center justify-center h-14 px-8 rounded-xl text-white font-bold transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 gap-2 w-full sm:w-auto"
              style={{ backgroundColor: accentColor }}
            >
              Join GigsConnect <ArrowRight className="w-5 h-5" />
            </Link>
            <Link 
              to="/browse"
              className="inline-flex items-center justify-center h-14 px-8 rounded-xl bg-white text-[#111827] font-bold border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all w-full sm:w-auto"
            >
              Explore Opportunities
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 w-full max-w-[1200px] mx-auto px-4 sm:px-6 md:px-8 py-20 space-y-32">
        
        {/* Our Story */}
        <div className="max-w-[850px] mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#111827] mb-4">Our Story</h2>
            <div className="w-16 h-1 rounded-full mx-auto" style={{ backgroundColor: accentColor }}></div>
          </div>
          <div className="prose prose-lg prose-gray max-w-none text-gray-600 leading-relaxed text-[1.1rem]">
            <p>
              GigsConnect was born out of a simple observation: Africa is teeming with incredible creative talent, but finding consistent opportunities and building a sustainable professional network remains a significant challenge for many.
            </p>
            <p>
              For years, African creators—from developers in Lagos and designers in Nairobi to musicians in Johannesburg—have faced hurdles like limited local visibility, fragmented networking platforms, and a lack of tools designed specifically for the African freelance economy. Opportunities were often scattered across different social media apps or relied heavily on manual, localized referrals.
            </p>
            <p>
              We built GigsConnect to bridge this gap. Our goal is to create a single, unified ecosystem where creators can easily showcase their portfolios, connect with global and local clients, and collaborate with their peers. By combining a professional marketplace with a supportive social community, we are building the digital home for Africa's creative economy.
            </p>
          </div>
        </div>

        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-8 max-w-[1000px] mx-auto">
          <div className="bg-white p-10 rounded-3xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] relative overflow-hidden group hover:border-[#6C2BFF]/30 transition-colors">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6" style={{ backgroundColor: `${accentColor}10`, color: accentColor }}>
              <Globe className="w-7 h-7" />
            </div>
            <h3 className="text-2xl font-bold text-[#111827] mb-4">Our Mission</h3>
            <p className="text-gray-600 text-lg leading-relaxed relative z-10">
              To connect African creators with opportunities, collaborations, and communities that help them grow professionally.
            </p>
            <div className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full opacity-[0.03] group-hover:scale-150 transition-transform duration-700 pointer-events-none" style={{ backgroundColor: accentColor }}></div>
          </div>
          <div className="bg-[#111827] p-10 rounded-3xl border border-gray-800 shadow-xl relative overflow-hidden group">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 bg-white/10 text-white">
              <Star className="w-7 h-7" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Our Vision</h3>
            <p className="text-gray-400 text-lg leading-relaxed relative z-10">
              To become Africa's leading digital home for creators, empowering millions of talented people through technology and opportunity.
            </p>
            <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full opacity-[0.1] group-hover:scale-150 transition-transform duration-700 pointer-events-none" style={{ backgroundColor: accentColor }}></div>
          </div>
        </div>

        {/* Why GigsConnect Comparison */}
        <div className="max-w-[1000px] mx-auto">
           <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-[#111827] mb-4">Why GigsConnect</h2>
            <div className="w-16 h-1 rounded-full mx-auto" style={{ backgroundColor: accentColor }}></div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-8 md:p-10 rounded-3xl border border-gray-100 shadow-sm">
              <h3 className="text-xl font-bold text-gray-500 mb-8 flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm">❌</span>
                Traditional Networking
              </h3>
              <ul className="space-y-5">
                {[
                  'Limited regional reach',
                  'Difficult portfolio discovery',
                  'Reliance on manual referrals',
                  'Scattered job opportunities',
                  'No integrated professional identity'
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-4 text-gray-500 font-medium">
                    <span className="mt-1 text-gray-300">—</span> {item}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="bg-white p-8 md:p-10 rounded-3xl border border-[#6C2BFF]/20 shadow-[0_8px_30px_rgba(108,43,255,0.08)] relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-[#6C2BFF]/5 rounded-bl-[100px] pointer-events-none"></div>
               <h3 className="text-xl font-bold text-[#111827] mb-8 flex items-center gap-3">
                <span className="w-8 h-8 rounded-full flex items-center justify-center text-white shadow-sm" style={{ backgroundColor: accentColor }}>✓</span>
                GigsConnect
              </h3>
              <ul className="space-y-5">
                {[
                  'Comprehensive Creator Profiles',
                  'Integrated Marketplace & Bidding',
                  'Supportive Social Community',
                  'Rich Portfolio Showcases',
                  'Trust & Verification Badges',
                  'Pan-African Professional Networking'
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-4 text-[#111827] font-semibold">
                    <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: accentColor }} /> {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Our Values */}
        <div>
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-[#111827] mb-4">Our Values</h2>
            <div className="w-16 h-1 rounded-full mx-auto" style={{ backgroundColor: accentColor }}></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {VALUES.map((val, idx) => (
              <div 
                key={idx} 
                className="bg-white p-8 rounded-3xl border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.02)] hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group"
              >
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-6 transition-colors"
                  style={{ backgroundColor: `${accentColor}10`, color: accentColor }}
                >
                  <val.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-[#111827] mb-3 group-hover:text-[#6C2BFF] transition-colors">{val.title}</h3>
                <p className="text-gray-500 leading-relaxed">{val.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Who We Serve */}
        <div>
           <div className="text-center mb-16 max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-[#111827] mb-4">Who We Serve</h2>
            <p className="text-gray-500 text-lg">A home for every type of creative professional across the continent.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            {CATEGORIES.map((cat, idx) => (
              <div 
                key={idx}
                className="inline-flex items-center gap-3 px-5 py-3 rounded-full bg-white border border-gray-200 text-[#111827] font-medium shadow-sm hover:border-[#6C2BFF] hover:text-[#6C2BFF] transition-colors cursor-default"
              >
                <cat.icon className="w-4 h-4 text-gray-400" />
                {cat.name}
              </div>
            ))}
            <div className="inline-flex items-center gap-3 px-5 py-3 rounded-full bg-gray-50 border border-gray-200 text-gray-500 font-medium shadow-sm cursor-default">
              + many more
            </div>
          </div>
        </div>

        {/* Leadership Section */}
        <div className="max-w-[1000px] mx-auto">
           <div className="text-center mb-16 max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-[#111827] mb-4">Meet the Team Behind GigsConnect</h2>
            <div className="w-16 h-1 rounded-full mx-auto mb-6" style={{ backgroundColor: accentColor }}></div>
            <p className="text-gray-500 text-lg leading-relaxed">
              Driven by a shared vision to empower Africa's creators through technology, opportunity, and collaboration.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Founder & CEO */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] overflow-hidden group hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
              <div className="h-2 w-full" style={{ backgroundColor: accentColor }}></div>
              <div className="p-8 md:p-10 text-center flex flex-col items-center h-full">
                <div className="w-32 h-32 mx-auto rounded-full bg-gray-100 border-4 border-white shadow-md mb-6 relative overflow-hidden flex items-center justify-center">
                  <img
                    src="/joshua-ayomide-ceo.png"
                    alt="Joshua Ayomide - Founder & Chief Executive Officer"
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
                <div className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-[#F3E8FF] text-[#4B0082] text-xs font-bold uppercase tracking-wider mb-4">
                  Founder
                </div>
                <h3 className="text-2xl font-bold text-[#111827] mb-1">Joshua Ayomide</h3>
                <p className="text-[#6C2BFF] font-semibold mb-6">Founder & Chief Executive Officer (CEO)</p>
                <p className="text-gray-500 leading-relaxed text-sm mb-8 text-left flex-grow">
                  Joshua Ayomide founded GigsConnect with the vision of creating Africa's leading digital platform where creators can showcase their talent, connect with opportunities, collaborate with others, and build sustainable creative careers. His mission is to remove barriers that prevent talented African creators from gaining visibility and accessing meaningful opportunities.
                </p>
                <div className="flex items-center justify-center gap-4 mt-auto">
                  <a href="#" className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:text-[#6C2BFF] hover:bg-[#6C2BFF]/10 transition-colors">
                    <Linkedin className="w-5 h-5" />
                  </a>
                  <a href="#" className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:text-[#6C2BFF] hover:bg-[#6C2BFF]/10 transition-colors">
                    <Mail className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </div>

            {/* Co-Founder */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] overflow-hidden group hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
              <div className="h-2 w-full" style={{ backgroundColor: accentColor }}></div>
              <div className="p-8 md:p-10 text-center flex flex-col items-center h-full">
                <div className="w-32 h-32 mx-auto rounded-full bg-gray-100 border-4 border-white shadow-md mb-6 relative overflow-hidden flex items-center justify-center">
                  <img
                    src="/daniel.png"
                    alt="Amoo Daniels - Co-Founder"
                    className="w-full h-full object-cover rounded-full"
                    onError={(e) => {
                      e.currentTarget.src = "/amoo-daniels.png";
                    }}
                  />
                </div>
                <div className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-[#F3E8FF] text-[#4B0082] text-xs font-bold uppercase tracking-wider mb-4">
                  Co-Founder
                </div>
                <h3 className="text-2xl font-bold text-[#111827] mb-1">Amoo Daniels</h3>
                <p className="text-[#6C2BFF] font-semibold mb-6">Co-Founder</p>
                <p className="text-gray-500 leading-relaxed text-sm mb-8 text-left flex-grow">
                  Amoo Daniels works alongside the founding team to help shape GigsConnect's growth, product direction, and community. He is committed to building an ecosystem that supports creators across Africa through innovation, collaboration, and technology.
                </p>
                <div className="flex items-center justify-center gap-4 mt-auto">
                  <a href="#" className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:text-[#6C2BFF] hover:bg-[#6C2BFF]/10 transition-colors">
                    <Linkedin className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Our Platform Features */}
        <div className="max-w-[1000px] mx-auto">
           <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-[#111827] mb-4">The Platform</h2>
            <div className="w-16 h-1 rounded-full mx-auto mb-6" style={{ backgroundColor: accentColor }}></div>
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            {FEATURES.map((feat, idx) => (
              <div key={idx} className="flex gap-5 bg-white p-6 rounded-2xl border border-gray-100 shadow-[0_4px_15px_rgb(0,0,0,0.02)]">
                 <div className="w-12 h-12 flex-shrink-0 rounded-xl bg-gray-50 flex items-center justify-center border border-gray-100">
                    <feat.icon className="w-6 h-6 text-[#111827]" />
                 </div>
                 <div>
                    <h4 className="text-lg font-bold text-[#111827] mb-2">{feat.title}</h4>
                    <p className="text-gray-500 text-sm leading-relaxed">{feat.description}</p>
                 </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Impact Stats */}
      <div className="bg-[#111827] py-20 px-6 mt-10">
        <div className="max-w-[1200px] mx-auto">
          <div className="grid md:grid-cols-3 gap-10 text-center divide-y md:divide-y-0 md:divide-x divide-gray-800">
            {STATS.map((stat, idx) => (
              <div key={idx} className="pt-8 md:pt-0 first:pt-0">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-white/5 text-white mb-6">
                  <stat.icon className="w-6 h-6" />
                </div>
                <div className="text-5xl font-black text-white mb-3" style={{ color: accentColor }}>{stat.value}</div>
                <div className="text-gray-400 font-medium text-lg uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gray-50 py-32 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-black text-[#111827] mb-8 tracking-tight">
            Ready to Grow Your <br className="hidden sm:block"/> Creative Career?
          </h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              to="/signup"
              className="inline-flex items-center justify-center h-14 px-10 rounded-xl text-white font-bold transition-all shadow-xl hover:shadow-2xl hover:-translate-y-0.5 gap-2 w-full sm:w-auto"
              style={{ backgroundColor: accentColor }}
            >
              Create Free Account <ArrowRight className="w-5 h-5" />
            </Link>
            <Link 
              to="/browse"
              className="inline-flex items-center justify-center h-14 px-10 rounded-xl bg-white text-[#111827] font-bold border border-gray-200 hover:border-gray-300 hover:bg-gray-100 transition-all w-full sm:w-auto shadow-sm"
            >
              Explore Community
            </Link>
          </div>
        </div>
      </div>

    </div>
  );
};

export default AboutUs;
