const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);
(async () => {
  const email = 'test_sub7_' + Date.now() + '@example.com';
  await supabase.auth.signUp({ email, password: 'Password123!' });
  const { data: { session }, error: signErr } = await supabase.auth.signInWithPassword({ email, password: 'Password123!' });
  
  const userId = session.user.id;
  
  const tryPlan = async (name) => {
    const { error } = await supabase.from('subscriptions').insert({
      user_id: userId,
      plan_name: name,
      status: 'active',
      payment_status: 'free',
      billing_cycle: 'monthly'
    });
    console.log(name, error?.message || 'SUCCESS');
  };
  
  await tryPlan('free');
  await tryPlan('basic');
  await tryPlan('standard');
})();
