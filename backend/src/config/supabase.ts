// this file sets up my connection to supabase so every route can just import it
// i am using the service role key here because this runs on my server, not in a browser
// the service role key skips row level security, so i have to be careful and check roles myself in my routes

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// i throw an error early if these are missing, so i do not get a confusing crash later
if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('i am missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in my .env file');
}

// this is the client i use everywhere in my backend routes
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});
