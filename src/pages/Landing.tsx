import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  CheckCircle, 
  Zap, 
  PlusCircle, 
  Music, 
  Mic2, 
  Disc, 
  Settings, 
  Calendar,
  Star,
  ArrowRight,
  MapPin,
  MessageSquare,
  Share2,
  Heart
} from 'lucide-react';

import Logo from '../components/Logo';

const Landing: React.FC = () => {
  const { user } = useAuth();
  const isLoggedIn = !!user;

  const sampleGigs = [
    {
      title: "Live Band Needed for Wedding Reception",
      location: "Lagos, Nigeria",
      role: "Band",
      postedBy: "David Adebayo",
      price: "₦150,000",
      avatar: "https://i.pravatar.cc/150?u=david",
      verified: true
    },
    {
      title: "Female Vocalist for Studio Recording",
      location: "Abuja, Nigeria",
      role: "Vocalist",
      postedBy: "Michael Okoro",
      price: "₦80,000",
      avatar: "https://i.pravatar.cc/150?u=michael",
      verified: true
    },
    {
      title: "Saxophonist for Private Dinner Event",
      location: "Lekki, Lagos",
      role: "Saxophonist",
      postedBy: "Chioma Nwankwo",
      price: "₦60,000",
      avatar: "https://i.pravatar.cc/150?u=chioma",
      verified: true
    },
    {
      title: "Music Producer Needed for Afrobeats EP",
      location: "Accra, Ghana",
      role: "Producer",
      postedBy: "Kwame Mensah",
      price: "$150",
      avatar: "https://i.pravatar.cc/150?u=kwame",
      verified: true
    }
  ];

  const categories = [
    { name: "Musicians", icon: <Music className="w-6 h-6" />, count: "1.2k+" },
    { name: "Vocalists", icon: <Mic2 className="w-6 h-6" />, count: "800+" },
    { name: "Producers", icon: <Disc className="w-6 h-6" />, count: "450+" },
    { name: "Sound Engineers", icon: <Settings className="w-6 h-6" />, count: "300+" },
    { name: "Event Planners", icon: <Calendar className="w-6 h-6" />, count: "200+" }
  ];

  const steps = [
    {
      title: "Post a Gig",
      description: "Describe your needs and reach thousands of talented creatives.",
      icon: <PlusCircle className="w-8 h-8" />
    },
    {
      title: "Receive Applications",
      description: "Review portfolios and chat with applicants in real-time.",
      icon: <MessageSquare className="w-8 h-8" />
    },
    {
      title: "Hire Talent",
      description: "Securely hire the best fit and start collaborating.",
      icon: <CheckCircle className="w-8 h-8" />
    }
  ];

  const testimonials = [
    {
      quote: "GigsConnect transformed how I find work. The quality of talent here is unmatched.",
      name: "Sarah Johnson",
      role: "Event Director",
      avatar: "https://i.pravatar.cc/150?u=sarah",
      rating: 5
    },
    {
      quote: "As a producer, finding reliable vocalists was hard until I joined this community.",
      name: "Tunde Ednut",
      role: "Music Producer",
      avatar: "https://i.pravatar.cc/150?u=tunde",
      rating: 5
    }
  ];

  const BackgroundDecor = () => (
    <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
      {/* Animated Blobs */}
      <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-brand-purple/10 rounded-full blur-[150px] animate-float-slower opacity-60"></div>
      <div className="absolute bottom-[-15%] right-[-10%] w-[60%] h-[60%] bg-brand-purple/5 rounded-full blur-[120px] animate-float-slow opacity-40" style={{ animationDelay: '-7s' }}></div>
      <div className="absolute top-[20%] right-[5%] w-[40%] h-[40%] bg-brand-purple/5 rounded-full blur-[100px] animate-pulse-glow opacity-30"></div>
      <div className="absolute bottom-[20%] left-[10%] w-[30%] h-[30%] bg-brand-purple/5 rounded-full blur-[100px] animate-float-slow opacity-20" style={{ animationDelay: '-12s' }}></div>
      
      {/* Subtle Music Icons */}
      <div className="absolute top-[15%] left-[5%] opacity-[0.02] animate-float-slower" style={{ animationDelay: '2s' }}>
        <Music className="w-32 h-32" />
      </div>
      <div className="absolute top-[45%] right-[5%] opacity-[0.02] animate-float-slow" style={{ animationDelay: '4s' }}>
        <Disc className="w-32 h-32" />
      </div>
      <div className="absolute bottom-[20%] left-[10%] opacity-[0.02] animate-float-slow" style={{ animationDelay: '6s' }}>
        <Mic2 className="w-24 h-24" />
      </div>
      <div className="absolute top-[70%] left-[40%] opacity-[0.01] animate-pulse-glow">
        <Zap className="w-40 h-40" />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen gradient-bg selection:bg-brand-purple/30 selection:text-brand-purple-dark">
      <BackgroundDecor />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-5 relative z-10">
          <div className="flex flex-col lg:grid lg:grid-cols-12 gap-16 lg:gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="lg:col-span-7 flex flex-col items-start"
            >
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-purple/5 border border-brand-purple/10 text-brand-purple text-sm font-bold tracking-tight mb-8 hover:bg-brand-purple/10 transition-colors cursor-default"
              >
                <span className="flex h-2 w-2 rounded-full bg-brand-purple animate-pulse"></span>
                <span className="opacity-80">The #1 Music Community in Africa</span>
              </motion.div>
              
              <h1 className="text-5xl sm:text-6xl lg:text-8xl font-black text-brand-black leading-[1.05] tracking-tight mb-8 text-left w-full">
                Find Your Next <br />
                <span className="text-brand-purple relative inline-block">
                  Music Gig
                  <svg className="absolute -bottom-2 left-0 w-full h-3 text-brand-purple/20" viewBox="0 0 100 10" preserveAspectRatio="none">
                    <path d="M0 5 Q 25 0, 50 5 T 100 5" fill="none" stroke="currentColor" strokeWidth="8" />
                  </svg>
                </span>
                <br />
                Faster.
              </h1>
              
              <p className="text-lg lg:text-2xl text-brand-gray-dark/80 leading-relaxed mb-10 w-full lg:max-w-xl text-left font-medium">
                GigsConnect is the premier platform for musicians, producers, and creatives to discover opportunities and build meaningful collaborations across the continent.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-5 w-full">
                <Link to={isLoggedIn ? "/post" : "/login"} className="group w-full sm:w-auto px-10 py-5 rounded-2xl bg-brand-purple text-white font-bold text-xl hover:bg-brand-purple-dark hover:shadow-glow hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2">
                  Post a Gig
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link to={isLoggedIn ? "/browse" : "/login"} className="w-full sm:w-auto px-10 py-5 rounded-2xl bg-white text-brand-black font-bold text-xl border-2 border-brand-purple/5 shadow-soft hover:shadow-premium hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center">
                  Find Talent
                </Link>
              </div>

              <div className="mt-12 flex flex-col sm:flex-row items-start sm:items-center gap-6 lg:gap-8 w-full">
                <div className="flex -space-x-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="w-12 h-12 rounded-full border-4 border-white dark:border-brand-black overflow-hidden shadow-sm hover:scale-110 transition-transform cursor-pointer">
                      <img 
                        src={`https://i.pravatar.cc/150?u=${i + 10}`}
                        className="w-full h-full object-cover"
                        alt="User"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  ))}
                  <div className="w-12 h-12 rounded-full bg-brand-purple border-4 border-white dark:border-brand-black flex items-center justify-center text-white text-xs font-black shadow-sm">
                    +2k
                  </div>
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-1 text-yellow-500 mb-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-sm text-brand-gray-dark font-bold">
                    Trusted by <span className="text-brand-black font-black">2,000+</span> creatives in Africa
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="lg:col-span-5 relative w-full mt-12 lg:mt-0"
            >
              <div className="relative z-10 w-full">
                <div className="relative group">
                  {/* Main Image Container */}
                  <div className="relative glass p-4 rounded-[3rem] shadow-2xl border border-white/40 overflow-hidden">
                    <div className="relative rounded-[2.2rem] overflow-hidden aspect-[4/5] lg:aspect-square">
                      <img 
                        src="https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&q=80&w=1000" 
                        alt="Music Production" 
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-1000"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-brand-black/60 via-transparent to-transparent"></div>
                      
                      {/* Play Button Overlay */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white shadow-2xl group/play"
                        >
                          <div className="w-14 h-14 rounded-full bg-brand-purple flex items-center justify-center group-hover/play:bg-brand-purple-hover transition-colors">
                            <Music className="w-6 h-6 fill-current" />
                          </div>
                        </motion.button>
                      </div>
                    </div>
                  </div>

                  {/* Floating Cards */}
                  <motion.div 
                    animate={{ y: [0, -15, 0] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -top-10 -right-6 lg:-top-12 lg:-right-12 glass p-5 rounded-3xl shadow-premium border border-white/50 max-w-[220px] hidden sm:block z-20"
                  >
                    <div className="flex items-center gap-4 mb-3">
                      <div className="w-12 h-12 rounded-2xl bg-green-500/10 flex items-center justify-center text-green-600">
                        <CheckCircle className="w-7 h-7" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-brand-gray-dark uppercase tracking-widest">Status</p>
                        <p className="text-base font-black text-brand-black">Hired!</p>
                      </div>
                    </div>
                    <p className="text-xs text-brand-gray-dark font-medium leading-relaxed">Michael just hired a <span className="text-brand-purple font-bold">Vocalist</span> for his upcoming Afrobeats EP.</p>
                  </motion.div>

                  <motion.div 
                    animate={{ y: [0, 15, 0] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    className="absolute -bottom-10 -left-6 lg:-bottom-12 lg:-left-12 glass p-5 rounded-3xl shadow-premium border border-white/50 hidden sm:block z-20"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-brand-purple flex items-center justify-center text-white shadow-glow">
                        <Disc className="w-8 h-8 animate-spin-slow" />
                      </div>
                      <div>
                        <p className="text-sm font-black text-brand-black">New Gig Posted</p>
                        <div className="flex items-center gap-1 text-brand-gray-dark text-[10px] font-bold mt-1">
                          <MapPin className="w-3 h-3" />
                          Lagos, Nigeria
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Decorative Elements */}
                  <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%]">
                    <div className="absolute top-0 right-0 w-72 h-72 bg-brand-purple/20 rounded-full blur-[100px] animate-pulse"></div>
                    <div className="absolute bottom-0 left-0 w-80 h-80 bg-brand-purple/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trusted By Section */}
      <section className="py-12 border-y border-brand-purple/5 bg-white/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-5">
          <p className="text-center text-sm font-bold text-brand-gray-dark uppercase tracking-[0.2em] mb-10">Trusted by leading music brands</p>
          <div className="flex flex-wrap justify-center items-center gap-12 lg:gap-24 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
            {['Sony Music', 'Universal Music', 'Mavin Records', 'Chocolate City', 'Warner Music'].map((brand) => (
              <span key={brand} className="text-2xl lg:text-3xl font-black tracking-tighter text-brand-black whitespace-nowrap">{brand}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Gigs */}
      <section className="py-16 lg:py-24 relative">
        <div className="max-w-7xl mx-auto px-5">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 lg:mb-16">
            <div className="text-left">
              <h2 className="text-3xl lg:text-5xl font-black text-brand-black mb-4 tracking-tight">Featured Gigs</h2>
              <p className="text-base lg:text-lg text-brand-gray-dark w-full lg:max-w-xl">Explore the latest opportunities from our verified community members.</p>
            </div>
            <Link to={isLoggedIn ? "/browse" : "/login"} className="group flex items-center gap-2 text-brand-purple font-bold hover:gap-3 transition-all">
              View all gigs <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {sampleGigs.map((gig, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="group glass-card rounded-[2.5rem] p-6 border border-white/40 hover:border-brand-purple/20 hover:bg-white/60 hover:shadow-premium transition-all duration-500"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="relative">
                    <img src={gig.avatar} className="w-14 h-14 rounded-2xl object-cover shadow-sm" alt={gig.postedBy} />
                    {gig.verified && (
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-brand-purple rounded-full border-2 border-white flex items-center justify-center text-white">
                        <CheckCircle className="w-3 h-3" />
                      </div>
                    )}
                  </div>
                  <div className="px-3 py-1 rounded-full bg-white text-brand-purple text-[10px] font-bold uppercase tracking-wider shadow-sm">
                    {gig.role}
                  </div>
                </div>

                <h3 className="text-lg font-black text-brand-black mb-2 line-clamp-1 group-hover:text-brand-purple transition-colors">{gig.title}</h3>
                <div className="flex items-center gap-2 text-brand-gray-dark text-sm mb-6">
                  <MapPin className="w-4 h-4" />
                  {gig.location}
                </div>

                <div className="pt-6 border-t border-brand-purple/5 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-bold text-brand-gray-dark uppercase tracking-widest">Budget</p>
                    <p className="text-lg font-black text-brand-black">{gig.price}</p>
                  </div>
                  <Link 
                    to={isLoggedIn ? "/browse" : "/login"}
                    className="w-10 h-10 rounded-xl bg-white border border-brand-purple/10 flex items-center justify-center text-brand-purple hover:bg-brand-purple hover:text-white transition-all"
                  >
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 lg:py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-5 relative z-10">
          <div className="text-left lg:text-center mb-12 lg:mb-16">
            <h2 className="text-3xl lg:text-5xl font-black text-brand-black mb-4 tracking-tight">Browse by Category</h2>
            <p className="text-base lg:text-lg text-brand-gray-dark">Find the perfect talent for your next project.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-6">
            {categories.map((cat, index) => (
              <Link
                key={index}
                to={isLoggedIn ? "/browse" : "/login"}
                className="block"
              >
                <motion.div
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="glass-card p-8 rounded-[2.5rem] border border-white/40 shadow-soft hover:shadow-premium transition-all text-center group cursor-pointer"
                >
                  <div className="w-16 h-16 rounded-2xl bg-brand-purple-soft text-brand-purple flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                    {cat.icon}
                  </div>
                  <h3 className="font-black text-brand-black mb-1">{cat.name}</h3>
                  <p className="text-xs text-brand-gray-dark font-bold uppercase tracking-widest">{cat.count} listings</p>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-5">
          <div className="flex flex-col lg:grid lg:grid-cols-2 gap-12 lg:gap-20 items-start lg:items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="w-full"
            >
              <h2 className="text-3xl lg:text-5xl font-black text-brand-black mb-8 lg:mb-12 tracking-tight text-left">How GigsConnect Works</h2>
              <div className="space-y-8 lg:space-y-12">
                {steps.map((step, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.2 }}
                    className="flex gap-4 lg:gap-6"
                  >
                    <div className="w-12 h-12 lg:w-16 lg:h-16 rounded-xl lg:rounded-2xl bg-brand-purple text-white flex-shrink-0 flex items-center justify-center shadow-glow">
                      {React.cloneElement(step.icon as React.ReactElement, { className: "w-6 h-6 lg:w-8 lg:h-8" })}
                    </div>
                    <div>
                      <h3 className="text-lg lg:text-xl font-black text-brand-black mb-1 lg:mb-2">{step.title}</h3>
                      <p className="text-sm lg:text-base text-brand-gray-dark leading-relaxed">{step.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative w-full mt-12 lg:mt-0"
            >
              <div className="relative z-10 rounded-[2rem] lg:rounded-[3rem] overflow-hidden shadow-premium border-4 lg:border-8 border-brand-gray">
                <img 
                  src="https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&q=80&w=800" 
                  alt="Collaboration" 
                  className="w-full h-[300px] lg:h-[600px] object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-black/60 to-transparent flex items-end p-6 lg:p-12">
                  <div className="glass p-6 lg:p-8 rounded-2xl lg:rounded-3xl w-full">
                    <p className="text-white text-xl lg:text-2xl font-black mb-1 lg:mb-2">Ready to start?</p>
                    <p className="text-white/80 text-sm lg:text-base mb-4 lg:mb-6">Join thousands of creatives already growing on GigsConnect.</p>
                    <Link to="/signup" className="inline-flex items-center gap-2 text-brand-purple font-bold bg-white px-5 py-2.5 lg:px-6 lg:py-3 rounded-xl hover:bg-brand-purple hover:text-white transition-all text-sm lg:text-base">
                      Get Started <ArrowRight className="w-4 h-4 lg:w-5 lg:h-5" />
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 lg:py-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-5">
          <div className="text-left lg:text-center mb-12 lg:mb-16">
            <h2 className="text-3xl lg:text-5xl font-black text-brand-black mb-4 tracking-tight">Community Love</h2>
            <p className="text-base lg:text-lg text-brand-gray-dark">Hear from the people who make this community great.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {testimonials.map((t, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="glass-card p-10 rounded-[3rem] shadow-soft hover:shadow-premium transition-all border border-white/40"
              >
                <div className="flex gap-1 mb-6">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-xl text-brand-black font-medium mb-10 leading-relaxed italic">"{t.quote}"</p>
                <div className="flex items-center gap-4">
                  <img src={t.avatar} className="w-14 h-14 rounded-2xl object-cover shadow-sm" alt={t.name} />
                  <div>
                    <h4 className="font-black text-brand-black">{t.name}</h4>
                    <p className="text-sm text-brand-gray-dark font-bold uppercase tracking-widest">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 lg:py-24 px-5">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-5xl mx-auto rounded-[2rem] lg:rounded-[3rem] gradient-premium p-8 lg:p-24 text-left lg:text-center text-white relative overflow-hidden shadow-premium"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-black/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
          
          <div className="relative z-10">
            <h2 className="text-3xl lg:text-6xl font-black mb-6 lg:mb-8 tracking-tight leading-tight">
              Ready to take your music career to the next level?
            </h2>
            <p className="text-base lg:text-xl text-brand-purple-light mb-8 lg:mb-12 w-full lg:max-w-2xl lg:mx-auto">
              Join GigsConnect today and start connecting with the best music talent in Africa.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-start lg:justify-center">
              <Link to="/signup" className="w-full sm:w-auto px-8 py-4 lg:px-10 lg:py-5 rounded-2xl bg-white text-brand-purple font-black hover:bg-brand-gray hover:scale-105 active:scale-95 transition-all text-lg lg:text-xl shadow-xl text-left sm:text-center">
                Join for Free
              </Link>
              <Link to={isLoggedIn ? "/browse" : "/login"} className="w-full sm:w-auto px-8 py-4 lg:px-10 lg:py-5 rounded-2xl bg-white/10 text-white font-black border border-white/20 hover:bg-white/20 active:scale-95 transition-all text-lg lg:text-xl backdrop-blur-sm text-left sm:text-center">
                Explore Gigs
              </Link>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-16 lg:py-20 bg-brand-black text-white">
        <div className="max-w-7xl mx-auto px-5">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16 mb-16 lg:mb-20">
            <div>
              <Link to="/" className="text-2xl font-black tracking-tighter mb-8 flex items-center gap-2">
                <Logo iconClassName="w-10 h-10" />
                GigsConnect
              </Link>
              <p className="text-gray-400 leading-relaxed mb-8">
                The leading community platform for music professionals in Africa. Connect, collaborate, and grow.
              </p>
              <div className="flex gap-4">
                <button className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-brand-purple transition-all"><Share2 className="w-5 h-5" /></button>
                <button className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-brand-purple transition-all"><Heart className="w-5 h-5" /></button>
              </div>
            </div>

            <div>
              <h4 className="font-black uppercase tracking-widest text-xs mb-8 text-brand-purple">Platform</h4>
              <ul className="space-y-4">
                <li><Link to={isLoggedIn ? "/browse" : "/login"} className="text-gray-400 hover:text-white transition-colors">Browse Gigs</Link></li>
                <li><Link to={isLoggedIn ? "/browse" : "/login"} className="text-gray-400 hover:text-white transition-colors">Find Talent</Link></li>
                <li><Link to={isLoggedIn ? "/post" : "/login"} className="text-gray-400 hover:text-white transition-colors">Post a Gig</Link></li>
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
                <input type="email" placeholder="Email address" className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-brand-purple w-full" />
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
    </div>
  );
};

export default Landing;
