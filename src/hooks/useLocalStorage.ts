import { useState, useCallback, useEffect, useRef } from 'react';
import { dbGet, dbSet, migrateFromLocalStorage } from '../lib/db';

let migrationDone = false;
let migrationPromise: Promise<void> | null = null;

function ensureMigration(): Promise<void> {
  if (migrationDone) return Promise.resolve();
  if (!migrationPromise) {
    migrationPromise = migrateFromLocalStorage().then(() => {
      migrationDone = true;
    });
  }
  return migrationPromise;
}

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  const [isReady, setIsReady] = useState(false);
  const loaded = useRef(false);
  const initialRef = useRef(initialValue);

  useEffect(() => {
    let cancelled = false;
    loaded.current = false;
    setIsReady(false);
    setStoredValue(initialRef.current);

    ensureMigration()
      .then(() => dbGet<T>(key))
      .then((value) => {
        if (!cancelled) {
          if (value !== undefined) setStoredValue(value);
          loaded.current = true;
          setIsReady(true);
        }
      });

    return () => { cancelled = true; };
  }, [key]);

  useEffect(() => {
    if (!loaded.current) return;
    dbSet(key, storedValue).catch(() => {
      console.warn(`Failed to persist "${key}" to IndexedDB`);
    });
  }, [key, storedValue]);

  const setValue = useCallback((value: T | ((prev: T) => T)) => {
    setStoredValue((prev) => {
      const next = value instanceof Function ? value(prev) : value;
      return next;
    });
  }, []);

  return [storedValue, setValue, isReady] as const;
}
