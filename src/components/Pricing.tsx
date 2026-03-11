import React, { useState, useEffect } from 'react';
import { Check, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { subscriptionsService, SubscriptionPlan } from '../services/subscriptionsService';

interface PricingTier {
  name: string;
  price: string;
  subPrice?: string;
  description: string;
  features: string[];
  recommended: boolean;
}

const Pricing: React.FC = () => {
  const [region, setRegion] = useState<'nigeria' | 'international'>('nigeria');
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPlans = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await subscriptionsService.getPlans();
        if (error) throw error;
        if (data) setPlans(data);
      } catch (err) {
        console.error('Error fetching plans:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPlans();
  }, []);

  const formatCurrency = (amount: number, currency: 'NGN' | 'USD') => {
    if (amount === 0) return currency === 'NGN' ? '₦0' : '$0';
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getPlanFeatures = (name: string) => {
    switch (name.toLowerCase()) {
      case 'starter': return ['Apply to 20 gigs per month', 'Access basic platform features', 'Community support'];
      case 'pro': return ['Unlimited applications', 'Verified Badge', 'Priority support', 'Early access to gigs'];
      case 'premium': return ['All Pro features', 'Featured profile', 'Direct messaging', 'Dedicated account manager'];
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

  const tiers: PricingTier[] = plans.map(plan => ({
    name: plan.name,
    price: region === 'nigeria' ? formatCurrency(plan.price_naira, 'NGN') : formatCurrency(plan.price_usd, 'USD'),
    subPrice: `/${plan.duration}`,
    description: plan.description || getPlanDescription(plan.name),
    features: plan.features || getPlanFeatures(plan.name),
    recommended: plan.name.toLowerCase() === 'pro' || plan.is_recommended === true
  }));

  return (
    <section id="pricing" className="py-24 lg:py-32 bg-brand-white">
      <div className="max-w-[1200px] mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-brand-black mb-6 tracking-tighter leading-[1.1]">
            Simple, <span className="text-brand-purple">Transparent</span> Pricing
          </h2>
          <p className="text-brand-gray-dark text-lg md:text-xl mb-10 leading-relaxed font-medium">
            Invest in your music career. Choose the plan that fits your stage.
          </p>
          
          {/* Toggle */}
          <div className="inline-flex bg-brand-gray p-1.5 rounded-full border border-brand-purple-light/20 shadow-sm relative">
            <button
              onClick={() => setRegion('nigeria')}
              className={`px-8 py-3 rounded-full text-base font-bold transition-all duration-200 ${
                region === 'nigeria' 
                  ? 'bg-brand-purple text-white shadow-md' 
                  : 'text-brand-gray-dark hover:bg-white'
              }`}
            >
              Nigeria (₦)
            </button>
            <button
              onClick={() => setRegion('international')}
              className={`px-8 py-3 rounded-full text-base font-bold transition-all duration-200 ${
                region === 'international' 
                  ? 'bg-brand-purple text-white shadow-md' 
                  : 'text-brand-gray-dark hover:bg-white'
              }`}
            >
              International ($)
            </button>
          </div>
        </motion.div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-brand-purple" />
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {tiers.map((tier, index) => (
              <motion.div 
                key={index} 
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, ease: "easeOut", delay: index * 0.15 }}
                className={`relative rounded-[2rem] p-8 md:p-10 transition-all duration-300 flex flex-col ${
                  tier.recommended 
                    ? 'bg-brand-black text-white shadow-2xl scale-105 z-10 border-2 border-brand-purple' 
                    : 'bg-white text-brand-black border border-brand-purple-light/30 shadow-lg hover:shadow-xl'
                }`}
              >
                {tier.recommended && (
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-brand-purple text-white px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wide shadow-lg">
                    Most Popular
                  </div>
                )}
                
                <div className="mb-6">
                  <h3 className={`text-2xl font-bold mb-2 ${tier.recommended ? 'text-white' : 'text-brand-black'}`}>{tier.name}</h3>
                  <p className={`text-base font-medium ${tier.recommended ? 'text-white/80' : 'text-brand-gray-dark'}`}>{tier.description}</p>
                </div>

                <div className="mb-8">
                  <span className={`text-5xl font-black tracking-tighter ${tier.recommended ? 'text-white' : 'text-brand-black'}`}>{tier.price}</span>
                  {tier.subPrice && (
                    <span className={`text-sm block mt-2 font-medium ${tier.recommended ? 'text-white/70' : 'text-brand-gray-dark'}`}>{tier.subPrice}</span>
                  )}
                </div>

                <ul className="space-y-5 mb-10 flex-grow">
                  {tier.features.map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <Check className={`w-6 h-6 mr-3 flex-shrink-0 ${tier.recommended ? 'text-brand-purple-light' : 'text-brand-purple'}`} />
                      <span className={`text-base font-medium ${tier.recommended ? 'text-white/90' : 'text-brand-black/80'}`}>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link 
                  to="/signup"
                  className={`w-full py-4 rounded-full font-semibold text-lg transition-all text-center inline-block hover:scale-105 ${
                    tier.recommended 
                      ? 'bg-brand-purple text-white hover:bg-brand-purple-dark shadow-lg shadow-purple-500/20' 
                      : 'bg-brand-purple-soft text-brand-purple hover:bg-brand-purple-light'
                  }`}
                >
                  Get Started
                </Link>
              </motion.div>
            ))}
          </div>
        )}
        
        <motion.p 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-center text-brand-gray-dark text-sm mt-16 font-medium"
        >
          * Pricing subject to change based on local currency fluctuations for international users.
        </motion.p>
      </div>
    </section>
  );
};

export default Pricing;
