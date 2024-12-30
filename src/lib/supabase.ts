import { createClient } from '@supabase/supabase-js';
import { env } from './env';

// Create a single instance of the Supabase client
export const supabase = createClient(env.supabaseUrl, env.supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    storageKey: 'sb-rvunuowqsxtgyipmvicy-auth-token',
    storage: window.localStorage
  },
});