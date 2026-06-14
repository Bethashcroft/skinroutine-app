import type { Product } from '../types';

interface SharePayload {
  n: string; // name
  b: string; // brand
  c: string; // category
  f: { i: string; c: string }[]; // flags: [{ingredient, category}]
  g?: string; // ingredients (optional)
}

function utf8ToBase64(str: string): string {
  const bytes = new TextEncoder().encode(str);
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary);
}

function base64ToUtf8(b64: string): string {
  const binary = atob(b64);
  const bytes = Uint8Array.from(binary, (ch) => ch.charCodeAt(0));
  return new TextDecoder().decode(bytes);
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
  const encoded = utf8ToBase64(json);
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
    const json = base64ToUtf8(data);
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
