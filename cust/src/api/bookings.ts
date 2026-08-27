import api from './client';
import type { Duration } from '../types/booking';

export interface ApiBooking {
  id: string;
  reference: string;
  hotel_id: string;
  date: string;
  check_in: string;
  duration: number;
  guests: number;
  amount: number;
  status: string;
  otp?: string;
  rated?: number | null;
  customer_id: string;
}

export type BookingStatus = 'ongoing' | 'completed' | 'cancelled';

export interface BookingRecord {
  id: string;
  reference: string;
  hotelId: string;
  date: string;
  checkIn: string;
  duration: Duration;
  guests: number;
  amount: number;
  status: BookingStatus;
  otp?: string;
  rated?: number;
}

interface BookingsResponse {
  data: ApiBooking[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

function mapBooking(b: ApiBooking): BookingRecord {
  return {
    id: b.id,
    reference: b.reference,
    hotelId: b.hotel_id,
    date: b.date,
    checkIn: b.check_in,
    duration: b.duration as Duration,
    guests: b.guests,
    amount: b.amount,
    status: (b.status as BookingStatus) || 'ongoing',
    otp: b.otp,
    rated: b.rated ?? undefined,
  };
}

export async function fetchBookings(page = 1, limit = 20): Promise<BookingRecord[]> {
  const res = await api.get<BookingsResponse>('/api/customer/bookings', {
    params: { page, limit },
  });
  return res.data.data.map(mapBooking);
}

export async function fetchBookingById(id: string): Promise<BookingRecord | null> {
  try {
    const res = await api.get<ApiBooking>(`/api/customer/bookings/${id}`);
    return mapBooking(res.data);
  } catch {
    return null;
  }
}

export async function createBooking(data: {
  hotel_id: string;
  date?: string;
  check_in?: string;
  duration?: number;
  guests?: number;
  amount?: number;
}): Promise<{ id: string; reference: string }> {
  const res = await api.post<{ id: string; reference: string }>('/api/customer/bookings', data);
  return res.data;
}

export async function cancelBooking(id: string): Promise<void> {
  await api.post(`/api/customer/bookings/${id}/cancel`);
}

export async function rateBooking(
  id: string,
  data: { rating?: number; title?: string; body?: string }
): Promise<{ review_id: string }> {
  const res = await api.post<{ review_id: string }>(`/api/customer/bookings/${id}/rate`, data);
  return res.data;
}
