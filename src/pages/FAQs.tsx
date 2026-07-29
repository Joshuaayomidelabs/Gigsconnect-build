import React from 'react';

const FAQs: React.FC = () => {
  return (
    <div className="min-h-screen bg-brand-gray dark:bg-brand-black flex flex-col justify-center items-center py-20 px-6">
      <div className="max-w-3xl w-full bg-white dark:bg-brand-dark-card rounded-3xl p-10 md:p-16 shadow-xl border border-gray-100 dark:border-gray-800 text-center">
        <h1 className="text-3xl md:text-4xl font-black text-brand-black dark:text-brand-white tracking-tight mb-6">Frequently Asked Questions</h1>
        <p className="text-gray-500 dark:text-gray-400 text-lg mb-8 leading-relaxed">
          This page is currently under construction. Please check back later.
        </p>
        <button 
          onClick={() => window.history.back()}
          className="inline-flex items-center justify-center px-8 h-[54px] rounded-xl bg-brand-purple text-white font-bold text-sm hover:bg-brand-purple-dark transition-all duration-300"
        >
          Go Back
        </button>
      </div>
    </div>
  );
};

export default FAQs;
