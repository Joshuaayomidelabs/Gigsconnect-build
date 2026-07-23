const { createClient } = require('@supabase/supabase-js');
const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function test() {
  const { data, error } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', undefined)
    .limit(1)
    .maybeSingle();
    
  console.log("Error:", error);
}
test();
