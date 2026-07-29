import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, Star, Play, Quote, TrendingUp, Users, 
  Briefcase, Globe, CheckCircle, ChevronRight, ChevronLeft
} from 'lucide-react';

// --- Interfaces for Future DB Integration ---
interface StoryStat {
  label: string;
  value: string;
}

interface SuccessStory {
  id: string;
  creator_name: string;
  creator_photo: string;
  profession: string;
  country: string;
  headline: string;
  story: string;
  quote?: string;
  statistics?: StoryStat[];
  featured?: boolean;
  created_at?: string;
  category: string;
  verified_creator?: boolean;
}

interface Testimonial {
  id: string;
  name: string;
  role: string;
  country: string;
  photo: string;
  rating: number;
  text: string;
}

interface VideoStory {
  id: string;
  creator_name: string;
  headline: string;
  duration: string;
  thumbnail: string;
}

// --- Dummy Data ---
const FEATURED_STORY: SuccessStory = {
  id: 'fs-1',
  creator_name: 'Amara Osei',
  creator_photo: 'https://images.unsplash.com/photo-1531123897727-8f129e1bf98c?auto=format&fit=crop&q=80&w=400',
  profession: 'UI/UX Designer',
  country: 'Ghana',
  headline: 'From Local Freelancer to Pan-African Agency Owner',
  category: 'UI/UX Designer',
  verified_creator: true,
  story: 'When I joined GigsConnect, I was struggling to find consistent clients in Accra. The platform gave me a professional space to showcase my interactive prototypes. Within three months, I landed a major contract with a fintech startup in Lagos. That one opportunity snowballed into building my own remote design agency employing four other African creators.',
  quote: "GigsConnect didn't just give me jobs; it gave me the visibility to build a business. It's the bridge African creators have been waiting for.",
  statistics: [
    { label: 'Projects Completed', value: '45+' },
    { label: 'Collaborations', value: '12' },
    { label: 'Revenue Growth', value: '300%' },
  ]
};

const STORIES: SuccessStory[] = [
  {
    id: 'st-1',
    creator_name: 'David Njuguna',
    creator_photo: 'https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?auto=format&fit=crop&q=80&w=200',
    profession: 'Graphic Designer',
    country: 'Kenya',
    headline: 'Designing for Global Brands from Nairobi',
    category: 'Graphic Designer',
    story: 'The verification badge on GigsConnect completely changed how clients perceived me. I went from doing small local flyers to designing full brand identities for tech startups across the continent.'
  },
  {
    id: 'st-2',
    creator_name: 'Chidi Eze',
    creator_photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    profession: 'Software Developer',
    country: 'Nigeria',
    headline: 'Finding the Right Technical Co-founders',
    category: 'Developer',
    story: 'I had the idea, but needed a designer and a marketer. I found both on GigsConnect. We collaborated seamlessly and launched our SaaS product within six months.'
  },
  {
    id: 'st-3',
    creator_name: 'Sarah Kariuki',
    creator_photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
    profession: 'Content Creator',
    country: 'Kenya',
    headline: 'Monetizing My Passion for Storytelling',
    category: 'Content Creator',
    story: 'Before GigsConnect, I struggled to price my content services. The platform\'s transparent marketplace helped me understand my value and connect with brands that respect my creative process.'
  },
  {
    id: 'st-4',
    creator_name: 'Thabo Mokoena',
    creator_photo: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=200',
    profession: 'Videographer',
    country: 'South Africa',
    headline: 'Scaling Video Production Across Borders',
    category: 'Videographer',
    story: 'GigsConnect allowed me to build a network of drone operators and editors across Southern Africa. We now handle regional campaigns for major lifestyle brands.'
  },
  {
    id: 'st-5',
    creator_name: 'Aisha Bello',
    creator_photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    profession: 'Digital Marketer',
    country: 'Nigeria',
    headline: 'From Freelance Marketer to Growth Consultant',
    category: 'Digital Marketer',
    story: 'The community aspect of GigsConnect is unmatched. Sharing my insights on the feed led to three long-term retainer contracts with emerging e-commerce brands.'
  },
  {
    id: 'st-6',
    creator_name: 'Kwame Mensah',
    creator_photo: 'https://images.unsplash.com/photo-1522529599102-193c0d76b5b6?auto=format&fit=crop&q=80&w=200',
    profession: 'Music Producer',
    country: 'Ghana',
    headline: 'Scoring Global Commercials',
    category: 'Music Producer',
    story: 'I uploaded my beat portfolio just to see what would happen. A creative agency in London found me through the platform and hired me to score their pan-African ad campaign.'
  }
];

const METRICS = [
  { label: 'Creators Joined', value: '50k+', icon: Users },
  { label: 'Collaborations Created', value: '120k+', icon: Briefcase },
  { label: 'Projects Posted', value: '200k+', icon: TrendingUp },
  { label: 'Countries Reached', value: '45+', icon: Globe },
];

