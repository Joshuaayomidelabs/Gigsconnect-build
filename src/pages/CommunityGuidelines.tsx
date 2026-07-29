import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, ArrowRight, ArrowUp, Info, Shield, Mail, Globe, CheckCircle } from 'lucide-react';

const sections = [
  { id: 'respect-every-creator', title: '1. Respect Every Creator' },
  { id: 'authentic-profiles', title: '2. Authentic Profiles' },
  { id: 'original-content', title: '3. Original Content' },
  { id: 'professional-conduct', title: '4. Professional Conduct' },
  { id: 'prohibited-content', title: '5. Prohibited Content' },
  { id: 'marketplace-integrity', title: '6. Marketplace Integrity' },
  { id: 'reporting-violations', title: '7. Reporting Violations' },
  { id: 'enforcement', title: '8. Enforcement' },
  { id: 'our-commitment', title: '9. Our Commitment' },
];

const sectionContent: Record<string, React.ReactNode> = {
  'respect-every-creator': (
    <div className="space-y-6 text-gray-600 leading-[1.8] text-[1.05rem]">
      <p>We are a diverse community of creators. Respectful communication is essential for everyone to thrive.</p>
      <ul className="list-disc pl-6 space-y-3 marker:text-[#4B0082]">
        <li><strong className="text-[#111827] font-semibold">No harassment:</strong> We do not tolerate any form of harassment, including unwanted advances, intimidation, or persistent unwanted contact.</li>
        <li><strong className="text-[#111827] font-semibold">No bullying:</strong> Do not demean, shame, or mock other users. Feedback should be constructive and professional.</li>
        <li><strong className="text-[#111827] font-semibold">No hate speech:</strong> Any content or behavior that attacks people based on race, ethnicity, national origin, religion, sex, gender, sexual orientation, disability, or medical condition is strictly forbidden.</li>
        <li><strong className="text-[#111827] font-semibold">No discrimination:</strong> Treat everyone fairly regardless of their background or identity.</li>
        <li><strong className="text-[#111827] font-semibold">Respect different backgrounds:</strong> Celebrate the diversity of the African creative landscape. Be open-minded and culturally sensitive.</li>
      </ul>
    </div>
  ),
  'authentic-profiles': (
    <div className="space-y-6 text-gray-600 leading-[1.8] text-[1.05rem]">
      <p>Trust is built on authenticity. When you join GigsConnect, you must accurately represent yourself and your skills.</p>
      <ul className="list-disc pl-6 space-y-3 marker:text-[#4B0082]">
        <li><strong className="text-[#111827] font-semibold">Use real information:</strong> Provide your actual name (or registered business name) and accurate professional details.</li>
        <li><strong className="text-[#111827] font-semibold">No impersonation:</strong> Do not pretend to be someone else, including other creators, celebrities, or brands.</li>
        <li><strong className="text-[#111827] font-semibold">No fake accounts:</strong> Do not create multiple accounts or use automated means to create accounts.</li>
        <li><strong className="text-[#111827] font-semibold">No misleading identities:</strong> Do not use misleading photos, false locations, or fabricated credentials.</li>
        <li><strong className="text-[#111827] font-semibold">Verification improves trust:</strong> We encourage users to complete any available verification processes to build trust within the community.</li>
      </ul>
    </div>
  ),
  'original-content': (
    <div className="space-y-6 text-gray-600 leading-[1.8] text-[1.05rem]">
      <p>Your portfolio represents your unique talent. You must only showcase work that you have the right to display.</p>
      <ul className="list-disc pl-6 space-y-3 marker:text-[#4B0082]">
        <li><strong className="text-[#111827] font-semibold">Only upload content you own or have permission to use:</strong> Ensure you hold the necessary rights or licenses for all images, videos, audio, and text you upload.</li>
        <li><strong className="text-[#111827] font-semibold">Respect copyrights:</strong> Do not infringe on the intellectual property rights of others. This includes using copyrighted music, stock photos without licenses, or stolen designs.</li>
        <li><strong className="text-[#111827] font-semibold">Credit collaborators:</strong> If you worked on a project with a team, clearly state your specific role and credit other contributors.</li>
        <li><strong className="text-[#111827] font-semibold">No plagiarism:</strong> Do not copy and paste descriptions, proposals, or creative works belonging to someone else and present them as your own.</li>
      </ul>
    </div>
  ),
  'professional-conduct': (
    <div className="space-y-6 text-gray-600 leading-[1.8] text-[1.05rem]">
      <p>Professionalism is key to a successful freelance and creative career. We expect all users to uphold high standards of business etiquette.</p>
      <ul className="list-disc pl-6 space-y-3 marker:text-[#4B0082]">
        <li><strong className="text-[#111827] font-semibold">Encourage collaboration:</strong> Foster a supportive environment by helping others, sharing knowledge, and networking professionally.</li>
        <li><strong className="text-[#111827] font-semibold">Be honest in applications:</strong> Only apply for gigs you are qualified for and have the capacity to complete.</li>
        <li><strong className="text-[#111827] font-semibold">Deliver promised work:</strong> Honor your commitments, meet deadlines, and provide the quality of work agreed upon with the client.</li>
        <li><strong className="text-[#111827] font-semibold">Communicate professionally:</strong> Maintain clear, timely, and respectful communication with clients and collaborators. Keep discussions focused on the project.</li>
        <li><strong className="text-[#111827] font-semibold">Treat clients and creators respectfully:</strong> Disagreements may happen, but they must be handled civilly without resorting to insults or threats.</li>
      </ul>
    </div>
  ),
  'prohibited-content': (
    <div className="space-y-6 text-gray-600 leading-[1.8] text-[1.05rem]">
      <p>To keep our platform safe for everyone, the following types of content and behavior are strictly prohibited:</p>
      <div className="grid sm:grid-cols-2 gap-4">
        <ul className="list-disc pl-6 space-y-3 marker:text-[#4B0082]">
          <li><strong className="text-[#111827] font-semibold">No pornography</strong> or sexually explicit content.</li>
          <li><strong className="text-[#111827] font-semibold">No violence</strong> or excessively graphic content.</li>
          <li><strong className="text-[#111827] font-semibold">No illegal activities</strong> or promotion of illegal acts.</li>
          <li><strong className="text-[#111827] font-semibold">No scams</strong>, pyramid schemes, or multi-level marketing.</li>
          <li><strong className="text-[#111827] font-semibold">No spam</strong> or unsolicited commercial messaging.</li>
          <li><strong className="text-[#111827] font-semibold">No misleading opportunities</strong> or "get rich quick" schemes.</li>
        </ul>
        <ul className="list-disc pl-6 space-y-3 marker:text-[#4B0082]">
          <li><strong className="text-[#111827] font-semibold">No phishing</strong> or attempts to steal user credentials.</li>
          <li><strong className="text-[#111827] font-semibold">No malware</strong>, viruses, or destructive code.</li>
          <li><strong className="text-[#111827] font-semibold">No terrorist or extremist</strong> promotion or recruitment.</li>
          <li><strong className="text-[#111827] font-semibold">No child exploitation</strong> in any form.</li>
          <li><strong className="text-[#111827] font-semibold">No dangerous challenges</strong> that encourage self-harm or injury.</li>
        </ul>
      </div>
    </div>
  ),
  'marketplace-integrity': (
    <div className="space-y-6 text-gray-600 leading-[1.8] text-[1.05rem]">
      <p>A fair and transparent marketplace benefits everyone. Users must not manipulate or exploit the GigsConnect platform.</p>
      <ul className="list-disc pl-6 space-y-3 marker:text-[#4B0082]">
        <li><strong className="text-[#111827] font-semibold">Only post genuine gigs:</strong> Clients must have a real intent to hire for the projects they post.</li>
        <li><strong className="text-[#111827] font-semibold">Provide accurate information:</strong> Job descriptions, budgets, and requirements must be truthful and clearly stated.</li>
        <li><strong className="text-[#111827] font-semibold">Avoid duplicate listings:</strong> Do not spam the marketplace with identical gig postings.</li>
        <li><strong className="text-[#111827] font-semibold">Do not manipulate reviews:</strong> Do not offer incentives for positive feedback, leave fake reviews, or attempt to artificially inflate ratings.</li>
        <li><strong className="text-[#111827] font-semibold">No fake job offers:</strong> Do not post opportunities solely to collect personal information, harvest portfolios, or solicit free work under the guise of an "audition" or "test project."</li>
      </ul>
    </div>
  ),
  'reporting-violations': (
    <div className="space-y-6 text-gray-600 leading-[1.8] text-[1.05rem]">
      <p>We rely on our community to help maintain a safe environment. If you see something that violates these guidelines, please report it.</p>
      <p>You can report:</p>
      <ul className="list-disc pl-6 space-y-3 marker:text-[#4B0082]">
        <li><strong>Accounts</strong> (profiles, portfolios)</li>
        <li><strong>Posts</strong> (community feed content)</li>
        <li><strong>Comments</strong></li>
        <li><strong>Messages</strong> (inbox conversations)</li>
        <li><strong>Gigs</strong> (job listings)</li>
      </ul>
      <p>Use the "Report" button available on content and profiles, or contact our support team directly. All reports are reviewed fairly and confidentially by our moderation team.</p>
    </div>
  ),
  'enforcement': (
    <div className="space-y-6 text-gray-600 leading-[1.8] text-[1.05rem]">
      <p>When a violation occurs, we take action based on the severity and frequency of the offense.</p>
      <p>Possible actions include:</p>
      <ul className="list-disc pl-6 space-y-3 marker:text-[#4B0082]">
        <li><strong className="text-[#111827] font-semibold">Warning:</strong> A message explaining the violation and educating the user on our guidelines.</li>
        <li><strong className="text-[#111827] font-semibold">Content removal:</strong> Deletion of the offending post, portfolio item, or gig.</li>
        <li><strong className="text-[#111827] font-semibold">Temporary suspension:</strong> Loss of access to the platform for a specified duration.</li>
        <li><strong className="text-[#111827] font-semibold">Permanent account ban:</strong> For severe or repeated violations, the account will be permanently deactivated.</li>
      </ul>
      <p><strong className="text-[#111827] font-semibold">Appeal process:</strong> If you believe your content or account was actioned in error, you may appeal the decision by contacting support. We review appeals to ensure our enforcement is fair and accurate.</p>
    </div>
  ),
  'our-commitment': (
    <div className="space-y-6 text-gray-600 leading-[1.8] text-[1.05rem]">
      <p>GigsConnect is deeply committed to empowering creators across Africa.</p>
      <p>We believe in the power of creativity, collaboration, diversity, and professionalism. By following these guidelines, you help us build a platform where talent is recognized, opportunities are abundant, and meaningful professional relationships can flourish.</p>
      <p>Thank you for being a vital part of the GigsConnect community. Let's create something amazing together.</p>
    </div>
  ),
};

