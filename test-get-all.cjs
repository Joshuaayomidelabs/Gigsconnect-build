const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);
(async () => {
  const { data, error } = await supabase.from('subscriptions').select('*');
  console.log('Select all as anon:', data, error);
})();
