const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);
(async () => {
  const email = 'test_one3_' + Date.now() + '@example.com';
  await supabase.auth.signUp({ email, password: 'Password123!' });
  const { data: { session } } = await supabase.auth.signInWithPassword({ email, password: 'Password123!' });
  const userId = session.user.id;
  await supabase.auth.setSession({ access_token: session.access_token, refresh_token: session.refresh_token });

  const res2 = await supabase.from('subscriptions').insert({
    user_id: userId,
    plan_name: 'pro',
    status: 'active',
  });
  console.log('Insert without select:', res2.error);
  
  const res1 = await supabase.from('subscriptions').insert({
    user_id: userId,
    plan_name: 'pro',
    status: 'active',
  }).select();
  console.log('Insert with select:', res1.error);
})();
