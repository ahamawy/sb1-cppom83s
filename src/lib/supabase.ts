import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables. Please click "Connect to Supabase" button to set up your database connection.');
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true
  }
});

// Add error handling helper
export const handleSupabaseError = (error: any) => {
  console.error('Supabase error:', error);
  if (error.message === 'JWT expired') {
    return 'Your session has expired. Please refresh the page.';
  }
  if (error.message.includes('authentication')) {
    return 'Authentication error. Please check your connection.';
  }
  return 'An error occurred. Please try again.';
};