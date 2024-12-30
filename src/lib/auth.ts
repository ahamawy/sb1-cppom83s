import { supabase } from './supabase';

export const checkAuth = async () => {
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error) throw error;
  return session;
};

export const initializeAuth = async () => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    // If no session, we'll enable public access through RLS policies
    // rather than trying to sign in anonymously
    return session;
  } catch (error) {
    console.error('Auth initialization failed:', error);
    throw error;
  }
}