const { createClient } = require('@supabase/supabase-js');
const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function test() {
  const email = "test" + Date.now() + "@test.com";
  // sign up
  const { data: authData } = await supabase.auth.signUp({
    email,
    password: "password123"
  });
  
  const userId = authData.user.id;
  
  const { error: updateErr } = await supabase
    .from('profiles')
    .update({ subscription_plan: 'free' })
    .eq('id', userId);
    
  console.log("Update free error:", updateErr);
}
test();
