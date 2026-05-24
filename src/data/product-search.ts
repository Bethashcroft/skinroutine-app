import type { ProductCategory } from '../types';
import { dbGet, dbSet } from '../lib/db';
import BUILT_IN_PRODUCTS from './built-in-products';

export interface SearchResult {
  name: string;
  brand: string;
  category: ProductCategory;
  flagKeys: string[];
  ingredients?: string;
  source: 'builtin' | 'api' | 'user';
}

// Maps ingredient text (lowercase) to flag keys.
// Entries are sorted longest-first at detection time to avoid partial matches.
const INGREDIENT_TO_FLAG: Record<string, string> = {
  // ── Actives ──
  'retinol': 'retinol',
  'retinal': 'retinal',
  'retinaldehyde': 'retinal',
  'tretinoin': 'tretinoin',
  'niacinamide': 'niacinamide',
  'ascorbic acid': 'vitamin-c',
  'ascorbyl glucoside': 'vitamin-c',
  'ascorbyl tetraisopalmitate': 'vitamin-c',
  'ethyl ascorbic acid': 'vitamin-c',
  '3-o-ethyl ascorbic acid': 'vitamin-c',
  'sodium ascorbyl phosphate': 'vitamin-c',
  'ascorbyl palmitate': 'vitamin-c',
  'glycolic acid': 'glycolic-acid',
  'lactic acid': 'lactic-acid',
  'salicylic acid': 'salicylic-acid',
  'hyaluronic acid': 'hyaluronic-acid',
  'sodium hyaluronate': 'hyaluronic-acid',
  'hydrolyzed hyaluronic acid': 'hyaluronic-acid',
  'ceramide np': 'ceramides',
  'ceramide ap': 'ceramides',
  'ceramide eop': 'ceramides',
  'ceramide ns': 'ceramides',
  'ceramide ng': 'ceramides',
  'azelaic acid': 'azelaic-acid',
  'tranexamic acid': 'tranexamic-acid',
  'alpha-arbutin': 'alpha-arbutin',
  'alpha arbutin': 'alpha-arbutin',
  'benzoyl peroxide': 'benzoyl-peroxide',
  'panthenol': 'panthenol',
  'd-panthenol': 'panthenol',
  'centella asiatica extract': 'centella',
  'centella asiatica': 'centella',
  'madecassoside': 'centella',
  'asiaticoside': 'centella',
  'bakuchiol': 'bakuchiol',
  'zinc oxide': 'zinc-oxide',

  // ── Fragrance allergens (EU 26) ──
  'linalool': 'linalool',
  'limonene': 'limonene',
  'd-limonene': 'limonene',
  'citronellol': 'citronellol',
  'geraniol': 'geraniol',
  'benzyl alcohol': 'benzyl-alcohol',
  'coumarin': 'coumarin',
  'eugenol': 'eugenol',
  'citral': 'citral',
  'hexyl cinnamal': 'hexyl-cinnamal',
  'amyl cinnamal': 'amyl-cinnamal',
  'amylcinnamal': 'amyl-cinnamal',
  'hydroxycitronellal': 'hydroxycitronellal',
  'benzyl benzoate': 'benzyl-benzoate',
  'benzyl cinnamate': 'benzyl-cinnamate',
  'benzyl salicylate': 'benzyl-salicylate',
  'cinnamyl alcohol': 'cinnamyl-alcohol',
  'cinnamal': 'cinnamal',
  'cinnamaldehyde': 'cinnamal',
  'farnesol': 'farnesol',
  'isoeugenol': 'isoeugenol',
  'alpha-isomethyl ionone': 'alpha-isomethyl-ionone',
  'butylphenyl methylpropional': 'alpha-isomethyl-ionone',
  'anise alcohol': 'anise-alcohol',
  'anisyl alcohol': 'anise-alcohol',
  'evernia prunastri': 'oakmoss',
  'evernia furfuracea': 'treemoss',
  'methyl 2-octynoate': 'methyl-2-octynoate',
  'parfum': 'fragrance',
  'fragrance': 'fragrance',

  // ── Irritants ──
  'alcohol denat': 'alcohol-denat',
  'alcohol denat.': 'alcohol-denat',
  'sd alcohol': 'alcohol-denat',
  'witch hazel': 'witch-hazel',
  'hamamelis virginiana': 'witch-hazel',
  'menthol': 'menthol',
  'mentha piperita': 'peppermint',
  'peppermint oil': 'peppermint',
  'camphor': 'camphor',
  'sodium lauryl sulfate': 'sls',
  'sodium laureth sulfate': 'sles',
  'essential oil': 'essential-oils',
  'essential oils': 'essential-oils',
  'tea tree oil': 'essential-oils',
  'melaleuca alternifolia': 'essential-oils',
  'lavandula angustifolia oil': 'essential-oils',
  'eucalyptus globulus oil': 'essential-oils',
  'rosmarinus officinalis oil': 'essential-oils',

  // ── Comedogenic ──
  'coconut oil': 'coconut-oil',
  'cocos nucifera oil': 'coconut-oil',
  'cocoa butter': 'cocoa-butter',
  'theobroma cacao seed butter': 'cocoa-butter',
  'isopropyl myristate': 'isopropyl-myristate',
  'isopropyl palmitate': 'isopropyl-palmitate',
  'lanolin': 'lanolin',
  'algae extract': 'algae-extract',
  'wheat germ oil': 'wheat-germ-oil',
  'triticum vulgare germ oil': 'wheat-germ-oil',
};

