/** Module 4 — hotel visibility and control. */
export type HotelStatus = 'Live' | 'Bookings Paused' | 'Offline';

export const hotelStatusOptions: {
  id: HotelStatus;
  dot: string;
  headline: string;
  description: string;
}[] = [
{
  id: 'Live',
  dot: 'bg-lime-400',
  headline: 'Visible & accepting bookings',
  description: 'Guests can find you in search and book any open slot.'
},
{
  id: 'Bookings Paused',
  dot: 'bg-amber-400',
  headline: 'Visible but not accepting new bookings',
  description: 'You stay in search results, existing bookings continue, no new ones come in.'
},
{
  id: 'Offline',
  dot: 'bg-red-500',
  headline: 'Hidden from the platform',
  description: 'You disappear from guest search until you switch back on.'
}];


export const pauseDurations = ['Today only', '1 day', '3 days', '7 days', 'Custom range'];

export const vacationReasons = [
'Renovation',
'Maintenance',
'Temporary closure',
'Staff shortage'];


export const bookingPreferences = [
{ id: 'search', label: 'Show in search', description: 'Appear in guest search results.' },
{ id: 'new', label: 'Accept new bookings', description: 'Take fresh slot bookings.' },
{ id: 'sameDay', label: 'Accept same-day bookings', description: 'Allow bookings for today.' },
{ id: 'hourly', label: 'Accept hourly bookings', description: '3, 6 and 12 hour slots.' },
{
  id: 'extensions',
  label: 'Accept extension requests',
  description: 'Let in-house guests ask to stay longer.'
}];


export const visibilityAnalytics = {
  daysOnline: 26,
  daysPaused: 3,
  daysOffline: 2,
  missedRevenue: 34800,
  missedBookings: 41
};

/** Module 10 — notifications and operations centre. */
export type AlertPriority = 'Critical' | 'High' | 'Normal';

export type OpsAlert = {
  id: string;
  priority: AlertPriority;
  type: string;
  title: string;
  detail: string;
  time: string;
  unread: boolean;
};

export const opsAlerts: OpsAlert[] = [
{
  id: 'n1',
  priority: 'Critical',
  type: 'Extension Request',
  title: 'Rahul Sharma requests +3 hours',
  detail: 'Booking CHK123456 • ₹450 additional revenue • 5 minute window',
  time: '2 minutes ago',
  unread: true
},
{
  id: 'n2',
  priority: 'Critical',
  type: 'Payment Failure',
  title: 'Card declined on CHK2435',
  detail: 'Sanjay Kumar • ₹999 • retry link sent to guest',
  time: '18 minutes ago',
  unread: true
},
{
  id: 'n3',
  priority: 'High',
  type: 'New Booking',
  title: 'Imran Sheikh booked a 6 hour slot',
  detail: 'Tonight, 7:00 PM – 1:00 AM • ₹1,899 paid',
  time: '34 minutes ago',
  unread: true
},
{
  id: 'n4',
  priority: 'High',
  type: 'Refund Request',
  title: 'Refund requested on CHK2438',
  detail: 'Divya Ramesh • ₹2,599 • cancelled 8 hours before check-in',
  time: '1 hour ago',
  unread: false
},
{
  id: 'n5',
  priority: 'Normal',
  type: 'Check-In',
  title: 'Rahul Verma checked in',
  detail: '12 hour slot • checked in by Priya at reception',
  time: '2 hours ago',
  unread: false
},
{
  id: 'n6',
  priority: 'Normal',
  type: 'Check-Out',
  title: 'Vikram Raj checked out',
  detail: 'Slot released and sent for housekeeping',
  time: '3 hours ago',
  unread: false
},
{
  id: 'n7',
  priority: 'Normal',
  type: 'Status Change',
  title: 'Bookings resumed automatically',
  detail: 'Scheduled 1 day pause ended at 6:00 AM',
  time: 'Yesterday',
  unread: false
},
{
  id: 'n8',
  priority: 'High',
  type: 'Cancellation',
  title: 'Meera Nair cancelled CHK2432',
  detail: '6 hour slot • ₹1,799 • reason: change of plans',
  time: 'Yesterday',
  unread: false
}];


/** Module 11 — guest communication. */
export type MessageTemplate = {
  id: string;
  label: string;
  subject: string;
  body: string;
};

