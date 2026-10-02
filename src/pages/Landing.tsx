import { SEO } from '../components/SEO';
import { Helmet } from 'react-helmet-async';
import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useLocation } from 'react-router-dom';
import { PricingSection } from '../components/PricingSection';
import { useAuth } from '../context/AuthContext';
import { 
  CheckCircle, 
  ArrowRight, 
  Briefcase,
  Search, 
  Heart, 
  Quote, 
  ChevronLeft, 
  ChevronRight,
  Bell,
  User,
  MessageSquare
} from 'lucide-react';

const Landing: React.FC = () => {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "GigsConnect",
    "url": "https://gigsconnect.africa",
    "logo": "https://gigsconnect.africa/assets/branding/logo.svg",
    "description": "GigsConnect is where African creators collaborate, get hired and earn. Join 5,000+ creators sharing their work and finding gigs."
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "GigsConnect",
    "url": "https://gigsconnect.africa"
  };

  const { user } = useAuth();
  const location = useLocation();
  const [howItWorksTab, setHowItWorksTab] = useState<'creators' | 'clients'>('creators');

  React.useEffect(() => {
    if (location.hash === '#pricing-section') {
      setTimeout(() => {
        const el = document.getElementById('pricing-section');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [location]);

  const carouselRef = useRef<HTMLDivElement>(null);

  const scrollCarousel = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = window.innerWidth > 768 ? 400 : 300;
      carouselRef.current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    }
  };

  const creatorsSteps = [
    {
      step: 1,
      title: "Create your profile",
      desc: "Set up your bio, showcase your craft, and list your specialized creative skills.",
      img: "/assets/illustrations/landing/profile.svg"
    },
    {
      step: 2,
      title: "Share your work",
      desc: "Post visual updates, audio, and creative projects to the community feed.",
      img: "/assets/illustrations/creators/content-creator.svg"
    },
    {
      step: 3,
      title: "Find and apply for gigs",
      desc: "Discover opportunities matching your craft and submit direct applications.",
      img: "/assets/illustrations/creators/freelancer.svg"
    },
    {
      step: 4,
      title: "Collaborate and grow",
      desc: "Connect with clients, collaborate with fellow talent, and grow your career.",
      img: "/assets/illustrations/landing/teamwork.svg"
    }
  ];

  const clientsSteps = [
    {
      step: 1,
      title: "Post a project",
      desc: "Describe your project scope, creative requirements, timeline, and budget.",
      img: "/assets/illustrations/creators/freelancer.svg"
    },
    {
      step: 2,
      title: "Browse creators",
      desc: "Explore African creator profiles, review portfolios, and filter by skill.",
      img: "/assets/illustrations/creators/photographer.svg"
    },
    {
      step: 3,
      title: "Collaborate",
      desc: "Connect directly with creators, align on creative vision, and coordinate deliverables.",
      img: "/assets/illustrations/landing/chat.svg"
    },
    {
      step: 4,
      title: "Complete and review",
      desc: "Receive completed deliverables and build long-term creative relationships.",
      img: "/assets/illustrations/onboarding/celebration.svg"
    }
  ];

  const testimonials = [
    {
      quote: "I connected with clients and collaborators across the continent. GigsConnect feels built specifically for African creative talent.",
      name: "Tomiwa O.",
      role: "Digital Illustrator",
      location: "Lagos, NG",
      avatar: "/assets/illustrations/creators/makeup.svg"
    },
    {
      quote: "Within weeks I connected with brands and collaborators I would not have easily met elsewhere.",
      name: "Sarah K.",
      role: "Videographer",
      location: "Nairobi, KE",
      avatar: "/assets/illustrations/creators/media.svg"
    },
    {
      quote: "The community spirit and creative energy here are inspiring. It's dedicated to creators who take their work seriously.",
      name: "Joshua Ayomide",
      role: "DJ & Producer",
      location: "Abuja, NG",
      avatar: "/assets/illustrations/creators/dj-rafiki.svg"
    },
    {
      quote: "My creative network has expanded rapidly across countries. I recommend it to any serious creator in Africa.",
      name: "bright. Bchops",
      role: "Photographer",
      location: "Accra, GH",
      avatar: "/assets/illustrations/creators/photographer.svg"
    },
    {
      quote: "Finally, a platform that understands our creative ecosystem and highlights our unique African perspectives.",
      name: "Amanda C.",
      role: "Music Producer",
      location: "Cape Town, ZA",
      avatar: "/assets/illustrations/creators/content-creator.svg"
    },
    {
      quote: "A focused space to discover gigs, build creative partnerships, and show what we can do.",
      name: "David N.",
      role: "Software & Digital Creator",
      location: "Kigali, RW",
      avatar: "/assets/illustrations/creators/web-creator.svg"
    }
  ];

  const BackgroundDecor = () => (
    <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10 bg-white transition-colors duration-500">
      <div 
        className="absolute top-0 left-0 w-full h-full opacity-40 mix-blend-multiply" 
        style={{ 
          backgroundImage: 'radial-gradient(circle at 20% 15%, rgba(108, 59, 255, 0.08), transparent 45%), radial-gradient(circle at 85% 35%, rgba(108, 59, 255, 0.05), transparent 45%)' 
        }}
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-white selection:bg-brand-purple/20 selection:text-brand-purple-dark font-sans text-brand-black">
      <SEO 
        title="GigsConnect: Where African Creators Connect, Collaborate and Earn" 
        description="GigsConnect is where African creators collaborate, get hired and earn. Join 5,000+ creators sharing their work and finding gigs."
      />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(organizationSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(websiteSchema)}</script>
      </Helmet>

      <BackgroundDecor />
      
      {/* 1. Hero Section - Compact, bright soft purple gradient */}
      <section className="relative pt-20 pb-12 sm:pt-24 sm:pb-14 lg:pt-24 lg:pb-16 bg-gradient-to-b from-[#F5EFFF] via-[#FAF7FF] to-white border-b border-brand-purple/10 overflow-hidden">
        {/* Soft radial glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[320px] bg-brand-purple/10 blur-[100px] rounded-full pointer-events-none -z-0" />

        <div className="max-w-7xl mx-auto px-5 relative z-10">
          <div className="flex flex-col lg:grid lg:grid-cols-12 gap-8 lg:gap-8 items-center">
            
            {/* Left Side: Copy */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="lg:col-span-6 flex flex-col items-start text-left"
            >
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-black text-brand-black leading-[1.1] tracking-tight mb-4">
                Where African creators <br className="hidden sm:inline" />
                collaborate, get hired <span className="text-brand-purple">and earn.</span>
              </h1>
              
              <p className="text-base sm:text-lg text-brand-gray-dark leading-relaxed mb-6 w-full max-w-xl font-medium">
                Join 5,000+ African creators sharing their work, finding gigs and building careers on GigsConnect.
              </p>
              
              <div className="flex flex-col sm:flex-row flex-wrap gap-3.5 w-full justify-start items-stretch sm:items-center mb-3">
                <Link 
                  to="/signup" 
                  className="px-7 py-3.5 rounded-xl bg-brand-purple text-white font-bold text-base hover:bg-brand-purple-dark active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 shadow-md shadow-brand-purple/20 cursor-pointer"
                >
                  Join the Community
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link 
                  to="/login" 
                  className="px-7 py-3.5 rounded-xl bg-white text-brand-black font-bold text-base border border-gray-200 hover:border-brand-purple/40 hover:bg-brand-purple/5 active:scale-[0.98] transition-all duration-200 flex items-center justify-center shadow-sm cursor-pointer"
                >
                  Hire African Creators
                </Link>
              </div>

              {/* Static creator count */}
              <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-brand-purple pt-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>5,000+ creators have joined</span>
              </div>
            </motion.div>

            {/* Right Side: Hero Illustration */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="lg:col-span-6 relative w-full flex items-center justify-center py-4 lg:py-0"
            >
              <div className="relative w-full flex items-center justify-center">
                {/* Main Illustration Container */}
                <div className="relative z-10 w-[85%] max-w-[340px] sm:max-w-[380px] lg:max-w-[440px] aspect-square rounded-[2.5rem] overflow-hidden bg-white shadow-xl shadow-brand-purple/5 border border-purple-100 flex items-center justify-center p-6 sm:p-8">
                  <img 
                    src="/assets/illustrations/landing/teamwork.svg" 
                    alt="African creators collaborating on GigsConnect" 
                    className="w-full h-full object-contain relative z-10 mix-blend-multiply" 
                    {...{ fetchpriority: "high" } as any} 
                  />
                </div>

                {/* Floating Card 1: Project */}
                <motion.div 
                  animate={{ y: [0, -8, 0] }} 
                  transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }} 
                  className="absolute top-[6%] left-[0%] lg:-left-[6%] z-20"
                >
                  <div className="bg-white p-2.5 sm:p-3 rounded-2xl shadow-lg border border-purple-100 flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-brand-purple/10 text-brand-purple flex items-center justify-center">
                      <Briefcase className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">New Gig</p>
                      <p className="text-xs sm:text-sm font-black text-brand-black">Hiring Now</p>
                    </div>
                  </div>
                </motion.div>

                {/* Floating Card 2: Creator Profile */}
                <motion.div 
                  animate={{ y: [0, 10, 0] }} 
                  transition={{ repeat: Infinity, duration: 7, delay: 1, ease: "easeInOut" }} 
                  className="absolute bottom-[10%] right-[-2%] lg:right-[-6%] z-20"
                >
                  <div className="bg-white p-2.5 sm:p-3 rounded-2xl shadow-lg border border-purple-100 flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                      <User className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Community</p>
                      <p className="text-xs sm:text-sm font-black text-brand-black">Creator Profile</p>
                    </div>
                  </div>
                </motion.div>
                
                {/* Floating Card 3: Inquiries */}
                <motion.div 
                  animate={{ y: [0, -6, 0] }} 
                  transition={{ repeat: Infinity, duration: 5.5, delay: 2, ease: "easeInOut" }} 
                  className="absolute top-[25%] right-[-4%] lg:right-[-8%] z-20"
                >
                  <div className="bg-white p-2.5 sm:p-3 rounded-2xl shadow-lg border border-purple-100 flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-purple-50 text-brand-purple flex items-center justify-center">
                      <MessageSquare className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Inquiry</p>
                      <p className="text-xs sm:text-sm font-black text-brand-black">Direct Message</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2. How It Works - Toggleable between Creators and Clients (Light Purple Accent) */}
      <section id="how-it-works" className="py-20 lg:py-28 bg-[#F8F5FF] relative overflow-hidden border-b border-brand-purple/15 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-5 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <h2 className="text-3xl lg:text-5xl font-black text-brand-black mb-4 tracking-tight">How It Works</h2>
            <p className="text-base sm:text-lg text-brand-gray-dark font-medium leading-relaxed">
              Everything you need to collaborate seamlessly, from discovering talent to working together.
            </p>
          </div>

          {/* Toggle Tabs */}
          <div className="flex justify-center mb-12">
            <div className="inline-flex p-1.5 rounded-full bg-white border border-brand-purple/25 shadow-sm">
              <button
                type="button"
                onClick={() => setHowItWorksTab('creators')}
                className={`px-6 py-2.5 rounded-full text-xs sm:text-sm font-black transition-all cursor-pointer ${
                  howItWorksTab === 'creators'
                    ? 'bg-brand-purple text-white shadow-md shadow-brand-purple/20'
                    : 'text-gray-600 hover:text-brand-purple'
                }`}
              >
                For Creators
              </button>
              <button
                type="button"
                onClick={() => setHowItWorksTab('clients')}
                className={`px-6 py-2.5 rounded-full text-xs sm:text-sm font-black transition-all cursor-pointer ${
                  howItWorksTab === 'clients'
                    ? 'bg-brand-purple text-white shadow-md shadow-brand-purple/20'
                    : 'text-gray-600 hover:text-brand-purple'
                }`}
              >
                For Clients
              </button>
            </div>
          </div>

          {/* Steps Grid */}
          <AnimatePresence mode="wait">
            <motion.div
              key={howItWorksTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8"
            >
              {(howItWorksTab === 'creators' ? creatorsSteps : clientsSteps).map((step, i) => (
                <div 
                  key={step.title}
                  className="flex flex-col items-center text-center group bg-white rounded-3xl p-6 border border-purple-100/80 shadow-sm hover:shadow-md hover:border-brand-purple/30 transition-all"
                >
                  {/* Step Image / Screenshot Container - easily swap img src for app screenshots */}
                  <div className="w-full aspect-[4/3] mb-5 rounded-2xl overflow-hidden bg-[#FAF7FF] p-4 border border-purple-100/60 group-hover:border-brand-purple/20 transition-colors flex items-center justify-center">
                    <img 
                      src={step.img} 
                      alt={step.title} 
                      loading="lazy" 
                      className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500" 
                    />
                  </div>

                  {/* Step Number Badge */}
                  <div className="w-9 h-9 rounded-full bg-brand-purple text-white text-sm font-black flex items-center justify-center mb-3.5 shadow-sm shadow-brand-purple/20">
                    {step.step}
                  </div>
                  
                  <h3 className="text-lg font-bold text-brand-black mb-2">{step.title}</h3>
                  <p className="text-brand-gray-dark font-medium leading-relaxed text-xs sm:text-sm">{step.desc}</p>
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* 3. Find Talent - For Clients (Crisp White Background) */}
      <section className="py-20 lg:py-28 relative overflow-hidden bg-white">
        <div className="max-w-7xl mx-auto px-5 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:w-1/2 w-full"
            >
              <div className="w-full max-w-[380px] lg:max-w-none mx-auto aspect-square rounded-[2.5rem] overflow-hidden bg-[#FAF7FF] shadow-lg shadow-brand-purple/5 border border-purple-100 p-8">
                <img 
                  src="/assets/illustrations/creators/photographer.svg" 
                  alt="Find African creative talent and freelancers" 
                  loading="lazy" 
                  className="w-full h-full object-contain mix-blend-multiply" 
                />
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:w-1/2 w-full"
            >
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F5EFFF] border border-brand-purple/20 text-brand-purple text-xs font-bold tracking-widest uppercase mb-6 shadow-sm">
                <Search className="w-3.5 h-3.5" /> For Clients
              </div>
              <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-brand-black mb-4 tracking-tight">
                Discover Top Creative Talent
              </h2>
              <p className="text-base sm:text-lg text-brand-gray-dark font-medium leading-relaxed mb-6">
                Review portfolios, filter by specialized skills, and connect with professionals across Africa who can bring your creative vision to life.
              </p>
              <ul className="space-y-3.5 mb-8">
                {[
                  "Curated portfolio showcases",
                  "Creator profiles with skill badges",
                  "Skill-based search and filters",
                  "Direct client-to-creator inquiries"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-brand-black font-semibold text-sm sm:text-base">
                    <CheckCircle className="w-5 h-5 text-brand-purple flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link 
                to="/login" 
                className="inline-flex px-7 py-3.5 rounded-xl bg-brand-black text-white font-bold hover:bg-gray-900 transition-colors shadow-md cursor-pointer"
              >
                Start Hiring
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 4. Find Gigs - For Creators (Light Purple Background) */}
      <section className="py-20 lg:py-28 relative overflow-hidden bg-[#F9F6FF] border-y border-brand-purple/15">
        <div className="max-w-7xl mx-auto px-5 relative z-10">
          <div className="flex flex-col-reverse lg:flex-row items-center gap-12 lg:gap-20">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:w-1/2 w-full"
            >
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-brand-purple/20 text-brand-purple text-xs font-bold tracking-widest uppercase mb-6 shadow-sm">
                <Briefcase className="w-3.5 h-3.5" /> For Creators
              </div>
              <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-brand-black mb-4 tracking-tight">
                Find Opportunities That Match Your Skills
              </h2>
              <p className="text-base sm:text-lg text-brand-gray-dark font-medium leading-relaxed mb-6">
                Browse active gigs across music, design, visual arts, tech, and production. Apply directly with your portfolio profile.
              </p>
              <ul className="space-y-3.5 mb-8">
                {[
                  "Browse gigs by category & skills",
                  "Direct applications with your profile",
                  "Client inquiries & collaboration requests",
                  "Secure gig payments (coming soon)"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-brand-black font-semibold text-sm sm:text-base">
                    <CheckCircle className="w-5 h-5 text-brand-purple flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link 
                to="/signup" 
                className="inline-flex px-7 py-3.5 rounded-xl bg-brand-purple text-white font-bold hover:bg-brand-purple-dark transition-colors shadow-md shadow-brand-purple/20 cursor-pointer"
              >
                Explore Gigs
              </Link>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:w-1/2 w-full"
            >
              <div className="w-full max-w-[380px] lg:max-w-none mx-auto aspect-square rounded-[2.5rem] overflow-hidden bg-white shadow-lg shadow-brand-purple/5 border border-purple-100 p-8 relative">
                <img 
                  src="/assets/illustrations/creators/dj-bro.svg" 
                  alt="Find creative gigs and freelance opportunities in Africa" 
                  loading="lazy" 
                  className="w-full h-full object-contain mix-blend-multiply relative z-10" 
                />
                
                {/* Floating Notification */}
                <motion.div 
                  animate={{ y: [0, -8, 0] }} 
                  transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }} 
                  className="absolute top-[12%] right-[4%] z-20"
                >
                  <div className="bg-white p-2.5 sm:p-3 rounded-2xl shadow-xl border border-purple-100 flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-brand-purple/10 text-brand-purple flex items-center justify-center">
                      <Bell className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-black text-brand-black">Client Inquiry</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 5. Features Section - Everything You Need (Crisp White Background) */}
      <section className="py-20 lg:py-28 relative overflow-hidden bg-white">
        <div className="max-w-7xl mx-auto px-5 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-14 lg:mb-20">
            <h2 className="text-3xl lg:text-5xl font-black text-brand-black mb-4 tracking-tight">Everything You Need to Succeed</h2>
            <p className="text-base sm:text-lg text-brand-gray-dark font-medium leading-relaxed">
              Core tools designed specifically to help African creative talent connect, showcase work, and discover projects.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {[
              { 
                title: "Direct Messaging", 
                img: "/assets/illustrations/landing/chat-pana.svg", 
                desc: "Connect directly with clients and collaborators." 
              },
              { 
                title: "Portfolio Showcases", 
                img: "/assets/illustrations/landing/profile.svg", 
                desc: "Showcase your best creative work with clean media layouts and audio/visual support." 
              },
              { 
                title: "Creator Verification (Live)", 
                img: "/assets/illustrations/landing/leader.svg", 
                desc: "Upgrade to Pro or Premium for official account verification, a verified badge, and priority creator listing." 
              },
              { 
                title: "Analytics & Views", 
                img: "/assets/illustrations/landing/analytics.svg", 
                desc: "Track your profile views, audience engagement, and community post activity." 
              },
              { 
                title: "Secure Gig Payments (Coming soon)", 
                img: "/assets/illustrations/creators/media.svg", 
                desc: "Milestone escrow payments between clients and creators for project deliverables are currently in development." 
              },
              { 
                title: "Community Feed", 
                img: "/assets/illustrations/landing/calendar.svg", 
                desc: "Share project updates, discover inspiring work, and network with African talent." 
              }
            ].map((feat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="bg-[#FAF8FF] rounded-3xl p-6 sm:p-8 border border-purple-100 hover:border-brand-purple/30 shadow-sm hover:shadow-md transition-all group"
              >
                <div className="w-full aspect-video mb-5 rounded-2xl bg-white overflow-hidden p-4 border border-purple-100/50 flex items-center justify-center">
                  <img 
                    src={feat.img} 
                    alt={feat.title} 
                    loading="lazy" 
                    className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500" 
                  />
                </div>
                <h3 className="text-lg font-bold text-brand-black mb-2">{feat.title}</h3>
                <p className="text-brand-gray-dark font-medium text-xs sm:text-sm leading-relaxed">{feat.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Subscription / Pricing Section (Soft Light Purple Background) */}
      <div className="bg-[#FAF7FF] border-y border-brand-purple/15">
        <PricingSection />
      </div>

      {/* 7. Community Section - Creator Stories (Crisp White Background) */}
      <section className="py-20 lg:py-28 relative overflow-hidden bg-white">
        <div className="max-w-7xl mx-auto px-5">
          <div className="max-w-3xl mx-auto text-center mb-14 lg:mb-18">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F5EFFF] border border-brand-purple/20 text-brand-purple text-xs font-bold tracking-widest uppercase mb-6 shadow-sm"
            >
              <Heart className="w-3.5 h-3.5 fill-current" />
              Community
            </motion.div>
            
            <h2 className="text-3xl lg:text-5xl font-black text-brand-black mb-4 tracking-tight">Voices From the Community</h2>
            <p className="text-base sm:text-lg text-brand-gray-dark font-medium leading-relaxed">
              Musicians, designers, videographers, visual artists, and digital creators building connections across Africa.
            </p>
          </div>

          <div className="relative mb-8">
            <div className="flex justify-between items-center mb-6 px-2">
              <h3 className="text-xl sm:text-2xl font-black text-brand-black">Creator Highlights</h3>
              <div className="hidden md:flex items-center gap-2.5">
                <button 
                  onClick={() => scrollCarousel('left')} 
                  className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:border-brand-purple hover:text-brand-purple transition-colors shadow-sm cursor-pointer"
                  aria-label="Previous story"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => scrollCarousel('right')} 
                  className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:border-brand-purple hover:text-brand-purple transition-colors shadow-sm cursor-pointer"
                  aria-label="Next story"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div 
              ref={carouselRef} 
              className="flex overflow-x-auto snap-x snap-mandatory gap-5 pb-8 px-2" 
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {testimonials.map((t, index) => (
                <div key={index} className="min-w-[85vw] md:min-w-[360px] max-w-[420px] flex-shrink-0 snap-center md:snap-start">
                  <div className="h-full bg-[#FAF8FF] p-6 sm:p-8 rounded-3xl border border-purple-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between relative overflow-hidden">
                    <Quote className="absolute top-5 right-5 w-16 h-16 text-brand-purple/[0.04] rotate-12 pointer-events-none" />
                    
                    <p className="text-base sm:text-lg text-brand-black font-medium leading-relaxed mb-8 relative z-10">
                      "{t.quote}"
                    </p>
                    
                    <div className="flex items-center gap-3.5 relative z-10 pt-5 border-t border-purple-100/60">
                      <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-white border border-purple-100 flex-shrink-0 flex items-center justify-center">
                        <img 
                          src={t.avatar} 
                          loading="lazy" 
                          className="w-full h-full object-contain p-1.5 mix-blend-multiply" 
                          alt={t.name} 
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-black text-brand-black text-sm sm:text-base truncate">{t.name}</h4>
                        <div className="flex items-center gap-1.5 text-xs text-brand-gray-dark mt-0.5">
                          <span className="font-semibold">{t.role}</span>
                          <span className="w-1 h-1 rounded-full bg-gray-300" />
                          <span>{t.location}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 8. Footer CTA with Illustration (Deep contrast with purple ambient glow) */}
      <section className="py-20 bg-white border-t border-gray-100 px-5">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-[2.5rem] bg-brand-black p-8 sm:p-12 lg:p-16 text-center text-white relative overflow-hidden shadow-2xl flex flex-col items-center"
          >
            <div className="absolute top-0 right-0 w-[450px] h-[450px] bg-brand-purple/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[450px] h-[450px] bg-brand-purple/10 rounded-full blur-[80px] translate-y-1/3 -translate-x-1/3 pointer-events-none" />
            
            <div className="w-40 h-40 sm:w-48 sm:h-48 mb-6 relative z-10 bg-white rounded-full p-4 shadow-xl flex items-center justify-center">
              <img 
                src="/assets/illustrations/landing/networking.svg" 
                alt="African creator community networking and connecting" 
                loading="lazy" 
                className="w-full h-full object-contain mix-blend-multiply" 
              />
            </div>

            <div className="relative z-10 max-w-2xl mx-auto">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-4 tracking-tight">Join Africa's Creative Movement</h2>
              <p className="text-base sm:text-lg text-gray-300 mb-8 font-medium leading-relaxed">
                Connect with gig opportunities, collaborators, and clients across Africa and beyond.
              </p>
              <div className="flex flex-col sm:flex-row gap-3.5 justify-center">
                <Link 
                  to="/signup" 
                  className="px-8 py-4 rounded-xl bg-white text-brand-black font-black hover:bg-gray-100 active:scale-[0.98] transition-all text-base shadow-xl cursor-pointer"
                >
                  Get Started Free
                </Link>
                <Link 
                  to="/about-us" 
                  className="px-8 py-4 rounded-xl bg-white/10 text-white font-black border border-white/20 hover:bg-white/20 active:scale-[0.98] transition-all text-base backdrop-blur-md cursor-pointer"
                >
                  Learn More About Us
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
