import React from 'react';
import { Check } from 'lucide-react';

const SubscriptionTab = () => {
  return (
    <div className="space-y-8 relative z-10 max-w-5xl mx-auto">
      <section className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">Subscription</h1>
        <p className="text-gray-500 mt-1 text-lg">Manage your plan and billing</p>
      </section>

      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-1">Current Plan: <span className="text-blue-600">Free Basic</span></h2>
          <p className="text-gray-600 text-sm">You have 2 applications remaining this month.</p>
        </div>
        <span className="px-4 py-2 bg-white text-gray-700 font-bold rounded-xl shadow-sm border border-gray-200">Free Tier</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
        {/* Free Plan */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-200 flex flex-col">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Basic</h3>
          <div className="flex items-baseline gap-1 mb-6">
            <span className="text-4xl font-black text-gray-900">$0</span>
            <span className="text-gray-500 font-medium">/month</span>
          </div>
          <ul className="space-y-4 mb-8 flex-grow">
            <li className="flex items-center gap-3 text-gray-600">
              <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                <Check className="w-3 h-3 text-blue-600" />
              </div>
              3 applications per month
            </li>
            <li className="flex items-center gap-3 text-gray-600">
              <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                <Check className="w-3 h-3 text-blue-600" />
              </div>
              Basic profile visibility
            </li>
            <li className="flex items-center gap-3 text-gray-600">
              <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                <Check className="w-3 h-3 text-blue-600" />
              </div>
              Standard support
            </li>
          </ul>
          <button disabled className="w-full py-3 rounded-xl bg-gray-100 text-gray-500 font-bold cursor-not-allowed">
            Current Plan
          </button>
        </div>

        {/* Premium Plan */}
        <div className="bg-gradient-to-b from-blue-600 to-purple-700 rounded-3xl p-8 shadow-xl text-white flex flex-col relative transform md:-translate-y-4">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-pink-500 to-orange-400 text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg">
            RECOMMENDED
          </div>
          <h3 className="text-2xl font-bold mb-2">Premium</h3>
          <div className="flex items-baseline gap-1 mb-6">
            <span className="text-4xl font-black">$15</span>
            <span className="text-blue-100 font-medium">/month</span>
          </div>
          <ul className="space-y-4 mb-8 flex-grow">
            <li className="flex items-center gap-3 text-blue-50">
              <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                <Check className="w-3 h-3 text-white" />
              </div>
              Unlimited applications
            </li>
            <li className="flex items-center gap-3 text-blue-50">
              <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                <Check className="w-3 h-3 text-white" />
              </div>
              Featured profile placement
            </li>
            <li className="flex items-center gap-3 text-blue-50">
              <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                <Check className="w-3 h-3 text-white" />
              </div>
              Priority support
            </li>
            <li className="flex items-center gap-3 text-blue-50">
              <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                <Check className="w-3 h-3 text-white" />
              </div>
              Direct messaging with organizers
            </li>
          </ul>
          <button className="w-full py-3 rounded-xl bg-white text-blue-600 font-bold hover:bg-blue-50 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-md">
            Upgrade Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionTab;
