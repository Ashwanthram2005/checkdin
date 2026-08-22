import type { Duration } from '../types/booking';

export const daySlots = [
'00:00',
'02:00',
'04:00',
'06:00',
'08:00',
'10:00',
'12:00',
'14:00',
'16:00',
'18:00',
'20:00',
'22:00'];


/** Deterministic pseudo-availability so a room always shows the same open slots. */
export function isSlotAvailable(
hotelId: string,
slot: string,
duration: Duration)
: boolean {
  const seed =
  hotelId.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) +
  Number(slot.slice(0, 2)) * 7 +
  duration;
  return seed % 5 !== 0;
}