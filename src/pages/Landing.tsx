import { useNavigate } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme';

export default function Landing() {
  const navigate = useNavigate();
  const { theme, toggle } = useTheme();

  return (
    <div className="flex flex-col items-center overflow-hidden">
      {/* Nav */}
      <nav className="w-full max-w-3xl flex items-center justify-between px-5 py-5">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg overflow-hidden shadow-md ring-1 ring-white/30">
            <img src="/logo.png" alt="" className="h-full w-full object-cover" />
          </div>
          <span className="text-sm font-bold tracking-tight text-gray-800 dark:text-gray-200">
            SkinRoutine
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={toggle}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            className="flex h-8 w-8 items-center justify-center rounded-full transition-all duration-300
                       bg-white/25 backdrop-blur-lg border border-white/35 text-sand-600 shadow-sm
                       hover:bg-white/45 hover:shadow-md
                       dark:bg-white/8 dark:border-white/12 dark:text-sand-400 dark:hover:bg-white/15"
          >
            {theme === 'dark' ? (
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>
          <button
            onClick={() => navigate('/auth', { state: { mode: 'login' } })}
            className="rounded-lg px-3.5 py-1.5 text-xs font-semibold
                       text-sand-700 dark:text-sand-300 transition-colors
                       hover:text-sand-900 dark:hover:text-sand-100"
          >
            Sign in
          </button>
          <button
            onClick={() => navigate('/auth')}
            className="rounded-lg bg-sand-600 dark:bg-sand-500 px-3.5 py-1.5
                       text-xs font-semibold text-white shadow-sm
                       transition-all hover:opacity-90"
          >
            Sign up
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="flex flex-col items-center text-center pt-10 sm:pt-20 px-5 w-full max-w-2xl">
        <h1 className="text-4xl sm:text-[3.5rem] font-extrabold tracking-tight leading-[1.05] sm:leading-[1.05]">
          <span className="text-gray-800 dark:text-gray-100">Your skincare routine,</span>
          <br />
          <span className="bg-linear-to-r from-sand-600 via-sand-500 to-amber-500
                           dark:from-sand-300 dark:via-sand-400 dark:to-amber-400
                           bg-clip-text text-transparent">
            decoded
          </span>
        </h1>

        <p className="mt-5 text-[15px] sm:text-lg text-gray-500 dark:text-gray-400 leading-relaxed max-w-md">
          Track products, flag allergens, catch ingredient conflicts —
          and finally know what works for your&nbsp;skin.
        </p>

        <button
          onClick={() => navigate('/auth')}
          className="mt-9 rounded-xl bg-gray-900 dark:bg-white
                     px-8 py-3 text-sm font-semibold text-white dark:text-gray-900
                     shadow-lg shadow-black/10 dark:shadow-white/10
                     transition-all duration-200 hover:opacity-90 hover:-translate-y-px
                     active:translate-y-0"
        >
          Get started
        </button>
        <p className="mt-3 text-xs text-gray-400 dark:text-gray-500">No credit card needed</p>
      </section>

      {/* App preview */}
      <section className="w-full max-w-2xl px-5 mt-14 sm:mt-20">
        <div className="relative rounded-2xl overflow-hidden border border-white/15 dark:border-white/8
                        bg-white/30 dark:bg-white/4 backdrop-blur-xl shadow-2xl shadow-black/5 dark:shadow-black/30">
          {/* Fake browser bar */}
          <div className="flex items-center gap-2 px-4 py-3 border-b border-white/15 dark:border-white/6">
            <div className="flex gap-1.5">
              <div className="h-2.5 w-2.5 rounded-full bg-red-400/60" />
              <div className="h-2.5 w-2.5 rounded-full bg-amber-400/60" />
              <div className="h-2.5 w-2.5 rounded-full bg-emerald-400/60" />
            </div>
            <div className="flex-1 mx-8">
              <div className="mx-auto max-w-48 h-5 rounded-md bg-white/20 dark:bg-white/6" />
            </div>
          </div>
          {/* Preview content */}
          <div className="p-5 sm:p-6 space-y-3">
            {/* Mock dashboard header */}
            <div className="rounded-xl bg-sand-500/15 dark:bg-sand-400/8 border border-sand-400/15 dark:border-sand-500/10 p-4">
              <div className="text-[10px] font-bold uppercase tracking-widest text-sand-600/60 dark:text-sand-400/60">Today</div>
              <div className="mt-1 text-base font-extrabold text-gray-700 dark:text-gray-200">Good morning ☀️</div>
              <div className="mt-0.5 text-xs text-gray-400 dark:text-gray-500">Time for your morning routine</div>
            </div>
            {/* Mock product cards */}
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-white/40 dark:bg-white/5 border border-white/20 dark:border-white/8 p-3">
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-sky-400" />
                  <span className="text-xs font-semibold text-gray-600 dark:text-gray-300">CeraVe Cleanser</span>
                </div>
                <div className="mt-1.5 text-[10px] text-gray-400 dark:text-gray-500">Used 12 times · 8mo left</div>
              </div>
              <div className="rounded-xl bg-white/40 dark:bg-white/5 border border-white/20 dark:border-white/8 p-3">
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-violet-400" />
                  <span className="text-xs font-semibold text-gray-600 dark:text-gray-300">Glycolic Acid 7%</span>
                </div>
                <div className="mt-1.5 text-[10px] text-gray-400 dark:text-gray-500">Used 5 times · AHA active</div>
              </div>
            </div>
            {/* Mock conflict warning */}
            <div className="rounded-xl bg-red-500/8 dark:bg-red-500/6 border border-red-400/15 dark:border-red-500/10 px-3.5 py-2.5">
              <span className="text-[11px] font-bold text-red-600 dark:text-red-400">⚠️ Warning</span>
              <p className="mt-0.5 text-[10px] text-red-600/70 dark:text-red-400/70 leading-relaxed">
                Retinoids + AHAs together can cause excessive irritation. Alternate nights instead.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Value props */}
      <section className="w-full max-w-2xl px-5 mt-16 sm:mt-24 pb-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
          {[
            { title: 'Ingredient scanner', desc: 'Paste or photograph an INCI list. Allergens are flagged in seconds — all 26 EU-regulated compounds.', icon: '🔬' },
            { title: 'Conflict detection', desc: 'Select products for your routine and get real-time warnings about actives that shouldn\'t be layered.', icon: '⚡' },
            { title: 'Expiry & usage', desc: 'Track when you opened a product, how often you use it, and get notified when PAO runs out.', icon: '📊' },
          ].map((f) => (
            <div key={f.title} className="text-center sm:text-left">
              <span className="text-2xl">{f.icon}</span>
              <h3 className="mt-2.5 text-sm font-bold text-gray-700 dark:text-gray-200">{f.title}</h3>
              <p className="mt-1.5 text-xs text-gray-400 dark:text-gray-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="w-full max-w-2xl px-5 py-14 sm:py-20 text-center">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-800 dark:text-gray-100 tracking-tight">
          Ready to take control?
        </h2>
        <p className="mt-3 text-sm text-gray-400 dark:text-gray-500">
          Your data, your skin.
        </p>
        <button
          onClick={() => navigate('/auth')}
          className="mt-7 rounded-xl bg-gray-900 dark:bg-white
                     px-8 py-3 text-sm font-semibold text-white dark:text-gray-900
                     shadow-lg shadow-black/10 dark:shadow-white/10
                     transition-all duration-200 hover:opacity-90 hover:-translate-y-px"
        >
          Create account
        </button>
      </section>

      <footer className="pb-8 text-center text-[10px] text-gray-400/30 dark:text-gray-600/40">
        SkinRoutine
      </footer>
    </div>
  );
}
