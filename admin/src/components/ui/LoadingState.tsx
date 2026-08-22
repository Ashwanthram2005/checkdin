import React from 'react';
import { AlertTriangleIcon } from 'lucide-react';
import { Button } from './Button';

export function TableSkeleton({ rows = 6 }: {rows?: number;}) {
  return (
    <div className="divide-y divide-line" aria-busy="true" aria-label="Loading rows">
      {Array.from({ length: rows }, (_, index) =>
      <div key={index} className="flex items-center gap-4 px-5 py-3.5">
          <div className="h-8 w-8 animate-pulse rounded-full bg-faint" />
          <div className="h-3 w-2/5 animate-pulse rounded-full bg-faint" />
          <div className="ml-auto h-3 w-16 animate-pulse rounded-full bg-faint" />
          <div className="h-5 w-20 animate-pulse rounded-md bg-faint" />
        </div>
      )}
    </div>);

}

export function BlockSkeleton({ className = 'h-64' }: {className?: string;}) {
  return <div className={`animate-pulse rounded-xl bg-faint ${className}`} aria-busy="true" />;
}

export function ErrorState({ message, onRetry }: {message: string;onRetry?: () => void;}) {
  return (
    <div className="flex flex-col items-center gap-2 px-6 py-14 text-center">
      <AlertTriangleIcon className="h-6 w-6 text-negative" />
      <p className="text-sm font-semibold text-ink">Something went wrong</p>
      <p className="max-w-sm text-[13px] text-muted">{message}</p>
      {onRetry ?
      <Button size="sm" className="mt-2" onClick={onRetry}>
          Try again
        </Button> :
      null}
    </div>);

}