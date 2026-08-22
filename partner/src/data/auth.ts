export type PermissionId =
'view_bookings' |
'accept_bookings' |
'reject_bookings' |
'checkin_guests' |
'checkout_guests' |
'manage_availability' |
'manage_rooms' |
'manage_pricing' |
'view_revenue' |
'view_reports' |
'manage_reviews' |
'view_guest_details';

export type OwnerOnlyAction =
'initiate_payout' |
'change_bank' |
'modify_gst' |
'delete_property' |
'delete_staff' |
'change_ownership' |
'modify_security';

export const permissionCatalog: {id: PermissionId;label: string;group: string;}[] = [
{ id: 'view_bookings', label: 'View bookings', group: 'Bookings' },
{ id: 'accept_bookings', label: 'Accept bookings', group: 'Bookings' },
{ id: 'reject_bookings', label: 'Reject bookings', group: 'Bookings' },
{ id: 'checkin_guests', label: 'Check in guests', group: 'Front desk' },
{ id: 'checkout_guests', label: 'Check out guests', group: 'Front desk' },
{ id: 'view_guest_details', label: 'View guest details', group: 'Front desk' },
{ id: 'manage_availability', label: 'Manage availability', group: 'Inventory' },
{ id: 'manage_rooms', label: 'Manage rooms', group: 'Inventory' },
{ id: 'manage_pricing', label: 'Manage pricing', group: 'Inventory' },
{ id: 'manage_reviews', label: 'Manage reviews', group: 'Guest experience' },
{ id: 'view_revenue', label: 'View revenue', group: 'Finance' },
{ id: 'view_reports', label: 'View reports', group: 'Finance' }];


export const ownerOnlyActions: {id: OwnerOnlyAction;label: string;}[] = [
{ id: 'initiate_payout', label: 'Initiate payout' },
{ id: 'change_bank', label: 'Change bank account' },
{ id: 'modify_gst', label: 'Modify GST details' },
{ id: 'delete_property', label: 'Delete property' },
{ id: 'delete_staff', label: 'Delete staff accounts' },
{ id: 'change_ownership', label: 'Change ownership information' },
{ id: 'modify_security', label: 'Modify security settings' }];


export type RoleLevel = 'owner' | 'manager' | 'staff';

export type Role = {
  id: string;
  name: string;
  level: RoleLevel;
  system: boolean;
  description: string;
  permissions: PermissionId[];
};

export const seedRoles: Role[] = [
{
  id: 'owner',
  name: 'Owner',
  level: 'owner',
  system: true,
  description: 'Full access, including banking, payouts, security and permissions.',
  permissions: permissionCatalog.map((permission) => permission.id)
},
{
  id: 'manager',
  name: 'Manager',
  level: 'manager',
  system: true,
  description: 'Runs day-to-day operations, pricing and reporting.',
  permissions: [
  'view_bookings',
  'accept_bookings',
  'reject_bookings',
  'checkin_guests',
  'checkout_guests',
  'view_guest_details',
  'manage_availability',
  'manage_rooms',
  'manage_pricing',
  'manage_reviews',
  'view_revenue',
  'view_reports']

},
{
  id: 'receptionist',
  name: 'Receptionist',
  level: 'staff',
  system: true,
  description: 'Handles the front desk: approvals, check-ins and check-outs.',
  permissions: [
  'view_bookings',
  'accept_bookings',
  'reject_bookings',
  'checkin_guests',
  'checkout_guests',
  'view_guest_details']

},
{
  id: 'housekeeping',
  name: 'Housekeeping',
  level: 'staff',
  system: true,
  description: 'Updates room readiness and availability.',
  permissions: ['view_bookings', 'manage_availability']
},
{
  id: 'night_auditor',
  name: 'Night Auditor',
  level: 'staff',
  system: false,
  description: 'Custom role — reviews overnight bookings and reports.',
  permissions: ['view_bookings', 'view_guest_details', 'view_revenue', 'view_reports']
}];


export type StaffUser = {
  id: string;
  name: string;
  roleId: string;
  password: string;
  phone: string;
  active: boolean;
  lastLogin: string;
};

export const property = {
  hotelId: 'CHK-EMPIRE-017',
  password: 'empire@2026',
  name: 'Hotel Empire Stay',
  city: 'Chennai, Tamil Nadu',
  ownerPhone: '+91 98407 12345'
};

