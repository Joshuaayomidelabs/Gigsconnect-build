import React, { useState, useEffect } from 'react';
import { Check, Loader2, Star, Shield, Zap } from 'lucide-react';
import { motion } from 'motion/react';
import { supabase } from '../services/supabaseClient';
import { subscriptionsService, SubscriptionPlan } from '../services/subscriptionsService';

const SubscriptionPage: React.FC = () => {
  const [currentPlan, setCurrentPlan] = useState('starter');
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsFetching(true);
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          const { data: profileData } = await supabase.from('profiles').select('subscription_plan').eq('id', session.user.id).single();
          if (profileData) setCurrentPlan(profileData.subscription_plan || 'starter');
        }

        const { data: plansData, error: plansError } = await subscriptionsService.getPlans();
        if (plansError) throw plansError;
        if (plansData) setPlans(plansData);
      } catch (err: any) {
        console.error('Error fetching subscription data:', err);
      } finally {
        setIsFetching(false);
      }
    };
    fetchData();
  }, []);

  const handleUpgrade = async (planName: string) => {
    setIsLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Login required');
      
      const { error } = await subscriptionsService.upgradePlan(session.user.id, planName);
      if (error) throw error;
      
      setCurrentPlan(planName.toLowerCase());
      alert(`Successfully upgraded to ${planName} plan!`);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount: number, currency: 'NGN' | 'USD') => {
    if (amount === 0) return 'Free';
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getPlanIcon = (name: string) => {
    switch (name.toLowerCase()) {
      case 'starter': return <Star className="w-6 h-6 text-brand-gray-dark" />;
      case 'pro': return <Zap className="w-6 h-6 text-brand-purple" />;
      case 'premium': return <Shield className="w-6 h-6 text-brand-purple" />;
      default: return <Star className="w-6 h-6 text-brand-purple" />;
    }
  };

  const getPlanFeatures = (name: string) => {
    switch (name.toLowerCase()) {
      case 'starter': return ['Apply to 20 gigs per month', 'Access basic platform features', 'Community support'];
      case 'pro': return ['Unlimited gig applications', 'Access all core platform tools', 'Early access to new features', 'Priority support'];
      case 'premium': return ['Increased visibility across platform', 'Higher ranking in talent listings', 'Priority placement in gig searches', 'All Pro features included', 'Unlimited gig applications'];
      default: return [];
    }
  };

  const getPlanDescription = (name: string) => {
    switch (name.toLowerCase()) {
      case 'starter': return 'Perfect for getting started';
      case 'pro': return 'For serious musicians';
      case 'premium': return 'The ultimate talent package';
      default: return '';
    }
  };

  if (isFetching) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-brand-gray">
        <Loader2 className="w-10 h-10 animate-spin text-brand-purple" />
      </div>
    );
  }

  return (
    <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-screen bg-brand-gray">
      <section className="text-center mb-16">
        <h1 className="text-5xl font-black text-brand-black tracking-tight mb-4">Choose Your <span className="text-brand-purple">Plan</span></h1>
        <p className="text-brand-gray-dark text-xl max-w-2xl mx-auto">
          Unlock more opportunities and stand out from the crowd with our premium plans.
        </p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan) => {
          const isCurrent = currentPlan === plan.name.toLowerCase();
          const isRecommended = plan.name.toLowerCase() === 'premium'; // Or use is_recommended from DB if available

          return (
            <motion.div 
              key={plan.id}
              whileHover={{ y: -10 }}
              className={`relative bg-white rounded-[2.5rem] p-8 shadow-sm border-2 transition-all flex flex-col ${
                isRecommended ? 'border-brand-purple shadow-2xl scale-105 z-10' : 'border-brand-purple-light/20'
              }`}
            >
              {isRecommended && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-brand-purple text-white px-6 py-1.5 rounded-full text-xs font-black uppercase tracking-widest shadow-lg">
                  Recommended
                </div>
              )}
              
              <div className="mb-8">
                <div className={`w-14 h-14 rounded-2xl ${isRecommended ? 'bg-brand-purple-soft' : 'bg-brand-gray'} flex items-center justify-center mb-6`}>
                  {getPlanIcon(plan.name)}
                </div>
                <h3 className="text-2xl font-black text-brand-black">{plan.name}</h3>
                <div className="mt-4">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black text-brand-black">{formatCurrency(plan.price_naira, 'NGN')}</span>
                    <span className="text-brand-gray-dark font-bold">/{plan.duration}</span>
                  </div>
                  {plan.price_usd > 0 && (
                    <div className="text-brand-purple font-bold text-sm mt-1">
                      or {formatCurrency(plan.price_usd, 'USD')}/{plan.duration}
                    </div>
                  )}
                </div>
                <p className="text-brand-gray-dark mt-4 text-sm font-medium">{plan.description || getPlanDescription(plan.name)}</p>
              </div>

              <ul className="space-y-4 mb-10 flex-grow">
                {(plan.features || getPlanFeatures(plan.name)).map((feature, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-brand-gray-dark font-medium">
                    <Check className="w-5 h-5 text-brand-purple flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>

              <button 
                disabled={isLoading || isCurrent}
                onClick={() => handleUpgrade(plan.name)}
                className={`w-full py-4 rounded-2xl font-black transition-all active:scale-95 disabled:opacity-50 shadow-md ${
                  isCurrent 
                    ? 'bg-brand-gray text-brand-gray-dark cursor-default shadow-none'
                    : isRecommended
                      ? 'bg-brand-purple text-white hover:bg-brand-purple-dark purple-glow'
                      : 'bg-brand-black text-white hover:bg-black'
                }`}
              >
                {isCurrent ? 'Current Plan' : plan.name.toLowerCase() === 'starter' ? 'Get Started' : `Upgrade to ${plan.name}`}
              </button>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default SubscriptionPage;
