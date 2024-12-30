import { create } from 'zustand';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { persist } from 'zustand/middleware';

interface AuthState {
  user: User | null;
  setUser: (user: User | null) => void;
  signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      signOut: async () => {
        try {
          // Clear local state first to prevent UI flicker
          set({ user: null });
          
          // Clear any stored session data
          localStorage.removeItem('sb-rvunuowqsxtgyipmvicy-auth-token');
          sessionStorage.removeItem('sb-rvunuowqsxtgyipmvicy-auth-token');
          
          // Sign out from Supabase last
          await supabase.auth.signOut();
        } catch (error: any) {
          // Ignore session_not_found errors
          if (error?.message !== 'session_not_found') {
            console.error('Error during sign out:', error);
          }
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user }),
    }
  )
);