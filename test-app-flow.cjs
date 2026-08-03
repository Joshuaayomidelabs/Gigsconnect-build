const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);
(async () => {
  const email = 'test_app_flow_' + Date.now() + '@example.com';
  await supabase.auth.signUp({ email, password: 'Password123!' });
  const { data: { session } } = await supabase.auth.signInWithPassword({ email, password: 'Password123!' });
  
  await supabase.auth.setSession({
    access_token: session.access_token,
    refresh_token: session.refresh_token
  });

  const { data: starterPlan } = await supabase.from('subscription_plans').select('*').eq('name', 'Starter').single();
  const userId = session.user.id;
  
  console.log('Starter Plan:', starterPlan);
  
  const { data, error } = await supabase.from('subscriptions').insert({
    user_id: userId,
    plan_id: starterPlan.id,
    plan_name: starterPlan.name,
    status: 'active',
    billing_cycle: 'monthly',
    payment_status: 'free',
    start_date: new Date().toISOString()
  }).select();
  
  console.log('Insert Result:', data, 'Error:', error);
})();
