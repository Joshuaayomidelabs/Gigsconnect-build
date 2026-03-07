import { supabase } from './supabaseClient';

export const subscriptionsService = {
  async upgradePlan(userId: string, plan: 'free' | 'pro' | 'premium') {
    const { data, error } = await supabase
      .from('profiles')
      .update({ subscription_plan: plan })
      .eq('id', userId);
    return { data, error };
  }
};
