import { useState, useMemo } from 'react';
import type { Product, SkinRating } from '../types';
import SkinRatingPicker from './SkinRatingPicker';
import ProductMultiSelect from './ProductMultiSelect';
import {
  detectConflicts,
  detectExpiryWarnings,
  type ConflictMatch,
} from '../data/conflicts';

interface Props {
  products: Product[];
  session: 'AM' | 'PM';
  onSubmit: (data: {
    productIds: string[];
    skinRating: SkinRating;
    notes: string;
  }) => void;
  onCancel: () => void;
  initial?: { productIds: string[]; skinRating: SkinRating; notes: string };
}

export default function RoutineEntryForm({
  products,
  session,
  onSubmit,
  onCancel,
  initial,
}: Props) {
  const [productIds, setProductIds] = useState<string[]>(
    initial?.productIds ?? [],
  );
  const [skinRating, setSkinRating] = useState<SkinRating | null>(
    initial?.skinRating ?? null,
  );
  const [notes, setNotes] = useState(initial?.notes ?? '');

  const selectedProducts = useMemo(
    () => products.filter((p) => productIds.includes(p.id)),
    [products, productIds],
  );

  const conflicts: ConflictMatch[] = useMemo(
    () => detectConflicts(selectedProducts),
    [selectedProducts],
  );

  const expiredProducts = useMemo(
    () => detectExpiryWarnings(selectedProducts),
    [selectedProducts],
  );

  const canSubmit = productIds.length > 0 && skinRating !== null;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    onSubmit({ productIds, skinRating: skinRating!, notes });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="flex items-center gap-2">
        <span
          className={`rounded-full px-3.5 py-1 text-xs font-bold backdrop-blur
          ${
            session === 'AM'
              ? 'bg-sand-400/20 text-sand-700 border border-sand-400/20 dark:bg-sand-400/10 dark:text-sand-300 dark:border-sand-500/15'
              : 'bg-violet-400/15 text-violet-700 border border-violet-300/20 dark:bg-violet-400/10 dark:text-violet-300 dark:border-violet-500/15'
          }`}
        >
          {session === 'AM' ? '☀️ Morning' : '🌙 Evening'}
        </span>
      </div>

      <div>
        <label className="mb-2.5 block text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
          What products did you use?
        </label>
        <ProductMultiSelect
          products={products}
          selected={productIds}
          onChange={setProductIds}
        />
      </div>

      {/* Conflict warnings */}
      {conflicts.length > 0 && (
        <div className="space-y-2">
          {conflicts.map((c) => (
            <div
              key={c.rule.id}
              className={`rounded-xl px-3.5 py-2.5 text-xs backdrop-blur border ${
                c.rule.severity === 'warning'
                  ? 'bg-red-500/10 border-red-400/20 dark:border-red-500/15'
                  : 'bg-amber-500/10 border-amber-400/20 dark:border-amber-500/15'
              }`}
            >
              <span
                className={`font-bold ${
                  c.rule.severity === 'warning'
                    ? 'text-red-600 dark:text-red-400'
                    : 'text-amber-700 dark:text-amber-400'
                }`}
              >
                {c.rule.severity === 'warning' ? '⚠️ Warning' : '⚡ Heads up'}
              </span>
              <p
                className={`mt-0.5 leading-relaxed ${
                  c.rule.severity === 'warning'
                    ? 'text-red-700/80 dark:text-red-300/80'
                    : 'text-amber-700/80 dark:text-amber-300/80'
                }`}
              >
                {c.rule.message}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Expired product warnings */}
      {expiredProducts.length > 0 && (
        <div className="rounded-xl bg-red-500/10 backdrop-blur border border-red-400/20 dark:border-red-500/15 px-3.5 py-2.5 text-xs">
          <span className="font-bold text-red-600 dark:text-red-400">
            🚫 Expired products
          </span>
          <p className="mt-0.5 text-red-700/80 dark:text-red-300/80 leading-relaxed">
            {expiredProducts.map((p) => p.name).join(', ')}{' '}
            {expiredProducts.length === 1 ? 'has' : 'have'} passed
            {expiredProducts.length === 1 ? ' its' : ' their'} PAO expiry date.
            Consider replacing before use.
          </p>
        </div>
      )}

      <div>
        <label className="mb-2.5 block text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
          How's your skin feeling?
        </label>
        <SkinRatingPicker value={skinRating} onChange={setSkinRating} />
      </div>

      <label className="block">
        <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
          Notes
        </span>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          placeholder="Anything to note — dryness, breakouts, how your skin felt today…"
          className="glass-input w-full px-3.5 py-2.5 leading-relaxed"
        />
      </label>

      <div className="flex justify-end gap-2 pt-1">
        <button type="button" onClick={onCancel} className="btn-ghost">
          Cancel
        </button>
        <button type="submit" disabled={!canSubmit} className="btn-primary">
          {initial ? 'Save changes' : 'Log routine'}
        </button>
      </div>
    </form>
  );
}
