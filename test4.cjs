const { createClient } = require('@supabase/supabase-js');
const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function test() {
  const email = "test" + Date.now() + "@test.com";
  // sign up
  const { data: authData, error: authErr } = await supabase.auth.signUp({
    email,
    password: "password123"
  });
  
  if (authErr) {
    console.log("Auth error:", authErr);
    return;
  }
  
  const userId = authData.user.id;
  
  const { data: starterPlan } = await supabase
    .from('subscription_plans')
    .select('*')
    .eq('name', 'Starter')
    .single();

  const { error: updateErr } = await supabase
    .from('profiles')
    .update({ subscription_plan: starterPlan.name.toLowerCase() })
    .eq('id', userId);
    
  console.log("Update profile error:", updateErr);
}
test();