// Short ingredient names that need word-boundary matching to avoid false positives.
// "alcohol" must not match inside "benzyl alcohol", "cinnamyl alcohol", etc.
const WORD_BOUNDARY_FLAGS: Record<string, string> = {
  'alcohol': 'alcohol',
};

// Sorted entries: longest ingredient names first to prevent partial matches
const SORTED_ENTRIES = Object.entries(INGREDIENT_TO_FLAG)
  .sort((a, b) => b[0].length - a[0].length);

export function detectFlagsFromIngredients(ingredientsText: string): string[] {
  const lower = ingredientsText.toLowerCase();
  const found = new Set<string>();

  for (const [ingredient, flagKey] of SORTED_ENTRIES) {
    if (lower.includes(ingredient)) {
      found.add(flagKey);
    }
  }

  // Word-boundary checks for short/ambiguous names
  for (const [ingredient, flagKey] of Object.entries(WORD_BOUNDARY_FLAGS)) {
    const re = new RegExp(`(?<![a-z])${ingredient}(?![a-z])`, 'i');
    if (re.test(lower)) {
      found.add(flagKey);
    }
  }

  return [...found];
}

export function findFlaggedSubstrings(ingredientsText: string): { start: number; end: number; flagKey: string }[] {
  const lower = ingredientsText.toLowerCase();
  const matches: { start: number; end: number; flagKey: string }[] = [];

  for (const [ingredient, flagKey] of SORTED_ENTRIES) {
    let idx = 0;
    while ((idx = lower.indexOf(ingredient, idx)) !== -1) {
      matches.push({ start: idx, end: idx + ingredient.length, flagKey });
      idx += ingredient.length;
    }
  }

  for (const [ingredient, flagKey] of Object.entries(WORD_BOUNDARY_FLAGS)) {
    const re = new RegExp(`(?<![a-z])${ingredient}(?![a-z])`, 'gi');
    let m: RegExpExecArray | null;
    while ((m = re.exec(lower)) !== null) {
      matches.push({ start: m.index, end: m.index + m[0].length, flagKey });
    }
  }

  return matches.sort((a, b) => a.start - b.start);
}

function guessCategory(name: string, categories?: string[]): ProductCategory {
  const lower = (name + ' ' + (categories?.join(' ') ?? '')).toLowerCase();

  if (/\bspf\b|sunscreen|sun cream|sun block|sun protect|uv\b/i.test(lower)) return 'spf';
  if (/cleanser|cleansing|wash|micellar/i.test(lower)) return 'cleanser';
  if (/toner|toning|lotion tonique/i.test(lower)) return 'toner';
  if (/serum|ampoule|essence|booster/i.test(lower)) return 'serum';
  if (/moisturi[sz]|cream|lotion|baume|balm|hydrat/i.test(lower)) return 'moisturiser';
  if (/mask|peel|exfoli|treatment|retinol|acne|spot/i.test(lower)) return 'treatment';

  return 'other';
}

interface OBFProduct {
  product_name?: string;
  brands?: string;
  categories_tags_en?: string[];
  ingredients_text?: string;
  ingredients_text_en?: string;
}

function parseAPIProducts(products: OBFProduct[]): SearchResult[] {
  return products
    .filter((p) => p.product_name && p.brands)
    .map((p) => {
      const ingredientsRaw = p.ingredients_text_en || p.ingredients_text || '';
      const flagKeys = detectFlagsFromIngredients(ingredientsRaw);
      const category = guessCategory(p.product_name!, p.categories_tags_en);
      return {
        name: p.product_name!,
        brand: p.brands!.split(',')[0].trim(),
        category,
        flagKeys,
        source: 'api' as const,
      };
    });
}

const API_BASES = [
  'https://world.openbeautyfacts.org',
  'https://world.openfoodfacts.org',
];

function searchBuiltIn(query: string): SearchResult[] {
  const q = query.toLowerCase();
  return BUILT_IN_PRODUCTS
    .filter((p) => p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q))
    .map((p) => ({
      name: p.name,
      brand: p.brand,
      category: p.category,
      flagKeys: detectFlagsFromIngredients(p.ingredients),
      ingredients: p.ingredients,
      source: 'builtin' as const,
    }));
}

export function lookupBuiltIn(name: string, brand: string): SearchResult | undefined {
  const nameLower = name.toLowerCase();
  const brandLower = brand.toLowerCase();
  const match = BUILT_IN_PRODUCTS.find((p) => {
    const pName = p.name.toLowerCase();
    const pBrand = p.brand.toLowerCase();
    return (pName.includes(nameLower) || nameLower.includes(pName)) &&
           (pBrand.includes(brandLower) || brandLower.includes(pBrand));
  });
  if (!match) return undefined;
  return {
    name: match.name,
    brand: match.brand,
    category: match.category,
    flagKeys: detectFlagsFromIngredients(match.ingredients),
    ingredients: match.ingredients,
    source: 'builtin',
  };
}

