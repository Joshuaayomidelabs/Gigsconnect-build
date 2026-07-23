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
  
  console.log("Logged in:", authData.user.id);
  
  const { data: starterPlan } = await supabase.from('subscription_plans').select('*').eq('name', 'Starter').single();

  const newSubData = {
    user_id: authData.user.id,
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
      
  console.log("Create Error:", createErr);
}
test();
