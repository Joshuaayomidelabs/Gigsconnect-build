const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);
(async () => {
  const req = await fetch(process.env.VITE_SUPABASE_URL + '/rest/v1/', {
    headers: { apikey: process.env.VITE_SUPABASE_ANON_KEY }
  });
  const text = await req.text();
  const funcs = [...text.matchAll(/\/rpc\/([a-zA-Z0-9_]+)/g)].map(m => m[1]);
  console.log('Unique functions:', [...new Set(funcs)]);
})();
