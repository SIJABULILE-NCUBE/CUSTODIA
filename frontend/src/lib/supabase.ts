// this is my supabase client for the browser
// unlike my backend, i use the anon key here, never the service role key
// the anon key is safe to expose because row level security protects the actual data

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
