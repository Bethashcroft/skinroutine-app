import { useMemo, useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useProducts } from '../hooks/useProducts';
import { useRoutineLog } from '../hooks/useRoutineLog';
import { useSkinProfile } from '../hooks/useSkinProfile';
import { FLAG_META } from '../data/ingredient-flags';
import { SKIN_TYPES, CONCERNS, getRecommendationsWithReasons } from '../data/skin-recommendations';
import { detectLibraryConflicts, getProductsByExpiry, getProductExpiryDate } from '../data/conflicts';
import LibraryConflictPanel from '../components/LibraryConflictPanel';
import SkinProfileEditor from '../components/SkinProfileEditor';
import Toast from '../components/Toast';
import { detectFlagsFromIngredients } from '../data/product-search';
import { flagOptionsToFlags } from '../data/ingredient-flags';
import type { Product, FlagCategory } from '../types';

const RATING_EMOJI: Record<number, string> = { 1: '😣', 2: '😕', 3: '😐', 4: '🙂', 5: '✨' };

function toLocalDateString(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return { text: 'Good morning', emoji: '☀️', sub: 'Time for your morning routine' };
  if (h < 17) return { text: 'Good afternoon', emoji: '🌤️', sub: 'How is your skin feeling today?' };
  if (h < 21) return { text: 'Good evening', emoji: '🌙', sub: 'Wind down with your evening routine' };
  return { text: 'Good night', emoji: '🌙', sub: 'Remember your evening routine' };
}

function getRatingColor(avg: number): string {
  if (avg >= 4) return '#d9994e';
  if (avg >= 3) return '#e8b376';
  if (avg >= 2) return '#f18d75';
  return '#e6694c';
}

