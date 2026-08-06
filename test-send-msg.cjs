const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);
(async () => {
  const { data, error } = await supabase.rpc('send_message', {
    p_conversation_id: '00000000-0000-0000-0000-000000000000',
    p_content: 'test',
    p_message_type: 'text'
  });
  console.log('Result:', data, error);
})();
