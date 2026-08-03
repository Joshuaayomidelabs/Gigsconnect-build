const { createClient } = require('@supabase/supabase-js');
const supabaseAnon = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);
(async () => {
  const email = 'test_flow6_' + Date.now() + '@example.com';
  await supabaseAnon.auth.signUp({ email, password: 'Password123!' });
  const { data: { session } } = await supabaseAnon.auth.signInWithPassword({ email, password: 'Password123!' });
  
  const supabaseAuth = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY, {
    global: { headers: { Authorization: `Bearer ${session.access_token}` } }
  });

  const { data: proPlan } = await supabaseAuth.from('subscription_plans').select('*').eq('name', 'Pro').single();
  const userId = session.user.id;
  
  const { error: insErr } = await supabaseAuth.from('subscriptions').insert({
    user_id: userId,
    plan_id: proPlan.id,
    plan_name: 'pro',
    status: 'active',
    billing_cycle: 'monthly',
    payment_status: 'free',
    start_date: new Date().toISOString()
  });
  console.log('Insert Error:', insErr);
  
  const { data, error } = await supabaseAuth.from('subscriptions').select('*, plan:subscription_plans(*)').eq('user_id', userId);
  console.log('Select Result:', data, 'Error:', error);
})();
