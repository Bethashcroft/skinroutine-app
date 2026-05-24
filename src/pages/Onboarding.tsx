import { useState, useMemo } from 'react';
import BUILT_IN_PRODUCTS from '../data/built-in-products';
import { detectFlagsFromIngredients } from '../data/product-search';
import { flagOptionsToFlags } from '../data/ingredient-flags';
import { SKIN_TYPES, CONCERNS, getRecommendations } from '../data/skin-recommendations';
import type { SkinProfile, SkinType, Concern } from '../types';
import type { ProductInput } from '../hooks/useProducts';

interface Props {
  onComplete: (profile: SkinProfile) => void | Promise<void>;
  addProduct: (input: ProductInput) => void;
}

export default function Onboarding({ onComplete, addProduct }: Props) {
  const [step, setStep] = useState(0);
  const [skinType, setSkinType] = useState<SkinType | null>(null);
  const [concerns, setConcerns] = useState<Set<Concern>>(new Set());
  const [selectedProducts, setSelectedProducts] = useState<Set<number>>(new Set());

  const toggleConcern = (c: Concern) => {
    setConcerns((prev) => {
      const next = new Set(prev);
      if (next.has(c)) next.delete(c);
      else next.add(c);
      return next;
    });
  };

  const suggestions = useMemo(
    () => getRecommendations(skinType, [...concerns]),
    [concerns, skinType],
  );

  const toggleProduct = (idx: number) => {
    setSelectedProducts((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };

  async function handleFinish() {
    for (const idx of selectedProducts) {
      const p = BUILT_IN_PRODUCTS[idx];
      if (!p) continue;
      const flagKeys = detectFlagsFromIngredients(p.ingredients);
      const flags = flagOptionsToFlags(flagKeys);
      addProduct({
        name: p.name,
        brand: p.brand,
        category: p.category,
        flags,
        ingredients: p.ingredients,
      });
    }
    await onComplete({ skinType: skinType ?? 'normal', concerns: [...concerns] });
  }

  return (
    <div className="flex flex-col items-center px-4 pt-8 sm:pt-14 pb-12 max-w-lg mx-auto">
      {/* Progress */}
      <div className="flex gap-2 mb-8 w-full max-w-xs">
        {[0, 1, 2].map((i) => (
          <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-500 ${
            i <= step
              ? 'bg-sand-500 dark:bg-sand-400'
              : 'bg-white/20 dark:bg-white/8'
          }`} />
        ))}
      </div>

      {/* Step 0: Skin type */}
      {step === 0 && (
        <div className="w-full text-center">
          <h2 className="text-2xl font-extrabold text-gray-800 dark:text-gray-100 tracking-tight">
            What's your skin type?
          </h2>
          <p className="mt-2 text-sm text-gray-400 dark:text-gray-500">
            This helps us suggest the right products
          </p>
          <div className="mt-8 space-y-2">
            {SKIN_TYPES.map((t) => (
              <button
                key={t.value}
                type="button"
                onClick={() => setSkinType(t.value)}
                className={`w-full text-left rounded-xl px-4 py-3.5 transition-all duration-200 border
                  ${skinType === t.value
                    ? 'bg-sand-500/15 border-sand-400/30 dark:bg-sand-400/10 dark:border-sand-500/20 shadow-md'
                    : 'bg-white/20 dark:bg-white/4 border-white/20 dark:border-white/8 hover:bg-white/30 dark:hover:bg-white/6'
                  }`}
              >
                <span className={`text-sm font-bold ${
                  skinType === t.value ? 'text-sand-700 dark:text-sand-300' : 'text-gray-700 dark:text-gray-200'
                }`}>{t.label}</span>
                <span className="block mt-0.5 text-xs text-gray-400 dark:text-gray-500">{t.desc}</span>
              </button>
            ))}
          </div>
          <button
            onClick={() => setStep(1)}
            disabled={!skinType}
            className="btn-primary mt-8 w-full disabled:opacity-40"
          >
            Continue
          </button>
        </div>
      )}

      {/* Step 1: Concerns */}
      {step === 1 && (
        <div className="w-full text-center">
          <h2 className="text-2xl font-extrabold text-gray-800 dark:text-gray-100 tracking-tight">
            Any skin concerns?
          </h2>
          <p className="mt-2 text-sm text-gray-400 dark:text-gray-500">
            Select all that apply — we'll tailor product suggestions
          </p>
          <div className="mt-8 grid grid-cols-2 gap-2">
            {CONCERNS.map((c) => {
              const active = concerns.has(c.value);
              return (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => toggleConcern(c.value)}
                  className={`rounded-xl px-3 py-3.5 text-left transition-all duration-200 border
                    ${active
                      ? 'bg-sand-500/15 border-sand-400/30 dark:bg-sand-400/10 dark:border-sand-500/20 shadow-md'
                      : 'bg-white/20 dark:bg-white/4 border-white/20 dark:border-white/8 hover:bg-white/30 dark:hover:bg-white/6'
                    }`}
                >
                  <span className="text-lg">{c.icon}</span>
                  <span className={`block mt-1 text-xs font-bold ${
                    active ? 'text-sand-700 dark:text-sand-300' : 'text-gray-700 dark:text-gray-200'
                  }`}>{c.label}</span>
                </button>
              );
            })}
          </div>
          <div className="mt-8 flex gap-2">
            <button onClick={() => setStep(0)} className="btn-ghost flex-1">Back</button>
            <button onClick={() => setStep(2)} className="btn-primary flex-1">
              {concerns.size > 0 ? 'Continue' : 'Skip'}
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Product suggestions */}
      {step === 2 && (
        <div className="w-full text-center">
          <h2 className="text-2xl font-extrabold text-gray-800 dark:text-gray-100 tracking-tight">
            Products for you
          </h2>
          <p className="mt-2 text-sm text-gray-400 dark:text-gray-500">
            Tap to select products you use or want to track
          </p>
          <div className="mt-8 space-y-2 text-left">
            {suggestions.map((p, i) => {
              const globalIdx = BUILT_IN_PRODUCTS.indexOf(p);
              const active = selectedProducts.has(globalIdx);
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => toggleProduct(globalIdx)}
                  className={`w-full flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-200 border
                    ${active
                      ? 'bg-sand-500/15 border-sand-400/30 dark:bg-sand-400/10 dark:border-sand-500/20 shadow-md'
                      : 'bg-white/20 dark:bg-white/4 border-white/20 dark:border-white/8 hover:bg-white/30 dark:hover:bg-white/6'
                    }`}
                >
                  <div className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-all ${
                    active
                      ? 'bg-sand-500 border-sand-500 dark:bg-sand-400 dark:border-sand-400'
                      : 'border-gray-300 dark:border-gray-600'
                  }`}>
                    {active && (
                      <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <div className="min-w-0">
                    <span className={`block text-sm font-semibold truncate ${
                      active ? 'text-sand-700 dark:text-sand-300' : 'text-gray-700 dark:text-gray-200'
                    }`}>{p.name}</span>
                    <span className="block text-xs text-gray-400 dark:text-gray-500">{p.brand}</span>
                  </div>
                </button>
              );
            })}
          </div>
          <div className="mt-8 flex gap-2">
            <button onClick={() => setStep(1)} className="btn-ghost flex-1">Back</button>
            <button onClick={handleFinish} className="btn-primary flex-1">
              {selectedProducts.size > 0
                ? `Add ${selectedProducts.size} product${selectedProducts.size !== 1 ? 's' : ''}`
                : 'Skip for now'
              }
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
