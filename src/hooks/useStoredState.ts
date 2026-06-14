import { useState, useCallback, useEffect } from 'react';
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

export function useStoredState<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  const [isReady, setIsReady] = useState(false);
  const [prevKey, setPrevKey] = useState(key);

  if (key !== prevKey) {
    setPrevKey(key);
    setStoredValue(initialValue);
    setIsReady(false);
  }

  useEffect(() => {
    let active = true;

    ensureMigration()
      .then(() => dbGet<T>(key))
      .then((value) => {
        if (!active) return;
        if (value !== undefined) setStoredValue(value);
        setIsReady(true);
      });

    return () => {
      active = false;
    };
  }, [key]);

  useEffect(() => {
    if (!isReady) return;
    dbSet(key, storedValue).catch(() => {
      console.warn(`Failed to persist "${key}" to IndexedDB`);
    });
  }, [key, storedValue, isReady]);

  const setValue = useCallback((value: T | ((prev: T) => T)) => {
    setStoredValue((prev) => (value instanceof Function ? value(prev) : value));
  }, []);

  return [storedValue, setValue, isReady] as const;
}
