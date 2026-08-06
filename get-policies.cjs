const { createClient } = require('@supabase/supabase-js');
const sb = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);
(async () => {
  // Let's create an RPC by fetching some data if we can, but we can't create an RPC from anon key.
  // We can fetch table columns if we want by doing a select limit 0.
  // Maybe we have a user we can sign in with?
  const res = await sb.auth.signInWithPassword({
    email: 'curiousmind1772000@gmail.com', // user from context
    password: 'password123' // default password maybe?
  });
  console.log('Login:', res.error ? res.error.message : 'Success');
  
  if (res.data?.user) {
    const { data, error } = await sb.from('subscriptions').insert({
      user_id: res.data.user.id,
      plan_id: 4, // 4 was starter from our earlier query
      plan_name: 'starter',
      status: 'active',
      billing_cycle: 'monthly',
      payment_status: 'free',
      start_date: new Date().toISOString()
    }).select();
    console.log('Insert Result:', data, error);
  }
})();
