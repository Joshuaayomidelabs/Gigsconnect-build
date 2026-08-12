import { SEO } from '../components/SEO';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, ArrowRight, ArrowUp, Info, Shield, Mail, Globe } from 'lucide-react';


const sections = [
  { id: 'introduction', title: '1. Introduction' },
  { id: 'information-we-collect', title: '2. Information We Collect' },
  { id: 'how-we-use-information', title: '3. How We Use Information' },
  { id: 'cookies-tracking', title: '4. Cookies & Tracking' },
  { id: 'how-we-share-information', title: '5. How We Share Information' },
  { id: 'data-security', title: '6. Data Security' },
  { id: 'your-rights', title: '7. Your Rights' },
  { id: 'third-party-services', title: '8. Third-Party Services' },
  { id: 'childrens-privacy', title: '9. Children\'s Privacy' },
  { id: 'international-users', title: '10. International Users' },
  { id: 'policy-updates', title: '11. Policy Updates' },
  { id: 'contact-us', title: '12. Contact Us' },
];

const sectionContent: Record<string, React.ReactNode> = {
  'introduction': (
    <div className="space-y-6 text-gray-600 leading-[1.8] text-[1.05rem]">
      <p>Welcome to GigsConnect. We are committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our platform or use our services.</p>
      <p>As Africa's premier creator marketplace, we connect talented creators with brands, agencies, and businesses. To facilitate these connections, we require certain information from you. By using GigsConnect, you consent to the data practices described in this policy.</p>
    </div>
  ),
  'information-we-collect': (
    <div className="space-y-6 text-gray-600 leading-[1.8] text-[1.05rem]">
      <p>We collect personal information that you voluntarily provide to us when registering on the platform, expressing an interest in obtaining information about us or our products and services, or otherwise contacting us.</p>
      <p><strong className="text-[#111827] font-semibold">Account & Profile Information:</strong> When you create an account, we collect your name, email address, password, location, professional title, skills, and categories.</p>
      <p><strong className="text-[#111827] font-semibold">Portfolio & Content:</strong> As a creator, you may upload portfolio items, project descriptions, photos, videos, and links to external works. Clients may post gig descriptions, requirements, and budget details.</p>
      <p><strong className="text-[#111827] font-semibold">Communications:</strong> We collect information when you apply for gigs, message other users on the platform, contact customer support, or subscribe to our newsletter.</p>
      <p><strong className="text-[#111827] font-semibold">Automatically Collected Information:</strong> We automatically collect certain information when you visit, use, or navigate the platform. This includes your IP address, browser and device characteristics, operating system, language preferences, referring URLs, device name, country, location, and information about how and when you use our platform.</p>
    </div>
  ),
  'how-we-use-information': (
    <div className="space-y-6 text-gray-600 leading-[1.8] text-[1.05rem]">
      <p>We use personal information collected via our platform for a variety of business purposes described below:</p>
      <ul className="list-disc pl-6 space-y-3 marker:text-[#4B0082]">
        <li><strong className="text-[#111827] font-semibold">To facilitate account creation and logon process:</strong> We use your information to create and manage your user account.</li>
        <li><strong className="text-[#111827] font-semibold">To enable user-to-user communications:</strong> We use your information to allow you to communicate with other users, such as sending gig applications and direct messages.</li>
        <li><strong className="text-[#111827] font-semibold">To match creators with gigs:</strong> We use your skills, location, and profile data to recommend relevant gigs and suggest suitable creators to clients.</li>
        <li><strong className="text-[#111827] font-semibold">To process payments and subscriptions:</strong> We use your information to facilitate payments, manage subscriptions, and process transactions securely.</li>
        <li><strong className="text-[#111827] font-semibold">To improve our platform:</strong> We use analytics to understand how users interact with our features, helping us optimize the user experience and develop new tools.</li>
        <li><strong className="text-[#111827] font-semibold">To send administrative and marketing emails:</strong> We may send you platform updates, security alerts, newsletter content, and promotional messages (which you can opt out of at any time).</li>
        <li><strong className="text-[#111827] font-semibold">For fraud prevention and security:</strong> We monitor platform activity to detect, prevent, and respond to fraud, abuse, and security risks.</li>
      </ul>
    </div>
  ),
  'cookies-tracking': (
    <div className="space-y-6 text-gray-600 leading-[1.8] text-[1.05rem]">
      <p>We use cookies and similar tracking technologies (like web beacons and pixels) to access or store information. These technologies help us recognize you, remember your preferences, and understand how you navigate through GigsConnect.</p>
      <p>You can set your browser to refuse all or some browser cookies, or to alert you when websites set or access cookies. If you disable or refuse cookies, please note that some parts of the platform may become inaccessible or not function properly.</p>
    </div>
  ),
  'how-we-share-information': (
    <div className="space-y-6 text-gray-600 leading-[1.8] text-[1.05rem]">
      <p>We only share your information in the following situations:</p>
      <ul className="list-disc pl-6 space-y-3 marker:text-[#4B0082]">
        <li><strong className="text-[#111827] font-semibold">With other users:</strong> When you create a public profile, apply for a gig, or post a gig, relevant information (such as your name, portfolio, skills, and gig details) is visible to other users on the platform.</li>
        <li><strong className="text-[#111827] font-semibold">With service providers:</strong> We may share your data with third-party vendors, service providers, contractors, or agents who perform services for us or on our behalf, such as payment processing, data analysis, email delivery, hosting services, and customer service.</li>
        <li><strong className="text-[#111827] font-semibold">For legal obligations:</strong> We may disclose your information where we are legally required to do so in order to comply with applicable law, governmental requests, a judicial proceeding, court order, or legal process.</li>
        <li><strong className="text-[#111827] font-semibold">To protect rights:</strong> We may disclose your information where we believe it is necessary to investigate, prevent, or take action regarding potential violations of our policies, suspected fraud, situations involving potential threats to the safety of any person, and illegal activities.</li>
      </ul>
    </div>
  ),
  'data-security': (
    <div className="space-y-6 text-gray-600 leading-[1.8] text-[1.05rem]">
      <p>We have implemented appropriate technical and organizational security measures designed to protect the security of any personal information we process. This includes encryption of data in transit and at rest, secure server infrastructure, and strict access controls.</p>
      <p>However, despite our safeguards and efforts to secure your information, no electronic transmission over the Internet or information storage technology can be guaranteed to be 100% secure. Therefore, we cannot promise or guarantee that hackers, cybercriminals, or other unauthorized third parties will not be able to defeat our security and improperly collect, access, steal, or modify your information.</p>
    </div>
  ),
  'your-rights': (
    <div className="space-y-6 text-gray-600 leading-[1.8] text-[1.05rem]">
      <p>Depending on your location, you may have certain rights regarding your personal information, such as the right to:</p>
      <ul className="list-disc pl-6 space-y-3 marker:text-[#4B0082]">
        <li>Request access and obtain a copy of your personal information.</li>
        <li>Request rectification of inaccurate personal data.</li>
        <li>Request erasure of your personal information (right to be forgotten).</li>
        <li>Restrict or object to the processing of your personal information.</li>
        <li>Data portability.</li>
      </ul>
      <p>To exercise these rights, you can update your account settings directly within the platform or contact our support team. We will respond to your request within a reasonable timeframe and in accordance with applicable data protection laws.</p>
    </div>
  ),
  'third-party-services': (
    <div className="space-y-6 text-gray-600 leading-[1.8] text-[1.05rem]">
      <p>The platform may contain links to third-party websites, applications, and services, including integrations with external portfolio sites or social media networks. We are not responsible for the privacy practices or the content of such third parties. We encourage you to read the privacy policies of any third-party services you access through GigsConnect.</p>
    </div>
  ),
  'childrens-privacy': (
    <div className="space-y-6 text-gray-600 leading-[1.8] text-[1.05rem]">
      <p>GigsConnect is not directed to, and we do not knowingly collect personal information from, children under the age of 18. If we become aware that we have collected personal information from a child under 18, we will take reasonable steps to delete such information from our records as quickly as possible. If you believe we might have any information from or about a child under 18, please contact us immediately.</p>
    </div>
  ),
  'international-users': (
    <div className="space-y-6 text-gray-600 leading-[1.8] text-[1.05rem]">
      <p>GigsConnect operates primarily across Africa but utilizes global cloud infrastructure. By using our platform, you understand and acknowledge that your personal information may be transferred to, stored, and processed in facilities located in different countries.</p>
      <p>We will take all reasonable steps necessary to ensure that your data is treated securely and in accordance with this Privacy Policy and applicable international data protection standards.</p>
    </div>
  ),
  'policy-updates': (
    <div className="space-y-6 text-gray-600 leading-[1.8] text-[1.05rem]">
      <p>We may update this Privacy Policy from time to time. The updated version will be indicated by an updated "Last Updated" date and the updated version will be effective as soon as it is accessible.</p>
      <p>If we make material changes to this Privacy Policy, we may notify you either by prominently posting a notice of such changes on the platform or by directly sending you a notification. We encourage you to review this Privacy Policy frequently to be informed of how we are protecting your information.</p>
    </div>
  ),
  'contact-us': (
    <div className="space-y-6 text-gray-600 leading-[1.8] text-[1.05rem]">
      <p>If you have questions or comments about this policy, or if you wish to exercise your privacy rights, you may contact our Data Protection Officer (DPO) or our support team.</p>
      <p>
        Email: <a href="mailto:privacy@gigsconnect.africa" className="font-semibold text-[#4B0082] hover:text-[#3a0066] transition-colors underline underline-offset-4 decoration-[#4B0082]/30 hover:decoration-[#4B0082]">privacy@gigsconnect.africa</a><br/>
        Support: <a href="mailto:support@gigsconnect.africa" className="font-semibold text-[#4B0082] hover:text-[#3a0066] transition-colors underline underline-offset-4 decoration-[#4B0082]/30 hover:decoration-[#4B0082]">support@gigsconnect.africa</a>
      </p>
    </div>
  ),
};

