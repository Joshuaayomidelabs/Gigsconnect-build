const { createClient } = require('@supabase/supabase-js');
const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function test() {
  const { data, error } = await supabase
    .from('subscription_plans')
    .select('*')
    .eq('name', 'Starter');
  console.log("Plans:", data);
  console.log("Error:", error);
}
test();
