const { createClient } = require('@supabase/supabase-js');
const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function test() {
  const { data: starterPlan } = await supabase.from('subscription_plans').select('*').eq('name', 'Starter').single();
  console.log("Starter Plan:", starterPlan);

  const { data: users } = await supabase.from('profiles').select('id').limit(1);
  if (users.length) {
    const userId = users[0].id;
    const newSubData = {
      user_id: userId,
      plan_id: starterPlan.id,
      plan_name: starterPlan.name,
      status: 'active',
      billing_cycle: 'monthly',
      payment_status: 'free',
      start_date: new Date().toISOString(),
    };
    const { data: newSub, error: createErr } = await supabase
        .from('subscriptions')
        .insert(newSubData)
        .select(`
          *,
          plan:subscription_plans (*)
        `)
        .single();
    console.log("Create Error:", createErr);
    console.log("New Sub:", newSub);
  }
}
test();
