const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);
(async () => {
  const email = 'test_check_ins2_' + Date.now() + '@example.com';
  await supabase.auth.signUp({ email, password: 'Password123!' });
  const { data: { session } } = await supabase.auth.signInWithPassword({ email, password: 'Password123!' });
  const userId = session.user.id;
  await supabase.auth.setSession({ access_token: session.access_token, refresh_token: session.refresh_token });

  const customId = '123e4567-e89b-12d3-a456-426614174000';

  const res1 = await supabase.from('subscriptions').insert({
    id: customId,
    user_id: userId,
    plan_name: 'pro',
    status: 'active',
  }).select();
  console.log('Insert with select error:', res1.error?.message);

  const res2 = await supabase.from('subscriptions').insert({
    id: customId,
    user_id: userId,
    plan_name: 'pro',
    status: 'active',
  });
  console.log('Insert without select error:', res2.error?.message);
})();
