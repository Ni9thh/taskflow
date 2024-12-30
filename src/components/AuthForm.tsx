import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface AuthFormProps {
  isSignUp: boolean;
  loading: boolean;
  onSubmit: (email: string, password: string) => Promise<void>;
  onToggleMode: () => void;
}

export function AuthForm({ isSignUp, loading, onSubmit, onToggleMode }: AuthFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(email, password);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Input
          type="email"
          placeholder="email@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="font-mono bg-zinc-800 dark:bg-white text-white dark:text-zinc-900 border-zinc-700 dark:border-zinc-200 placeholder:text-zinc-500"
          autoComplete="email"
          autoFocus
        />
      </div>
      <div className="space-y-2">
        <Input
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="font-mono bg-zinc-800 dark:bg-white text-white dark:text-zinc-900 border-zinc-700 dark:border-zinc-200 placeholder:text-zinc-500"
          autoComplete={isSignUp ? "new-password" : "current-password"}
          minLength={6}
        />
      </div>
      <div className="space-y-2">
        <Button
          type="submit"
          className="w-full font-mono bg-white hover:bg-zinc-100 text-zinc-900 dark:bg-zinc-900 dark:text-white dark:hover:bg-zinc-800"
          disabled={loading}
        >
          {loading ? 'Please wait...' : (isSignUp ? 'Create Account' : 'Sign In')}
        </Button>
        <Button
          type="button"
          variant="ghost"
          className="w-full font-mono text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-100"
          onClick={onToggleMode}
          disabled={loading}
        >
          {isSignUp ? 'Already have an account?' : 'Need an account?'}
        </Button>
      </div>
    </form>
  );
}