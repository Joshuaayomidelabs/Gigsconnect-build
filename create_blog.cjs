const fs = require('fs');

const blogCode = `import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, ArrowRight, Bookmark, Share2, MessageCircle, Heart, 
  TrendingUp, Star, Clock, ChevronRight, CheckCircle, Mail, BookOpen
} from 'lucide-react';

// --- Interfaces for Future DB/CMS Integration ---
export interface BlogPostData {
  id: string;
  title: string;
  slug: string;
  cover_image: string;
  excerpt: string;
  content: string;
  author_name: string;
  author_avatar: string;
  category: string;
  tags: string[];
  reading_time: string;
  published_at: string;
  featured?: boolean;
  views: number;
  likes: number;
  comments_count: number;
  status: string;
}

// --- Dummy Data ---
export const BLOG_POSTS: BlogPostData[] = [
  {
    id: 'b-1',
    title: 'GigsConnect Raises $5M Seed Round to Empower African Creators',
    slug: 'gigsconnect-raises-5m-seed',
    cover_image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32d7?auto=format&fit=crop&q=80&w=1200',
    excerpt: 'We are thrilled to announce our latest funding round, aimed at building more tools, expanding across the continent, and bringing global opportunities to local talent.',
    content: '<p>Lorem ipsum...</p>', // Placeholder for content
    author_name: 'Obi Nwosu',
    author_avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
    category: 'Company News',
    tags: ['#Announcements', '#Funding', '#Startup'],
    reading_time: '4 min read',
    published_at: 'Oct 24, 2023',
    featured: true,
    views: 12500,
    likes: 342,
    comments_count: 56,
    status: 'published'
  },
  {
    id: 'b-2',
    title: 'Introducing GigsConnect Portfolios: Showcase Your Best Work',
    slug: 'introducing-gigsconnect-portfolios',
    cover_image: 'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?auto=format&fit=crop&q=80&w=600',
    excerpt: 'Our highly requested feature is finally here. Learn how to set up your interactive portfolio and increase your chances of landing high-paying gigs.',
    content: '<p>Content goes here...</p>',
    author_name: 'Sarah Kariuki',
    author_avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150',
    category: 'Product Updates',
    tags: ['#Product', '#Design', '#Portfolios'],
    reading_time: '6 min read',
    published_at: 'Oct 18, 2023',
    views: 8400,
    likes: 215,
    comments_count: 34,
    status: 'published'
  },
  {
    id: 'b-3',
    title: 'How African Developers are Shaping the Future of Web3',
    slug: 'african-developers-web3',
    cover_image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=600',
    excerpt: 'From Lagos to Nairobi, see how local tech talent is building decentralized applications that solve real-world problems and attract global funding.',
    content: '<p>Content goes here...</p>',
    author_name: 'David Njuguna',
    author_avatar: 'https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?auto=format&fit=crop&q=80&w=150',
    category: 'Industry Insights',
    tags: ['#Web3', '#Technology', '#Development'],
    reading_time: '10 min read',
    published_at: 'Oct 12, 2023',
    views: 15200,
    likes: 489,
    comments_count: 112,
    status: 'published'
  },
  {
    id: 'b-4',
    title: '5 Tips for Negotiating Better Rates as a Freelance Designer',
    slug: 'negotiating-better-rates',
    cover_image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=600',
    excerpt: 'Stop underpricing your services. Learn how to communicate value, handle pushback, and secure the compensation your creative work deserves.',
    content: '<p>Content goes here...</p>',
    author_name: 'Amara Osei',
    author_avatar: 'https://images.unsplash.com/photo-1531123897727-8f129e1bf98c?auto=format&fit=crop&q=80&w=150',
    category: 'Marketplace Tips',
    tags: ['#Freelancing', '#Business', '#Design'],
    reading_time: '7 min read',
    published_at: 'Oct 05, 2023',
    views: 9300,
    likes: 310,
    comments_count: 45,
    status: 'published'
  },
  {
    id: 'b-5',
    title: 'Creator Spotlight: How Aisha Scaled Her Digital Marketing Agency',
    slug: 'creator-spotlight-aisha',
    cover_image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=600',
    excerpt: 'We sit down with Aisha Bello to discuss her journey from solo freelancer on GigsConnect to managing a team of 15 across three countries.',
    content: '<p>Content goes here...</p>',
    author_name: 'GigsConnect Editorial',
    author_avatar: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=150',
    category: 'Creator Stories',
    tags: ['#Interviews', '#Success', '#Marketing'],
    reading_time: '8 min read',
    published_at: 'Sep 28, 2023',
    views: 11400,
    likes: 420,
    comments_count: 67,
    status: 'published'
  },
  {
    id: 'b-6',
    title: 'The Rise of AI Tools: Threat or Opportunity for Writers?',
    slug: 'ai-tools-for-writers',
    cover_image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=600',
    excerpt: 'Exploring how artificial intelligence is changing the copywriting landscape, and how you can leverage these tools to speed up your workflow rather than being replaced.',
    content: '<p>Content goes here...</p>',
    author_name: 'Sarah Kariuki',
    author_avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150',
    category: 'Technology',
    tags: ['#AI', '#Writing', '#FutureOfWork'],
    reading_time: '12 min read',
    published_at: 'Sep 22, 2023',
    views: 18500,
    likes: 650,
    comments_count: 210,
    status: 'published'
  }
];

const CATEGORIES = [
  'All', 'Company News', 'Product Updates', 'Creator Stories', 
  'Marketplace Tips', 'Industry Insights', 'Partnerships', 
  'Events', 'Interviews', 'Success Stories', 'Announcements', 
  'Community', 'Technology'
];

const POPULAR_TAGS = [
  '#Creators', '#Design', '#Photography', '#Music', '#Writing', 
  '#Technology', '#Business', '#Freelancing', '#Branding', 
  '#Networking', '#AI', '#Marketing'
];

// --- Reusable Components ---
const BlogCard: React.FC<{ post: BlogPostData }> = ({ post }) => {
  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.02)] hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col group">
      <Link to={\`/blog/\${post.slug}\`} className="block relative h-56 overflow-hidden">
        <img src={post.cover_image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1.5 bg-white/90 backdrop-blur-md text-[#111827] text-xs font-bold rounded-full shadow-sm">
            {post.category}
          </span>
        </div>
      </Link>
      <div className="p-6 md:p-8 flex flex-col flex-grow">
        <Link to={\`/blog/\${post.slug}\`}>
          <h3 className="text-xl font-bold text-[#111827] mb-3 group-hover:text-[#6C2BFF] transition-colors line-clamp-2">
            {post.title}
          </h3>
        </Link>
        <p className="text-gray-500 text-sm leading-relaxed mb-6 line-clamp-3 flex-grow">
          {post.excerpt}
        </p>
        
        <div className="flex items-center justify-between mb-6">
           <div className="flex items-center gap-3">
            <img src={post.author_avatar} alt={post.author_name} className="w-10 h-10 rounded-full object-cover" />
            <div>
              <p className="font-bold text-sm text-[#111827]">{post.author_name}</p>
              <div className="text-xs text-gray-400 flex items-center gap-2">
                <span>{post.published_at}</span> • 
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {post.reading_time}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-gray-100 pt-5">
           <div className="flex items-center gap-4 text-gray-400">
             <button className="flex items-center gap-1.5 hover:text-[#6C2BFF] transition-colors text-sm font-medium">
               <Heart className="w-4 h-4" /> {post.likes}
             </button>
             <button className="flex items-center gap-1.5 hover:text-[#6C2BFF] transition-colors text-sm font-medium">
               <MessageCircle className="w-4 h-4" /> {post.comments_count}
             </button>
           </div>
           <div className="flex items-center gap-2">
             <button className="w-8 h-8 rounded-full bg-gray-50 text-gray-400 flex items-center justify-center hover:bg-[#6C2BFF]/10 hover:text-[#6C2BFF] transition-colors">
               <Share2 className="w-4 h-4" />
             </button>
             <button className="w-8 h-8 rounded-full bg-gray-50 text-gray-400 flex items-center justify-center hover:bg-[#6C2BFF]/10 hover:text-[#6C2BFF] transition-colors">
               <Bookmark className="w-4 h-4" />
             </button>
           </div>
        </div>
      </div>
    </div>
  );
};

const Blog: React.FC = () => {
  const accentColor = '#6C2BFF';
  const [isVisible, setIsVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const featuredPost = BLOG_POSTS.find(p => p.featured) || BLOG_POSTS[0];
  const trendingPosts = [...BLOG_POSTS].sort((a, b) => b.views - a.views).slice(0, 5);
  const editorsPicks = BLOG_POSTS.slice(1, 4);

  const filteredPosts = useMemo(() => {
    let posts = BLOG_POSTS.filter(p => !p.featured);
    
    if (activeCategory !== 'All') {
      posts = posts.filter(p => p.category === activeCategory);
    }
    
    if (searchQuery) {
      posts = posts.filter(p => 
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        p.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return posts;
  }, [activeCategory, searchQuery]);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  return (
    <div className="w-full bg-[#FAFAFA] flex flex-col font-sans min-h-screen">
      
      {/* Hero Section */}
      <div className="pt-32 pb-24 px-6 md:px-8 bg-white border-b border-gray-100 relative overflow-hidden flex-shrink-0">
        <div 
          className="absolute top-0 left-1/4 w-[800px] h-[800px] rounded-full blur-[120px] pointer-events-none -translate-y-1/2 opacity-10"
          style={{ backgroundColor: accentColor }}
        ></div>

        <div className={\`max-w-4xl mx-auto text-center relative z-10 transition-all duration-1000 transform \${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}\`}>
          <div className="inline-flex items-center justify-center p-3 px-5 bg-[#4B0082]/5 rounded-full mb-8 border border-[#4B0082]/10">
            <span className="text-[#4B0082] font-bold text-sm tracking-wide uppercase flex items-center gap-2">
              <BookOpen className="w-4 h-4 fill-current" /> GigsConnect Blog
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-[#111827] tracking-tight mb-8">
            Stories from Africa's <br className="hidden md:block" />
            <span style={{ color: accentColor }}>Creative Economy.</span>
          </h1>
          <p className="text-xl font-medium text-gray-600 max-w-2xl mx-auto leading-relaxed mb-12">
            Product updates, creator insights, industry trends, and everything happening in the GigsConnect community.
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative group mb-8">
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

          <div className="flex flex-wrap items-center justify-center gap-2 text-sm text-gray-500 font-medium">
            <span>Popular:</span>
            {['#Announcements', '#CreatorStories', '#Tips'].map(tag => (
               <button key={tag} className="hover:text-[#6C2BFF] transition-colors">{tag}</button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 w-full max-w-[1200px] mx-auto px-4 sm:px-6 md:px-8 py-16 space-y-24">
        
        {/* Featured Article */}
        {!searchQuery && activeCategory === 'All' && (
          <div className="relative group cursor-pointer animate-in fade-in slide-in-from-bottom-8 duration-700">
            <Link to={\`/blog/\${featuredPost.slug}\`} className="block">
              <div className="bg-white rounded-[2rem] border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden flex flex-col lg:flex-row hover:shadow-xl transition-all duration-300">
                <div className="lg:w-3/5 h-72 lg:h-[450px] relative overflow-hidden">
                  <img src={featuredPost.cover_image} alt={featuredPost.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute top-6 left-6 flex gap-2">
                    <span className="px-4 py-1.5 bg-[#6C2BFF] text-white text-xs font-bold rounded-full uppercase tracking-wider shadow-lg flex items-center gap-1">
                      <Star className="w-3 h-3 fill-current" /> Featured
                    </span>
                    <span className="px-4 py-1.5 bg-white/90 backdrop-blur-md text-[#111827] text-xs font-bold rounded-full uppercase tracking-wider shadow-sm">
                      {featuredPost.category}
                    </span>
                  </div>
                </div>
                <div className="lg:w-2/5 p-8 md:p-12 flex flex-col justify-center bg-white relative z-10">
                  <div className="flex items-center gap-4 text-sm text-gray-400 font-medium mb-6">
                    <span>{featuredPost.published_at}</span>
                    <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {featuredPost.reading_time}</span>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-black text-[#111827] mb-6 tracking-tight group-hover:text-[#6C2BFF] transition-colors leading-tight">
                    {featuredPost.title}
                  </h2>
                  <p className="text-gray-500 text-lg leading-relaxed mb-8">
                    {featuredPost.excerpt}
                  </p>
                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-center gap-3">
                      <img src={featuredPost.author_avatar} alt={featuredPost.author_name} className="w-12 h-12 rounded-full object-cover border-2 border-gray-50" />
                      <div>
                        <p className="font-bold text-[#111827]">{featuredPost.author_name}</p>
                        <p className="text-xs text-gray-500">Author</p>
                      </div>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-[#6C2BFF] group-hover:text-white transition-colors text-gray-400">
                      <ArrowRight className="w-5 h-5" />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        )}

        {/* Blog Content Layout */}
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Main Column */}
          <div className="lg:w-2/3 space-y-10">
             
             {/* Category Filters */}
             <div className="flex flex-wrap items-center gap-2 pb-6 border-b border-gray-100">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={\`px-4 py-2 rounded-full text-sm font-semibold transition-all \${
                      activeCategory === cat 
                        ? 'bg-[#111827] text-white shadow-md' 
                        : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }\`}
                  >
                    {cat}
                  </button>
                ))}
             </div>

             {/* Articles Grid */}
             <div>
                <h3 className="text-2xl font-bold text-[#111827] mb-8">
                  {searchQuery ? 'Search Results' : (activeCategory === 'All' ? 'Latest Articles' : activeCategory)}
                </h3>
                
                <div className="grid md:grid-cols-2 gap-8">
                  {filteredPosts.map(post => (
                    <BlogCard key={post.id} post={post} />
                  ))}
                </div>

                {filteredPosts.length === 0 && (
                  <div className="text-center py-20 bg-white rounded-3xl border border-gray-100">
                    <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h4 className="text-xl font-bold text-[#111827] mb-2">No articles found</h4>
                    <p className="text-gray-500">Try adjusting your search or selecting a different category.</p>
                  </div>
                )}

                {filteredPosts.length > 0 && (
                  <div className="mt-12 text-center">
                    <button className="inline-flex items-center justify-center h-12 px-8 rounded-xl bg-white text-[#111827] font-bold border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all shadow-sm">
                      Load More Articles
                    </button>
                  </div>
                )}
             </div>

          </div>

          {/* Sidebar */}
          <div className="lg:w-1/3 space-y-12">
            
            {/* Trending Articles */}
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.02)]">
              <h3 className="text-xl font-bold text-[#111827] mb-6 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-[#6C2BFF]" /> Trending Now
              </h3>
              <div className="space-y-6">
                {trendingPosts.map((post, idx) => (
                  <Link to={\`/blog/\${post.slug}\`} key={post.id} className="flex gap-4 group cursor-pointer">
                    <div className="text-4xl font-black text-gray-100 group-hover:text-[#6C2BFF]/20 transition-colors w-8">
                      {idx + 1}
                    </div>
                    <div>
                      <h4 className="font-bold text-[#111827] mb-2 group-hover:text-[#6C2BFF] transition-colors leading-snug line-clamp-2">
                        {post.title}
                      </h4>
                      <p className="text-xs text-gray-400 flex items-center gap-1 font-medium">
                        <Clock className="w-3 h-3" /> {post.reading_time}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Newsletter */}
            <div className="bg-[#111827] p-8 rounded-3xl border border-gray-800 shadow-xl relative overflow-hidden group">
              <div 
                className="absolute top-0 right-0 w-48 h-48 rounded-full blur-[60px] pointer-events-none -translate-y-1/2 translate-x-1/3 opacity-30"
                style={{ backgroundColor: accentColor }}
              ></div>
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-xl bg-white/10 text-white flex items-center justify-center mb-6">
                  <Mail className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">Stay Updated</h3>
                <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                  Get product updates, creator stories, and industry insights delivered directly to your inbox.
                </p>
                {subscribed ? (
                  <div className="bg-green-500/10 text-green-400 p-4 rounded-xl flex items-center gap-3 font-medium text-sm">
                    <CheckCircle className="w-4 h-4" />
                    Subscribed successfully!
                  </div>
                ) : (
                  <form onSubmit={handleSubscribe} className="space-y-3">
                    <input 
                      type="email" 
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Your email address" 
                      className="w-full h-12 px-4 rounded-xl bg-white/5 border border-gray-700 focus:outline-none focus:border-[#6C2BFF] text-white placeholder-gray-500 transition-colors"
                    />
                    <button 
                      type="submit"
                      className="w-full h-12 rounded-xl text-white font-bold transition-all hover:opacity-90"
                      style={{ backgroundColor: accentColor }}
                    >
                      Subscribe
                    </button>
                  </form>
                )}
              </div>
            </div>

            {/* Popular Tags */}
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.02)]">
              <h3 className="text-xl font-bold text-[#111827] mb-6">Popular Tags</h3>
              <div className="flex flex-wrap gap-2">
                {POPULAR_TAGS.map(tag => (
                  <button key={tag} className="px-3 py-1.5 bg-gray-50 text-gray-600 hover:bg-[#6C2BFF]/10 hover:text-[#6C2BFF] transition-colors rounded-lg text-sm font-medium">
                    {tag}
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Editor's Picks Carousel */}
        {!searchQuery && activeCategory === 'All' && (
          <div className="py-12 border-t border-gray-200">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-[#111827]">Editor's Picks</h2>
              <div className="flex gap-2">
                <button className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:text-[#6C2BFF] hover:border-[#6C2BFF] transition-all">
                   <ChevronRight className="w-5 h-5 rotate-180" />
                </button>
                <button className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:text-[#6C2BFF] hover:border-[#6C2BFF] transition-all">
                   <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
               {editorsPicks.map(post => (
                 <Link to={\`/blog/\${post.slug}\`} key={post.id} className="group cursor-pointer">
                   <div className="rounded-2xl overflow-hidden mb-4 relative aspect-[4/3]">
                     <img src={post.cover_image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                     <div className="absolute top-3 left-3">
                       <span className="px-3 py-1 bg-white/90 backdrop-blur text-[#111827] text-[10px] font-bold rounded-full uppercase">
                         {post.category}
                       </span>
                     </div>
                   </div>
                   <h4 className="font-bold text-[#111827] text-lg mb-2 group-hover:text-[#6C2BFF] transition-colors line-clamp-2">
                     {post.title}
                   </h4>
                   <p className="text-gray-500 text-sm font-medium">{post.author_name}</p>
                 </Link>
               ))}
            </div>
          </div>
        )}

      </div>

      {/* Community CTA Section */}
      <div className="bg-white py-32 px-6 border-t border-gray-100 mt-12">
        <div className="max-w-3xl mx-auto text-center">
          <div className="w-16 h-16 rounded-2xl bg-[#6C2BFF]/10 text-[#6C2BFF] flex items-center justify-center mx-auto mb-8">
            <MessageCircle className="w-8 h-8" />
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-[#111827] mb-6 tracking-tight">
            Have a Story Worth Sharing?
          </h2>
          <p className="text-xl text-gray-500 mb-10 leading-relaxed">
            Share your creative journey, insights, and experiences with the GigsConnect community to inspire creators across Africa.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              className="inline-flex items-center justify-center h-14 px-10 rounded-xl text-white font-bold transition-all shadow-xl hover:shadow-2xl hover:-translate-y-0.5 gap-2 w-full sm:w-auto"
              style={{ backgroundColor: accentColor }}
            >
              Submit Your Story <ArrowRight className="w-5 h-5" />
            </button>
            <Link 
              to="/community"
              className="inline-flex items-center justify-center h-14 px-10 rounded-xl bg-white text-[#111827] font-bold border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all w-full sm:w-auto shadow-sm"
            >
              Join Community
            </Link>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Blog;
`

