import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  type ReactNode,
} from 'react';
import type { SkinProfile } from '../types';
import { useStoredState } from './useStoredState';
import { useAuth } from './useAuth';
import { dbSet } from '../lib/db';
import { pullProfile, pushProfile } from '../lib/sync';

interface SkinProfileContextValue {
  profile: SkinProfile | null;
  setProfile: (p: SkinProfile | null) => Promise<void>;
}

const SkinProfileContext = createContext<SkinProfileContextValue | null>(null);

function useSkinProfileState(): SkinProfileContextValue {
  const { user } = useAuth();
  const key = user ? `skinroutine:profile:${user.id}` : 'skinroutine:profile';
  const [profile, setRaw, isReady] = useStoredState<SkinProfile | null>(
    key,
    null,
  );
  const hasSynced = useRef(false);

  useEffect(() => {
    if (!user) {
      hasSynced.current = false;
      return;
    }
    if (!isReady || hasSynced.current) return;
    hasSynced.current = true;

    pullProfile()
      .then((remote) => {
        setRaw((local) => {
          if (remote) return remote;
          if (local) pushProfile(local).catch(() => {});
          return local;
        });
      })
      .catch(() => {});
  }, [user, isReady, setRaw]);

  const setProfile = useCallback(
    async (p: SkinProfile | null) => {
      setRaw(p);
      await dbSet(key, p);
      if (user && p) {
        try {
          await pushProfile(p);
        } catch {
          // Local save succeeded; cloud sync can retry later
        }
      }
    },
    [user, key, setRaw],
  );

  return { profile, setProfile };
}

export function SkinProfileProvider({ children }: { children: ReactNode }) {
  const value = useSkinProfileState();
  return (
    <SkinProfileContext.Provider value={value}>
      {children}
    </SkinProfileContext.Provider>
  );
}

export function useSkinProfile() {
  const ctx = useContext(SkinProfileContext);
  if (!ctx) {
    throw new Error('useSkinProfile must be used within SkinProfileProvider');
  }
  return ctx;
}