const CommunityGuidelines: React.FC = () => {
  const [activeSection, setActiveSection] = useState(sections[0].id);
  const [isMobileTocOpen, setIsMobileTocOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);

    const handleScroll = () => {
      // Progress Bar Calculation
      const totalScroll = document.documentElement.scrollTop;
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scroll = Number((totalScroll / windowHeight) * 100);
      setScrollProgress(scroll);

      // Back to top visibility
      if (totalScroll > 400) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }

      // Active Section Calculation
      const sectionElements = sections.map((s) => document.getElementById(s.id));
      const scrollPosition = totalScroll + 200; // Offset for header + padding

      for (let i = sectionElements.length - 1; i >= 0; i--) {
        const section = sectionElements[i];
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(sections[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    setIsMobileTocOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const y = element.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: y, behavior: 'smooth' });
      setActiveSection(id);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="w-full bg-gray-50 flex flex-col font-sans min-h-screen relative">
      
      {/* Reading Progress Indicator */}
      <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 z-50">
        <div 
          className="h-full bg-[#4B0082] transition-all duration-150 ease-out" 
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Hero Section */}
      <div className="pt-24 pb-16 px-6 md:px-8 bg-white border-b border-gray-100 relative overflow-hidden flex-shrink-0">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#4B0082]/5 rounded-full blur-[100px] pointer-events-none -translate-y-1/2 translate-x-1/3"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10 mt-8">
          <div className="inline-flex items-center justify-center gap-2 mb-6">
            <h1 className="text-4xl md:text-5xl font-black text-[#111827] tracking-tight">Community Guidelines</h1>
            <CheckCircle className="w-8 h-8 md:w-10 md:h-10 text-[#4B0082]" />
          </div>
          <p className="text-xl md:text-2xl font-semibold text-gray-700 max-w-3xl mx-auto leading-relaxed mb-6">
            "Together we're building a safe, respectful, and inspiring community for creators across Africa."
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 max-w-[1200px] mx-auto w-full px-4 sm:px-6 md:px-8 py-12 flex flex-col md:flex-row gap-8 lg:gap-12">
        
        {/* Mobile TOC Toggle */}
        <div className="md:hidden w-full sticky top-20 z-30">
          <button 
            onClick={() => setIsMobileTocOpen(!isMobileTocOpen)}
            className="w-full flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200 shadow-sm"
          >
            <span className="font-semibold text-[#111827]">Table of Contents</span>
            <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${isMobileTocOpen ? 'rotate-180' : ''}`} />
          </button>
          
          {isMobileTocOpen && (
            <div className="absolute top-full left-0 right-0 mt-2 p-2 bg-white rounded-xl border border-gray-200 shadow-lg max-h-[60vh] overflow-y-auto z-40">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    activeSection === section.id 
                      ? 'bg-[#4B0082]/10 text-[#4B0082]' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-[#111827]'
                  }`}
                >
                  {section.title}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Desktop Sticky TOC */}
        <div className="hidden md:block w-72 lg:w-80 flex-shrink-0">
          <div className="sticky top-28 bg-white p-6 rounded-2xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <h3 className="font-bold text-[#111827] mb-6 uppercase tracking-wider text-xs">Table of Contents</h3>
            <nav className="space-y-1">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className={`w-full text-left px-4 py-2.5 rounded-lg text-sm transition-all duration-200 ${
                    activeSection === section.id 
                      ? 'bg-[#4B0082]/10 text-[#4B0082] font-semibold' 
                      : 'text-gray-500 hover:text-[#111827] hover:bg-gray-50 font-medium'
                  }`}
                >
                  {section.title}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Content Sections */}
        <div className="flex-1 max-w-[850px] bg-white p-6 sm:p-8 md:p-10 lg:p-12 rounded-3xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
          
          {/* Important Notice Callout */}
          <div className="mb-12 p-6 bg-blue-50/50 border border-blue-100 rounded-2xl flex gap-4">
            <Info className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
            <p className="text-blue-900 leading-relaxed text-[1.05rem]">
              These guidelines help ensure GigsConnect remains a positive and professional platform for every creator.
            </p>
          </div>

          <div className="prose prose-gray max-w-none">
            {sections.map((section, index) => (
              <React.Fragment key={section.id}>
                <div id={section.id} className="scroll-mt-32">
                  <h2 className="text-2xl font-bold text-[#111827] tracking-tight mb-6 flex items-center gap-3">
                    {section.title}
                  </h2>
                  <div>
                    {sectionContent[section.id]}
                  </div>
                </div>
                {index < sections.length - 1 && (
                  <hr className="my-12 border-gray-100" />
                )}
              </React.Fragment>
            ))}
          </div>

        </div>
      </div>

      {/* Contact Card Section */}
      <div className="max-w-[1200px] mx-auto w-full px-4 sm:px-6 md:px-8 pb-16">
        <div className="max-w-[850px] ml-auto">
          <div className="bg-white p-8 md:p-10 rounded-3xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-[#111827]">Need Help?</h3>
                <p className="text-gray-600 text-lg">Our support team is here to help with any community-related inquiries.</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                <a 
                  href="mailto:support@gigsconnect.africa"
                  className="inline-flex items-center justify-center h-12 px-6 rounded-xl bg-gray-50 text-[#111827] font-semibold border border-gray-200 hover:border-[#4B0082] hover:bg-[#4B0082]/5 transition-all gap-2"
                >
                  <Mail className="w-4 h-4" /> Email Support
                </a>
                <Link 
                  to="/contact-support" 
                  className="inline-flex items-center justify-center h-12 px-6 rounded-xl bg-[#4B0082] text-white font-semibold hover:bg-[#3a0066] transition-colors gap-2"
                >
                  Contact Us <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
            
            <div className="mt-8 pt-8 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 text-gray-600">
                <Globe className="w-5 h-5 text-gray-400" />
                <span>www.gigsconnect.africa</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <Shield className="w-5 h-5 text-gray-400" />
                <span>Dedicated Community Team</span>
              </div>
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
        <ArrowUp className="w-6 h-6 text-[#4B0082]" />
      </button>

    </div>
  );
};

export default CommunityGuidelines;