export const messageTemplates: MessageTemplate[] = [
{
  id: 'breakfast',
  label: 'Breakfast notification',
  subject: 'Breakfast is served until 10:30 AM',
  body: 'Good morning! Complimentary breakfast is served in the lobby restaurant until 10:30 AM. Show your booking ID at the counter.'
},
{
  id: 'maintenance',
  label: 'Maintenance notice',
  subject: 'Brief maintenance work today',
  body: 'We are carrying out short maintenance work between 2 PM and 4 PM. There may be brief noise on the upper floors. Thank you for your patience.'
},
{
  id: 'checkout',
  label: 'Check-out reminder',
  subject: 'Your slot ends in 30 minutes',
  body: 'A quick reminder that your stay ends in 30 minutes. Need more time? Request an extension from the Checkdin app and we will confirm right away.'
},
{
  id: 'offer',
  label: 'Special offer',
  subject: 'Come back for 15% off',
  body: 'Thanks for staying with us. Book any weekday 3 hour slot this month and get 15% off with code STAYAGAIN.'
}];


export const audienceOptions = ['Active guests', 'Future guests', 'Selected guests'] as const;

export type SentMessage = {
  id: string;
  subject: string;
  audience: string;
  recipients: number;
  sentAt: string;
  delivered: number;
  read: number;
};

export const sentMessages: SentMessage[] = [
{
  id: 'm1',
  subject: 'Your slot ends in 30 minutes',
  audience: 'Active guests',
  recipients: 14,
  sentAt: 'Today, 3:10 PM',
  delivered: 14,
  read: 11
},
{
  id: 'm2',
  subject: 'Breakfast is served until 10:30 AM',
  audience: 'Active guests',
  recipients: 19,
  sentAt: 'Today, 7:00 AM',
  delivered: 19,
  read: 16
},
{
  id: 'm3',
  subject: 'Come back for 15% off',
  audience: 'Future guests',
  recipients: 212,
  sentAt: 'Yesterday, 6:30 PM',
  delivered: 208,
  read: 97
}];


/** Module 13 — hotel performance score. */
export const performanceScore = {
  score: 92,
  band: 'Excellent',
  factors: [
  { id: 'occupancy', label: 'Occupancy', value: 76, weight: 20, contribution: 18 },
  { id: 'reviews', label: 'Reviews', value: 94, weight: 20, contribution: 19 },
  { id: 'acceptance', label: 'Booking acceptance', value: 96, weight: 15, contribution: 14 },
  { id: 'extension', label: 'Extension approval', value: 72, weight: 15, contribution: 11 },
  { id: 'response', label: 'Response time', value: 98, weight: 15, contribution: 15 },
  { id: 'cancellation', label: 'Cancellation rate', value: 94, weight: 15, contribution: 15 }],

  badges: [
  { id: 'top', label: 'Top Performer', icon: '🏆' },
  { id: 'fast', label: 'Fast Responder', icon: '⚡' },
  { id: 'revenue', label: 'Revenue Leader', icon: '💰' }]

};

/** Module 17 — multi-property. */
export type PortfolioProperty = {
  id: string;
  name: string;
  city: string;
  revenue: number;
  occupancy: number;
  extensions: number;
  extensionRevenue: number;
  score: number;
  status: HotelStatus;
};

export const portfolio: PortfolioProperty[] = [
{
  id: 'chk-empire-017',
  name: 'Hotel Empire Stay',
  city: 'Chennai',
  revenue: 485620,
  occupancy: 76,
  extensions: 89,
  extensionRevenue: 48750,
  score: 92,
  status: 'Live'
},
{
  id: 'chk-empire-021',
  name: 'Empire Stay Express',
  city: 'Coimbatore',
  revenue: 318400,
  occupancy: 68,
  extensions: 54,
  extensionRevenue: 27900,
  score: 86,
  status: 'Live'
},
{
  id: 'chk-empire-024',
  name: 'Empire Stay Airport',
  city: 'Bengaluru',
  revenue: 402100,
  occupancy: 81,
  extensions: 96,
  extensionRevenue: 55200,
  score: 89,
  status: 'Bookings Paused'
},
{
  id: 'chk-empire-030',
  name: 'Empire Stay Marina',
  city: 'Chennai',
  revenue: 164300,
  occupancy: 47,
  extensions: 21,
  extensionRevenue: 9400,
  score: 71,
  status: 'Live'
}];