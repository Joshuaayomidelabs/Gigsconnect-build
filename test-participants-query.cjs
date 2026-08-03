const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);
(async () => {
  const email = 'test_part_' + Date.now() + '@example.com';
  await supabase.auth.signUp({ email: email, password: 'Password123!' });
  const { data: { user } } = await supabase.auth.signInWithPassword({ email: email, password: 'Password123!' });
  
  const { data, error } = await supabase.from('conversation_participants')
    .select('*')
    .eq('user_id', user.id);
  console.log('Participants:', data, error);
})();
