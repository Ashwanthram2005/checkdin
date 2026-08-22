import type { Campaign, Coupon, Review, Ticket } from '../types';

export const reviews: Review[] = [
{
  id: 'REV-8001',
  propertyName: 'Hotel Empire Stay',
  customerName: 'Ananya Iyer',
  rating: 5,
  title: 'Spotless rooms, effortless check-in',
  body: 'The 3-hour slot booking was perfect for a layover. Front desk had my room ready before I arrived.',
  createdAt: '2026-08-18',
  status: 'Published',
  response: 'Thank you Ananya — see you on your next Chennai trip!'
},
{
  id: 'REV-8002',
  propertyName: 'Andheri Transit Rooms',
  customerName: 'Rohan Deshpande',
  rating: 2,
  title: 'AC was not working in room 402',
  body: 'Raised it twice at the desk, took over two hours to get a replacement room.',
  createdAt: '2026-08-17',
  status: 'Flagged'
},
{
  id: 'REV-8003',
  propertyName: 'Koramangala Nest',
  customerName: 'Fatima Ansari',
  rating: 5,
  title: 'Best value stay in Bengaluru',
  body: 'Quiet, fast WiFi and a proper desk. Ideal for a work week.',
  createdAt: '2026-08-16',
  status: 'Published'
},
{
  id: 'REV-8004',
  propertyName: 'Jubilee Hills Stayspace',
  customerName: 'Arjun Pillai',
  rating: 1,
  title: 'Misleading photos',
  body: 'The dorm looked nothing like the listing. Asked for a refund at the desk.',
  createdAt: '2026-08-15',
  status: 'Hidden'
},
{
  id: 'REV-8005',
  propertyName: 'Bandra Loft House',
  customerName: 'Priya Sharma',
  rating: 4,
  title: 'Great location, tiny lift',
  body: 'Loved the sea-facing balcony. The building lift only fits two people.',
  createdAt: '2026-08-14',
  status: 'Published'
},
{
  id: 'REV-8006',
  propertyName: 'Baga Beach Cottages',
  customerName: 'Neha Bhatt',
  rating: 5,
  title: 'Perfect monsoon getaway',
  body: 'The pool was clean and the staff arranged a late checkout without any fuss.',
  createdAt: '2026-08-13',
  status: 'Published'
},
{
  id: 'REV-8007',
  propertyName: 'Aurum Suites Whitefield',
  customerName: 'Lakshmi Subramanian',
  rating: 3,
  title: 'Breakfast ends too early',
  body: 'Rooms are good but the buffet closes at 9 which is tough on weekends.',
  createdAt: '2026-08-12',
  status: 'Published'
},
{
  id: 'REV-8008',
  propertyName: 'Marina Bay Residency',
  customerName: 'Tanmay Ghosh',
  rating: 4,
  title: 'Kitchenette was a lifesaver',
  body: 'Stayed nine nights. Housekeeping was consistent throughout.',
  createdAt: '2026-08-11',
  status: 'Published'
}];


