export type DurationKey = '3h' | '6h' | '12h';

export const durationLabels: Record<DurationKey, string> = {
  '3h': '3 Hours',
  '6h': '6 Hours',
  '12h': '12 Hours'
};

export const durationKeys: DurationKey[] = ['3h', '6h', '12h'];

export type SlotPricing = {
  basePrices: Record<DurationKey, number>;
  extraHour: number;
  weekendSurcharge: number;
  active: Record<DurationKey, boolean>;
};

/** Hourly stays are priced per slot for the whole property — there are no room categories. */
export const slotPricing: SlotPricing = {
  basePrices: { '3h': 999, '6h': 1499, '12h': 2199 },
  extraHour: 249,
  weekendSurcharge: 10,
  active: { '3h': true, '6h': true, '12h': true }
};