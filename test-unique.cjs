const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);
(async () => {
  const email = 'test_unq_' + Date.now() + '@example.com';
  await supabase.auth.signUp({ email, password: 'Password123!' });
  const { data: { session } } = await supabase.auth.signInWithPassword({ email, password: 'Password123!' });
  const userId = session.user.id;

  const res1 = await supabase.from('subscriptions').insert({ user_id: userId, plan_name: 'pro', status: 'active' });
  const res2 = await supabase.from('subscriptions').insert({ user_id: userId, plan_name: 'pro', status: 'active' });
  
  console.log('Second insert error:', res2.error?.message);
})();
