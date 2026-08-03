const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);
(async () => {
  const email = 'test_one2_' + Date.now() + '@example.com';
  await supabase.auth.signUp({ email, password: 'Password123!' });
  const { data: { session } } = await supabase.auth.signInWithPassword({ email, password: 'Password123!' });
  const userId = session.user.id;

  // Set session natively!
  await supabase.auth.setSession({ access_token: session.access_token, refresh_token: session.refresh_token });

  const res1 = await supabase.from('subscriptions').insert({
    user_id: userId,
    plan_name: 'pro',
    status: 'active',
  }).select();
  console.log('First insert with select:', res1.error);

  const res2 = await supabase.from('subscriptions').insert({
    user_id: userId,
    plan_name: 'pro',
    status: 'active',
  });
  console.log('Second insert without select:', res2.error);
})();
