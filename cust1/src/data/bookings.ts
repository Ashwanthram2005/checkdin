import type { Duration } from '../types/booking';

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

/** Dummy history so the bookings screen has something to show. */
export const pastBookings: BookingRecord[] = [
{
  id: 'b-1042',
  reference: 'CD481203',
  hotelId: 'porur-nap-rooms',
  date: '2026-08-16',
  checkIn: '14:00',
  duration: 6,
  guests: 2,
  amount: 878,
  status: 'ongoing',
  otp: '449213'
},
{
  id: 'b-1038',
  reference: 'CD470991',
  hotelId: 'ramapuram-olive',
  date: '2026-08-09',
  checkIn: '10:00',
  duration: 3,
  guests: 1,
  amount: 1348,
  status: 'completed',
  rated: 5
},
{
  id: 'b-1031',
  reference: 'CD463847',
  hotelId: 'maduravoyal-transit',
  date: '2026-07-28',
  checkIn: '22:00',
  duration: 12,
  guests: 2,
  amount: 1698,
  status: 'completed',
  rated: 4
},
{
  id: 'b-1024',
  reference: 'CD455120',
  hotelId: 'virugambakkam-studio',
  date: '2026-07-14',
  checkIn: '08:00',
  duration: 3,
  guests: 1,
  amount: 598,
  status: 'completed'
},
{
  id: 'b-1019',
  reference: 'CD448765',
  hotelId: 'mugalivakkam-verandah',
  date: '2026-07-02',
  checkIn: '16:00',
  duration: 6,
  guests: 2,
  amount: 1978,
  status: 'cancelled'
}];