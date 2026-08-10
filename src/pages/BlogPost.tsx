import React, { useEffect, useState } from 'react';
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
      const scroll = `${totalScroll / windowHeight}`;
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
        style={{ width: `${readingProgress}%` }}
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
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          </div>
        
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
