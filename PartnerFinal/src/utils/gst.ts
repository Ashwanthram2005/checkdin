export type GstSlab = {
  rate: number;
  label: string;
  description: string;
};

/**
 * Indian GST slabs for hotel accommodation, applied on the tariff per unit per stay.
 * Up to ₹1,000 — exempt. ₹1,001 to ₹7,500 — 5%. Above ₹7,500 — 18%.
 */
export function gstSlabFor(basePrice: number): GstSlab {
  if (basePrice <= 1000) {
    return { rate: 0, label: 'Exempt (0%)', description: 'Stays priced up to ₹1,000' };
  }
  if (basePrice <= 7500) {
    return { rate: 0.05, label: '5% GST', description: '₹1,001 to ₹7,500' };
  }
  return { rate: 0.18, label: '18% GST', description: 'Above ₹7,500' };
}

export function gstAmount(basePrice: number): number {
  return Math.round(basePrice * gstSlabFor(basePrice).rate);
}

export function priceWithGst(basePrice: number): number {
  return basePrice + gstAmount(basePrice);
}

export function inr(value: number): string {
  return `₹${value.toLocaleString('en-IN')}`;
}