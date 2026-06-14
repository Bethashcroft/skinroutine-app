import type { SkinRating } from '../types';

const RATINGS: { value: SkinRating; emoji: string; label: string }[] = [
  { value: 1, emoji: '😣', label: 'Terrible' },
  { value: 2, emoji: '😕', label: 'Bad' },
  { value: 3, emoji: '😐', label: 'Okay' },
  { value: 4, emoji: '🙂', label: 'Good' },
  { value: 5, emoji: '✨', label: 'Great' },
];

interface Props {
  value: SkinRating | null;
  onChange: (rating: SkinRating) => void;
}

export default function SkinRatingPicker({ value, onChange }: Props) {
  return (
    <div className="flex gap-2">
      {RATINGS.map((r) => (
        <button
          key={r.value}
          type="button"
          onClick={() => onChange(r.value)}
          title={r.label}
          className={`flex flex-col items-center rounded-xl px-3.5 py-2.5 text-center transition-all duration-300 backdrop-blur
            ${
              value === r.value
                ? 'bg-white/60 shadow-lg ring-2 ring-sand-400 scale-110 -translate-y-1 dark:bg-white/15 dark:ring-sand-500 dark:shadow-sand-500/10'
                : 'bg-white/25 border border-white/20 hover:bg-white/40 hover:shadow-md hover:-translate-y-0.5 dark:bg-white/5 dark:border-white/8 dark:hover:bg-white/10'
            }`}
        >
          <span className="text-xl">{r.emoji}</span>
          <span
            className={`mt-1 text-[10px] font-bold ${
              value === r.value
                ? 'text-sand-700 dark:text-sand-400'
                : 'text-gray-400 dark:text-gray-500'
            }`}
          >
            {r.label}
          </span>
        </button>
      ))}
    </div>
  );
}
