import { supabase } from './supabaseClient';

export interface SubscriptionPlan {
  id: string;
  name: string;
  price_naira: number;
  price_usd: number;
  duration: string;
  features?: string[];
  description?: string;
  is_recommended?: boolean;
}

export const subscriptionsService = {
  async getPlans() {
    const { data, error } = await supabase
      .from('subscription_plans')
      .select('*')
      .order('price_naira', { ascending: true });
    return { data: data as SubscriptionPlan[] | null, error };
  },

  async upgradePlan(userId: string, plan: string) {
    const { data, error } = await supabase
      .from('profiles')
      .update({ subscription_plan: plan.toLowerCase() })
      .eq('id', userId);
    return { data, error };
  }
};
