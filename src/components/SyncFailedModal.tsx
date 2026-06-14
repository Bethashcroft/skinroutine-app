interface Props {
  open: boolean;
  onClose: () => void;
  onRetry: () => void;
  retrying?: boolean;
}

export default function SyncFailedModal({
  open,
  onClose,
  onRetry,
  retrying,
}: Props) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="sync-failed-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden
                   bg-white/90 dark:bg-gray-900/95 border border-white/50 dark:border-white/10
                   backdrop-blur-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-5 py-5">
          <h2
            id="sync-failed-title"
            className="text-lg font-bold text-gray-800 dark:text-gray-100"
          >
            Cloud sync failed
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
            We couldn&apos;t sync your data to the cloud right now. Your
            information is still saved on this device. Please try again later.
          </p>
        </div>
        <div className="flex gap-2 border-t border-gray-200/60 dark:border-white/10 px-5 py-4">
          <button type="button" onClick={onClose} className="btn-ghost flex-1">
            Close
          </button>
          <button
            type="button"
            onClick={onRetry}
            disabled={retrying}
            className="btn-primary flex-1 disabled:opacity-50"
          >
            {retrying ? 'Syncing…' : 'Retry'}
          </button>
        </div>
      </div>
    </div>
  );
}
