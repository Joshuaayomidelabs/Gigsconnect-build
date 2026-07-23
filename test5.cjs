const { createClient } = require('@supabase/supabase-js');
const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function ensureStarterSubscription(userId) {
    try {
      // Get starter plan
      const { data: starterPlan, error: starterErr } = await supabase
        .from('subscription_plans')
        .select('*')
        .eq('name', 'Starter')
        .single();
        
      if (starterErr && starterErr.code !== 'PGRST116') throw starterErr;
      if (!starterPlan) throw new Error('Starter plan not found in database');

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

      if (createErr) {
        if (createErr.code === '42501') {
          console.warn('RLS policy prevents inserting subscriptions. Returning in-memory Starter subscription.');
          
          const planString = starterPlan.name.toLowerCase() === 'starter' ? 'free' : starterPlan.name.toLowerCase();
          const { error: up1 } = await supabase
            .from('profiles')
            .update({ subscription_plan: planString })
            .eq('id', userId);
            
          if (up1) console.log("up1 err:", up1);
            
          return "success fallback";
        }
        throw createErr;
      }
      
      const planString = starterPlan.name.toLowerCase() === 'starter' ? 'free' : starterPlan.name.toLowerCase();
      const { error: up2 } = await supabase
        .from('profiles')
        .update({ subscription_plan: planString })
        .eq('id', userId);
        
      if (up2) console.log("up2 err:", up2);
      
      return newSub;
    } catch (error) {
      console.error('Error ensuring starter subscription:', error);
      return null;
    }
}

async function test() {
  const email = "test" + Date.now() + "@test.com";
  // sign up
  const { data: authData, error: authErr } = await supabase.auth.signUp({
    email,
    password: "password123"
  });
  
  if (authErr) {
    console.log("Auth error:", authErr);
    return;
  }
  
  const res = await ensureStarterSubscription(authData.user.id);
  console.log("Result:", res);
}
test();
