import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, ArrowRight } from 'lucide-react';

const sections = [
  { id: 'introduction', title: '1. Introduction' },
  { id: 'eligibility', title: '2. Eligibility' },
  { id: 'user-accounts', title: '3. User Accounts' },
  { id: 'creator-responsibilities', title: '4. Creator Responsibilities' },
  { id: 'marketplace-rules', title: '5. Marketplace Rules' },
  { id: 'community-standards', title: '6. Community Standards' },
  { id: 'payments', title: '7. Payments & Subscriptions' },
  { id: 'intellectual-property', title: '8. Intellectual Property' },
  { id: 'privacy', title: '9. Privacy' },
  { id: 'termination', title: '10. Termination' },
  { id: 'liability', title: '11. Limitation of Liability' },
  { id: 'governing-law', title: '12. Governing Law' },
  { id: 'changes', title: '13. Changes to these Terms' },
  { id: 'contact', title: '14. Contact Information' },
];

const sectionContent: Record<string, React.ReactNode> = {
  'introduction': (
    <>
      <p>Welcome to GigsConnect, Africa's leading creator ecosystem. These Terms & Conditions ("Terms") govern your access to and use of our platform, website, and associated services (collectively, the "Platform").</p>
      <p>GigsConnect serves as a marketplace connecting talented creators, freelancers, and professionals with businesses, agencies, brands, and organizations seeking creative services across Africa. By creating an account or using the Platform, you agree to be bound by these Terms. If you do not agree, you must not use our services.</p>
    </>
  ),
  'eligibility': (
    <>
      <p>To use GigsConnect, you must be at least 18 years of age or the age of legal majority in your jurisdiction. By registering, you represent and warrant that you have the legal capacity to enter into binding contracts.</p>
      <p>If you are creating an account on behalf of a business, brand, agency, or other organization, you represent that you have the authority to bind that entity to these Terms. We reserve the right to refuse service, close accounts of any users, and change eligibility requirements at any time.</p>
    </>
  ),
  'user-accounts': (
    <>
      <p>To access most features of the Platform, you must register for an account. You agree to provide accurate, current, and complete information during the registration process and to keep your profile updated.</p>
      <p>You are solely responsible for safeguarding your account credentials and for all activities that occur under your account. You must immediately notify GigsConnect of any unauthorized use of your account or any other breach of security. GigsConnect will not be liable for any loss or damage arising from your failure to protect your login information.</p>
    </>
  ),
  'creator-responsibilities': (
    <>
      <p>As a creator on GigsConnect, you represent that you possess the skills, qualifications, and necessary licenses to perform the services you offer. You agree to deliver high-quality work, adhere to agreed-upon deadlines, and communicate professionally with clients.</p>
      <p>You are responsible for determining your own pricing, negotiating terms directly with clients, and ensuring that the services you provide do not violate any applicable laws or third-party rights. Misrepresenting your skills, using deceptive portfolio pieces, or failing to deliver promised work may result in account suspension.</p>
    </>
  ),
  'marketplace-rules': (
    <>
      <p>GigsConnect facilitates connections between creators and clients but is not a direct party to the contracts established between users. Users are expected to conduct their communications, project management, and transactions primarily within the Platform.</p>
      <p><strong>Circumvention:</strong> Attempting to move communications or payments off-platform to avoid platform fees is strictly prohibited. Users found engaging in circumvention may face immediate permanent suspension and forfeit access to any ongoing projects or funds held in escrow.</p>
    </>
  ),
  'community-standards': (
    <>
      <p>We are committed to maintaining a safe, inclusive, and professional environment. Users must treat each other with respect. Harassment, discrimination, hate speech, threats, and abusive behavior are strictly prohibited.</p>
      <p>You agree not to use the Platform to post inappropriate, offensive, or illegal content. GigsConnect reserves the right to review communications and content to ensure compliance with our Community Standards, and we may remove content or suspend accounts that violate these rules.</p>
    </>
  ),
  'payments': (
    <>
      <p><strong>Gig Payments:</strong> Clients agree to pay for services as agreed upon with creators. GigsConnect may facilitate payments via third-party processors. Clients must ensure sufficient funds are available. Creators will receive payouts subject to any applicable platform fees and processing times.</p>
      <p><strong>Subscriptions:</strong> Certain premium features on GigsConnect may require a paid subscription. Subscription fees will be billed automatically on a recurring basis until canceled. All fees are non-refundable except as required by law or explicitly stated in our refund policy.</p>
    </>
  ),
  'intellectual-property': (
    <>
      <p><strong>User Content:</strong> You retain ownership of the content you upload to your portfolio. By uploading content, you grant GigsConnect a non-exclusive, worldwide, royalty-free license to use, display, and promote your work for the purpose of marketing the Platform and showcasing your talent.</p>
      <p><strong>Work Product:</strong> Unless otherwise agreed in writing between a creator and a client, ownership of the final delivered work transfers to the client upon full payment. Creators must ensure they do not incorporate unauthorized copyrighted material into delivered work.</p>
      <p><strong>GigsConnect IP:</strong> The Platform, including its design, logo, code, and original content, is the exclusive property of GigsConnect and is protected by copyright and trademark laws.</p>
    </>
  ),
  'privacy': (
    <>
      <p>Your privacy is important to us. Our data collection, usage, and protection practices are detailed in our Privacy Policy. By using GigsConnect, you consent to the processing of your personal information as outlined in the Privacy Policy.</p>
    </>
  ),
  'termination': (
    <>
      <p>You may terminate your account at any time by contacting support or using the account deletion feature. GigsConnect reserves the right to suspend or terminate your account, restrict your access to the Platform, or remove your content at any time, without notice, if we believe you have violated these Terms or pose a risk to the community.</p>
      <p>Upon termination, your right to use the Platform will immediately cease, and you remain liable for any outstanding obligations or pending payments.</p>
    </>
  ),
  'liability': (
    <>
      <p>GigsConnect is provided on an "as-is" and "as-available" basis. We make no warranties, express or implied, regarding the reliability, accuracy, or availability of the Platform.</p>
      <p>To the maximum extent permitted by law, GigsConnect and its affiliates shall not be liable for any indirect, incidental, consequential, or punitive damages, including loss of profits, data, or goodwill, arising from your use of the Platform or interactions with other users. Your interactions with other users are solely at your own risk.</p>
    </>
  ),
  
  'governing-law': (
    <>
      <p>These Terms shall be governed by and construed in accordance with the laws of the applicable jurisdiction within Africa where GigsConnect operates, without regard to its conflict of law provisions.</p>
      <p>Any dispute arising from these Terms or your use of the Platform will be subject to the exclusive jurisdiction of the competent courts in that jurisdiction, although we retain the right to bring proceedings against you for breach of these conditions in your country of residence.</p>
    </>
  ),
  'changes': (
    <>
      <p>We reserve the right to modify or update these Terms & Conditions at any time. If we make material changes, we will notify you via email or by posting a prominent notice on the Platform. Your continued use of GigsConnect after the effective date of the revised Terms constitutes your acceptance of the changes.</p>
    </>
  ),
  'contact': (
    <>
      <p>If you have any questions, concerns, or feedback regarding these Terms & Conditions, please reach out to our team.</p>
      <p className="pt-2">Email: <strong>legal@gigsconnect.africa</strong><br/>
      Support: <strong>support@gigsconnect.africa</strong></p>
    </>
  ),
};

