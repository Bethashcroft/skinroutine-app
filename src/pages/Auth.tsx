import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function Auth() {
  const { loading, signInWithGoogle, signInWithEmail, signUpWithEmail } = useAuth();
  const location = useLocation();
  const initialMode = (location.state as { mode?: string })?.mode === 'login' ? 'login' : 'signup';
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (loading) {
    return (
      <div className="flex flex-col items-center pt-12 sm:pt-20 space-y-5 max-w-sm mx-auto w-full">
        <div className="animate-pulse h-16 w-16 rounded-2xl bg-white/20 dark:bg-white/4" />
        <div className="animate-pulse h-8 w-48 rounded-xl bg-white/20 dark:bg-white/4" />
        <div className="animate-pulse h-4 w-56 rounded-lg bg-white/15 dark:bg-white/3" />
        <div className="animate-pulse h-56 w-full rounded-2xl bg-white/15 dark:bg-white/4 mt-4" />
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setMessage('');
    setSubmitting(true);

    if (mode === 'login') {
      const err = await signInWithEmail(email, password);
      if (err) setError(err);
    } else {
      const err = await signUpWithEmail(email, password);
      if (err) {
        setError(err);
      } else {
        setMessage('Check your email for a confirmation link!');
      }
    }

    setSubmitting(false);
  }

  return (
    <div className="flex flex-col items-center pt-6 sm:pt-12">
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 h-16 w-16 rounded-2xl overflow-hidden shadow-lg ring-1 ring-white/40">
          <img src="/logo.png" alt="" className="h-full w-full object-cover" />
        </div>
        <h1 className="text-2xl font-extrabold tracking-tight text-gray-800 dark:text-gray-100">
          {mode === 'login' ? 'Welcome back' : 'Create account'}
        </h1>
        <p className="mt-1 text-sm text-gray-400 dark:text-gray-500">
          {mode === 'login'
            ? 'Sign in to sync your skincare data'
            : 'Sign up to save your routine across devices'
          }
        </p>
      </div>

      <div className="w-full max-w-sm card-solid noise p-6 space-y-5">
        {/* Google sign-in */}
        <button
          type="button"
          onClick={signInWithGoogle}
          className="flex w-full items-center justify-center gap-3 rounded-xl
                     bg-white dark:bg-white/10 border border-gray-200 dark:border-white/15
                     px-4 py-3 text-sm font-semibold text-gray-700 dark:text-gray-200
                     shadow-sm transition-all hover:shadow-md hover:bg-gray-50 dark:hover:bg-white/15"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continue with Google
        </button>

        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-gray-200/60 dark:bg-white/10" />
          <span className="text-xs text-gray-400 dark:text-gray-500 font-medium">or</span>
          <div className="h-px flex-1 bg-gray-200/60 dark:bg-white/10" />
        </div>

        {/* Email form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
            className="glass-input w-full px-3.5 py-2.5"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            minLength={6}
            className="glass-input w-full px-3.5 py-2.5"
          />

          {error && (
            <p className="rounded-lg bg-red-500/10 border border-red-400/20 px-3 py-2 text-xs text-red-600 dark:text-red-400">
              {error}
            </p>
          )}
          {message && (
            <p className="rounded-lg bg-emerald-500/10 border border-emerald-400/20 px-3 py-2 text-xs text-emerald-700 dark:text-emerald-400">
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="btn-primary w-full disabled:opacity-50"
          >
            {submitting ? 'Please wait…' : mode === 'login' ? 'Sign in' : 'Create account'}
          </button>
        </form>

        <p className="text-center text-xs text-gray-400 dark:text-gray-500">
          {mode === 'login' ? (
            <>
              Don't have an account?{' '}
              <button type="button" onClick={() => { setMode('signup'); setError(''); setMessage(''); }}
                className="font-semibold text-sand-600 hover:text-sand-800 dark:text-sand-400 dark:hover:text-sand-300 transition-colors">
                Sign up
              </button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <button type="button" onClick={() => { setMode('login'); setError(''); setMessage(''); }}
                className="font-semibold text-sand-600 hover:text-sand-800 dark:text-sand-400 dark:hover:text-sand-300 transition-colors">
                Sign in
              </button>
            </>
          )}
        </p>
      </div>

      <p className="mt-6 text-center text-xs text-gray-500 dark:text-gray-400 max-w-xs leading-relaxed">
        Your skincare data syncs securely across devices when you're signed in.
        The app also works fully offline.
      </p>
    </div>
  );
}
