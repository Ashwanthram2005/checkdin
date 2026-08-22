import type { AdminUser, AuditLog, FraudAlert, PricingRule } from '../types';

export const adminUsers: AdminUser[] = [
{ id: 'ADM-01', name: 'Karthik Raman', email: 'karthik@checkdin.in', role: 'Super Admin', status: 'Active', lastActive: '19 Aug 2026, 10:18 PM', twoFactor: true },
{ id: 'ADM-02', name: 'Ritu Malhotra', email: 'ritu@checkdin.in', role: 'Support Admin', status: 'Active', lastActive: '19 Aug 2026, 09:52 PM', twoFactor: true },
{ id: 'ADM-03', name: 'Sahil Grover', email: 'sahil@checkdin.in', role: 'Support Admin', status: 'Active', lastActive: '19 Aug 2026, 07:31 PM', twoFactor: false },
{ id: 'ADM-04', name: 'Pooja Nambiar', email: 'pooja@checkdin.in', role: 'Finance Admin', status: 'Active', lastActive: '19 Aug 2026, 06:04 PM', twoFactor: true },
{ id: 'ADM-05', name: 'Varun Joshi', email: 'varun@checkdin.in', role: 'Operations Admin', status: 'Active', lastActive: '19 Aug 2026, 08:47 PM', twoFactor: true },
{ id: 'ADM-06', name: 'Zoya Qureshi', email: 'zoya@checkdin.in', role: 'Marketing Admin', status: 'Invited', lastActive: '—', twoFactor: false },
{ id: 'ADM-07', name: 'Harish Kumar', email: 'harish@checkdin.in', role: 'Operations Admin', status: 'Disabled', lastActive: '02 Jul 2026, 11:12 AM', twoFactor: false }];


export const permissionModules = [
'Bookings',
'Properties',
'Rooms',
'Partners',
'Customers',
'Revenue',
'Payouts',
'Refunds',
'Reviews',
'Support',
'Notifications',
'CMS',
'Reports',
'Audit Logs',
'Fraud Detection',
'Settings'];


type Access = 'Full' | 'Edit' | 'View' | 'None';

function buildAccess(edit: string[], view: string[], full = false): Record<string, Access> {
  const result: Record<string, Access> = {};
  permissionModules.forEach((module) => {
    if (full) {
      result[module] = 'Full';
    } else if (edit.includes(module)) {
      result[module] = 'Edit';
    } else if (view.includes(module)) {
      result[module] = 'View';
    } else {
      result[module] = 'None';
    }
  });
  return result;
}

export const rolePermissions: Record<string, Record<string, Access>> = {
  'Super Admin': buildAccess([], [], true),
  'Operations Admin': buildAccess(
    ['Bookings', 'Properties', 'Rooms', 'Partners', 'Customers'],
    ['Revenue', 'Reports', 'Reviews']
  ),
  'Finance Admin': buildAccess(
    ['Revenue', 'Payouts', 'Refunds'],
    ['Bookings', 'Partners', 'Reports', 'Audit Logs']
  ),
  'Support Admin': buildAccess(['Support', 'Reviews'], ['Bookings', 'Customers', 'Properties', 'Refunds']),
  'Marketing Admin': buildAccess(['CMS', 'Notifications'], ['Reports', 'Properties', 'Customers'])
};

const actors = [
{ actor: 'Varun Joshi', role: 'Operations Admin' },
{ actor: 'Pooja Nambiar', role: 'Finance Admin' },
{ actor: 'Ritu Malhotra', role: 'Support Admin' },
{ actor: 'Karthik Raman', role: 'Super Admin' },
{ actor: 'Sahil Grover', role: 'Support Admin' }];


const actions: {action: string;category: AuditLog['category'];target: string;}[] = [
{ action: 'Signed in', category: 'Login', target: 'admin.checkdin.in' },
{ action: 'Approved property listing', category: 'Property', target: 'PRP-1010 Pink City Haveli' },
{ action: 'Approved refund', category: 'Refund', target: 'RF/2026/08/2204' },
{ action: 'Approved payout', category: 'Payout', target: 'PO/2026/08/1103' },
{ action: 'Force checked-in guest', category: 'Booking', target: 'CHK-74112' },
{ action: 'Updated platform commission', category: 'Settings', target: 'Commission 12% → 13%' },
{ action: 'Cancelled booking', category: 'Booking', target: 'CHK-74119' },
{ action: 'Suspended property', category: 'Property', target: 'PRP-1008 Jubilee Hills Stayspace' },
{ action: 'Failed sign-in attempt', category: 'Login', target: 'admin.checkdin.in' },
{ action: 'Rejected refund', category: 'Refund', target: 'RF/2026/08/2209' }];


export const auditLogs: AuditLog[] = Array.from({ length: 42 }, (_, index) => {
  const actor = actors[index % actors.length];
  const action = actions[index % actions.length];
  const hour = 23 - index % 14;
  return {
    id: `LOG-${20400 + index}`,
    actor: actor.actor,
    role: actor.role,
    action: action.action,
    category: action.category,
    target: action.target,
    ip: `49.207.${100 + index % 40}.${20 + index % 90}`,
    at: `${19 - Math.floor(index / 12)} Aug 2026, ${String(hour).padStart(2, '0')}:${String(
      12 + index % 45
    ).padStart(2, '0')}`
  };
});

