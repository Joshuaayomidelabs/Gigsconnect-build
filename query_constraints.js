import { createClient } from '@supabase/supabase-js'
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://fjbikxyqdipld6lcyqbqth.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'your-key'; // wait, without env vars this won't work, maybe I can use the existing test script or .env.example
