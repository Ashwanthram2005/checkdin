import { fetchBookings, type BookingRecord, type BookingStatus } from '../api/bookings';

export type { BookingRecord, BookingStatus };

export async function loadBookings(): Promise<BookingRecord[]> {
  try {
    return await fetchBookings();
  } catch {
    return [];
  }
}
