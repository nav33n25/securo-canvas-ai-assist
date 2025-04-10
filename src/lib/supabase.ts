
import { createClient } from '@supabase/supabase-js';

// Initialize the Supabase client
const supabaseUrl = 'https://bcskfmutqwjqpninskkw.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJjc2tmbXV0cXdqcXBuaW5za2t3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQxMDUzNTIsImV4cCI6MjA1OTY4MTM1Mn0.JNu_2xpPzjFx-K2mH_4vfjJivtaDlfdDYgLRbD5M83U';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

export default supabase;
