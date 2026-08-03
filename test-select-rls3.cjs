const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);
(async () => {
  const email = 'test_rls3_' + Date.now() + '@example.com';
  await supabase.auth.signUp({ email, password: 'Password123!' });
  const { data: { session } } = await supabase.auth.signInWithPassword({ email, password: 'Password123!' });
  
  const userId = session.user.id;
  
  const res = await supabase.from('subscriptions').insert({
    user_id: userId,
    plan_id: 5,
    plan_name: 'pro',
    status: 'active',
    billing_cycle: 'monthly',
    payment_status: 'free',
    start_date: new Date().toISOString()
  }).select();
  
  console.log('Select pro:', res.data, res.error);
})();