let abortController: AbortController | null = null;

export async function searchProducts(query: string): Promise<SearchResult[]> {
  if (query.trim().length < 2) return [];

  if (abortController) abortController.abort();
  abortController = new AbortController();

  const builtInResults = searchBuiltIn(query);
  const userResults = await searchUserCatalog(query);

  const seen = new Set([
    ...builtInResults.map((r) => `${r.name}::${r.brand}`.toLowerCase()),
  ]);
  const deduped: SearchResult[] = [...builtInResults];

  for (const r of userResults) {
    const key = `${r.name}::${r.brand}`.toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      deduped.push(r);
    }
  }

  try {
    const fetches = API_BASES.map(async (base) => {
      const url = `${base}/cgi/search.pl?search_terms=${encodeURIComponent(query)}&search_simple=1&action=process&json=1&page_size=8&fields=product_name,brands,categories_tags_en,ingredients_text,ingredients_text_en`;
      const res = await fetch(url, {
        signal: abortController!.signal,
        headers: { 'User-Agent': 'SkinRoutine/1.0 (skincare diary app)' },
      });
      if (!res.ok) return [];
      const data = await res.json();
      return parseAPIProducts(data.products ?? []);
    });

    const results = await Promise.allSettled(fetches);
    const apiResults = results.flatMap((r) => r.status === 'fulfilled' ? r.value : []);

    for (const r of apiResults) {
      const key = `${r.name}::${r.brand}`.toLowerCase();
      if (!seen.has(key)) {
        seen.add(key);
        deduped.push(r);
      }
    }

    return deduped.slice(0, 15);
  } catch {
    return deduped;
  }
}

// Targeted lookup for a specific product (used for post-add flag detection)
export async function lookupProduct(name: string, brand: string): Promise<string[]> {
  const query = `${brand} ${name}`;
  try {
    const fetches = API_BASES.map(async (base) => {
      const url = `${base}/cgi/search.pl?search_terms=${encodeURIComponent(query)}&search_simple=1&action=process&json=1&page_size=5&fields=product_name,brands,ingredients_text,ingredients_text_en`;
      const res = await fetch(url, {
        headers: { 'User-Agent': 'SkinRoutine/1.0 (skincare diary app)' },
      });
      if (!res.ok) return [];
      const data = await res.json();
      return (data.products ?? []) as OBFProduct[];
    });

    const results = await Promise.allSettled(fetches);
    const allProducts = results.flatMap((r) => r.status === 'fulfilled' ? r.value : []);

    const nameLower = name.toLowerCase();
    const brandLower = brand.toLowerCase();
    const match = allProducts.find((p) => {
      const pName = (p.product_name ?? '').toLowerCase();
      const pBrand = (p.brands ?? '').toLowerCase();
      return (pName.includes(nameLower) || nameLower.includes(pName)) &&
             (pBrand.includes(brandLower) || brandLower.includes(pBrand));
    });

    if (!match) return [];
    const raw = match.ingredients_text_en || match.ingredients_text || '';
    if (!raw) return [];
    return detectFlagsFromIngredients(raw);
  } catch {
    return [];
  }
}

// ── User catalog (IndexedDB cache of manually added products) ──

const USER_CATALOG_KEY = 'routinelog-user-catalog';

interface UserCatalogEntry {
  name: string;
  brand: string;
  category: ProductCategory;
  flagKeys: string[];
}

async function getUserCatalog(): Promise<UserCatalogEntry[]> {
  const data = await dbGet<UserCatalogEntry[]>(USER_CATALOG_KEY);
  return data ?? [];
}

async function saveUserCatalog(catalog: UserCatalogEntry[]): Promise<void> {
  await dbSet(USER_CATALOG_KEY, catalog);
}

export async function addToUserCatalog(entry: UserCatalogEntry): Promise<void> {
  const catalog = await getUserCatalog();
  const key = `${entry.name}::${entry.brand}`.toLowerCase();
  const exists = catalog.some((e) => `${e.name}::${e.brand}`.toLowerCase() === key);
  if (!exists) {
    catalog.push(entry);
    await saveUserCatalog(catalog);
  }
}

export async function updateUserCatalogFlags(name: string, brand: string, flagKeys: string[]): Promise<void> {
  const catalog = await getUserCatalog();
  const key = `${name}::${brand}`.toLowerCase();
  const entry = catalog.find((e) => `${e.name}::${e.brand}`.toLowerCase() === key);
  if (entry) {
    entry.flagKeys = flagKeys;
    await saveUserCatalog(catalog);
  }
}

async function searchUserCatalog(query: string): Promise<SearchResult[]> {
  const q = query.toLowerCase();
  const catalog = await getUserCatalog();
  return catalog
    .filter((e) => e.name.toLowerCase().includes(q) || e.brand.toLowerCase().includes(q))
    .map((e) => ({ ...e, source: 'user' as const }));
}
