const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);
(async () => {
  const { data, error } = await supabase.rpc('get_or_create_direct_conversation', { other_user: '00000000-0000-0000-0000-000000000000' });
  console.log('Result:', data, error);
})();
