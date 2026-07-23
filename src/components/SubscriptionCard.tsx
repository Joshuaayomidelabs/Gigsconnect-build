import React from 'react';
import { CreditCard, Calendar } from 'lucide-react';
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
  const status = subscription?.status || 'inactive';
  const renewalDate = subscription?.end_date 
    ? new Date(subscription.end_date).toLocaleDateString() 
    : (subscription?.auto_renew ? 'Auto-renews next cycle' : 'No upcoming renewal');
    
  const isStarter = planName.toLowerCase() === 'starter';

  const handleUpgrade = () => {
    navigate('/#pricing-section');
    setTimeout(() => {
      const el = document.getElementById('pricing-section');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  return (
    <div className="bg-brand-white dark:bg-brand-dark-card rounded-3xl p-6 sm:p-8 shadow-sm border border-brand-gray dark:border-brand-black transition-colors relative overflow-hidden">
      {!isStarter && (
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-brand-purple/5 dark:bg-brand-purple/10 rounded-full blur-2xl pointer-events-none" />
      )}
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 relative z-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
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
            
            <div className="flex items-center gap-2 mt-3 text-sm font-medium text-gray-600 dark:text-gray-300">
              <Calendar className="w-4 h-4" />
              <span>Renewal: {renewalDate}</span>
            </div>
          </div>
        </div>
        
        <button 
          onClick={handleUpgrade}
          className="w-full sm:w-auto px-6 py-3 rounded-2xl font-bold transition-all shadow-sm active:scale-95 bg-brand-purple text-white hover:bg-brand-purple-hover hover:shadow-brand-purple/20"
        >
          Upgrade Plan
        </button>
      </div>
    </div>
  );
};
