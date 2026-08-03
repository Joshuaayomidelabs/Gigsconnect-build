const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);
(async () => {
  const email = 'test_bypass3_' + Date.now() + '@example.com';
  await supabase.auth.signUp({ email: email, password: 'Password123!' });
  const { data: { user } } = await supabase.auth.signInWithPassword({ email: email, password: 'Password123!' });
  
  const { data: convData, error: convError } = await supabase.from('conversations').insert({}).select('id');
  console.log('Insert conversation:', convData, convError);
})();
