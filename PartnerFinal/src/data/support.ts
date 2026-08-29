export const supportChannels = {
  phone: '+91 80 4567 2200',
  whatsapp: '918045672200',
  email: 'partners@checkdin.in',
  hours: '24 × 7 Partner Support',
  responseTime: 'Within 2 hours'
};

export const issueCategories = [
'Booking Issue',
'Payment Issue',
'Payout Issue',
'Property Verification',
'Technical Issue',
'Account Access',
'Pricing Issue',
'Other'];


export type TicketStatus = 'Open' | 'In Progress' | 'Resolved';

export type SupportTicket = {
  id: string;
  category: string;
  subject: string;
  createdOn: string;
  status: TicketStatus;
  agent: string;
};

export const supportTickets: SupportTicket[] = [
{
  id: 'CHK-SP-4821',
  category: 'Payout Issue',
  subject: 'Weekly settlement not credited',
  createdOn: '16 Aug 2026, 9:40 AM',
  status: 'Open',
  agent: 'Unassigned'
},
{
  id: 'CHK-SP-4790',
  category: 'Booking Issue',
  subject: 'Guest could not check in with app QR',
  createdOn: '15 Aug 2026, 6:12 PM',
  status: 'In Progress',
  agent: 'Neha Kapoor'
},
{
  id: 'CHK-SP-4756',
  category: 'Pricing Issue',
  subject: 'GST slab applied on ₹999 slot',
  createdOn: '13 Aug 2026, 11:02 AM',
  status: 'In Progress',
  agent: 'Arjun Pillai'
},
{
  id: 'CHK-SP-4712',
  category: 'Property Verification',
  subject: 'Trade licence re-upload needed',
  createdOn: '09 Aug 2026, 4:35 PM',
  status: 'Resolved',
  agent: 'Neha Kapoor'
},
{
  id: 'CHK-SP-4688',
  category: 'Technical Issue',
  subject: 'Availability calendar not saving',
  createdOn: '05 Aug 2026, 10:18 AM',
  status: 'Resolved',
  agent: 'Vikas Rao'
}];


export const faqs = [
{
  id: 'f1',
  question: 'How do payouts work?',
  answer:
  'Bookings settle into your available balance after check-out. Payouts run on your chosen cycle (weekly by default) to the verified bank account, and every payout needs owner OTP verification.'
},
{
  id: 'f2',
  question: 'How to update property details?',
  answer:
  'Go to Settings → Property Profile to change the description, address, map pin, contact details, amenities and photo gallery. Changes go live immediately except documents, which are reviewed.'
},
{
  id: 'f3',
  question: 'How to manage availability?',
  answer:
  'Open Availability to set how many of your rooms are allocated to Checkdin, adjust allocation per day or per slot window, and block dates when the property is full.'
},
{
  id: 'f4',
  question: 'How to update pricing?',
  answer:
  'Pricing takes your base price without GST for the 3, 6 and 12 hour slots. GST is applied automatically — exempt up to ₹1,000 and 5% from ₹1,001 to ₹7,500.'
},
{
  id: 'f5',
  question: 'How to contact support?',
  answer:
  'Call or WhatsApp the partner support number on this page for anything urgent, or raise a callback request below and an agent responds within 2 hours.'
}];