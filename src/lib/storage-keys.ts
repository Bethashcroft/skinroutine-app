/** Per-user IndexedDB keys (legacy global keys migrated on first load). */
export function productsKey(userId: string | undefined): string {
  return userId ? `skinroutine:products:${userId}` : 'skinroutine:products';
}

export function entriesKey(userId: string | undefined): string {
  return userId ? `skinroutine:entries:${userId}` : 'skinroutine:entries';
}

export const LEGACY_PRODUCTS_KEY = 'routinelog:products';
export const LEGACY_ENTRIES_KEY = 'routinelog:entries';
