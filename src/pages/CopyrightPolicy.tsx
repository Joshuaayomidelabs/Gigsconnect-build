import { SEO } from '../components/SEO';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, ArrowRight, ArrowUp, ShieldCheck, Mail, Globe, Info, Scale } from 'lucide-react';


const sections = [
  { id: 'introduction', title: '1. Introduction' },
  { id: 'ownership', title: '2. Ownership of Content' },
  { id: 'responsibilities', title: '3. User Responsibilities' },
  { id: 'infringement', title: '4. Copyright Infringement' },
  { id: 'reporting', title: '5. Reporting Copyright Violations' },
  { id: 'review-process', title: '6. GigsConnect Review Process' },
  { id: 'counter-notification', title: '7. Counter-Notification Process' },
  { id: 'repeat-infringer', title: '8. Repeat Infringer Policy' },
  { id: 'contact', title: '9. Contact Information' },
];

const sectionContent: Record<string, React.ReactNode> = {
  'introduction': (
    <>
      <p>
        Welcome to the GigsConnect Copyright Policy. We respect the intellectual property rights of others and expect our users to do the same. As Africa's leading creator ecosystem, we are deeply committed to protecting the original work of creators across the continent.
      </p>
      <p className="mt-4">
        This policy outlines how we handle copyright claims, the responsibilities of our users, and the steps we take to address intellectual property disputes. Users are entirely responsible for the content they upload, post, or otherwise make available on GigsConnect.
      </p>
      <div className="bg-[#6C2BFF]/5 border border-[#6C2BFF]/20 p-5 rounded-xl mt-6 flex gap-4">
        <Scale className="w-6 h-6 text-[#6C2BFF] flex-shrink-0" />
        <p className="text-sm text-[#111827] font-medium">
          Remember: Creators retain ownership of their original work unless they explicitly grant rights to others through a contract or license.
        </p>
      </div>
    </>
  ),
  'ownership': (
    <>
      <p>
        At GigsConnect, we believe that creators should own their creations. You generally retain all ownership rights to the original content you produce and share on our platform. This includes, but is not limited to:
      </p>
      <div className="grid sm:grid-cols-2 gap-3 mt-6 mb-6">
        {['Images & Photographs', 'Videos & Animations', 'Audio & Podcasts', 'Music & Beats', 'Graphic Designs', 'Illustrations & Art', 'Articles & Copywriting', 'Source Code & Scripts', 'Portfolios', 'Digital Assets & Templates'].map(item => (
           <div key={item} className="flex items-center gap-2 text-gray-700">
             <div className="w-1.5 h-1.5 rounded-full bg-[#6C2BFF]"></div>
             <span>{item}</span>
           </div>
        ))}
      </div>
      <p>
        Uploading your content to GigsConnect does <strong>not</strong> transfer ownership to us or to other users. You simply grant us the licenses necessary to operate the platform, display your work, and provide our services, as detailed in our Terms & Conditions.
      </p>
    </>
  ),
  'responsibilities': (
    <>
      <p>To maintain a vibrant, trustworthy, and legal creative community, all GigsConnect users must adhere to the following responsibilities:</p>
      <ul className="space-y-4 mt-6 text-gray-700">
        <li className="flex items-start gap-3">
          <div className="mt-1 w-5 h-5 rounded bg-green-50 text-green-600 flex items-center justify-center flex-shrink-0">✓</div>
          <div><strong>Only upload owned or permitted content:</strong> Ensure you are the original creator or have explicit, documented permission to use, share, or sell the content.</div>
        </li>
        <li className="flex items-start gap-3">
          <div className="mt-1 w-5 h-5 rounded bg-green-50 text-green-600 flex items-center justify-center flex-shrink-0">✓</div>
          <div><strong>Respect licenses:</strong> If you use third-party assets (like stock photos, open-source code, or royalty-free music), adhere strictly to the terms of those licenses.</div>
        </li>
        <li className="flex items-start gap-3">
          <div className="mt-1 w-5 h-5 rounded bg-green-50 text-green-600 flex items-center justify-center flex-shrink-0">✓</div>
          <div><strong>Credit collaborators:</strong> Give proper attribution to co-creators, team members, or inspiration sources where appropriate.</div>
        </li>
        <li className="flex items-start gap-3">
          <div className="mt-1 w-5 h-5 rounded bg-red-50 text-red-600 flex items-center justify-center flex-shrink-0">✗</div>
          <div><strong>Avoid plagiarism:</strong> Do not pass off another person's work, ideas, or intellectual property as your own.</div>
        </li>
        <li className="flex items-start gap-3">
          <div className="mt-1 w-5 h-5 rounded bg-red-50 text-red-600 flex items-center justify-center flex-shrink-0">✗</div>
          <div><strong>Avoid unauthorized copying:</strong> Do not duplicate, clone, or trace existing works without permission.</div>
        </li>
        <li className="flex items-start gap-3">
          <div className="mt-1 w-5 h-5 rounded bg-red-50 text-red-600 flex items-center justify-center flex-shrink-0">✗</div>
          <div><strong>Avoid distributing copyrighted works:</strong> Do not share movies, software, music, or other copyrighted materials you do not have the right to distribute.</div>
        </li>
      </ul>
    </>
  ),
  'infringement': (
    <>
      <p>
        Copyright infringement occurs when a copyrighted work is reproduced, distributed, performed, publicly displayed, or made into a derivative work without the permission of the copyright owner. 
      </p>
      <h3 className="text-xl font-bold text-[#111827] mt-8 mb-4">Examples of Infringement on GigsConnect</h3>
      <p>The following actions generally constitute copyright infringement and are strictly prohibited:</p>
      <div className="space-y-4 mt-6">
        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex items-start gap-4">
          <div className="w-2 h-2 rounded-full bg-red-500 mt-2 flex-shrink-0"></div>
          <p className="text-gray-700">Uploading someone else's artwork, design, or photography and claiming it as your own.</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex items-start gap-4">
          <div className="w-2 h-2 rounded-full bg-red-500 mt-2 flex-shrink-0"></div>
          <p className="text-gray-700">Reposting another creator's portfolio pieces without their explicit permission.</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex items-start gap-4">
          <div className="w-2 h-2 rounded-full bg-red-500 mt-2 flex-shrink-0"></div>
          <p className="text-gray-700">Using copyrighted music, video clips, or sound effects in your promotional materials without authorization or proper licensing.</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex items-start gap-4">
          <div className="w-2 h-2 rounded-full bg-red-500 mt-2 flex-shrink-0"></div>
          <p className="text-gray-700">Selling copied designs, templates, or code that you did not originally create.</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex items-start gap-4">
          <div className="w-2 h-2 rounded-full bg-red-500 mt-2 flex-shrink-0"></div>
          <p className="text-gray-700">Publishing another person's written work, blog post, or copywriting as your own original service.</p>
        </div>
      </div>
    </>
  ),
  'reporting': (
    <>
      <p>
        If you are a copyright owner, or authorized to act on behalf of one, and believe that material on GigsConnect infringes your copyright, you may submit a copyright infringement report.
      </p>
      <h3 className="text-xl font-bold text-[#111827] mt-8 mb-4">Required Information</h3>
      <p>To process your report quickly, please include the following information:</p>
      <ul className="list-disc pl-6 space-y-3 text-gray-700 mt-4 mb-6 marker:text-[#6C2BFF]">
        <li><strong>Contact Information:</strong> Your full legal name, physical address, telephone number, and email address.</li>
        <li><strong>Description of Original Work:</strong> A detailed description of the copyrighted work that you claim has been infringed.</li>
        <li><strong>Link to Original Work:</strong> A URL or proof showing where the original, authorized work is located.</li>
        <li><strong>Link to Infringing Content:</strong> The exact URL(s) on GigsConnect where the allegedly infringing material is located.</li>
        <li><strong>Good-Faith Statement:</strong> A statement that you have a good faith belief that the use of the material is not authorized by the copyright owner, its agent, or the law.</li>
        <li><strong>Ownership Declaration:</strong> A statement, made under penalty of perjury, that the information in your notice is accurate and that you are the copyright owner or authorized to act on the owner's behalf.</li>
        <li><strong>Electronic Signature:</strong> Your physical or electronic signature.</li>
      </ul>
      <p className="font-medium text-orange-600 bg-orange-50 p-4 rounded-xl border border-orange-100">
        Note: Incomplete reports may delay our review process. Please ensure all requested information is provided.
      </p>
    </>
  ),
  'review-process': (
    <>
      <p>
        GigsConnect takes intellectual property claims seriously. All reports are reviewed fairly and promptly by our Trust & Safety team.
      </p>
      <p className="mt-4">
        Upon receiving a complete and valid copyright infringement report, possible actions include:
      </p>
      <div className="space-y-4 mt-6 mb-6">
         <div className="flex items-start gap-4 p-4 rounded-xl border border-gray-100">
           <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold shrink-0 text-sm">1</div>
           <div>
             <h4 className="font-bold text-[#111827]">Requesting Additional Information</h4>
             <p className="text-gray-600 text-sm mt-1">If your report is unclear or incomplete, we may reach out for clarification before taking action.</p>
           </div>
         </div>
         <div className="flex items-start gap-4 p-4 rounded-xl border border-gray-100">
           <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold shrink-0 text-sm">2</div>
           <div>
             <h4 className="font-bold text-[#111827]">Temporarily Hiding Content</h4>
             <p className="text-gray-600 text-sm mt-1">We may disable public access to the disputed content while the investigation is ongoing.</p>
           </div>
         </div>
         <div className="flex items-start gap-4 p-4 rounded-xl border border-gray-100">
           <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold shrink-0 text-sm">3</div>
           <div>
             <h4 className="font-bold text-[#111827]">Removing Infringing Content</h4>
             <p className="text-gray-600 text-sm mt-1">If infringement is confirmed, the content will be permanently removed from GigsConnect.</p>
           </div>
         </div>
         <div className="flex items-start gap-4 p-4 rounded-xl border border-gray-100">
           <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold shrink-0 text-sm">4</div>
           <div>
             <h4 className="font-bold text-[#111827]">Issuing Warnings & Suspensions</h4>
             <p className="text-gray-600 text-sm mt-1">We may issue formal warnings to users who infringe copyrights, or temporarily suspend their accounts.</p>
           </div>
         </div>
         <div className="flex items-start gap-4 p-4 rounded-xl border border-red-100 bg-red-50/30">
           <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-bold shrink-0 text-sm">5</div>
           <div>
             <h4 className="font-bold text-red-700">Permanent Termination</h4>
             <p className="text-gray-700 text-sm mt-1">For repeated or serious violations, we will permanently terminate the offending user's account.</p>
           </div>
         </div>
      </div>
    </>
  ),
  'counter-notification': (
    <>
      <p>
        If you believe your content was removed in error, or that you have the necessary rights to use the content, you may submit a counter-notification to dispute the removal.
      </p>
      <h3 className="text-xl font-bold text-[#111827] mt-8 mb-4">How to Submit</h3>
      <p>Your counter-notification must include:</p>
      <ul className="list-disc pl-6 space-y-3 text-gray-700 mt-4 mb-6 marker:text-[#6C2BFF]">
        <li>Your contact information (name, email, address, phone number).</li>
        <li>Identification of the material that was removed and its previous location.</li>
        <li>A statement under penalty of perjury that you have a good faith belief the material was removed by mistake or misidentification.</li>
        <li>Your electronic or physical signature.</li>
      </ul>
      <h3 className="text-xl font-bold text-[#111827] mt-8 mb-4">Review & Restoration</h3>
      <p>
        Once we receive a valid counter-notification, we will forward it to the person who submitted the original claim. If they do not notify us within 10-14 business days that they have filed an action seeking a court order to restrain you from engaging in infringing activity, we may restore the removed content to the platform.
      </p>
    </>
  ),
  'repeat-infringer': (
    <>
      <p>
        GigsConnect maintains a strict "Repeat Infringer" policy. We are committed to keeping our platform safe and respectful of intellectual property.
      </p>
      <p className="mt-4">
        Under this policy, any user who repeatedly violates the copyright rights of others will face escalating consequences. This may result in the <strong>permanent suspension or termination</strong> of their GigsConnect account, loss of access to the platform, and forfeiture of any ongoing gigs or associated earnings, in accordance with our Terms & Conditions.
      </p>
    </>
  ),
  'contact': (
    <>
      <p>
        If you need to submit a copyright infringement report, a counter-notification, or if you have questions regarding this policy, please contact our Trust & Safety team.
      </p>
      
      <div className="grid sm:grid-cols-2 gap-4 mt-8">
        <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 flex flex-col items-center text-center hover:border-[#6C2BFF]/30 transition-colors">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-[#6C2BFF] shadow-sm mb-4">
            <Mail className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-[#111827] mb-1">Email Legal Team</h4>
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

const CopyrightPolicy: React.FC = () => {
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
      <SEO title="Copyright Policy | GigsConnect" canonical="https://gigsconnect.africa/copyright" />

      
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
              <li className="text-[#111827]">Copyright Policy</li>
            </ol>
          </nav>

          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-[#6C2BFF]/10 text-[#6C2BFF] flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-[#111827] tracking-tight">Copyright Policy</h1>
          </div>
          
          <p className="text-lg text-gray-500 max-w-2xl leading-relaxed mb-8">
            GigsConnect respects intellectual property rights and is committed to protecting the original work of creators across Africa.
          </p>

          <div className="inline-flex items-start sm:items-center gap-3 p-4 bg-purple-50 border border-purple-100 rounded-xl max-w-3xl">
            <Info className="w-5 h-5 text-purple-500 shrink-0 mt-0.5 sm:mt-0" />
            <p className="text-sm text-purple-900 font-medium">
              We encourage creators to share original work while respecting the intellectual property rights of others.
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

export default CopyrightPolicy;
