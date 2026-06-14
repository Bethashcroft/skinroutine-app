import { useState, useMemo } from 'react';
import type { Product, FlagCategory } from '../types';
import { FLAG_META } from '../data/ingredient-flags';
import { findFlaggedSubstrings } from '../data/product-search';

const CATEGORY_ORDER: FlagCategory[] = [
  'fragrance',
  'irritant',
  'comedogenic',
  'active',
];

const ACCENT_BORDER: Record<FlagCategory, string> = {
  fragrance: 'border-l-red-400 dark:border-l-red-500',
  irritant: 'border-l-orange-400 dark:border-l-orange-500',
  comedogenic: 'border-l-yellow-400 dark:border-l-yellow-500',
  active: 'border-l-blue-400 dark:border-l-blue-500',
};

const TEXT_COLOR: Record<FlagCategory, string> = {
  fragrance: 'text-red-700 dark:text-red-400',
  irritant: 'text-orange-700 dark:text-orange-400',
  comedogenic: 'text-yellow-700 dark:text-yellow-500',
  active: 'text-blue-700 dark:text-blue-400',
};

function HighlightedIngredients({ text }: { text: string }) {
  const spans = useMemo(() => {
    const matches = findFlaggedSubstrings(text);
    if (matches.length === 0) return [{ text, highlighted: false }];

    const result: { text: string; highlighted: boolean }[] = [];
    let cursor = 0;

    // Merge overlapping ranges
    const merged: { start: number; end: number }[] = [];
    for (const m of matches) {
      const last = merged[merged.length - 1];
      if (last && m.start <= last.end) {
        last.end = Math.max(last.end, m.end);
      } else {
        merged.push({ start: m.start, end: m.end });
      }
    }

    for (const { start, end } of merged) {
      if (cursor < start) {
        result.push({ text: text.slice(cursor, start), highlighted: false });
      }
      result.push({ text: text.slice(start, end), highlighted: true });
      cursor = end;
    }
    if (cursor < text.length) {
      result.push({ text: text.slice(cursor), highlighted: false });
    }

    return result;
  }, [text]);

  return (
    <p className="text-xs leading-relaxed text-gray-600 dark:text-gray-400">
      {spans.map((s, i) =>
        s.highlighted ? (
          <mark
            key={i}
            className="rounded bg-sand-300/50 dark:bg-sand-500/30 px-0.5
                                   text-sand-800 dark:text-sand-200 font-semibold"
          >
            {s.text}
          </mark>
        ) : (
          <span key={i}>{s.text}</span>
        ),
      )}
    </p>
  );
}

export default function IngredientAnalysis({ product }: { product: Product }) {
  const [showRawIngredients, setShowRawIngredients] = useState(false);

  const grouped = new Map<FlagCategory, string[]>();
  for (const flag of product.flags) {
    const list = grouped.get(flag.category) ?? [];
    list.push(flag.ingredient);
    grouped.set(flag.category, list);
  }

  if (product.flags.length === 0 && !product.ingredients) {
    return (
      <div
        className="flex items-center gap-2 rounded-xl bg-emerald-500/10 backdrop-blur
                      border border-emerald-400/20 dark:border-emerald-500/10
                      px-3.5 py-2.5 text-sm text-emerald-700 dark:text-emerald-400"
      >
        <span className="text-base">✅</span>
        No flagged ingredients — looking clean!
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {CATEGORY_ORDER.filter((c) => grouped.has(c)).map((cat) => {
        const meta = FLAG_META[cat];
        const items = grouped.get(cat)!;
        return (
          <div
            key={cat}
            className={`flex items-start gap-2.5 rounded-xl border-l-4 px-3.5 py-2.5 text-sm backdrop-blur
                        bg-white/20 border border-white/15
                        dark:bg-white/5 dark:border-white/8
                        ${ACCENT_BORDER[cat]} ${TEXT_COLOR[cat]}`}
          >
            <span className="mt-0.5 shrink-0 text-base">{meta.emoji}</span>
            <div>
              <span className="font-semibold">{meta.label}</span>
              <span className="mx-1.5 opacity-30">—</span>
              <span className="font-medium">{items.join(', ')}</span>
            </div>
          </div>
        );
      })}

      {product.ingredients && (
        <div className="pt-1">
          <button
            type="button"
            onClick={() => setShowRawIngredients(!showRawIngredients)}
            className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 dark:text-gray-500
                       hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <svg
              className={`h-3 w-3 transition-transform duration-200 ${showRawIngredients ? 'rotate-180' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 9l-7 7-7-7"
              />
            </svg>
            Full ingredients
          </button>

          {showRawIngredients && (
            <div
              className="mt-2 rounded-xl bg-white/15 dark:bg-white/5 backdrop-blur
                            border border-white/15 dark:border-white/8 px-3.5 py-3"
            >
              <HighlightedIngredients text={product.ingredients} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
