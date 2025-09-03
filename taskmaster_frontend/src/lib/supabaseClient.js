import { createClient } from '@supabase/supabase-js';

/**
 * PUBLIC_INTERFACE
 * getSupabaseClient provides a singleton Supabase client instance configured
 * from environment variables.
 *
 * Required environment variables:
 * - REACT_APP_SUPABASE_URL: The Supabase project URL
 * - REACT_APP_SUPABASE_KEY: The Supabase anon/public API key
 *
 * Basic error handling:
 * - Logs a descriptive error and throws if variables are missing in development
 * - In production, throws an error to prevent running with a misconfigured client
 */
let supabase = null;

// PUBLIC_INTERFACE
export function getSupabaseClient() {
  /** Returns a configured Supabase client (singleton). */
  if (supabase) return supabase;

  const url = process.env.REACT_APP_SUPABASE_URL;
  const key = process.env.REACT_APP_SUPABASE_KEY;

  const missing = [];
  if (!url) missing.push('REACT_APP_SUPABASE_URL');
  if (!key) missing.push('REACT_APP_SUPABASE_KEY');

  if (missing.length > 0) {
    const msg = `Supabase configuration error: Missing environment variable(s): ${missing.join(
      ', '
    )}. Ensure these are set in your .env file.`;
    if (process.env.NODE_ENV === 'production') {
      // Fail hard in production to avoid running with a broken client
      throw new Error(msg);
    } else {
      // In dev, warn and create a dummy client that will still throw on use
      // but keeps the app loading. This helps developers see the console message.
      // eslint-disable-next-line no-console
      console.error(msg);
      throw new Error(msg);
    }
  }

  // Create and memoize the Supabase client
  supabase = createClient(url, key);
  return supabase;
}

export default getSupabaseClient;
