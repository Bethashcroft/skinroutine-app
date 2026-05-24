import { openDB, type IDBPDatabase } from 'idb';

const DB_NAME = 'routinelog';
const DB_VERSION = 1;
const STORE = 'kv';

let dbPromise: Promise<IDBPDatabase> | null = null;

function getDB() {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE)) {
          db.createObjectStore(STORE);
        }
      },
    });
  }
  return dbPromise;
}

export async function dbGet<T>(key: string): Promise<T | undefined> {
  const db = await getDB();
  return db.get(STORE, key);
}

export async function dbSet<T>(key: string, value: T): Promise<void> {
  const db = await getDB();
  await db.put(STORE, value, key);
}

export async function dbDelete(key: string): Promise<void> {
  const db = await getDB();
  await db.delete(STORE, key);
}

export async function dbGetAll(): Promise<Record<string, unknown>> {
  const db = await getDB();
  const keys = await db.getAllKeys(STORE);
  const result: Record<string, unknown> = {};
  for (const key of keys) {
    result[String(key)] = await db.get(STORE, key);
  }
  return result;
}

export async function dbClear(): Promise<void> {
  const db = await getDB();
  await db.clear(STORE);
}

const MIGRATION_KEYS = [
  'routinelog:products',
  'routinelog:entries',
  'routinelog-user-catalog',
];

export async function migrateFromLocalStorage(): Promise<void> {
  let migrated = false;

  for (const key of MIGRATION_KEYS) {
    const raw = localStorage.getItem(key);
    if (raw) {
      try {
        const value = JSON.parse(raw);
        await dbSet(key, value);
        migrated = true;
      } catch {
        // skip malformed entries
      }
    }
  }

  if (migrated) {
    for (const key of MIGRATION_KEYS) {
      localStorage.removeItem(key);
    }
  }
}
