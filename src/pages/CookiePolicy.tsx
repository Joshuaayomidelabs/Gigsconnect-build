import { SEO } from '../components/SEO';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, ArrowRight, ArrowUp, Cookie, ShieldAlert, Mail, Globe, Info } from 'lucide-react';


const sections = [
  { id: 'introduction', title: '1. Introduction' },
  { id: 'types-of-cookies', title: '2. Types of Cookies We Use' },
  { id: 'why-we-use-cookies', title: '3. Why We Use Cookies' },
  { id: 'third-party-services', title: '4. Third-Party Services' },
  { id: 'managing-cookies', title: '5. Managing Cookies' },
  { id: 'updates', title: '6. Updates to this Policy' },
  { id: 'contact', title: '7. Contact Us' },
];

const sectionContent: Record<string, React.ReactNode> = {
  'introduction': (
    <>
      <p>
        Welcome to GigsConnect's Cookie Policy. This policy explains how and why we use cookies and similar tracking technologies on our platform, website, and related services to provide you with the best possible experience.
      </p>
      <h3 className="text-xl font-bold text-[#111827] mt-8 mb-4">What are cookies?</h3>
      <p>
        Cookies are small text files that are placed on your device (computer, smartphone, or tablet) when you visit a website. They are widely used by website owners to make their websites work, or to work more efficiently, as well as to provide reporting information and personalized experiences.
      </p>
      <h3 className="text-xl font-bold text-[#111827] mt-8 mb-4">Why do websites use cookies?</h3>
      <p>
        Cookies do many different jobs, like letting you navigate between pages efficiently, remembering your preferences, and generally improving your user experience. They can also help ensure that the advertisements you see online are more relevant to you and your interests.
      </p>
      <p>
        By accessing or using GigsConnect, you agree to our use of cookies and similar technologies as described in this policy.
      </p>
    </>
  ),
  'types-of-cookies': (
    <>
      <p>We use different types of cookies to run our platform effectively. Some are set by us (first-party cookies) and others are set by trusted providers (third-party cookies). Here are the categories we use:</p>
      
      <div className="space-y-6 mt-6">
        <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
          <h4 className="font-bold text-[#111827] text-lg mb-2 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#6C2BFF]"></span> Essential Cookies
          </h4>
          <p className="text-gray-600 text-sm">
            These cookies are strictly necessary to provide you with services available through our platform and to use some of its features. Without these cookies, basic functions like secure login, account management, and page navigation cannot be provided.
          </p>
        </div>

        <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
          <h4 className="font-bold text-[#111827] text-lg mb-2 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#6C2BFF]"></span> Performance Cookies
          </h4>
          <p className="text-gray-600 text-sm">
            These cookies collect information about how you use our website, such as which pages you visit most often and if you receive error messages. They help us improve how our platform works and ensure it remains fast and reliable.
          </p>
        </div>

        <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
          <h4 className="font-bold text-[#111827] text-lg mb-2 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#6C2BFF]"></span> Analytics Cookies
          </h4>
          <p className="text-gray-600 text-sm">
            We use analytics cookies to understand how our users engage with GigsConnect. This helps us measure traffic, understand user behavior, and continuously improve the creative ecosystem for all our members.
          </p>
        </div>

        <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
          <h4 className="font-bold text-[#111827] text-lg mb-2 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#6C2BFF]"></span> Functional Cookies
          </h4>
          <p className="text-gray-600 text-sm">
            Functional cookies allow our platform to remember the choices you make (such as your language preference or the region you are in) and provide enhanced, more personal features.
          </p>
        </div>

        <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
          <h4 className="font-bold text-[#111827] text-lg mb-2 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#6C2BFF]"></span> Security Cookies
          </h4>
          <p className="text-gray-600 text-sm">
            Security cookies are used to authenticate users, prevent fraudulent use of login credentials, and protect user data from unauthorized access.
          </p>
        </div>

        <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
          <h4 className="font-bold text-[#111827] text-lg mb-2 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#6C2BFF]"></span> Preference Cookies
          </h4>
          <p className="text-gray-600 text-sm">
            These cookies are used to store your preferences and various settings, ensuring that your experience is customized exactly the way you like it every time you visit.
          </p>
        </div>
      </div>
    </>
  ),
  'why-we-use-cookies': (
    <>
      <p>The cookies we deploy serve crucial functions that enhance the GigsConnect platform. Specifically, we use them for:</p>
      <ul className="list-disc pl-6 space-y-3 text-gray-600 mt-4 mb-6 marker:text-[#6C2BFF]">
        <li><strong>Keeping users signed in:</strong> Ensuring you don't have to log in repeatedly during a single session.</li>
        <li><strong>Remembering preferences:</strong> Storing your settings, such as theme, language, or dashboard layouts.</li>
        <li><strong>Improving website performance:</strong> Helping us route traffic efficiently and decrease loading times.</li>
        <li><strong>Measuring platform usage:</strong> Analyzing which features are popular and how creators navigate the platform.</li>
        <li><strong>Preventing fraud:</strong> Detecting anomalous behavior and protecting accounts against automated attacks.</li>
        <li><strong>Enhancing security:</strong> Providing a secure environment for transactions and data exchange.</li>
        <li><strong>Improving user experience:</strong> Delivering personalized content and recommendations based on your activity.</li>
      </ul>
    </>
  ),
  'third-party-services': (
    <>
      <p>
        In some cases, we also use cookies provided by trusted third parties. These third-party providers use cookies to help us deliver specific services on the platform.
      </p>
      <p className="mt-4">
        Examples of third-party services that may use cookies on GigsConnect include:
      </p>
      <ul className="list-disc pl-6 space-y-3 text-gray-600 mt-4 mb-6 marker:text-[#6C2BFF]">
        <li><strong>Analytics:</strong> Providers like Google Analytics help us understand platform usage.</li>
        <li><strong>Authentication:</strong> Social login providers (e.g., Google, Apple) use cookies to facilitate seamless sign-in.</li>
        <li><strong>Embedded content:</strong> Features like embedded videos or interactive maps may set their own tracking cookies.</li>
        <li><strong>Payment providers:</strong> Secure gateways use cookies to process payments and prevent financial fraud.</li>
      </ul>
      <div className="bg-[#6C2BFF]/5 border border-[#6C2BFF]/20 p-5 rounded-xl mt-6 flex gap-4">
        <ShieldAlert className="w-6 h-6 text-[#6C2BFF] flex-shrink-0" />
        <p className="text-sm text-[#111827] font-medium">
          Please note that these third-party providers manage their own cookies according to their own privacy and cookie policies, over which we have no control.
        </p>
      </div>
    </>
  ),
  'managing-cookies': (
    <>
      <p>
        You have the right to decide whether to accept or reject cookies. You can exercise your cookie rights by setting your preferences in our Cookie Consent Banner or by modifying your web browser controls.
      </p>
      <ul className="space-y-4 mt-6">
        <li className="flex flex-col sm:flex-row gap-4 p-4 rounded-xl border border-gray-100">
          <div className="font-bold text-[#111827] sm:w-1/3 shrink-0">Accept cookies</div>
          <div className="text-gray-600 text-sm">By clicking "Accept All" on our cookie banner, you consent to all cookies being stored on your device.</div>
        </li>
        <li className="flex flex-col sm:flex-row gap-4 p-4 rounded-xl border border-gray-100">
          <div className="font-bold text-[#111827] sm:w-1/3 shrink-0">Reject non-essential cookies</div>
          <div className="text-gray-600 text-sm">You can choose to reject all non-essential cookies. However, please note that essential cookies cannot be disabled as they are required for the platform to function.</div>
        </li>
        <li className="flex flex-col sm:flex-row gap-4 p-4 rounded-xl border border-gray-100">
          <div className="font-bold text-[#111827] sm:w-1/3 shrink-0">Delete cookies</div>
          <div className="text-gray-600 text-sm">You can delete cookies already stored on your computer at any time through your browser settings.</div>
        </li>
        <li className="flex flex-col sm:flex-row gap-4 p-4 rounded-xl border border-gray-100">
          <div className="font-bold text-[#111827] sm:w-1/3 shrink-0">Configure browser settings</div>
          <div className="text-gray-600 text-sm">Most web browsers allow some control of most cookies through the browser settings. You can set your browser to refuse all or some browser cookies, or to alert you when websites set or access cookies.</div>
        </li>
      </ul>
      <p className="mt-6 font-medium text-red-600 bg-red-50 p-4 rounded-xl">
        Warning: If you disable or refuse cookies, please note that some parts of the GigsConnect platform may become inaccessible or not function properly.
      </p>
    </>
  ),
  'updates': (
    <>
      <p>
        We may update this Cookie Policy from time to time in order to reflect, for example, changes to the cookies we use or for other operational, legal, or regulatory reasons. 
      </p>
      <p className="mt-4">
        Please therefore re-visit this Cookie Policy regularly to stay informed about our use of cookies and related technologies. The date at the top of this policy indicates when it was last updated.
      </p>
    </>
  ),
  'contact': (
    <>
      <p>
        If you have any questions about our use of cookies or other technologies, please contact our privacy team.
      </p>
      
      <div className="grid sm:grid-cols-2 gap-4 mt-8">
        <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 flex flex-col items-center text-center hover:border-[#6C2BFF]/30 transition-colors">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-[#6C2BFF] shadow-sm mb-4">
            <Mail className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-[#111827] mb-1">Email Us</h4>
          <a href="mailto:support@gigsconnect.africa" className="text-[#6C2BFF] font-medium text-sm hover:underline">
            support@gigsconnect.africa
          </a>
        </div>
        
        <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 flex flex-col items-center text-center hover:border-[#6C2BFF]/30 transition-colors">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-[#6C2BFF] shadow-sm mb-4">
            <Globe className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-[#111827] mb-1">Website</h4>
          <a href="https://gigsconnect.africa" className="text-[#6C2BFF] font-medium text-sm hover:underline">
            gigsconnect.africa
          </a>
        </div>
      </div>
    </>
  ),
};

const CookiePolicy: React.FC = () => {
  const [activeSection, setActiveSection] = useState(sections[0].id);
  const [isMobileTocOpen, setIsMobileTocOpen] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);

    const handleScroll = () => {
      // Update reading progress
      const totalScroll = document.documentElement.scrollTop;
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scroll = `${(totalScroll / windowHeight) * 100}`;
      setReadingProgress(Number(scroll));

      // Show back to top button
      setShowBackToTop(totalScroll > 500);

      // Update active section
      const sectionElements = sections.map((s) => document.getElementById(s.id));
      const scrollPosition = window.scrollY + 200; // Offset for header + padding
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
    <div className="w-full bg-[#FAFAFA] flex flex-col font-sans min-h-screen">
      <SEO title="Cookie Policy | GigsConnect" canonical="https://gigsconnect.africa/cookie-policy" />

      
      {/* Reading Progress Bar */}
      <div 
        className="fixed top-[72px] lg:top-20 left-0 h-1 bg-[#6C2BFF] z-50 transition-all duration-75"
        style={{ width: `${readingProgress}%` }}
      />

      {/* Hero Section */}
      <div className="pt-28 pb-16 px-6 md:px-8 bg-white border-b border-gray-100 relative overflow-hidden flex-shrink-0 animate-in fade-in duration-700">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#6C2BFF]/5 rounded-full blur-[100px] pointer-events-none -translate-y-1/2 translate-x-1/3"></div>
        
        <div className="max-w-4xl mx-auto relative z-10">
          
          {/* Breadcrumb */}
          <nav className="flex text-sm text-gray-500 font-medium mb-8">
            <ol className="flex items-center space-x-2">
              <li><Link to="/" className="hover:text-[#6C2BFF] transition-colors">Home</Link></li>
              <li><span>/</span></li>
              <li className="text-[#111827]">Cookie Policy</li>
            </ol>
          </nav>

          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-[#6C2BFF]/10 text-[#6C2BFF] flex items-center justify-center">
              <Cookie className="w-6 h-6" />
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-[#111827] tracking-tight">Cookie Policy</h1>
          </div>
          
          <p className="text-lg text-gray-500 max-w-2xl leading-relaxed mb-8">
            Learn how GigsConnect uses cookies and similar technologies to improve your experience, enhance security, and provide better services.
          </p>

          <div className="inline-flex items-start sm:items-center gap-3 p-4 bg-blue-50 border border-blue-100 rounded-xl max-w-3xl">
            <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5 sm:mt-0" />
            <p className="text-sm text-blue-800 font-medium">
              This Cookie Policy should be read together with our <Link to="/privacy-policy" className="underline hover:text-blue-900">Privacy Policy</Link> and <Link to="/terms" className="underline hover:text-blue-900">Terms & Conditions</Link>.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 max-w-[1200px] mx-auto w-full px-6 md:px-8 py-12 flex flex-col md:flex-row gap-8 lg:gap-12 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150">
        
        {/* Mobile TOC Toggle */}
        <div className="md:hidden w-full">
          <button 
            onClick={() => setIsMobileTocOpen(!isMobileTocOpen)}
            className="w-full flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200 shadow-sm"
          >
            <span className="font-semibold text-[#111827]">Table of Contents</span>
            <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${isMobileTocOpen ? 'rotate-180' : ''}`} />
          </button>
          
          {isMobileTocOpen && (
            <div className="mt-2 p-2 bg-white rounded-xl border border-gray-200 shadow-sm">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    activeSection === section.id 
                      ? 'bg-[#6C2BFF]/10 text-[#6C2BFF]' 
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
          <div className="sticky top-32 bg-white p-6 rounded-2xl border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.02)]">
            <h3 className="font-bold text-[#111827] mb-6 uppercase tracking-wider text-xs">Table of Contents</h3>
            <nav className="space-y-1">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className={`w-full text-left px-4 py-2.5 rounded-lg text-sm transition-all duration-200 ${
                    activeSection === section.id 
                      ? 'bg-[#6C2BFF]/10 text-[#6C2BFF] font-semibold' 
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
        <div className="flex-1 max-w-[850px] bg-white p-8 md:p-10 lg:p-12 rounded-3xl border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.02)]">
          
          <div className="mb-12 pb-6 border-b border-gray-100">
            <p className="text-sm font-bold text-[#6C2BFF] uppercase tracking-widest">Last Updated</p>
            <p className="text-[#111827] font-medium mt-1">July 2026</p>
          </div>

          <div className="prose prose-lg max-w-none prose-headings:font-bold prose-headings:text-[#111827] prose-p:text-gray-600 prose-p:leading-relaxed prose-a:text-[#6C2BFF]">
            {sections.map((section) => (
              <div key={section.id} id={section.id} className="scroll-mt-32 mb-16 last:mb-0 relative group">
                <div className="flex items-center gap-3 mb-6">
                  <h2 className="text-3xl font-bold text-[#111827] tracking-tight">{section.title}</h2>
                  <a href={`#${section.id}`} className="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-[#6C2BFF] transition-all">#</a>
                </div>
                <div className="text-gray-600 leading-relaxed text-[17px]">
                  {sectionContent[section.id]}
                </div>
              </div>
            ))}
          </div>
          
        </div>
      </div>

      {/* Back to top button */}
      <button 
        onClick={scrollToTop}
        className={`fixed bottom-8 right-8 w-12 h-12 rounded-full bg-white border border-gray-200 text-gray-500 hover:text-[#6C2BFF] hover:border-[#6C2BFF] shadow-lg flex items-center justify-center transition-all duration-300 z-40 ${
          showBackToTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
        }`}
        aria-label="Back to top"
      >
        <ArrowUp className="w-5 h-5" />
      </button>

    </div>
  );
};

export default CookiePolicy;
