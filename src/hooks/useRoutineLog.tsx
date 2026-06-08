import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from 'react';
import { nanoid } from 'nanoid';
import type { RoutineEntry, SkinRating } from '../types';
import { useLocalStorage } from './useLocalStorage';
import { useAuth } from './useAuth';
import { pushEntries, pullEntries, pullDeletedEntryIds, deleteRemoteEntry } from '../lib/sync';
import { dbGet, dbSet } from '../lib/db';
import { entriesKey, LEGACY_ENTRIES_KEY } from '../lib/storage-keys';

export interface RoutineEntryInput {
  date: string;
  session: 'AM' | 'PM';
  productIds: string[];
  skinRating: SkinRating;
  notes: string;
}

interface RoutineLogContextValue {
  entries: RoutineEntry[];
  setEntries: Dispatch<SetStateAction<RoutineEntry[]>>;
  addEntry: (input: RoutineEntryInput) => RoutineEntry;
  updateEntry: (id: string, input: Partial<RoutineEntryInput>) => void;
  deleteEntry: (id: string) => void;
  getEntriesForDate: (date: string) => RoutineEntry[];
  getStreak: () => number;
  getLast7DaysRatings: () => { date: string; avg: number }[];
  getProductStats: (productId: string) => { timesUsed: number; lastUsed: string | null };
}

const RoutineLogContext = createContext<RoutineLogContextValue | null>(null);

function useRoutineLogState(): RoutineLogContextValue {
  const { user } = useAuth();
  const key = entriesKey(user?.id);
  const [entries, setEntries, isReady] = useLocalStorage<RoutineEntry[]>(key, []);
  const hasSynced = useRef(false);
  const migratedLegacy = useRef(false);

  useEffect(() => {
    if (!user?.id || migratedLegacy.current || !isReady) return;
    migratedLegacy.current = true;

    (async () => {
      const current = await dbGet<RoutineEntry[]>(key);
      if (current && current.length > 0) return;

      const legacy = await dbGet<RoutineEntry[]>(LEGACY_ENTRIES_KEY);
      if (legacy && legacy.length > 0) {
        setEntries(legacy);
        await dbSet(key, legacy);
      }
    })();
  }, [user?.id, isReady, key, setEntries]);

  useEffect(() => {
    if (!user || !isReady || hasSynced.current) return;
    hasSynced.current = true;

    Promise.all([pullEntries(), pullDeletedEntryIds()])
      .then(([remote, deletedIds]) => {
        const deletedSet = new Set(deletedIds);
        setEntries((local) => {
          // Drop anything deleted on another device before merging.
          const survivingLocal = local.filter((e) => !deletedSet.has(e.id));
          const localIds = new Set(survivingLocal.map((e) => e.id));
          const remoteIds = new Set(remote.map((e) => e.id));
          const merged = [...survivingLocal];
          for (const re of remote) {
            if (!localIds.has(re.id)) merged.push(re);
          }
          const localOnly = survivingLocal.filter((e) => !remoteIds.has(e.id));
          if (localOnly.length > 0) {
            pushEntries(localOnly).catch(() => {});
          }
          return merged;
        });
      })
      .catch(() => {});
  }, [user, isReady, setEntries]);

  useEffect(() => {
    if (!user) hasSynced.current = false;
  }, [user]);

  const syncEntry = useCallback(
    (entry: RoutineEntry) => {
      if (!user) return;
      pushEntries([entry]).catch(() => {});
    },
    [user],
  );

  const addEntry = useCallback(
    (input: RoutineEntryInput): RoutineEntry => {
      const entry: RoutineEntry = { id: nanoid(), ...input };
      setEntries((prev) => [...prev, entry]);
      syncEntry(entry);
      return entry;
    },
    [setEntries, syncEntry],
  );

  const updateEntry = useCallback(
    (id: string, input: Partial<RoutineEntryInput>) => {
      let updated: RoutineEntry | null = null;
      setEntries((prev) =>
        prev.map((e) => {
          if (e.id !== id) return e;
          updated = { ...e, ...input };
          return updated;
        }),
      );
      if (updated) syncEntry(updated);
    },
    [setEntries, syncEntry],
  );

  const deleteEntry = useCallback(
    (id: string) => {
      setEntries((prev) => prev.filter((e) => e.id !== id));
      if (user) {
        deleteRemoteEntry(id).catch(() => {});
      }
    },
    [setEntries, user],
  );

  const getEntriesForDate = useCallback(
    (date: string) => entries.filter((e) => e.date === date),
    [entries],
  );

  const getStreak = useCallback((): number => {
    if (entries.length === 0) return 0;

    const uniqueDates = [...new Set(entries.map((e) => e.date))].sort().reverse();
    const today = new Date().toISOString().slice(0, 10);

    if (uniqueDates[0] !== today) return 0;

    let streak = 1;
    for (let i = 1; i < uniqueDates.length; i++) {
      const prev = new Date(uniqueDates[i - 1]);
      const curr = new Date(uniqueDates[i]);
      const diffDays = (prev.getTime() - curr.getTime()) / (1000 * 60 * 60 * 24);
      if (diffDays === 1) streak++;
      else break;
    }
    return streak;
  }, [entries]);

  const getLast7DaysRatings = useCallback((): { date: string; avg: number }[] => {
    const result: { date: string; avg: number }[] = [];
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().slice(0, 10);
      const dayEntries = entries.filter((e) => e.date === dateStr);

      if (dayEntries.length > 0) {
        const avg = dayEntries.reduce((sum, e) => sum + e.skinRating, 0) / dayEntries.length;
        result.push({ date: dateStr, avg: Math.round(avg * 10) / 10 });
      } else {
        result.push({ date: dateStr, avg: 0 });
      }
    }

    return result;
  }, [entries]);

  const getProductStats = useCallback(
    (productId: string): { timesUsed: number; lastUsed: string | null } => {
      let timesUsed = 0;
      let lastUsed: string | null = null;

      for (const entry of entries) {
        if (entry.productIds.includes(productId)) {
          timesUsed++;
          if (!lastUsed || entry.date > lastUsed) lastUsed = entry.date;
        }
      }

      return { timesUsed, lastUsed };
    },
    [entries],
  );

  return {
    entries,
    setEntries,
    addEntry,
    updateEntry,
    deleteEntry,
    getEntriesForDate,
    getStreak,
    getLast7DaysRatings,
    getProductStats,
  };
}

export function RoutineLogProvider({ children }: { children: ReactNode }) {
  const value = useRoutineLogState();
  return <RoutineLogContext.Provider value={value}>{children}</RoutineLogContext.Provider>;
}

export function useRoutineLog() {
  const ctx = useContext(RoutineLogContext);
  if (!ctx) {
    throw new Error('useRoutineLog must be used within RoutineLogProvider');
  }
  return ctx;
}
