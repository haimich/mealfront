
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export type AuthUser = {
  id: string;
  email: string;
  created_at: string;
};

// Sign up with email and password
export const signUp = async (email: string, password: string): Promise<AuthUser | null> => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) throw error;
    
    toast.success('Check your email for the confirmation link.');
    return data.user as AuthUser;
  } catch (error: any) {
    console.error('Error signing up:', error.message);
    toast.error(error.message);
    return null;
  }
};

// Sign in with email and password
export const signIn = async (email: string, password: string): Promise<AuthUser | null> => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    toast.success('Signed in successfully!');
    return data.user as AuthUser;
  } catch (error: any) {
    console.error('Error signing in:', error.message);
    toast.error(error.message);
    return null;
  }
};

// Sign out
export const signOut = async (): Promise<void> => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    toast.success('Signed out successfully!');
  } catch (error: any) {
    console.error('Error signing out:', error.message);
    toast.error(error.message);
  }
};

// Get current session
export const getCurrentSession = async () => {
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return data.session;
  } catch (error: any) {
    console.error('Error getting session:', error.message);
    return null;
  }
};

// Get current user
export const getCurrentUser = async (): Promise<AuthUser | null> => {
  try {
    const { data, error } = await supabase.auth.getUser();
    if (error) throw error;
    return data.user as AuthUser;
  } catch (error: any) {
    console.error('Error getting user:', error.message);
    return null;
  }
};
