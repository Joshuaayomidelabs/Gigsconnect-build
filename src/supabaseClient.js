import { createClient } from '@supabase/supabase-js';

// Replace these variables with your actual Supabase project URL and public API key
const SUPABASE_URL = "https://ibihzanlmutcpdduewqs.supabase.co";
const SUPABASE_PUBLIC_KEY = "sb_publishable_t77cfsaJYIlemT7ZwFa17g_mtPttcpt";

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLIC_KEY);
