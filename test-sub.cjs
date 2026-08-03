const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);
(async () => {
  const email = 'test_sub_' + Date.now() + '@example.com';
  await supabase.auth.signUp({ email, password: 'Password123!' });
  const { data: { session }, error: signErr } = await supabase.auth.signInWithPassword({ email, password: 'Password123!' });
  if (signErr) return console.error(signErr);
  
  const userId = session.user.id;
  console.log('User ID:', userId);
  
  const starterPlan = { id: 1, name: 'Starter' };
  
  const { data: newSub, error: createErr } = await supabase
        .from('subscriptions')
        .insert({
          user_id: userId,
          plan_id: starterPlan.id,
          plan_name: starterPlan.name,
          status: 'active',
          billing_cycle: 'monthly',
          payment_status: 'free',
          start_date: new Date().toISOString(),
        })
        .select()
        .single();
        
  console.log('New Sub:', newSub, 'Error:', createErr);
})();
