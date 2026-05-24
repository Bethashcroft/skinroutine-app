import type { Product } from '../types';

interface SharePayload {
  n: string;  // name
  b: string;  // brand
  c: string;  // category
  f: { i: string; c: string }[];  // flags: [{ingredient, category}]
  g?: string; // ingredients (optional)
}

export function encodeShareLink(product: Product): string {
  const payload: SharePayload = {
    n: product.name,
    b: product.brand,
    c: product.category,
    f: product.flags.map((f) => ({ i: f.ingredient, c: f.category })),
  };
  if (product.ingredients) payload.g = product.ingredients;

  const json = JSON.stringify(payload);
  const encoded = btoa(unescape(encodeURIComponent(json)));
  return `${window.location.origin}/share?d=${encoded}`;
}

export function decodeShareLink(data: string): {
  name: string;
  brand: string;
  category: string;
  flags: { ingredient: string; category: string }[];
  ingredients?: string;
} | null {
  try {
    const json = decodeURIComponent(escape(atob(data)));
    const p = JSON.parse(json) as SharePayload;
    if (!p.n || !p.b) return null;
    return {
      name: p.n,
      brand: p.b,
      category: p.c || 'other',
      flags: (p.f || []).map((f) => ({ ingredient: f.i, category: f.c })),
      ingredients: p.g,
    };
  } catch {
    return null;
  }
}
