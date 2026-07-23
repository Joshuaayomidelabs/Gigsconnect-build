const { createClient } = require('@supabase/supabase-js');
const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function test() {
  const { data: users } = await supabase.from('profiles').select('id').limit(1);
  const userId = users[0].id;
  
  const { data: currentSub, error: curErr } = await supabase
      .from('subscriptions')
      .select(`
        *,
        plan:subscription_plans (*)
      `)
      .eq('user_id', userId)
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();
      
  console.log("curErr:", curErr);
}
test();
