const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);
(async () => {
  const email = 'test_select_rls_' + Date.now() + '@example.com';
  await supabase.auth.signUp({ email, password: 'Password123!' });
  const { data: { session } } = await supabase.auth.signInWithPassword({ email, password: 'Password123!' });
  const userId = session.user.id;
  const supabaseAuth = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY, {
    global: { headers: { Authorization: `Bearer ${session.access_token}` } }
  });

  const res = await supabaseAuth.from('subscriptions').insert({
    user_id: userId,
    plan_name: 'pro',
    status: 'active',
  });
  console.log('Insert error:', res.error);

  const res2 = await supabaseAuth.from('subscriptions').select('*');
  console.log('Select all:', res2.data?.length, res2.error);
})();
