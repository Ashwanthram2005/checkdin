export type BookingStatus =
'Pending Approval' |
'Confirmed' |
'Checked In' |
'Checked Out' |
'Cancelled' |
'Rejected' |
'No Show' |
'Expired';

export type PaymentStatus = 'Paid' | 'Pending' | 'Pay at hotel' | 'Refunded' | 'Failed';

export type DurationLabel = '3 Hours' | '6 Hours' | '12 Hours';

export type TimelineEntry = {id: string;label: string;time: string;done: boolean;};

export type Booking = {
  id: string;
  guest: string;
  phone: string;
  email: string;
  room: string;
  roomType: string;
  bookedOn: string;
  checkInDate: string;
  checkInTime: string;
  checkOutTime: string;
  duration: DurationLabel;
  guests: {adults: number;children: number;};
  baseAmount: number;
  gstAmount: number;
  total: number;
  paymentStatus: PaymentStatus;
  paymentMethod: string;
  status: BookingStatus;
  /** Seconds left on the manual-approval window. Null when approval is not pending. */
  approvalSeconds: number | null;
  idProof: string;
  specialRequests: string;
  internalNote: string;
  timeline: TimelineEntry[];
};

export const bookingStatuses: BookingStatus[] = [
'Pending Approval',
'Confirmed',
'Checked In',
'Checked Out',
'Cancelled',
'No Show',
'Expired'];


export const paymentStatuses: PaymentStatus[] = [
'Paid',
'Pending',
'Pay at hotel',
'Refunded',
'Failed'];


export const durationOptions: DurationLabel[] = ['3 Hours', '6 Hours', '12 Hours'];

