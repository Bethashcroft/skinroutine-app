import { describe, it, expect } from 'vitest';
import { detectFlagsFromIngredients, findFlaggedSubstrings } from './product-search';

describe('detectFlagsFromIngredients', () => {
  it('detects a simple active', () => {
    expect(detectFlagsFromIngredients('Aqua, Retinol, Glycerin')).toContain('retinol');
  });

  it('maps ingredient synonyms to a single flag key', () => {
    expect(detectFlagsFromIngredients('Sodium Hyaluronate')).toContain('hyaluronic-acid');
    expect(detectFlagsFromIngredients('Hyaluronic Acid')).toContain('hyaluronic-acid');
    expect(detectFlagsFromIngredients('Ascorbyl Glucoside')).toContain('vitamin-c');
  });

  it('detects multiple distinct flags', () => {
    const flags = detectFlagsFromIngredients('Aqua, Niacinamide, Salicylic Acid, Limonene');
    expect(flags).toEqual(expect.arrayContaining(['niacinamide', 'salicylic-acid', 'limonene']));
  });

  it('does NOT flag bare "alcohol" inside "Cetearyl Alcohol" (word boundary)', () => {
    // Cetearyl Alcohol / Benzyl Alcohol are not the irritant "alcohol"
    const flags = detectFlagsFromIngredients('Aqua, Cetearyl Alcohol, Glycerin');
    expect(flags).not.toContain('alcohol');
  });

  it('flags standalone "Alcohol" as an irritant', () => {
    expect(detectFlagsFromIngredients('Aqua, Alcohol, Glycerin')).toContain('alcohol');
  });

  it('detects "Alcohol Denat." distinctly from plain alcohol', () => {
    const flags = detectFlagsFromIngredients('Alcohol Denat., Aqua');
    expect(flags).toContain('alcohol-denat');
  });

  it('detects benzyl alcohol as the fragrance allergen, not the irritant alcohol', () => {
    const flags = detectFlagsFromIngredients('Aqua, Benzyl Alcohol');
    expect(flags).toContain('benzyl-alcohol');
    expect(flags).not.toContain('alcohol');
  });

  it('returns an empty array for a clean ingredient list', () => {
    expect(detectFlagsFromIngredients('Aqua, Glycerin, Sodium Chloride')).toEqual([]);
  });

  it('is case-insensitive', () => {
    expect(detectFlagsFromIngredients('RETINOL')).toContain('retinol');
    expect(detectFlagsFromIngredients('retinol')).toContain('retinol');
  });

  it('deduplicates a flag that appears via multiple synonyms', () => {
    const flags = detectFlagsFromIngredients('Ceramide NP, Ceramide AP, Ceramide EOP');
    expect(flags.filter((f) => f === 'ceramides')).toHaveLength(1);
  });
});

describe('findFlaggedSubstrings', () => {
  it('returns positions sorted by start index', () => {
    const text = 'Aqua, Retinol, Niacinamide';
    const matches = findFlaggedSubstrings(text);
    const starts = matches.map((m) => m.start);
    const sorted = [...starts].sort((a, b) => a - b);
    expect(starts).toEqual(sorted);
  });

  it('locates the correct substring span for a flag', () => {
    const text = 'Aqua, Retinol, Glycerin';
    const match = findFlaggedSubstrings(text).find((m) => m.flagKey === 'retinol');
    expect(match).toBeDefined();
    expect(text.slice(match!.start, match!.end).toLowerCase()).toBe('retinol');
  });

  it('returns empty for clean lists', () => {
    expect(findFlaggedSubstrings('Aqua, Glycerin')).toEqual([]);
  });
});
