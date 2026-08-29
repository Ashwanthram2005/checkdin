import { properties } from '../properties';
import { partners } from '../partners';
import { extensionPerformance } from './extensions';

/* ------------------------------------------------------------ settlements */

export type SettlementStatus = 'Pending' | 'Processed' | 'Failed' | 'Upcoming' | 'On Hold';

export interface Settlement {
  id: string;
  reference: string;
  propertyId: string;
  propertyName: string;
  partnerName: string;
  city: string;
  gross: number;
  commission: number;
  gst: number;
  net: number;
  status: SettlementStatus;
  cycle: string;
  scheduledFor: string;
}

const settlementStatuses: SettlementStatus[] = ['Pending', 'Processed', 'Upcoming', 'Failed', 'Processed', 'On Hold'];

export const settlements: Settlement[] = properties.flatMap((property, index) =>
[0, 1].map((offset) => {
  const gross = Math.round(property.revenue / (6 + offset * 2));
  const commission = Math.round(gross * 0.12);
  const gst = Math.round(commission * 0.18);
  const status = settlementStatuses[(index + offset) % settlementStatuses.length];
  return {
    id: `STL-${property.id}-${offset}`,
    reference: `SET/2026/08/${1100 + index * 2 + offset}`,
    propertyId: property.id,
    propertyName: property.name,
    partnerName: property.partnerName,
    city: property.city,
    gross,
    commission,
    gst,
    net: gross - commission - gst,
    status,
    cycle: offset === 0 ? '01–15 Aug 2026' : '16–31 Aug 2026',
    scheduledFor: offset === 0 ? '19 Aug 2026' : '01 Sep 2026'
  };
})
);

/* ------------------------------------------------------------- promotions */

export type PromotionStatus = 'Active' | 'Scheduled' | 'Expired' | 'Paused';

export interface Promotion {
  id: string;
  name: string;
  code: string;
  scope: string;
  status: PromotionStatus;
  discount: string;
  window: string;
  redemptions: number;
  revenue: number;
  conversion: number;
  occupancyLift: number;
}

export const promotions: Promotion[] = [
{ id: 'PRM-01', name: 'Monsoon day-use', code: 'MONSOON30', scope: 'Chennai · 16 hotels', status: 'Active', discount: '30% up to ₹600', window: '01–31 Aug', redemptions: 3182, revenue: 4120000, conversion: 18.4, occupancyLift: 9.2 },
{ id: 'PRM-02', name: 'Weekday business saver', code: 'WORKWEEK', scope: 'Bengaluru · Mumbai', status: 'Active', discount: '₹400 flat', window: '05 Aug – 30 Sep', redemptions: 2410, revenue: 3380000, conversion: 14.1, occupancyLift: 6.4 },
{ id: 'PRM-03', name: 'Diwali festive', code: 'FESTIVE500', scope: 'All cities', status: 'Scheduled', discount: '₹500 flat', window: '10–24 Oct', redemptions: 0, revenue: 0, conversion: 0, occupancyLift: 0 },
{ id: 'PRM-04', name: 'Goa long weekend', code: 'GOA25', scope: 'Goa · 8 hotels', status: 'Paused', discount: '25% up to ₹900', window: '08–18 Aug', redemptions: 892, revenue: 1740000, conversion: 21.8, occupancyLift: 12.6 },
{ id: 'PRM-05', name: 'First booking', code: 'CHECKDIN20', scope: 'New customers', status: 'Active', discount: '20% up to ₹400', window: 'Always on', redemptions: 4128, revenue: 2960000, conversion: 26.3, occupancyLift: 4.1 },
{ id: 'PRM-06', name: 'Summer layover', code: 'LAYOVER15', scope: 'Airport hotels', status: 'Expired', discount: '15% up to ₹300', window: '01 May – 31 Jul', redemptions: 5210, revenue: 3810000, conversion: 12.7, occupancyLift: 5.8 }];


/* --------------------------------------------------------------- disputes */

export type DisputeKind = 'Extension' | 'Refund' | 'Payment' | 'Booking';
export type DisputeStatus = 'Open' | 'In Review' | 'Escalated' | 'Resolved' | 'Rejected';

export interface Dispute {
  id: string;
  reference: string;
  kind: DisputeKind;
  status: DisputeStatus;
  raisedBy: string;
  party: 'Customer' | 'Partner';
  propertyName: string;
  bookingId: string;
  amount: number;
  summary: string;
  ageHours: number;
  at: string;
}

const disputeSeeds: [DisputeKind, string, string][] = [
['Extension', 'Hotel declined a paid extension', 'Guest paid for a 3-hour extension; the property refused entry and asked them to vacate.'],
['Refund', 'Refund not credited after 7 days', 'Gateway shows the refund approved but the guest bank has no credit.'],
['Payment', 'Double charge on a single booking', 'UPI intent retried and captured twice for the same booking reference.'],
['Booking', 'Room not as listed', 'Guest booked a deluxe twin and was given a standard single.'],
['Refund', 'Partner disputes a refund deduction', 'Partner claims the cancellation was inside the paid window.'],
['Extension', 'Extension charged twice', 'Two extension charges captured within four minutes.'],
['Payment', 'Chargeback filed on a completed stay', 'Card issuer raised a chargeback despite a verified check-in.'],
['Booking', 'Overbooking at check-in', 'Property had no rooms available at the confirmed check-in time.']];


