import type { Duration } from '../types/booking';

/** Checkdin service fee, charged per slot length. No other charges are added. */
export const serviceFees: Record<Duration, number> = {
  3: 49,
  6: 79,
  12: 99
};

/** Amount payable online when the guest chooses to settle the rest at the hotel. */
export const payNowAmounts: Record<Duration, number> = {
  3: 106.82,
  6: 172.22,
  12: 209.88
};

export interface Breakdown {
  base: number;
  serviceFee: number;
  total: number;
  payNow: number;
  payAtHotel: number;
}

export function priceBreakdown(rate: number, duration: Duration): Breakdown {
  const serviceFee = serviceFees[duration];
  const total = rate + serviceFee;
  const payNow = payNowAmounts[duration];
  return {
    base: rate,
    serviceFee,
    total,
    payNow,
    payAtHotel: Math.round((total - payNow) * 100) / 100
  };
}

/** Headline price shown on cards: room rate plus the service fee. */
export function slotPrice(rate: number, duration: Duration): number {
  return rate + serviceFees[duration];
}