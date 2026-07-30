import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, ChevronDown, ArrowUp, HelpCircle, 
  Rocket, UserCircle, Briefcase, PlusCircle, ShieldCheck, Lock, 
  Mail, Globe, ArrowRight, MessageSquare 
} from 'lucide-react';

const CATEGORIES = [
  'ACCOUNT',
  'PROFILE',
  'COMMUNITY',
  'MARKETPLACE',
  'VERIFICATION',
  'SUBSCRIPTIONS',
  'PAYMENTS',
  'TECHNICAL'
];

const FAQS = [
  // ACCOUNT
  { id: 'acc-1', category: 'ACCOUNT', question: 'How do I create an account?', answer: 'To create an account, click the "Sign Up" button in the top right corner. You can register using your email address, Google, or other supported social logins. Follow the on-screen instructions to complete your profile setup.' },
  { id: 'acc-2', category: 'ACCOUNT', question: 'How do I reset my password?', answer: 'If you forgot your password, go to the login page and click "Forgot Password?". Enter your registered email address, and we\'ll send you a link to securely reset your password.' },
  { id: 'acc-3', category: 'ACCOUNT', question: 'How do I change my email?', answer: 'You can change your email address by navigating to Settings > Account Settings. Enter your new email and verify it through the confirmation link sent to your new inbox.' },
  { id: 'acc-4', category: 'ACCOUNT', question: 'Can I delete my account?', answer: 'Yes, you can permanently delete your account from Settings > Account Settings > Danger Zone. Please note that this action is irreversible and will erase all your data, portfolio items, and messages.' },
  
  // PROFILE
  { id: 'pro-1', category: 'PROFILE', question: 'How do I edit my creator profile?', answer: 'Go to your profile page and click the "Edit Profile" button. From there, you can update your bio, location, professional title, skills, and rates.' },
  { id: 'pro-2', category: 'PROFILE', question: 'How do I upload portfolio images?', answer: 'On your profile page, scroll to the Portfolio section and click "Add New Item". You can upload images, videos, and add descriptions to showcase your best work.' },
  { id: 'pro-3', category: 'PROFILE', question: 'Can I add social media links?', answer: 'Yes. In the Edit Profile section, navigate to "Social Links" where you can connect your Instagram, Twitter, LinkedIn, Behance, and other professional networks.' },
  { id: 'pro-4', category: 'PROFILE', question: 'How do I update my skills?', answer: 'Go to Edit Profile > Skills & Categories. You can select up to 10 primary skills that best represent your expertise. These help clients find you in search results.' },
  
  // COMMUNITY
  { id: 'com-1', category: 'COMMUNITY', question: 'How do I create posts?', answer: 'Navigate to the Community feed and use the "Create Post" box at the top. You can share updates, ask questions, and attach images or links.' },
  { id: 'com-2', category: 'COMMUNITY', question: 'How do I follow creators?', answer: 'Visit any creator\'s profile and click the "Follow" button. Their updates and new portfolio items will appear in your community feed.' },
  { id: 'com-3', category: 'COMMUNITY', question: 'How do comments work?', answer: 'You can engage with community posts by leaving comments. Keep conversations respectful and professional in accordance with our Community Guidelines.' },
  { id: 'com-4', category: 'COMMUNITY', question: 'How do I report content?', answer: 'Click the three dots (...) next to any post, comment, or message and select "Report". Our moderation team will review the content promptly.' },
  
  // MARKETPLACE
  { id: 'mkt-1', category: 'MARKETPLACE', question: 'How do I apply for gigs?', answer: 'Browse the Marketplace, click on a gig you\'re interested in, and hit "Apply Now". You\'ll need to submit a proposal outlining why you are the best fit for the job.' },
  { id: 'mkt-2', category: 'MARKETPLACE', question: 'How do I post a gig?', answer: 'If you\'re looking to hire, click "Post a Gig" from the main navigation. Fill out the requirements, budget, and timeline to start receiving applications from creators.' },
  { id: 'mkt-3', category: 'MARKETPLACE', question: 'Can I edit a gig?', answer: 'Yes, as long as the gig is still active and hasn\'t been awarded. Go to "My Posted Gigs", select the gig, and choose "Edit".' },
  { id: 'mkt-4', category: 'MARKETPLACE', question: 'How do I close a gig?', answer: 'Go to "My Posted Gigs", select the gig, and choose "Close Gig". You can do this once you\'ve hired someone or if you no longer need the services.' },
  
  // VERIFICATION
  { id: 'ver-1', category: 'VERIFICATION', question: 'How do I become verified?', answer: 'Verification requires completing your profile to 100%, providing government-issued ID, and maintaining a high community rating. You can apply from Settings > Verification.' },
  { id: 'ver-2', category: 'VERIFICATION', question: 'What are the benefits?', answer: 'Verified users receive a verified badge on their profile, increased visibility in search results, prioritized customer support, and access to premium gigs.' },
  { id: 'ver-3', category: 'VERIFICATION', question: 'How long does verification take?', answer: 'Our team reviews verification requests manually. The process typically takes 3-5 business days depending on the volume of applications.' },
  
  // SUBSCRIPTIONS
  { id: 'sub-1', category: 'SUBSCRIPTIONS', question: 'Difference between Starter, Pro and Premium?', answer: 'Starter is free and includes basic features. Pro offers advanced analytics, unlimited gig applications, and priority support. Premium is designed for agencies needing team management and API access.' },
  { id: 'sub-2', category: 'SUBSCRIPTIONS', question: 'How do I upgrade?', answer: 'Visit Settings > Billing & Subscriptions. Choose the plan that fits your needs and enter your payment details to upgrade instantly.' },
  { id: 'sub-3', category: 'SUBSCRIPTIONS', question: 'How do I cancel?', answer: 'You can cancel your subscription at any time from Settings > Billing & Subscriptions > Manage Plan. You\'ll retain your premium features until the end of your current billing cycle.' },
  
  // PAYMENTS
  { id: 'pay-1', category: 'PAYMENTS', question: 'How do subscriptions work?', answer: 'Subscriptions are billed automatically on a monthly or annual basis depending on your selected plan. Invoices are emailed to you and available in your account settings.' },
  { id: 'pay-2', category: 'PAYMENTS', question: 'When will new payment methods be added?', answer: 'We currently accept major credit cards and Mobile Money in select regions. We are actively working to integrate more local African payment gateways.' },
  
  // TECHNICAL
  { id: 'tech-1', category: 'TECHNICAL', question: 'Videos won\'t upload.', answer: 'Ensure your video is in MP4 or MOV format and does not exceed the 50MB file size limit. If the problem persists, try clearing your browser cache.' },
  { id: 'tech-2', category: 'TECHNICAL', question: 'Images won\'t display.', answer: 'Check your internet connection. If images are broken, try hard-refreshing the page (Ctrl/Cmd + Shift + R). Supported formats are JPG, PNG, and WebP.' },
  { id: 'tech-3', category: 'TECHNICAL', question: 'Notifications not working.', answer: 'Verify that you have allowed push notifications in your browser settings and that notifications are turned on in Settings > Notifications.' },
  { id: 'tech-4', category: 'TECHNICAL', question: 'Login issues.', answer: 'If you cannot log in, try resetting your password. Ensure you are not using a VPN that might be blocking our authentication servers.' },
];

