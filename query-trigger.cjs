const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY);

(async () => {
  // Let's use the RPC or query to get triggers? 
  // Anon key cannot read pg_trigger. But maybe we can read it if we have service_role? We don't have service_role.
  console.log(process.env.VITE_SUPABASE_SERVICE_ROLE_KEY ? "HAS SERVICE ROLE" : "NO SERVICE ROLE");
})();
