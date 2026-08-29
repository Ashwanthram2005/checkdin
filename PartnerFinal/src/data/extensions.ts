export type ExtensionStatus = 'Waiting for Approval' | 'Approved' | 'Rejected' | 'Expired';

/** Checkdin sells slots, so capacity is read against allocation — never against a specific room. */
export type CapacityCheck = {available: boolean;message: string;detail?: string;};

export const extensionDurations = [1, 2, 3, 6, 9] as const;

export type ExtensionDuration = (typeof extensionDurations)[number];

export const extensionRejectionReasons = [
'Capacity Unavailable',
'Housekeeping Requirement',
'Operational Constraints',
'Hotel Policy',
'Other'] as
const;

export type ExtensionRequest = {
  id: string;
  guest: string;
  bookingId: string;
  roomType: string;
  currentCheckout: string;
  extraHours: ExtensionDuration;
  requestedCheckout: string;
  additionalRevenue: number;
  requestedAgo: string;
  respondWithin: number;
  status: ExtensionStatus;
  capacity: CapacityCheck;
};

export const extensionRequests: ExtensionRequest[] = [
{
  id: 'ext1',
  guest: 'Rahul Sharma',
  bookingId: 'CHK123456',
  roomType: 'Deluxe slot',
  currentCheckout: '4:00 PM',
  extraHours: 3,
  requestedCheckout: '7:00 PM',
  additionalRevenue: 450,
  requestedAgo: 'Just now',
  respondWithin: 300,
  status: 'Waiting for Approval',
  capacity: {
    available: true,
    message: 'Capacity available for this extension',
    detail: '14 of 18 allocated slots sold in the 4–7 PM window.'
  }
},
{
  id: 'ext2',
  guest: 'Sneha Iyer',
  bookingId: 'CHK123441',
  roomType: 'Deluxe slot',
  currentCheckout: '5:30 PM',
  extraHours: 6,
  requestedCheckout: '11:30 PM',
  additionalRevenue: 900,
  requestedAgo: '2 minutes ago',
  respondWithin: 168,
  status: 'Waiting for Approval',
  capacity: {
    available: false,
    message: 'Capacity is tight in this window',
    detail: '17 of 18 allocated slots already sold between 8 PM and midnight.'
  }
}];


export const extensionSummary = {
  activeBookings: 38,
  todayRevenue: 18450,
  occupancy: 76,
  upcomingCheckIns: 12,
  upcomingCheckOuts: 9
};

/** Module 3 — extension revenue analytics. */
export const extensionRevenueTotals = {
  revenue: 48750,
  count: 89,
  average: 548,
  contribution: 12
};

export const extensionRevenueByDuration = [
{ label: '+1 Hour', hours: 1, count: 32, revenue: 8000, color: '#D9FF3F' },
{ label: '+2 Hours', hours: 2, count: 21, revenue: 10500, color: '#D4E82A' },
{ label: '+3 Hours', hours: 3, count: 18, revenue: 13500, color: '#98A70F' },
{ label: '+6 Hours', hours: 6, count: 12, revenue: 10800, color: '#1F6B33' },
{ label: '+9 Hours', hours: 9, count: 6, revenue: 5950, color: '#8FB800' }];


export const extensionFunnel = {
  requests: 124,
  approved: 89,
  rejected: 21,
  expired: 14,
  approvalRate: 72
};

export const extensionOpportunity = {
  rejectedRevenue: 11550,
  expiredRevenue: 7420,
  get missed() {
    return this.rejectedRevenue + this.expiredRevenue;
  },
  potential: 12800,
  note: 'Answering every request inside 2 minutes would have converted most expiries.'
};

/** Module 9 — extension demand. */
export const extensionHourly = [
{ hour: '9 AM', requests: 2 },
{ hour: '11 AM', requests: 5 },
{ hour: '1 PM', requests: 9 },
{ hour: '3 PM', requests: 18 },
{ hour: '5 PM', requests: 22 },
{ hour: '7 PM', requests: 16 },
{ hour: '9 PM', requests: 11 },
{ hour: '11 PM', requests: 6 }];


export const extensionWeekly = [
{ day: 'Mon', values: [1, 3, 6, 9, 7, 4] },
{ day: 'Tue', values: [1, 2, 5, 8, 6, 3] },
{ day: 'Wed', values: [2, 4, 7, 11, 8, 5] },
{ day: 'Thu', values: [2, 5, 9, 13, 10, 6] },
{ day: 'Fri', values: [3, 7, 12, 18, 14, 9] },
{ day: 'Sat', values: [4, 8, 14, 21, 17, 11] },
{ day: 'Sun', values: [3, 6, 10, 15, 12, 7] }];


export const extensionWeeklyBands = ['9 AM', '12 PM', '3 PM', '5 PM', '8 PM', '11 PM'];

export const extensionDemandHighlights = {
  mostRequested: '+3 Hours',
  mostProfitable: '+3 Hours',
  peakHours: '3 PM – 6 PM',
  busiestDay: 'Saturday'
};