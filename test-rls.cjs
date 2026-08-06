const { createClient } = require('@supabase/supabase-js');
const sb = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);
(async () => {
  const res = await sb.auth.signInWithPassword({
    email: 'curiousmind1772000@gmail.com', 
    password: 'password123' 
  });
  
  if (res.data?.user) {
    const { data, error } = await sb.from('subscriptions').insert({
      user_id: res.data.user.id,
      plan_id: 4, 
      plan_name: 'pro',
      status: 'active',
      billing_cycle: 'monthly',
      payment_status: 'free',
      start_date: new Date().toISOString()
    }); // without .select() to avoid the SELECT RLS error!
    console.log('Insert Result:', data, error);
  } else {
    console.log('Login failed:', res.error);
  }
})();