export default function Dashboard() {
  const { products, addProduct } = useProducts();
  const { entries, getEntriesForDate, getStreak, getLast7DaysRatings } = useRoutineLog();
  const { profile, setProfile } = useSkinProfile();
  const [editingProfile, setEditingProfile] = useState(false);
  const [duplicateProduct, setDuplicateProduct] = useState<string | null>(null);
  const [justAdded, setJustAdded] = useState<Set<string>>(new Set());

  const today = toLocalDateString(new Date());
  const todayEntries = getEntriesForDate(today);
  const streak = getStreak();
  const chartData = getLast7DaysRatings();
  const greeting = getGreeting();

  const amEntry = todayEntries.find((e) => e.session === 'AM');
  const pmEntry = todayEntries.find((e) => e.session === 'PM');

  const ownedKeys = useMemo(
    () => new Set(products.map((p) => `${p.name.toLowerCase()}|${p.brand.toLowerCase()}`)),
    [products],
  );

  const recommendations = useMemo(() => {
    if (!profile) return [];
    return getRecommendationsWithReasons(profile.skinType, profile.concerns, 12, ownedKeys)
      .filter((r) => r.score > 0)
      .slice(0, 4);
  }, [profile, ownedKeys]);

  const { expired: expiredProducts, expiringSoon: expiringProducts } = useMemo(
    () => getProductsByExpiry(products, 30),
    [products],
  );

  const libraryConflicts = useMemo(
    () => detectLibraryConflicts(products),
    [products],
  );

  const handleAddRecommendation = useCallback((rec: typeof recommendations[number]['product']) => {
    const duplicate = products.find(
      (p) => p.name.toLowerCase() === rec.name.toLowerCase() &&
             p.brand.toLowerCase() === rec.brand.toLowerCase(),
    );
    if (duplicate) {
      setDuplicateProduct(duplicate.name);
      return;
    }
    const flagKeys = detectFlagsFromIngredients(rec.ingredients);
    const flags = flagOptionsToFlags(flagKeys);
    addProduct({
      name: rec.name,
      brand: rec.brand,
      category: rec.category,
      flags,
      ingredients: rec.ingredients,
    });
    setJustAdded((prev) => new Set([...prev, `${rec.name.toLowerCase()}|${rec.brand.toLowerCase()}`]));
  }, [addProduct, products]);

  const flagWarnings = useMemo(() => {
    const last7 = new Set<string>();
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 7);
    const cutoffStr = toLocalDateString(cutoff);

    for (const entry of entries) {
      if (entry.date >= cutoffStr) {
        for (const pid of entry.productIds) last7.add(pid);
      }
    }

    const warnings: { product: Product; flags: { ingredient: string; category: FlagCategory }[] }[] = [];
    for (const id of last7) {
      const p = products.find((pr) => pr.id === id);
      if (!p) continue;
      const redFlags = p.flags.filter((f) => f.category === 'fragrance');
      if (redFlags.length > 0) warnings.push({ product: p, flags: redFlags });
    }
    return warnings;
  }, [entries, products]);

  const hasData = entries.length > 0;
  const totalEntries = entries.length;
  const dateLabel = new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });

  return (
    <div className="space-y-6">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-3xl">
        <div className="absolute inset-0 bg-linear-to-br from-sand-500 via-sand-600 to-sand-700
                        dark:from-sand-700 dark:via-sand-800 dark:to-sand-900" />
        <div className="absolute inset-0 bg-white/5" />
        <div className="relative px-6 sm:px-8 py-7 sm:py-9 text-white">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <p className="text-[13px] font-medium text-white/60 tracking-wide uppercase">{dateLabel}</p>
              <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold tracking-tight">{greeting.text} {greeting.emoji}</h1>
              <p className="mt-1 text-sm text-white/50">{greeting.sub}</p>
            </div>
            {streak > 0 && (
              <div className="flex items-center sm:flex-col gap-2 sm:gap-0.5 rounded-2xl bg-white/15 backdrop-blur-md
                              border border-white/20 px-4 sm:px-5 py-2.5 sm:py-3 self-start shadow-lg">
                <span className="text-2xl sm:text-3xl font-black">{streak}</span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-white/60">
                  day streak
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="flex gap-3 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-none">
        <StatPill value={todayEntries.length} label="logged today" icon="📝" />
        <StatPill value={products.length} label={products.length === 1 ? 'product' : 'products'} icon="🧴" />
        <StatPill value={totalEntries} label="total logs" icon="📊" />
      </div>

      {/* Skin profile */}
      <section className="card-solid noise overflow-hidden">
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-white/15 dark:border-white/8">
          <h3 className="font-bold text-gray-800 dark:text-gray-100 tracking-tight">Your Skin Profile</h3>
          {profile && !editingProfile && (
            <button type="button" onClick={() => setEditingProfile(true)}
              className="btn-ghost px-3! py-1.5! text-xs! rounded-lg!">
              Edit
            </button>
          )}
        </div>

        {!profile && !editingProfile ? (
          <div className="px-5 sm:px-6 py-5 text-center sm:text-left">
            <p className="text-sm text-gray-400 dark:text-gray-500 leading-relaxed">
              Tell us your skin type and concerns to get personalised product recommendations.
            </p>
            <button
              type="button"
              onClick={() => setEditingProfile(true)}
              className="btn-primary mt-4 w-full sm:w-auto"
            >
              Set up skin profile
            </button>
          </div>
        ) : editingProfile ? (
            <div className="px-5 sm:px-6 py-4">
              <SkinProfileEditor
                initialSkinType={profile?.skinType ?? 'normal'}
                initialConcerns={profile?.concerns ?? []}
                onSave={async (p) => {
                  await setProfile(p);
                  setEditingProfile(false);
                }}
                onCancel={() => setEditingProfile(false)}
              />
            </div>
          ) : profile ? (
            <div className="px-5 sm:px-6 py-4 flex flex-wrap items-center gap-2">
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
          ) : null}
      </section>

      {/* PAO / expiry */}
      {(expiredProducts.length > 0 || expiringProducts.length > 0) && (
        <section className="card-solid noise overflow-hidden border-l-4 border-l-amber-400! dark:border-l-amber-500!">
          <div className="px-5 sm:px-6 py-4 border-b border-white/15 dark:border-white/8">
            <h3 className="font-bold text-amber-800 dark:text-amber-300 tracking-tight">Product expiry</h3>
            <p className="text-xs text-amber-700/70 dark:text-amber-400/60 mt-0.5">
              Based on open date and PAO (period after opening)
            </p>
          </div>
          <div className="divide-y divide-white/10 dark:divide-white/5 px-5 sm:px-6">
            {expiredProducts.map((p) => (
              <ExpiryRow key={p.id} product={p} status="expired" />
            ))}
            {expiringProducts.map((p) => (
              <ExpiryRow key={p.id} product={p} status="expiring-soon" />
            ))}
          </div>
        </section>
      )}

      <LibraryConflictPanel conflicts={libraryConflicts} />

      {/* Personalised recommendations */}
      {profile && recommendations.length > 0 && (
        <section className="card-solid noise overflow-hidden">
          <div className="px-5 sm:px-6 py-4 border-b border-white/15 dark:border-white/8">
            <h3 className="font-bold text-gray-800 dark:text-gray-100 tracking-tight">Recommended for You</h3>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
              Based on your {SKIN_TYPES.find((t) => t.value === profile.skinType)?.label.toLowerCase()} skin
              {profile.concerns.length > 0 && ' and concerns'}
            </p>
          </div>
          <div className="divide-y divide-white/10 dark:divide-white/5">
            {recommendations.map(({ product: rec, reasons }) => (
              <div key={`${rec.name}-${rec.brand}`} className="flex items-start gap-3 px-5 sm:px-6 py-3.5">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl
                                bg-sand-500/10 dark:bg-sand-400/8 border border-sand-400/15 dark:border-sand-500/10">
                  <span className="text-sm">🧴</span>
                </div>
                <div className="flex-1 min-w-0">
                  <span className="block text-sm font-semibold text-gray-800 dark:text-gray-200 truncate">{rec.name}</span>
                  <span className="block text-xs text-gray-400 dark:text-gray-500">{rec.brand}</span>
                  {reasons.length > 0 && (
                    <p className="mt-1 text-[11px] leading-relaxed text-sand-600 dark:text-sand-400">
                      {reasons.slice(0, 2).join(' · ')}
                    </p>
                  )}
                </div>
                {(() => {
                  const addedKey = `${rec.name.toLowerCase()}|${rec.brand.toLowerCase()}`;
                  const added = justAdded.has(addedKey);
                  return (
                    <button
                      type="button"
                      onClick={() => handleAddRecommendation(rec)}
                      disabled={added}
                      className={`shrink-0 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors ${
                        added
                          ? 'bg-emerald-500/15 dark:bg-emerald-500/10 border-emerald-400/25 dark:border-emerald-500/15 text-emerald-700 dark:text-emerald-400 cursor-default'
                          : 'bg-sand-500/15 dark:bg-sand-400/10 border-sand-400/25 dark:border-sand-500/15 text-sand-700 dark:text-sand-300 hover:bg-sand-500/25 dark:hover:bg-sand-400/20'
                      }`}
                    >
                      {added ? '✓ Added' : '+ Add'}
                    </button>
                  );
                })()}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* First-time user guidance */}
      {products.length === 0 && entries.length === 0 && (
        <section className="card-solid noise overflow-hidden">
          <div className="px-5 sm:px-6 py-6 sm:py-8 text-center">
            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 tracking-tight">
              Welcome to SkinRoutine
            </h3>
            <p className="mt-2 text-sm text-gray-400 dark:text-gray-500 max-w-xs mx-auto leading-relaxed">
              Get started by adding the products you use, then log your first routine.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link to="/products" className="btn-primary w-full sm:w-auto">
                Add your first product
              </Link>
              <Link to="/log" className="btn-ghost w-full sm:w-auto">
                Log a routine
              </Link>
            </div>
            <div className="mt-8 grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-xl
                                bg-white/30 dark:bg-white/6 border border-white/20 dark:border-white/8">
                  <span className="text-lg">🧴</span>
                </div>
                <p className="text-[11px] font-medium text-gray-400 dark:text-gray-500">Add products</p>
              </div>
              <div>
                <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-xl
                                bg-white/30 dark:bg-white/6 border border-white/20 dark:border-white/8">
                  <span className="text-lg">📝</span>
                </div>
                <p className="text-[11px] font-medium text-gray-400 dark:text-gray-500">Log routines</p>
              </div>
              <div>
                <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-xl
                                bg-white/30 dark:bg-white/6 border border-white/20 dark:border-white/8">
                  <span className="text-lg">📊</span>
                </div>
                <p className="text-[11px] font-medium text-gray-400 dark:text-gray-500">See insights</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Today's log */}
      <section className="card-solid noise overflow-hidden">
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-white/15 dark:border-white/8">
          <h3 className="font-bold text-gray-800 dark:text-gray-100 tracking-tight">Today's Log</h3>
          <Link to="/log" className="btn-ghost px-3! py-1.5! text-xs! rounded-lg!">
            Open log &rarr;
          </Link>
        </div>

        {!amEntry && !pmEntry ? (
          <div className="flex flex-col items-center px-5 py-14">
            <div className="mb-4 h-16 w-16 rounded-2xl bg-white/30 dark:bg-white/8 backdrop-blur border border-white/20
                            flex items-center justify-center shadow-md">
              <span className="text-3xl">✨</span>
            </div>
            <p className="font-semibold text-gray-700 dark:text-gray-200">Nothing logged yet today</p>
            <p className="mt-1 text-sm text-gray-400 dark:text-gray-500">Track your skincare to build your streak</p>
            <Link to="/log" className="btn-primary mt-6">
              Log your routine
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2">
            <SessionSummary label="Morning" emoji="☀️" entry={amEntry} products={products} />
            <SessionSummary label="Evening" emoji="🌙" entry={pmEntry} products={products} isSecond />
          </div>
        )}
      </section>

      {/* Chart */}
      <section className="card-solid noise overflow-hidden">
        <div className="px-5 sm:px-6 py-4 border-b border-white/15 dark:border-white/8">
          <h3 className="font-bold text-gray-800 dark:text-gray-100 tracking-tight">Skin Rating</h3>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">Last 7 days</p>
        </div>

        {!hasData ? (
          <div className="flex flex-col items-center px-5 py-10">
            <div className="mb-3 h-12 w-12 rounded-xl bg-white/25 dark:bg-white/8 backdrop-blur border border-white/15
                            flex items-center justify-center">
              <span className="text-xl">📈</span>
            </div>
            <p className="text-sm text-gray-400 dark:text-gray-500">Start logging to see your skin trend</p>
          </div>
        ) : (
          <div className="px-4 pb-4 pt-4">
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 8, right: 4, bottom: 0, left: -24 }}>
                  <XAxis
                    dataKey="date"
                    tickFormatter={(d: string) => {
                      const date = new Date(d + 'T12:00:00');
                      return date.toLocaleDateString('en-GB', { weekday: 'short' });
                    }}
                    tick={{ fontSize: 11, fill: '#9ca3af' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    domain={[0, 5]}
                    ticks={[1, 2, 3, 4, 5]}
                    tickFormatter={(v: number) => RATING_EMOJI[v] ?? ''}
                    tick={{ fontSize: 13 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    cursor={false}
                    content={({ active, payload }) => {
                      if (!active || !payload?.length) return null;
                      const val = payload[0].value as number;
                      if (val === 0) return null;
                      const dateStr = payload[0].payload.date;
                      const d = new Date(dateStr + 'T12:00:00');
                      return (
                        <div className="rounded-xl px-4 py-2.5 text-sm shadow-xl backdrop-blur-xl
                                        bg-white/70 border border-white/30
                                        dark:bg-white/10 dark:border-white/10">
                          <p className="font-semibold text-gray-700 dark:text-gray-200">
                            {d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })}
                          </p>
                          <p className="mt-0.5 text-gray-500 dark:text-gray-400">
                            {RATING_EMOJI[Math.round(val)]} {val}/5
                          </p>
                        </div>
                      );
                    }}
                  />
                  <Bar dataKey="avg" radius={[8, 8, 4, 4]} maxBarSize={32}>
                    {chartData.map((entry, i) => (
                      <Cell
                        key={i}
                        fill={entry.avg === 0 ? '#f3efe8' : getRatingColor(entry.avg)}
                        fillOpacity={entry.avg === 0 ? 0.4 : 0.85}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </section>

      {duplicateProduct && (
        <Toast
          variant="warning"
          title="Already in your library"
          message={<><strong className="text-gray-700 dark:text-gray-300">{duplicateProduct}</strong> has already been added. Try entering another or edit it in your library.</>}
          onClose={() => setDuplicateProduct(null)}
        />
      )}

      {/* Flag warnings */}
      {flagWarnings.length > 0 && (
        <section className="card-solid noise overflow-hidden border-l-4 border-l-red-400! dark:border-l-red-500!">
          <div className="px-5 sm:px-6 py-4 border-b border-white/15 dark:border-white/8">
            <h3 className="flex items-center gap-2 font-bold text-red-700 dark:text-red-400 tracking-tight">
              {FLAG_META.fragrance.emoji} Fragrance Warnings
            </h3>
            <p className="mt-0.5 text-xs text-red-500/70 dark:text-red-400/60">
              Products used in the last 7 days with known fragrance allergens
            </p>
          </div>
          <div className="divide-y divide-white/10 dark:divide-white/5 px-5 sm:px-6">
            {flagWarnings.map(({ product, flags }) => (
              <div key={product.id} className="flex items-start gap-3 py-3.5">
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg
                                bg-red-100/60 dark:bg-red-900/20 backdrop-blur">
                  <span className="text-sm">🧴</span>
                </div>
                <div>
                  <span className="font-medium text-gray-800 dark:text-gray-200">{product.name}</span>
                  <span className="ml-1.5 text-xs text-gray-400 dark:text-gray-500">{product.brand}</span>
                  <div className="mt-1.5 flex flex-wrap gap-1">
                    {flags.map((f, i) => (
                      <span key={i} className="rounded-full bg-red-100/50 dark:bg-red-900/30 backdrop-blur
                                               px-2 py-0.5 text-xs font-medium text-red-700 dark:text-red-400
                                               border border-red-200/30 dark:border-red-700/20">
                        {f.ingredient}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function ExpiryRow({ product, status }: { product: Product; status: 'expired' | 'expiring-soon' }) {
  const expires = getProductExpiryDate(product);
  const label = expires
    ? expires.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
    : '';

  return (
    <div className="flex items-center gap-3 py-3.5">
      <span className="text-lg">{status === 'expired' ? '⏰' : '⚠️'}</span>
      <div className="flex-1 min-w-0">
        <span className="block text-sm font-semibold text-gray-800 dark:text-gray-200 truncate">{product.name}</span>
        <span className="block text-xs text-gray-400 dark:text-gray-500">
          {status === 'expired' ? 'Past PAO — replace' : 'Expires soon'} · {label}
        </span>
      </div>
      <Link to="/products" className="text-xs font-semibold text-sand-600 dark:text-sand-400 shrink-0">
        View
      </Link>
    </div>
  );
}

function StatPill({ value, label, icon }: { value: number; label: string; icon: string }) {
  return (
    <div className="shrink-0 flex items-center gap-3 rounded-2xl px-5 py-3.5 backdrop-blur-xl
                    bg-white/50 border border-white/50 shadow-lg transition-all duration-300
                    hover:shadow-xl hover:-translate-y-1 hover:bg-white/60
                    dark:bg-white/6 dark:border-white/10">
      <span className="text-xl">{icon}</span>
      <div>
        <span className="block text-2xl font-black text-gray-800 dark:text-gray-100 tracking-tight">{value}</span>
        <span className="block text-[11px] font-medium text-gray-400 dark:text-gray-500 -mt-0.5">{label}</span>
      </div>
    </div>
  );
}

function SessionSummary({
  label,
  emoji,
  entry,
  products,
  isSecond,
}: {
  label: string;
  emoji: string;
  entry?: { productIds: string[]; skinRating: number; notes: string };
  products: Product[];
  isSecond?: boolean;
}) {
  if (!entry) {
    return (
      <div className={`flex flex-col items-center px-4 py-6 ${isSecond ? 'border-t sm:border-t-0 sm:border-l border-white/10 dark:border-white/5' : ''}`}>
        <span className="text-2xl opacity-30">{emoji}</span>
        <p className="mt-2 text-xs font-medium text-gray-400 dark:text-gray-500">{label} not logged</p>
      </div>
    );
  }

  const usedProducts = entry.productIds
    .map((id) => products.find((p) => p.id === id))
    .filter(Boolean) as Product[];

  return (
    <div className={`px-5 py-4 ${isSecond ? 'border-t sm:border-t-0 sm:border-l border-white/10 dark:border-white/5' : ''}`}>
      <div className="mb-2.5 flex items-center justify-between">
        <span className="text-sm font-bold text-gray-700 dark:text-gray-200">{emoji} {label}</span>
        <span className="text-xl" title={`${entry.skinRating}/5`}>
          {RATING_EMOJI[entry.skinRating]}
        </span>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {usedProducts.map((p) => (
          <span key={p.id} className="rounded-full bg-white/40 dark:bg-white/8 backdrop-blur
                                     px-2.5 py-0.5 text-xs font-medium text-sand-700 dark:text-sand-300
                                     border border-white/20 dark:border-white/8">
            {p.name}
          </span>
        ))}
      </div>
      {entry.notes && (
        <p className="mt-2.5 inline-block rounded-lg bg-white/25 dark:bg-white/5 backdrop-blur
                      px-2.5 py-1.5 text-xs leading-relaxed text-gray-500 dark:text-gray-400 italic
                      border border-white/15 dark:border-white/5">
          "{entry.notes}"
        </p>
      )}
    </div>
  );
}
