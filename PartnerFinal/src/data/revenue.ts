export type PaymentState = 'Settled' | 'Processing' | 'Pending';

export type Earning = {
  id: string;
  date: string;
  bookingId: string;
  guest: string;
  duration: '3 Hours' | '6 Hours' | '12 Hours';
  gross: number;
  commission: number;
  net: number;
  status: PaymentState;
};

export const revenueSummary = {
  today: 18450,
  month: 485620,
  pendingPayout: 42850,
  availableBalance: 86450,
  todayGrowth: 22,
  monthGrowth: 16
};

export const commissionRate = 0.12;

export const durationRevenue = [
{ key: '3h', label: '3 Hour Revenue', bookings: 140, revenue: 139860, color: '#D4E82A' },
{ key: '6h', label: '6 Hour Revenue', bookings: 94, revenue: 140906, color: '#1F6B33' },
{ key: '12h', label: '12 Hour Revenue', bookings: 47, revenue: 103353, color: '#9CA3AF' }];


export const earnings: Earning[] = [
{
  id: 'e1',
  date: '16 Aug 2026',
  bookingId: 'CHK2451',
  guest: 'Arun Kumar',
  duration: '3 Hours',
  gross: 1199,
  commission: 144,
  net: 1055,
  status: 'Pending'
},
{
  id: 'e2',
  date: '16 Aug 2026',
  bookingId: 'CHK2449',
  guest: 'Priya Sharma',
  duration: '6 Hours',
  gross: 1799,
  commission: 216,
  net: 1583,
  status: 'Processing'
},
{
  id: 'e3',
  date: '16 Aug 2026',
  bookingId: 'CHK2444',
  guest: 'Rahul Verma',
  duration: '12 Hours',
  gross: 2599,
  commission: 312,
  net: 2287,
  status: 'Processing'
},
{
  id: 'e4',
  date: '15 Aug 2026',
  bookingId: 'CHK2441',
  guest: 'Vikram Raj',
  duration: '6 Hours',
  gross: 1799,
  commission: 216,
  net: 1583,
  status: 'Settled'
},
{
  id: 'e5',
  date: '15 Aug 2026',
  bookingId: 'CHK2437',
  guest: 'Imran Sheikh',
  duration: '3 Hours',
  gross: 999,
  commission: 120,
  net: 879,
  status: 'Settled'
},
{
  id: 'e6',
  date: '14 Aug 2026',
  bookingId: 'CHK2428',
  guest: 'Ravi Shankar',
  duration: '6 Hours',
  gross: 1899,
  commission: 228,
  net: 1671,
  status: 'Settled'
},
{
  id: 'e7',
  date: '14 Aug 2026',
  bookingId: 'CHK2421',
  guest: 'Divya Ramesh',
  duration: '12 Hours',
  gross: 2599,
  commission: 312,
  net: 2287,
  status: 'Settled'
},
{
  id: 'e8',
  date: '13 Aug 2026',
  bookingId: 'CHK2414',
  guest: 'Sneha Iyer',
  duration: '3 Hours',
  gross: 1199,
  commission: 144,
  net: 1055,
  status: 'Settled'
},
{
  id: 'e9',
  date: '13 Aug 2026',
  bookingId: 'CHK2409',
  guest: 'Lakshmi Devi',
  duration: '6 Hours',
  gross: 1799,
  commission: 216,
  net: 1583,
  status: 'Settled'
},
{
  id: 'e10',
  date: '12 Aug 2026',
  bookingId: 'CHK2402',
  guest: 'Nikhil Menon',
  duration: '12 Hours',
  gross: 2699,
  commission: 324,
  net: 2375,
  status: 'Settled'
}];


export const revenueInsights = [
'Evening slots (6 PM – 12 AM) bring 41% of monthly revenue — consider a small weekend surcharge.',
'12 hour stays are only 15% of bookings but 27% of revenue.',
'Repeat guests grew 32% this month; their average spend is ₹280 higher.'];