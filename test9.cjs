const { createClient } = require('@supabase/supabase-js');
const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function test() {
  const { error } = await supabase.from('subscriptions').insert({
    user_id: 'c972f5ab-ef69-4007-af55-6be2a1feb166', // Existing user ID
    plan_id: 4,
    plan_name: 'Starter',
    status: 'active',
    billing_cycle: 'monthly',
    payment_status: 'free',
    start_date: new Date().toISOString()
  });
  console.log("Error:", error);
}
test();
