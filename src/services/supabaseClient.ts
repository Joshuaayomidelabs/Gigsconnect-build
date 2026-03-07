import { createClient } from '@supabase/supabase-js';

// Use environment variables for Supabase configuration
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "https://ibihzanlmutcpdduewqs.supabase.co";
const SUPABASE_PUBLIC_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "sb_publishable_t77cfsaJYIlemT7ZwFa17g_mtPttcpt";

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLIC_KEY);
