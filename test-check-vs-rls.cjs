const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);
(async () => {
  const email = 'test_check_rls_' + Date.now() + '@example.com';
  await supabase.auth.signUp({ email, password: 'Password123!' });
  const { data: { session } } = await supabase.auth.signInWithPassword({ email, password: 'Password123!' });
  const userId = session.user.id;
  const supabaseAuth = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY, {
    global: { headers: { Authorization: `Bearer ${session.access_token}` } }
  });

  const res1 = await supabaseAuth.from('subscriptions').insert({
    user_id: userId,
    plan_name: 'Starter', // fails check
  });
  console.log('Without select, Starter:', res1.error?.message);

  const res2 = await supabaseAuth.from('subscriptions').insert({
    user_id: userId,
    plan_name: 'Starter', // fails check
  }).select();
  console.log('With select, Starter:', res2.error?.message);

  const res3 = await supabaseAuth.from('subscriptions').insert({
    user_id: userId,
    plan_name: 'pro', // passes check
  });
  console.log('Without select, pro:', res3.error?.message);

  const res4 = await supabaseAuth.from('subscriptions').insert({
    user_id: userId,
    plan_name: 'pro', // passes check
  }).select();
  console.log('With select, pro:', res4.error?.message);
})();