fs.writeFileSync('src/pages/Blog.tsx', blogCode);

const blogPostCode = `import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Share2, Bookmark, Heart, MessageCircle, 
  Clock, Calendar, Check, Facebook, Twitter, Linkedin, Link2
} from 'lucide-react';
import { BLOG_POSTS } from './Blog'; // Import dummy data

const BlogPost: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState(BLOG_POSTS.find(p => p.slug === slug));
  const [isCopied, setIsCopied] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);

  useEffect(() => {
    // In a real app, fetch the post from Supabase/CMS here
    const foundPost = BLOG_POSTS.find(p => p.slug === slug);
    if (foundPost) {
      setPost(foundPost);
    } else {
      // Handle 404 or redirect
      navigate('/blog');
    }
    window.scrollTo(0, 0);
  }, [slug, navigate]);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollTop;
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scroll = \`\${totalScroll / windowHeight}\`;
      setReadingProgress(Number(scroll) * 100);
    }
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!post) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="w-full bg-white font-sans min-h-screen relative pt-20">
      {/* Reading Progress Bar */}
      <div 
        className="fixed top-20 left-0 h-1 bg-[#6C2BFF] z-50 transition-all duration-75"
        style={{ width: \`\${readingProgress}%\` }}
      />

      {/* Hero Section */}
      <div className="max-w-[1000px] mx-auto px-6 py-12">
        <Link to="/blog" className="inline-flex items-center gap-2 text-gray-500 hover:text-[#6C2BFF] transition-colors font-medium text-sm mb-8">
          <ArrowLeft className="w-4 h-4" /> Back to Blog
        </Link>
        
        <div className="mb-8">
          <span className="px-3 py-1.5 bg-[#6C2BFF]/10 text-[#6C2BFF] text-xs font-bold rounded-full uppercase tracking-wider mb-6 inline-block">
            {post.category}
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-[#111827] leading-tight mb-8 tracking-tight">
            {post.title}
          </h1>
          
          <div className="flex flex-wrap items-center justify-between gap-6 pb-8 border-b border-gray-100">
            <div className="flex items-center gap-4">
              <img src={post.author_avatar} alt={post.author_name} className="w-14 h-14 rounded-full object-cover border-2 border-gray-50" />
              <div>
                <p className="font-bold text-[#111827] text-lg">{post.author_name}</p>
                <div className="flex items-center gap-3 text-sm text-gray-500">
                  <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {post.published_at}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {post.reading_time}</span>
                </div>
              </div>
            </div>
            
            {/* Share & Actions (Desktop) */}
            <div className="hidden sm:flex items-center gap-3">
              <button className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:text-[#6C2BFF] hover:border-[#6C2BFF] transition-all bg-white shadow-sm">
                <Bookmark className="w-4 h-4" />
              </button>
              <button onClick={handleCopyLink} className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:text-[#6C2BFF] hover:border-[#6C2BFF] transition-all bg-white shadow-sm">
                {isCopied ? <Check className="w-4 h-4 text-green-500" /> : <Link2 className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Cover Image */}
      <div className="w-full max-w-[1200px] mx-auto px-4 md:px-6 mb-16">
        <div className="rounded-3xl overflow-hidden aspect-[21/9] bg-gray-100 shadow-lg">
          <img src={post.cover_image} alt={post.title} className="w-full h-full object-cover" />
        </div>
      </div>

      {/* Article Body & Sidebar */}
      <div className="max-w-[1200px] mx-auto px-6 pb-24 flex flex-col lg:flex-row gap-16 relative">
        
        {/* Left Sticky Sidebar (Share & Stats) */}
        <div className="hidden lg:block w-16 flex-shrink-0">
          <div className="sticky top-32 flex flex-col items-center gap-6">
            <div className="flex flex-col items-center gap-2">
              <button className="w-12 h-12 rounded-full border border-gray-100 bg-gray-50 flex items-center justify-center text-gray-500 hover:text-red-500 hover:bg-red-50 transition-all">
                <Heart className="w-5 h-5" />
              </button>
              <span className="text-xs font-bold text-gray-500">{post.likes}</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <button className="w-12 h-12 rounded-full border border-gray-100 bg-gray-50 flex items-center justify-center text-gray-500 hover:text-blue-500 hover:bg-blue-50 transition-all">
                <MessageCircle className="w-5 h-5" />
              </button>
              <span className="text-xs font-bold text-gray-500">{post.comments_count}</span>
            </div>
            <div className="w-8 h-[1px] bg-gray-200 my-2"></div>
            <button className="w-10 h-10 rounded-full flex items-center justify-center text-gray-400 hover:text-[#1877F2] transition-colors">
              <Facebook className="w-5 h-5" />
            </button>
            <button className="w-10 h-10 rounded-full flex items-center justify-center text-gray-400 hover:text-[#1DA1F2] transition-colors">
              <Twitter className="w-5 h-5" />
            </button>
            <button className="w-10 h-10 rounded-full flex items-center justify-center text-gray-400 hover:text-[#0A66C2] transition-colors">
              <Linkedin className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 max-w-[800px]">
          <div className="prose prose-lg prose-indigo max-w-none prose-headings:font-bold prose-headings:text-[#111827] prose-p:text-gray-600 prose-p:leading-relaxed prose-a:text-[#6C2BFF] prose-img:rounded-2xl">
            {/* 
               In a real implementation with a CMS, this would be rendered using a Markdown parser 
               or a rich text renderer like dangerouslySetInnerHTML for HTML content.
               For this mockup, we'll simulate a rich article body.
            */}
            <p className="lead text-xl text-gray-700 font-medium mb-8">
              {post.excerpt}
            </p>
            
            <h2>The Changing Landscape</h2>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </p>
            
            <blockquote>
              "The creative economy in Africa is not just emerging; it is accelerating at a pace that demands attention, innovation, and dedicated platforms."
            </blockquote>
            
            <p>
              Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            </p>

            <h3>Key Takeaways for Creators</h3>
            <ul>
              <li><strong>Focus on value:</strong> Clients are looking for measurable outcomes, not just deliverables.</li>
              <li><strong>Build a network:</strong> Collaboration is the new currency in the digital age.</li>
              <li><strong>Stay adaptable:</strong> Tools and trends change, but fundamental storytelling remains constant.</li>
            </ul>

            <p>
              Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
            </p>
          </div>

          {/* Tags */}
          <div className="mt-12 pt-8 border-t border-gray-100">
            <h4 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wider">Related Tags</h4>
            <div className="flex flex-wrap gap-2">
              {post.tags.map(tag => (
                <button key={tag} className="px-4 py-2 bg-gray-50 text-gray-600 hover:bg-[#6C2BFF]/10 hover:text-[#6C2BFF] transition-colors rounded-full text-sm font-medium">
                  {tag}
                </button>
              ))}
            </div>
          </div>
          
          {/* Author Bio Box */}
          <div className="mt-12 bg-gray-50 rounded-3xl p-8 flex flex-col sm:flex-row gap-6 items-center sm:items-start border border-gray-100">
            <img src={post.author_avatar} alt={post.author_name} className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md" />
            <div className="text-center sm:text-left">
              <h4 className="text-xl font-bold text-[#111827] mb-2">{post.author_name}</h4>
              <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                Senior Editor at GigsConnect. Passionate about uncovering the stories of African creators and exploring the intersection of technology and art.
              </p>
              <button className="text-[#6C2BFF] font-bold text-sm hover:underline">View all posts by {post.author_name}</button>
            </div>
          </div>

        </div>

        {/* Right Sidebar (Table of Contents / Ads / Related) */}
        <div className="hidden lg:block w-72 flex-shrink-0">
          <div className="sticky top-32">
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
              <h4 className="font-bold text-[#111827] mb-4 uppercase tracking-wider text-sm">Table of Contents</h4>
              <ul className="space-y-3 text-sm text-gray-600">
                <li><a href="#" className="hover:text-[#6C2BFF] transition-colors">The Changing Landscape</a></li>
                <li><a href="#" className="hover:text-[#6C2BFF] transition-colors">Key Takeaways for Creators</a></li>
                <li><a href="#" className="hover:text-[#6C2BFF] transition-colors pl-4">Focus on value</a></li>
                <li><a href="#" className="hover:text-[#6C2BFF] transition-colors pl-4">Build a network</a></li>
                <li><a href="#" className="hover:text-[#6C2BFF] transition-colors">Conclusion</a></li>
              </ul>
            </div>
          </div>
        </div>

      </div>

      {/* Mobile Sticky Actions */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 flex justify-between items-center z-50 px-6 safe-area-pb">
        <div className="flex gap-4">
          <button className="flex items-center gap-1 text-gray-500">
            <Heart className="w-6 h-6" /> <span className="font-medium">{post.likes}</span>
          </button>
          <button className="flex items-center gap-1 text-gray-500">
            <MessageCircle className="w-6 h-6" /> <span className="font-medium">{post.comments_count}</span>
          </button>
        </div>
        <div className="flex gap-4">
          <button className="text-gray-500"><Bookmark className="w-6 h-6" /></button>
          <button className="text-gray-500" onClick={handleCopyLink}><Share2 className="w-6 h-6" /></button>
        </div>
      </div>
    </div>
  );
};

export default BlogPost;
`

fs.writeFileSync('src/pages/BlogPost.tsx', blogPostCode);
