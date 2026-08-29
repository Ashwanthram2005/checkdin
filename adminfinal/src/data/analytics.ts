export const revenueTrend = Array.from({ length: 14 }, (_, index) => ({
  label: `${6 + index} Aug`,
  revenue: 980000 + index * 41000 + index % 3 * 88000,
  target: 1120000
}));

export const bookingTrend = Array.from({ length: 14 }, (_, index) => ({
  label: `${6 + index} Aug`,
  confirmed: 320 + index * 11 + index % 4 * 22,
  cancelled: 34 + index % 5 * 6
}));

export const occupancyTrend = [
{ label: 'Chennai', occupancy: 74, capacity: 80 },
{ label: 'Bengaluru', occupancy: 79, capacity: 80 },
{ label: 'Mumbai', occupancy: 90, capacity: 82 },
{ label: 'New Delhi', occupancy: 63, capacity: 78 },
{ label: 'Hyderabad', occupancy: 58, capacity: 76 },
{ label: 'Goa', occupancy: 95, capacity: 84 },
{ label: 'Jaipur', occupancy: 44, capacity: 72 }];


export const durationSplit = [
{ label: '3 hours', value: 45, count: 140 },
{ label: '6 hours', value: 22, count: 68 },
{ label: '12 hours', value: 14, count: 44 },
{ label: 'Full night', value: 19, count: 59 }];


export const channelSplit = [
{ label: 'Android App', value: 38 },
{ label: 'Website', value: 27 },
{ label: 'iOS App', value: 21 },
{ label: 'Partner Desk', value: 9 },
{ label: 'Walk-in', value: 5 }];


export const dashboardKpis = [
{ key: 'bookings', label: 'Total Bookings', value: '18,422', delta: 12.4, hint: 'vs last month' },
{ key: 'checkins', label: "Today's Check-ins", value: '286', delta: 6.1, hint: 'vs yesterday' },
{ key: 'checkouts', label: "Today's Check-outs", value: '241', delta: -3.4, hint: 'vs yesterday' },
{ key: 'properties', label: 'Active Properties', value: '7', delta: 2.0, hint: '3 pending approval' },
{ key: 'partners', label: 'Active Partners', value: '6', delta: 4.8, hint: '3 pending KYC' },
{ key: 'revenue', label: 'Revenue (MTD)', value: '₹4.12Cr', delta: 14.2, hint: 'vs last month' },
{ key: 'occupancy', label: 'Occupancy Rate', value: '74%', delta: 5.3, hint: 'platform average' },
{ key: 'payouts', label: 'Pending Payouts', value: '₹18.4L', delta: -8.2, hint: '6 awaiting approval' }];