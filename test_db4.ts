import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { data, error } = await supabase.from('likes').select('*').limit(10);
  console.log('Likes error:', error);
  console.log('Likes data:', JSON.stringify(data, null, 2));
}

run();