export const staffAccounts: StaffUser[] = [
{
  id: 'u1',
  name: 'Karthik Raman',
  roleId: 'owner',
  password: '1234',
  phone: '+91 98407 12345',
  active: true,
  lastLogin: '16 Aug 2026, 8:02 AM'
},
{
  id: 'u2',
  name: 'Divya Ramesh',
  roleId: 'manager',
  password: '1234',
  phone: '+91 98407 21134',
  active: true,
  lastLogin: '16 Aug 2026, 7:40 AM'
},
{
  id: 'u3',
  name: 'Sanjay Kumar',
  roleId: 'receptionist',
  password: '1234',
  phone: '+91 98410 55271',
  active: true,
  lastLogin: '16 Aug 2026, 6:58 AM'
},
{
  id: 'u4',
  name: 'Ravi Shankar',
  roleId: 'housekeeping',
  password: '1234',
  phone: '+91 93810 66412',
  active: true,
  lastLogin: '15 Aug 2026, 9:12 PM'
},
{
  id: 'u5',
  name: 'Meera Nair',
  roleId: 'night_auditor',
  password: '1234',
  phone: '+91 90031 84420',
  active: true,
  lastLogin: '15 Aug 2026, 11:31 PM'
}];


export type AuditCategory = 'Operations' | 'Management' | 'Security';

export type AuditEntry = {
  id: string;
  time: string;
  actor: string;
  role: string;
  action: string;
  detail: string;
  category: AuditCategory;
};

export const seedAuditLog: AuditEntry[] = [
{
  id: 'a1',
  time: '16 Aug 2026, 10:32 AM',
  actor: 'Sanjay Kumar',
  role: 'Receptionist',
  action: 'Checked in booking',
  detail: '#CHK2444 • Premium Room 201',
  category: 'Operations'
},
{
  id: 'a2',
  time: '16 Aug 2026, 11:15 AM',
  actor: 'Divya Ramesh',
  role: 'Manager',
  action: 'Updated pricing',
  detail: 'Deluxe Room 6 Hours ₹1,449 → ₹1,499',
  category: 'Management'
},
{
  id: 'a3',
  time: '16 Aug 2026, 11:48 AM',
  actor: 'Ravi Shankar',
  role: 'Housekeeping',
  action: 'Updated room status',
  detail: 'Deluxe Room 103 marked ready',
  category: 'Operations'
},
{
  id: 'a4',
  time: '16 Aug 2026, 12:20 PM',
  actor: 'Divya Ramesh',
  role: 'Manager',
  action: 'Replied to review',
  detail: 'Review from Arun Kumar',
  category: 'Management'
},
{
  id: 'a5',
  time: '16 Aug 2026, 2:05 PM',
  actor: 'Karthik Raman',
  role: 'Owner',
  action: 'Requested payout',
  detail: '₹12,450 • OTP verified',
  category: 'Security'
},
{
  id: 'a6',
  time: '16 Aug 2026, 2:31 PM',
  actor: 'Karthik Raman',
  role: 'Owner',
  action: 'Changed permission',
  detail: 'Receptionist — reject bookings enabled',
  category: 'Security'
},
{
  id: 'a7',
  time: '15 Aug 2026, 9:12 PM',
  actor: 'Sanjay Kumar',
  role: 'Receptionist',
  action: 'Checked out booking',
  detail: '#CHK2441 • Premium Room 202',
  category: 'Operations'
},
{
  id: 'a8',
  time: '15 Aug 2026, 6:45 PM',
  actor: 'Sanjay Kumar',
  role: 'Receptionist',
  action: 'Accepted booking',
  detail: '#CHK2449 • Deluxe Room 103',
  category: 'Operations'
}];


export type LoginActivity = {
  id: string;
  user: string;
  role: string;
  loginTime: string;
  logoutTime: string | null;
  device: string;
  ip: string;
  location: string;
};

export const seedLoginActivity: LoginActivity[] = [
{
  id: 'la1',
  user: 'Divya Ramesh',
  role: 'Manager',
  loginTime: '16 Aug 2026, 7:40 AM',
  logoutTime: '16 Aug 2026, 1:05 PM',
  device: 'Windows 11 • Chrome 128',
  ip: '49.207.112.44',
  location: 'Chennai, Tamil Nadu'
},
{
  id: 'la2',
  user: 'Sanjay Kumar',
  role: 'Receptionist',
  loginTime: '16 Aug 2026, 6:58 AM',
  logoutTime: null,
  device: 'Front desk PC • Edge 128',
  ip: '103.21.58.7',
  location: 'Chennai, Tamil Nadu'
},
{
  id: 'la3',
  user: 'Ravi Shankar',
  role: 'Housekeeping',
  loginTime: '15 Aug 2026, 9:12 PM',
  logoutTime: '15 Aug 2026, 11:02 PM',
  device: 'Android 15 • Checkdin App',
  ip: '49.207.98.10',
  location: 'Chennai, Tamil Nadu'
}];


export const sessionConfig = {
  /** Inactivity allowed before automatic logout, in seconds. */
  timeoutSeconds: 30 * 60,
  /** How long the warning shows before logout, in seconds. */
  warningSeconds: 2 * 60
};

export const deviceContext = {
  device: 'MacBook Pro • Chrome 128',
  ip: '49.207.112.44',
  location: 'Chennai, Tamil Nadu, IN'
};