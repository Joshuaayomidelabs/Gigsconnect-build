const { createClient } = require('@supabase/supabase-js');
const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function test() {
  const email = "test" + Date.now() + "@test.com";
  const { data: authData, error: authErr } = await supabase.auth.signUp({
    email,
    password: "password123"
  });
  
  // Try inserting
  const newSubData = {
    user_id: authData.user.id,
    plan_id: 4,
    plan_name: 'Starter',
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

  console.log("createErr:", createErr);
}
test();
