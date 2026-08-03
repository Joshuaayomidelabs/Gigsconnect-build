const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);
(async () => {
  const email = 'test_bypass_' + Date.now() + '@example.com';
  await supabase.auth.signUp({ email: email, password: 'Password123!' });
  const { data: { user } } = await supabase.auth.signInWithPassword({ email: email, password: 'Password123!' });
  
  const { data: convData, error: convError } = await supabase.from('conversations').insert({}).select().single();
  console.log('Insert conversation:', convData, convError);

  if (convData) {
     const { data: partData, error: partError } = await supabase.from('conversation_participants').insert([
       { conversation_id: convData.id, user_id: user.id }
     ]).select();
     console.log('Insert participant:', partData, partError);
  }
})();
