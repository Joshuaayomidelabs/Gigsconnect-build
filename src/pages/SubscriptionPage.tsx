import React, { useState, useEffect } from 'react';
import { Check, Loader2, Star, Shield, Zap } from 'lucide-react';
import { motion } from 'motion/react';
import { supabase } from '../services/supabaseClient';
import { subscriptionsService } from '../services/subscriptionsService';

const SubscriptionPage: React.FC = () => {
  const [currentPlan, setCurrentPlan] = useState('starter');
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data } = await supabase.from('profiles').select('subscription_plan').eq('id', session.user.id).single();
        if (data) setCurrentPlan(data.subscription_plan || 'starter');
      }
      setIsFetching(false);
    };
    fetchProfile();
  }, []);

  const handleUpgrade = async (plan: 'starter' | 'pro' | 'premium') => {
    setIsLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Login required');
      
      const { error } = await subscriptionsService.upgradePlan(session.user.id, plan);
      if (error) throw error;
      
      setCurrentPlan(plan);
      alert(`Successfully upgraded to ${plan} plan!`);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const plans = [
    {
      id: 'starter',
      name: 'Starter',
      price: 'Free',
      priceUSD: '$0',
      description: 'Perfect for getting started',
      features: ['Apply to 20 gigs per month', 'Access basic platform features', 'Community support'],
      icon: <Star className="w-6 h-6 text-brand-gray-dark" />,
      color: 'gray'
    },
    {
      id: 'pro',
      name: 'Pro',
      price: '₦1,500',
      priceUSD: '$2',
      description: 'For serious musicians',
      features: ['Unlimited gig applications', 'Access all core platform tools', 'Early access to new features', 'Priority support'],
      icon: <Zap className="w-6 h-6 text-brand-purple" />,
      color: 'brand'
    },
    {
      id: 'premium',
      name: 'Premium',
      price: '₦2,500',
      priceUSD: '$5',
      description: 'The ultimate talent package',
      features: ['Increased visibility across platform', 'Higher ranking in talent listings', 'Priority placement in gig searches', 'All Pro features included', 'Unlimited gig applications'],
      icon: <Shield className="w-6 h-6 text-brand-purple" />,
      color: 'purple',
      recommended: true
    }
  ];

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
        {plans.map((plan) => (
          <motion.div 
            key={plan.id}
            whileHover={{ y: -10 }}
            className={`relative bg-white rounded-[2.5rem] p-8 shadow-sm border-2 transition-all flex flex-col ${
              plan.recommended ? 'border-brand-purple shadow-2xl scale-105 z-10' : 'border-brand-purple-light/20'
            }`}
          >
            {plan.recommended && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-brand-purple text-white px-6 py-1.5 rounded-full text-xs font-black uppercase tracking-widest shadow-lg">
                Recommended
              </div>
            )}
            
            <div className="mb-8">
              <div className={`w-14 h-14 rounded-2xl ${plan.recommended ? 'bg-brand-purple-soft' : 'bg-brand-gray'} flex items-center justify-center mb-6`}>
                {plan.icon}
              </div>
              <h3 className="text-2xl font-black text-brand-black">{plan.name}</h3>
              <div className="mt-4">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-brand-black">{plan.price}</span>
                  <span className="text-brand-gray-dark font-bold">/month</span>
                </div>
                {plan.priceUSD !== '$0' && (
                  <div className="text-brand-purple font-bold text-sm mt-1">
                    or {plan.priceUSD}/month
                  </div>
                )}
              </div>
              <p className="text-brand-gray-dark mt-4 text-sm font-medium">{plan.description}</p>
            </div>

            <ul className="space-y-4 mb-10 flex-grow">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-brand-gray-dark font-medium">
                  <Check className="w-5 h-5 text-brand-purple flex-shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>

            <button 
              disabled={isLoading || currentPlan === plan.id}
              onClick={() => handleUpgrade(plan.id as any)}
              className={`w-full py-4 rounded-2xl font-black transition-all active:scale-95 disabled:opacity-50 shadow-md ${
                currentPlan === plan.id 
                  ? 'bg-brand-gray text-brand-gray-dark cursor-default shadow-none'
                  : plan.recommended
                    ? 'bg-brand-purple text-white hover:bg-brand-purple-dark purple-glow'
                    : 'bg-brand-black text-white hover:bg-black'
              }`}
            >
              {currentPlan === plan.id ? 'Current Plan' : plan.id === 'starter' ? 'Get Started' : `Upgrade to ${plan.name}`}
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default SubscriptionPage;
