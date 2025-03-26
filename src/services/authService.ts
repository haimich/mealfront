
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export interface AuthUser {
  id: string;
  email: string;
}

export const getCurrentUser = async (): Promise<AuthUser | null> => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('Error fetching session:', error);
      return null;
    }

    if (!session) {
      return null;
    }

    return {
      id: session.user.id,
      email: session.user.email || ''
    };
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

export const signIn = async (email: string, password: string): Promise<AuthUser | null> => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      toast.error(error.message);
      return null;
    }

    if (data && data.user) {
      toast.success('Signed in successfully');
      return {
        id: data.user.id,
        email: data.user.email || ''
      };
    }

    return null;
  } catch (error: any) {
    console.error('Error signing in:', error);
    toast.error('Failed to sign in');
    return null;
  }
};

export const signUp = async (email: string, password: string): Promise<AuthUser | null> => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password
    });

    if (error) {
      toast.error(error.message);
      return null;
    }

    if (data && data.user) {
      toast.success('Account created successfully. Please check your email to confirm your account.');
      return {
        id: data.user.id,
        email: data.user.email || ''
      };
    }

    return null;
  } catch (error: any) {
    console.error('Error signing up:', error);
    toast.error('Failed to create account');
    return null;
  }
};

export const signOut = async (): Promise<void> => {
  try {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      toast.error(error.message);
      return;
    }
    
    toast.success('Signed out successfully');
  } catch (error: any) {
    console.error('Error signing out:', error);
    toast.error('Failed to sign out');
  }
};
