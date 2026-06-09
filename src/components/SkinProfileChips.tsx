import type { SkinProfile } from '../types';
import { SKIN_TYPES, CONCERNS } from '../data/skin-recommendations';

/** The row of pills showing a user's skin type and concerns. */
export default function SkinProfileChips({
  profile,
  className = '',
}: {
  profile: SkinProfile;
  className?: string;
}) {
  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      <span className="rounded-full bg-sand-500/15 dark:bg-sand-400/10 border border-sand-400/25 dark:border-sand-500/15
                       px-3 py-1 text-xs font-bold text-sand-700 dark:text-sand-300">
        {SKIN_TYPES.find((t) => t.value === profile.skinType)?.label ?? profile.skinType} skin
      </span>
      {profile.concerns.map((c) => {
        const meta = CONCERNS.find((x) => x.value === c);
        return (
          <span key={c} className="rounded-full bg-white/35 dark:bg-white/8 border border-white/25 dark:border-white/10
                                   px-2.5 py-1 text-xs font-medium text-gray-600 dark:text-gray-300">
            {meta?.icon} {meta?.label ?? c}
          </span>
        );
      })}
      {profile.concerns.length === 0 && (
        <span className="text-xs text-gray-400 dark:text-gray-500">No concerns selected</span>
      )}
    </div>
  );
}
