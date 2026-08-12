import { SEO } from '../components/SEO';
import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSubscription } from '../context/SubscriptionContext';
import { Settings as SettingsIcon, CreditCard, ChevronRight, CheckCircle2, ShieldCheck, HelpCircle } from 'lucide-react';
import { toast } from 'sonner';
import { PremiumBadge } from '../components/PremiumBadge';


export const Settings: React.FC = () => {
  const { user, profile } = useAuth();
  const { subscription, plans, isLoading } = useSubscription();
  const navigate = useNavigate();

  if (!user || !profile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <SEO title="Settings | GigsConnect" noindex={true} />

        <div className="w-12 h-12 border-4 border-brand-purple border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const activePlanId = subscription?.plan_id || plans.find(p => p.name.toLowerCase() === 'starter')?.id; // fallback to starter
  const activePlan = plans.find(p => p.id === activePlanId) || plans.find(p => p.name.toLowerCase() === 'starter');
  const isPremium = activePlan?.name.toLowerCase() === 'premium' || activePlan?.name.toLowerCase() === 'pro';

  const handleRestore = () => {
    toast.info('Restore subscription coming soon.');
  };

  return (
    <div className="pt-main pb-24 px-4 sm:px-6 max-w-4xl mx-auto min-h-screen">
      <div className="mb-10">
        <h1 className="text-3xl sm:text-4xl font-black text-brand-black dark:text-white tracking-tight flex items-center gap-3">
          <SettingsIcon className="w-8 h-8 text-brand-purple" />
          Settings
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2 font-medium">Manage your account preferences and subscriptions.</p>
      </div>

      <div className="space-y-8">
        
        {/* Subscription Section */}
        <section className="bg-white dark:bg-brand-dark-card rounded-[2rem] p-6 sm:p-10 border border-gray-100 dark:border-[#27272A] shadow-xl shadow-gray-200/20 dark:shadow-none">
          <div className="flex items-start sm:items-center justify-between mb-8 flex-col sm:flex-row gap-4">
            <div>
              <h2 className="text-xl font-black text-brand-black dark:text-white flex items-center gap-2 mb-1">
                <CreditCard className="w-6 h-6 text-brand-purple" />
                Subscription Plan
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Manage your billing and plan limits.</p>
            </div>
            {activePlan && (
              <PremiumBadge planName={activePlan.name} className="px-4 py-2 text-xs" />
            )}
          </div>

          {isLoading ? (
            <div className="animate-pulse flex space-x-4">
              <div className="flex-1 space-y-4 py-1">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ) : (
            <div className="bg-[#FAFAFA] dark:bg-[#121214] border border-gray-100 dark:border-[#1F1F23] rounded-3xl p-6 sm:p-8">
              
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-8 pb-8 border-b border-gray-200 dark:border-[#27272A]">
                <div>
                  <h3 className="text-gray-500 dark:text-gray-400 text-sm font-black uppercase tracking-widest mb-1">Current Plan</h3>
                  <div className="text-2xl font-black text-brand-black dark:text-white flex items-center gap-2">
                    {activePlan?.name || 'Starter'}
                    {isPremium && <ShieldCheck className="w-5 h-5 text-green-500" />}
                  </div>
                  <div className="mt-2 text-gray-500 dark:text-gray-400 font-medium">
                    {activePlan?.price_naira ? `₦${activePlan.price_naira.toLocaleString()} / month` : 'Free forever'}
                  </div>
                </div>
                
                <div className="flex flex-col sm:items-end gap-3 w-full sm:w-auto">
                  {!isPremium ? (
                    <button 
                      onClick={() => navigate('/#pricing-section')}
                      className="px-6 py-3 bg-brand-purple text-white font-black rounded-xl hover:bg-brand-purple-hover active:scale-95 transition-all shadow-md shadow-brand-purple/20 flex items-center justify-center gap-2 w-full sm:w-auto"
                    >
                      Upgrade Plan <ChevronRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button 
                      onClick={() => navigate('/#pricing-section')}
                      className="px-6 py-3 bg-brand-black dark:bg-white text-white dark:text-brand-black font-black rounded-xl hover:scale-105 active:scale-95 transition-all shadow-md flex items-center justify-center gap-2 w-full sm:w-auto"
                    >
                      Manage Plan
                    </button>
                  )}
                  <button 
                    onClick={handleRestore}
                    className="text-sm font-bold text-gray-500 dark:text-gray-400 hover:text-brand-black dark:hover:text-white transition-colors"
                  >
                    Restore Subscription
                  </button>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-black uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-4">Plan Benefits</h4>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {activePlan?.features && Object.entries(activePlan.features).filter(([_, v]) => v).map(([key]) => (
                    <li key={key} className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-brand-purple shrink-0" />
                      <span className="text-sm font-bold text-gray-700 dark:text-gray-300">
                        {key.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>
          )}
        </section>

        {/* Other Setting sections can go here in the future */}
        
      </div>
    </div>
  );
};
export default Settings;
