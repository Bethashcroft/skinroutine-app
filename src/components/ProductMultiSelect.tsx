import { Link } from 'react-router-dom';
import type { Product } from '../types';
import { getCategoryLabel } from '../data/categories';

interface Props {
  products: Product[];
  selected: string[];
  onChange: (ids: string[]) => void;
}

const BUILT_IN_ORDER = [
  'cleanser',
  'toner',
  'serum',
  'moisturiser',
  'spf',
  'treatment',
  'other',
];

export default function ProductMultiSelect({
  products,
  selected,
  onChange,
}: Props) {
  function toggle(id: string) {
    onChange(
      selected.includes(id)
        ? selected.filter((s) => s !== id)
        : [...selected, id],
    );
  }

  if (products.length === 0) {
    return (
      <div
        className="flex flex-col items-center rounded-2xl border-2 border-dashed border-white/25 dark:border-white/10
                      px-4 py-6 text-center backdrop-blur"
      >
        <span className="mb-2 text-xl opacity-40">🧴</span>
        <p className="text-sm text-gray-400 dark:text-gray-500">
          Your product library is empty
        </p>
        <Link to="/products" className="btn-primary mt-3">
          Add your first product &rarr;
        </Link>
      </div>
    );
  }

  const grouped = new Map<string, Product[]>();
  for (const p of products) {
    const list = grouped.get(p.category) ?? [];
    list.push(p);
    grouped.set(p.category, list);
  }

  const allCategories = [
    ...BUILT_IN_ORDER.filter((c) => grouped.has(c)),
    ...[...grouped.keys()].filter((c) => !BUILT_IN_ORDER.includes(c)),
  ];

  return (
    <div className="space-y-3">
      {allCategories.map((cat) => (
        <div key={cat}>
          <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-gray-300 dark:text-gray-600">
            {getCategoryLabel(cat)}
          </span>
          <div className="flex flex-wrap gap-2">
            {grouped.get(cat)!.map((product) => {
              const isSelected = selected.includes(product.id);
              return (
                <button
                  key={product.id}
                  type="button"
                  onClick={() => toggle(product.id)}
                  className={`rounded-xl px-3 sm:px-3.5 py-2.5 sm:py-2 text-sm font-medium backdrop-blur transition-all duration-200 border
                    ${
                      isSelected
                        ? 'bg-sand-600 text-white border-sand-600 shadow-lg shadow-sand-500/25 -translate-y-0.5'
                        : 'bg-white/25 text-gray-600 border-white/25 hover:bg-white/40 hover:-translate-y-0.5 hover:shadow-md dark:bg-white/5 dark:text-gray-300 dark:border-white/10 dark:hover:bg-white/10'
                    }`}
                >
                  {product.name}
                  <span
                    className={`ml-1.5 text-xs ${isSelected ? 'text-sand-200' : 'text-gray-400 dark:text-gray-500'}`}
                  >
                    {product.brand}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
