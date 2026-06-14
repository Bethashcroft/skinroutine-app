import type { SkinType, Concern } from '../types';

export interface Retailer {
  name: string;
  url: string;
  description: string;
  tags: string[];
  freeDelivery: string;
  highlight?: string;
  goodFor?: {
    skinTypes?: SkinType[];
    concerns?: Concern[];
  };
}

export const RETAILERS: Retailer[] = [
  {
    name: 'Boots',
    url: 'https://www.boots.com/beauty',
    description:
      "The UK's biggest high-street pharmacy and beauty retailer. Huge range from budget to premium, plus Advantage Card rewards.",
    tags: ['High street', 'Budget-friendly', 'Pharmacy'],
    freeDelivery: 'Free Click & Collect over £15',
    highlight: 'Advantage Card loyalty points',
    goodFor: {
      concerns: ['acne', 'sensitivity'],
      skinTypes: ['combination', 'normal'],
    },
  },
  {
    name: 'LOOKFANTASTIC',
    url: 'https://www.lookfantastic.co.uk',
    description:
      "One of Europe's largest online beauty retailers. Great for discovery with frequent sales and beauty box subscriptions.",
    tags: ['Online', 'Mid-range', 'Sales'],
    freeDelivery: 'Free delivery over £25',
    highlight: 'Beauty box subscriptions',
    goodFor: { concerns: ['ageing', 'pigmentation'] },
  },
  {
    name: 'Sephora UK',
    url: 'https://www.sephora.co.uk',
    description:
      'Global beauty giant now in the UK (absorbed Feelunique). Premium and indie brands with the MySephora rewards programme.',
    tags: ['Premium', 'Indie brands', 'Rewards'],
    freeDelivery: 'Free delivery over £20',
    highlight: 'MySephora loyalty programme',
    goodFor: {
      concerns: ['texture', 'ageing'],
      skinTypes: ['oily', 'combination'],
    },
  },
  {
    name: 'Cult Beauty',
    url: 'https://www.cultbeauty.co.uk',
    description:
      'Curated selection of cult-favourite and hard-to-find brands. Strong editorial content and expert recommendations.',
    tags: ['Curated', 'Cult brands', 'Expert picks'],
    freeDelivery: 'Free delivery over £25',
    highlight: '15% off first order (FIRST15)',
    goodFor: { concerns: ['ageing', 'pigmentation', 'texture'] },
  },
  {
    name: 'Space NK',
    url: 'https://uk.spacenk.com',
    description:
      'Luxury beauty destination. Carries high-end brands like Drunk Elephant, Tatcha, and Charlotte Tilbury.',
    tags: ['Luxury', 'High-end', 'Gifting'],
    freeDelivery: 'Free delivery over £25',
    highlight: 'Unlimited next-day for £10/year',
    goodFor: {
      concerns: ['ageing', 'dryness'],
      skinTypes: ['dry', 'sensitive'],
    },
  },
  {
    name: 'Superdrug',
    url: 'https://www.superdrug.com',
    description:
      'Affordable high-street staple. Great for everyday essentials, own-brand dupes, and the Health & Beautycard.',
    tags: ['High street', 'Budget', 'Essentials'],
    freeDelivery: 'Free Click & Collect',
    highlight: 'Health & Beautycard rewards',
    goodFor: {
      concerns: ['acne', 'dryness'],
      skinTypes: ['oily', 'combination'],
    },
  },
  {
    name: 'The Ordinary',
    url: 'https://theordinary.com/en-gb/',
    description:
      'Affordable clinical skincare direct from DECIEM. Transparent pricing and ingredient-led formulations.',
    tags: ['Direct', 'Clinical', 'Affordable'],
    freeDelivery: 'Free shipping over £55',
    highlight: 'Ingredient-first approach',
    goodFor: {
      concerns: ['acne', 'texture', 'pigmentation', 'ageing'],
      skinTypes: ['oily', 'combination', 'normal'],
    },
  },
  {
    name: "Paula's Choice",
    url: 'https://www.paulaschoice.co.uk',
    description:
      'Research-driven skincare with full ingredient transparency. Known for the BHA exfoliant and barrier-repair products.',
    tags: ['Direct', 'Research-led', 'Sensitive skin'],
    freeDelivery: 'Free shipping over £55',
    highlight: 'Next-day delivery before 3pm',
    goodFor: {
      concerns: ['acne', 'sensitivity', 'texture'],
      skinTypes: ['sensitive', 'combination'],
    },
  },
  {
    name: 'Beauty Bay',
    url: 'https://www.beautybay.com',
    description:
      'Trend-forward marketplace with a strong indie and K-beauty selection. Great prices and frequent promotions.',
    tags: ['Indie', 'K-beauty', 'Affordable'],
    freeDelivery: 'Free delivery over £25',
    highlight: 'Strong indie brand selection',
    goodFor: {
      concerns: ['texture', 'dryness'],
      skinTypes: ['oily', 'combination'],
    },
  },
];

export function scoreRetailer(
  retailer: Retailer,
  skinType: SkinType | null,
  concerns: Concern[],
): number {
  if (!retailer.goodFor) return 0;
  let score = 0;
  if (skinType && retailer.goodFor.skinTypes?.includes(skinType)) score += 3;
  for (const c of concerns) {
    if (retailer.goodFor.concerns?.includes(c)) score += 2;
  }
  return score;
}

export function sortRetailersForProfile(
  retailers: Retailer[],
  skinType: SkinType | null,
  concerns: Concern[],
): { retailer: Retailer; matchScore: number }[] {
  return retailers
    .map((retailer) => ({
      retailer,
      matchScore: scoreRetailer(retailer, skinType, concerns),
    }))
    .sort((a, b) => b.matchScore - a.matchScore);
}
