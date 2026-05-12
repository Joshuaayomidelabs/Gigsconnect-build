import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const env = fs.readFileSync('.env', 'utf-8');
const urlMatch = env.match(/VITE_SUPABASE_URL=(.*)/);
const keyMatch = env.match(/VITE_SUPABASE_ANON_KEY=(.*)/);

const supabaseUrl = urlMatch ? urlMatch[1] : '';
const supabaseKey = keyMatch ? keyMatch[1] : '';
const supabase = createClient(supabaseUrl, supabaseKey);

async function testDelete() {
  console.log("Checking tables");
  
  const { data, error } = await supabase.from('likes').select('id').limit(1);
  console.log('likes table:', error ? error.message : "Exists!");

  const { data: d2, error: e2 } = await supabase.from('comments').select('id').limit(1);
  console.log('comments table:', e2 ? e2.message : "Exists!");

  const { data: d3, error: e3 } = await supabase.from('post_likes').select('id').limit(1);
  console.log('post_likes table:', e3 ? e3.message : "Exists!");
}

testDelete();
