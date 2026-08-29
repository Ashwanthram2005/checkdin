import React, { useEffect, useState } from 'react';

type LiveClockProps = {
  className?: string;
};

export function LiveClock({ className = '' }: LiveClockProps) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const day = now.toLocaleDateString('en-GB', { weekday: 'long' });
  const date = now.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  const time = now.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  });

  return (
    <p className={`flex flex-wrap items-center gap-x-3 gap-y-1 ${className}`}>
      <span className="text-[13px] font-medium text-ink">
        {day}, {date}
      </span>
      <span aria-hidden="true" className="hidden h-3.5 w-px bg-neutral-300 sm:block" />
      <span
        role="timer"
        aria-label={`Current time ${time}`}
        className="font-mono text-[13px] font-semibold tabular-nums text-ink">
        
        {time}
      </span>
    </p>);

}