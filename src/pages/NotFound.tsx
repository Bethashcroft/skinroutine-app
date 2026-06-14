import { useNavigate } from 'react-router-dom';

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <div className="flex min-h-svh flex-col items-center justify-center px-6 text-center">
      <div className="mb-4 text-5xl font-extrabold text-sand-400/40 dark:text-sand-600/30">
        404
      </div>
      <h1 className="text-xl font-extrabold text-gray-800 dark:text-gray-100 tracking-tight">
        Page not found
      </h1>
      <p className="mt-2 text-sm text-gray-400 dark:text-gray-500">
        That page doesn't exist or has moved.
      </p>
      <button
        type="button"
        onClick={() => navigate('/')}
        className="mt-6 btn-primary"
      >
        Go home
      </button>
    </div>
  );
}
