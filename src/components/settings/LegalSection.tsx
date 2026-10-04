import React from 'react';
import { Link } from 'react-router-dom';
import { Scale, FileText, ChevronRight } from 'lucide-react';

export const LegalSection: React.FC = () => {
  const policies = [
    { title: 'Terms and Conditions', to: '/terms-and-conditions', desc: 'Rules and conditions governing platform usage' },
    { title: 'Privacy Policy', to: '/privacy-policy', desc: 'How we collect, protect, and use your personal information' },
    { title: 'Cookie Policy', to: '/cookie-policy', desc: 'Information about cookies and local storage tokens' },
    { title: 'Acceptable Use Policy', to: '/acceptable-use-policy', desc: 'Prohibited actions and content publishing rules' },
    { title: 'Copyright Policy', to: '/copyright-policy', desc: 'Intellectual property rights and DMCA takedown procedures' },
  ];

  return (
    <section id="legal-section" className="bg-white dark:bg-brand-dark-card rounded-2xl sm:rounded-3xl p-5 sm:p-8 border border-gray-100 dark:border-[#27272A] shadow-xs">
      <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-100 dark:border-gray-800">
        <div className="w-10 h-10 rounded-2xl bg-brand-purple/10 dark:bg-brand-purple/20 text-brand-purple flex items-center justify-center shrink-0">
          <Scale className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-xl font-black text-brand-black dark:text-brand-white">Legal & Policies</h2>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Official platform terms, privacy frameworks, and creator protections.</p>
        </div>
      </div>

      <div className="divide-y divide-gray-100 dark:divide-gray-800/80">
        {policies.map((p) => (
          <Link
            key={p.to}
            to={p.to}
            className="py-3.5 px-3 -mx-3 rounded-2xl flex items-center justify-between hover:bg-gray-50 dark:hover:bg-[#141418] transition-colors group"
          >
            <div className="flex items-center gap-3 min-w-0">
              <FileText className="w-4 h-4 text-gray-400 group-hover:text-brand-purple transition-colors shrink-0" />
              <div className="min-w-0">
                <span className="text-xs sm:text-sm font-bold text-brand-black dark:text-brand-white group-hover:text-brand-purple transition-colors truncate block">
                  {p.title}
                </span>
                <span className="text-[11px] text-gray-500 dark:text-gray-400 line-clamp-1">
                  {p.desc}
                </span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-brand-purple group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
          </Link>
        ))}
      </div>
    </section>
  );
};
export default LegalSection;
