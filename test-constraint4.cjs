const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);
(async () => {
  const email = 'test_c4_' + Date.now() + '@example.com';
  await supabase.auth.signUp({ email, password: 'Password123!' });
  const { data: { session } } = await supabase.auth.signInWithPassword({ email, password: 'Password123!' });
  const userId = session.user.id;
  
  const { error } = await supabase.from('subscriptions').insert({
    user_id: userId,
    plan_id: 4,
    plan_name: 'Starter',
    status: 'active',
    payment_status: 'free',
    billing_cycle: 'monthly'
  });
  console.log('Insert Starter with plan_id 4 error:', error?.message);
})();
