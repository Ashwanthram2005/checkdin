import { addHours, format, parse } from 'date-fns';

export function inr(amount: number): string {
  return `₹${amount.toLocaleString('en-IN')}`;
}

/** Money with paise, e.g. ₹106.82 — used for part-payment amounts. */
export function inrExact(amount: number): string {
  return `₹${amount.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;
}

export function toTimeLabel(time: string): string {
  const parsed = parse(time, 'HH:mm', new Date());
  return format(parsed, 'h:mm a');
}

export function checkoutTime(checkIn: string, duration: number): string {
  const parsed = parse(checkIn, 'HH:mm', new Date());
  return format(addHours(parsed, duration), 'h:mm a');
}

export function crossesMidnight(checkIn: string, duration: number): boolean {
  const [h] = checkIn.split(':').map(Number);
  return h + duration >= 24;
}

export function dateLabel(iso: string): string {
  const parsed = parse(iso, 'yyyy-MM-dd', new Date());
  return format(parsed, 'EEE, d MMM');
}

export function todayIso(): string {
  return format(new Date(), 'yyyy-MM-dd');
}

export function bookingRef(): string {
  return `CD${Math.floor(100000 + Math.random() * 899999)}`;
}

/** Six-digit code the guest must show at the desk to start their slot. */
export function checkInOtpCode(): string {
  return String(Math.floor(100000 + Math.random() * 899999));
}