const disputeStatuses: DisputeStatus[] = ['Open', 'In Review', 'Escalated', 'Resolved', 'Rejected'];

export const disputes: Dispute[] = Array.from({ length: 16 }, (_, index) => {
  const [kind, summaryTitle, detail] = disputeSeeds[index % disputeSeeds.length];
  const property = properties[index % properties.length];
  return {
    id: `DSP-${index + 1}`,
    reference: `DIS/2026/08/${300 + index}`,
    kind,
    status: disputeStatuses[index % disputeStatuses.length],
    raisedBy: index % 3 === 0 ? property.partnerName : ['Aditya Sharma', 'Neha Kulkarni', 'Farhan Sheikh', 'Kavya Rao'][index % 4],
    party: index % 3 === 0 ? 'Partner' : 'Customer',
    propertyName: property.name,
    bookingId: `CHK-${74100 + index * 5}`,
    amount: 1800 + index * 940,
    summary: `${summaryTitle} — ${detail}`,
    ageHours: 3 + index * 7,
    at: `${19 - Math.floor(index / 3)} Aug, ${String(9 + index % 10).padStart(2, '0')}:${String(index * 11 % 60).padStart(2, '0')}`
  };
});

/* ------------------------------------------------------------ performance */

export interface HotelHealth {
  propertyId: string;
  propertyName: string;
  city: string;
  partnerName: string;
  occupancy: number;
  rating: number;
  acceptance: number;
  extensionApproval: number;
  responseMinutes: number;
  cancellation: number;
  revenue: number;
  score: number;
}

export const hotelHealth: HotelHealth[] = properties.
map((property, index) => {
  const extension = extensionPerformance.find((row) => row.propertyId === property.id);
  const acceptance = 78 + index * 5 % 20;
  const cancellation = 4 + index * 3 % 12;
  const responseMinutes = extension?.avgResponseMinutes || 12 + index % 20;
  const extensionApproval = extension?.approvalRate ?? 60;
  const score = Math.round(
    property.occupancy * 0.25 +
    property.rating / 5 * 100 * 0.2 +
    acceptance * 0.2 +
    extensionApproval * 0.15 +
    Math.max(0, 100 - responseMinutes * 2) * 0.1 +
    Math.max(0, 100 - cancellation * 4) * 0.1
  );
  return {
    propertyId: property.id,
    propertyName: property.name,
    city: property.city,
    partnerName: property.partnerName,
    occupancy: property.occupancy,
    rating: property.rating,
    acceptance,
    extensionApproval,
    responseMinutes,
    cancellation,
    revenue: property.revenue,
    score
  };
}).
sort((a, b) => b.score - a.score);

/* ------------------------------------------------------------- compliance */

export type VerificationState = 'Verified' | 'Pending' | 'Rejected' | 'Not submitted';

export interface ComplianceRecord {
  propertyId: string;
  propertyName: string;
  city: string;
  partnerName: string;
  kyc: VerificationState;
  gst: VerificationState;
  bank: VerificationState;
  property: VerificationState;
  agreement: VerificationState;
  submittedAt: string;
  stage: 'Onboarding' | 'Live' | 'Suspended';
}

const verificationCycle: VerificationState[] = ['Verified', 'Verified', 'Pending', 'Verified', 'Rejected', 'Not submitted'];

export const complianceRecords: ComplianceRecord[] = properties.map((property, index) => ({
  propertyId: property.id,
  propertyName: property.name,
  city: property.city,
  partnerName: property.partnerName,
  kyc: verificationCycle[index % verificationCycle.length],
  gst: verificationCycle[(index + 1) % verificationCycle.length],
  bank: verificationCycle[(index + 2) % verificationCycle.length],
  property: verificationCycle[(index + 3) % verificationCycle.length],
  agreement: verificationCycle[(index + 4) % verificationCycle.length],
  submittedAt: `${4 + index % 14} Aug 2026`,
  stage: index % 5 === 0 ? 'Onboarding' : index % 7 === 0 ? 'Suspended' : 'Live'
}));

/* ------------------------------------------------------------------- risk */

export type RiskBand = 'Low' | 'Medium' | 'High';

export interface RiskEntity {
  id: string;
  name: string;
  type: 'Hotel' | 'Customer';
  city: string;
  score: number;
  band: RiskBand;
  signals: string[];
  exposure: number;
  lastEvent: string;
}

function bandFor(score: number): RiskBand {
  if (score >= 75) return 'High';
  if (score >= 45) return 'Medium';
  return 'Low';
}

