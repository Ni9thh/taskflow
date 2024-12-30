import { useEffect } from 'react';
import { Auth } from '@/components/Auth';
import { Dashboard } from '@/components/Dashboard';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/hooks/useAuthStore';
import { useTheme } from '@/hooks/useTheme';

function App() {
  const { user, setUser } = useAuthStore();
  useTheme(); // Initialize theme

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [setUser]);

  return (
    <div className="h-full w-full">
      {!user ? <Auth /> : <Dashboard user={user} />}
    </div>
  );
}

export default App;