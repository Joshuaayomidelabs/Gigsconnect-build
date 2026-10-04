import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  HelpCircle, 
  FileQuestion, 
  LifeBuoy, 
  Users, 
  AlertTriangle, 
  Mail, 
  ChevronRight, 
  ExternalLink 
} from 'lucide-react';

export const SafetyAndHelpSection: React.FC = () => {
  const links = [
    {
      title: 'Help Center',
      description: 'Tutorials, platform guides, and creator FAQs',
      to: '/help-center',
      icon: LifeBuoy,
      external: false,
    },
    {
      title: 'Frequently Asked Questions',
      description: 'Quick answers about gigs, verification, and portfolios',
      to: '/faqs',
      icon: FileQuestion,
      external: false,
    },
    {
      title: 'Safety Center',
      description: 'Learn about verified badges, privacy, and account security',
      to: '/safety-center',
      icon: ShieldCheck,
      external: false,
    },
    {
      title: 'Community Guidelines',
      description: 'Standards of respect, collaboration, and authenticity',
      to: '/community-guidelines',
      icon: Users,
      external: false,
    },
    {
      title: 'Report Abuse',
      description: 'Flag inappropriate behavior, impersonation, or violations',
      to: '/report-abuse',
      icon: AlertTriangle,
      external: false,
    },
    {
      title: 'Contact Support',
      description: 'Direct email support for technical issues & inquiries',
      to: 'mailto:support@gigsconnect.africa',
      icon: Mail,
      external: true,
    },
  ];

  return (
    <section id="safety-section" className="bg-white dark:bg-brand-dark-card rounded-2xl sm:rounded-3xl p-5 sm:p-8 border border-gray-100 dark:border-[#27272A] shadow-xs">
      <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-100 dark:border-gray-800">
        <div className="w-10 h-10 rounded-2xl bg-brand-purple/10 dark:bg-brand-purple/20 text-brand-purple flex items-center justify-center shrink-0">
          <HelpCircle className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-xl font-black text-brand-black dark:text-brand-white">Safety & Help</h2>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Resources, reporting tools, and direct creator assistance.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {links.map((item) => {
          const Icon = item.icon;
          const content = (
            <div className="flex items-start justify-between gap-3 p-4 rounded-2xl border border-gray-100 dark:border-gray-800 hover:border-brand-purple/40 dark:hover:border-brand-purple/40 bg-[#FAFAFA] dark:bg-[#141418] hover:bg-brand-purple/5 dark:hover:bg-brand-purple/5 transition-all group cursor-pointer h-full">
              <div className="flex items-start gap-3 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-white dark:bg-[#1C1C22] text-brand-purple flex items-center justify-center shrink-0 border border-gray-200/60 dark:border-gray-700/60 shadow-xs group-hover:scale-105 transition-transform">
                  <Icon className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs sm:text-sm font-bold text-brand-black dark:text-brand-white group-hover:text-brand-purple transition-colors truncate">
                    {item.title}
                  </div>
                  <div className="text-[11px] sm:text-xs text-gray-500 dark:text-gray-400 line-clamp-1 mt-0.5">
                    {item.description}
                  </div>
                </div>
              </div>
              <div className="text-gray-400 group-hover:text-brand-purple shrink-0 mt-1 transition-colors">
                {item.external ? (
                  <ExternalLink className="w-3.5 h-3.5" />
                ) : (
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                )}
              </div>
            </div>
          );

          if (item.external) {
            return (
              <a key={item.title} href={item.to} target="_blank" rel="noopener noreferrer" className="block">
                {content}
              </a>
            );
          }

          return (
            <Link key={item.title} to={item.to} className="block">
              {content}
            </Link>
          );
        })}
      </div>
    </section>
  );
};
export default SafetyAndHelpSection;
