import React, { useState, useEffect } from 'react';
import { Check, Loader2, Star, Shield, Zap } from 'lucide-react';
import { motion } from 'motion/react';
import { supabase } from '../services/supabaseClient';
import { subscriptionsService } from '../services/subscriptionsService';

const SubscriptionPage: React.FC = () => {
  const [currentPlan, setCurrentPlan] = useState('free');
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data } = await supabase.from('profiles').select('subscription_plan').eq('id', session.user.id).single();
        if (data) setCurrentPlan(data.subscription_plan);
      }
      setIsFetching(false);
    };
    fetchProfile();
  }, []);

  const handleUpgrade = async (plan: 'free' | 'pro' | 'premium') => {
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
      id: 'free',
      name: 'Free',
      price: '$0',
      description: 'Perfect for getting started',
      features: ['Apply to 5 gigs/month', 'Basic profile', 'Community support'],
      icon: <Star className="w-6 h-6 text-gray-400" />,
      color: 'gray'
    },
    {
      id: 'pro',
      name: 'Pro',
      price: '$19',
      description: 'For serious musicians',
      features: ['Unlimited applications', 'Verified Badge', 'Priority support', 'Early access to gigs'],
      icon: <Zap className="w-6 h-6 text-yellow-500" />,
      color: 'brand',
      popular: true
    },
    {
      id: 'premium',
      name: 'Premium',
      price: '$49',
      description: 'The ultimate talent package',
      features: ['All Pro features', 'Featured profile', 'Direct messaging', 'Dedicated account manager'],
      icon: <Shield className="w-6 h-6 text-purple-500" />,
      color: 'purple'
    }
  ];

  if (isFetching) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-10 h-10 animate-spin text-brand-600" />
      </div>
    );
  }

  return (
    <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-screen">
      <section className="text-center mb-16">
        <h1 className="text-5xl font-black text-gray-900 tracking-tight mb-4">Choose Your Plan</h1>
        <p className="text-gray-500 text-xl max-w-2xl mx-auto">
          Unlock more opportunities and stand out from the crowd with our premium plans.
        </p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <motion.div 
            key={plan.id}
            whileHover={{ y: -10 }}
            className={`relative bg-white rounded-[2.5rem] p-8 shadow-sm border-2 transition-all ${
              plan.popular ? 'border-brand-600 shadow-xl' : 'border-gray-100'
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-brand-600 text-white px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest">
                Most Popular
              </div>
            )}
            
            <div className="mb-8">
              <div className={`w-12 h-12 rounded-2xl bg-${plan.color}-50 flex items-center justify-center mb-4`}>
                {plan.icon}
              </div>
              <h3 className="text-2xl font-black text-gray-900">{plan.name}</h3>
              <div className="flex items-baseline gap-1 mt-2">
                <span className="text-4xl font-black text-gray-900">{plan.price}</span>
                <span className="text-gray-500 font-bold">/month</span>
              </div>
              <p className="text-gray-500 mt-4 text-sm font-medium">{plan.description}</p>
            </div>

            <ul className="space-y-4 mb-10">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-gray-600 font-medium">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>

            <button 
              disabled={isLoading || currentPlan === plan.id}
              onClick={() => handleUpgrade(plan.id as any)}
              className={`w-full py-4 rounded-2xl font-black transition-all active:scale-95 disabled:opacity-50 ${
                currentPlan === plan.id 
                  ? 'bg-gray-100 text-gray-500 cursor-default'
                  : plan.popular
                    ? 'bg-brand-600 text-white hover:bg-brand-700 shadow-lg'
                    : 'bg-gray-900 text-white hover:bg-black'
              }`}
            >
              {currentPlan === plan.id ? 'Current Plan' : `Upgrade to ${plan.name}`}
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default SubscriptionPage;