export const tickets: Ticket[] = [
{
  id: 'TKT-3301',
  reference: 'SUP-90412',
  subject: 'Refund not credited after 7 days',
  requester: 'Rohan Deshpande',
  requesterType: 'Customer',
  category: 'Refunds',
  priority: 'Urgent',
  status: 'Escalated',
  agent: 'Ritu Malhotra',
  createdAt: '2026-08-14',
  updatedAt: '2026-08-19',
  messages: [
  {
    author: 'Rohan Deshpande',
    role: 'Requester',
    body: 'My booking CHK-74108 was cancelled on 12 Aug and the refund still has not reached my account.',
    at: '14 Aug 2026, 09:12 AM'
  },
  {
    author: 'Ritu Malhotra',
    role: 'Agent',
    body: 'Thanks for flagging. The refund is approved and queued with the gateway — I have escalated it to Finance for a manual push.',
    at: '19 Aug 2026, 11:40 AM'
  }]

},
{
  id: 'TKT-3302',
  reference: 'SUP-90418',
  subject: 'Unable to update room inventory for September',
  requester: 'Divya Menon',
  requesterType: 'Partner',
  category: 'Inventory',
  priority: 'High',
  status: 'In Progress',
  agent: 'Sahil Grover',
  createdAt: '2026-08-17',
  updatedAt: '2026-08-19',
  messages: [
  {
    author: 'Divya Menon',
    role: 'Requester',
    body: 'The calendar throws an error whenever I try to open September inventory.',
    at: '17 Aug 2026, 04:22 PM'
  }]

},
{
  id: 'TKT-3303',
  reference: 'SUP-90421',
  subject: 'Guest charged twice for the same slot',
  requester: 'Ananya Iyer',
  requesterType: 'Customer',
  category: 'Payments',
  priority: 'High',
  status: 'Open',
  agent: null,
  createdAt: '2026-08-18',
  updatedAt: '2026-08-18',
  messages: [
  {
    author: 'Ananya Iyer',
    role: 'Requester',
    body: 'Two debits of ₹4,250 for booking CHK-74101. Attaching the bank statement.',
    at: '18 Aug 2026, 08:02 PM'
  }]

},
{
  id: 'TKT-3304',
  reference: 'SUP-90427',
  subject: 'Payout for 16–31 Jul cycle marked failed',
  requester: 'Imran Sheikh',
  requesterType: 'Partner',
  category: 'Payouts',
  priority: 'Medium',
  status: 'In Progress',
  agent: 'Ritu Malhotra',
  createdAt: '2026-08-18',
  updatedAt: '2026-08-19',
  messages: [
  {
    author: 'Imran Sheikh',
    role: 'Requester',
    body: 'Bank says no incoming transfer. Please re-initiate.',
    at: '18 Aug 2026, 10:15 AM'
  }]

},
{
  id: 'TKT-3305',
  reference: 'SUP-90430',
  subject: 'Request to change registered GST number',
  requester: 'Nikhil Bansal',
  requesterType: 'Partner',
  category: 'KYC',
  priority: 'Low',
  status: 'Open',
  agent: null,
  createdAt: '2026-08-19',
  updatedAt: '2026-08-19',
  messages: [
  {
    author: 'Nikhil Bansal',
    role: 'Requester',
    body: 'We moved the entity to a new GSTIN. What documents do you need?',
    at: '19 Aug 2026, 09:44 AM'
  }]

},
{
  id: 'TKT-3306',
  reference: 'SUP-90402',
  subject: 'Property photos rejected without reason',
  requester: 'Mahesh Rathore',
  requesterType: 'Partner',
  category: 'Listing',
  priority: 'Medium',
  status: 'Closed',
  agent: 'Sahil Grover',
  createdAt: '2026-08-09',
  updatedAt: '2026-08-12',
  messages: [
  {
    author: 'Mahesh Rathore',
    role: 'Requester',
    body: 'Six of my uploads were rejected.',
    at: '09 Aug 2026, 12:30 PM'
  },
  {
    author: 'Sahil Grover',
    role: 'Agent',
    body: 'Images were below the 1600px minimum. Re-uploads are live now — closing this out.',
    at: '12 Aug 2026, 03:10 PM'
  }]

}];


export const coupons: Coupon[] = [
{
  id: 'CPN-6101',
  code: 'CHECKDIN20',
  description: '20% off first booking on app',
  type: 'Percentage',
  value: 20,
  minBooking: 1500,
  maxDiscount: 750,
  used: 4128,
  limit: 5000,
  validFrom: '2026-08-01',
  validTo: '2026-08-31',
  status: 'Active'
},
{
  id: 'CPN-6102',
  code: 'TRANSIT150',
  description: 'Flat ₹150 off 3-hour slot stays',
  type: 'Flat',
  value: 150,
  minBooking: 900,
  maxDiscount: 150,
  used: 2211,
  limit: 8000,
  validFrom: '2026-07-15',
  validTo: '2026-09-15',
  status: 'Active'
},
{
  id: 'CPN-6103',
  code: 'MONSOONGOA',
  description: '15% off Goa villas',
  type: 'Percentage',
  value: 15,
  minBooking: 4000,
  maxDiscount: 2000,
  used: 806,
  limit: 1500,
  validFrom: '2026-06-01',
  validTo: '2026-08-15',
  status: 'Expired'
},
{
  id: 'CPN-6104',
  code: 'FESTIVE500',
  description: 'Flat ₹500 off Diwali travel',
  type: 'Flat',
  value: 500,
  minBooking: 5000,
  maxDiscount: 500,
  used: 0,
  limit: 10000,
  validFrom: '2026-10-10',
  validTo: '2026-11-05',
  status: 'Scheduled'
},
{
  id: 'CPN-6105',
  code: 'CORPBLR10',
  description: '10% off Bengaluru corporate stays',
  type: 'Percentage',
  value: 10,
  minBooking: 3000,
  maxDiscount: 1200,
  used: 1490,
  limit: 4000,
  validFrom: '2026-05-01',
  validTo: '2026-12-31',
  status: 'Paused'
}];


