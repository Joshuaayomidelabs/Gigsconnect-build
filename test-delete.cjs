const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);
async function run() {
  const { data, error } = await supabase.from('profile_skills').delete().eq('profile_id', 'eaa19773-976f-48fb-a5ef-c6026d415403');
  console.log("Delete result:", data, error);
}
run();
