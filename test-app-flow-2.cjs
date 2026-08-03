const { createClient } = require('@supabase/supabase-js');
const supabaseAnon = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);
(async () => {
  const email = 'test_flow2_' + Date.now() + '@example.com';
  await supabaseAnon.auth.signUp({ email, password: 'Password123!' });
  const { data: { session } } = await supabaseAnon.auth.signInWithPassword({ email, password: 'Password123!' });
  
  const supabaseAuth = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY, {
    global: {
      headers: {
        Authorization: `Bearer ${session.access_token}`
      }
    }
  });

  const { data: starterPlan } = await supabaseAuth.from('subscription_plans').select('*').eq('name', 'Starter').single();
  const userId = session.user.id;
  
  const { data, error } = await supabaseAuth.from('subscriptions').insert({
    user_id: userId,
    plan_id: starterPlan.id,
    plan_name: starterPlan.name,
    status: 'active',
    billing_cycle: 'monthly',
    payment_status: 'free',
    start_date: new Date().toISOString()
  });
  
  console.log('Insert Result:', data, 'Error:', error);
})();
