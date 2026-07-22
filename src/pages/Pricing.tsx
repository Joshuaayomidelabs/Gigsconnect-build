import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, ShieldAlert, Zap, Lock, CreditCard, ChevronRight, Check } from 'lucide-react';
import { useSubscription } from '../context/SubscriptionContext';
import { toast } from 'sonner';

export const Pricing: React.FC = () => {
  const { plans, subscription, isLoading } = useSubscription();
  const navigate = useNavigate();
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState<number | null>(null);

  const handleUpgradeClick = (planId: number) => {
    setSelectedPlanId(planId);
    setShowUpgradeModal(true);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#FAFAFA] dark:bg-[#09090B] transition-colors">
        <div className="w-12 h-12 border-4 border-brand-purple border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-500 dark:text-gray-400 font-medium">Loading Plans...</p>
      </div>
    );
  }

  const activePlanId = subscription?.plan_id || 4; // fallback to Starter
  
  return (
    <div className="pt-main pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-screen bg-[#FAFAFA] dark:bg-[#09090B] transition-colors duration-500">
      
      {/* Header section */}
      <div className="text-center max-w-3xl mx-auto mb-16 pt-8">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl sm:text-5xl font-black text-brand-black dark:text-brand-white tracking-tight mb-6"
        >
          Supercharge your <span className="text-brand-purple">Creator Journey</span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 font-medium leading-relaxed"
        >
          Whether you're just starting out or scaling an agency, GigsConnect has a plan tailored for your ambition.
        </motion.p>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-20">
        {plans.map((plan, index) => {
          const isPro = plan.name.toLowerCase() === 'pro';
          const isPremium = plan.name.toLowerCase() === 'premium';
          const isCurrentPlan = activePlanId === plan.id;
          
          return (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`relative bg-white dark:bg-brand-dark-card rounded-[2rem] p-8 transition-all duration-300 flex flex-col ${
                isPro 
                  ? 'border-2 border-brand-purple shadow-xl shadow-brand-purple/10 scale-100 md:scale-105 z-10' 
                  : 'border border-gray-200 dark:border-[#1F1F23]/80 shadow-lg'
              }`}
            >
              {isPro && (
                <div className="absolute -top-4 left-0 right-0 flex justify-center">
                  <span className="bg-brand-purple text-white text-xs font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-md">
                    Most Popular
                  </span>
                </div>
              )}
              
              <div className="mb-6">
                <h3 className="text-2xl font-black text-brand-black dark:text-white mb-2 flex items-center gap-2">
                  {plan.name}
                  {isPro && <span className="text-yellow-400 text-lg">⭐</span>}
                  {isPremium && <span className="text-yellow-400 text-lg">👑</span>}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm min-h-[40px]">{plan.description}</p>
              </div>

              <div className="mb-8">
                <div className="flex items-end gap-2 mb-1">
                  <span className="text-4xl font-black text-brand-black dark:text-white">
                    ₦{plan.price_naira.toLocaleString()}
                  </span>
                  <span className="text-gray-500 dark:text-gray-400 text-lg font-medium mb-1">/ mo</span>
                </div>
                <div className="text-sm font-bold text-gray-400 dark:text-gray-500">
                  Or ${plan.price_usd} / mo
                </div>
              </div>

              <div className="flex-grow mb-8">
                <ul className="space-y-4">
                  {Object.entries(plan.features).map(([key, value]) => {
                    if (value) {
                      return (
                        <li key={key} className="flex items-start gap-3">
                          <CheckCircle2 className={`w-5 h-5 shrink-0 ${isPro || isPremium ? 'text-brand-purple' : 'text-green-500'}`} />
                          <span className="text-sm font-bold text-gray-700 dark:text-gray-300">
                            {key.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                          </span>
                        </li>
                      );
                    }
                    return null;
                  })}
                </ul>
              </div>

              <button
                onClick={() => isCurrentPlan ? navigate('/overview') : handleUpgradeClick(plan.id)}
                disabled={isCurrentPlan}
                className={`w-full py-4 rounded-2xl font-black transition-all active:scale-95 ${
                  isCurrentPlan
                    ? 'bg-gray-100 dark:bg-[#18181B] text-gray-500 cursor-default'
                    : isPro || isPremium
                      ? 'bg-brand-purple text-white hover:bg-brand-purple-hover hover:shadow-lg hover:shadow-brand-purple/20'
                      : 'bg-white dark:bg-brand-dark-card border-2 border-brand-gray dark:border-[#27272A] text-brand-black dark:text-white hover:border-brand-purple/50'
                }`}
              >
                {isCurrentPlan ? 'Current Plan' : `Upgrade to ${plan.name}`}
              </button>
            </motion.div>
          );
        })}
      </div>

      {/* Feature Comparison Table */}
      <div className="max-w-5xl mx-auto bg-white dark:bg-brand-dark-card rounded-[2.5rem] p-8 sm:p-12 shadow-xl border border-gray-100 dark:border-[#1F1F23]/80 mb-20 overflow-hidden">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-black text-brand-black dark:text-white mb-4">Compare Features</h2>
          <p className="text-gray-500 dark:text-gray-400 font-medium">See what is included across all plans.</p>
        </div>

        <div className="overflow-x-auto pb-4">
          <table className="w-full min-w-[600px] text-left border-collapse">
            <thead>
              <tr>
                <th className="py-6 px-4 font-black text-sm uppercase tracking-widest text-gray-500 w-1/3 border-b border-gray-100 dark:border-[#1F1F23]">Feature</th>
                {plans.map(plan => (
                  <th key={plan.id} className="py-6 px-4 font-black text-center text-lg text-brand-black dark:text-white border-b border-gray-100 dark:border-[#1F1F23]">
                    {plan.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {plans.length > 0 && Object.keys(plans[0].features).map((featureKey, index) => (
                <tr key={featureKey} className="hover:bg-gray-50 dark:hover:bg-[#18181B]/50 transition-colors">
                  <td className="py-4 px-4 text-sm font-bold text-gray-700 dark:text-gray-300 border-b border-gray-50 dark:border-[#1F1F23]/40">
                    {featureKey.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                  </td>
                  {plans.map(plan => (
                    <td key={plan.id} className="py-4 px-4 text-center border-b border-gray-50 dark:border-[#1F1F23]/40">
                      {plan.features[featureKey] ? (
                        <Check className="w-5 h-5 mx-auto text-brand-purple" />
                      ) : (
                        <div className="w-5 h-5 mx-auto flex items-center justify-center text-gray-300 dark:text-[#27272A]">
                          -
                        </div>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Upgrade Modal */}
      <AnimatePresence>
        {showUpgradeModal && selectedPlanId && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white dark:bg-brand-dark-card w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden border border-gray-100 dark:border-[#1F1F23]"
            >
              <div className="p-8">
                {(() => {
                  const targetPlan = plans.find(p => p.id === selectedPlanId);
                  if (!targetPlan) return null;
                  
                  return (
                    <>
                      <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-brand-purple/10 text-brand-purple rounded-2xl flex items-center justify-center mx-auto mb-4">
                          <Zap className="w-8 h-8" />
                        </div>
                        <h2 className="text-2xl font-black text-brand-black dark:text-white mb-2">
                          Upgrade to {targetPlan.name}
                        </h2>
                        <div className="flex items-center justify-center gap-2">
                          <span className="text-3xl font-black text-brand-purple">₦{targetPlan.price_naira.toLocaleString()}</span>
                          <span className="text-gray-500 font-medium">/ month</span>
                        </div>
                      </div>

                      <div className="space-y-6 mb-8">
                        <h4 className="text-xs font-black uppercase tracking-widest text-gray-500 dark:text-gray-400">Payment Methods</h4>
                        
                        <div className="space-y-3">
                          {['Paystack', 'Flutterwave', 'Stripe'].map((gateway) => (
                            <div key={gateway} className="flex items-center justify-between p-4 rounded-2xl border border-gray-100 dark:border-[#27272A] bg-[#FAFAFA] dark:bg-[#121214] opacity-70 grayscale cursor-not-allowed">
                              <div className="flex items-center gap-3">
                                <CreditCard className="w-5 h-5 text-gray-400" />
                                <span className="font-bold text-brand-black dark:text-white">{gateway}</span>
                              </div>
                              <span className="text-[10px] font-black uppercase tracking-wider text-brand-purple bg-brand-purple/10 px-2 py-1 rounded-md">
                                Coming Soon
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex flex-col gap-3">
                        <button 
                          onClick={() => {
                            toast.info('Payment integration coming soon.', {
                              icon: '🚀'
                            });
                          }}
                          className="w-full py-4 bg-brand-purple text-white font-black rounded-2xl hover:bg-brand-purple-hover active:scale-95 transition-all shadow-lg shadow-brand-purple/20"
                        >
                          Continue to Payment
                        </button>
                        <button 
                          onClick={() => setShowUpgradeModal(false)}
                          className="w-full py-4 bg-transparent text-gray-500 dark:text-gray-400 font-bold hover:text-brand-black dark:hover:text-white transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </>
                  );
                })()}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
export default Pricing;
