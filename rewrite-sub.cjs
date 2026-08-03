const fs = require('fs');

const content = `import { supabase } from './supabaseClient';

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
      .select(\`
        *,
        plan:subscription_plans (*)
      \`)
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
      // Get the actual authenticated user from Supabase to ensure accurate RLS evaluation
      const { data: { user: authUser }, error: authErr } = await supabase.auth.getUser();
      
      if (authErr || !authUser) {
        console.warn('Cannot ensure starter subscription: no authenticated supabase user found.');
        return null;
      }
      
      const actualUserId = authUser.id;

      // Check if user already has an active subscription to prevent duplicates
      const currentSub = await this.getCurrentSubscription(actualUserId);
      if (currentSub) return currentSub;

      // Get starter plan
      const starterPlan = await this.getStarterPlan();
      if (!starterPlan) throw new Error('Starter plan not found in database');

      // Create new starter subscription payload (without the 'pro' workaround)
      const newSubData = {
        user_id: actualUserId,
        plan_id: starterPlan.id,
        plan_name: starterPlan.name, // Will be 'Starter'
        status: 'active',
        billing_cycle: 'monthly',
        payment_status: 'free',
        start_date: new Date().toISOString(),
      };

      console.log(\`[Subscription Flow] Verified Authenticated User ID: \${actualUserId}. Attempting to insert Starter subscription.\`);
      
      // We must insert without .select() because the restrictive RLS SELECT policy
      // on the subscriptions table blocks the RETURNING clause and causes a 42501 error.
      const { error: createErr } = await supabase
        .from('subscriptions')
        .insert(newSubData);
      
      if (createErr) {
        console.error('Subscription insert error:', createErr);
        throw new Error('Unable to create your subscription at this time. Please try again later.');
      }

      // Update the profile for backward compatibility
      await supabase
        .from('profiles')
        .update({ subscription_plan: 'free' })
        .eq('id', actualUserId);

      // Return a constructed subscription object in memory since we bypassed .select()
      return {
        ...newSubData,
        id: \`temp-\${Date.now()}\`,
        plan: starterPlan,
        created_at: newSubData.start_date,
        updated_at: newSubData.start_date,
      } as Subscription;

    } catch (error) {
      console.error('ensureStarterSubscription error:', error);
      throw error;
    }
  }
};
`;

fs.writeFileSync('src/services/subscriptionService.ts', content, 'utf-8');
console.log('File successfully rewritten!');
