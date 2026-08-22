export const revenueSeries = {
  daily: [
  { label: '10 Aug', value: 6200 },
  { label: '11 Aug', value: 10400 },
  { label: '12 Aug', value: 10100 },
  { label: '13 Aug', value: 14800 },
  { label: '14 Aug', value: 12600 },
  { label: '15 Aug', value: 16300 },
  { label: '16 Aug', value: 18450 }],

  weekly: [
  { label: 'W28', value: 66150 },
  { label: 'W29', value: 58900 },
  { label: 'W30', value: 74200 },
  { label: 'W31', value: 81300 },
  { label: 'W32', value: 76400 },
  { label: 'W33', value: 88850 }],

  monthly: [
  { label: 'Mar', value: 342000 },
  { label: 'Apr', value: 378500 },
  { label: 'May', value: 401200 },
  { label: 'Jun', value: 389700 },
  { label: 'Jul', value: 418240 },
  { label: 'Aug', value: 485620 }]

};

export const revenueTotals = {
  daily: 18450,
  weekly: 88850,
  monthly: 485620,
  dailyGrowth: 13,
  weeklyGrowth: 16,
  monthlyGrowth: 16
};

export const bookingSeries = [
{ label: '10 Aug', confirmed: 22, completed: 19, cancelled: 3 },
{ label: '11 Aug', confirmed: 28, completed: 25, cancelled: 2 },
{ label: '12 Aug', confirmed: 26, completed: 24, cancelled: 4 },
{ label: '13 Aug', confirmed: 34, completed: 31, cancelled: 2 },
{ label: '14 Aug', confirmed: 30, completed: 27, cancelled: 5 },
{ label: '15 Aug', confirmed: 38, completed: 35, cancelled: 3 },
{ label: '16 Aug', confirmed: 42, completed: 36, cancelled: 2 }];


export const bookingTotals = {
  total: 312,
  confirmed: 220,
  completed: 197,
  cancelled: 21
};

export const occupancySeries = [
{ label: '10 Aug', value: 58 },
{ label: '11 Aug', value: 64 },
{ label: '12 Aug', value: 61 },
{ label: '13 Aug', value: 72 },
{ label: '14 Aug', value: 69 },
{ label: '15 Aug', value: 78 },
{ label: '16 Aug', value: 76 }];


export const occupancyTotals = {
  current: 76,
  daily: 76,
  weekly: 68,
  monthly: 71
};

export const peakHours = [
{ label: '6 AM', value: 12 },
{ label: '9 AM', value: 24 },
{ label: '12 PM', value: 41 },
{ label: '3 PM', value: 58 },
{ label: '6 PM', value: 82 },
{ label: '9 PM', value: 95 },
{ label: '12 AM', value: 47 },
{ label: '3 AM', value: 18 }];


export const guestTotals = {
  total: 486,
  newGuests: 312,
  repeatGuests: 174,
  repeatRate: 36
};

export const guestSeries = [
{ label: 'Mar', newGuests: 42, repeatGuests: 18 },
{ label: 'Apr', newGuests: 48, repeatGuests: 22 },
{ label: 'May', newGuests: 55, repeatGuests: 26 },
{ label: 'Jun', newGuests: 51, repeatGuests: 29 },
{ label: 'Jul', newGuests: 58, repeatGuests: 34 },
{ label: 'Aug', newGuests: 58, repeatGuests: 45 }];


export const durationAnalysis = [
{ key: '3h', label: '3 Hours', bookings: 140, revenue: 139860, share: 45, color: '#D4E82A' },
{ key: '6h', label: '6 Hours', bookings: 94, revenue: 140906, share: 30, color: '#1F6B33' },
{ key: '12h', label: '12 Hours', bookings: 47, revenue: 103353, share: 15, color: '#9CA3AF' }];


export const reportRanges = [
'Today',
'Last 7 Days',
'Last 30 Days',
'This Month',
'Custom Range'] as
const;