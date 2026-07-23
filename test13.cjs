const { createClient } = require('@supabase/supabase-js');
const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function test() {
  // sign up a new user to test RLS
  const email = "test" + Date.now() + "@test.com";
  const { data: authData, error: authErr } = await supabase.auth.signUp({
    email,
    password: "password123"
  });
  
  if (authErr) {
    console.log("Auth error:", authErr);
    return;
  }
  
  const { data, error } = await supabase
    .from('subscription_plans')
    .select('*')
    .eq('name', 'Starter')
    .single();
    
  console.log("Starter Plan:", data ? data.name : null);
  console.log("Error:", error);
}
test();
