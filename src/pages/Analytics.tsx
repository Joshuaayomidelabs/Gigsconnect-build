import React from 'react';
import { useSubscription } from '../context/SubscriptionContext';
import { LockedFeature } from '../components/LockedFeature';
import { BarChart } from 'lucide-react';

export const Analytics: React.FC = () => {
  const { subscription, plans } = useSubscription();
  const activePlanId = subscription?.plan_id || plans.find(p => p.name.toLowerCase() === 'starter')?.id; // starter
  const activePlan = plans.find(p => p.id === activePlanId);
  const isPremium = activePlan?.name.toLowerCase() === 'premium' || activePlan?.name.toLowerCase() === 'pro';

  return (
    <div className="pt-main pb-24 px-4 sm:px-6 max-w-6xl mx-auto min-h-screen">
      <div className="mb-10">
        <h1 className="text-3xl sm:text-4xl font-black text-brand-black dark:text-white tracking-tight flex items-center gap-3">
          <BarChart className="w-8 h-8 text-brand-purple" />
          Profile Analytics
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2 font-medium">Track your performance and audience engagement.</p>
      </div>

      {!isPremium ? (
        <LockedFeature 
          title="Profile Analytics" 
          description="See who is viewing your profile, track application success rates, and gain insights into your audience." 
          requiredPlan="Pro" 
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Mock Analytics Dashboard for Pro/Premium users */}
          <div className="bg-white dark:bg-brand-dark-card p-6 rounded-[2rem] border border-gray-100 dark:border-[#27272A] shadow-lg">
            <h3 className="text-sm font-black text-gray-500 uppercase tracking-widest mb-2">Profile Views</h3>
            <p className="text-4xl font-black text-brand-black dark:text-white">1,248</p>
            <p className="text-sm font-bold text-green-500 mt-2">+12% this week</p>
          </div>
          <div className="bg-white dark:bg-brand-dark-card p-6 rounded-[2rem] border border-gray-100 dark:border-[#27272A] shadow-lg">
            <h3 className="text-sm font-black text-gray-500 uppercase tracking-widest mb-2">Search Appearances</h3>
            <p className="text-4xl font-black text-brand-black dark:text-white">8,401</p>
            <p className="text-sm font-bold text-green-500 mt-2">+4% this week</p>
          </div>
          <div className="bg-white dark:bg-brand-dark-card p-6 rounded-[2rem] border border-gray-100 dark:border-[#27272A] shadow-lg">
            <h3 className="text-sm font-black text-gray-500 uppercase tracking-widest mb-2">Application Success</h3>
            <p className="text-4xl font-black text-brand-black dark:text-white">24%</p>
            <p className="text-sm font-bold text-gray-400 mt-2">Top 5% of creators</p>
          </div>
        </div>
      )}
    </div>
  );
};
export default Analytics;
