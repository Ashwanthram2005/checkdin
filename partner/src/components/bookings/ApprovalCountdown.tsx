import React, { useEffect, useRef, useState } from 'react';
import { TimerIcon } from 'lucide-react';
import { countdownTone, formatCountdown } from '../../utils/bookingTime';

type ApprovalCountdownProps = {
  seconds: number;
  onExpire: () => void;
  compact?: boolean;
};

const tones = {
  critical: 'bg-red-50 text-red-600',
  warning: 'bg-amber-50 text-amber-700',
  calm: 'bg-neutral-100 text-ink-soft'
};

export function ApprovalCountdown({ seconds, onExpire, compact = false }: ApprovalCountdownProps) {
  const [left, setLeft] = useState(seconds);
  const expired = useRef(false);

  useEffect(() => {
    setLeft(seconds);
    expired.current = false;
  }, [seconds]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setLeft((prev) => {
        if (prev <= 1) {
          if (!expired.current) {
            expired.current = true;
            onExpire();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [onExpire]);

  const tone = tones[countdownTone(left)];

  return (
    <span
      role="timer"
      aria-live="off"
      className={`inline-flex items-center gap-1.5 rounded-md px-2 py-1 font-mono ${compact ? 'text-[11.5px]' : 'text-[12.5px]'} font-semibold tabular-nums ${tone}`}>
      
      <TimerIcon size={12} aria-hidden="true" />
      {formatCountdown(left)}
    </span>);

}