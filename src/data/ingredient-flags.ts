import type { FlagCategory, IngredientFlag } from '../types';

export const FLAG_META: Record<FlagCategory, { emoji: string; label: string; description: string }> = {
  fragrance:   { emoji: '🔴', label: 'Fragrance Allergens',  description: 'EU-regulated scent compounds that can cause sensitivity' },
  irritant:    { emoji: '🟠', label: 'Potential Irritants',   description: 'Ingredients that may irritate sensitive skin' },
  comedogenic: { emoji: '🟡', label: 'Comedogenic',           description: 'Ingredients known to clog pores' },
  active:      { emoji: '🔵', label: 'Active Ingredients',    description: 'Beneficial actives worth tracking' },
};

export interface FlagOption {
  key: string;
  label: string;
  category: FlagCategory;
}

const PICKER_OPTIONS: FlagOption[] = [
  // ── Fragrance allergens (simplified to common ones users would recognise) ──
  { key: 'fragrance',          label: 'Fragrance / Parfum',        category: 'fragrance' },
  { key: 'linalool',           label: 'Linalool',                  category: 'fragrance' },
  { key: 'limonene',           label: 'Limonene',                  category: 'fragrance' },
  { key: 'citronellol',        label: 'Citronellol',               category: 'fragrance' },
  { key: 'geraniol',           label: 'Geraniol',                  category: 'fragrance' },
  { key: 'benzyl-alcohol',     label: 'Benzyl Alcohol',            category: 'fragrance' },
  { key: 'coumarin',           label: 'Coumarin',                  category: 'fragrance' },
  { key: 'eugenol',            label: 'Eugenol',                   category: 'fragrance' },
  { key: 'citral',             label: 'Citral',                    category: 'fragrance' },
  { key: 'hexyl-cinnamal',     label: 'Hexyl Cinnamal',            category: 'fragrance' },
  { key: 'amyl-cinnamal',      label: 'Amyl Cinnamal',             category: 'fragrance' },
  { key: 'hydroxycitronellal', label: 'Hydroxycitronellal',        category: 'fragrance' },
  { key: 'benzyl-benzoate',   label: 'Benzyl Benzoate',           category: 'fragrance' },
  { key: 'benzyl-cinnamate',  label: 'Benzyl Cinnamate',          category: 'fragrance' },
  { key: 'benzyl-salicylate', label: 'Benzyl Salicylate',         category: 'fragrance' },
  { key: 'cinnamyl-alcohol',  label: 'Cinnamyl Alcohol',          category: 'fragrance' },
  { key: 'cinnamal',          label: 'Cinnamal',                  category: 'fragrance' },
  { key: 'farnesol',          label: 'Farnesol',                  category: 'fragrance' },
  { key: 'isoeugenol',        label: 'Isoeugenol',               category: 'fragrance' },
  { key: 'alpha-isomethyl-ionone', label: 'Alpha-Isomethyl Ionone', category: 'fragrance' },
  { key: 'anise-alcohol',     label: 'Anise Alcohol',             category: 'fragrance' },
  { key: 'oakmoss',           label: 'Evernia Prunastri (Oakmoss)', category: 'fragrance' },
  { key: 'treemoss',          label: 'Evernia Furfuracea (Treemoss)', category: 'fragrance' },
  { key: 'methyl-2-octynoate', label: 'Methyl 2-Octynoate',      category: 'fragrance' },

  // ── Potential irritants ────────────────────────────────────────────────
  { key: 'alcohol-denat',      label: 'Alcohol Denat',              category: 'irritant' },
  { key: 'alcohol',            label: 'Alcohol',                    category: 'irritant' },
  { key: 'witch-hazel',        label: 'Witch Hazel',                category: 'irritant' },
  { key: 'menthol',            label: 'Menthol',                    category: 'irritant' },
  { key: 'peppermint',         label: 'Peppermint',                 category: 'irritant' },
  { key: 'camphor',            label: 'Camphor',                    category: 'irritant' },
  { key: 'sls',                label: 'SLS',                        category: 'irritant' },
  { key: 'sles',               label: 'SLES',                       category: 'irritant' },
  { key: 'essential-oils',     label: 'Essential Oils',             category: 'irritant' },

  // ── Comedogenic ────────────────────────────────────────────────────────
  { key: 'coconut-oil',        label: 'Coconut Oil',                category: 'comedogenic' },
  { key: 'cocoa-butter',       label: 'Cocoa Butter',               category: 'comedogenic' },
  { key: 'isopropyl-myristate', label: 'Isopropyl Myristate',      category: 'comedogenic' },
  { key: 'isopropyl-palmitate', label: 'Isopropyl Palmitate',      category: 'comedogenic' },
  { key: 'lanolin',            label: 'Lanolin',                    category: 'comedogenic' },
  { key: 'algae-extract',      label: 'Algae Extract',              category: 'comedogenic' },
  { key: 'wheat-germ-oil',     label: 'Wheat Germ Oil',             category: 'comedogenic' },

  // ── Active ingredients ─────────────────────────────────────────────────
  { key: 'retinol',            label: 'Retinol',                    category: 'active' },
  { key: 'retinal',            label: 'Retinaldehyde',              category: 'active' },
  { key: 'tretinoin',          label: 'Tretinoin',                  category: 'active' },
  { key: 'niacinamide',        label: 'Niacinamide',                category: 'active' },
  { key: 'vitamin-c',          label: 'Vitamin C',                  category: 'active' },
  { key: 'glycolic-acid',      label: 'Glycolic Acid (AHA)',        category: 'active' },
  { key: 'lactic-acid',        label: 'Lactic Acid (AHA)',          category: 'active' },
  { key: 'salicylic-acid',     label: 'Salicylic Acid (BHA)',       category: 'active' },
  { key: 'hyaluronic-acid',    label: 'Hyaluronic Acid',            category: 'active' },
  { key: 'ceramides',          label: 'Ceramides',                  category: 'active' },
  { key: 'azelaic-acid',       label: 'Azelaic Acid',               category: 'active' },
  { key: 'tranexamic-acid',    label: 'Tranexamic Acid',            category: 'active' },
  { key: 'alpha-arbutin',      label: 'Alpha Arbutin',              category: 'active' },
  { key: 'benzoyl-peroxide',   label: 'Benzoyl Peroxide',           category: 'active' },
  { key: 'panthenol',          label: 'Panthenol (Vitamin B5)',      category: 'active' },
  { key: 'centella',           label: 'Centella Asiatica',           category: 'active' },
  { key: 'bakuchiol',          label: 'Bakuchiol',                   category: 'active' },
  { key: 'zinc-oxide',         label: 'Zinc Oxide',                  category: 'active' },
];

export function getPickerOptionsByCategory(): { category: FlagCategory; options: FlagOption[] }[] {
  const order: FlagCategory[] = ['active', 'fragrance', 'irritant', 'comedogenic'];
  return order.map((cat) => ({
    category: cat,
    options: PICKER_OPTIONS.filter((o) => o.category === cat),
  }));
}

export function flagOptionsToFlags(selectedKeys: string[]): IngredientFlag[] {
  return selectedKeys
    .map((key) => {
      const opt = PICKER_OPTIONS.find((o) => o.key === key);
      return opt ? { ingredient: opt.label, category: opt.category } : null;
    })
    .filter(Boolean) as IngredientFlag[];
}

export function flagsToOptionKeys(flags: IngredientFlag[]): string[] {
  return flags
    .map((f) => {
      const opt = PICKER_OPTIONS.find((o) => o.label === f.ingredient && o.category === f.category);
      return opt?.key;
    })
    .filter(Boolean) as string[];
}
