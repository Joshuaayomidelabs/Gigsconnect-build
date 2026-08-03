const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);
(async () => {
  const email = 'test_brute_' + Date.now() + '@example.com';
  await supabase.auth.signUp({ email, password: 'Password123!' });
  const { data: { session } } = await supabase.auth.signInWithPassword({ email, password: 'Password123!' });
  const userId = session.user.id;
  
  const words = ['starter', 'Starter', 'free', 'Free', 'Basic', 'basic', 'None', 'none', 'active', 'Active', 'monthly', 'Monthly', 'trial', 'Trial', 'Pro', 'pro', 'Premium', 'premium', 'null', 'Null', 'default', 'Default', 'Base', 'base', '0', '1', '4'];
  
  for (let p of words) {
    const { error } = await supabase.from('subscriptions').insert({
      user_id: userId,
      plan_name: p,
      status: 'active',
      payment_status: 'free',
      billing_cycle: 'monthly'
    });
    if (!error) console.log('SUCCESS on:', p);
  }
})();
