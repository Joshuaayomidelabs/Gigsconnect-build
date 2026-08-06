const { createClient } = require('@supabase/supabase-js');
const sb = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);
(async () => {
  const { data, error } = await sb.rpc('exec_sql', { sql_query: 'SELECT * FROM pg_policies WHERE tablename = \'subscriptions\'' });
  console.log('Result:', data, error);
})();
