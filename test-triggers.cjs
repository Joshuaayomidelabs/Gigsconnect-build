const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.VITE_SUPABASE_URL || 'https://fjbikxyqdipld6lcyqbqth.supabase.co', process.env.VITE_SUPABASE_ANON_KEY || 'dummy');

// This won't work easily without the secret key to query pg_trigger, or maybe it's accessible via RPC?
