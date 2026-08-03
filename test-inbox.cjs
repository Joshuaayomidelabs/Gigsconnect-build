const { execSync } = require('child_process');
const cols = ['conversation_id', 'other_user_id', 'full_name', 'username', 'last_message', 'message_type', 'updated_at', 'unread_count', 'last_read_message_id', 'other_last_read_message_id', 'last_read_at'];
for (const col of cols) {
  try {
    const res = execSync(`curl -s -H "apikey: $VITE_SUPABASE_ANON_KEY" "$VITE_SUPABASE_URL/rest/v1/conversation_inbox?select=${col}&limit=1"`).toString();
    console.log(col, res.slice(0, 80));
  } catch(e) {}
}
