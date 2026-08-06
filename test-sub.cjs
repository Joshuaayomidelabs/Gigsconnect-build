const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '/app/applet/.env' });
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);
(async () => {
  // Try inserting a subscription directly
  const { data, error } = await supabase.from('subscriptions').insert({
    user_id: '00000000-0000-0000-0000-000000000000', // Need a valid user id maybe?
    plan_id: '00000000-0000-0000-0000-000000000000',
    plan_name: 'starter',
    status: 'active',
    billing_cycle: 'monthly',
    payment_status: 'free',
    start_date: new Date().toISOString()
  });
  console.log('Result:', data, error);
})();