export const bookings: Booking[] = [
{
  id: 'CHK2451',
  guest: 'Arun Kumar',
  phone: '+91 98407 21134',
  email: 'arun.kumar@gmail.com',
  room: 'Deluxe Room 101',
  roomType: 'Deluxe Room',
  bookedOn: '16 Aug 2026, 9:12 AM',
  checkInDate: '16 Aug 2026',
  checkInTime: '2:00 PM',
  checkOutTime: '5:00 PM',
  duration: '3 Hours',
  guests: { adults: 2, children: 0 },
  baseAmount: 1142,
  gstAmount: 57,
  total: 1199,
  paymentStatus: 'Paid',
  paymentMethod: 'UPI • Google Pay',
  status: 'Pending Approval',
  approvalSeconds: 20538,
  idProof: 'Aadhaar • verified on app',
  specialRequests: 'Prefer a high-floor room away from the lift.',
  internalNote: '',
  timeline: [
  { id: 't1', label: 'Booking requested', time: '16 Aug, 9:12 AM', done: true },
  { id: 't2', label: 'Payment received', time: '16 Aug, 9:13 AM', done: true },
  { id: 't3', label: 'Awaiting partner approval', time: 'Expires in 5h 42m', done: false }]

},
{
  id: 'CHK2452',
  guest: 'Nikhil Menon',
  phone: '+91 99401 33218',
  email: 'nikhil.menon@outlook.com',
  room: 'Premium Room 204',
  roomType: 'Premium Room',
  bookedOn: '16 Aug 2026, 10:04 AM',
  checkInDate: '16 Aug 2026',
  checkInTime: '9:00 PM',
  checkOutTime: '9:00 AM',
  duration: '12 Hours',
  guests: { adults: 1, children: 0 },
  baseAmount: 2475,
  gstAmount: 124,
  total: 2599,
  paymentStatus: 'Pending',
  paymentMethod: 'Card • awaiting authorisation',
  status: 'Pending Approval',
  approvalSeconds: 4215,
  idProof: 'Passport • pending upload',
  specialRequests: 'Late-night arrival, flight lands at 8:30 PM.',
  internalNote: 'Confirm airport pickup availability before accepting.',
  timeline: [
  { id: 't1', label: 'Booking requested', time: '16 Aug, 10:04 AM', done: true },
  { id: 't2', label: 'Payment authorisation pending', time: '16 Aug, 10:05 AM', done: false },
  { id: 't3', label: 'Awaiting partner approval', time: 'Expires in 1h 10m', done: false }]

},
{
  id: 'CHK2449',
  guest: 'Priya Sharma',
  phone: '+91 98410 55271',
  email: 'priya.sharma@gmail.com',
  room: 'Deluxe Room 103',
  roomType: 'Deluxe Room',
  bookedOn: '15 Aug 2026, 6:41 PM',
  checkInDate: '16 Aug 2026',
  checkInTime: '4:00 PM',
  checkOutTime: '10:00 PM',
  duration: '6 Hours',
  guests: { adults: 2, children: 1 },
  baseAmount: 1713,
  gstAmount: 86,
  total: 1799,
  paymentStatus: 'Paid',
  paymentMethod: 'UPI • PhonePe',
  status: 'Confirmed',
  approvalSeconds: null,
  idProof: 'Aadhaar • verified on app',
  specialRequests: 'Extra pillow and a baby cot if available.',
  internalNote: 'Repeat guest — 4th stay this quarter.',
  timeline: [
  { id: 't1', label: 'Booking requested', time: '15 Aug, 6:41 PM', done: true },
  { id: 't2', label: 'Payment received', time: '15 Aug, 6:42 PM', done: true },
  { id: 't3', label: 'Booking confirmed', time: '15 Aug, 6:45 PM', done: true },
  { id: 't4', label: 'Check-in due', time: '16 Aug, 4:00 PM', done: false }]

},
{
  id: 'CHK2447',
  guest: 'Sneha Iyer',
  phone: '+91 90031 84420',
  email: 'sneha.iyer@gmail.com',
  room: 'Deluxe Room 105',
  roomType: 'Deluxe Room',
  bookedOn: '15 Aug 2026, 3:20 PM',
  checkInDate: '16 Aug 2026',
  checkInTime: '8:00 PM',
  checkOutTime: '11:00 PM',
  duration: '3 Hours',
  guests: { adults: 1, children: 0 },
  baseAmount: 1142,
  gstAmount: 57,
  total: 1199,
  paymentStatus: 'Pay at hotel',
  paymentMethod: 'Cash at reception',
  status: 'Confirmed',
  approvalSeconds: null,
  idProof: 'Driving Licence • verified on app',
  specialRequests: '',
  internalNote: '',
  timeline: [
  { id: 't1', label: 'Booking requested', time: '15 Aug, 3:20 PM', done: true },
  { id: 't2', label: 'Booking confirmed', time: '15 Aug, 3:21 PM', done: true },
  { id: 't3', label: 'Check-in due', time: '16 Aug, 8:00 PM', done: false }]

},
{
  id: 'CHK2444',
  guest: 'Rahul Verma',
  phone: '+91 93810 66412',
  email: 'rahul.verma@gmail.com',
  room: 'Premium Room 201',
  roomType: 'Premium Room',
  bookedOn: '15 Aug 2026, 11:02 AM',
  checkInDate: '16 Aug 2026',
  checkInTime: '6:00 PM',
  checkOutTime: '6:00 AM',
  duration: '12 Hours',
  guests: { adults: 2, children: 0 },
  baseAmount: 2475,
  gstAmount: 124,
  total: 2599,
  paymentStatus: 'Paid',
  paymentMethod: 'Card • HDFC ••4412',
  status: 'Checked In',
  approvalSeconds: null,
  idProof: 'Aadhaar • verified at desk',
  specialRequests: 'Quiet room, working late.',
  internalNote: 'Guest requested a 30-minute late check-out.',
  timeline: [
  { id: 't1', label: 'Booking requested', time: '15 Aug, 11:02 AM', done: true },
  { id: 't2', label: 'Payment received', time: '15 Aug, 11:03 AM', done: true },
  { id: 't3', label: 'Booking confirmed', time: '15 Aug, 11:05 AM', done: true },
  { id: 't4', label: 'Checked in', time: '16 Aug, 6:04 PM', done: true },
  { id: 't5', label: 'Check-out due', time: '17 Aug, 6:00 AM', done: false }]

},
{
  id: 'CHK2441',
  guest: 'Vikram Raj',
  phone: '+91 99625 30918',
  email: 'vikram.raj@gmail.com',
  room: 'Premium Room 202',
  roomType: 'Premium Room',
  bookedOn: '14 Aug 2026, 8:15 PM',
  checkInDate: '15 Aug 2026',
  checkInTime: '10:00 PM',
  checkOutTime: '4:00 AM',
  duration: '6 Hours',
  guests: { adults: 2, children: 0 },
  baseAmount: 1713,
  gstAmount: 86,
  total: 1799,
  paymentStatus: 'Paid',
  paymentMethod: 'UPI • Paytm',
  status: 'Checked Out',
  approvalSeconds: null,
  idProof: 'Voter ID • verified at desk',
  specialRequests: '',
  internalNote: 'Bathroom cleanliness complaint logged — see review.',
  timeline: [
  { id: 't1', label: 'Booking requested', time: '14 Aug, 8:15 PM', done: true },
  { id: 't2', label: 'Booking confirmed', time: '14 Aug, 8:16 PM', done: true },
  { id: 't3', label: 'Checked in', time: '15 Aug, 10:06 PM', done: true },
  { id: 't4', label: 'Checked out', time: '16 Aug, 4:02 AM', done: true }]

},
{
  id: 'CHK2438',
  guest: 'Divya Ramesh',
  phone: '+91 98844 12097',
  email: 'divya.r@gmail.com',
  room: 'Executive Suite 301',
  roomType: 'Executive Suite',
  bookedOn: '14 Aug 2026, 12:30 PM',
  checkInDate: '15 Aug 2026',
  checkInTime: '11:00 AM',
  checkOutTime: '5:00 PM',
  duration: '6 Hours',
  guests: { adults: 3, children: 1 },
  baseAmount: 2475,
  gstAmount: 124,
  total: 2599,
  paymentStatus: 'Refunded',
  paymentMethod: 'UPI • refunded to source',
  status: 'Cancelled',
  approvalSeconds: null,
  idProof: 'Aadhaar • verified on app',
  specialRequests: 'Celebration setup requested.',
  internalNote: 'Cancelled by guest 8 hours before check-in — full refund issued.',
  timeline: [
  { id: 't1', label: 'Booking requested', time: '14 Aug, 12:30 PM', done: true },
  { id: 't2', label: 'Booking confirmed', time: '14 Aug, 12:32 PM', done: true },
  { id: 't3', label: 'Cancelled by guest', time: '15 Aug, 3:10 AM', done: true },
  { id: 't4', label: 'Refund processed', time: '15 Aug, 9:00 AM', done: true }]

},
{
  id: 'CHK2435',
  guest: 'Sanjay Kumar',
  phone: '+91 90922 74510',
  email: 'sanjay.k@gmail.com',
  room: 'Deluxe Room 102',
  roomType: 'Deluxe Room',
  bookedOn: '13 Aug 2026, 7:45 PM',
  checkInDate: '14 Aug 2026',
  checkInTime: '1:00 PM',
  checkOutTime: '4:00 PM',
  duration: '3 Hours',
  guests: { adults: 1, children: 0 },
  baseAmount: 999,
  gstAmount: 0,
  total: 999,
  paymentStatus: 'Failed',
  paymentMethod: 'Card • declined',
  status: 'No Show',
  approvalSeconds: null,
  idProof: 'Not submitted',
  specialRequests: '',
  internalNote: 'Guest did not arrive; slot released after 45 minutes.',
  timeline: [
  { id: 't1', label: 'Booking requested', time: '13 Aug, 7:45 PM', done: true },
  { id: 't2', label: 'Booking confirmed', time: '13 Aug, 7:46 PM', done: true },
  { id: 't3', label: 'Marked as no-show', time: '14 Aug, 1:45 PM', done: true }]

},
{
  id: 'CHK2432',
  guest: 'Meera Nair',
  phone: '+91 98450 11902',
  email: 'meera.nair@gmail.com',
  room: 'Deluxe Room 104',
  roomType: 'Deluxe Room',
  bookedOn: '12 Aug 2026, 4:02 PM',
  checkInDate: '13 Aug 2026',
  checkInTime: '7:00 PM',
  checkOutTime: '1:00 AM',
  duration: '6 Hours',
  guests: { adults: 2, children: 0 },
  baseAmount: 1713,
  gstAmount: 86,
  total: 1799,
  paymentStatus: 'Pending',
  paymentMethod: 'UPI • not completed',
  status: 'Expired',
  approvalSeconds: null,
  idProof: 'Aadhaar • verified on app',
  specialRequests: '',
  internalNote: 'Approval window lapsed without action.',
  timeline: [
  { id: 't1', label: 'Booking requested', time: '12 Aug, 4:02 PM', done: true },
  { id: 't2', label: 'Approval window expired', time: '12 Aug, 10:02 PM', done: true }]

},
{
  id: 'CHK2428',
  guest: 'Ravi Shankar',
  phone: '+91 93450 78221',
  email: 'ravi.shankar@gmail.com',
  room: 'Premium Room 203',
  roomType: 'Premium Room',
  bookedOn: '11 Aug 2026, 9:31 AM',
  checkInDate: '12 Aug 2026',
  checkInTime: '3:00 PM',
  checkOutTime: '9:00 PM',
  duration: '6 Hours',
  guests: { adults: 2, children: 2 },
  baseAmount: 1809,
  gstAmount: 90,
  total: 1899,
  paymentStatus: 'Paid',
  paymentMethod: 'UPI • Google Pay',
  status: 'Checked Out',
  approvalSeconds: null,
  idProof: 'Driving Licence • verified at desk',
  specialRequests: 'Two extra towels.',
  internalNote: '',
  timeline: [
  { id: 't1', label: 'Booking requested', time: '11 Aug, 9:31 AM', done: true },
  { id: 't2', label: 'Booking confirmed', time: '11 Aug, 9:33 AM', done: true },
  { id: 't3', label: 'Checked in', time: '12 Aug, 3:02 PM', done: true },
  { id: 't4', label: 'Checked out', time: '12 Aug, 8:51 PM', done: true }]

},
{
  id: 'CHK2453',
  guest: 'Lakshmi Devi',
  phone: '+91 98866 40122',
  email: 'lakshmi.d@gmail.com',
  room: 'Deluxe Room 106',
  roomType: 'Deluxe Room',
  bookedOn: '16 Aug 2026, 11:20 AM',
  checkInDate: '17 Aug 2026',
  checkInTime: '11:00 AM',
  checkOutTime: '2:00 PM',
  duration: '3 Hours',
  guests: { adults: 1, children: 1 },
  baseAmount: 999,
  gstAmount: 0,
  total: 999,
  paymentStatus: 'Paid',
  paymentMethod: 'UPI • PhonePe',
  status: 'Confirmed',
  approvalSeconds: null,
  idProof: 'Aadhaar • verified on app',
  specialRequests: 'Ground floor room preferred.',
  internalNote: '',
  timeline: [
  { id: 't1', label: 'Booking requested', time: '16 Aug, 11:20 AM', done: true },
  { id: 't2', label: 'Payment received', time: '16 Aug, 11:21 AM', done: true },
  { id: 't3', label: 'Booking confirmed', time: '16 Aug, 11:22 AM', done: true },
  { id: 't4', label: 'Check-in due', time: '17 Aug, 11:00 AM', done: false }]

},
{
  id: 'CHK2454',
  guest: 'Imran Sheikh',
  phone: '+91 90071 26634',
  email: 'imran.sheikh@gmail.com',
  room: 'Premium Room 205',
  roomType: 'Premium Room',
  bookedOn: '16 Aug 2026, 11:58 AM',
  checkInDate: '16 Aug 2026',
  checkInTime: '7:00 PM',
  checkOutTime: '1:00 AM',
  duration: '6 Hours',
  guests: { adults: 2, children: 0 },
  baseAmount: 1809,
  gstAmount: 90,
  total: 1899,
  paymentStatus: 'Paid',
  paymentMethod: 'Card • ICICI ••8890',
  status: 'Pending Approval',
  approvalSeconds: 900,
  idProof: 'Aadhaar • verified on app',
  specialRequests: 'Needs an early invoice for reimbursement.',
  internalNote: '',
  timeline: [
  { id: 't1', label: 'Booking requested', time: '16 Aug, 11:58 AM', done: true },
  { id: 't2', label: 'Payment received', time: '16 Aug, 11:59 AM', done: true },
  { id: 't3', label: 'Awaiting partner approval', time: 'Expires in 15m', done: false }]

}];