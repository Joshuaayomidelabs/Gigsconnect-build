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
  { id: 'changes', title: '12. Changes to these Terms' },
  { id: 'contact', title: '13. Contact Information' },
];

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
                  <p>Content for {section.title} goes here. This section is ready for future updates.</p>
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
