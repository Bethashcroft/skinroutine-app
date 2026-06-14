import type { ConflictMatch } from '../data/conflicts';
import type { Product } from '../types';

function ProductPill({ product }: { product: Product }) {
  return (
    <span
      className="inline-flex max-w-full items-center rounded-full bg-white/55 dark:bg-white/12
                 border border-white/40 dark:border-white/15
                 px-2.5 py-1 text-xs font-medium text-gray-800 dark:text-gray-100 truncate"
      title={
        product.brand ? `${product.name} · ${product.brand}` : product.name
      }
    >
      {product.name}
    </span>
  );
}

function ConflictItem({ match }: { match: ConflictMatch }) {
  const isWarning = match.rule.severity === 'warning';

  return (
    <div
      className={`rounded-2xl px-4 py-3.5 backdrop-blur border ${
        isWarning
          ? 'bg-red-500/8 border-red-300/25 dark:bg-red-950/25 dark:border-red-500/20'
          : 'bg-amber-500/8 border-amber-300/25 dark:bg-amber-950/20 dark:border-amber-500/20'
      }`}
    >
      <p
        className={`text-[11px] font-bold uppercase tracking-wide ${
          isWarning
            ? 'text-red-600 dark:text-red-400'
            : 'text-amber-700 dark:text-amber-400'
        }`}
      >
        {isWarning ? 'Warning' : 'Heads up'}
      </p>
      <p
        className={`mt-1 text-sm leading-relaxed ${
          isWarning
            ? 'text-red-900/90 dark:text-red-100/90'
            : 'text-amber-900/90 dark:text-amber-100/90'
        }`}
      >
        {match.rule.message}
      </p>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        {match.productsA.map((p) => (
          <ProductPill key={`a-${p.id}`} product={p} />
        ))}
        <span className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 px-0.5">
          and
        </span>
        {match.productsB.map((p) => (
          <ProductPill key={`b-${p.id}`} product={p} />
        ))}
      </div>
    </div>
  );
}

interface Props {
  conflicts: ConflictMatch[];
  title?: string;
  subtitle?: string;
}

export default function LibraryConflictPanel({
  conflicts,
  title = 'Ingredient conflicts',
  subtitle = 'These flagged products in your library may not work well in the same routine',
}: Props) {
  if (conflicts.length === 0) return null;

  return (
    <section className="card-solid noise overflow-hidden">
      <div className="px-5 sm:px-6 py-4 border-b border-white/15 dark:border-white/8">
        <h3 className="font-bold text-gray-800 dark:text-gray-100 tracking-tight">
          {title}
        </h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
          {subtitle}
        </p>
      </div>
      <div className="px-5 sm:px-6 py-4 space-y-3">
        {conflicts.map((c) => (
          <ConflictItem key={c.rule.id} match={c} />
        ))}
      </div>
    </section>
  );
}
