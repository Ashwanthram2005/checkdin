export const PROPERTY_LOGO = "/aade3c4d-76da-4632-9c84-dca7fb9985c1.jpg";


export const galleryPhotos = [
{
  id: 'g1',
  label: 'Exterior',
  url: "/b27df8e5-3a55-4df2-92cf-d27097ecbe1a.jpg",
  cover: true
},
{
  id: 'g2',
  label: 'Lobby',
  url: "/67ae6389-866a-4c13-93a4-c2513cdaf91e.jpg",
  cover: false
},
{
  id: 'g3',
  label: 'Deluxe Room',
  url: "/2b1dcc59-0d5f-4ed7-9fd4-4b9e03137403.jpg",
  cover: false
},
{
  id: 'g4',
  label: 'Premium Room',
  url: "/d00f852e-23e5-4e53-bec4-acbe93fe6c9d.jpg",
  cover: false
},
{
  id: 'g5',
  label: 'Suite',
  url: "/55a9449f-aa07-43df-b3ea-678958124c88.jpg",
  cover: false
}];


export const amenities = [
'Free Wi-Fi',
'Air Conditioning',
'Power Backup',
'Parking',
'24x7 Reception',
'CCTV Security',
'Elevator',
'Room Service',
'Laundry',
'Restaurant',
'Swimming Pool',
'Gym',
'Airport Pickup',
'Pet Friendly'];


export const defaultAmenities = [
'Free Wi-Fi',
'Air Conditioning',
'Power Backup',
'Parking',
'24x7 Reception',
'CCTV Security',
'Elevator',
'Room Service'];


export type StaffRole = 'Manager' | 'Receptionist' | 'Housekeeping';

export type StaffMember = {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: StaffRole;
  status: 'Active' | 'Invited' | 'Suspended';
  lastActive: string;
};

export const staffMembers: StaffMember[] = [
{
  id: 's1',
  name: 'Divya Ramesh',
  email: 'divya@empirestay.in',
  phone: '+91 98407 21134',
  role: 'Manager',
  status: 'Active',
  lastActive: '10 min ago'
},
{
  id: 's2',
  name: 'Sanjay Kumar',
  email: 'sanjay@empirestay.in',
  phone: '+91 98410 55271',
  role: 'Receptionist',
  status: 'Active',
  lastActive: '2 hours ago'
},
{
  id: 's3',
  name: 'Meera Nair',
  email: 'meera@empirestay.in',
  phone: '+91 90031 84420',
  role: 'Receptionist',
  status: 'Invited',
  lastActive: 'Invite sent 1 day ago'
},
{
  id: 's4',
  name: 'Ravi Shankar',
  email: 'ravi@empirestay.in',
  phone: '+91 93810 66412',
  role: 'Housekeeping',
  status: 'Active',
  lastActive: 'Yesterday'
},
{
  id: 's5',
  name: 'Lakshmi Devi',
  email: 'lakshmi@empirestay.in',
  phone: '+91 99625 30918',
  role: 'Housekeeping',
  status: 'Suspended',
  lastActive: '2 weeks ago'
}];


export const permissionMatrix: {
  id: string;
  label: string;
  description: string;
  roles: Record<StaffRole, boolean>;
}[] = [
{
  id: 'bookings',
  label: 'View & manage bookings',
  description: 'Create, modify and cancel guest bookings',
  roles: { Manager: true, Receptionist: true, Housekeeping: false }
},
{
  id: 'checkin',
  label: 'Check-in / check-out guests',
  description: 'Mark arrivals, departures and no-shows',
  roles: { Manager: true, Receptionist: true, Housekeeping: false }
},
{
  id: 'rooms',
  label: 'Update slot availability',
  description: 'Adjust how many slots Checkdin can sell, or block a date',
  roles: { Manager: true, Receptionist: true, Housekeeping: true }
},
{
  id: 'pricing',
  label: 'Edit pricing & offers',
  description: 'Change hourly rates, discounts and packages',
  roles: { Manager: true, Receptionist: false, Housekeeping: false }
},
{
  id: 'revenue',
  label: 'View revenue & payouts',
  description: 'Access earnings reports and settlement history',
  roles: { Manager: true, Receptionist: false, Housekeeping: false }
},
{
  id: 'staff',
  label: 'Manage staff & permissions',
  description: 'Invite team members and change their access',
  roles: { Manager: false, Receptionist: false, Housekeeping: false }
}];


export type DocumentStatus = 'Verified' | 'Under review' | 'Missing' | 'Rejected';

export const propertyDocuments: {
  id: string;
  label: string;
  hint: string;
  fileName: string | null;
  uploadedOn: string | null;
  status: DocumentStatus;
}[] = [
{
  id: 'gst',
  label: 'GST Certificate',
  hint: 'PDF or JPG, max 5 MB',
  fileName: 'gst-certificate-2026.pdf',
  uploadedOn: '12 Jan 2026',
  status: 'Verified'
},
{
  id: 'pan',
  label: 'PAN Card',
  hint: 'PDF or JPG, max 5 MB',
  fileName: 'pan-karthik-raman.pdf',
  uploadedOn: '12 Jan 2026',
  status: 'Verified'
},
{
  id: 'trade',
  label: 'Trade License',
  hint: 'Issued by the local municipal body',
  fileName: 'trade-license-2026.pdf',
  uploadedOn: '02 Aug 2026',
  status: 'Under review'
},
{
  id: 'registration',
  label: 'Property Registration Documents',
  hint: 'Ownership deed or lease agreement',
  fileName: null,
  uploadedOn: null,
  status: 'Missing'
}];


export const activeSessions = [
{
  id: 'd1',
  device: 'MacBook Pro • Chrome',
  location: 'Chennai, Tamil Nadu',
  ip: '49.207.112.44',
  lastSeen: 'Active now',
  current: true
},
{
  id: 'd2',
  device: 'iPhone 15 • Checkdin App',
  location: 'Chennai, Tamil Nadu',
  ip: '49.207.98.10',
  lastSeen: '35 minutes ago',
  current: false
},
{
  id: 'd3',
  device: 'Front desk PC • Edge',
  location: 'Chennai, Tamil Nadu',
  ip: '103.21.58.7',
  lastSeen: 'Yesterday, 9:12 PM',
  current: false
}];


export const loginHistory = [
{ id: 'l1', event: 'Successful login', device: 'MacBook Pro • Chrome', time: '16 Aug 2026, 8:02 AM', ok: true },
{ id: 'l2', event: 'Password changed', device: 'MacBook Pro • Chrome', time: '11 Aug 2026, 6:41 PM', ok: true },
{ id: 'l3', event: 'Failed login attempt', device: 'Unknown • Windows', time: '09 Aug 2026, 2:17 AM', ok: false },
{ id: 'l4', event: 'Successful login', device: 'iPhone 15 • Checkdin App', time: '08 Aug 2026, 7:55 AM', ok: true }];