import type { ProductCategory } from '../types';
import { dbGet, dbSet } from '../lib/db';

export const BUILT_IN_CATEGORIES: { value: ProductCategory; label: string }[] =
  [
    { value: 'cleanser', label: 'Cleanser' },
    { value: 'toner', label: 'Toner' },
    { value: 'serum', label: 'Serum' },
    { value: 'moisturiser', label: 'Moisturiser' },
    { value: 'spf', label: 'SPF' },
    { value: 'treatment', label: 'Treatment' },
    { value: 'mask', label: 'Face Mask' },
    { value: 'other', label: 'Other' },
  ];

const CUSTOM_CATEGORIES_KEY = 'routinelog:custom-categories';

export async function loadCustomCategories(): Promise<string[]> {
  return (await dbGet<string[]>(CUSTOM_CATEGORIES_KEY)) ?? [];
}

export async function saveCustomCategory(name: string): Promise<void> {
  const existing = await loadCustomCategories();
  if (!existing.includes(name)) {
    await dbSet(CUSTOM_CATEGORIES_KEY, [...existing, name]);
  }
}

export function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function getCategoryLabel(category: string): string {
  const built = BUILT_IN_CATEGORIES.find((c) => c.value === category);
  if (built) return built.label;
  return capitalize(category);
}
