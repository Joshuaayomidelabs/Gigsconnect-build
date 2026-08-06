import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { subscriptionService, Subscription, SubscriptionPlan } from '../services/subscriptionService';
import { useAuth } from './AuthContext';

interface SubscriptionContextType {
  subscription: Subscription | null;
  plans: SubscriptionPlan[];
  isLoading: boolean;
  refreshSubscription: () => Promise<void>;
  features: Record<string, any>;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export const SubscriptionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPlans = async () => {
    try {
      const p = await subscriptionService.getPlans();
      setPlans(p);
    } catch (err) {
      console.error('Error fetching plans:', err);
    }
  };

  const refreshSubscription = async () => {
    if (!user) {
      setSubscription(null);
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    try {
      const sub = await subscriptionService.ensureStarterSubscription(user.id);
      setSubscription(sub);
    } catch (error) {
      console.error('Error refreshing subscription:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Sequence the calls to prevent concurrent Supabase network requests
    // which can cause "Lock broken" token refresh race conditions
    fetchPlans().then(() => {
      refreshSubscription();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const features = subscription?.plan?.features || {};

  return (
    <SubscriptionContext.Provider value={{ subscription, plans, isLoading, refreshSubscription, features }}>
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
};