const PrivacyPolicy: React.FC = () => {
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
      <SEO title="Privacy Policy | GigsConnect" canonical="https://gigsconnect.africa/privacy" />

      
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
          <h1 className="text-4xl md:text-5xl font-black text-[#111827] tracking-tight mb-6">Privacy Policy</h1>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
            Learn how GigsConnect collects, uses, protects, and manages your personal information while you use our platform.
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
          
          <div className="mb-12 pb-8 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-sm font-bold text-[#4B0082] uppercase tracking-widest">Last Updated</p>
              <p className="text-[#111827] font-medium mt-1 text-lg">July 2026</p>
            </div>
          </div>

          {/* Important Notice Callout */}
          <div className="mb-12 p-6 bg-blue-50/50 border border-blue-100 rounded-2xl flex gap-4">
            <Info className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
            <p className="text-blue-900 leading-relaxed text-[1.05rem]">
              <strong>Important Notice:</strong> This Privacy Policy describes how GigsConnect collects, uses, stores, and protects user information. By accessing or using the platform, you acknowledge and consent to the data practices described herein.
            </p>
          </div>

          <div className="prose prose-gray max-w-none">
            {sections.map((section, index) => (
              <React.Fragment key={section.id}>
                <div id={section.id} className="scroll-mt-32">
                  <h2 className="text-2xl font-bold text-[#111827] tracking-tight mb-6">
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
                <h3 className="text-2xl font-bold text-[#111827]">Still have questions?</h3>
                <p className="text-gray-600 text-lg">Our support team is here to help with any privacy-related inquiries.</p>
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
                <span>Dedicated Privacy Team</span>
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

export default PrivacyPolicy;
