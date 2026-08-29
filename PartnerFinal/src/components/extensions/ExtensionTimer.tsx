import React, { useEffect, useState } from 'react';
import { TimerIcon } from 'lucide-react';

type ExtensionTimerProps = {
  seconds: number;
  onExpire: () => void;
};

const format = (value: number) =>
`${String(Math.floor(value / 60)).padStart(2, '0')}:${String(value % 60).padStart(2, '0')}`;

export function ExtensionTimer({ seconds, onExpire }: ExtensionTimerProps) {
  const [left, setLeft] = useState(seconds);

  useEffect(() => {
    if (left <= 0) {
      onExpire();
      return;
    }
    const timer = window.setTimeout(() => setLeft((prev) => prev - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [left, onExpire]);

  const urgent = left <= 60;
  const progress = Math.max(0, Math.min(100, left / seconds * 100));

  return (
    <div
      className={[
      'rounded-2xl border px-4 py-3.5',
      urgent ? 'border-red-200 bg-red-50' : 'border-neutral-200 bg-neutral-50'].
      join(' ')}>
      
      <p className="flex items-center gap-1.5 text-[11px] font-bold tracking-wide text-ink-muted">
        <TimerIcon size={13} aria-hidden="true" />
        RESPOND WITHIN
      </p>
      <p
        aria-live="polite"
        className={[
        'mt-1.5 font-mono text-[34px] font-bold leading-none tracking-tight tabular-nums',
        urgent ? 'text-red-600' : 'text-ink'].
        join(' ')}>
        
        {format(Math.max(0, left))}
      </p>
      <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-white">
        <div
          className={`h-full rounded-full transition-[width] duration-1000 ease-linear ${
          urgent ? 'bg-red-500' : 'bg-ink'}`
          }
          style={{ width: `${progress}%` }} />
        
      </div>
      <p className="mt-2.5 text-[11.5px] leading-relaxed text-ink-muted">
        If no action is taken within 5 minutes, the extension request will automatically expire.
      </p>
    </div>);

}