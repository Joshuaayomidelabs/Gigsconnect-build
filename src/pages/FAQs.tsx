import { SEO } from '../components/SEO';
import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';


interface FAQ {
  q: string;
  a: React.ReactNode;
}

interface FAQCategory {
  title: string;
  faqs: FAQ[];
}

const faqData: FAQCategory[] = [
  {
    title: "Getting Started",
    faqs: [
      { q: "What is GigsConnect?", a: "GigsConnect is a platform connecting creators, musicians, and talent across Africa with opportunities, brands, and clients." },
      { q: "Who can join GigsConnect?", a: "Anyone involved in the creative industry—musicians, bands, vocalists, producers, as well as clients or brands looking to hire talent." },
      { q: "Is GigsConnect free to join?", a: <>Yes, you can create a basic profile, browse opportunities, and apply for gigs for free. We also offer <Link to="/pricing" className="text-brand-purple hover:underline">premium plans</Link> with enhanced features for growing your career.</> },
      { q: "How do I create an account?", a: <>Click the <Link to="/signup" className="text-brand-purple hover:underline">Join Free</Link> button on the homepage, fill in your basic details, and follow the onboarding steps to set up your profile.</> },
      { q: "What can I do after creating an account?", a: "You can complete your portfolio, post updates to the community feed, apply for gigs, and network with other professionals." }
    ]
  },
  {
    title: "Creators",
    faqs: [
      { q: "How do I create my creator profile?", a: <>Once registered, navigate to <Link to="/edit-profile" className="text-brand-purple hover:underline">Edit Profile</Link> to add your skills, upload media to your portfolio, and set your location.</> },
      { q: "How do I showcase my work?", a: "You can upload videos, audio files, and images directly to your profile's portfolio section." },
      { q: "How do I find gigs?", a: <>Use the <Link to="/browse" className="text-brand-purple hover:underline">Browse Gigs</Link> page to search and filter opportunities by category, location, and budget.</> },
      { q: "How do I apply for a gig?", a: "Click on any gig that interests you, review the requirements, and click 'Apply Now'. You can include a custom message and highlight specific portfolio pieces." },
      { q: "Can I connect with other creators?", a: "Yes, you can follow other creators, like and comment on their posts in the community feed, and soon, you'll be able to message them directly." },
      { q: "How does creator verification work?", a: "Verification is coming soon. Verified creators will receive a special badge showing they have passed our vetting process." }
    ]
  },
  {
    title: "Gigs & Opportunities",
    faqs: [
      { q: "What is a gig?", a: "A gig is any paid or unpaid opportunity posted by a client, such as a live performance, studio session, or creative collaboration." },
      { q: "Who can post a gig?", a: "Any registered user can post a gig by navigating to 'Post a Gig' and filling out the details." },
      { q: "How does a client select a creator?", a: "Clients review applications in their dashboard, view applicant portfolios, and can change application statuses (e.g., Shortlisted, Accepted)." },
      { q: "Can I manage my gig applications?", a: "Yes, you can track the status of all your applications in the 'My Applications' section." },
      { q: "What happens after I am selected?", a: "The client will contact you to discuss further details and arrangements. Direct messaging is coming soon to make this process seamless." }
    ]
  },
  {
    title: "Subscriptions",
    faqs: [
      { q: "What are the subscription plans?", a: "We offer a Free Starter plan, a Pro plan for growing creators, and a Premium plan with all features unlocked." },
      { q: "How do I upgrade my plan?", a: "Navigate to the 'Pricing' page or your Settings to view the features of each plan and select an upgrade." },
      { q: "Are payments secure?", a: "Payment features are being developed and will be introduced as GigsConnect expands its marketplace functionality. Availability may vary depending on the specific opportunity." }
    ]
  },
  {
    title: "Safety & Community",
    faqs: [
      { q: "How do I report inappropriate content?", a: "You can report posts or profiles by clicking the 'Report' button (flag icon) next to the content." },
      { q: "How do I report another user?", a: "Navigate to the user's profile and use the 'Report User' option to alert our moderation team." },
      { q: "What happens after I submit a report?", a: "Our moderation team reviews the report and takes appropriate action, which may include removing the content or suspending the user." },
      { q: "Where can I read the Community Guidelines?", a: <Link to="/community-guidelines" className="text-brand-purple hover:underline">Click here to read our full Community Guidelines.</Link> }
    ]
  },
  {
    title: "Account & Support",
    faqs: [
      { q: "How do I update my profile?", a: "Go to your Dashboard and select 'Edit Profile' to update your information, skills, and portfolio." },
      { q: "How do I change my account information?", a: "Basic account information can be changed in the 'Settings' section." },
      { q: "How do I contact support?", a: "You can reach out to us via the Contact Support link in the footer or email support@gigsconnect.africa." },
      { q: "What should I do if I experience a technical problem?", a: "Please contact our support team with details of the issue, and we will assist you as quickly as possible." }
    ]
  }
];

const FAQItem: React.FC<{ faq: FAQ }> = ({ faq }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-gray-100 dark:border-gray-800 rounded-2xl mb-4 overflow-hidden bg-white dark:bg-brand-dark-card transition-all duration-300">
      <SEO title="GigsConnect FAQs | Frequently Asked Questions" canonical="https://gigsconnect.africa/faqs" />

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none focus:ring-2 focus:ring-brand-purple focus:ring-inset"
        aria-expanded={isOpen}
      >
        <span className="font-bold text-brand-black dark:text-brand-white text-lg">{faq.q}</span>
        <ChevronDown 
          className={`w-5 h-5 text-gray-400 transition-transform duration-300 shrink-0 ${isOpen ? 'rotate-180 text-brand-purple' : ''}`} 
        />
      </button>
      <div 
        className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 pb-5 opacity-100' : 'max-h-0 opacity-0'}`}
      >
        <p className="text-gray-500 dark:text-gray-400 text-base leading-relaxed">
          {faq.a}
        </p>
      </div>
    </div>
  );
};

const FAQs: React.FC = () => {
  return (
    <div className="min-h-screen bg-brand-gray dark:bg-brand-black pt-24 pb-20 px-4 sm:px-6 transition-colors duration-300">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-black text-brand-black dark:text-brand-white tracking-tight mb-6">
            Frequently Asked Questions
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed font-medium">
            Everything you need to know about GigsConnect. Can't find the answer you're looking for? Feel free to <a href="mailto:support@gigsconnect.africa" className="text-brand-purple hover:underline">contact our support team</a>.
          </p>
        </div>

        <div className="space-y-12">
          {faqData.map((category, idx) => (
            <div key={idx}>
              <h2 className="text-2xl font-black text-brand-black dark:text-brand-white mb-6 pl-2">
                {category.title}
              </h2>
              <div>
                {category.faqs.map((faq, faqIdx) => (
                  <FAQItem key={faqIdx} faq={faq} />
                ))}
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-16 text-center bg-brand-purple/10 dark:bg-brand-purple/5 border border-brand-purple/20 rounded-3xl p-8 sm:p-12">
          <h3 className="text-2xl font-black text-brand-black dark:text-brand-white mb-4">Still have questions?</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-xl mx-auto">
            Our support team is always here to help you get the most out of GigsConnect.
          </p>
          <a 
            href="mailto:support@gigsconnect.africa"
            className="inline-flex items-center justify-center px-8 h-[54px] rounded-xl bg-brand-purple text-white font-bold text-sm hover:bg-brand-purple-hover active:scale-95 transition-all duration-300 shadow-lg shadow-brand-purple/20"
          >
            Contact Support
          </a>
        </div>
      </div>
    </div>
  );
};

export default FAQs;
