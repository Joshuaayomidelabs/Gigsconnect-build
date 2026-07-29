const fs = require('fs');

const code = `import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, ArrowRight, ArrowUp, Info, Shield, Mail } from 'lucide-react';

const sections = [
  { id: 'introduction', title: '1. Introduction' },
  { id: 'information-we-collect', title: '2. Information We Collect' },
  { id: 'how-we-use-information', title: '3. How We Use Information' },
  { id: 'cookies-tracking', title: '4. Cookies & Tracking' },
  { id: 'how-we-share-information', title: '5. How We Share Information' },
  { id: 'data-security', title: '6. Data Security' },
  { id: 'your-rights', title: '7. Your Rights' },
  { id: 'third-party-services', title: '8. Third-Party Services' },
  { id: 'childrens-privacy', title: '9. Children\\'s Privacy' },
  { id: 'international-users', title: '10. International Users' },
  { id: 'policy-updates', title: '11. Policy Updates' },
  { id: 'contact-us', title: '12. Contact Us' },
];

const Callout: React.FC<{ children: React.ReactNode; type?: 'info' | 'warning' }> = ({ children, type = 'info' }) => {
  const isInfo = type === 'info';
  return (
    <div className={\`my-6 p-5 rounded-xl flex gap-4 \${isInfo ? 'bg-blue-50 border border-blue-100' : 'bg-amber-50 border border-amber-100'}\`}>
      <Info className={\`w-6 h-6 flex-shrink-0 mt-0.5 \${isInfo ? 'text-blue-600' : 'text-amber-600'}\`} />
      <div className={\`text-sm leading-relaxed \${isInfo ? 'text-blue-900' : 'text-amber-900'}\`}>
        {children}
      </div>
    </div>
  );
};

const sectionContent: Record<string, React.ReactNode> = {
  'introduction': (
    <>
      <p>Welcome to GigsConnect. We are committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our platform or use our services.</p>
      <Callout>
        <strong>Note:</strong> By using GigsConnect, you consent to the data practices described in this policy. If you do not agree with the terms of this privacy policy, please do not access the platform.
      </Callout>
      <p>As Africa's premier creator marketplace, we connect talented creators with brands, agencies, and businesses. To facilitate these connections, we require certain information from you.</p>
    </>
  ),
  'information-we-collect': (
    <>
      <p>We collect personal information that you voluntarily provide to us when registering on the platform, expressing an interest in obtaining information about us or our products and services, or otherwise contacting us.</p>
      
      <div className="space-y-4 mt-6">
        <div className="bg-gray-50 p-5 rounded-xl border border-gray-100">
          <h4 className="font-bold text-[#111827] mb-2 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4B0082]"></span> Account & Profile Information
          </h4>
          <p className="text-sm">When you create an account, we collect your name, email address, password, location, professional title, skills, and categories.</p>
        </div>
        
        <div className="bg-gray-50 p-5 rounded-xl border border-gray-100">
          <h4 className="font-bold text-[#111827] mb-2 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4B0082]"></span> Portfolio & Content
          </h4>
          <p className="text-sm">As a creator, you may upload portfolio items, project descriptions, photos, videos, and links to external works. Clients may post gig descriptions, requirements, and budget details.</p>
        </div>

        <div className="bg-gray-50 p-5 rounded-xl border border-gray-100">
          <h4 className="font-bold text-[#111827] mb-2 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4B0082]"></span> Communications
          </h4>
          <p className="text-sm">We collect information when you apply for gigs, message other users on the platform, contact customer support, or subscribe to our newsletter.</p>
        </div>
      </div>

      <p className="mt-6"><strong>Automatically Collected Information:</strong> We automatically collect certain information when you visit, use, or navigate the platform. This includes your IP address, browser and device characteristics, operating system, language preferences, referring URLs, device name, country, location, and information about how and when you use our platform.</p>
    </>
  ),
  'how-we-use-information': (
    <>
      <p>We use personal information collected via our platform for a variety of business purposes described below:</p>
      <ul className="list-none space-y-4 my-6 pl-0">
        <li className="flex items-start gap-3">
          <div className="w-6 h-6 rounded-full bg-[#4B0082]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
            <div className="w-2 h-2 rounded-full bg-[#4B0082]"></div>
          </div>
          <div>
            <strong className="text-[#111827] block mb-1">Account & Communications</strong>
            <span className="text-sm">To facilitate account creation, manage user profiles, and enable user-to-user communications like direct messaging.</span>
          </div>
        </li>
        <li className="flex items-start gap-3">
          <div className="w-6 h-6 rounded-full bg-[#4B0082]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
            <div className="w-2 h-2 rounded-full bg-[#4B0082]"></div>
          </div>
          <div>
            <strong className="text-[#111827] block mb-1">Platform Operations</strong>
            <span className="text-sm">To match creators with gigs, process payments, manage subscriptions, and ensure transactions are secure.</span>
          </div>
        </li>
        <li className="flex items-start gap-3">
          <div className="w-6 h-6 rounded-full bg-[#4B0082]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
            <div className="w-2 h-2 rounded-full bg-[#4B0082]"></div>
          </div>
          <div>
            <strong className="text-[#111827] block mb-1">Improvement & Security</strong>
            <span className="text-sm">To monitor platform activity for fraud prevention, analyze usage to improve our features, and send administrative or security alerts.</span>
          </div>
        </li>
      </ul>
    </>
  ),
  'cookies-tracking': (
    <>
      <p>We use cookies and similar tracking technologies (like web beacons and pixels) to access or store information. These technologies help us recognize you, remember your preferences, and understand how you navigate through GigsConnect.</p>
      <Callout type="warning">
        You can set your browser to refuse all or some browser cookies. However, if you disable or refuse cookies, please note that some parts of the platform may become inaccessible or not function properly.
      </Callout>
    </>
  ),
  'how-we-share-information': (
    <>
      <p>We only share your information in specific, necessary situations:</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
        <div className="p-4 border border-gray-200 rounded-xl">
          <strong className="text-[#111827] block mb-2">With Other Users</strong>
          <p className="text-sm m-0">When you create a public profile or apply for a gig, relevant information like your portfolio and skills is visible to other users.</p>
        </div>
        <div className="p-4 border border-gray-200 rounded-xl">
          <strong className="text-[#111827] block mb-2">Service Providers</strong>
          <p className="text-sm m-0">We share data with third-party vendors who perform services like payment processing, hosting, and data analysis.</p>
        </div>
        <div className="p-4 border border-gray-200 rounded-xl">
          <strong className="text-[#111827] block mb-2">Legal Obligations</strong>
          <p className="text-sm m-0">We may disclose your information to comply with applicable law, governmental requests, or legal processes.</p>
        </div>
        <div className="p-4 border border-gray-200 rounded-xl">
          <strong className="text-[#111827] block mb-2">To Protect Rights</strong>
          <p className="text-sm m-0">Information may be disclosed to investigate fraud, potential threats to safety, or violations of our policies.</p>
        </div>
      </div>
    </>
  ),
  'data-security': (
    <>
      <p>We have implemented appropriate technical and organizational security measures designed to protect the security of any personal information we process. This includes encryption of data in transit and at rest, secure server infrastructure, and strict access controls.</p>
      <p>However, despite our safeguards and efforts to secure your information, no electronic transmission over the Internet or information storage technology can be guaranteed to be 100% secure. Therefore, we cannot promise or guarantee that hackers, cybercriminals, or other unauthorized third parties will not be able to defeat our security.</p>
    </>
  ),
  'your-rights': (
    <>
      <p>Depending on your location, you may have certain rights regarding your personal information, such as the right to:</p>
      <ul className="list-disc pl-5 mt-4 space-y-2 text-gray-700">
        <li>Request access and obtain a copy of your personal information.</li>
        <li>Request rectification of inaccurate personal data.</li>
        <li>Request erasure of your personal information (right to be forgotten).</li>
        <li>Restrict or object to the processing of your personal information.</li>
        <li>Data portability.</li>
      </ul>
      <p className="mt-6">To exercise these rights, you can update your account settings directly within the platform or contact our support team. We will respond to your request within a reasonable timeframe and in accordance with applicable data protection laws.</p>
    </>
  ),
  'third-party-services': (
    <>
      <p>The platform may contain links to third-party websites, applications, and services, including integrations with external portfolio sites or social media networks. We are not responsible for the privacy practices or the content of such third parties. We encourage you to read the privacy policies of any third-party services you access through GigsConnect.</p>
    </>
  ),
  'childrens-privacy': (
    <>
      <p>GigsConnect is not directed to, and we do not knowingly collect personal information from, children under the age of 18. If we become aware that we have collected personal information from a child under 18, we will take reasonable steps to delete such information from our records as quickly as possible.</p>
      <Callout>
        If you believe we might have any information from or about a child under 18, please contact us immediately at privacy@gigsconnect.africa.
      </Callout>
    </>
  ),
  'international-users': (
    <>
      <p>GigsConnect operates primarily across Africa but utilizes global cloud infrastructure. By using our platform, you understand and acknowledge that your personal information may be transferred to, stored, and processed in facilities located in different countries.</p>
      <p>We will take all reasonable steps necessary to ensure that your data is treated securely and in accordance with this Privacy Policy and applicable international data protection standards.</p>
    </>
  ),
  'policy-updates': (
    <>
      <p>We may update this Privacy Policy from time to time. The updated version will be indicated by an updated "Last Updated" date and the updated version will be effective as soon as it is accessible.</p>
      <p>If we make material changes to this Privacy Policy, we may notify you either by prominently posting a notice of such changes on the platform or by directly sending you a notification. We encourage you to review this Privacy Policy frequently to be informed of how we are protecting your information.</p>
    </>
  ),
  'contact-us': (
    <>
      <p>If you have questions or comments about this policy, or if you wish to exercise your privacy rights, you may contact our Data Protection Officer (DPO) or our support team.</p>
      
      <div className="grid sm:grid-cols-2 gap-4 mt-6">
        <a href="mailto:privacy@gigsconnect.africa" className="flex items-center gap-4 p-5 rounded-xl border border-gray-200 hover:border-[#4B0082] hover:shadow-md transition-all group bg-white">
          <div className="w-12 h-12 rounded-full bg-[#4B0082]/10 flex items-center justify-center text-[#4B0082] group-hover:bg-[#4B0082] group-hover:text-white transition-colors">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-0.5 font-medium">Privacy Matters</p>
            <strong className="text-[#111827] group-hover:text-[#4B0082] transition-colors">privacy@gigsconnect.africa</strong>
          </div>
        </a>
        <a href="mailto:support@gigsconnect.africa" className="flex items-center gap-4 p-5 rounded-xl border border-gray-200 hover:border-[#4B0082] hover:shadow-md transition-all group bg-white">
          <div className="w-12 h-12 rounded-full bg-[#4B0082]/10 flex items-center justify-center text-[#4B0082] group-hover:bg-[#4B0082] group-hover:text-white transition-colors">
            <Mail className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-0.5 font-medium">General Support</p>
            <strong className="text-[#111827] group-hover:text-[#4B0082] transition-colors">support@gigsconnect.africa</strong>
          </div>
        </a>
      </div>
    </>
  ),
};

const PrivacyPolicy: React.FC = () => {
  const [activeSection, setActiveSection] = useState(sections[0].id);
  const [isMobileTocOpen, setIsMobileTocOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    // Scroll to top on mount
    window.scrollTo(0, 0);

    const handleScroll = () => {
      // Progress Bar Calculation
      const totalScroll = document.documentElement.scrollTop;
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scroll = \`\${(totalScroll / windowHeight) * 100}%\`;
      setScrollProgress(Number((totalScroll / windowHeight) * 100));

      // Back to top visibility
      if (totalScroll > 500) {
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
          style={{ width: \`\${scrollProgress}%\` }}
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
      <div className="flex-1 max-w-[1200px] mx-auto w-full px-6 md:px-8 py-12 flex flex-col md:flex-row gap-8 lg:gap-12">
        
        {/* Mobile TOC Toggle */}
        <div className="md:hidden w-full sticky top-20 z-30">
          <button 
            onClick={() => setIsMobileTocOpen(!isMobileTocOpen)}
            className="w-full flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200 shadow-sm"
          >
            <span className="font-semibold text-[#111827]">Table of Contents</span>
            <ChevronDown className={\`w-5 h-5 text-gray-500 transition-transform duration-300 \${isMobileTocOpen ? 'rotate-180' : ''}\`} />
          </button>
          
          {isMobileTocOpen && (
            <div className="absolute top-full left-0 right-0 mt-2 p-2 bg-white rounded-xl border border-gray-200 shadow-lg max-h-[60vh] overflow-y-auto z-40">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className={\`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors \${
                    activeSection === section.id 
                      ? 'bg-[#4B0082]/10 text-[#4B0082]' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-[#111827]'
                  }\`}
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
                  className={\`w-full text-left px-4 py-2.5 rounded-lg text-sm transition-all duration-200 \${
                    activeSection === section.id 
                      ? 'bg-[#4B0082]/10 text-[#4B0082] font-semibold' 
                      : 'text-gray-500 hover:text-[#111827] hover:bg-gray-50 font-medium'
                  }\`}
                >
                  {section.title}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Content Sections */}
        <div className="flex-1 max-w-3xl bg-white p-6 sm:p-8 md:p-10 lg:p-12 rounded-3xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
          
          <div className="mb-12 pb-6 border-b border-gray-100">
            <p className="text-sm font-bold text-[#4B0082] uppercase tracking-widest">Last Updated</p>
            <p className="text-[#111827] font-medium mt-1">July 2026</p>
          </div>

          <div className="prose prose-gray max-w-none text-gray-600">
            {sections.map((section) => (
              <div key={section.id} id={section.id} className="scroll-mt-32 mb-14 last:mb-0">
                <h2 className="text-2xl font-bold text-[#111827] tracking-tight mb-5">{section.title}</h2>
                <div className="leading-relaxed text-[15px] sm:text-base">
                  {sectionContent[section.id]}
                </div>
              </div>
            ))}
          </div>

          {/* Need Help Section */}
          <div className="mt-16 pt-10 border-t border-gray-100">
            <div className="bg-[#4B0082]/5 rounded-2xl p-8 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="text-xl font-bold text-[#111827] mb-2">Need help understanding our policies?</h3>
                <p className="text-gray-600 text-sm">Our support team is here to help with any privacy-related questions.</p>
              </div>
              <Link 
                to="/contact-support" 
                className="inline-flex items-center justify-center h-12 px-6 rounded-xl bg-[#4B0082] text-white font-semibold hover:bg-[#3a0066] transition-colors shrink-0 gap-2"
              >
                Contact Support <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

        </div>
      </div>
      
      {/* Back to Top Button */}
      <button
        onClick={scrollToTop}
        className={\`fixed bottom-8 right-8 w-12 h-12 rounded-full bg-white text-[#111827] border border-gray-200 shadow-lg flex items-center justify-center transition-all duration-300 hover:bg-gray-50 hover:scale-105 z-40 \${
          showBackToTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
        }\`}
        aria-label="Back to top"
      >
        <ArrowUp className="w-5 h-5" />
      </button>

    </div>
  );
};

export default PrivacyPolicy;
`;

fs.writeFileSync('src/pages/PrivacyPolicy.tsx', code);
