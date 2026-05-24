import { FLAG_META, getPickerOptionsByCategory } from '../data/ingredient-flags';
import type { FlagCategory } from '../types';

const TOGGLE_STYLES: Record<FlagCategory, { active: string; inactive: string }> = {
  fragrance: {
    active: 'bg-red-500/15 text-red-700 border-red-400/30 shadow-md dark:bg-red-500/10 dark:text-red-300 dark:border-red-500/20',
    inactive: 'bg-white/20 text-gray-500 border-white/20 hover:bg-red-50/30 hover:text-red-700 hover:border-red-300/30 dark:bg-white/5 dark:text-gray-400 dark:border-white/8 dark:hover:bg-red-950/15 dark:hover:text-red-400',
  },
  irritant: {
    active: 'bg-orange-500/15 text-orange-700 border-orange-400/30 shadow-md dark:bg-orange-500/10 dark:text-orange-300 dark:border-orange-500/20',
    inactive: 'bg-white/20 text-gray-500 border-white/20 hover:bg-orange-50/30 hover:text-orange-700 hover:border-orange-300/30 dark:bg-white/5 dark:text-gray-400 dark:border-white/8 dark:hover:bg-orange-950/15 dark:hover:text-orange-400',
  },
  comedogenic: {
    active: 'bg-yellow-500/15 text-yellow-700 border-yellow-400/30 shadow-md dark:bg-yellow-500/10 dark:text-yellow-300 dark:border-yellow-500/20',
    inactive: 'bg-white/20 text-gray-500 border-white/20 hover:bg-yellow-50/30 hover:text-yellow-700 hover:border-yellow-300/30 dark:bg-white/5 dark:text-gray-400 dark:border-white/8 dark:hover:bg-yellow-950/15 dark:hover:text-yellow-400',
  },
  active: {
    active: 'bg-blue-500/15 text-blue-700 border-blue-400/30 shadow-md dark:bg-blue-500/10 dark:text-blue-300 dark:border-blue-500/20',
    inactive: 'bg-white/20 text-gray-500 border-white/20 hover:bg-blue-50/30 hover:text-blue-700 hover:border-blue-300/30 dark:bg-white/5 dark:text-gray-400 dark:border-white/8 dark:hover:bg-blue-950/15 dark:hover:text-blue-400',
  },
};

interface Props {
  selected: string[];
  onChange: (keys: string[]) => void;
}

export default function FlagPicker({ selected, onChange }: Props) {
  const groups = getPickerOptionsByCategory();

  function toggle(key: string) {
    onChange(
      selected.includes(key) ? selected.filter((k) => k !== key) : [...selected, key],
    );
  }

  return (
    <div className="space-y-5">
      {groups.map(({ category, options }) => {
        const meta = FLAG_META[category];
        const styles = TOGGLE_STYLES[category];
        return (
          <div key={category}>
            <div className="mb-2 flex items-center gap-2">
              <span className="text-sm">{meta.emoji}</span>
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                {meta.label}
              </span>
            </div>
            <p className="mb-2.5 text-[11px] text-gray-400 dark:text-gray-500">{meta.description}</p>
            <div className="flex flex-wrap gap-1.5">
              {options.map((opt) => {
                const isActive = selected.includes(opt.key);
                return (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() => toggle(opt.key)}
                    className={`rounded-lg px-2.5 py-1 text-sm font-medium border backdrop-blur transition-all duration-200
                      ${isActive ? styles.active : styles.inactive}`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
