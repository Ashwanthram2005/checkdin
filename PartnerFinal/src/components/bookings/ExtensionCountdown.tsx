import React, { useEffect, useRef, useState } from 'react';
import { HourglassIcon } from 'lucide-react';

type ExtensionCountdownProps = {
  seconds: number;
  onExpire: () => void;
  compact?: boolean;
};

const format = (value: number) =>
`${String(Math.floor(value / 60)).padStart(2, '0')}:${String(value % 60).padStart(2, '0')}`;

/** Green above 3 minutes, orange under 3, red inside the last minute. */
const toneFor = (left: number) =>
left >= 180 ?
{ chip: 'bg-lime-100 text-lime-700', bar: 'bg-lime-500', text: 'text-lime-700' } :
left >= 60 ?
{ chip: 'bg-amber-50 text-amber-700', bar: 'bg-amber-500', text: 'text-amber-700' } :
{ chip: 'bg-red-50 text-red-600', bar: 'bg-red-500', text: 'text-red-600' };

export function ExtensionCountdown({ seconds, onExpire, compact = false }: ExtensionCountdownProps) {
  const [left, setLeft] = useState(seconds);
  const fired = useRef(false);

  useEffect(() => {
    setLeft(seconds);
    fired.current = false;
  }, [seconds]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setLeft((prev) => {
        if (prev <= 1) {
          if (!fired.current) {
            fired.current = true;
            onExpire();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [onExpire]);

  const tone = toneFor(left);

  if (compact) {
    return (
      <span
        role="timer"
        className={`inline-flex items-center gap-1.5 rounded-md px-2 py-1 font-mono text-[11.5px] font-semibold tabular-nums ${tone.chip}`}>
        
        <HourglassIcon size={11} aria-hidden="true" />
        {format(left)}
      </span>);

  }

  return (
    <div className="rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3">
      <p className="text-[11px] font-bold tracking-wide text-ink-muted">APPROVAL WINDOW</p>
      <p
        role="timer"
        aria-live="polite"
        className={`mt-1.5 flex items-baseline gap-2 font-mono text-[30px] font-bold leading-none tracking-tight tabular-nums ${tone.text}`}>
        
        {format(left)}
        <span className="font-sans text-[12px] font-medium text-ink-muted">remaining</span>
      </p>
      <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-white">
        <div
          className={`h-full rounded-full transition-[width] duration-1000 ease-linear ${tone.bar}`}
          style={{ width: `${Math.max(0, Math.min(100, left / 300 * 100))}%` }} />
        
      </div>
      <p className="mt-2 text-[11.5px] text-ink-muted">
        No action within the window expires the request automatically.
      </p>
    </div>);

}