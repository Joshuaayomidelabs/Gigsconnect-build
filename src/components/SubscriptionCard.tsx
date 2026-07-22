import React from 'react';
import { motion } from 'motion/react';
import { CreditCard, CheckCircle2, ShieldAlert } from 'lucide-react';
import { useSubscription } from '../context/SubscriptionContext';
import { useNavigate } from 'react-router-dom';

export const SubscriptionCard: React.FC = () => {
  const { subscription, isLoading } = useSubscription();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="bg-brand-white dark:bg-brand-dark-card rounded-3xl p-6 sm:p-8 shadow-sm border border-brand-gray dark:border-brand-black animate-pulse">
        <div className="h-6 w-48 bg-gray-200 dark:bg-gray-800 rounded-lg mb-4"></div>
        <div className="h-4 w-32 bg-gray-200 dark:bg-gray-800 rounded-lg"></div>
      </div>
    );
  }

  const planName = subscription?.plan?.name || subscription?.plan_name || 'Starter';
  const price = subscription?.plan?.price_naira ? `₦${subscription.plan.price_naira.toLocaleString()}` : 'Free';
  const cycle = subscription?.billing_cycle || 'monthly';
  const status = subscription?.status || 'inactive';
  
  const isStarter = planName.toLowerCase() === 'starter';

  return (
    <div className="bg-brand-white dark:bg-brand-dark-card rounded-3xl p-6 sm:p-8 shadow-sm border border-brand-gray dark:border-brand-black transition-colors relative overflow-hidden">
      {/* Decorative background */}
      {!isStarter && (
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-brand-purple/5 dark:bg-brand-purple/10 rounded-full blur-2xl pointer-events-none" />
      )}
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 relative z-10">
        <div className="flex items-start gap-4">
          <div className={`p-4 rounded-2xl ${isStarter ? 'bg-gray-100 dark:bg-gray-800 text-gray-500' : 'bg-brand-purple/10 text-brand-purple'}`}>
            <CreditCard className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xs font-black uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-1">
              Current Plan
            </h3>
            <div className="flex items-center gap-3">
              <span className="text-2xl font-black text-brand-black dark:text-brand-white">
                {planName}
              </span>
              <span className={`px-2.5 py-1 text-xs font-bold rounded-lg uppercase tracking-wider ${
                status === 'active' 
                  ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                  : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
              }`}>
                {status}
              </span>
            </div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mt-2">
              {price} / {cycle}
            </p>
          </div>
        </div>

        <button 
          onClick={() => navigate(isStarter ? '/pricing' : '/settings')}
          className={`w-full sm:w-auto px-6 py-3 rounded-2xl font-bold transition-all shadow-sm active:scale-95 ${
            isStarter 
              ? 'bg-brand-purple text-white hover:bg-brand-purple-hover hover:shadow-brand-purple/20' 
              : 'bg-brand-gray dark:bg-brand-black text-brand-black dark:text-brand-white border border-brand-gray dark:border-brand-black hover:border-brand-purple'
          }`}
        >
          {isStarter ? 'Upgrade Plan' : 'Manage Subscription'}
        </button>
      </div>

      <div className="mt-8 pt-6 border-t border-brand-gray dark:border-brand-black grid grid-cols-1 sm:grid-cols-2 gap-4">
        {subscription?.plan?.features && Object.entries(subscription.plan.features).map(([key, value]) => {
          if (typeof value === 'boolean') {
            return (
              <div key={key} className="flex items-center gap-3 text-sm font-medium text-brand-black dark:text-brand-white">
                {value ? (
                  <CheckCircle2 className="w-5 h-5 text-brand-purple" />
                ) : (
                  <ShieldAlert className="w-5 h-5 text-gray-300 dark:text-gray-700" />
                )}
                <span className={!value ? 'text-gray-400 dark:text-gray-600' : ''}>
                  {key.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                </span>
              </div>
            );
          }
          return null;
        })}
      </div>
    </div>
  );
};
