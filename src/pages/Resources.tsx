import { useMemo } from 'react';
import { useSkinProfile } from '../hooks/useSkinProfile';
import { SKIN_TYPES, CONCERNS } from '../data/skin-recommendations';
import { RETAILERS, sortRetailersForProfile } from '../data/retailers';

export default function Resources() {
  const { profile } = useSkinProfile();

  const sorted = useMemo(() => {
    if (!profile) return RETAILERS.map((retailer) => ({ retailer, matchScore: 0 }));
    return sortRetailersForProfile(RETAILERS, profile.skinType, profile.concerns);
  }, [profile]);

  const topMatches = sorted.filter((r) => r.matchScore > 0);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-extrabold text-gray-800 dark:text-gray-100 tracking-tight">
          Where to Shop
        </h2>
        <p className="mt-0.5 text-sm text-gray-400 dark:text-gray-500">
          {profile
            ? 'Retailers matched to your skin profile appear first'
            : 'The best places to buy skincare in the UK'}
        </p>
      </div>

      {profile && topMatches.length > 0 && (
        <p className="text-xs text-sand-600 dark:text-sand-400 -mt-2">
          Picks for {SKIN_TYPES.find((t) => t.value === profile.skinType)?.label.toLowerCase()} skin
          {profile.concerns.length > 0 && (
            <> · {profile.concerns.map((c) => CONCERNS.find((x) => x.value === c)?.label).filter(Boolean).join(', ')}</>
          )}
        </p>
      )}

      <div className="space-y-3">
        {sorted.map(({ retailer: r, matchScore }) => (
          <a
            key={r.name}
            href={r.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group block overflow-hidden rounded-2xl shadow-lg transition-all duration-300
                       bg-white/60 border border-white/60
                       dark:bg-white/6 dark:border-white/10 dark:shadow-[0_4px_30px_rgba(0,0,0,0.3)]
                       hover:-translate-y-1 hover:shadow-2xl hover:border-white/75
                       dark:hover:bg-white/8 dark:hover:border-white/15"
          >
            <div className="flex items-start gap-4 p-5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl
                              bg-white/40 dark:bg-white/8 backdrop-blur border border-white/30 dark:border-white/10
                              shadow-sm text-lg font-bold text-sand-700 dark:text-sand-300
                              group-hover:shadow-md group-hover:scale-105 transition-all duration-300">
                {r.name.charAt(0)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-bold text-gray-800 dark:text-gray-100 tracking-tight">
                    {r.name}
                  </h3>
                  {matchScore > 0 && (
                    <span className="rounded-full bg-sand-500/15 dark:bg-sand-400/10 border border-sand-400/25 dark:border-sand-500/15
                                     px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-sand-700 dark:text-sand-300">
                      Good match
                    </span>
                  )}
                  <svg
                    className="h-3.5 w-3.5 text-gray-300 dark:text-gray-600 opacity-0 -translate-x-1
                               group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300"
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                  </svg>
                </div>

                <p className="mt-1 text-sm leading-relaxed text-gray-500 dark:text-gray-400">
                  {r.description}
                </p>

                <div className="mt-3 flex flex-wrap items-center gap-2">
                  {r.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-white/35 dark:bg-white/8 backdrop-blur
                                 border border-white/25 dark:border-white/8
                                 px-2.5 py-0.5 text-[11px] font-semibold text-sand-700 dark:text-sand-400"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-400 dark:text-gray-500">
                  <span className="flex items-center gap-1">
                    <span>🚚</span> {r.freeDelivery}
                  </span>
                  {r.highlight && (
                    <span className="flex items-center gap-1">
                      <span>✨</span> {r.highlight}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </a>
        ))}
      </div>

      <p className="text-center text-xs text-gray-400/60 dark:text-gray-600/60 pt-2">
        All links open in a new tab. We&apos;re not affiliated with any of these retailers.
      </p>
    </div>
  );
}
