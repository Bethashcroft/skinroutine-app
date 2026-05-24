export type BuiltInCategory =
  | 'cleanser'
  | 'toner'
  | 'serum'
  | 'moisturiser'
  | 'spf'
  | 'treatment'
  | 'other';

export type ProductCategory = BuiltInCategory | (string & {});

export type FlagCategory = 'fragrance' | 'irritant' | 'comedogenic' | 'active';

export interface IngredientFlag {
  ingredient: string;
  category: FlagCategory;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: ProductCategory;
  flags: IngredientFlag[];
  ingredients?: string;
  notes?: string;
  openedAt?: string;
  paoMonths?: number;
  createdAt: string;
}

export type SkinType = 'oily' | 'dry' | 'combination' | 'sensitive' | 'normal';

export type Concern = 'acne' | 'ageing' | 'dryness' | 'pigmentation' | 'sensitivity' | 'texture';

export interface SkinProfile {
  skinType: SkinType;
  concerns: Concern[];
}

export type SkinRating = 1 | 2 | 3 | 4 | 5;

export interface RoutineEntry {
  id: string;
  date: string;
  session: 'AM' | 'PM';
  productIds: string[];
  skinRating: SkinRating;
  notes: string;
}
