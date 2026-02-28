import React from 'react';
import { Check, X } from 'lucide-react';

const SubscriptionTab = () => {
  return (
    <div className="space-y-8 relative z-10 max-w-6xl mx-auto pb-10">
      <section className="text-center">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Level Up Your Career</h1>
        <p className="text-gray-500 mt-2 text-lg max-w-xl mx-auto">Choose the plan that fits your ambition. Get verified, get seen, and land better gigs.</p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        {/* STARTER Plan */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-200 flex flex-col transition-all hover:shadow-md">
          <h3 className="text-2xl font-bold text-gray-900">Starter</h3>
          <p className="text-sm text-gray-500 mt-1 mb-4">Get your foot in the door.</p>
          <div className="flex items-baseline gap-1 mb-6">
            <span className="text-4xl font-black text-gray-900">Free</span>
          </div>
          <ul className="space-y-4 mb-8 flex-grow">
            <li className="flex items-start gap-3 text-gray-600 text-sm">
              <X className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
              <span>No verification badge</span>
            </li>
            <li className="flex items-start gap-3 text-gray-600 text-sm">
              <Check className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
              <span>Limited profile visibility</span>
            </li>
            <li className="flex items-start gap-3 text-gray-600 text-sm">
              <Check className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
              <span>Basic profile setup</span>
            </li>
            <li className="flex items-start gap-3 text-gray-600 text-sm">
              <Check className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
              <span>Limited gig applications</span>
            </li>
          </ul>
          <button disabled className="w-full py-3.5 rounded-xl bg-gray-100 text-gray-500 font-bold cursor-not-allowed border border-gray-200">
            Current Plan
          </button>
        </div>

        {/* PRO Plan */}
        <div className="bg-white rounded-3xl p-8 shadow-lg border-2 border-blue-600 flex flex-col relative transform md:-translate-y-2 transition-all hover:shadow-xl">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-xs font-bold tracking-wider uppercase shadow-sm">
            Most Popular
          </div>
          <h3 className="text-2xl font-bold text-gray-900">Pro</h3>
          <p className="text-sm text-gray-500 mt-1 mb-4">Stand out and land more gigs.</p>
          <div className="flex flex-col mb-6">
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-black text-gray-900">₦1k</span>
              <span className="text-gray-500 font-medium">/mo</span>
            </div>
            <span className="text-xs text-gray-400 font-medium mt-1">or $1/mo (International)</span>
          </div>
          <ul className="space-y-4 mb-8 flex-grow">
            <li className="flex items-start gap-3 text-gray-700 text-sm font-medium">
              <Check className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <span>Verified badge</span>
            </li>
            <li className="flex items-start gap-3 text-gray-700 text-sm font-medium">
              <Check className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <span>Increased visibility in search</span>
            </li>
            <li className="flex items-start gap-3 text-gray-700 text-sm font-medium">
              <Check className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <span>Optimized profile</span>
            </li>
            <li className="flex items-start gap-3 text-gray-700 text-sm font-medium">
              <Check className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <span>Higher gig application limits</span>
            </li>
            <li className="flex items-start gap-3 text-gray-700 text-sm font-medium">
              <Check className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <span>Priority listing</span>
            </li>
          </ul>
          <button className="w-full py-3.5 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-md">
            Upgrade to Pro
          </button>
        </div>

        {/* PREMIUM Plan */}
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 shadow-xl text-white flex flex-col relative transition-all hover:shadow-2xl">
          <h3 className="text-2xl font-bold text-white">Premium</h3>
          <p className="text-sm text-gray-400 mt-1 mb-4">The ultimate toolkit for serious artists.</p>
          <div className="flex flex-col mb-6">
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-black text-white">₦2k</span>
              <span className="text-gray-400 font-medium">/mo</span>
            </div>
            <span className="text-xs text-gray-500 font-medium mt-1">or $3/mo (International)</span>
          </div>
          <ul className="space-y-4 mb-8 flex-grow">
            <li className="flex items-start gap-3 text-gray-200 text-sm font-medium">
              <Check className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
              <span>Verified badge & All Pro features</span>
            </li>
            <li className="flex items-start gap-3 text-gray-200 text-sm font-medium">
              <Check className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
              <span>AI assistance</span>
            </li>
            <li className="flex items-start gap-3 text-gray-200 text-sm font-medium">
              <Check className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
              <span>Maximum visibility</span>
            </li>
            <li className="flex items-start gap-3 text-gray-200 text-sm font-medium">
              <Check className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
              <span>Unlimited gig applications</span>
            </li>
            <li className="flex items-start gap-3 text-gray-200 text-sm font-medium">
              <Check className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
              <span>Advanced profile optimization</span>
            </li>
            <li className="flex items-start gap-3 text-gray-200 text-sm font-medium">
              <Check className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
              <span>Early access to new features</span>
            </li>
          </ul>
          <button className="w-full py-3.5 rounded-xl bg-white text-gray-900 font-bold hover:bg-gray-100 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-md">
            Go Premium
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionTab;
