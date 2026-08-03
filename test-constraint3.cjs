const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);
(async () => {
  const email = 'test_constraint3_' + Date.now() + '@example.com';
  await supabase.auth.signUp({ email, password: 'Password123!' });
  const { data: { session } } = await supabase.auth.signInWithPassword({ email, password: 'Password123!' });
  const userId = session.user.id;
  
  // brute force plan names to find what is allowed
  const plansToTest = ['starter', 'Starter', 'free', 'Free', 'basic', 'Basic', 'standard', 'Standard', 'advanced', 'Advanced', 'pro', 'Pro', 'premium', 'Premium', 'enterprise', 'Enterprise'];
  
  for (let p of plansToTest) {
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
