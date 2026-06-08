import { useEffect } from 'react';

interface Props {
  variant: 'success' | 'warning';
  title: string;
  message: React.ReactNode;
  onClose: () => void;
  autoDismissMs?: number;
}

export default function Toast({ variant, title, message, onClose, autoDismissMs = 5000 }: Props) {
  useEffect(() => {
    const t = setTimeout(onClose, autoDismissMs);
    return () => clearTimeout(t);
  }, [onClose, autoDismissMs]);

  const isSuccess = variant === 'success';

  return (
    <div className={`fixed bottom-24 sm:bottom-6 left-1/2 -translate-x-1/2 z-50
                    w-[calc(100vw-2rem)] max-w-sm rounded-2xl backdrop-blur-xl shadow-2xl
                    animate-[toast-in_0.28s_ease]
                    ${isSuccess
                      ? 'border border-emerald-200/40 dark:border-emerald-500/20'
                      : 'border border-amber-200/40 dark:border-amber-500/20'
                    }
                    bg-white/85 dark:bg-gray-900/90`}>
      <div className="flex items-start gap-3 p-4">
        {isSuccess ? (
          <div className="mt-0.5 shrink-0 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500">
            <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        ) : (
          <span className="text-lg shrink-0 mt-0.5">⚠️</span>
        )}
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-semibold ${
            isSuccess ? 'text-emerald-800 dark:text-emerald-200' : 'text-gray-800 dark:text-gray-100'
          }`}>
            {title}
          </p>
          <div className="mt-0.5 text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
            {message}
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Dismiss"
          className="shrink-0 rounded-lg p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200
                     hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
