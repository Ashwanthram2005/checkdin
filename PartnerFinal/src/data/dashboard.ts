export const ROOM_IMAGES = {
  deluxe: "/2b1dcc59-0d5f-4ed7-9fd4-4b9e03137403.jpg",
  premium: "/d00f852e-23e5-4e53-bec4-acbe93fe6c9d.jpg",
  suite: "/55a9449f-aa07-43df-b3ea-678958124c88.jpg"
};

export const HOTEL_THUMB = "/2562a314-df22-4672-8b3c-9e0beeae84dc.jpg";


export const PARTNER_AVATAR = "/81e8f563-4069-4b95-a8de-e1afe35ddcd2.jpg";


export type BookingStatus = 'Confirmed' | 'Checked-in' | 'Upcoming';

export type Booking = {
  id: string;
  guest: string;
  /** Slot category — Checkdin never exposes a specific room. */
  room: string;
  duration: string;
  checkIn: string;
  amount: number;
  status: BookingStatus;
  image: string;
};

export const todaysBookings: Booking[] = [
{
  id: 'b1',
  guest: 'Arun Kumar',
  room: 'Deluxe Room 101',
  duration: '3 Hours',
  checkIn: '2:00 PM',
  amount: 1199,
  status: 'Confirmed',
  image: ROOM_IMAGES.deluxe
},
{
  id: 'b2',
  guest: 'Priya Sharma',
  room: 'Deluxe Room 103',
  duration: '6 Hours',
  checkIn: '4:00 PM',
  amount: 1799,
  status: 'Confirmed',
  image: ROOM_IMAGES.suite
},
{
  id: 'b3',
  guest: 'Rahul Verma',
  room: 'Premium Room 201',
  duration: '12 Hours',
  checkIn: '6:00 PM',
  amount: 2599,
  status: 'Checked-in',
  image: ROOM_IMAGES.premium
},
{
  id: 'b4',
  guest: 'Sneha Iyer',
  room: 'Deluxe Room 105',
  duration: '3 Hours',
  checkIn: '8:00 PM',
  amount: 1199,
  status: 'Upcoming',
  image: ROOM_IMAGES.deluxe
},
{
  id: 'b5',
  guest: 'Vikram Raj',
  room: 'Premium Room 202',
  duration: '6 Hours',
  checkIn: '10:00 PM',
  amount: 1799,
  status: 'Upcoming',
  image: ROOM_IMAGES.premium
}];


export const revenueTrend = [
{ date: '10 Aug', revenue: 6200 },
{ date: '11 Aug', revenue: 10400 },
{ date: '12 Aug', revenue: 10100 },
{ date: '13 Aug', revenue: 14800 },
{ date: '14 Aug', revenue: 12600 },
{ date: '15 Aug', revenue: 16300 },
{ date: '16 Aug', revenue: 18450 }];


export const durationBreakdown = [
{ label: '3 Hours', value: 140, share: 45, color: '#D4E82A' },
{ label: '6 Hours', value: 94, share: 30, color: '#1F6B33' },
{ label: '12 Hours', value: 47, share: 15, color: '#C9C9C9' },
{ label: '24 Hours', value: 31, share: 10, color: '#E8E8E8' }];


export const revenueOverview = [
{ label: 'This Month', value: '₹ 4,85,620', delta: '16% vs last month', positive: true },
{ label: 'Last Month', value: '₹ 4,18,240', delta: null, positive: true },
{ label: 'This Quarter', value: '₹ 12,45,880', delta: '20% vs last quarter', positive: true },
{ label: 'Total Earnings', value: '₹ 28,75,430', delta: null, positive: true, note: 'All time' }];