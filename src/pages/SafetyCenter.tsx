import React from 'react';
import { Shield, Lock, AlertTriangle, Users, Flag, LifeBuoy } from 'lucide-react';
import { Link } from 'react-router-dom';

const SafetyCenter: React.FC = () => {
  return (
    <div className="min-h-screen bg-brand-gray dark:bg-brand-black pt-24 pb-20 px-4 sm:px-6 transition-colors duration-300">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <div className="w-20 h-20 bg-green-500/10 text-green-500 rounded-3xl flex items-center justify-center mx-auto mb-6 transform rotate-3">
            <Shield className="w-10 h-10" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-brand-black dark:text-brand-white tracking-tight mb-6">
            Safety Center
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed font-medium">
            Your safety is our top priority. Learn how we protect the GigsConnect community and what you can do to stay safe.
          </p>
        </div>

        <div className="space-y-8">
          <section className="bg-white dark:bg-brand-dark-card rounded-3xl p-8 sm:p-10 shadow-sm border border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-blue-500/10 text-blue-500 rounded-2xl flex items-center justify-center shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-black text-brand-black dark:text-brand-white">Stay Safe on GigsConnect</h2>
            </div>
            <div className="prose dark:prose-invert max-w-none text-gray-500 dark:text-gray-400">
              <p className="leading-relaxed">
                GigsConnect is built on trust and professional collaboration. We strongly encourage all users to exercise good judgment when communicating, collaborating, posting gigs, and interacting with other members of the community. Always verify the individuals or brands you are working with before sharing sensitive information or committing to projects.
              </p>
            </div>
          </section>

          <section className="bg-white dark:bg-brand-dark-card rounded-3xl p-8 sm:p-10 shadow-sm border border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-purple-500/10 text-purple-500 rounded-2xl flex items-center justify-center shrink-0">
                <Lock className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-black text-brand-black dark:text-brand-white">Protect Your Account</h2>
            </div>
            <div className="prose dark:prose-invert max-w-none text-gray-500 dark:text-gray-400">
              <ul className="space-y-3 list-disc pl-5">
                <li><strong>Keep login credentials private:</strong> Never share your password with anyone.</li>
                <li><strong>Use a strong password:</strong> Create a unique password that you do not use on other platforms.</li>
                <li><strong>Do not share verification codes:</strong> GigsConnect will never ask you for your verification codes or password.</li>
                <li><strong>Be cautious of suspicious links:</strong> Do not click on unknown links sent by unverified users.</li>
                <li><strong>Report suspicious activity:</strong> If you notice unusual activity on your account, reset your password and contact support immediately.</li>
              </ul>
            </div>
          </section>

          <section className="bg-white dark:bg-brand-dark-card rounded-3xl p-8 sm:p-10 shadow-sm border border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-amber-500/10 text-amber-500 rounded-2xl flex items-center justify-center shrink-0">
                <Shield className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-black text-brand-black dark:text-brand-white">Safe Gig & Opportunity Practices</h2>
            </div>
            <div className="prose dark:prose-invert max-w-none text-gray-500 dark:text-gray-400">
              <ul className="space-y-3 list-disc pl-5">
                <li><strong>Review gig details carefully:</strong> Ensure the gig expectations, timeline, and requirements are clear before applying.</li>
                <li><strong>Verify who you are dealing with:</strong> Check the client's profile, past activity, and reviews if available.</li>
                <li><strong>Protect sensitive information:</strong> Be extremely cautious if a client asks for highly sensitive personal data.</li>
                <li><strong>Avoid suspicious payment requests:</strong> Be wary of opportunities that require you to pay upfront fees, buy equipment from specific vendors, or involve complex investment schemes.</li>
                <li><strong>Report suspicious opportunities:</strong> Use the report function on any gig that seems fraudulent or violates our guidelines.</li>
              </ul>
            </div>
          </section>

          <section className="bg-white dark:bg-brand-dark-card rounded-3xl p-8 sm:p-10 shadow-sm border border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-indigo-500/10 text-indigo-500 rounded-2xl flex items-center justify-center shrink-0">
                <Users className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-black text-brand-black dark:text-brand-white">Community Safety</h2>
            </div>
            <div className="prose dark:prose-invert max-w-none text-gray-500 dark:text-gray-400">
              <p className="mb-4">To maintain a safe and welcoming environment, we strictly enforce rules against:</p>
              <ul className="space-y-3 list-disc pl-5 mb-6">
                <li>Harassment and bullying</li>
                <li>Threats or abusive language</li>
                <li>Impersonation of other individuals or brands</li>
                <li>Scams and fraudulent activity</li>
                <li>Discriminatory or hateful behavior</li>
              </ul>
              <p>For complete details, please read our <Link to="/community-guidelines" className="text-brand-purple font-bold hover:underline">Community Guidelines</Link> and <Link to="/acceptable-use-policy" className="text-brand-purple font-bold hover:underline">Acceptable Use Policy</Link>.</p>
            </div>
          </section>

          <section className="bg-white dark:bg-brand-dark-card rounded-3xl p-8 sm:p-10 shadow-sm border border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-rose-500/10 text-rose-500 rounded-2xl flex items-center justify-center shrink-0">
                <Flag className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-black text-brand-black dark:text-brand-white">Reporting</h2>
            </div>
            <div className="prose dark:prose-invert max-w-none text-gray-500 dark:text-gray-400">
              <p className="mb-4">You can help keep GigsConnect safe by reporting content or behavior that violates our policies. Use the built-in reporting tools (the flag icon) found throughout the platform to report:</p>
              <ul className="space-y-3 list-disc pl-5">
                <li>A post in the community feed</li>
                <li>A gig listing</li>
                <li>A user's profile</li>
                <li>Inappropriate behavior or suspicious activity</li>
              </ul>
              <p className="mt-4 text-sm bg-gray-50 dark:bg-[#18181B] p-4 rounded-xl border border-gray-100 dark:border-gray-800">
                <em>Note: If you encounter an issue where the reporting feature is marked as "coming soon", please use the Contact Support option below to notify our moderation team directly.</em>
              </p>
            </div>
          </section>

          <section className="bg-brand-purple/10 dark:bg-brand-purple/5 border border-brand-purple/20 rounded-3xl p-8 sm:p-12 text-center mt-12">
            <div className="w-16 h-16 bg-white dark:bg-brand-dark-card text-brand-purple rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-gray-100 dark:border-gray-800">
              <LifeBuoy className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-black text-brand-black dark:text-brand-white mb-4">Need Help?</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-xl mx-auto">
              If you have experienced an issue that requires immediate attention or have questions about your safety on GigsConnect, our support team is ready to assist.
            </p>
            <a 
              href="mailto:support@gigsconnect.africa"
              className="inline-flex items-center justify-center px-8 h-[54px] rounded-xl bg-brand-purple text-white font-bold text-sm hover:bg-brand-purple-hover active:scale-95 transition-all duration-300 shadow-lg shadow-brand-purple/20"
            >
              Contact Support
            </a>
          </section>
        </div>
      </div>
    </div>
  );
};

export default SafetyCenter;
