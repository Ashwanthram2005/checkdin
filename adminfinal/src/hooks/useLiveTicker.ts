import { useEffect, useRef, useState } from 'react';

/**
 * Simulates the AdminOS event stream. Emits a tick on an interval so live
 * counters and feeds update without a page refresh, and pauses when the
 * caller turns streaming off.
 */
export function useLiveTicker(intervalMs = 4000, active = true): number {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!active) return;
    const id = window.setInterval(() => setTick((prev) => prev + 1), intervalMs);
    return () => window.clearInterval(id);
  }, [intervalMs, active]);

  return tick;
}

/** A number that drifts upward on every tick, for live KPI counters. */
export function useLiveCounter(base: number, stepRange: number, intervalMs = 4000, active = true): number {
  const [value, setValue] = useState(base);
  const baseRef = useRef(base);

  useEffect(() => {
    if (baseRef.current !== base) {
      baseRef.current = base;
      setValue(base);
    }
  }, [base]);

  useEffect(() => {
    if (!active) return;
    const id = window.setInterval(() => {
      setValue((prev) => prev + Math.round(Math.random() * stepRange));
    }, intervalMs);
    return () => window.clearInterval(id);
  }, [stepRange, intervalMs, active]);

  return value;
}