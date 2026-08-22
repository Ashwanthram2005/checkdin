export type BookingStatus =
'Pending' |
'Confirmed' |
'Checked In' |
'Checked Out' |
'Cancelled' |
'Refunded';

export interface TimelineEvent {
  label: string;
  at: string;
  by: string;
  note?: string;
}

export interface Booking {
  id: string;
  code: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  propertyId: string;
  propertyName: string;
  city: string;
  roomName: string;
  roomType: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  guests: number;
  amount: number;
  tax: number;
  commission: number;
  status: BookingStatus;
  paymentMethod: string;
  paymentStatus: 'Paid' | 'Partially Paid' | 'Unpaid' | 'Refunded';
  transactionId: string;
  source: 'Website' | 'Android App' | 'iOS App' | 'Walk-in' | 'Partner Desk';
  createdAt: string;
  timeline: TimelineEvent[];
}

export type PropertyStatus = 'Active' | 'Pending Approval' | 'Suspended' | 'Rejected';

export interface Property {
  id: string;
  name: string;
  city: string;
  state: string;
  address: string;
  partnerId: string;
  partnerName: string;
  rooms: number;
  occupancy: number;
  rating: number;
  reviews: number;
  revenue: number;
  status: PropertyStatus;
  type: 'Hotel' | 'Service Apartment' | 'Hostel' | 'Villa';
  amenities: string[];
  images: string[];
  documents: {name: string;status: 'Verified' | 'Pending' | 'Rejected';uploadedAt: string;}[];
  onboardedAt: string;
}

export type RoomStatus = 'Available' | 'Occupied' | 'Blocked' | 'Maintenance';

export interface Room {
  id: string;
  code: string;
  propertyId: string;
  propertyName: string;
  name: string;
  type: 'Deluxe' | 'Standard' | 'Suite' | 'Dorm Bed' | 'Executive';
  capacity: number;
  baseRate: number;
  status: RoomStatus;
  floor: number;
  nextCheckIn?: string;
}

export type PartnerStatus = 'Active' | 'Pending KYC' | 'Suspended';

export interface Partner {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  city: string;
  properties: number;
  revenue: number;
  commissionRate: number;
  status: PartnerStatus;
  joinedAt: string;
  kyc: {
    pan: string;
    gst: string;
    panStatus: 'Verified' | 'Pending' | 'Rejected';
    gstStatus: 'Verified' | 'Pending' | 'Rejected';
    bankName: string;
    accountNumber: string;
    ifsc: string;
    bankStatus: 'Verified' | 'Pending' | 'Rejected';
  };
}

export type CustomerStatus = 'Active' | 'Suspended' | 'Banned' | 'Unverified';

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  bookings: number;
  spend: number;
  cancellations: number;
  status: CustomerStatus;
  verified: boolean;
  joinedAt: string;
  lastBookingAt: string;
}

export type PayoutStatus = 'Pending' | 'Approved' | 'Completed' | 'Failed';

export interface Payout {
  id: string;
  reference: string;
  partnerId: string;
  partnerName: string;
  period: string;
  gross: number;
  commission: number;
  tax: number;
  net: number;
  status: PayoutStatus;
  requestedAt: string;
  utr?: string;
}

export type RefundStatus = 'Requested' | 'Approved' | 'Rejected' | 'Processed';

export interface Refund {
  id: string;
  reference: string;
  bookingCode: string;
  customerName: string;
  propertyName: string;
  bookingAmount: number;
  refundAmount: number;
  type: 'Full' | 'Partial';
  reason: string;
  status: RefundStatus;
  requestedAt: string;
}

export interface Review {
  id: string;
  propertyName: string;
  customerName: string;
  rating: number;
  title: string;
  body: string;
  createdAt: string;
  status: 'Published' | 'Hidden' | 'Flagged';
  response?: string;
}

export type TicketStatus = 'Open' | 'In Progress' | 'Escalated' | 'Closed';

export interface Ticket {
  id: string;
  reference: string;
  subject: string;
  requester: string;
  requesterType: 'Customer' | 'Partner';
  category: string;
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  status: TicketStatus;
  agent: string | null;
  createdAt: string;
  updatedAt: string;
  messages: {author: string;role: 'Requester' | 'Agent';body: string;at: string;}[];
}

export interface Coupon {
  id: string;
  code: string;
  description: string;
  type: 'Percentage' | 'Flat';
  value: number;
  minBooking: number;
  maxDiscount: number;
  used: number;
  limit: number;
  validFrom: string;
  validTo: string;
  status: 'Active' | 'Scheduled' | 'Expired' | 'Paused';
}

export interface Campaign {
  id: string;
  title: string;
  channel: 'SMS' | 'WhatsApp' | 'Email' | 'Push';
  audience: 'All Users' | 'Customers' | 'Partners' | 'Property Specific';
  sent: number;
  delivered: number;
  opened: number;
  status: 'Sent' | 'Scheduled' | 'Draft' | 'Failed';
  scheduledAt: string;
}

export interface AuditLog {
  id: string;
  actor: string;
  role: string;
  action: string;
  category: 'Login' | 'Booking' | 'Property' | 'Refund' | 'Payout' | 'Settings';
  target: string;
  ip: string;
  at: string;
}

export type AdminRole =
'Super Admin' |
'Operations Admin' |
'Finance Admin' |
'Support Admin' |
'Marketing Admin';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  status: 'Active' | 'Invited' | 'Disabled';
  lastActive: string;
  twoFactor: boolean;
}

export interface FraudAlert {
  id: string;
  reference: string;
  type: 'Suspicious Booking' | 'Duplicate Account' | 'Chargeback' | 'High Cancellation';
  subject: string;
  riskScore: number;
  detail: string;
  amount: number;
  status: 'Open' | 'Reviewing' | 'Cleared' | 'Blocked';
  detectedAt: string;
}

export interface PricingRule {
  id: string;
  name: string;
  scope: string;
  trigger: string;
  adjustment: string;
  channel: 'All' | 'Website' | 'App';
  status: 'Active' | 'Paused';
  updatedAt: string;
}