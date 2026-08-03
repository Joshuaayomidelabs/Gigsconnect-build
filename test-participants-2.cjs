const { execSync } = require('child_process');
const cols = ['id', 'is_archived', 'joined_at', 'updated_at', 'read_receipt_at'];
for (const col of cols) {
  try {
    const res = execSync(`curl -s -H "apikey: $VITE_SUPABASE_ANON_KEY" "$VITE_SUPABASE_URL/rest/v1/conversation_participants?select=${col}&limit=1"`).toString();
    console.log(col, res.slice(0, 80));
  } catch(e) {}
}
