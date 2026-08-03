const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);
(async () => {
  const email = 'test_constraint_' + Date.now() + '@example.com';
  await supabase.auth.signUp({ email, password: 'Password123!' });
  const { data: { session } } = await supabase.auth.signInWithPassword({ email, password: 'Password123!' });
  const userId = session.user.id;
  const plans = ['starter', 'Starter', 'free', 'Free', 'pro', 'premium', 'basic', 'none', 'Default', 'Base', 'free_tier'];
  for (let p of plans) {
    const { error } = await supabase.from('subscriptions').insert({
      user_id: userId,
      plan_name: p,
      status: 'active',
      payment_status: 'free',
      billing_cycle: 'monthly'
    });
    console.log(p, ':', error ? error.message : 'SUCCESS');
  }
})();
