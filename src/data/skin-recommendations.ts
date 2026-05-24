import type { SkinType, Concern } from '../types';
import BUILT_IN_PRODUCTS, { type BuiltInProduct } from './built-in-products';

export const SKIN_TYPES: { value: SkinType; label: string; desc: string }[] = [
  { value: 'normal', label: 'Normal', desc: 'Generally balanced, few issues' },
  { value: 'oily', label: 'Oily', desc: 'Shiny T-zone, enlarged pores' },
  { value: 'dry', label: 'Dry', desc: 'Tight, flaky, sometimes rough' },
  { value: 'combination', label: 'Combination', desc: 'Oily T-zone, dry cheeks' },
  { value: 'sensitive', label: 'Sensitive', desc: 'Easily irritated, redness-prone' },
];

export const CONCERNS: { value: Concern; label: string; icon: string }[] = [
  { value: 'acne', label: 'Acne & breakouts', icon: '🔴' },
  { value: 'ageing', label: 'Fine lines & ageing', icon: '✨' },
  { value: 'dryness', label: 'Dryness & hydration', icon: '💧' },
  { value: 'pigmentation', label: 'Dark spots & pigmentation', icon: '🎯' },
  { value: 'sensitivity', label: 'Redness & sensitivity', icon: '🌡️' },
  { value: 'texture', label: 'Texture & pores', icon: '🪞' },
];

export const CONCERN_KEYWORDS: Record<Concern, string[]> = {
  acne: ['salicylic acid', 'niacinamide', 'zinc', 'benzoyl peroxide', 'bha'],
  ageing: ['retinol', 'retinaldehyde', 'peptide', 'vitamin c', 'ascorbic', 'hyaluronic'],
  dryness: ['hyaluronic', 'ceramide', 'glycerin', 'squalane', 'panthenol', 'shea'],
  pigmentation: ['vitamin c', 'ascorbic', 'arbutin', 'niacinamide', 'tranexamic', 'azelaic'],
  sensitivity: ['ceramide', 'centella', 'panthenol', 'allantoin', 'bisabolol', 'aloe'],
  texture: ['glycolic acid', 'lactic acid', 'aha', 'salicylic', 'niacinamide', 'retinol'],
};

export const SKIN_TYPE_KEYWORDS: Partial<Record<SkinType, string[]>> = {
  oily: ['niacinamide', 'salicylic', 'zinc', 'clay'],
  dry: ['ceramide', 'hyaluronic', 'squalane', 'shea', 'glycerin'],
  sensitive: ['ceramide', 'centella', 'panthenol', 'fragrance-free'],
};

const KEYWORD_LABELS: Record<string, string> = {
  'salicylic acid': 'Salicylic acid (BHA)',
  'niacinamide': 'Niacinamide',
  'zinc': 'Zinc',
  'benzoyl peroxide': 'Benzoyl peroxide',
  bha: 'BHA',
  retinol: 'Retinol',
  retinaldehyde: 'Retinaldehyde',
  peptide: 'Peptides',
  'vitamin c': 'Vitamin C',
  ascorbic: 'Vitamin C (ascorbic)',
  hyaluronic: 'Hyaluronic acid',
  ceramide: 'Ceramides',
  glycerin: 'Glycerin',
  squalane: 'Squalane',
  panthenol: 'Panthenol',
  shea: 'Shea butter',
  arbutin: 'Arbutin',
  tranexamic: 'Tranexamic acid',
  azelaic: 'Azelaic acid',
  centella: 'Centella',
  allantoin: 'Allantoin',
  bisabolol: 'Bisabolol',
  aloe: 'Aloe',
  'glycolic acid': 'Glycolic acid (AHA)',
  'lactic acid': 'Lactic acid (AHA)',
  aha: 'AHAs',
  clay: 'Clay',
  'fragrance-free': 'Fragrance-free',
};

function keywordLabel(kw: string): string {
  return KEYWORD_LABELS[kw] ?? kw;
}

function buildKeywordSources(skinType: SkinType | null, concerns: Concern[]) {
  const sources = new Map<string, string[]>();
  for (const c of concerns) {
    for (const kw of CONCERN_KEYWORDS[c]) {
      const label = CONCERNS.find((x) => x.value === c)?.label ?? c;
      const list = sources.get(kw) ?? [];
      if (!list.includes(label)) list.push(label);
      sources.set(kw, list);
    }
  }
  if (skinType && SKIN_TYPE_KEYWORDS[skinType]) {
    const typeLabel = SKIN_TYPES.find((t) => t.value === skinType)?.label ?? skinType;
    for (const kw of SKIN_TYPE_KEYWORDS[skinType]!) {
      const list = sources.get(kw) ?? [];
      if (!list.includes(`${typeLabel} skin`)) list.push(`${typeLabel} skin`);
      sources.set(kw, list);
    }
  }
  return sources;
}

export interface ScoredRecommendation {
  product: BuiltInProduct;
  score: number;
  reasons: string[];
}

export function getRecommendationsWithReasons(
  skinType: SkinType | null,
  concerns: Concern[],
  limit = 8,
  ownedKeys?: Set<string>,
): ScoredRecommendation[] {
  const keywordSources = buildKeywordSources(skinType, concerns);
  const keywords = new Set(keywordSources.keys());

  if (keywords.size === 0) {
    return BUILT_IN_PRODUCTS.slice(0, limit).map((product) => ({
      product,
      score: 0,
      reasons: ['Popular starter pick'],
    }));
  }

  const scored = BUILT_IN_PRODUCTS.map((p) => {
    const ing = p.ingredients.toLowerCase();
    const matched: string[] = [];
    let score = 0;
    for (const kw of keywords) {
      if (ing.includes(kw)) {
        score++;
        const sources = keywordSources.get(kw) ?? [];
        matched.push(`${keywordLabel(kw)} (${sources.join(', ')})`);
      }
    }
    const key = `${p.name.toLowerCase()}|${p.brand.toLowerCase()}`;
    if (ownedKeys?.has(key)) score -= 10;
    return { product: p, score, reasons: [...new Set(matched)] };
  });

  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

export function getRecommendations(
  skinType: SkinType | null,
  concerns: Concern[],
  limit = 8,
): BuiltInProduct[] {
  return getRecommendationsWithReasons(skinType, concerns, limit).map((s) => s.product);
}