const customerRiskNames = ['Rohit Desai', 'Ishita Bose', 'Manish Tiwari', 'Anjali Pillai', 'Farhan Sheikh', 'Kavya Rao'];
const signalPool = [
'Fake booking pattern — 6 bookings, 0 check-ins',
'Excessive cancellations — 48% in 30 days',
'Payment abuse — 4 cards on one device',
'Fraudulent refund requests — 3 rejected claims',
'Abnormal extension activity — 11 extensions in a day',
'Chargeback filed on a verified stay'];


export const riskEntities: RiskEntity[] = [
...properties.slice(0, 5).map((property, index) => {
  const score = 82 - index * 14;
  return {
    id: property.id,
    name: property.name,
    type: 'Hotel' as const,
    city: property.city,
    score,
    band: bandFor(score),
    signals: [signalPool[index % signalPool.length], signalPool[(index + 3) % signalPool.length]],
    exposure: 42000 + index * 18000,
    lastEvent: `${19 - index} Aug, ${10 + index}:20`
  };
}),
...customerRiskNames.map((name, index) => {
  const score = 91 - index * 12;
  return {
    id: `CUS-RISK-${index}`,
    name,
    type: 'Customer' as const,
    city: ['Mumbai', 'Chennai', 'Bengaluru', 'Goa', 'New Delhi', 'Jaipur'][index % 6],
    score,
    band: bandFor(score),
    signals: [signalPool[(index + 1) % signalPool.length], signalPool[(index + 4) % signalPool.length]],
    exposure: 12000 + index * 9400,
    lastEvent: `${19 - index} Aug, ${9 + index}:05`
  };
})];


/* -------------------------------------------------- super admin controls */

export interface ControlAction {
  id: string;
  label: string;
  description: string;
  tone: 'danger' | 'neutral';
  confirm: string;
}

export const controlActions: ControlAction[] = [
{ id: 'force-offline', label: 'Force hotel offline', description: 'Immediately removes the property from search and blocks new bookings.', tone: 'danger', confirm: 'Existing confirmed stays are unaffected; all future inventory is withdrawn.' },
{ id: 'force-online', label: 'Force hotel online', description: 'Overrides a partner pause and restores marketplace visibility.', tone: 'neutral', confirm: 'The partner is notified that Checkdin restored their listing.' },
{ id: 'suspend-hotel', label: 'Suspend hotel', description: 'Suspends the listing pending a compliance or fraud investigation.', tone: 'danger', confirm: 'Payouts continue to accrue but are not released while suspended.' },
{ id: 'freeze-payouts', label: 'Freeze payouts', description: 'Holds every settlement for the partner until manually released.', tone: 'danger', confirm: 'Finance is notified and the current cycle rolls forward.' },
{ id: 'disable-promotions', label: 'Disable promotions', description: 'Turns off every promotion applied to this partner or property.', tone: 'neutral', confirm: 'Guests mid-checkout keep their applied discount.' },
{ id: 'override-pricing', label: 'Override pricing', description: 'Applies a platform-enforced rate ceiling or floor to the listing.', tone: 'neutral', confirm: 'Partner dynamic pricing rules are ignored while the override is active.' },
{ id: 'manual-refund', label: 'Approve manual refund', description: 'Pushes a refund outside the normal approval chain.', tone: 'danger', confirm: 'Requires a written justification attached to the audit log.' },
{ id: 'disable-partner', label: 'Disable partner account', description: 'Locks the PartnerOS account and every property under it.', tone: 'danger', confirm: 'All properties go offline and the partner loses dashboard access.' },
{ id: 'reset-status', label: 'Reset hotel status', description: 'Clears pause, vacation, and offline flags back to Live.', tone: 'neutral', confirm: 'Visibility history is retained in the audit trail.' }];


export const controlAuditLog = [
{ id: 'CTL-01', action: 'Freeze payouts', target: 'Sunrise Hospitality LLP', by: 'Karthik Raman', at: '19 Aug, 11:04', reason: 'Chargeback investigation on pay_R8812200', ip: '49.36.112.18' },
{ id: 'CTL-02', action: 'Force hotel offline', target: 'Jubilee Hills Stayspace', by: 'Karthik Raman', at: '18 Aug, 17:42', reason: 'Fire NOC expired', ip: '49.36.112.18' },
{ id: 'CTL-03', action: 'Override pricing', target: 'Pink City Haveli', by: 'Karthik Raman', at: '18 Aug, 09:15', reason: 'Rate 22% above market ceiling', ip: '49.36.112.18' },
{ id: 'CTL-04', action: 'Approve manual refund', target: 'CHK-74108', by: 'Karthik Raman', at: '17 Aug, 20:30', reason: 'Gateway settlement failure', ip: '106.51.44.9' },
{ id: 'CTL-05', action: 'Reset hotel status', target: 'Andheri Transit Rooms', by: 'Karthik Raman', at: '17 Aug, 12:08', reason: 'Maintenance completed', ip: '49.36.112.18' }];


export const partnerNames = partners.map((partner) => `${partner.name} — ${partner.company}`);