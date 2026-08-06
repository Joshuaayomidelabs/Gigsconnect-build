const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const envStr = fs.readFileSync('.env', 'utf-8');
const env = {};
for (const line of envStr.split('\n')) {
  if (line.includes('=')) {
    const [k, v] = line.split('=');
    env[k] = v;
  }
}
const sb = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY);
(async () => {
  const { data, error } = await sb.from('subscription_plans').select('*');
  console.log('Result:', data, error);
})();
