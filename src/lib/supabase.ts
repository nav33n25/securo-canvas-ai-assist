
import { createClient } from '@supabase/supabase-js';

// Get Supabase URL and key from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseKey);
