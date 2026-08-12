import { SEO } from '../components/SEO';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, ArrowRight, ArrowUp, ShieldAlert, Mail, Globe, Info, CheckCircle2, XCircle } from 'lucide-react';


const sections = [
  { id: 'purpose', title: '1. Purpose' },
  { id: 'acceptable-use', title: '2. Acceptable Use' },
  { id: 'prohibited-activities', title: '3. Prohibited Activities' },
  { id: 'marketplace-rules', title: '4. Marketplace Rules' },
  { id: 'community-standards', title: '5. Community Standards' },
  { id: 'platform-security', title: '6. Platform Security' },
  { id: 'enforcement', title: '7. Enforcement' },
  { id: 'appeals', title: '8. Appeals' },
  { id: 'policy-updates', title: '9. Policy Updates' },
  { id: 'contact', title: '10. Contact' },
];

const sectionContent: Record<string, React.ReactNode> = {
  'purpose': (
    <>
      <p>
        The GigsConnect Acceptable Use Policy (AUP) sets out the rules and guidelines that govern your use of our platform, website, and services. As Africa's premier creator marketplace and professional networking platform, this policy exists to:
      </p>
      <ul className="list-disc pl-6 space-y-3 mt-4 mb-6 text-gray-700 marker:text-[#6C2BFF]">
        <li><strong>Protect creators</strong> and their intellectual property.</li>
        <li><strong>Protect businesses</strong> and clients seeking professional services.</li>
        <li><strong>Maintain platform integrity</strong> and trustworthiness.</li>
        <li><strong>Encourage professional collaboration</strong> across borders.</li>
        <li><strong>Prevent abuse</strong>, harassment, and illegal activities.</li>
      </ul>
      <p>
        This policy applies to everyone who accesses or uses GigsConnect. Violations may result in account suspension, termination, or other enforcement actions.
      </p>
    </>
  ),
  'acceptable-use': (
    <>
      <p>
        GigsConnect is a professional ecosystem designed for connection, creation, and commerce. We encourage all users to:
      </p>
      <div className="space-y-4 mt-6">
        {[
          'Create authentic profiles representing your true identity, skills, and experience.',
          'Share original work and accurately represent your portfolio.',
          'Post genuine opportunities, gigs, and job listings.',
          'Collaborate professionally and communicate respectfully with clients and creators.',
          "Respect other users' boundaries, privacy, and time.",
          'Maintain accurate profile information, including contact details and payment information.',
          'Use GigsConnect responsibly to uplift the African creative economy.'
        ].map((item, idx) => (
          <div key={idx} className="flex items-start gap-3 bg-gray-50 p-4 rounded-xl border border-gray-100">
            <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
            <p className="text-gray-700">{item}</p>
          </div>
        ))}
      </div>
    </>
  ),
  'prohibited-activities': (
    <>
      <p>
        To ensure a safe and professional environment, the following activities are strictly prohibited on GigsConnect. Engaging in any of these activities is a direct violation of this policy:
      </p>
      <div className="grid md:grid-cols-2 gap-4 mt-6">
        <div className="space-y-3">
          <h4 className="font-bold text-[#111827] flex items-center gap-2 border-b border-gray-100 pb-2">
             Fraud & Deception
          </h4>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start gap-2"><XCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" /> Spam or unsolicited promotions</li>
            <li className="flex items-start gap-2"><XCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" /> Scams and fraudulent schemes</li>
            <li className="flex items-start gap-2"><XCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" /> Impersonation or identity theft</li>
            <li className="flex items-start gap-2"><XCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" /> Creating fake or duplicate accounts</li>
            <li className="flex items-start gap-2"><XCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" /> Misleading creator profiles</li>
          </ul>
        </div>
        
        <div className="space-y-3">
          <h4 className="font-bold text-[#111827] flex items-center gap-2 border-b border-gray-100 pb-2">
             Harassment & Abuse
          </h4>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start gap-2"><XCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" /> Harassment or stalking</li>
            <li className="flex items-start gap-2"><XCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" /> Cyberbullying</li>
            <li className="flex items-start gap-2"><XCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" /> Hate speech against any protected group</li>
            <li className="flex items-start gap-2"><XCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" /> Threats of violence or self-harm</li>
            <li className="flex items-start gap-2"><XCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" /> Discrimination based on race, gender, etc.</li>
          </ul>
        </div>
        
        <div className="space-y-3">
          <h4 className="font-bold text-[#111827] flex items-center gap-2 border-b border-gray-100 pb-2">
             Illegal Content
          </h4>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start gap-2"><XCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" /> Copyright or IP infringement</li>
            <li className="flex items-start gap-2"><XCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" /> Posting illegal content or contraband</li>
            <li className="flex items-start gap-2"><XCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" /> Explicit adult content or pornography</li>
            <li className="flex items-start gap-2"><XCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" /> Graphic violence or gore</li>
            <li className="flex items-start gap-2"><XCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" /> Promotion of terrorism or extremism</li>
            <li className="flex items-start gap-2"><XCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" /> Child exploitation imagery</li>
          </ul>
        </div>
        
        <div className="space-y-3">
          <h4 className="font-bold text-[#111827] flex items-center gap-2 border-b border-gray-100 pb-2">
             Platform Manipulation
          </h4>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start gap-2"><XCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" /> Automated scraping without authorization</li>
            <li className="flex items-start gap-2"><XCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" /> Artificial engagement manipulation</li>
            <li className="flex items-start gap-2"><XCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" /> Fake reviews or testimonials</li>
            <li className="flex items-start gap-2"><XCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" /> Fake job or gig postings</li>
            <li className="flex items-start gap-2"><XCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" /> Unauthorized advertising or MLM schemes</li>
          </ul>
        </div>
      </div>
    </>
  ),
  'marketplace-rules': (
    <>
      <p>When participating in the GigsConnect marketplace, either as a creator or a client, users must adhere to specific transactional rules:</p>
      <ul className="list-disc pl-6 space-y-3 mt-4 text-gray-700 marker:text-[#6C2BFF]">
        <li><strong>Post genuine gigs:</strong> Do not post "placeholder" gigs or jobs that do not exist.</li>
        <li><strong>Provide accurate project details:</strong> Ensure scope, timeline, and budget are clearly defined.</li>
        <li><strong>Communicate honestly:</strong> Do not mislead collaborators about your abilities, budget, or timeline.</li>
        <li><strong>Respect agreements:</strong> Honor the terms agreed upon in the platform's contract or gig terms.</li>
        <li><strong>Avoid duplicate listings:</strong> Do not spam the marketplace with identical job posts or creator services.</li>
        <li><strong>Avoid misleading pricing:</strong> Do not use "bait and switch" pricing tactics.</li>
        <li><strong>Do not manipulate ratings:</strong> Attempting to coerce, buy, or artificially inflate reviews is strictly forbidden.</li>
      </ul>
    </>
  ),
  'community-standards': (
    <>
      <p>We strive to build a community that empowers African creators. To that end, we encourage all users to embody the following standards:</p>
      <div className="grid gap-4 mt-6">
        <div className="bg-gray-50 p-5 rounded-xl border border-gray-100">
          <h4 className="font-bold text-[#111827] text-lg mb-2">Respectful Discussion</h4>
          <p className="text-sm text-gray-600">Engage in civil, polite conversation, even during disagreements or disputes.</p>
        </div>
        <div className="bg-gray-50 p-5 rounded-xl border border-gray-100">
          <h4 className="font-bold text-[#111827] text-lg mb-2">Constructive Feedback</h4>
          <p className="text-sm text-gray-600">When reviewing work or participating in community forums, provide actionable, helpful feedback rather than destructive criticism.</p>
        </div>
        <div className="bg-gray-50 p-5 rounded-xl border border-gray-100">
          <h4 className="font-bold text-[#111827] text-lg mb-2">Inclusive Behavior</h4>
          <p className="text-sm text-gray-600">Foster an environment that is welcoming to creators and clients of all backgrounds, experience levels, and nationalities.</p>
        </div>
        <div className="bg-gray-50 p-5 rounded-xl border border-gray-100">
          <h4 className="font-bold text-[#111827] text-lg mb-2">Safe Collaboration</h4>
          <p className="text-sm text-gray-600">Prioritize safety by keeping transactions and communications on the platform whenever possible.</p>
        </div>
      </div>
    </>
  ),
  'platform-security': (
    <>
      <p>Protecting our infrastructure and user data is paramount. Users must not engage in any activity that jeopardizes platform security, including:</p>
      <ul className="space-y-4 mt-6 text-gray-700">
        <li className="flex items-start gap-3">
          <div className="mt-1 w-5 h-5 rounded bg-red-50 text-red-600 flex items-center justify-center flex-shrink-0">✗</div>
          <div><strong>Attempting unauthorized access:</strong> Trying to log into accounts you do not own or accessing restricted administrative areas.</div>
        </li>
        <li className="flex items-start gap-3">
          <div className="mt-1 w-5 h-5 rounded bg-red-50 text-red-600 flex items-center justify-center flex-shrink-0">✗</div>
          <div><strong>Reverse engineering:</strong> Decompiling, reverse engineering, or attempting to extract the source code of the GigsConnect platform.</div>
        </li>
        <li className="flex items-start gap-3">
          <div className="mt-1 w-5 h-5 rounded bg-red-50 text-red-600 flex items-center justify-center flex-shrink-0">✗</div>
          <div><strong>Interfering with services:</strong> Disrupting the normal flow of communication or overloading our servers.</div>
        </li>
        <li className="flex items-start gap-3">
          <div className="mt-1 w-5 h-5 rounded bg-red-50 text-red-600 flex items-center justify-center flex-shrink-0">✗</div>
          <div><strong>Malicious software:</strong> Distributing malware, viruses, trojans, or spyware through messages, gig attachments, or portfolio links.</div>
        </li>
        <li className="flex items-start gap-3">
          <div className="mt-1 w-5 h-5 rounded bg-red-50 text-red-600 flex items-center justify-center flex-shrink-0">✗</div>
          <div><strong>Exploiting vulnerabilities:</strong> Scanning, testing, or exploiting technical vulnerabilities without authorization.</div>
        </li>
        <li className="flex items-start gap-3">
          <div className="mt-1 w-5 h-5 rounded bg-red-50 text-red-600 flex items-center justify-center flex-shrink-0">✗</div>
          <div><strong>Phishing & Credential Theft:</strong> Attempting to steal passwords, financial information, or personal data from other users.</div>
        </li>
        <li className="flex items-start gap-3">
          <div className="mt-1 w-5 h-5 rounded bg-red-50 text-red-600 flex items-center justify-center flex-shrink-0">✗</div>
          <div><strong>Denial-of-Service (DoS):</strong> Attempting DoS or DDoS attacks against GigsConnect.</div>
        </li>
      </ul>
    </>
  ),
  'enforcement': (
    <>
      <p>
        We actively monitor the platform and rely on user reports to identify violations of this Acceptable Use Policy. 
      </p>
      <p className="mt-4 mb-6">
        Depending on the severity and frequency of the violation, GigsConnect may take any of the following enforcement actions, with or without prior notice:
      </p>
      
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-gray-100 bg-gray-50 font-bold text-[#111827]">
          Potential Enforcement Actions
        </div>
        <div className="divide-y divide-gray-100">
          <div className="p-4 flex gap-4">
             <div className="font-medium text-gray-900 w-1/3 shrink-0">Warnings</div>
             <div className="text-gray-600 text-sm">A formal notice requesting corrective action.</div>
          </div>
          <div className="p-4 flex gap-4">
             <div className="font-medium text-gray-900 w-1/3 shrink-0">Content Removal</div>
             <div className="text-gray-600 text-sm">Deletion or hiding of offending posts, gigs, portfolios, or messages.</div>
          </div>
          <div className="p-4 flex gap-4">
             <div className="font-medium text-gray-900 w-1/3 shrink-0">Account Restrictions</div>
             <div className="text-gray-600 text-sm">Loss of specific privileges (e.g., inability to post new gigs, send messages, or withdraw funds).</div>
          </div>
          <div className="p-4 flex gap-4">
             <div className="font-medium text-gray-900 w-1/3 shrink-0">Temporary Suspension</div>
             <div className="text-gray-600 text-sm">A temporary ban preventing login and platform usage for a defined period.</div>
          </div>
          <div className="p-4 flex gap-4 bg-red-50/50">
             <div className="font-bold text-red-700 w-1/3 shrink-0">Permanent Termination</div>
             <div className="text-gray-700 text-sm">Immediate and permanent deactivation of the account, often resulting in forfeiture of pending funds.</div>
          </div>
        </div>
      </div>
      
      <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl text-yellow-800 text-sm font-medium">
        <strong>Note:</strong> We also reserve the right to report unlawful activities to relevant law enforcement authorities where legally required or deemed necessary to protect public safety.
      </div>
    </>
  ),
  'appeals': (
    <>
      <p>
        We understand that mistakes happen and automated systems are not perfect. If you believe your account was restricted or your content was removed in error, you have the right to appeal the decision.
      </p>
      <h3 className="text-lg font-bold text-[#111827] mt-6 mb-3">How to Appeal</h3>
      <p>
        To submit an appeal, please contact our Trust & Safety team via support with a clear explanation of why the enforcement action was unwarranted. Include any relevant evidence, screenshots, or context.
      </p>
      <p className="mt-4">
        Our moderation team will review your appeal fairly and objectively. We aim to respond to all appeals within 5-7 business days. The decision made by our Trust & Safety team upon appeal is generally final.
      </p>
    </>
  ),
  'policy-updates': (
    <>
      <p>
        The digital landscape and our platform are constantly evolving. As such, GigsConnect may update this Acceptable Use Policy from time to time.
      </p>
      <p className="mt-4">
        We encourage users to review this policy periodically. If we make material changes, we will notify you by updating the "Last Updated" date and version number at the top of this page, and we may also provide notification via email or a platform announcement. Your continued use of the platform after updates take effect constitutes your agreement to the revised policy.
      </p>
    </>
  ),
  'contact': (
    <>
      <p>
        If you need to report a violation of this Acceptable Use Policy, or if you have questions regarding these guidelines, please contact our Trust & Safety team.
      </p>
      
      <div className="grid sm:grid-cols-2 gap-4 mt-8">
        <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 flex flex-col items-center text-center hover:border-[#6C2BFF]/30 transition-colors group">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-[#6C2BFF] shadow-sm mb-4 group-hover:scale-110 transition-transform">
            <Mail className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-[#111827] mb-1">Email Support</h4>
          <a href="mailto:support@gigsconnect.africa" className="text-[#6C2BFF] font-medium text-sm hover:underline">
            support@gigsconnect.africa
          </a>
        </div>
        
        <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 flex flex-col items-center text-center hover:border-[#6C2BFF]/30 transition-colors group">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-[#6C2BFF] shadow-sm mb-4 group-hover:scale-110 transition-transform">
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

const AcceptableUsePolicy: React.FC = () => {
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
      <SEO title="Acceptable Use Policy | GigsConnect" canonical="https://gigsconnect.africa/acceptable-use" />

      
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
              <li className="text-[#111827]">Acceptable Use Policy</li>
            </ol>
          </nav>

          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-[#6C2BFF]/10 text-[#6C2BFF] flex items-center justify-center">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-[#111827] tracking-tight">Acceptable Use Policy</h1>
          </div>
          
          <p className="text-lg text-gray-500 max-w-2xl leading-relaxed mb-8">
            This policy explains the standards and responsibilities every user must follow to help keep GigsConnect safe, professional, and welcoming.
          </p>

          <div className="inline-flex items-start sm:items-center gap-3 p-4 bg-purple-50 border border-purple-100 rounded-xl max-w-3xl">
            <Info className="w-5 h-5 text-purple-500 shrink-0 mt-0.5 sm:mt-0" />
            <p className="text-sm text-purple-900 font-medium">
              By accessing or using GigsConnect, you agree to comply with this Acceptable Use Policy.
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
          
          <div className="mb-12 pb-6 border-b border-gray-100 flex items-center gap-6">
            <div>
              <p className="text-sm font-bold text-[#6C2BFF] uppercase tracking-widest">Last Updated</p>
              <p className="text-[#111827] font-medium mt-1">July 2026</p>
            </div>
            <div>
              <p className="text-sm font-bold text-[#6C2BFF] uppercase tracking-widest">Version</p>
              <p className="text-[#111827] font-medium mt-1">1.0</p>
            </div>
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

export default AcceptableUsePolicy;