const TESTIMONIALS: Testimonial[] = [
  { id: 't-1', name: 'Fatima Diallo', role: 'Fashion Designer', country: 'Senegal', rating: 5, text: 'GigsConnect completely transformed how I source fabric suppliers and market my designs. It is a game-changer.', photo: 'https://images.unsplash.com/photo-1574701148212-8518049c7b2c?auto=format&fit=crop&q=80&w=150' },
  { id: 't-2', name: 'Samuel Osei', role: 'Animator', country: 'Ghana', rating: 5, text: 'The ease of finding reliable voice-over artists for my animations has saved me countless hours. Highly recommended.', photo: 'https://images.unsplash.com/photo-1519058082700-08a0b56da9b4?auto=format&fit=crop&q=80&w=150' },
  { id: 't-3', name: 'Nneka Eze', role: 'Writer', country: 'Nigeria', rating: 5, text: 'I love the community feel. It is not just about gigs; it is about learning and growing with fellow African creatives.', photo: 'https://images.unsplash.com/photo-1589156280159-27698a70f29e?auto=format&fit=crop&q=80&w=150' },
];

const VIDEOS: VideoStory[] = [
  { id: 'v-1', creator_name: 'The Creative Agency', headline: 'Scaling a remote African team', duration: '4:15', thumbnail: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=600' },
  { id: 'v-2', creator_name: 'Grace Mutuku', headline: 'My journey to full-time freelancing', duration: '3:45', thumbnail: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=600' },
  { id: 'v-3', creator_name: 'Tunde & Co', headline: 'Finding the perfect co-founder', duration: '5:20', thumbnail: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=600' },
];

// --- Reusable Components ---
const StoryCard: React.FC<{ story: SuccessStory }> = ({ story }) => {
  return (
    <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.02)] hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col h-full group">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
          <img src={story.creator_photo} alt={story.creator_name} className="w-full h-full object-cover" />
        </div>
        <div>
          <h3 className="font-bold text-[#111827] text-lg flex items-center gap-2">
            {story.creator_name}
            {story.verified_creator && <CheckCircle className="w-4 h-4 text-[#4B0082]" />}
          </h3>
          <p className="text-gray-500 text-sm">{story.profession} • {story.country}</p>
        </div>
      </div>
      <div className="mb-4">
        <span className="inline-block px-3 py-1 rounded-full bg-[#4B0082]/5 text-[#4B0082] text-xs font-semibold uppercase tracking-wider mb-3">
          {story.category}
        </span>
        <h4 className="text-xl font-bold text-[#111827] mb-3 group-hover:text-[#4B0082] transition-colors line-clamp-2">
          "{story.headline}"
        </h4>
      </div>
      <p className="text-gray-600 leading-relaxed text-sm flex-grow line-clamp-4">
        {story.story}
      </p>
      <div className="mt-6 pt-6 border-t border-gray-100">
        <button className="text-[#4B0082] font-semibold flex items-center gap-2 hover:gap-3 transition-all text-sm">
          Read Full Story <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

// --- Main Page Component ---
const SuccessStories: React.FC = () => {
  const accentColor = '#6C2BFF'; // Premium branding accent
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-full bg-gray-50 flex flex-col font-sans min-h-screen">
      
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
              <Star className="w-4 h-4 fill-current" /> Success Stories
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-[#111827] tracking-tight mb-8">
            Inspiration from Africa's <br className="hidden md:block" />
            <span style={{ color: accentColor }}>Leading Creators.</span>
          </h1>
          <p className="text-xl md:text-2xl font-medium text-gray-600 max-w-3xl mx-auto leading-relaxed mb-12">
            Discover how creators across Africa are using GigsConnect to grow their careers, connect with opportunities, and collaborate with others.
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
              Start Your Journey
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 w-full max-w-[1200px] mx-auto px-4 sm:px-6 md:px-8 py-20 space-y-32">
        
        {/* Featured Story */}
        <div>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#111827] mb-4">Featured Story</h2>
            <div className="w-16 h-1 rounded-full mx-auto" style={{ backgroundColor: accentColor }}></div>
          </div>
          
          <div className="bg-white rounded-[2rem] border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden flex flex-col lg:flex-row">
            <div className="lg:w-2/5 h-64 lg:h-auto bg-gray-200 relative">
              <img src={FEATURED_STORY.creator_photo} alt={FEATURED_STORY.creator_name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8">
                <div className="text-white">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-2xl font-bold">{FEATURED_STORY.creator_name}</h3>
                    {FEATURED_STORY.verified_creator && <CheckCircle className="w-5 h-5 text-white" />}
                  </div>
                  <p className="text-white/80 font-medium">{FEATURED_STORY.profession} • {FEATURED_STORY.country}</p>
                </div>
              </div>
            </div>
            <div className="lg:w-3/5 p-8 md:p-12 flex flex-col justify-center relative">
              <Quote className="absolute top-8 right-8 w-24 h-24 text-gray-50 opacity-50 pointer-events-none" />
              
              <span className="inline-block px-3 py-1 rounded-full bg-[#4B0082]/5 text-[#4B0082] text-xs font-bold uppercase tracking-wider mb-6 w-max">
                {FEATURED_STORY.category}
              </span>
              
              <h3 className="text-3xl md:text-4xl font-bold text-[#111827] mb-6 tracking-tight">
                {FEATURED_STORY.headline}
              </h3>
              
              <p className="text-gray-600 text-lg leading-relaxed mb-8">
                {FEATURED_STORY.story}
              </p>
              
              <div className="bg-[#4B0082]/5 p-6 rounded-2xl border border-[#4B0082]/10 mb-8">
                <p className="text-[#111827] font-medium italic text-lg leading-relaxed">
                  "{FEATURED_STORY.quote}"
                </p>
              </div>

              <div className="grid grid-cols-3 gap-4 border-t border-gray-100 pt-8">
                {FEATURED_STORY.statistics?.map((stat, idx) => (
                  <div key={idx}>
                    <div className="text-2xl font-black text-[#111827] mb-1">{stat.value}</div>
                    <div className="text-gray-500 text-xs font-semibold uppercase tracking-wider">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Success Stories Grid */}
        <div>
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-[#111827] mb-4">More Success Stories</h2>
            <div className="w-16 h-1 rounded-full mx-auto" style={{ backgroundColor: accentColor }}></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {STORIES.map(story => (
              <StoryCard key={story.id} story={story} />
            ))}
          </div>
          <div className="text-center mt-12">
             <button className="inline-flex items-center justify-center h-12 px-8 rounded-xl bg-white text-[#111827] font-semibold border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all">
               Load More Stories
             </button>
          </div>
        </div>

        {/* Success Metrics */}
        <div className="bg-[#111827] rounded-[2.5rem] p-12 md:p-20 relative overflow-hidden">
          <div 
            className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-[100px] pointer-events-none -translate-y-1/2 translate-x-1/3 opacity-20"
            style={{ backgroundColor: accentColor }}
          ></div>
          <div className="relative z-10 text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">The GigsConnect Impact</h2>
            <p className="text-gray-400 text-lg">Building the largest creative ecosystem in Africa.</p>
          </div>
          <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 text-center">
            {METRICS.map((metric, idx) => (
              <div key={idx}>
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white/10 text-white mb-6">
                  <metric.icon className="w-7 h-7" />
                </div>
                <div className="text-4xl md:text-5xl font-black text-white mb-3" style={{ color: accentColor }}>{metric.value}</div>
                <div className="text-gray-400 font-medium text-sm md:text-base uppercase tracking-wider">{metric.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Video Success Stories */}
        <div>
          <div className="text-center mb-16 flex flex-col items-center">
            <h2 className="text-3xl font-bold text-[#111827] mb-4">Video Stories</h2>
            <div className="w-16 h-1 rounded-full mx-auto mb-6" style={{ backgroundColor: accentColor }}></div>
            <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-bold uppercase tracking-wider">
              Coming Soon
            </span>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {VIDEOS.map(video => (
              <div key={video.id} className="group cursor-not-allowed">
                <div className="relative rounded-2xl overflow-hidden bg-gray-900 aspect-video mb-4">
                  <img src={video.thumbnail} alt={video.headline} className="w-full h-full object-cover opacity-60 grayscale group-hover:grayscale-0 group-hover:opacity-80 transition-all duration-500" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 group-hover:scale-110 transition-transform">
                      <Play className="w-6 h-6 text-white ml-1 fill-current" />
                    </div>
                  </div>
                  <div className="absolute bottom-4 right-4 px-2 py-1 bg-black/70 text-white text-xs font-bold rounded">
                    {video.duration}
                  </div>
                </div>
                <h4 className="text-lg font-bold text-[#111827] mb-1">{video.headline}</h4>
                <p className="text-gray-500 text-sm">{video.creator_name}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonials */}
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-[#111827] mb-4">Community Love</h2>
            <div className="w-16 h-1 rounded-full mx-auto" style={{ backgroundColor: accentColor }}></div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map(t => (
              <div key={t.id} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-[0_4px_15px_rgb(0,0,0,0.02)] flex flex-col">
                <div className="flex gap-1 mb-6">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-[#111827] font-medium leading-relaxed mb-8 flex-grow">
                  "{t.text}"
                </p>
                <div className="flex items-center gap-3">
                  <img src={t.photo} alt={t.name} className="w-10 h-10 rounded-full object-cover" />
                  <div>
                    <h5 className="font-bold text-sm text-[#111827]">{t.name}</h5>
                    <p className="text-xs text-gray-500">{t.role} • {t.country}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* CTA Section */}
      <div className="bg-white py-32 px-6 border-t border-gray-100">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-black text-[#111827] mb-8 tracking-tight">
            Your Success Story <br className="hidden sm:block"/> Starts Here.
          </h2>
          <p className="text-xl text-gray-500 mb-10 max-w-2xl mx-auto">
            Whether you're looking for your next collaboration, client, or creative opportunity, GigsConnect is built to help you grow.
          </p>
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
              className="inline-flex items-center justify-center h-14 px-10 rounded-xl bg-white text-[#111827] font-bold border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all w-full sm:w-auto shadow-sm"
            >
              Explore Marketplace
            </Link>
          </div>
        </div>
      </div>

    </div>
  );
};

export default SuccessStories;
