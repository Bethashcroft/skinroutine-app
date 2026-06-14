import { useState, useCallback } from 'react';
import type { Product, FlagCategory } from '../types';
import { FLAG_META } from '../data/ingredient-flags';
import { getCategoryLabel } from '../data/categories';
import { encodeShareLink } from '../lib/share';

const ACCENT_COLORS: Record<string, string> = {
  cleanser: 'bg-sky-400',
  toner: 'bg-violet-400',
  serum: 'bg-sand-500',
  moisturiser: 'bg-emerald-400',
  spf: 'bg-amber-400',
  treatment: 'bg-rose-400',
  other: 'bg-gray-400',
};

const CATEGORY_ORDER: FlagCategory[] = [
  'fragrance',
  'irritant',
  'comedogenic',
  'active',
];

interface Props {
  product: Product;
  isExpanded: boolean;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
  stats?: { timesUsed: number; lastUsed: string | null };
  children?: React.ReactNode;
}

function getExpiryInfo(
  product: Product,
): { label: string; status: 'ok' | 'warning' | 'expired' } | null {
  if (!product.openedAt || !product.paoMonths) return null;

  const opened = new Date(product.openedAt + 'T00:00:00');
  const expires = new Date(opened);
  expires.setMonth(expires.getMonth() + product.paoMonths);

  const now = new Date();
  const daysLeft = Math.ceil(
    (expires.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
  );

  if (daysLeft < 0) return { label: 'Expired', status: 'expired' };
  if (daysLeft <= 30) return { label: `${daysLeft}d left`, status: 'warning' };

  const monthsLeft = Math.floor(daysLeft / 30);
  return { label: `${monthsLeft}mo left`, status: 'ok' };
}

function formatLastUsed(dateStr: string): string {
  const d = new Date(dateStr + 'T12:00:00');
  const now = new Date();
  const diff = Math.floor(
    (now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24),
  );
  if (diff === 0) return 'today';
  if (diff === 1) return 'yesterday';
  if (diff < 7) return `${diff}d ago`;
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

export default function ProductCard({
  product,
  isExpanded,
  onToggle,
  onEdit,
  onDelete,
  stats,
  children,
}: Props) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleShare = useCallback(async () => {
    const url = encodeShareLink(product);
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [product]);
  const flagCounts = new Map<FlagCategory, number>();
  for (const f of product.flags) {
    flagCounts.set(f.category, (flagCounts.get(f.category) ?? 0) + 1);
  }

  const expiry = getExpiryInfo(product);

  return (
    <div
      className={`card overflow-hidden transition-all duration-300
                     ${isExpanded ? 'shadow-xl border-white/40! dark:border-white/15!' : 'hover:-translate-y-0.5'}`}
    >
      <div className="flex">
        {/* Category accent stripe */}
        <div
          className={`w-1 shrink-0 ${ACCENT_COLORS[product.category] ?? 'bg-sand-400'}`}
        />

        <button
          type="button"
          onClick={onToggle}
          className="flex flex-1 items-center gap-2 sm:gap-3 px-4 sm:px-5 py-3.5 sm:py-4 text-left min-w-0"
        >
          <div className="flex-1 min-w-0">
            <span className="block truncate text-[15px] font-semibold text-gray-800 dark:text-gray-100">
              {product.name}
            </span>
            <span className="text-xs text-gray-400 dark:text-gray-500">
              {product.brand} · {getCategoryLabel(product.category)}
            </span>
            <div className="mt-2 flex items-center gap-2 flex-wrap">
              {CATEGORY_ORDER.filter((c) => flagCounts.has(c)).map((cat) => (
                <span
                  key={cat}
                  className="flex items-center gap-1"
                  title={`${flagCounts.get(cat)} ${FLAG_META[cat].label}`}
                >
                  <span className="text-xs">{FLAG_META[cat].emoji}</span>
                  <span className="text-[11px] font-bold text-gray-400 dark:text-gray-500">
                    {flagCounts.get(cat)}
                  </span>
                </span>
              ))}
              {expiry && (
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-bold
                  ${
                    expiry.status === 'expired'
                      ? 'bg-red-500/15 text-red-600 dark:text-red-400 border border-red-300/20 dark:border-red-500/20'
                      : expiry.status === 'warning'
                        ? 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-300/20 dark:border-amber-500/20'
                        : 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-300/20 dark:border-emerald-500/15'
                  }`}
                >
                  {expiry.status === 'expired' ? '⚠️ ' : ''}
                  {expiry.label}
                </span>
              )}
            </div>
          </div>

          <svg
            className={`h-4 w-4 shrink-0 text-gray-300 dark:text-gray-600 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
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
        </button>
      </div>

      {isExpanded && (
        <div className="border-t border-white/15 dark:border-white/8 px-5 py-4 sm:py-5">
          {/* Usage stats & expiry bar */}
          {(stats || product.notes || expiry) && (
            <div className="mb-4 space-y-2.5">
              {stats && stats.timesUsed > 0 && (
                <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                  <span className="flex items-center gap-1">
                    <span className="text-sm">📊</span>
                    Used{' '}
                    <strong className="text-gray-700 dark:text-gray-200">
                      {stats.timesUsed}
                    </strong>{' '}
                    time{stats.timesUsed !== 1 ? 's' : ''}
                  </span>
                  {stats.lastUsed && (
                    <span className="flex items-center gap-1">
                      · Last used{' '}
                      <strong className="text-gray-700 dark:text-gray-200">
                        {formatLastUsed(stats.lastUsed)}
                      </strong>
                    </span>
                  )}
                </div>
              )}
              {expiry && (
                <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                  <span className="text-sm">🧴</span>
                  Opened{' '}
                  {new Date(product.openedAt! + 'T00:00:00').toLocaleDateString(
                    'en-GB',
                    { day: 'numeric', month: 'short', year: 'numeric' },
                  )}
                  <span className="mx-1">·</span>
                  {product.paoMonths}M PAO
                  <span className="mx-1">·</span>
                  <span
                    className={
                      expiry.status === 'expired'
                        ? 'font-bold text-red-500 dark:text-red-400'
                        : expiry.status === 'warning'
                          ? 'font-bold text-amber-600 dark:text-amber-400'
                          : ''
                    }
                  >
                    {expiry.label}
                  </span>
                </div>
              )}
              {product.notes && (
                <p
                  className="inline-block rounded-lg bg-white/25 dark:bg-white/5 backdrop-blur
                              px-2.5 py-1.5 text-xs leading-relaxed text-gray-500 dark:text-gray-400 italic
                              border border-white/15 dark:border-white/5"
                >
                  "{product.notes}"
                </p>
              )}
            </div>
          )}

          {children}

          <div className="mt-4 sm:mt-5 flex justify-end gap-2 border-t border-white/15 dark:border-white/8 pt-3 sm:pt-4">
            <button
              type="button"
              onClick={handleShare}
              className="btn-ghost px-4! py-2! text-xs! mr-auto"
            >
              {copied ? '✓ Link copied' : 'Share'}
            </button>
            <button
              type="button"
              onClick={onEdit}
              className="btn-ghost px-4! py-2! text-xs!"
            >
              Edit
            </button>
            {confirmDelete ? (
              <div className="flex items-center gap-2">
                <span className="text-xs text-red-500 dark:text-red-400">
                  Sure?
                </span>
                <button
                  type="button"
                  onClick={onDelete}
                  className="rounded-xl bg-red-500 px-3 py-2 text-xs font-semibold text-white transition-all hover:bg-red-600 shadow-md"
                >
                  Yes, delete
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmDelete(false)}
                  className="btn-ghost px-3! py-2! text-xs!"
                >
                  No
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmDelete(true)}
                className="rounded-xl bg-white/20 backdrop-blur border border-red-300/30 dark:border-red-500/20
                           px-4 py-2 text-xs font-semibold text-red-500 dark:text-red-400
                           transition-all hover:bg-red-50/50 dark:hover:bg-red-950/20"
              >
                Delete
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
