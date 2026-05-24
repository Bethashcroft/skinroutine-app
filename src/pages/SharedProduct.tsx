import { useMemo, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import type { IngredientFlag, FlagCategory } from '../types';
import { useProducts } from '../hooks/useProducts';
import { decodeShareLink } from '../lib/share';
import { FLAG_META } from '../data/ingredient-flags';

const CATEGORY_ORDER: FlagCategory[] = ['fragrance', 'irritant', 'comedogenic', 'active'];

export default function SharedProduct() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { products, addProduct } = useProducts();
  const [added, setAdded] = useState(false);

  const data = useMemo(() => {
    const d = params.get('d');
    return d ? decodeShareLink(d) : null;
  }, [params]);

  if (!data) {
    return (
      <div className="flex flex-col items-center py-20 text-center">
        <span className="text-4xl mb-4">🔗</span>
        <h2 className="text-lg font-bold text-gray-700 dark:text-gray-200">Invalid share link</h2>
        <p className="mt-1 text-sm text-gray-400 dark:text-gray-500">
          This link doesn't contain valid product data
        </p>
        <button onClick={() => navigate('/products')} className="btn-primary mt-6">
          Go to Product Library
        </button>
      </div>
    );
  }

  const alreadyExists = products.some(
    (p) => p.name.toLowerCase() === data.name.toLowerCase() &&
           p.brand.toLowerCase() === data.brand.toLowerCase(),
  );

  const grouped = new Map<FlagCategory, string[]>();
  for (const flag of data.flags) {
    const cat = flag.category as FlagCategory;
    const list = grouped.get(cat) ?? [];
    list.push(flag.ingredient);
    grouped.set(cat, list);
  }

  function handleImport() {
    addProduct({
      name: data!.name,
      brand: data!.brand,
      category: data!.category as any,
      flags: data!.flags as IngredientFlag[],
      ingredients: data!.ingredients,
    });
    setAdded(true);
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-extrabold text-gray-800 dark:text-gray-100 tracking-tight">
          Shared product
        </h2>
        <p className="mt-0.5 text-sm text-gray-400 dark:text-gray-500">
          Someone shared a product with you
        </p>
      </div>

      <div className="card-solid noise p-5 sm:p-6 space-y-4">
        <div>
          <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">{data.name}</h3>
          <p className="text-sm text-gray-400 dark:text-gray-500">{data.brand}</p>
        </div>

        <div className="flex items-center gap-2">
          <span className="rounded-full bg-white/40 dark:bg-white/8 backdrop-blur
                           px-2.5 py-0.5 text-xs font-bold text-sand-600 dark:text-sand-400
                           border border-white/20 dark:border-white/8 capitalize">
            {data.category}
          </span>
          {data.flags.length > 0 && (
            <span className="text-xs text-gray-400 dark:text-gray-500">
              · {data.flags.length} flag{data.flags.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>

        {CATEGORY_ORDER.filter((c) => grouped.has(c)).map((cat) => {
          const meta = FLAG_META[cat];
          const items = grouped.get(cat)!;
          return (
            <div
              key={cat}
              className="flex items-start gap-2.5 rounded-xl border-l-4 px-3.5 py-2.5 text-sm backdrop-blur
                          bg-white/20 border border-white/15
                          dark:bg-white/5 dark:border-white/8"
            >
              <span className="mt-0.5 shrink-0 text-base">{meta.emoji}</span>
              <div>
                <span className="font-semibold text-gray-700 dark:text-gray-200">{meta.label}</span>
                <span className="mx-1.5 opacity-30">—</span>
                <span className="font-medium text-gray-600 dark:text-gray-400">{items.join(', ')}</span>
              </div>
            </div>
          );
        })}

        {data.ingredients && (
          <div className="rounded-xl bg-white/15 dark:bg-white/5 backdrop-blur
                          border border-white/15 dark:border-white/8 px-3.5 py-3">
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">Full ingredients</p>
            <p className="text-xs leading-relaxed text-gray-600 dark:text-gray-400">
              {data.ingredients}
            </p>
          </div>
        )}

        <div className="flex gap-3 pt-2">
          {added ? (
            <div className="flex items-center gap-3 w-full">
              <span className="flex items-center gap-2 text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                <span>✓</span> Added to your library
              </span>
              <button onClick={() => navigate('/products')} className="btn-primary ml-auto">
                View library
              </button>
            </div>
          ) : alreadyExists ? (
            <div className="flex items-center gap-3 w-full">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                You already have this product
              </span>
              <button onClick={() => navigate('/products')} className="btn-ghost ml-auto">
                View library
              </button>
            </div>
          ) : (
            <>
              <button onClick={handleImport} className="btn-primary">
                Add to my library
              </button>
              <button onClick={() => navigate('/products')} className="btn-ghost">
                Skip
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
