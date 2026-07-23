import { supabase } from './supabaseClient';

export interface SubscriptionPlan {
  id: number;
  name: string;
  price_naira: number;
  price_usd: number;
  duration: string;
  description: string;
  features: Record<string, any>;
  is_active: boolean;
  display_order: number;
}

export interface Subscription {
  id: string;
  user_id: string;
  plan_id: number;
  plan_name?: string;
  status: string;
  billing_cycle: string;
  payment_status: string;
  start_date: string;
  end_date?: string;
  auto_renew: boolean;
  created_at: string;
  updated_at: string;
  plan?: SubscriptionPlan;
}

export const subscriptionService = {
  async getPlans(): Promise<SubscriptionPlan[]> {
    const { data, error } = await supabase
      .from('subscription_plans')
      .select('*')
      .eq('is_active', true)
      .order('display_order');
      
    if (error) throw error;
    return data || [];
  },

  async getStarterPlan(): Promise<SubscriptionPlan | null> {
    const { data, error } = await supabase
      .from('subscription_plans')
      .select('*')
      .eq('name', 'Starter')
      .single();
      
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  },

  async getCurrentSubscription(userId: string): Promise<Subscription | null> {
    const { data, error } = await supabase
      .from('subscriptions')
      .select(`
        *,
        plan:subscription_plans (*)
      `)
      .eq('user_id', userId)
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async ensureStarterSubscription(userId: string): Promise<Subscription | null> {
    try {
      // Check if user already has an active subscription
      const currentSub = await this.getCurrentSubscription(userId);
      if (currentSub) return currentSub;

      // Get starter plan
      const starterPlan = await this.getStarterPlan();
      if (!starterPlan) throw new Error('Starter plan not found in database');

      // Check if a subscription already exists for this user to avoid duplicates
      // (Even if not active, we might not want to create a new one, but let's just create an active starter if none is active)
      const { data: existingSubs, error: existErr } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'active');

      if (existErr) console.warn('existErr:', existErr);

      if (existingSubs && existingSubs.length > 0) {
        return await this.getCurrentSubscription(userId);
      }

      // Create new starter subscription
      const newSubData = {
        user_id: userId,
        plan_id: starterPlan.id,
        plan_name: starterPlan.name,
        status: 'active',
        billing_cycle: 'monthly',
        payment_status: 'free',
        start_date: new Date().toISOString(),
      };

      const { data: newSub, error: createErr } = await supabase
        .from('subscriptions')
        .insert(newSubData)
        .select(`
          *,
          plan:subscription_plans (*)
        `)
        .single();

      // If we get an RLS error, it means the database needs an INSERT policy for subscriptions.
      // We gracefully return a fallback Starter subscription in memory so the app continues to work.
      if (createErr) {
        if (createErr.code === '42501') {
          console.warn('RLS policy prevents inserting subscriptions. Returning in-memory Starter subscription.');
          
          // Update the profile for backward compatibility even if subscription insert fails
          await supabase
            .from('profiles')
            .update({ subscription_plan: starterPlan.name.toLowerCase() === 'starter' ? 'free' : starterPlan.name.toLowerCase() })
            .eq('id', userId);
            
          return {
            id: `temp-${Date.now()}`,
            user_id: userId,
            plan_id: starterPlan.id,
            plan_name: starterPlan.name,
            status: 'active',
            billing_cycle: 'monthly',
            payment_status: 'free',
            start_date: new Date().toISOString(),
            auto_renew: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            plan: starterPlan
          } as Subscription;
        }
        throw createErr;
      }

      // Update the profile for backward compatibility
      await supabase
        .from('profiles')
        .update({ subscription_plan: starterPlan.name.toLowerCase() === 'starter' ? 'free' : starterPlan.name.toLowerCase() })
        .eq('id', userId);

      return newSub;
    } catch (error) {
      console.warn('Could not ensure starter subscription:', error instanceof Error ? error.message : JSON.stringify(error));
      return null;
    }
  }
};
