const { createClient } = require('@supabase/supabase-js');
const supabaseAnon = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);
(async () => {
  const email = 'test_rls2_' + Date.now() + '@example.com';
  await supabaseAnon.auth.signUp({ email, password: 'Password123!' });
  const { data: { session } } = await supabaseAnon.auth.signInWithPassword({ email, password: 'Password123!' });
  
  // Important: set session on the anon client
  await supabaseAnon.auth.setSession({
    access_token: session.access_token,
    refresh_token: session.refresh_token
  });

  const userId = session.user.id;
  
  // insert without select to bypass the weird issue? Wait, if we just do .insert().select() on anon client?
  const res = await supabaseAnon.from('subscriptions').insert({
    user_id: userId,
    plan_id: 5,
    plan_name: 'pro',
    status: 'active',
    billing_cycle: 'monthly',
    payment_status: 'free',
    start_date: new Date().toISOString()
  }).select();
  
  console.log('Anon client select:', res.data, res.error);
})();
