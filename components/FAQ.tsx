import React, { useState } from 'react';
import Section from './Section';
import { Plus, Minus } from 'lucide-react';

interface FAQItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  toggle: () => void;
}

const FAQItem: React.FC<FAQItemProps> = ({ question, answer, isOpen, toggle }) => {
  return (
    <div className="border-b border-gray-100 last:border-0">
      <button
        className="w-full py-6 text-left flex justify-between items-center focus:outline-none group"
        onClick={toggle}
      >
        <span className={`text-lg font-medium transition-colors duration-200 ${isOpen ? 'text-brand-600' : 'text-gray-900 group-hover:text-brand-600'}`}>
          {question}
        </span>
        <span className={`ml-6 flex-shrink-0 bg-brand-50 rounded-full p-1 text-brand-600 transition-all duration-300 ${isOpen ? 'bg-brand-600 text-white rotate-180' : ''}`}>
          {isOpen ? <Minus className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
        </span>
      </button>
      <div 
        className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-48 opacity-100 pb-6' : 'max-h-0 opacity-0'}`}
      >
        <p className="text-gray-600 leading-relaxed pr-8">{answer}</p>
      </div>
    </div>
  );
};

const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "How do I get verified on GigsConnect?",
      answer: "Complete your artist profile with a bio, photos, and demo tracks. Then, select a paid plan (Gold or Diamond) to initiate the verification process. Our team reviews submissions within 48 hours to ensure quality and authenticity."
    },
    {
      question: "Is GigsConnect free to use?",
      answer: "Yes, the Starter plan is completely free. It allows you to create a profile, browse gigs, and join the community. To apply for gigs and get the verified badge, you will need to upgrade to our affordable Gold plan."
    },
    {
      question: "How do payments work?",
      answer: "We use a secure escrow system. When a gig is booked, the organizer deposits the fee. Once you complete the performance, the funds are released directly to your bank account or mobile wallet, ensuring you always get paid."
    },
    {
      question: "Can bands and groups sign up?",
      answer: "Absolutely! GigsConnect is designed for solo artists, bands, DJs, and session musicians. You can create a group profile that highlights your collective experience and member details."
    },
    {
      question: "What countries is GigsConnect available in?",
      answer: "We are a Pan-African platform. While our largest communities are currently in Nigeria, Ghana, Kenya, and South Africa, artists and organizers from anywhere on the continent are welcome to join."
    }
  ];

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <Section id="faq">
      <div className="grid md:grid-cols-12 gap-12">
        <div className="md:col-span-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
          <p className="text-gray-600 mb-6">
            Everything you need to know about the product and billing. Can't find the answer you're looking for?
          </p>
          <a href="mailto:support@gigsconnect.com" className="inline-flex items-center font-medium text-brand-600 hover:text-brand-700 transition-colors">
            Contact our support team &rarr;
          </a>
        </div>
        
        <div className="md:col-span-8">
          <div className="bg-white rounded-2xl">
            {faqs.map((faq, index) => (
              <FAQItem
                key={index}
                question={faq.question}
                answer={faq.answer}
                isOpen={openIndex === index}
                toggle={() => handleToggle(index)}
              />
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
};

export default FAQ;