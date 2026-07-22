import { createClient } from '@supabase/supabase-js';
const fs = require('fs');
const env = fs.readFileSync('.env', 'utf8');
const SUPABASE_URL = env.match(/VITE_SUPABASE_URL=(.*)/)[1];
const SUPABASE_KEY = env.match(/VITE_SUPABASE_ANON_KEY=(.*)/)[1];
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
async function run() {
  const { data: starterPlan } = await supabase.from('subscription_plans').select('*').eq('name', 'Starter').single();
  console.log("starter plan:", starterPlan);

  const userId = 'b0f80bb1-5a02-45e3-bba8-c0b9db86ffc9';
  
  const newSubData = {
    user_id: userId,
    plan_id: starterPlan.id,
    plan_name: starterPlan.name,
    status: 'active',
    billing_cycle: 'monthly',
    payment_status: 'free',
    start_date: new Date().toISOString(),
  };

  const { data, error } = await supabase.from('subscriptions').insert(newSubData).select();
  console.log("insert:", data, error);
}
run();
