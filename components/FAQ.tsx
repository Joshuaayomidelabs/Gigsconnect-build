import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

interface FAQItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  toggle: () => void;
}

const FAQItem: React.FC<FAQItemProps> = ({ question, answer, isOpen, toggle }) => {
  return (
    <div className="border-b border-gray-200 last:border-0">
      <button
        className="w-full py-8 text-left flex justify-between items-center focus:outline-none group"
        onClick={toggle}
      >
        <span className="text-2xl font-bold text-linktree-dark pr-8">
          {question}
        </span>
        <span className={`flex-shrink-0 text-linktree-dark transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
          {isOpen ? <Minus className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
        </span>
      </button>
      <div 
        className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100 pb-8' : 'max-h-0 opacity-0'}`}
      >
        <p className="text-linktree-dark/80 text-lg font-medium leading-relaxed pr-8">{answer}</p>
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
    <section id="faq" className="py-24 lg:py-32 bg-white">
      <div className="max-w-[1000px] mx-auto px-6">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-linktree-dark mb-16 tracking-tighter leading-[1.1] text-center">
          Got questions?
        </h2>
        
        <div className="bg-white">
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
    </section>
  );
};

export default FAQ;