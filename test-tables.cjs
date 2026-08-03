const { execSync } = require('child_process');
const tables = ['read_receipts', 'message_reads'];
for (const t of tables) {
  try {
    const res = execSync(`curl -s -H "apikey: $VITE_SUPABASE_ANON_KEY" "$VITE_SUPABASE_URL/rest/v1/${t}?limit=1"`).toString();
    console.log(t, res.slice(0, 80));
  } catch(e) {}
}
