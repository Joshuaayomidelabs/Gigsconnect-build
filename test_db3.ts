import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { data, error } = await supabase.from('posts').select('*, _likes:likes(count)').limit(1);
  console.log('Posts error:', error);
  console.log('Posts data:', JSON.stringify(data, null, 2));
}

run();