const QUICK_CARDS = [
  { icon: Rocket, title: 'Getting Started', description: 'Learn the basics of GigsConnect.' },
  { icon: UserCircle, title: 'Creating Your Profile', description: 'Set up a standout creator profile.' },
  { icon: Briefcase, title: 'Finding Opportunities', description: 'Tips for landing your next big gig.' },
  { icon: PlusCircle, title: 'Posting Gigs', description: 'How to hire top African talent.' },
  { icon: ShieldCheck, title: 'Subscriptions & Verification', description: 'Manage your plan and trust badges.' },
  { icon: Lock, title: 'Account & Security', description: 'Keep your data and profile secure.' },
];

const HelpCenter: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [openFaqId, setOpenFaqId] = useState<string | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);
  
  // The purple color to use across the page. 
  // We use the brand purple from Tailwind (text-[#4B0082]) to match the rest of the site's legal pages perfectly.
  // The user prompt also suggested #6C2BFF, but maintaining complete consistency with Privacy Policy & Terms uses #4B0082.
  // We'll use a mix of both if appropriate, but #6C2BFF is applied to accents to give that "premium Stripe/Linear" feel requested.
  const accentColor = '#6C2BFF'; 

  useEffect(() => {
    window.scrollTo(0, 0);

    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollTop;
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scroll = Number((totalScroll / windowHeight) * 100);
      setScrollProgress(scroll);

      if (totalScroll > 400) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleFaq = (id: string) => {
    setOpenFaqId(openFaqId === id ? null : id);
  };

  const filteredFaqs = useMemo(() => {
    if (!searchQuery.trim()) return FAQS;
    const query = searchQuery.toLowerCase();
    return FAQS.filter(
      (faq) => 
        faq.question.toLowerCase().includes(query) || 
        faq.answer.toLowerCase().includes(query) ||
        faq.category.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const categoriesToRender = useMemo(() => {
    if (!searchQuery.trim()) return CATEGORIES;
    const activeCategories = new Set(filteredFaqs.map(faq => faq.category));
    return CATEGORIES.filter(cat => activeCategories.has(cat));
  }, [filteredFaqs, searchQuery]);

  return (
    <div className="w-full bg-gray-50 flex flex-col font-sans min-h-screen relative">
      
      {/* Reading Progress Indicator */}
      <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 z-50">
        <div 
          className="h-full transition-all duration-150 ease-out" 
          style={{ width: `${scrollProgress}%`, backgroundColor: accentColor }}
        />
      </div>

      {/* Breadcrumbs */}
      <div className="absolute top-24 left-6 md:left-8 z-20 text-sm font-medium text-gray-500">
        <Link to="/" className="hover:text-[#111827] transition-colors">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-[#111827]">Help Center</span>
      </div>

      {/* Hero Section */}
      <div className="pt-36 pb-20 px-6 md:px-8 bg-white border-b border-gray-100 relative overflow-hidden flex-shrink-0">
        <div 
          className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full blur-[100px] pointer-events-none -translate-y-1/2 translate-x-1/3 opacity-20"
          style={{ backgroundColor: accentColor }}
        ></div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center justify-center gap-3 mb-6">
            <h1 className="text-4xl md:text-5xl font-black text-[#111827] tracking-tight">Help Center</h1>
            <HelpCircle className="w-8 h-8 md:w-10 md:h-10" style={{ color: accentColor }} />
          </div>
          <p className="text-xl font-medium text-gray-600 max-w-2xl mx-auto leading-relaxed mb-10">
            Everything you need to get the most out of GigsConnect.
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative group sticky top-4 z-30">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="w-6 h-6 text-gray-400 group-focus-within:text-[#6C2BFF] transition-colors" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for answers..."
              className="w-full pl-12 pr-6 py-4 rounded-2xl border border-gray-200 bg-white text-lg focus:outline-none focus:ring-4 focus:border-transparent shadow-sm transition-all text-[#111827] placeholder-gray-400"
              style={{ '--tw-ring-color': `${accentColor}33` } as React.CSSProperties}
            />
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 w-full max-w-[1200px] mx-auto px-4 sm:px-6 md:px-8 py-16">
        
        {/* Quick Help Cards (Only show if not searching) */}
        {!searchQuery && (
          <div className="mb-20">
            <h2 className="text-2xl font-bold text-[#111827] mb-8 tracking-tight">Quick Help</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {QUICK_CARDS.map((card, idx) => (
                <div 
                  key={idx} 
                  className="bg-white p-6 rounded-2xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer group"
                >
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-colors"
                    style={{ backgroundColor: `${accentColor}10`, color: accentColor }}
                  >
                    <card.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-[#111827] mb-2 group-hover:text-[#6C2BFF] transition-colors">{card.title}</h3>
                  <p className="text-gray-500 leading-relaxed text-sm">{card.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* FAQs */}
        <div className="bg-white p-8 md:p-12 rounded-3xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
          <h2 className="text-3xl font-bold text-[#111827] mb-10 tracking-tight">
            {searchQuery ? 'Search Results' : 'Frequently Asked Questions'}
          </h2>

          {filteredFaqs.length === 0 ? (
            <div className="text-center py-12">
              <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-[#111827] mb-2">No results found.</h3>
              <p className="text-gray-500">Try another keyword.</p>
            </div>
          ) : (
            <div className="space-y-12">
              {categoriesToRender.map((category) => (
                <div key={category} className="animate-in fade-in duration-500">
                  <h3 
                    className="text-xs font-bold uppercase tracking-widest mb-6 pb-2 border-b border-gray-100"
                    style={{ color: accentColor }}
                  >
                    {category}
                  </h3>
                  <div className="space-y-4">
                    {filteredFaqs
                      .filter(faq => faq.category === category)
                      .map((faq) => {
                        const isOpen = openFaqId === faq.id;
                        return (
                          <div 
                            key={faq.id} 
                            className={`border rounded-2xl transition-all duration-300 ${isOpen ? 'border-gray-200 bg-gray-50/50 shadow-sm' : 'border-gray-100 bg-white hover:border-gray-200'}`}
                          >
                            <button
                              onClick={() => toggleFaq(faq.id)}
                              className="w-full flex items-center justify-between p-5 md:p-6 text-left focus:outline-none rounded-2xl focus-visible:ring-2 focus-visible:ring-offset-2"
                              style={{ '--tw-ring-color': accentColor } as React.CSSProperties}
                              aria-expanded={isOpen}
                            >
                              <span className={`font-semibold pr-4 transition-colors ${isOpen ? 'text-[#111827]' : 'text-gray-700'}`}>
                                {faq.question}
                              </span>
                              <ChevronDown 
                                className={`w-5 h-5 flex-shrink-0 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
                              />
                            </button>
                            <div 
                              className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
                            >
                              <div className="p-5 md:p-6 pt-0 text-gray-600 leading-relaxed text-[1.05rem]">
                                {faq.answer}
                              </div>
                            </div>
                          </div>
                        );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Support & Community Section */}
      <div className="max-w-[1200px] mx-auto w-full px-4 sm:px-6 md:px-8 pb-20">
        <div className="grid md:grid-cols-2 gap-6">
          
          {/* Contact Support */}
          <div className="bg-white p-8 md:p-10 rounded-3xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] flex flex-col justify-between h-full hover:shadow-lg transition-shadow duration-300">
            <div>
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-6"
                style={{ backgroundColor: `${accentColor}10`, color: accentColor }}
              >
                <MessageSquare className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-[#111827] mb-3">Need more help?</h3>
              <p className="text-gray-600 mb-8 text-lg">Our dedicated support team is ready to assist you with any questions or technical issues.</p>
              
              <div className="space-y-3 mb-8">
                <div className="flex items-center gap-3 text-gray-600">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <a href="mailto:support@gigsconnect.africa" className="hover:text-[#111827] transition-colors font-medium">support@gigsconnect.africa</a>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <Globe className="w-5 h-5 text-gray-400" />
                  <a href="https://gigsconnect.africa" className="hover:text-[#111827] transition-colors font-medium">gigsconnect.africa</a>
                </div>
              </div>
            </div>
            
            <a 
              href="mailto:support@gigsconnect.africa"
              className="inline-flex items-center justify-center h-14 w-full sm:w-auto px-8 rounded-xl text-white font-bold transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 gap-2"
              style={{ backgroundColor: accentColor }}
            >
              Contact Support <ArrowRight className="w-5 h-5" />
            </a>
          </div>

          {/* Community CTA */}
          <div className="bg-gray-900 p-8 md:p-10 rounded-3xl border border-gray-800 shadow-[0_8px_30px_rgb(0,0,0,0.02)] flex flex-col justify-between h-full relative overflow-hidden group">
            <div 
              className="absolute top-0 right-0 w-64 h-64 rounded-full blur-[80px] pointer-events-none -translate-y-1/2 translate-x-1/3 opacity-30 transition-opacity duration-500 group-hover:opacity-50"
              style={{ backgroundColor: accentColor }}
            ></div>
            <div className="relative z-10">
              <h3 className="text-2xl font-bold text-white mb-3">Still can't find what you're looking for?</h3>
              <p className="text-gray-400 mb-8 text-lg">Join the GigsConnect Community. Ask questions, share insights, and connect with thousands of creators across Africa.</p>
            </div>
            
            <div className="relative z-10">
              <Link 
                to="/community"
                className="inline-flex items-center justify-center h-14 w-full sm:w-auto px-8 rounded-xl bg-white text-[#111827] font-bold transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 hover:bg-gray-50 gap-2"
              >
                Go to Community <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>

        </div>
      </div>
      
      {/* Back to Top Button */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-8 right-8 w-14 h-14 rounded-full bg-white text-[#111827] border border-gray-200 shadow-xl flex items-center justify-center transition-all duration-300 hover:bg-gray-50 hover:scale-105 z-40 ${
          showBackToTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
        }`}
        aria-label="Back to top"
      >
        <ArrowUp className="w-6 h-6" style={{ color: accentColor }} />
      </button>

    </div>
  );
};

export default HelpCenter;
