const { createClient } = require('@supabase/supabase-js');
const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

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
  
  const userId = authData.user.id;
  console.log("Logged in:", userId);
  
  try {
      // Check if user already has an active subscription
      const { data: currentSub, error: curErr } = await supabase
        .from('subscriptions')
        .select('*, plan:subscription_plans (*)')
        .eq('user_id', userId)
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (curErr) throw curErr;

      // Get starter plan
      const { data: starterPlan, error: starterErr } = await supabase
        .from('subscription_plans')
        .select('*')
        .eq('name', 'Starter')
        .single();
        
      if (starterErr && starterErr.code !== 'PGRST116') throw starterErr;
      if (!starterPlan) throw new Error('Starter plan not found in database');

      // Check existing subs
      const { data: existingSubs, error: existErr } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'active');

      if (existErr) throw existErr;

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
          
          return;
        }
        throw createErr;
      }
      
  } catch (error) {
    console.error('Error ensuring starter subscription:', error);
  }
}
test();
