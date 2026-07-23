const { createClient } = require('@supabase/supabase-js');
const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function test() {
  const { data: users } = await supabase.from('profiles').select('id');
  for (const user of users) {
    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'active');
    
    if (error) console.log("User", user.id, "Error:", error);
    if (data && data.length > 1) {
      console.log("User", user.id, "has", data.length, "active subscriptions.");
    }
  }
}
test();
