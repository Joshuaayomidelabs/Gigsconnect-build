const fs = require('fs');

const code = `import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, ArrowRight, BookOpen, Briefcase, Users, 
  DollarSign, Monitor, TrendingUp, PenTool, Lock, 
  Cpu, Rocket, Play, Download, Clock, Calendar, 
  CheckCircle, ChevronRight, Star
} from 'lucide-react';

// --- Interfaces for Future DB/CMS Integration ---
interface Article {
  id: string;
  title: string;
  slug: string;
  category: string;
  author: {
    name: string;
    photo: string;
  };
  cover_image: string;
  excerpt: string;
  published_at: string;
  reading_time: string;
  featured?: boolean;
}

interface VideoResource {
  id: string;
  title: string;
  category: string;
  instructor: string;
  duration: string;
  thumbnail: string;
}

interface DownloadableResource {
  id: string;
  title: string;
  description: string;
  file_type: string;
  downloads: string;
  available: boolean;
}

interface Creator {
  id: string;
  name: string;
  profession: string;
  country: string;
  bio: string;
  photo: string;
}

// --- Dummy Data ---
const FEATURED_ARTICLE: Article = {
  id: 'a-1',
  title: 'The Ultimate Guide to Pricing Your Creative Services in 2024',
  slug: 'pricing-creative-services-2024',
  category: 'Pricing',
  author: {
    name: 'David Njuguna',
    photo: 'https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?auto=format&fit=crop&q=80&w=150',
  },
  cover_image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=1200',
  excerpt: 'Stop undercharging. Learn the exact frameworks successful African freelancers use to calculate hourly rates, value-based pricing, and monthly retainers without losing clients.',
  published_at: 'Oct 12, 2023',
  reading_time: '8 min read',
  featured: true,
};

const ARTICLES: Article[] = [
  {
    id: 'a-2',
    title: 'Building a Portfolio That Actually Converts Clients',
    slug: 'portfolio-that-converts',
    category: 'Portfolio Building',
    author: { name: 'Amara Osei', photo: 'https://images.unsplash.com/photo-1531123897727-8f129e1bf98c?auto=format&fit=crop&q=80&w=150' },
    cover_image: 'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?auto=format&fit=crop&q=80&w=600',
    excerpt: 'Your portfolio should be more than just pretty pictures. Learn how to structure case studies that prove your business value to potential employers and clients.',
    published_at: 'Oct 05, 2023',
    reading_time: '6 min read',
  },
  {
    id: 'a-3',
    title: 'How to Land International Gigs as an African Creator',
    slug: 'land-international-gigs',
    category: 'Finding Clients',
    author: { name: 'Chidi Eze', photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150' },
    cover_image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=600',
    excerpt: 'Overcoming time zones, payment gateways, and cultural nuances. A practical guide to positioning yourself for global remote opportunities.',
    published_at: 'Sep 28, 2023',
    reading_time: '10 min read',
  },
  {
    id: 'a-4',
    title: 'Navigating Copyright & Licensing for Digital Artists',
    slug: 'copyright-licensing-artists',
    category: 'Copyright & Licensing',
    author: { name: 'Sarah Kariuki', photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150' },
    cover_image: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=600',
    excerpt: 'Protect your creative assets. Understand the difference between exclusive rights, commercial usage, and how to draft protective contracts.',
    published_at: 'Sep 20, 2023',
    reading_time: '7 min read',
  }
];

const CATEGORIES = [
  { name: 'Personal Branding', icon: Star, count: 12 },
  { name: 'Portfolio Building', icon: Briefcase, count: 8 },
  { name: 'Freelancing', icon: Monitor, count: 15 },
  { name: 'Finding Clients', icon: Search, count: 20 },
  { name: 'Networking', icon: Users, count: 10 },
  { name: 'Collaboration', icon: Users, count: 6 },
  { name: 'Pricing Your Services', icon: DollarSign, count: 14 },
  { name: 'Creative Business', icon: TrendingUp, count: 11 },
  { name: 'Marketing Yourself', icon: Rocket, count: 18 },
  { name: 'Copyright & Licensing', icon: Lock, count: 5 },
  { name: 'AI for Creators', icon: Cpu, count: 9 },
  { name: 'Creative Entrepreneurship', icon: BookOpen, count: 7 },
];

const VIDEOS: VideoResource[] = [
  { id: 'v-1', title: 'Mastering the Client Discovery Call', category: 'Freelancing', instructor: 'Amara Osei', duration: '15:20', thumbnail: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&q=80&w=600' },
  { id: 'v-2', title: 'Structuring a Winning Proposal', category: 'Finding Clients', instructor: 'David Njuguna', duration: '22:15', thumbnail: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=600' },
  { id: 'v-3', title: 'Personal Branding on Social Media', category: 'Marketing', instructor: 'Sarah Kariuki', duration: '18:40', thumbnail: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&q=80&w=600' },
];

const DOWNLOADS: DownloadableResource[] = [
  { id: 'd-1', title: 'Portfolio Checklist', description: 'Ensure your portfolio has everything clients are looking for.', file_type: 'PDF', downloads: '1.2k', available: false },
  { id: 'd-2', title: 'Client Proposal Template', description: 'A plug-and-play template to win more freelance gigs.', file_type: 'DOCX', downloads: '3.4k', available: false },
  { id: 'd-3', title: 'Creative Resume Template', description: 'Stand out to recruiters with this ATS-friendly design.', file_type: 'Figma', downloads: '2.8k', available: false },
  { id: 'd-4', title: 'Pricing Guide Calculator', description: 'Calculate your hourly and project rates accurately.', file_type: 'Excel', downloads: '4.1k', available: false },
  { id: 'd-5', title: 'Branding Workbook', description: 'Define your unique creator identity and voice.', file_type: 'PDF', downloads: '950', available: false },
  { id: 'd-6', title: 'Collaboration Agreement', description: 'Legal template for partnering with other creators.', file_type: 'DOCX', downloads: '1.5k', available: false },
];

const TOOLKIT = [
  { title: 'Portfolio Tips', icon: Briefcase, desc: 'Curated advice for showcasing work.' },
  { title: 'Profile Optimization', icon: Star, desc: 'Rank higher in GigsConnect search.' },
  { title: 'Social Media Growth', icon: TrendingUp, desc: 'Strategies to build your audience.' },
  { title: 'Content Planning', icon: Calendar, desc: 'Organize your creative output.' },
  { title: 'Personal Branding', icon: Monitor, desc: 'Establish your unique voice.' },
  { title: 'Creative Productivity', icon: CheckCircle, desc: 'Tools to get more done.' },
];

const FEATURED_CREATORS: Creator[] = [
  { id: 'c-1', name: 'Kwame Mensah', profession: 'Music Producer', country: 'Ghana', bio: 'Grammy-nominated producer working with top African and global talents.', photo: 'https://images.unsplash.com/photo-1522529599102-193c0d76b5b6?auto=format&fit=crop&q=80&w=200' },
  { id: 'c-2', name: 'Aisha Bello', profession: 'Digital Marketer', country: 'Nigeria', bio: 'Helping tech startups scale across the continent through data-driven campaigns.', photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200' },
  { id: 'c-3', name: 'Thabo Mokoena', profession: 'Videographer', country: 'South Africa', bio: 'Directing commercial and documentary films that tell authentic African stories.', photo: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=200' },
];

// --- Reusable Components ---
const ArticleCard: React.FC<{ article: Article }> = ({ article }) => (
  <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.02)] hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col group cursor-pointer">
    <div className="h-48 relative overflow-hidden">
      <img src={article.cover_image} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
      <div className="absolute top-4 left-4">
        <span className="px-3 py-1 bg-white/90 backdrop-blur text-[#111827] text-xs font-bold rounded-full shadow-sm">
          {article.category}
        </span>
      </div>
    </div>
    <div className="p-6 flex flex-col flex-grow">
      <h3 className="text-xl font-bold text-[#111827] mb-3 group-hover:text-[#6C2BFF] transition-colors line-clamp-2">
        {article.title}
      </h3>
      <p className="text-gray-500 text-sm leading-relaxed mb-6 line-clamp-3 flex-grow">
        {article.excerpt}
      </p>
      <div className="flex items-center justify-between border-t border-gray-100 pt-4 mt-auto">
        <div className="flex items-center gap-3">
          <img src={article.author.photo} alt={article.author.name} className="w-8 h-8 rounded-full object-cover" />
          <div className="text-sm">
            <p className="font-semibold text-[#111827]">{article.author.name}</p>
            <p className="text-gray-400 text-xs">{article.published_at}</p>
          </div>
        </div>
        <div className="text-gray-400 flex items-center gap-1 text-xs font-medium">
          <Clock className="w-3 h-3" /> {article.reading_time}
        </div>
      </div>
    </div>
  </div>
);

const CreatorsHub: React.FC = () => {
  const accentColor = '#6C2BFF';
  const [isVisible, setIsVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  const filteredCategories = useMemo(() => {
    if (!searchQuery) return CATEGORIES;
    return CATEGORIES.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [searchQuery]);

  const filteredArticles = useMemo(() => {
    if (!searchQuery) return ARTICLES;
    return ARTICLES.filter(a => 
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      a.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);


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

        <div className={\`max-w-4xl mx-auto text-center relative z-10 transition-all duration-1000 transform \${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}\`}>
          <div className="inline-flex items-center justify-center p-3 px-5 bg-[#4B0082]/5 rounded-full mb-8 border border-[#4B0082]/10">
            <span className="text-[#4B0082] font-bold text-sm tracking-wide uppercase flex items-center gap-2">
              <BookOpen className="w-4 h-4 fill-current" /> Learning Center
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-[#111827] tracking-tight mb-8">
            Creators <span style={{ color: accentColor }}>Hub.</span>
          </h1>
          <p className="text-xl font-medium text-gray-600 max-w-2xl mx-auto leading-relaxed mb-10">
            Learn, grow, and build a thriving creative career with expert resources, practical guides, and industry insights designed for African creators.
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative group mb-10">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="w-6 h-6 text-gray-400 group-focus-within:text-[#6C2BFF] transition-colors" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search articles, guides, tutorials..."
              className="w-full pl-12 pr-6 py-4 rounded-2xl border border-gray-200 bg-white text-lg focus:outline-none focus:ring-4 focus:border-transparent shadow-sm transition-all text-[#111827] placeholder-gray-400"
              style={{ '--tw-ring-color': \`\${accentColor}33\` } as React.CSSProperties}
            />
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              className="inline-flex items-center justify-center h-14 px-8 rounded-xl text-white font-bold transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 gap-2 w-full sm:w-auto"
              style={{ backgroundColor: accentColor }}
              onClick={() => {
                document.getElementById('resources')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Browse Resources
            </button>
            <Link 
              to="/signup"
              className="inline-flex items-center justify-center h-14 px-8 rounded-xl bg-white text-[#111827] font-bold border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all w-full sm:w-auto"
            >
              Join GigsConnect
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div id="resources" className="flex-1 w-full max-w-[1200px] mx-auto px-4 sm:px-6 md:px-8 py-20 space-y-32">
        
        {/* Featured Resource (Hide if searching) */}
        {!searchQuery && (
          <div>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-[#111827] mb-4">Featured Resource</h2>
              <div className="w-16 h-1 rounded-full mx-auto" style={{ backgroundColor: accentColor }}></div>
            </div>
            <div className="bg-white rounded-[2rem] border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden flex flex-col lg:flex-row cursor-pointer group hover:shadow-xl transition-all duration-300">
              <div className="lg:w-1/2 h-64 lg:h-auto overflow-hidden relative">
                <img src={FEATURED_ARTICLE.cover_image} alt={FEATURED_ARTICLE.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute top-6 left-6">
                  <span className="px-4 py-1.5 bg-[#111827]/80 backdrop-blur-md text-white text-xs font-bold rounded-full uppercase tracking-wider">
                    {FEATURED_ARTICLE.category}
                  </span>
                </div>
              </div>
              <div className="lg:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                <div className="flex items-center gap-4 text-sm text-gray-500 font-medium mb-4">
                  <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {FEATURED_ARTICLE.published_at}</span>
                  <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {FEATURED_ARTICLE.reading_time}</span>
                </div>
                <h3 className="text-3xl md:text-4xl font-bold text-[#111827] mb-6 tracking-tight group-hover:text-[#6C2BFF] transition-colors">
                  {FEATURED_ARTICLE.title}
                </h3>
                <p className="text-gray-600 text-lg leading-relaxed mb-8">
                  {FEATURED_ARTICLE.excerpt}
                </p>
                <div className="flex items-center justify-between mt-auto">
                  <div className="flex items-center gap-3">
                    <img src={FEATURED_ARTICLE.author.photo} alt={FEATURED_ARTICLE.author.name} className="w-10 h-10 rounded-full object-cover" />
                    <p className="font-bold text-[#111827]">{FEATURED_ARTICLE.author.name}</p>
                  </div>
                  <button className="text-[#6C2BFF] font-bold flex items-center gap-2 hover:gap-3 transition-all">
                    Read Article <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Resource Categories */}
        <div>
          <div className="text-center mb-12 flex flex-col items-center">
            <h2 className="text-3xl font-bold text-[#111827] mb-4">Explore by Category</h2>
            <div className="w-16 h-1 rounded-full mx-auto" style={{ backgroundColor: accentColor }}></div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {filteredCategories.map((cat, idx) => (
              <div 
                key={idx} 
                className="bg-white p-6 rounded-2xl border border-gray-100 shadow-[0_2px_10px_rgb(0,0,0,0.02)] hover:border-[#6C2BFF]/30 hover:shadow-md hover:-translate-y-1 transition-all duration-300 cursor-pointer group"
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors bg-gray-50 group-hover:bg-[#6C2BFF]/10 text-gray-400 group-hover:text-[#6C2BFF]">
                  <cat.icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-[#111827] mb-1 group-hover:text-[#6C2BFF] transition-colors">{cat.name}</h3>
                <p className="text-gray-400 text-xs font-medium">{cat.count} Articles</p>
              </div>
            ))}
          </div>
          {filteredCategories.length === 0 && (
             <div className="text-center py-12 text-gray-500">No categories found matching your search.</div>
          )}
        </div>

        {/* Latest Articles */}
        <div>
           <div className="flex flex-col sm:flex-row items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold text-[#111827] mb-4">Latest Articles</h2>
              <div className="w-16 h-1 rounded-full" style={{ backgroundColor: accentColor }}></div>
            </div>
            <button className="mt-4 sm:mt-0 text-[#6C2BFF] font-bold flex items-center gap-2 hover:gap-3 transition-all">
              View All <ArrowRight className="w-5 h-5" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredArticles.map(article => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
          {filteredArticles.length === 0 && (
             <div className="text-center py-12 text-gray-500">No articles found matching your search.</div>
          )}
        </div>

        {/* Video Learning */}
        {!searchQuery && (
          <div className="bg-[#111827] rounded-[2.5rem] p-8 md:p-16 relative overflow-hidden">
            <div 
              className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full blur-[100px] pointer-events-none -translate-y-1/2 translate-x-1/3 opacity-20"
              style={{ backgroundColor: accentColor }}
            ></div>
            <div className="flex flex-col sm:flex-row items-center justify-between mb-12 relative z-10">
              <div>
                <h2 className="text-3xl font-bold text-white mb-4">Video Learning</h2>
                <div className="w-16 h-1 rounded-full" style={{ backgroundColor: accentColor }}></div>
              </div>
              <button className="mt-4 sm:mt-0 text-white font-bold flex items-center gap-2 hover:gap-3 transition-all opacity-80 hover:opacity-100">
                View All Videos <ArrowRight className="w-5 h-5" />
              </button>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6 relative z-10">
              {VIDEOS.map(video => (
                <div key={video.id} className="group cursor-pointer">
                  <div className="relative rounded-2xl overflow-hidden bg-gray-900 aspect-video mb-4 shadow-lg">
                    <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover opacity-70 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 group-hover:scale-110 transition-transform shadow-xl">
                        <Play className="w-6 h-6 text-white ml-1 fill-current" />
                      </div>
                    </div>
                    <div className="absolute bottom-4 right-4 px-2 py-1 bg-black/70 text-white text-xs font-bold rounded">
                      {video.duration}
                    </div>
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-black/50 backdrop-blur text-white text-xs font-bold rounded-full">
                        {video.category}
                      </span>
                    </div>
                  </div>
                  <h4 className="text-lg font-bold text-white mb-1 group-hover:text-[#6C2BFF] transition-colors">{video.title}</h4>
                  <p className="text-gray-400 text-sm">Instructor: {video.instructor}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Downloadable Resources */}
        {!searchQuery && (
          <div>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-[#111827] mb-4">Downloadable Resources</h2>
              <div className="w-16 h-1 rounded-full mx-auto mb-6" style={{ backgroundColor: accentColor }}></div>
              <p className="text-gray-500 max-w-2xl mx-auto">Free templates, checklists, and guides to accelerate your creative workflow.</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {DOWNLOADS.map(dl => (
                <div key={dl.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full group">
                  <div className="flex items-start justify-between mb-4">
                    <div className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-bold rounded uppercase tracking-wider">
                      {dl.file_type}
                    </div>
                    {!dl.available && (
                       <span className="text-xs font-bold text-[#6C2BFF] uppercase tracking-wider bg-[#6C2BFF]/10 px-2 py-1 rounded">
                         Coming Soon
                       </span>
                    )}
                  </div>
                  <h4 className="text-lg font-bold text-[#111827] mb-2 group-hover:text-[#6C2BFF] transition-colors">{dl.title}</h4>
                  <p className="text-gray-500 text-sm mb-6 flex-grow">{dl.description}</p>
                  <div className="flex items-center justify-between border-t border-gray-100 pt-4 mt-auto">
                    <span className="text-xs text-gray-400 font-medium">{dl.downloads} Downloads</span>
                    <button 
                      className={\`w-10 h-10 rounded-full flex items-center justify-center transition-colors \${dl.available ? 'bg-gray-100 hover:bg-[#6C2BFF] hover:text-white text-[#111827]' : 'bg-gray-50 text-gray-300 cursor-not-allowed'}\`}
                      disabled={!dl.available}
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Creator Toolkit */}
        {!searchQuery && (
          <div className="bg-white p-10 md:p-16 rounded-[2.5rem] border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-[#111827] mb-4">Creator Toolkit</h2>
              <div className="w-16 h-1 rounded-full mx-auto mb-6" style={{ backgroundColor: accentColor }}></div>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
               {TOOLKIT.map((tool, idx) => (
                 <div key={idx} className="flex gap-4 p-4 rounded-2xl hover:bg-gray-50 transition-colors cursor-pointer group border border-transparent hover:border-gray-100">
                    <div className="w-12 h-12 rounded-xl flex-shrink-0 bg-[#6C2BFF]/5 flex items-center justify-center text-[#6C2BFF] group-hover:scale-110 transition-transform">
                      <tool.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-[#111827] mb-1 group-hover:text-[#6C2BFF] transition-colors">{tool.title}</h4>
                      <p className="text-gray-500 text-sm">{tool.desc}</p>
                    </div>
                 </div>
               ))}
            </div>
          </div>
        )}

        {/* Featured Creators */}
        {!searchQuery && (
           <div>
            <div className="text-center mb-12 flex flex-col items-center">
              <h2 className="text-3xl font-bold text-[#111827] mb-4">Learn from the Best</h2>
              <div className="w-16 h-1 rounded-full mx-auto mb-6" style={{ backgroundColor: accentColor }}></div>
              <p className="text-gray-500 max-w-2xl mx-auto">Explore the profiles and portfolios of top-performing creators on GigsConnect.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {FEATURED_CREATORS.map(creator => (
                <div key={creator.id} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-lg transition-shadow text-center flex flex-col items-center group">
                   <div className="w-24 h-24 rounded-full overflow-hidden mb-6 border-4 border-gray-50 group-hover:border-[#6C2BFF]/20 transition-colors">
                     <img src={creator.photo} alt={creator.name} className="w-full h-full object-cover" />
                   </div>
                   <h3 className="text-xl font-bold text-[#111827] mb-1">{creator.name}</h3>
                   <p className="text-[#6C2BFF] text-sm font-semibold mb-4">{creator.profession} • {creator.country}</p>
                   <p className="text-gray-500 text-sm mb-6 flex-grow">{creator.bio}</p>
                   <button className="w-full h-12 rounded-xl border border-gray-200 text-[#111827] font-semibold hover:border-[#6C2BFF] hover:text-[#6C2BFF] transition-colors">
                     View Profile
                   </button>
                </div>
              ))}
            </div>
           </div>
        )}

        {/* Newsletter & Community CTA */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Newsletter */}
          <div className="bg-white p-10 rounded-3xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <div className="w-12 h-12 rounded-xl bg-[#6C2BFF]/10 text-[#6C2BFF] flex items-center justify-center mb-6">
              <Star className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold text-[#111827] mb-3">Never Miss an Opportunity</h3>
            <p className="text-gray-500 mb-8 leading-relaxed">
              Receive new learning resources, creator insights, and professional tips directly in your inbox.
            </p>
            {subscribed ? (
              <div className="bg-green-50 text-green-700 p-4 rounded-xl flex items-center gap-3 font-medium border border-green-100 animate-in fade-in zoom-in duration-300">
                <CheckCircle className="w-5 h-5" />
                Successfully subscribed to the Hub!
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email" 
                  className="flex-1 h-12 px-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:border-transparent text-[#111827]"
                  style={{ '--tw-ring-color': \`\${accentColor}55\` } as React.CSSProperties}
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
          <div className="bg-[#111827] p-10 rounded-3xl border border-gray-800 shadow-xl relative overflow-hidden group">
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
                Join thousands of African creators building their future through collaboration and opportunity.
              </p>
              <div className="flex gap-3">
                 <Link 
                  to="/community"
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
`
fs.writeFileSync('src/pages/CreatorsHub.tsx', code);