export const fraudAlerts: FraudAlert[] = [
{
  id: 'FRD-01',
  reference: 'CHK-74118',
  type: 'Suspicious Booking',
  subject: 'Deepak Verma',
  riskScore: 92,
  detail: '7 bookings in 40 minutes across 4 cities, all on the same card fingerprint.',
  amount: 48600,
  status: 'Open',
  detectedAt: '19 Aug 2026, 09:14 PM'
},
{
  id: 'FRD-02',
  reference: 'CUS-4110 / CUS-4106',
  type: 'Duplicate Account',
  subject: 'Deepak Verma',
  riskScore: 78,
  detail: 'Two accounts share a device ID and UPI handle; one is already banned.',
  amount: 0,
  status: 'Reviewing',
  detectedAt: '19 Aug 2026, 05:40 PM'
},
{
  id: 'FRD-03',
  reference: 'pay_R8811480',
  type: 'Chargeback',
  subject: 'Sameer Khan',
  riskScore: 88,
  detail: 'Issuing bank raised a chargeback for a completed stay at Andheri Transit Rooms.',
  amount: 12400,
  status: 'Open',
  detectedAt: '18 Aug 2026, 02:22 PM'
},
{
  id: 'FRD-04',
  reference: 'CUS-4104',
  type: 'High Cancellation',
  subject: 'Sameer Khan',
  riskScore: 71,
  detail: '9 of 18 bookings cancelled within 30 days of check-in.',
  amount: 143200,
  status: 'Reviewing',
  detectedAt: '17 Aug 2026, 11:05 AM'
},
{
  id: 'FRD-05',
  reference: 'CHK-74107',
  type: 'Suspicious Booking',
  subject: 'Arjun Pillai',
  riskScore: 64,
  detail: 'Booking amount 6x the account average, paid from a first-seen card.',
  amount: 31200,
  status: 'Cleared',
  detectedAt: '16 Aug 2026, 07:48 PM'
},
{
  id: 'FRD-06',
  reference: 'pay_R8812200',
  type: 'Chargeback',
  subject: 'Unknown cardholder',
  riskScore: 95,
  detail: 'Card reported stolen after a 3-night Goa villa booking was confirmed.',
  amount: 27800,
  status: 'Blocked',
  detectedAt: '15 Aug 2026, 10:02 AM'
}];


export const pricingRules: PricingRule[] = [
{
  id: 'PRC-01',
  name: 'Weekend surge — metros',
  scope: 'Chennai, Bengaluru, Mumbai',
  trigger: 'Fri–Sun stays',
  adjustment: '+18% on base rate',
  channel: 'All',
  status: 'Active',
  updatedAt: '14 Aug 2026'
},
{
  id: 'PRC-02',
  name: 'Layover 3-hour slot pricing',
  scope: 'Airport properties',
  trigger: 'Slot bookings under 4 hours',
  adjustment: '38% of nightly rate',
  channel: 'App',
  status: 'Active',
  updatedAt: '11 Aug 2026'
},
{
  id: 'PRC-03',
  name: 'Last-minute fill discount',
  scope: 'All properties',
  trigger: 'Occupancy under 50% within 6 hours',
  adjustment: '−22% on base rate',
  channel: 'All',
  status: 'Active',
  updatedAt: '09 Aug 2026'
},
{
  id: 'PRC-04',
  name: 'Monsoon Goa correction',
  scope: 'Goa',
  trigger: 'Jun–Aug stays',
  adjustment: '−15% on base rate',
  channel: 'Website',
  status: 'Paused',
  updatedAt: '02 Aug 2026'
},
{
  id: 'PRC-05',
  name: 'Festive peak — Diwali',
  scope: 'All properties',
  trigger: '08 Nov – 16 Nov 2026',
  adjustment: '+32% on base rate',
  channel: 'All',
  status: 'Active',
  updatedAt: '19 Aug 2026'
}];


export const reportTemplates = [
{
  id: 'RPT-01',
  name: 'Booking summary',
  description: 'Every booking with status, channel, room type, and net value for the selected range.',
  category: 'Bookings',
  lastRun: '19 Aug 2026, 08:00 AM',
  rows: 18422
},
{
  id: 'RPT-02',
  name: 'Revenue & commission',
  description: 'Gross, net, commission earned, and tax collected split by city and property.',
  category: 'Revenue',
  lastRun: '19 Aug 2026, 08:00 AM',
  rows: 1240
},
{
  id: 'RPT-03',
  name: 'Partner performance',
  description: 'Occupancy, cancellations, rating, and payout position per partner.',
  category: 'Partners',
  lastRun: '18 Aug 2026, 08:00 AM',
  rows: 412
},
{
  id: 'RPT-04',
  name: 'Property occupancy',
  description: 'Daily occupancy and ADR per property with room-type breakdown.',
  category: 'Properties',
  lastRun: '19 Aug 2026, 08:00 AM',
  rows: 3860
},
{
  id: 'RPT-05',
  name: 'Refund & chargeback ledger',
  description: 'All refund requests, approvals, and gateway outcomes with ageing.',
  category: 'Revenue',
  lastRun: '17 Aug 2026, 08:00 AM',
  rows: 622
},
{
  id: 'RPT-06',
  name: 'GST filing extract',
  description: 'Tax collected per state with HSN codes, formatted for GSTR-1 upload.',
  category: 'Revenue',
  lastRun: '01 Aug 2026, 06:00 AM',
  rows: 28
}];