const { createClient } = require('@supabase/supabase-js');
const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
async function run() {
  const { data: { user }, error: authError } = await supabase.auth.signInWithPassword({
    email: 'testuser@example.com',
    password: 'password123'
  });
  console.log("auth:", user?.id, authError);

  const { data: starterPlan } = await supabase.from('subscription_plans').select('*').eq('name', 'Starter').single();
  
  const newSubData = {
    user_id: user?.id,
    plan_id: starterPlan.id,
    plan_name: starterPlan.name,
    status: 'active',
    billing_cycle: 'monthly',
    payment_status: 'free',
    start_date: new Date().toISOString(),
  };

  const { data, error } = await supabase.from('subscriptions').insert(newSubData).select();
  console.log("insert authenticated:", data, error);
}
run();
