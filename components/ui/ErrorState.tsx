'use client';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export default function ErrorState({
  message = 'Something went wrong. Please try again.',
  onRetry,
  className = '',
}: ErrorStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center rounded-lg border border-tv-border bg-tv-surface p-8 text-center ${className}`}
    >
      <svg
        className="mb-4 h-12 w-12 text-tv-live"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
        />
      </svg>
      <p className="mb-4 text-sm text-tv-text-muted">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="rounded-md bg-tv-accent-blue px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-600"
        >
          Try Again
        </button>
      )}
    </div>
  );
}
