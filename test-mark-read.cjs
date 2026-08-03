const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);
(async () => {
  const { data, error } = await supabase.rpc('mark_conversation_read', { conversation_id: '00000000-0000-0000-0000-000000000000' });
  console.log('mark_conversation_read with conversation_id:', data, error);

  const { data2, error2 } = await supabase.rpc('mark_conversation_read', { p_conversation_id: '00000000-0000-0000-0000-000000000000' });
  console.log('mark_conversation_read with p_conversation_id:', data2, error2);
})();
