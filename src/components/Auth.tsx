import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Code2Icon } from 'lucide-react';
import { AuthForm } from '@/components/AuthForm';
import { useAuth } from '@/hooks/useAuth';
import { Toaster } from '@/components/ui/toaster';
import { ThemeToggle } from '@/components/ThemeToggle';

export function Auth() {
  const [isSignUp, setIsSignUp] = useState(true);
  const { loading, signIn, signUp } = useAuth();

  const handleSubmit = async (email: string, password: string) => {
    try {
      if (isSignUp) {
        const error = await signUp(email, password);
        if (error?.shouldSwitchToSignIn) {
          setIsSignUp(false);
        }
      } else {
        await signIn(email, password);
      }
    } catch (error) {
      // Error is already handled in useAuth
    }
  };

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-zinc-900 dark:bg-white">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <Card className="w-full max-w-md mx-4 bg-zinc-900 dark:bg-white border-zinc-800 dark:border-zinc-200">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            <Code2Icon className="h-12 w-12 text-white dark:text-zinc-900" />
          </div>
          <CardTitle className="text-2xl text-center font-mono text-white dark:text-zinc-900">Task Flow</CardTitle>
          <CardDescription className="text-center text-zinc-400 dark:text-zinc-500">
            {isSignUp ? 'Create an account to get started' : 'Welcome back! Sign in to continue'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AuthForm
            isSignUp={isSignUp}
            loading={loading}
            onSubmit={handleSubmit}
            onToggleMode={() => setIsSignUp(!isSignUp)}
          />
        </CardContent>
      </Card>
      <p className="mt-8 text-sm text-zinc-500 dark:text-zinc-400 font-mono">
        Made by jaryd.designs
      </p>
      <Toaster />
    </div>
  );
}