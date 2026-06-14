import type { Product } from '../types';

export interface ConflictRule {
  id: string;
  groupA: string[];
  groupB: string[];
  severity: 'warning' | 'caution';
  message: string;
}

const RETINOIDS = ['retinol', 'retinal', 'tretinoin', 'bakuchiol'];
const AHAS = ['glycolic-acid', 'lactic-acid'];
const BHAS = ['salicylic-acid'];
const VITAMIN_C = ['vitamin-c'];
const BENZOYL_PEROXIDE = ['benzoyl-peroxide'];
const NIACINAMIDE = ['niacinamide'];

const RULES: ConflictRule[] = [
  {
    id: 'retinoid-aha',
    groupA: RETINOIDS,
    groupB: AHAS,
    severity: 'warning',
    message:
      'Retinoids + AHAs together can cause excessive irritation & peeling. Alternate nights instead.',
  },
  {
    id: 'retinoid-bha',
    groupA: RETINOIDS,
    groupB: BHAS,
    severity: 'caution',
    message:
      'Retinoids + BHA in the same routine may over-exfoliate. Use on different nights if skin is sensitive.',
  },
  {
    id: 'retinoid-vitamin-c',
    groupA: RETINOIDS,
    groupB: VITAMIN_C,
    severity: 'caution',
    message:
      "Retinoids + Vitamin C can reduce each other's efficacy and cause irritation. Use Vitamin C in AM, retinoid in PM.",
  },
  {
    id: 'retinoid-benzoyl-peroxide',
    groupA: RETINOIDS,
    groupB: BENZOYL_PEROXIDE,
    severity: 'warning',
    message:
      'Benzoyl Peroxide can deactivate retinoids. Apply at different times or alternate days.',
  },
  {
    id: 'aha-vitamin-c',
    groupA: AHAS,
    groupB: VITAMIN_C,
    severity: 'caution',
    message:
      'AHAs + Vitamin C at low pH can cause irritation. Space them out or use in different sessions.',
  },
  {
    id: 'vitamin-c-niacinamide',
    groupA: VITAMIN_C,
    groupB: NIACINAMIDE,
    severity: 'caution',
    message:
      'Vitamin C + Niacinamide may flush or tingle. Modern formulations usually work fine, but watch for redness.',
  },
  {
    id: 'benzoyl-peroxide-aha',
    groupA: BENZOYL_PEROXIDE,
    groupB: [...AHAS, ...BHAS],
    severity: 'warning',
    message:
      'Benzoyl Peroxide + exfoliating acids together can cause severe dryness and irritation.',
  },
];

function getFlagKeys(product: Product): Set<string> {
  const keys = new Set<string>();
  for (const flag of product.flags) {
    const normalised = flag.ingredient
      .toLowerCase()
      .replace(/\s*\(.*?\)\s*/g, '')
      .trim()
      .replace(/\s+/g, '-');
    keys.add(normalised);
  }
  return keys;
}

export interface ConflictMatch {
  rule: ConflictRule;
  productsA: Product[];
  productsB: Product[];
}

export function detectConflicts(products: Product[]): ConflictMatch[] {
  if (products.length < 2) return [];

  const productFlagSets = products.map((p) => ({
    product: p,
    keys: getFlagKeys(p),
  }));
  const matches: ConflictMatch[] = [];

  for (const rule of RULES) {
    const setA = new Set(rule.groupA);
    const setB = new Set(rule.groupB);

    const productsInA = productFlagSets.filter((pf) => {
      for (const key of pf.keys) {
        if (setA.has(key)) return true;
      }
      return false;
    });

    const productsInB = productFlagSets.filter((pf) => {
      for (const key of pf.keys) {
        if (setB.has(key)) return true;
      }
      return false;
    });

    if (productsInA.length === 0 || productsInB.length === 0) continue;

    const aIds = new Set(productsInA.map((p) => p.product.id));
    const bIds = new Set(productsInB.map((p) => p.product.id));
    const bothSameProduct =
      [...aIds].every((id) => bIds.has(id)) && aIds.size === bIds.size;
    if (bothSameProduct && aIds.size === 1) continue;

    matches.push({
      rule,
      productsA: productsInA.map((p) => p.product),
      productsB: productsInB.map((p) => p.product),
    });
  }

  return matches;
}

export function getProductExpiryDate(product: Product): Date | null {
  if (!product.openedAt || !product.paoMonths) return null;
  const opened = new Date(product.openedAt + 'T00:00:00');
  const expires = new Date(opened);
  expires.setMonth(expires.getMonth() + product.paoMonths);
  return expires;
}

export type ExpiryStatus = 'expired' | 'expiring-soon';

export function getExpiryStatus(
  product: Product,
  withinDays = 30,
): ExpiryStatus | null {
  const expires = getProductExpiryDate(product);
  if (!expires) return null;
  const now = new Date();
  if (now > expires) return 'expired';
  const msLeft = expires.getTime() - now.getTime();
  const daysLeft = msLeft / (1000 * 60 * 60 * 24);
  if (daysLeft <= withinDays) return 'expiring-soon';
  return null;
}

export function getProductsByExpiry(
  products: Product[],
  withinDays = 30,
): { expired: Product[]; expiringSoon: Product[] } {
  const expired: Product[] = [];
  const expiringSoon: Product[] = [];
  for (const p of products) {
    const status = getExpiryStatus(p, withinDays);
    if (status === 'expired') expired.push(p);
    else if (status === 'expiring-soon') expiringSoon.push(p);
  }
  return { expired, expiringSoon };
}

export function detectExpiryWarnings(products: Product[]): Product[] {
  return getProductsByExpiry(products).expired;
}

/** Conflicts between products in the user's library (any pairing). */
export function detectLibraryConflicts(products: Product[]): ConflictMatch[] {
  const flagged = products.filter((p) => p.flags.length > 0);
  if (flagged.length < 2) return [];
  return detectConflicts(flagged);
}