export const campaigns: Campaign[] = [
{
  id: 'CMP-9101',
  title: 'Independence week flash sale',
  channel: 'WhatsApp',
  audience: 'Customers',
  sent: 184200,
  delivered: 179880,
  opened: 96140,
  status: 'Sent',
  scheduledAt: '2026-08-12 10:00'
},
{
  id: 'CMP-9102',
  title: 'Partner payout cycle reminder',
  channel: 'Email',
  audience: 'Partners',
  sent: 412,
  delivered: 409,
  opened: 331,
  status: 'Sent',
  scheduledAt: '2026-08-16 09:00'
},
{
  id: 'CMP-9103',
  title: 'Complete your KYC to receive payouts',
  channel: 'SMS',
  audience: 'Partners',
  sent: 88,
  delivered: 86,
  opened: 0,
  status: 'Sent',
  scheduledAt: '2026-08-18 18:30'
},
{
  id: 'CMP-9104',
  title: 'Empire Stay weekend offer',
  channel: 'Push',
  audience: 'Property Specific',
  sent: 0,
  delivered: 0,
  opened: 0,
  status: 'Scheduled',
  scheduledAt: '2026-08-22 08:00'
},
{
  id: 'CMP-9105',
  title: 'Monsoon Goa reactivation',
  channel: 'Push',
  audience: 'All Users',
  sent: 0,
  delivered: 0,
  opened: 0,
  status: 'Draft',
  scheduledAt: '—'
},
{
  id: 'CMP-9106',
  title: 'Refund status update batch',
  channel: 'SMS',
  audience: 'Customers',
  sent: 1240,
  delivered: 902,
  opened: 0,
  status: 'Failed',
  scheduledAt: '2026-08-14 16:00'
}];


export const cmsBanners = [
{ id: 'BAN-01', title: 'Book a 3-hour stay, pay for 3 hours', placement: 'Homepage hero', cities: 'All cities', status: 'Active', clicks: 41200 },
{ id: 'BAN-02', title: 'Monsoon in Goa — up to 15% off', placement: 'Homepage carousel', cities: 'Goa', status: 'Active', clicks: 18640 },
{ id: 'BAN-03', title: 'Airport layover rooms in Mumbai', placement: 'City page', cities: 'Mumbai', status: 'Active', clicks: 22980 },
{ id: 'BAN-04', title: 'Diwali long weekend', placement: 'Homepage hero', cities: 'All cities', status: 'Scheduled', clicks: 0 }];


export const cmsCities = [
{ name: 'Chennai', properties: 2, featured: true, seoTitle: 'Hourly & daily hotels in Chennai | Checkdin', status: 'Live' },
{ name: 'Bengaluru', properties: 2, featured: true, seoTitle: 'Book hotels in Bengaluru by the hour | Checkdin', status: 'Live' },
{ name: 'Mumbai', properties: 2, featured: true, seoTitle: 'Transit & layover rooms in Mumbai | Checkdin', status: 'Live' },
{ name: 'New Delhi', properties: 1, featured: false, seoTitle: 'Short stay hotels in New Delhi | Checkdin', status: 'Live' },
{ name: 'Goa', properties: 1, featured: true, seoTitle: 'Beach villas & cottages in Goa | Checkdin', status: 'Live' },
{ name: 'Jaipur', properties: 1, featured: false, seoTitle: 'Heritage stays in Jaipur | Checkdin', status: 'Draft' }];