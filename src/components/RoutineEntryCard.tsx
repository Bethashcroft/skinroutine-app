import { useState } from 'react';
import type { RoutineEntry, Product } from '../types';

const RATING_EMOJI: Record<number, string> = {
  1: '😣',
  2: '😕',
  3: '😐',
  4: '🙂',
  5: '✨',
};

interface Props {
  entry: RoutineEntry;
  products: Product[];
  onEdit: () => void;
  onDelete: () => void;
}

export default function RoutineEntryCard({
  entry,
  products,
  onEdit,
  onDelete,
}: Props) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const usedProducts = entry.productIds
    .map((id) => products.find((p) => p.id === id))
    .filter(Boolean) as Product[];

  return (
    <div className="card overflow-hidden transition-all duration-300 hover:-translate-y-0.5">
      <div className="flex items-center justify-between px-4 sm:px-5 py-3 sm:py-3.5 border-b border-white/15 dark:border-white/8">
        <span
          className={`rounded-full px-3 py-1 text-xs font-bold backdrop-blur
          ${
            entry.session === 'AM'
              ? 'bg-sand-400/20 text-sand-700 border border-sand-400/20 dark:bg-sand-400/10 dark:text-sand-300 dark:border-sand-500/15'
              : 'bg-violet-400/15 text-violet-700 border border-violet-300/20 dark:bg-violet-400/10 dark:text-violet-300 dark:border-violet-500/15'
          }`}
        >
          {entry.session === 'AM' ? '☀️ Morning' : '🌙 Evening'}
        </span>
        <div className="flex items-center gap-1.5">
          <span
            className="text-2xl"
            title={`Skin rating: ${entry.skinRating}/5`}
          >
            {RATING_EMOJI[entry.skinRating]}
          </span>
          <span className="text-xs font-bold text-gray-400 dark:text-gray-500">
            {entry.skinRating}/5
          </span>
        </div>
      </div>

      <div className="px-4 sm:px-5 py-3.5 sm:py-4">
        <span className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-gray-300 dark:text-gray-600">
          Products used
        </span>
        <div className="flex flex-wrap gap-1.5">
          {usedProducts.map((p) => (
            <span
              key={p.id}
              className="rounded-full bg-white/40 dark:bg-white/8 backdrop-blur
                         px-2.5 py-1 text-xs font-medium text-sand-700 dark:text-sand-300
                         border border-white/25 dark:border-white/8"
            >
              {p.name}
            </span>
          ))}
          {usedProducts.length === 0 && (
            <span className="text-sm italic text-gray-300 dark:text-gray-600">
              Products removed from library
            </span>
          )}
        </div>

        {entry.notes && (
          <p
            className="mt-3 rounded-xl bg-white/25 dark:bg-white/5 backdrop-blur
                        border border-white/15 dark:border-white/5
                        px-3.5 py-2.5 text-sm leading-relaxed text-gray-500 dark:text-gray-400 italic"
          >
            "{entry.notes}"
          </p>
        )}
      </div>

      <div className="flex justify-end gap-2 border-t border-white/15 dark:border-white/8 px-4 sm:px-5 py-2.5 sm:py-3">
        <button
          type="button"
          onClick={onEdit}
          className="btn-ghost px-4! py-1.5! text-xs!"
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
              className="rounded-xl bg-red-500 px-3 py-1.5 text-xs font-semibold text-white transition-all hover:bg-red-600 shadow-md"
            >
              Yes
            </button>
            <button
              type="button"
              onClick={() => setConfirmDelete(false)}
              className="btn-ghost px-3! py-1.5! text-xs!"
            >
              No
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setConfirmDelete(true)}
            className="rounded-xl bg-white/20 backdrop-blur border border-red-300/30 dark:border-red-500/20
                       px-4 py-1.5 text-xs font-semibold text-red-500 dark:text-red-400
                       transition-all hover:bg-red-50/50 dark:hover:bg-red-950/20"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
}
