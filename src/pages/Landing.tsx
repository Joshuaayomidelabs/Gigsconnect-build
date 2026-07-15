import React, { useState, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'motion/react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  CheckCircle, Zap, PlusCircle, Music, Mic2, Disc, Settings, Calendar,
  Star, ArrowRight, MapPin, MessageSquare, Share2, Heart, Clock, Briefcase,
  Camera, Video, PenTool, Edit3, MonitorPlay, Mic, Scissors, Shirt, Code,
  Film, Grid, Handshake, ArrowRightCircle, Quote, BadgeCheck, ChevronLeft, ChevronRight,
  Search, Filter, Users, TrendingUp, Shield, CreditCard, Bell
} from 'lucide-react';

const Landing: React.FC = () => {
  const { user } = useAuth();
  const isLoggedIn = !!user;
  
  const carouselRef = useRef<HTMLDivElement>(null);

  const scrollCarousel = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = window.innerWidth > 768 ? 400 : 300;
      carouselRef.current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    }
  };

  const testimonials = [
    {
      quote: "I landed my first international client through GigsConnect. The platform feels built specifically for creators.",
      name: "Tomiwa O.",
      role: "Digital Illustrator",
      location: "Lagos, NG",
      category: "Illustrator",
      avatar: "/images/avatar_designer_1784146810645.jpg",
      rating: 5
    },
    {
      quote: "Within weeks I connected with brands and collaborators I never would have met elsewhere.",
      name: "Sarah K.",
      role: "Videographer",
      location: "Nairobi, KE",
      category: "Videographer",
      avatar: "/images/avatar_videographer_1784146819278.jpg",
      rating: 5
    },
    {
      quote: "The quality of opportunities here is unlike anything I've experienced before. It's truly premium.",
      name: "Joshua Ayomide",
      role: "DJ & Producer",
      location: "Abuja, NG",
      category: "DJ",
      avatar: "/images/avatar_dj_1784146786388.jpg",
      rating: 5
    },
    {
      quote: "My creative network has grown faster than I imagined. I highly recommend it to any serious creator.",
      name: "bright. Bchops",
      role: "Photographer",
      location: "Accra, GH",
      category: "Photographer",
      avatar: "/images/avatar_photographer_1784146799515.jpg",
      rating: 5
    },
    {
      quote: "Finally, a platform that understands the African creator economy and respects our craft.",
      name: "Amanda C.",
      role: "Music Producer",
      location: "Cape Town, ZA",
      category: "Musician",
      avatar: "/images/creator_avatar_singer_1784146326649.jpg",
      rating: 5
    },
    {
      quote: "The best place to find top-tier projects and developers who understand the creative vision.",
      name: "David N.",
      role: "Software Engineer",
      location: "Kigali, RW",
      category: "Developer",
      avatar: "/images/creator_avatar_developer_1784146336101.jpg",
      rating: 5
    }
  ];

  const BackgroundDecor = () => (
    <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10 bg-[#faf9fc] transition-colors duration-500">
      <div className="absolute top-0 left-0 w-full h-full opacity-30 mix-blend-multiply" 
           style={{ backgroundImage: 'radial-gradient(circle at 15% 50%, rgba(108, 59, 255, 0.05), transparent 40%), radial-gradient(circle at 85% 30%, rgba(108, 59, 255, 0.03), transparent 40%)' }}></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#faf9fc] selection:bg-brand-purple/30 selection:text-brand-purple-dark font-sans text-brand-black">
      <BackgroundDecor />
      
      {/* 1. Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-5 relative z-10">
          <div className="flex flex-col lg:grid lg:grid-cols-12 gap-16 lg:gap-10 items-center">
            
            {/* Left Side: Copy */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="lg:col-span-6 flex flex-col items-start text-left"
            >
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-brand-purple/10 text-brand-purple text-xs font-bold tracking-widest uppercase mb-8 shadow-sm"
              >
                <Zap className="w-3.5 h-3.5 fill-current" />
                Africa's Creator Platform
              </motion.div>
              
              <h1 className="text-5xl lg:text-7xl font-black text-brand-black leading-[1.05] tracking-tight mb-6">
                Build Your <br />
                <span className="text-brand-purple">Creative Career.</span>
              </h1>
              
              <p className="text-lg lg:text-xl text-brand-gray-dark leading-relaxed mb-10 w-full max-w-lg font-medium">
                Connect, collaborate, and grow with Africa's leading creative ecosystem. Where top talent meets incredible opportunities.
              </p>
              
              <div className="flex flex-col sm:flex-row flex-wrap gap-4 w-full justify-start items-center mb-10">
                <Link to="/signup" className="w-full sm:w-auto px-8 py-4 rounded-xl bg-brand-purple text-white font-bold text-base hover:bg-brand-purple-dark active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 shadow-sm">
                  Join for Free
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link to="/login" className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white text-brand-black font-bold text-base border border-gray-200 hover:border-brand-purple/30 active:scale-[0.98] transition-all duration-200 flex items-center justify-center shadow-sm">
                  Hire Creators
                </Link>
              </div>
            </motion.div>

            {/* Right Side: Hero Illustration */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="lg:col-span-6 relative w-full h-[500px] lg:h-[600px]"
            >
              <div className="relative w-full h-full flex items-center justify-center">
                {/* Main Illustration */}
                <div className="relative z-10 w-[90%] max-w-[600px] aspect-square rounded-[3rem] overflow-hidden bg-white shadow-[0_20px_60px_rgba(0,0,0,0.04)] border border-gray-100 flex items-center justify-center p-8 lg:p-12">
                  <img src="/images/hero_collab_1784146167112.jpg" alt="Creators Collaborating" className="w-full h-full object-contain relative z-10 mix-blend-multiply" />
                </div>

                {/* Floating Cards */}
                <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }} className="absolute top-[10%] left-[0%] lg:-left-[10%] z-20">
                  <div className="bg-white p-3 lg:p-4 rounded-2xl shadow-[0_15px_30px_rgb(0,0,0,0.06)] border border-gray-100 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-brand-purple/10 text-brand-purple flex items-center justify-center">
                      <Briefcase className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">New Project</p>
                      <p className="text-sm font-black text-brand-black">Hiring Now</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div animate={{ y: [0, 15, 0] }} transition={{ repeat: Infinity, duration: 7, delay: 1, ease: "easeInOut" }} className="absolute bottom-[20%] right-[-5%] lg:right-[-10%] z-20">
                  <div className="bg-white p-3 lg:p-4 rounded-2xl shadow-[0_15px_30px_rgb(0,0,0,0.06)] border border-gray-100 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-green-50 text-green-600 flex items-center justify-center">
                      <CheckCircle className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Status</p>
                      <p className="text-sm font-black text-brand-black">Verified Creator</p>
                    </div>
                  </div>
                </motion.div>
                
                <motion.div animate={{ y: [0, -8, 0] }} transition={{ repeat: Infinity, duration: 5.5, delay: 2, ease: "easeInOut" }} className="absolute top-[30%] right-[-5%] lg:right-[-10%] z-20">
                  <div className="bg-white p-3 lg:p-4 rounded-2xl shadow-[0_15px_30px_rgb(0,0,0,0.06)] border border-gray-100 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                      <MessageSquare className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Notification</p>
                      <p className="text-sm font-black text-brand-black">Message Received</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2. How It Works */}
      <section id="how-it-works" className="py-24 lg:py-32 bg-white relative overflow-hidden border-y border-gray-100 scroll-mt-20 lg:scroll-mt-24">
        <div className="max-w-7xl mx-auto px-5 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16 lg:mb-24">
            <h2 className="text-3xl lg:text-5xl font-black text-brand-black mb-6 tracking-tight">How It Works</h2>
            <p className="text-lg text-brand-gray-dark font-medium leading-relaxed">Everything you need to collaborate seamlessly, from discovering talent to secure payments.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {[
              {
                title: "Post a Project",
                desc: "Describe your needs and attract top creative professionals.",
                img: "/images/how_it_works_1_1784146180385.jpg"
              },
              {
                title: "Browse & Apply",
                desc: "Creators find opportunities tailored to their skills and apply.",
                img: "/images/how_it_works_2_1784146191094.jpg"
              },
              {
                title: "Collaborate",
                desc: "Connect, communicate, and create amazing work together.",
                img: "/images/how_it_works_3_1784146200123.jpg"
              },
              {
                title: "Complete & Review",
                desc: "Secure payments and build your reputation with reviews.",
                img: "/images/how_it_works_4_1784146209959.jpg"
              }
            ].map((step, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="flex flex-col items-center text-center group"
              >
                <div className="w-full aspect-square mb-8 rounded-3xl overflow-hidden bg-[#faf9fc] p-6 border border-gray-100 group-hover:border-brand-purple/20 transition-colors">
                  <img src={step.img} alt={step.title} className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="w-10 h-10 rounded-full bg-brand-purple text-white font-bold flex items-center justify-center mb-4">
                  {i + 1}
                </div>
                <h3 className="text-xl font-bold text-brand-black mb-3">{step.title}</h3>
                <p className="text-brand-gray-dark font-medium leading-relaxed text-sm">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Find Talent */}
      <section className="py-24 lg:py-32 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-5 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="lg:w-1/2 w-full"
            >
              <div className="w-full aspect-square rounded-[3rem] overflow-hidden bg-white shadow-[0_20px_60px_rgba(0,0,0,0.06)] border border-gray-100 p-8">
                <img src="/images/find_talent_1784146221218.jpg" alt="Find Talent" className="w-full h-full object-contain mix-blend-multiply" />
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="lg:w-1/2 w-full"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-brand-purple/10 text-brand-purple text-xs font-bold tracking-widest uppercase mb-8 shadow-sm">
                <Search className="w-3.5 h-3.5" /> For Clients
              </div>
              <h2 className="text-3xl lg:text-5xl font-black text-brand-black mb-6 tracking-tight">Discover Top-Tier Creative Talent</h2>
              <p className="text-lg text-brand-gray-dark font-medium leading-relaxed mb-8">
                Review stunning portfolios, filter by specialized skills, and hire verified professionals who can bring your creative vision to life.
              </p>
              <ul className="space-y-4 mb-10">
                {[
                  "Advanced portfolio previews",
                  "Verified creator badges",
                  "Skill-based search filters",
                  "Direct hiring workflows"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-brand-black font-medium">
                    <CheckCircle className="w-5 h-5 text-brand-purple flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link to="/login" className="inline-flex px-8 py-4 rounded-xl bg-brand-black text-white font-bold hover:bg-gray-900 transition-colors shadow-lg">
                Start Hiring
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 4. Find Gigs */}
      <section className="py-24 lg:py-32 relative overflow-hidden bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-5 relative z-10">
          <div className="flex flex-col-reverse lg:flex-row items-center gap-16 lg:gap-24">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="lg:w-1/2 w-full"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-brand-purple/10 text-brand-purple text-xs font-bold tracking-widest uppercase mb-8 shadow-sm">
                <Briefcase className="w-3.5 h-3.5" /> For Creators
              </div>
              <h2 className="text-3xl lg:text-5xl font-black text-brand-black mb-6 tracking-tight">Find Opportunities That Match Your Skills</h2>
              <p className="text-lg text-brand-gray-dark font-medium leading-relaxed mb-8">
                Browse premium gigs, receive instant notifications for perfect matches, and apply seamlessly with your curated portfolio.
              </p>
              <ul className="space-y-4 mb-10">
                {[
                  "Tailored gig recommendations",
                  "One-click applications",
                  "Interview invitations",
                  "Secure milestone payments"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-brand-black font-medium">
                    <CheckCircle className="w-5 h-5 text-brand-purple flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link to="/signup" className="inline-flex px-8 py-4 rounded-xl bg-brand-purple text-white font-bold hover:bg-brand-purple-dark transition-colors shadow-lg">
                Explore Gigs
              </Link>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="lg:w-1/2 w-full"
            >
              <div className="w-full aspect-square rounded-[3rem] overflow-hidden bg-[#faf9fc] shadow-[0_20px_60px_rgba(0,0,0,0.06)] border border-gray-100 p-8 relative">
                <img src="/images/find_gigs_1784146231885.jpg" alt="Find Gigs" className="w-full h-full object-contain mix-blend-multiply relative z-10" />
                
                {/* Floating Notification */}
                <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }} className="absolute top-[15%] right-[5%] z-20">
                  <div className="bg-white p-3 rounded-2xl shadow-xl border border-gray-100 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-brand-purple/10 text-brand-purple flex items-center justify-center">
                      <Bell className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-black text-brand-black">Interview Invite</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 5. Features Section */}
      <section className="py-24 lg:py-32 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-5 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16 lg:mb-24">
            <h2 className="text-3xl lg:text-5xl font-black text-brand-black mb-6 tracking-tight">Everything You Need to Succeed</h2>
            <p className="text-lg text-brand-gray-dark font-medium leading-relaxed">A complete suite of tools designed specifically for the modern creative workflow.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: "Messaging", img: "/images/feature_messaging_1784146243124.jpg", desc: "Communicate securely with clients and collaborators in real-time." },
              { title: "Portfolio", img: "/images/feature_portfolio_1784146261512.jpg", desc: "Showcase your best work with stunning customizable layouts." },
              { title: "Verification", img: "/images/feature_verification_1784146271132.jpg", desc: "Build trust with verified badges and authenticated reviews." },
              { title: "Analytics", img: "/images/feature_analytics_1784146283413.jpg", desc: "Track your profile views, proposal success rate, and earnings." },
              { title: "Payments", img: "/images/feature_payments_1784146294382.jpg", desc: "Secure escrow payments ensure you get paid on time, every time." },
              { title: "Booking", img: "/images/feature_booking_1784146352508.jpg", desc: "Manage your availability and let clients book you directly." }
            ].map((feat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-[0_10px_40px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_60px_rgba(108,76,241,0.08)] transition-all group"
              >
                <div className="w-full aspect-video mb-6 rounded-2xl bg-[#faf9fc] overflow-hidden p-4">
                  <img src={feat.img} alt={feat.title} className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500" />
                </div>
                <h3 className="text-xl font-bold text-brand-black mb-2">{feat.title}</h3>
                <p className="text-brand-gray-dark font-medium text-sm leading-relaxed">{feat.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Pricing / Growth Section */}
      <section className="py-24 lg:py-32 bg-white relative overflow-hidden border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-5 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="lg:w-1/2 w-full"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-brand-purple/10 text-brand-purple text-xs font-bold tracking-widest uppercase mb-8 shadow-sm">
                <TrendingUp className="w-3.5 h-3.5" /> Career Progression
              </div>
              <h2 className="text-3xl lg:text-5xl font-black text-brand-black mb-6 tracking-tight">Grow Your Creative Business</h2>
              <p className="text-lg text-brand-gray-dark font-medium leading-relaxed mb-8">
                GigsConnect is free to join. We only succeed when you succeed, taking a minimal platform fee only when you get paid for a completed gig.
              </p>
              <div className="bg-[#faf9fc] rounded-2xl p-6 border border-gray-100">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-brand-purple/10 flex items-center justify-center text-brand-purple">
                    <Shield className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-brand-black">Free to Join & Apply</h4>
                    <p className="text-sm text-brand-gray-dark">No monthly subscriptions</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-brand-purple/10 flex items-center justify-center text-brand-purple">
                    <CreditCard className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-brand-black">Secure Escrow Payments</h4>
                    <p className="text-sm text-brand-gray-dark">Guaranteed payment upon completion</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="lg:w-1/2 w-full"
            >
              <div className="w-full aspect-square rounded-[3rem] overflow-hidden bg-white shadow-[0_20px_60px_rgba(0,0,0,0.06)] border border-gray-100 p-8">
                <img src="/images/pricing_growth_1784146304703.jpg" alt="Growth and Progression" className="w-full h-full object-contain mix-blend-multiply" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 7. Community Section */}
      <section className="py-24 lg:py-32 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-5">
          <div className="max-w-3xl mx-auto text-center mb-16 lg:mb-20">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-brand-purple/10 text-brand-purple text-xs font-bold tracking-widest uppercase mb-8 shadow-sm"
            >
              <Heart className="w-3.5 h-3.5 fill-current" />
              Community
            </motion.div>
            
            <h2 className="text-3xl lg:text-5xl font-black text-brand-black mb-6 tracking-tight">Loved by Creators Across Africa</h2>
            <p className="text-lg text-brand-gray-dark font-medium leading-relaxed">
              Join thousands of musicians, designers, videographers, developers, and creators building successful careers.
            </p>
          </div>

          <div className="relative mb-16">
            <div className="flex justify-between items-center mb-8 px-2">
              <h3 className="text-2xl font-black text-brand-black">Creator Stories</h3>
              <div className="hidden md:flex items-center gap-3">
                <button onClick={() => scrollCarousel('left')} className="w-12 h-12 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:border-brand-purple hover:text-brand-purple transition-colors shadow-sm">
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button onClick={() => scrollCarousel('right')} className="w-12 h-12 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:border-brand-purple hover:text-brand-purple transition-colors shadow-sm">
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div ref={carouselRef} className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-10 px-2" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              {testimonials.map((t, index) => (
                <div key={index} className="min-w-[85vw] md:min-w-[400px] max-w-[450px] flex-shrink-0 snap-center md:snap-start">
                  <div className="h-full bg-white p-8 lg:p-10 rounded-[2rem] border border-gray-100 shadow-[0_10px_40px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_60px_rgba(108,76,241,0.12)] transition-all flex flex-col justify-between relative overflow-hidden">
                    <Quote className="absolute top-6 right-6 w-20 h-20 text-brand-purple/[0.03] rotate-12 pointer-events-none" />
                    <div>
                      <div className="flex gap-1 mb-8">
                        {[...Array(t.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-brand-purple text-brand-purple" />
                        ))}
                      </div>
                      <p className="text-xl text-brand-black font-medium leading-relaxed mb-10 relative z-10">"{t.quote}"</p>
                    </div>
                    <div className="flex items-center gap-4 relative z-10 pt-6 border-t border-gray-50">
                      <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-[#faf9fc] border border-gray-100 flex-shrink-0">
                        <img src={t.avatar} className="w-full h-full object-cover mix-blend-multiply" alt={t.name} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-black text-brand-black text-lg truncate">{t.name}</h4>
                        <div className="flex items-center gap-1.5 text-xs text-brand-gray-dark mt-1">
                          <span className="font-bold">{t.role}</span>
                          <span className="w-1 h-1 rounded-full bg-gray-300"></span>
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

      {/* 8. Footer CTA with Illustration */}
      <section className="py-24 bg-white border-t border-gray-100 px-5">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-[3rem] bg-brand-black p-10 lg:p-16 text-center text-white relative overflow-hidden shadow-2xl flex flex-col items-center"
          >
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-purple/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-brand-purple/10 rounded-full blur-[80px] translate-y-1/3 -translate-x-1/3 pointer-events-none"></div>
            
            <div className="w-48 h-48 lg:w-64 lg:h-64 mb-8 relative z-10 bg-white rounded-full p-4 shadow-xl">
              <img src="/images/footer_community_1784146316093.jpg" alt="Community Networking" className="w-full h-full object-contain mix-blend-multiply" />
            </div>

            <div className="relative z-10 max-w-2xl mx-auto">
              <h2 className="text-4xl lg:text-5xl font-black mb-6 tracking-tight">Join the Creative Movement</h2>
              <p className="text-lg text-gray-300 mb-10 font-medium leading-relaxed">
                Start connecting with opportunities, collaborators, and clients across Africa today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/signup" className="px-10 py-5 rounded-xl bg-white text-brand-black font-black hover:bg-gray-50 active:scale-[0.98] transition-all text-lg shadow-xl">
                  Get Started Free
                </Link>
                <Link to="/login" className="px-10 py-5 rounded-xl bg-white/10 text-white font-black border border-white/20 hover:bg-white/20 active:scale-[0.98] transition-all text-lg backdrop-blur-md">
                  Explore Creators
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
