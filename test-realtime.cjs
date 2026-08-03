const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);
(async () => {
  const email = 'test_realtime_' + Date.now() + '@example.com';
  const { data: d1 } = await supabase.auth.signUp({ email: email, password: 'Password123!' });
  await supabase.auth.signInWithPassword({ email: email, password: 'Password123!' });
  
  const channel = supabase.channel('test')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'messages' }, payload => {
      console.log('Message payload:', payload);
    })
    .on('postgres_changes', { event: '*', schema: 'public', table: 'conversation_participants' }, payload => {
      console.log('Participant payload:', payload);
    })
    .subscribe((status) => {
      console.log('Status:', status);
      if (status === 'SUBSCRIBED') {
        setTimeout(() => process.exit(0), 1000);
      }
    });
})();
