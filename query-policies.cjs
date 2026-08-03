const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);
(async () => {
  const { data, error } = await supabase.from('pg_policies').select('*').eq('tablename', 'conversation_participants');
  console.log('policies:', data, 'error:', error);
})();
