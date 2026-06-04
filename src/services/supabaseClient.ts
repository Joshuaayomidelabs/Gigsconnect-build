import { createClient, type SupabaseClient } from '@supabase/supabase-js';

let supabaseInstance: SupabaseClient | null = null;

/**
 * Utility to securely mask sensitive environment variable values
 * to prevent accidental exposure in diagnostic logs, reviews, or error outputs.
 */
export const maskSecret = (str: string | undefined): string => {
  if (!str) return 'undefined';
  if (str.startsWith('http://') || str.startsWith('https://')) {
    try {
      const url = new URL(str);
      const hostParts = url.hostname.split('.');
      if (hostParts.length > 1) {
        return `${url.protocol}//${hostParts[0].substring(0, 2)}***.${hostParts.slice(1).join('.')}`;
      }
      return `${url.protocol}//***`;
    } catch {
      return str.substring(0, 8) + '...';
    }
  }
  if (str.length <= 8) {
    return '***';
  }
  return str.substring(0, 6) + '...' + str.substring(str.length - 6);
};

export const getSupabase = (): SupabaseClient => {
  if (!supabaseInstance) {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

    // Reject placeholder variables or missing keys securely
    if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('YOUR_') || supabaseAnonKey.includes('YOUR_')) {
      const maskedUrl = maskSecret(supabaseUrl);
      const maskedKey = maskSecret(supabaseAnonKey);
      throw new Error(
        `Supabase configuration is invalid or missing. Ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are correctly supplied. (URL: ${maskedUrl}, Key: ${maskedKey})`
      );
    }

    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
  }
  return supabaseInstance;
};

/**
 * Exported supabase client using a Proxy to handle lazy initialization.
 * This prevents the app from crashing on load if environment variables are missing,
 * while maintaining compatibility with existing imports.
 */
export const supabase = new Proxy({} as SupabaseClient, {
  get: (_target, prop) => {
    const client = getSupabase();
    return (client as any)[prop];
  },
});
