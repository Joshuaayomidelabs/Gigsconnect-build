import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, ChevronRight, CheckCircle2, ShieldCheck, RefreshCw, Calendar, Sparkles } from 'lucide-react';
import { useSubscription } from '../../context/SubscriptionContext';
import { PremiumBadge } from '../PremiumBadge';
import { toast } from 'sonner';

export const SubscriptionSection: React.FC = () => {
  const { subscription, plans, isLoading, refreshSubscription } = useSubscription();
  const navigate = useNavigate();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const activePlanId = subscription?.plan_id || plans.find(p => p.name.toLowerCase() === 'starter')?.id;
  const activePlan = plans.find(p => p.id === activePlanId) || plans.find(p => p.name.toLowerCase() === 'starter');
  const isPaidPlan = activePlan?.name.toLowerCase() === 'premium' || activePlan?.name.toLowerCase() === 'pro';

  const handleRefresh = async () => {
    try {
      setIsRefreshing(true);
      await refreshSubscription();
      toast.success('Subscription status refreshed.');
    } catch (err: any) {
      console.error('Failed to refresh subscription:', err);
      toast.error('Could not refresh subscription status.');
    } finally {
      setIsRefreshing(false);
    }
  };

  const formattedExpiry = subscription?.end_date 
    ? new Date(subscription.end_date).toLocaleDateString(undefined, { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      })
    : null;

  return (
    <section id="subscription-section" className="bg-white dark:bg-brand-dark-card rounded-2xl sm:rounded-3xl p-5 sm:p-8 border border-gray-100 dark:border-[#27272A] shadow-xs">
      <div className="flex items-start sm:items-center justify-between mb-6 pb-6 border-b border-gray-100 dark:border-gray-800 flex-col sm:flex-row gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-brand-purple/10 dark:bg-brand-purple/20 text-brand-purple flex items-center justify-center shrink-0">
            <CreditCard className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-black text-brand-black dark:text-brand-white">Subscription & Verification</h2>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Manage your creator tier and verification badge.</p>
          </div>
        </div>
        {activePlan && (
          <PremiumBadge planName={activePlan.name} className="px-3.5 py-1.5 text-xs self-start sm:self-auto" />
        )}
      </div>

      {isLoading ? (
        <div className="animate-pulse space-y-4 py-4">
          <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-1/3"></div>
          <div className="h-10 bg-gray-200 dark:bg-gray-800 rounded-2xl"></div>
        </div>
      ) : (
        <div className="bg-[#FAF9FD] dark:bg-[#121214] border border-purple-100/60 dark:border-[#1F1F23] rounded-3xl p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-8 pb-8 border-b border-gray-200/80 dark:border-[#27272A]">
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-gray-500 dark:text-gray-400 block mb-1">
                Current Plan
              </span>
              <div className="text-2xl sm:text-3xl font-black text-brand-black dark:text-white flex items-center gap-2">
                {activePlan?.name || 'Starter'}
                {isPaidPlan && <ShieldCheck className="w-6 h-6 text-brand-purple" />}
              </div>
              
              <div className="mt-2 text-sm text-gray-600 dark:text-gray-400 font-medium flex flex-wrap items-center gap-2">
                <span>{activePlan?.price_naira ? `₦${activePlan.price_naira.toLocaleString()} / month` : 'Free forever'}</span>
                
                {formattedExpiry ? (
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-brand-purple bg-brand-purple/10 px-2.5 py-0.5 rounded-full">
                    <Calendar className="w-3 h-3" /> Expires on {formattedExpiry}
                  </span>
                ) : (
                  <span className="text-xs text-gray-400 dark:text-gray-500">(One-time payment per cycle)</span>
                )}
              </div>
            </div>
            
            <div className="flex flex-col sm:items-end gap-3 w-full sm:w-auto">
              <button 
                onClick={() => navigate('/#pricing-section')}
                className={`px-6 py-3 font-black text-xs sm:text-sm rounded-xl active:scale-95 transition-all shadow-md flex items-center justify-center gap-2 w-full sm:w-auto cursor-pointer ${
                  isPaidPlan 
                    ? 'bg-brand-black dark:bg-white text-white dark:text-brand-black hover:opacity-90'
                    : 'bg-brand-purple hover:bg-brand-purple-hover text-white shadow-brand-purple/20'
                }`}
              >
                {isPaidPlan ? 'Renew or change plan' : 'Upgrade Plan'}
                <ChevronRight className="w-4 h-4" />
              </button>

              <button 
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="text-xs font-bold text-gray-500 dark:text-gray-400 hover:text-brand-purple dark:hover:text-brand-purple transition-colors inline-flex items-center gap-1.5 self-center sm:self-end cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
                {isRefreshing ? 'Refreshing...' : 'Refresh status'}
              </button>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-4 flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-brand-purple" />
              Included Plan Features
            </h4>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {activePlan?.features && Object.entries(activePlan.features).filter(([_, v]) => v).map(([key]) => (
                <li key={key} className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span className="text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300">
                    {key.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </section>
  );
};
export default SubscriptionSection;
