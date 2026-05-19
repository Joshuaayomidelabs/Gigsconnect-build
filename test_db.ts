import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { data, error } = await supabase.from('comments').select('*').limit(1);
  console.log('Comments data:', JSON.stringify(data, null, 2));
  console.log('Comments error:', error);
}

run();