const TermsAndConditions: React.FC = () => {
  const [activeSection, setActiveSection] = useState(sections[0].id);
  const [isMobileTocOpen, setIsMobileTocOpen] = useState(false);

  useEffect(() => {
    // Scroll to top on mount
    window.scrollTo(0, 0);

    const handleScroll = () => {
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

  return (
    <div className="w-full bg-gray-50 flex flex-col font-sans min-h-screen">
      
      {/* Hero Section */}
      <div className="pt-24 pb-16 px-6 md:px-8 bg-white border-b border-gray-100 relative overflow-hidden flex-shrink-0">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#4B0082]/5 rounded-full blur-[100px] pointer-events-none -translate-y-1/2 translate-x-1/3"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10 mt-8">
          <h1 className="text-4xl md:text-5xl font-black text-[#111827] tracking-tight mb-6">Terms & Conditions</h1>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
            Please read these Terms & Conditions carefully before using GigsConnect. By accessing or using the platform, you agree to be bound by these terms.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 max-w-[1200px] mx-auto w-full px-6 md:px-8 py-12 flex flex-col md:flex-row gap-8 lg:gap-12">
        
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
        <div className="flex-1 max-w-3xl bg-white p-8 md:p-10 lg:p-12 rounded-3xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
          
          <div className="mb-12 pb-6 border-b border-gray-100">
            <p className="text-sm font-bold text-[#4B0082] uppercase tracking-widest">Last Updated</p>
            <p className="text-[#111827] font-medium mt-1">July 2026</p>
          </div>

          <div className="prose prose-gray max-w-none">
            {sections.map((section) => (
              <div key={section.id} id={section.id} className="scroll-mt-32 mb-12 last:mb-0">
                <h2 className="text-2xl font-bold text-[#111827] tracking-tight mb-4">{section.title}</h2>
                <div className="text-gray-600 leading-relaxed space-y-4">
                  {sectionContent[section.id]}
                </div>
              </div>
            ))}
          </div>

          {/* Need Help Section */}
          <div className="mt-16 pt-10 border-t border-gray-100">
            <div className="bg-[#4B0082]/5 rounded-2xl p-8 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="text-xl font-bold text-[#111827] mb-2">Need help understanding our terms?</h3>
                <p className="text-gray-600 text-sm">Our support team is here to help with any questions.</p>
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
      
    </div>
  );
};

export default TermsAndConditions;
