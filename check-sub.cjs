const { createClient } = require('@supabase/supabase-js');
const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
async function run() {
  const { data: { user } } = await supabase.auth.signInWithPassword({
    email: 'testuser@example.com',
    password: 'password123'
  });
  console.log("auth:", user?.id);
  const { data } = await supabase.from('subscriptions').select('*').eq('user_id', user?.id);
  console.log("subs:", data);
}
run();
