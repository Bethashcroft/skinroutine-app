import { createContext, useContext, useEffect, useState, useCallback, useRef, type ReactNode } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase, isConfigured } from '../lib/supabase';
import { dbDelete } from '../lib/db';
import { productsKey, entriesKey, LEGACY_PRODUCTS_KEY, LEGACY_ENTRIES_KEY } from '../lib/storage-keys';

interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<string | null>;
  signUpWithEmail: (email: string, password: string) => Promise<string | null>;
  signOut: () => Promise<void>;
  deleteAccount: () => Promise<string | null>;
}

const AuthContext = createContext<AuthState>({
  user: null,
  session: null,
  loading: true,
  signInWithGoogle: async () => {},
  signInWithEmail: async () => null,
  signUpWithEmail: async () => null,
  signOut: async () => {},
  deleteAccount: async () => null,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signInWithGoogle = useCallback(async () => {
    if (!supabase) return;
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin },
    });
  }, []);

  const signInWithEmail = useCallback(async (email: string, password: string): Promise<string | null> => {
    if (!supabase) return 'Supabase not configured';
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return error?.message ?? null;
  }, []);

  const signUpWithEmail = useCallback(async (email: string, password: string): Promise<string | null> => {
    if (!supabase) return 'Supabase not configured';
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: window.location.origin },
    });
    return error?.message ?? null;
  }, []);

  const deleteAccount = useCallback(async (): Promise<string | null> => {
    if (!supabase) return 'Supabase not configured';
    const { error } = await supabase.rpc('delete_user');
    if (error) return error.message;
    // clear local data the same way signOut does
    const userId = sessionRef.current?.user?.id;
    await Promise.all([
      dbDelete(LEGACY_PRODUCTS_KEY),
      dbDelete(LEGACY_ENTRIES_KEY),
      dbDelete('routinelog-user-catalog'),
      userId ? dbDelete(productsKey(userId)) : Promise.resolve(),
      userId ? dbDelete(entriesKey(userId)) : Promise.resolve(),
      userId ? dbDelete(`skinroutine:onboarded:${userId}`) : Promise.resolve(),
      userId ? dbDelete(`skinroutine:profile:${userId}`) : Promise.resolve(),
    ]);
    return null;
  }, []);

  const sessionRef = useRef(session);
  sessionRef.current = session;

  const signOut = useCallback(async () => {
    if (!supabase) return;
    const userId = sessionRef.current?.user?.id;
    await supabase.auth.signOut();
    await Promise.all([
      dbDelete(LEGACY_PRODUCTS_KEY),
      dbDelete(LEGACY_ENTRIES_KEY),
      dbDelete('routinelog-user-catalog'),
      userId ? dbDelete(productsKey(userId)) : Promise.resolve(),
      userId ? dbDelete(entriesKey(userId)) : Promise.resolve(),
      userId ? dbDelete(`skinroutine:onboarded:${userId}`) : Promise.resolve(),
      userId ? dbDelete(`skinroutine:profile:${userId}`) : Promise.resolve(),
    ]);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user: session?.user ?? null,
        session,
        loading,
        signInWithGoogle,
        signInWithEmail,
        signUpWithEmail,
        signOut,
        deleteAccount,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

export { isConfigured as isSupabaseConfigured };
