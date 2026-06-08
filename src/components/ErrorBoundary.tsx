import { Component, type ReactNode } from 'react';

interface Props { children: ReactNode }
interface State { error: Error | null }

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <div className="flex min-h-svh flex-col items-center justify-center px-6 text-center">
          <div className="mb-4 text-4xl">💔</div>
          <h1 className="text-xl font-extrabold text-gray-800 dark:text-gray-100 tracking-tight">
            Something went wrong
          </h1>
          <p className="mt-2 text-sm text-gray-400 dark:text-gray-500 max-w-xs">
            The app ran into an unexpected error. Your data is safe.
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-6 btn-primary"
          >
            Reload app
          </button>
          <details className="mt-4 max-w-sm text-left">
            <summary className="text-xs text-gray-400 cursor-pointer">Technical details</summary>
            <pre className="mt-2 text-[10px] text-red-500 dark:text-red-400 whitespace-pre-wrap break-all">
              {this.state.error.message}
            </pre>
          </details>
        </div>
      );
    }
    return this.props.children;
  }
}
