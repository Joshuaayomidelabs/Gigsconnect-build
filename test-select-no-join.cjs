const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);
(async () => {
  const email = 'test_nojoin_' + Date.now() + '@example.com';
  await supabase.auth.signUp({ email, password: 'Password123!' });
  const { data: { session } } = await supabase.auth.signInWithPassword({ email, password: 'Password123!' });
  const userId = session.user.id;
  await supabase.auth.setSession({ access_token: session.access_token, refresh_token: session.refresh_token });

  const customId = '423e4567-e89b-12d3-a456-426614174000';

  const res1 = await supabase.from('subscriptions').insert({
    id: customId,
    user_id: userId,
    plan_name: 'pro',
    status: 'active',
  }).select('*'); // Only select from subscriptions
  console.log('Insert with basic select error:', res1.error?.message);

})();
