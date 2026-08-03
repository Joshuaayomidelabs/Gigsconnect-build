const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);
(async () => {
  const { data, error } = await supabase.from('subscription_plans').select('*').eq('is_active', true).order('display_order');
  console.log('Plans:', data?.length, 'Error:', error);
})();
