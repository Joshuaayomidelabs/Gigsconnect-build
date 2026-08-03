const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);
(async () => {
  const email = 'test_det_' + Date.now() + '@example.com';
  await supabase.auth.signUp({ email, password: 'Password123!' });
  const { data: { session } } = await supabase.auth.signInWithPassword({ email, password: 'Password123!' });
  const userId = session.user.id;
  await supabase.auth.setSession({ access_token: session.access_token, refresh_token: session.refresh_token });

  // Let's test if we can select subscriptions by SOME OTHER column!
  const res = await supabase.from('subscriptions').select('*').eq('status', 'active');
  console.log('Select active:', res.data);
})();
