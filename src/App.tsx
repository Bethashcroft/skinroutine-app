import { BrowserRouter, Routes, Route, NavLink, Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { useState, useEffect, useRef, useMemo, lazy, Suspense } from 'react';
import ErrorBoundary from './components/ErrorBoundary';
import { useTheme } from './hooks/useTheme';
import { AuthProvider, useAuth, isSupabaseConfigured } from './hooks/useAuth';
// Landing & Auth stay eager — they're the unauthenticated entry points.
import Auth from './pages/Auth';
import Landing from './pages/Landing';
// Heavier / authenticated-only pages are split into their own chunks.
// Dashboard in particular pulls in recharts, which we don't want on first paint.
const Dashboard = lazy(() => import('./pages/Dashboard'));
const ProductLibrary = lazy(() => import('./pages/ProductLibrary'));
const RoutineLog = lazy(() => import('./pages/RoutineLog'));
const Settings = lazy(() => import('./pages/Settings'));
const Resources = lazy(() => import('./pages/Resources'));
const SharedProduct = lazy(() => import('./pages/SharedProduct'));
const Onboarding = lazy(() => import('./pages/Onboarding'));
const Privacy = lazy(() => import('./pages/Privacy'));
const NotFound = lazy(() => import('./pages/NotFound'));
import { ProductsProvider, useProducts } from './hooks/useProducts';
import { usePaoNotifications } from './hooks/usePaoNotifications';
import { RoutineLogProvider } from './hooks/useRoutineLog';
import { useLocalStorage } from './hooks/useLocalStorage';
import { SkinProfileProvider, useSkinProfile } from './hooks/useSkinProfile';

// Lightweight fallback shown while a lazily-loaded page chunk is fetched.
function PageFallback() {
  return (
    <div className="flex flex-1 items-center justify-center py-20">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-sand-300/40 border-t-sand-500" />
    </div>
  );
}

const navItems = [
  { to: '/', label: 'Home', icon: '🏠' },
  { to: '/products', label: 'Products', icon: '🧴' },
  { to: '/log', label: 'Log', icon: '📝' },
  { to: '/resources', label: 'Shop', icon: '🛍️' },
  { to: '/settings', label: 'Settings', icon: '⚙️' },
] as const;

function UserMenu() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [open]);

  if (!user) return null;

  const initial = (user.user_metadata?.full_name?.[0] || user.email?.[0] || '?').toUpperCase();

  async function handleSignOut() {
    setOpen(false);
    await signOut();
    navigate('/');
  }

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}

        className="flex h-9 w-9 items-center justify-center rounded-full transition-all duration-300
                   bg-sand-500/20 backdrop-blur-lg border border-sand-400/30 text-sand-700 shadow-sm
                   hover:bg-sand-500/30 hover:shadow-md hover:scale-105
                   dark:bg-sand-400/10 dark:border-sand-500/15 dark:text-sand-300
                   dark:hover:bg-sand-400/20 text-xs font-bold"
      >
        {initial}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-52 rounded-2xl overflow-hidden
                        bg-white/80 backdrop-blur-xl border border-white/50 shadow-xl
                        dark:bg-gray-900/85 dark:border-white/10 dark:shadow-black/40 z-50">
          <div className="px-4 py-3 border-b border-gray-200/40 dark:border-white/8">
            <p className="text-xs font-semibold text-gray-700 dark:text-gray-200 truncate">
              {user.user_metadata?.full_name || 'Account'}
            </p>
            <p className="text-[11px] text-gray-400 dark:text-gray-500 truncate mt-0.5">
              {user.email}
            </p>
          </div>
          <div className="p-1.5">
            <button
              type="button"
              onClick={() => { navigate('/settings'); setOpen(false); }}
              className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium
                         text-gray-600 dark:text-gray-300
                         hover:bg-gray-100/60 dark:hover:bg-white/8 transition-colors"
            >
              <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 010 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 010-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Settings
            </button>
            <button
              type="button"
              onClick={handleSignOut}
              className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium
                         text-red-500 dark:text-red-400
                         hover:bg-red-50/60 dark:hover:bg-red-950/20 transition-colors"
            >
              <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
              </svg>
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function AppShell() {
  const { theme, toggle } = useTheme();
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const { products, addProduct, initialSyncDone, isNewUser, clearIsNewUser } = useProducts();

  const ownedKeys = useMemo(
    () => new Set(products.map((p) => `${p.name.toLowerCase()}|${p.brand.toLowerCase()}`)),
    [products],
  );

  usePaoNotifications(products);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {});
    }
  }, []);
  const { profile, setProfile } = useSkinProfile();
  const [searchParams, setSearchParams] = useSearchParams();
  const retakeQuiz = searchParams.get('retake') === 'quiz';
  const onboardedKey = user ? `skinroutine:onboarded:${user.id}` : 'skinroutine:onboarded';
  const [, setOnboarded] = useLocalStorage<boolean>(onboardedKey, false);

  if (isSupabaseConfigured && loading) {
    return (
      <div className="flex min-h-svh flex-col">
        <div className="mx-auto w-full max-w-3xl px-4 sm:px-5 py-6 sm:py-8 space-y-6">
          <div className="animate-pulse rounded-3xl bg-white/20 dark:bg-white/4 h-36" />
          <div className="flex gap-3">
            <div className="animate-pulse rounded-2xl bg-white/20 dark:bg-white/4 h-16 flex-1" />
            <div className="animate-pulse rounded-2xl bg-white/20 dark:bg-white/4 h-16 flex-1" />
            <div className="animate-pulse rounded-2xl bg-white/20 dark:bg-white/4 h-16 flex-1" />
          </div>
          <div className="animate-pulse rounded-2xl bg-white/20 dark:bg-white/4 h-64" />
        </div>
      </div>
    );
  }

  if (isSupabaseConfigured && user && !initialSyncDone) {
    return (
      <div className="flex min-h-svh flex-col">
        <div className="mx-auto w-full max-w-3xl px-4 sm:px-5 py-6 sm:py-8 space-y-6">
          <div className="animate-pulse rounded-3xl bg-white/20 dark:bg-white/4 h-36" />
          <div className="flex gap-3">
            <div className="animate-pulse rounded-2xl bg-white/20 dark:bg-white/4 h-16 flex-1" />
            <div className="animate-pulse rounded-2xl bg-white/20 dark:bg-white/4 h-16 flex-1" />
            <div className="animate-pulse rounded-2xl bg-white/20 dark:bg-white/4 h-16 flex-1" />
          </div>
        </div>
      </div>
    );
  }

  if (isSupabaseConfigured && !user) {
    return (
      <div className="flex min-h-svh flex-col">
        <div className="fixed top-1/3 left-1/3 w-[500px] h-[500px] rounded-full pointer-events-none z-0"
          style={{
            background: 'radial-gradient(circle, rgba(237, 202, 158, 0.4) 0%, rgba(244, 219, 193, 0.2) 40%, transparent 70%)',
            filter: 'blur(80px)',
          }}
        />
        <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col relative z-10">
          <Suspense fallback={<PageFallback />}>
            <Routes>
              <Route path="/share" element={<SharedProduct />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="*" element={<Landing />} />
            </Routes>
          </Suspense>
        </main>
      </div>
    );
  }

  const showOnboarding = isSupabaseConfigured && user && initialSyncDone && (
    retakeQuiz || (isNewUser && !profile)
  );

  if (showOnboarding) {
    return (
      <div className="flex min-h-svh flex-col">
        <div className="fixed top-1/3 left-1/3 w-[500px] h-[500px] rounded-full pointer-events-none z-0"
          style={{
            background: 'radial-gradient(circle, rgba(237, 202, 158, 0.4) 0%, rgba(244, 219, 193, 0.2) 40%, transparent 70%)',
            filter: 'blur(80px)',
          }}
        />
        <main className="relative z-10">
          <Suspense fallback={<PageFallback />}>
            <Onboarding
              onComplete={async (p) => {
                await setProfile(p);
                setOnboarded(true);
                clearIsNewUser();
                if (retakeQuiz) setSearchParams({});
              }}
              addProduct={addProduct}
              initialProfile={retakeQuiz ? profile : null}
              ownedKeys={ownedKeys}
            />
          </Suspense>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-svh flex-col">
      <div className="fixed top-1/3 left-1/3 w-[500px] h-[500px] rounded-full pointer-events-none z-0"
        style={{
          background: 'radial-gradient(circle, rgba(237, 202, 158, 0.4) 0%, rgba(244, 219, 193, 0.2) 40%, transparent 70%)',
          filter: 'blur(80px)',
        }}
      />

      <header className="sticky top-0 z-30 backdrop-blur-2xl
                         bg-white/35 border-b border-white/30 shadow-sm
                         dark:bg-white/5 dark:border-white/10 dark:shadow-none">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 sm:px-5 py-3">
          <NavLink to="/" className="flex items-center gap-2.5 group">
            <div className="h-9 w-9 rounded-xl overflow-hidden shadow-md ring-1 ring-white/40
                            group-hover:shadow-lg group-hover:scale-105 transition-all duration-300">
              <img src="/logo.png" alt="" className="h-full w-full object-cover" />
            </div>
            <span className="text-lg font-bold tracking-tight text-sand-800 dark:text-sand-200">
              SkinRoutine
            </span>
          </NavLink>

          <div className="flex items-center gap-2">
            <UserMenu />

            {user && (
              <button
                type="button"
                onClick={async () => { await signOut(); navigate('/'); }}
                title="Sign out"
                className="flex h-9 w-9 items-center justify-center rounded-full transition-all duration-300
                           bg-white/25 backdrop-blur-lg border border-white/35 text-sand-600 shadow-sm
                           hover:bg-white/45 hover:shadow-md hover:scale-105
                           dark:bg-white/8 dark:border-white/12 dark:text-sand-400
                           dark:hover:bg-white/15"
              >
                <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            )}

            <button
              type="button"
              onClick={toggle}
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              className="flex h-9 w-9 items-center justify-center rounded-full transition-all duration-300
                         bg-white/25 backdrop-blur-lg border border-white/35 text-sand-600 shadow-sm
                         hover:bg-white/45 hover:shadow-md hover:scale-105
                         dark:bg-white/8 dark:border-white/12 dark:text-sand-400
                         dark:hover:bg-white/15"
            >
              {theme === 'dark' ? (
                <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>

            <nav className="hidden sm:flex gap-1 rounded-2xl bg-white/20 backdrop-blur-xl p-1 border border-white/30 shadow-sm
                            dark:bg-white/5 dark:border-white/8 dark:shadow-none">
              {navItems.map(({ to, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={to === '/'}
                  className={({ isActive }) =>
                    `rounded-xl px-3.5 py-1.5 text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-white/60 text-sand-800 shadow-md dark:bg-white/15 dark:text-sand-200'
                        : 'text-sand-600 hover:bg-white/30 hover:text-sand-800 dark:text-sand-400 dark:hover:bg-white/8 dark:hover:text-sand-200'
                    }`
                  }
                >
                  {label}
                </NavLink>
              ))}
            </nav>
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-4 sm:px-5 py-6 sm:py-8 pb-24 sm:pb-8 relative z-10">
        <Suspense fallback={<PageFallback />}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/products" element={<ProductLibrary />} />
            <Route path="/log" element={<RoutineLog />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/share" element={<SharedProduct />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/auth" element={<Navigate to="/" replace />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>

      <footer className="hidden sm:block py-6 text-center text-xs text-sand-500/40 dark:text-sand-700/40 tracking-wide relative z-10">
        SkinRoutine &middot; Your skincare diary
      </footer>

      <nav className="fixed bottom-0 left-0 right-0 z-30 flex sm:hidden
                      border-t border-white/25 bg-white/35 backdrop-blur-2xl shadow-[0_-2px_15px_rgba(0,0,0,0.05)] safe-bottom
                      dark:border-white/8 dark:bg-white/5 dark:shadow-none">
        {navItems.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex flex-1 flex-col items-center gap-0.5 py-2.5 pb-[max(0.625rem,env(safe-area-inset-bottom))] text-xs font-medium transition-all duration-200 ${
                isActive
                  ? 'text-sand-700 dark:text-sand-400'
                  : 'text-gray-400 dark:text-gray-600'
              }`
            }
          >
            <span className="text-lg leading-none">{icon}</span>
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <SkinProfileProvider>
            <ProductsProvider>
              <RoutineLogProvider>
                <AppShell />
              </RoutineLogProvider>
            </ProductsProvider>
          </SkinProfileProvider>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
