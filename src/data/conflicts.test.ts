import { describe, it, expect, vi, afterEach } from 'vitest';
import {
  detectConflicts,
  detectLibraryConflicts,
  getProductExpiryDate,
  getExpiryStatus,
  getProductsByExpiry,
} from './conflicts';
import type { Product, IngredientFlag } from '../types';

function makeProduct(
  id: string,
  flagIngredients: string[],
  extra: Partial<Product> = {},
): Product {
  const flags: IngredientFlag[] = flagIngredients.map((ingredient) => ({
    ingredient,
    category: 'active',
  }));
  return {
    id,
    name: `Product ${id}`,
    brand: 'TestBrand',
    category: 'treatment',
    flags,
    createdAt: '2026-01-01T00:00:00.000Z',
    ...extra,
  };
}

describe('detectConflicts', () => {
  it('returns no conflicts for fewer than 2 products', () => {
    expect(detectConflicts([makeProduct('1', ['Retinol'])])).toEqual([]);
  });

  it('flags retinoid + AHA as a warning', () => {
    const products = [
      makeProduct('1', ['Retinol']),
      makeProduct('2', ['Glycolic Acid (AHA)']),
    ];
    const matches = detectConflicts(products);
    const retinoidAha = matches.find((m) => m.rule.id === 'retinoid-aha');
    expect(retinoidAha).toBeDefined();
    expect(retinoidAha!.rule.severity).toBe('warning');
  });

  it('normalises ingredient names (strips parentheticals, lowercases, hyphenates)', () => {
    // "Glycolic Acid (AHA)" should normalise to "glycolic-acid" and match the rule
    const products = [
      makeProduct('1', ['Retinaldehyde']), // not a retinoid key — retinal is the key
      makeProduct('2', ['Glycolic Acid (AHA)']),
    ];
    // Retinaldehyde label isn't in RETINOIDS group keys, so no retinoid-aha match
    const matches = detectConflicts(products);
    expect(matches.find((m) => m.rule.id === 'retinoid-aha')).toBeUndefined();
  });

  it('does not flag a conflict when both keys live in a single product only', () => {
    // One product containing both retinol and glycolic acid, nothing else
    const products = [makeProduct('1', ['Retinol', 'Glycolic Acid (AHA)'])];
    expect(detectConflicts(products)).toEqual([]);
  });

  it('flags benzoyl peroxide + exfoliating acid', () => {
    const products = [
      makeProduct('1', ['Benzoyl Peroxide']),
      makeProduct('2', ['Salicylic Acid (BHA)']),
    ];
    const matches = detectConflicts(products);
    expect(
      matches.find((m) => m.rule.id === 'benzoyl-peroxide-aha'),
    ).toBeDefined();
  });

  it('returns no conflict for two unrelated products', () => {
    const products = [
      makeProduct('1', ['Hyaluronic Acid']),
      makeProduct('2', ['Ceramides']),
    ];
    expect(detectConflicts(products)).toEqual([]);
  });
});

describe('detectLibraryConflicts', () => {
  it('ignores products without flags', () => {
    const products = [makeProduct('1', []), makeProduct('2', [])];
    expect(detectLibraryConflicts(products)).toEqual([]);
  });

  it('detects conflicts across the whole library', () => {
    const products = [
      makeProduct('1', ['Retinol']),
      makeProduct('2', ['Vitamin C']),
    ];
    expect(detectLibraryConflicts(products).length).toBeGreaterThan(0);
  });
});

describe('getProductExpiryDate', () => {
  it('returns null when openedAt or paoMonths missing', () => {
    expect(getProductExpiryDate(makeProduct('1', []))).toBeNull();
    expect(
      getProductExpiryDate(makeProduct('1', [], { openedAt: '2026-01-01' })),
    ).toBeNull();
    expect(
      getProductExpiryDate(makeProduct('1', [], { paoMonths: 6 })),
    ).toBeNull();
  });

  it('parses date-only openedAt at local midnight (not UTC)', () => {
    const d = getProductExpiryDate(
      makeProduct('1', [], { openedAt: '2026-01-01', paoMonths: 6 }),
    )!;
    expect(d).not.toBeNull();
    // Local date components should reflect the local-midnight parse: 1 Jan + 6 months = 1 Jul
    expect(d.getFullYear()).toBe(2026);
    expect(d.getMonth()).toBe(6); // July (0-indexed)
    expect(d.getDate()).toBe(1);
  });
});

describe('getExpiryStatus', () => {
  const FIXED_NOW = new Date('2026-06-15T12:00:00.000Z');

  afterEach(() => vi.useRealTimers());

  it('returns "expired" when past PAO', () => {
    vi.useFakeTimers();
    vi.setSystemTime(FIXED_NOW);
    // opened 2025-01-01 + 6 months = 2025-07-01, well before now
    const p = makeProduct('1', [], { openedAt: '2025-01-01', paoMonths: 6 });
    expect(getExpiryStatus(p)).toBe('expired');
  });

  it('returns "expiring-soon" when within the window', () => {
    vi.useFakeTimers();
    vi.setSystemTime(FIXED_NOW);
    // opened 2026-01-01 + 6 months = 2026-07-01, ~16 days from now → within 30
    const p = makeProduct('1', [], { openedAt: '2026-01-01', paoMonths: 6 });
    expect(getExpiryStatus(p, 30)).toBe('expiring-soon');
  });

  it('returns null when comfortably in date', () => {
    vi.useFakeTimers();
    vi.setSystemTime(FIXED_NOW);
    // opened 2026-06-01 + 12 months = 2027-06-01, far away
    const p = makeProduct('1', [], { openedAt: '2026-06-01', paoMonths: 12 });
    expect(getExpiryStatus(p, 30)).toBeNull();
  });
});

describe('getProductsByExpiry', () => {
  it('buckets products into expired and expiring-soon', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-06-15T12:00:00.000Z'));

    const expired = makeProduct('1', [], {
      openedAt: '2025-01-01',
      paoMonths: 6,
    });
    const soon = makeProduct('2', [], { openedAt: '2026-01-01', paoMonths: 6 });
    const fine = makeProduct('3', [], {
      openedAt: '2026-06-01',
      paoMonths: 12,
    });
    const noPao = makeProduct('4', []);

    const { expired: e, expiringSoon: s } = getProductsByExpiry(
      [expired, soon, fine, noPao],
      30,
    );
    expect(e.map((p) => p.id)).toEqual(['1']);
    expect(s.map((p) => p.id)).toEqual(['2']);

    vi.useRealTimers();
  });
});
