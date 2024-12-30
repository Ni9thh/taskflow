import { useState } from 'react';
import { signIn, signUp, type AuthError } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';

export function useAuth() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSignIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { error } = await signIn(email, password);
      
      if (error) {
        toast({
          title: "Sign in failed",
          description: error.message,
          variant: "destructive",
          duration: 3000,
        });
        throw error;
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (email: string, password: string): Promise<AuthError | null> => {
    try {
      setLoading(true);
      const { error } = await signUp(email, password);
      
      if (error?.shouldSwitchToSignIn) {
        toast({
          title: "Account Already Exists",
          description: error.message,
          duration: 5000,
        });
        return error;
      }
      
      if (error) {
        toast({
          title: "Sign up failed",
          description: error.message,
          variant: "destructive",
          duration: 3000,
        });
        throw error;
      }
      
      toast({
        title: "Account Created!",
        description: "You can now sign in with your credentials.",
        duration: 3000,
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    signIn: handleSignIn,
    signUp: handleSignUp,
  };
}