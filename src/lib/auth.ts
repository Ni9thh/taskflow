import { supabase } from './supabase';

export type AuthError = {
  message: string;
  code?: string;
  shouldSwitchToSignIn?: boolean;
};

export async function signUp(email: string, password: string): Promise<{ error: AuthError | null }> {
  try {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });
    
    if (error?.message.includes('already registered') || error?.message.includes('already exists')) {
      return {
        error: {
          message: 'An account with this email already exists. Please sign in instead.',
          code: 'user_already_exists',
          shouldSwitchToSignIn: true
        }
      };
    }
    
    if (error) throw error;
    
    return { error: null };
  } catch (err) {
    return {
      error: {
        message: err.message || 'Failed to create account',
        code: err.code
      }
    };
  }
}

export async function signIn(email: string, password: string): Promise<{ error: AuthError | null }> {
  try {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) throw error;
    
    return { error: null };
  } catch (err) {
    return {
      error: {
        message: err.message || 'Failed to sign in',
        code: err.code
      }
    };
  }
}