const { execSync } = require('child_process');
try {
  const res = execSync(`curl -s "$VITE_SUPABASE_URL/rest/v1/?apikey=$VITE_SUPABASE_ANON_KEY" | grep -o -E '"/rpc/[^"]+"' | sort | uniq`).toString();
  console.log(res);
} catch(e) {}
