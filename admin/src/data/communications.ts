import type { RoleId } from './roles';

export type Department = 'General' | 'Operations' | 'Finance' | 'Support' | 'Marketing' | 'Management';
export type Presence = 'online' | 'away' | 'offline';
export type Priority = 'Low' | 'Medium' | 'High' | 'Urgent';
export type RequestStatus = 'Pending' | 'In Review' | 'Approved' | 'Rejected' | 'Completed';

export interface AdminPerson {
  id: string;
  name: string;
  title: string;
  roleId: RoleId;
  department: Department;
  presence: Presence;
  lastSeen: string;
}

export interface Attachment {
  name: string;
  kind: 'pdf' | 'excel' | 'image' | 'doc';
  size: string;
}

export interface Reaction {
  emoji: string;
  by: string[];
}

export interface ChatMessage {
  id: string;
  threadId: string;
  authorId: string;
  body: string;
  at: string;
  priority?: Priority;
  attachments?: Attachment[];
  reactions: Reaction[];
  readBy: string[];
}

export interface Channel {
  id: string;
  name: string;
  purpose: string;
  topics: string[];
  roles: RoleId[];
  unread: number;
}

export interface DirectThread {
  id: string;
  personId: string;
  unread: number;
  lastAt: string;
}

export interface Announcement {
  id: string;
  title: string;
  body: string;
  category: 'Product' | 'Maintenance' | 'Process' | 'People';
  audience: string;
  priority: Priority;
  postedBy: string;
  at: string;
  pinned: boolean;
}

export interface RequestUpdate {
  at: string;
  by: string;
  note: string;
  status: RequestStatus;
}

export interface InternalRequest {
  id: string;
  ref: string;
  subject: string;
  from: Department;
  to: Department;
  requesterId: string;
  assigneeId: string | null;
  priority: Priority;
  status: RequestStatus;
  bookingId?: string;
  propertyId?: string;
  message: string;
  at: string;
  updates: RequestUpdate[];
}

export interface ActivityItem {
  id: string;
  actorId: string;
  kind: 'message' | 'request' | 'announcement' | 'approval' | 'mention';
  text: string;
  context: string;
  at: string;
}

export const REACTIONS = ['👍', '✅', '❌', '🔥', '🚀'];

export const priorities: Priority[] = ['Low', 'Medium', 'High', 'Urgent'];

export const requestStatuses: RequestStatus[] = ['Pending', 'In Review', 'Approved', 'Rejected', 'Completed'];

export const people: AdminPerson[] = [
{
  id: 'ADM-01',
  name: 'Karthik Raman',
  title: 'Founder & Platform Owner',
  roleId: 'super',
  department: 'Management',
  presence: 'online',
  lastSeen: 'now'
},
{
  id: 'ADM-05',
  name: 'Varun Joshi',
  title: 'Head of Operations',
  roleId: 'operations',
  department: 'Operations',
  presence: 'online',
  lastSeen: 'now'
},
{
  id: 'ADM-07',
  name: 'Harish Kumar',
  title: 'Property Onboarding Lead',
  roleId: 'operations',
  department: 'Operations',
  presence: 'away',
  lastSeen: '18m ago'
},
{
  id: 'ADM-04',
  name: 'Pooja Nambiar',
  title: 'Finance Controller',
  roleId: 'finance',
  department: 'Finance',
  presence: 'online',
  lastSeen: 'now'
},
{
  id: 'ADM-08',
  name: 'Meera Iyer',
  title: 'Settlements Analyst',
  roleId: 'finance',
  department: 'Finance',
  presence: 'offline',
  lastSeen: 'Yesterday, 7:40 PM'
},
{
  id: 'ADM-02',
  name: 'Ritu Malhotra',
  title: 'Support Lead',
  roleId: 'support',
  department: 'Support',
  presence: 'online',
  lastSeen: 'now'
},
{
  id: 'ADM-03',
  name: 'Sahil Grover',
  title: 'Escalations Specialist',
  roleId: 'support',
  department: 'Support',
  presence: 'away',
  lastSeen: '32m ago'
},
{
  id: 'ADM-06',
  name: 'Zoya Qureshi',
  title: 'Growth & Campaigns',
  roleId: 'marketing',
  department: 'Marketing',
  presence: 'online',
  lastSeen: 'now'
}];


export function personByRole(roleId: RoleId): AdminPerson {
  return people.find((person) => person.roleId === roleId) ?? people[0];
}

export function personById(id: string): AdminPerson | undefined {
  return people.find((person) => person.id === id);
}

export const channels: Channel[] = [
{
  id: 'general',
  name: 'General',
  purpose: 'Everything every admin should see — nothing department specific.',
  topics: ['Announcements', 'Shift handovers', 'Platform status'],
  roles: ['super', 'operations', 'finance', 'support', 'marketing'],
  unread: 3
},
{
  id: 'operations',
  name: 'Operations Team',
  purpose: 'Property onboarding, inventory, booking issues, housekeeping.',
  topics: ['Property onboarding', 'Inventory issues', 'Booking issues', 'Housekeeping'],
  roles: ['super', 'operations'],
  unread: 5
},
{
  id: 'finance',
  name: 'Finance Team',
  purpose: 'Payout approvals, refunds, revenue queries, invoice verification.',
  topics: ['Payout approvals', 'Refund discussions', 'Revenue queries', 'Invoice verification'],
  roles: ['super', 'finance'],
  unread: 2
},
{
  id: 'support',
  name: 'Support Team',
  purpose: 'Customer escalations, partner complaints, ticket updates.',
  topics: ['Customer escalations', 'Partner complaints', 'Ticket updates'],
  roles: ['super', 'support'],
  unread: 4
},
{
  id: 'marketing',
  name: 'Marketing Team',
  purpose: 'Campaign planning, coupon launches, promotion approvals.',
  topics: ['Campaign planning', 'Coupon launches', 'Promotion approvals'],
  roles: ['super', 'marketing'],
  unread: 1
},
{
  id: 'management',
  name: 'Management',
  purpose: 'Super Admin and department heads only.',
  topics: ['Weekly numbers', 'Hiring', 'Escalated decisions'],
  roles: ['super'],
  unread: 0
}];


export const channelMessages: ChatMessage[] = [
{
  id: 'MSG-101',
  threadId: 'general',
  authorId: 'ADM-01',
  body: 'Morning all — the 19 Aug payout cycle runs at 6 PM. Please clear your queues before then.',
  at: '19 Aug, 09:02 AM',
  reactions: [{ emoji: '👍', by: ['ADM-04', 'ADM-05', 'ADM-02'] }],
  readBy: ['ADM-04', 'ADM-05', 'ADM-02', 'ADM-06']
},
{
  id: 'MSG-102',
  threadId: 'general',
  authorId: 'ADM-05',
  body: 'Ops queue is clear except two property approvals waiting on fire NOCs. @Finance nothing blocking on our side.',
  at: '19 Aug, 09:14 AM',
  reactions: [{ emoji: '✅', by: ['ADM-04'] }],
  readBy: ['ADM-01', 'ADM-04']
},
{
  id: 'MSG-103',
  threadId: 'general',
  authorId: 'ADM-02',
  body: 'Heads up: WhatsApp provider had a 4-minute blip at 08:40. All queued guest messages have since delivered.',
  at: '19 Aug, 09:41 AM',
  priority: 'Medium',
  reactions: [],
  readBy: ['ADM-01']
},
{
  id: 'MSG-201',
  threadId: 'operations',
  authorId: 'ADM-07',
  body: 'Pink City Haveli (PRP-1010) uploaded the heritage permit. Docs look clean — requesting approval.',
  at: '19 Aug, 10:05 AM',
  attachments: [{ name: 'heritage-permit-jaipur.pdf', kind: 'pdf', size: '1.2 MB' }],
  reactions: [{ emoji: '🔥', by: ['ADM-05'] }],
  readBy: ['ADM-05']
},
{
  id: 'MSG-202',
  threadId: 'operations',
  authorId: 'ADM-05',
  body: 'Approved. @Harish please push the listing live and set the launch rate at ₹3,400 for the first two weeks.',
  at: '19 Aug, 10:22 AM',
  reactions: [{ emoji: '✅', by: ['ADM-07'] }],
  readBy: ['ADM-07', 'ADM-01']
},
{
  id: 'MSG-203',
  threadId: 'operations',
  authorId: 'ADM-07',
  body: 'Andheri Transit Rooms has 3 rooms stuck in maintenance since 17 Aug — housekeeping says AC parts arrive tomorrow.',
  at: '19 Aug, 11:48 AM',
  priority: 'High',
  reactions: [],
  readBy: []
},
{
  id: 'MSG-204',
  threadId: 'operations',
  authorId: 'ADM-05',
  body: 'Blocking those rooms on the inventory calendar until Thursday so we stop taking bookings against them.',
  at: '19 Aug, 11:55 AM',
  reactions: [{ emoji: '👍', by: ['ADM-07'] }],
  readBy: []
},
{
  id: 'MSG-301',
  threadId: 'finance',
  authorId: 'ADM-08',
  body: 'PO/2026/08/1104 failed twice at the bank. Partner confirmed the IFSC changed — need approval for a manual transfer.',
  at: '19 Aug, 10:31 AM',
  priority: 'High',
  attachments: [{ name: 'failed-transfers-aug.xlsx', kind: 'excel', size: '86 KB' }],
  reactions: [],
  readBy: ['ADM-04']
},
{
  id: 'MSG-302',
  threadId: 'finance',
  authorId: 'ADM-04',
  body: 'Verified the new bank proof. Go ahead with IMPS and attach the UTR to the payout record.',
  at: '19 Aug, 10:44 AM',
  reactions: [{ emoji: '✅', by: ['ADM-08'] }],
  readBy: ['ADM-08']
},
{
  id: 'MSG-303',
  threadId: 'finance',
  authorId: 'ADM-04',
  body: 'GST extract for July is filed. Commission take rate landed at 12.4% — slightly above plan.',
  at: '19 Aug, 12:10 PM',
  reactions: [{ emoji: '🚀', by: ['ADM-01'] }],
  readBy: ['ADM-01']
},
{
  id: 'MSG-401',
  threadId: 'support',
  authorId: 'ADM-03',
  body: 'SUP-90412 is now 5 days old — guest still has not received the refund on CHK-74108. Escalating to Finance.',
  at: '19 Aug, 11:12 AM',
  priority: 'Urgent',
  reactions: [],
  readBy: ['ADM-02']
},
{
  id: 'MSG-402',
  threadId: 'support',
  authorId: 'ADM-02',
  body: 'Raised an internal request to @Finance and promised the guest an update by 6 PM today.',
  at: '19 Aug, 11:20 AM',
  reactions: [{ emoji: '👍', by: ['ADM-03'] }],
  readBy: ['ADM-03']
},
{
  id: 'MSG-403',
  threadId: 'support',
  authorId: 'ADM-03',
  body: 'Partner complaint from Jubilee Hills Stayspace about the suspension — sending the evidence pack to @Operations.',
  at: '19 Aug, 01:02 PM',
  attachments: [{ name: 'stayspace-complaint.pdf', kind: 'pdf', size: '640 KB' }],
  reactions: [],
  readBy: []
},
{
  id: 'MSG-501',
  threadId: 'marketing',
  authorId: 'ADM-06',
  body: 'Diwali campaign creative is ready. Coupon FESTIVE500 goes live 10 Oct — needs Finance sign-off on the discount cap.',
  at: '19 Aug, 10:50 AM',
  attachments: [{ name: 'diwali-hero-banner.png', kind: 'image', size: '2.1 MB' }],
  reactions: [{ emoji: '🔥', by: ['ADM-01', 'ADM-02'] }],
  readBy: ['ADM-01']
},
{
  id: 'MSG-502',
  threadId: 'marketing',
  authorId: 'ADM-06',
  body: 'CHECKDIN20 has burned 4,128 of 5,000 redemptions. Do we top it up or let it expire on 31 Aug?',
  at: '19 Aug, 02:15 PM',
  priority: 'Medium',
  reactions: [],
  readBy: []
},
{
  id: 'MSG-601',
  threadId: 'management',
  authorId: 'ADM-01',
  body: 'Weekly review Thursday 4 PM. Bring occupancy by city, payout ageing, and the fraud exposure number.',
  at: '19 Aug, 08:30 AM',
  reactions: [{ emoji: '👍', by: ['ADM-05', 'ADM-04'] }],
  readBy: ['ADM-05', 'ADM-04', 'ADM-02']
},
{
  id: 'MSG-602',
  threadId: 'management',
  authorId: 'ADM-04',
  body: 'Flagging early: chargeback exposure is ₹40K this week, mostly one Goa villa booking on a stolen card.',
  at: '19 Aug, 09:20 AM',
  priority: 'High',
  reactions: [],
  readBy: ['ADM-01']
}];


export const directThreads: DirectThread[] = [
{ id: 'dm-ADM-04', personId: 'ADM-04', unread: 2, lastAt: '12:41 PM' },
{ id: 'dm-ADM-05', personId: 'ADM-05', unread: 0, lastAt: '11:58 AM' },
{ id: 'dm-ADM-02', personId: 'ADM-02', unread: 1, lastAt: '11:20 AM' },
{ id: 'dm-ADM-06', personId: 'ADM-06', unread: 0, lastAt: 'Yesterday' },
{ id: 'dm-ADM-01', personId: 'ADM-01', unread: 0, lastAt: 'Yesterday' },
{ id: 'dm-ADM-03', personId: 'ADM-03', unread: 0, lastAt: '2 days ago' },
{ id: 'dm-ADM-07', personId: 'ADM-07', unread: 0, lastAt: '2 days ago' },
{ id: 'dm-ADM-08', personId: 'ADM-08', unread: 0, lastAt: '3 days ago' }];


export const directMessages: ChatMessage[] = [
{
  id: 'DM-101',
  threadId: 'dm-ADM-04',
  authorId: 'ADM-04',
  body: 'Do you have the refund approval for CHK-74108? Support is chasing it and the guest is on day five.',
  at: '19 Aug, 12:38 PM',
  reactions: [],
  readBy: []
},
{
  id: 'DM-102',
  threadId: 'dm-ADM-04',
  authorId: 'ADM-04',
  body: 'I can push it manually if you approve on the request thread.',
  at: '19 Aug, 12:41 PM',
  priority: 'High',
  reactions: [],
  readBy: []
},
{
  id: 'DM-201',
  threadId: 'dm-ADM-05',
  authorId: 'ADM-05',
  body: 'Pink City Haveli is live. Launch rate set at ₹3,400 for two weeks as discussed.',
  at: '19 Aug, 11:58 AM',
  reactions: [{ emoji: '🚀', by: ['ADM-01'] }],
  readBy: ['ADM-01']
},
{
  id: 'DM-301',
  threadId: 'dm-ADM-02',
  authorId: 'ADM-02',
  body: 'Guest on CHK-74108 has threatened a chargeback. Can we get the refund out today?',
  at: '19 Aug, 11:20 AM',
  priority: 'Urgent',
  reactions: [],
  readBy: []
},
{
  id: 'DM-401',
  threadId: 'dm-ADM-06',
  authorId: 'ADM-06',
  body: 'Sharing the Diwali plan deck ahead of Thursday.',
  at: '18 Aug, 05:12 PM',
  attachments: [{ name: 'diwali-growth-plan.pdf', kind: 'pdf', size: '3.4 MB' }],
  reactions: [{ emoji: '👍', by: ['ADM-01'] }],
  readBy: ['ADM-01']
},
{
  id: 'DM-501',
  threadId: 'dm-ADM-01',
  authorId: 'ADM-01',
  body: 'Nice work on the July numbers. Let us hold the commission change until after Diwali.',
  at: '18 Aug, 09:02 PM',
  reactions: [{ emoji: '✅', by: ['ADM-04'] }],
  readBy: ['ADM-04']
},
{
  id: 'DM-601',
  threadId: 'dm-ADM-03',
  authorId: 'ADM-03',
  body: 'Sent the Stayspace evidence pack over to Operations.',
  at: '17 Aug, 04:44 PM',
  reactions: [],
  readBy: ['ADM-02']
},
{
  id: 'DM-701',
  threadId: 'dm-ADM-07',
  authorId: 'ADM-07',
  body: 'Three rooms at Andheri still down. Parts land tomorrow.',
  at: '17 Aug, 10:10 AM',
  reactions: [],
  readBy: ['ADM-05']
},
{
  id: 'DM-801',
  threadId: 'dm-ADM-08',
  authorId: 'ADM-08',
  body: 'Settlement file for 01–15 Aug is reconciled. Two mismatches, both resolved.',
  at: '16 Aug, 06:30 PM',
  attachments: [{ name: 'settlement-01-15-aug.xlsx', kind: 'excel', size: '412 KB' }],
  reactions: [],
  readBy: ['ADM-04']
}];


export const announcements: Announcement[] = [
{
  id: 'ANN-01',
  title: 'Hourly slot pricing v2 rolls out on 22 Aug',
  body: 'Slot multipliers move from a flat share of the nightly rate to a per-property curve. Operations should re-check launch rates for any property onboarded this week. No action needed for Finance or Support.',
  category: 'Product',
  audience: 'All admins',
  priority: 'High',
  postedBy: 'ADM-01',
  at: '19 Aug, 08:15 AM',
  pinned: true
},
{
  id: 'ANN-02',
  title: 'Scheduled maintenance — 23 Aug, 01:00–03:00 IST',
  body: 'Payout processing and report generation will be paused for two hours while we migrate the settlements database. Booking and check-in flows stay online.',
  category: 'Maintenance',
  audience: 'All admins',
  priority: 'Medium',
  postedBy: 'ADM-01',
  at: '18 Aug, 06:40 PM',
  pinned: false
},
{
  id: 'ANN-03',
  title: 'New partner onboarding process is live',
  body: 'KYC, fire NOC, and bank verification now happen in one queue. Operations approves documents, Finance approves the bank account, and the listing goes live only when both clear.',
  category: 'Process',
  audience: 'Operations, Finance',
  priority: 'Medium',
  postedBy: 'ADM-01',
  at: '17 Aug, 11:00 AM',
  pinned: false
},
{
  id: 'ANN-04',
  title: 'Holiday notice — office closed 15 Aug',
  body: 'Independence Day. Support runs a skeleton roster; everyone else is off. Escalations route to Ritu Malhotra.',
  category: 'People',
  audience: 'All admins',
  priority: 'Low',
  postedBy: 'ADM-01',
  at: '12 Aug, 04:20 PM',
  pinned: false
}];


export const internalRequests: InternalRequest[] = [
{
  id: 'REQ-01',
  ref: 'INT/2026/08/041',
  subject: 'Refund approval required',
  from: 'Support',
  to: 'Finance',
  requesterId: 'ADM-02',
  assigneeId: 'ADM-04',
  priority: 'High',
  status: 'In Review',
  bookingId: 'CHK-74108',
  message:
  'Guest cancelled within the free window and is eligible for a full refund of ₹12,400. Gateway shows the refund approved but not settled — please push manually.',
  at: '19 Aug, 11:22 AM',
  updates: [
  { at: '19 Aug, 11:22 AM', by: 'Ritu Malhotra', note: 'Raised with evidence from the support thread.', status: 'Pending' },
  { at: '19 Aug, 12:05 PM', by: 'Pooja Nambiar', note: 'Confirmed with the gateway, initiating a manual push.', status: 'In Review' }]

},
{
  id: 'REQ-02',
  ref: 'INT/2026/08/040',
  subject: 'Fire NOC verification for Pink City Haveli',
  from: 'Operations',
  to: 'Management',
  requesterId: 'ADM-07',
  assigneeId: 'ADM-01',
  priority: 'Medium',
  status: 'Approved',
  propertyId: 'PRP-1010',
  message: 'Heritage permit and fire NOC uploaded. Requesting final sign-off to publish the listing.',
  at: '19 Aug, 10:08 AM',
  updates: [
  { at: '19 Aug, 10:08 AM', by: 'Harish Kumar', note: 'Documents attached.', status: 'Pending' },
  { at: '19 Aug, 10:20 AM', by: 'Karthik Raman', note: 'Approved — publish with a two-week launch rate.', status: 'Approved' }]

},
{
  id: 'REQ-03',
  ref: 'INT/2026/08/039',
  subject: 'Discount cap sign-off for FESTIVE500',
  from: 'Marketing',
  to: 'Finance',
  requesterId: 'ADM-06',
  assigneeId: 'ADM-04',
  priority: 'Medium',
  status: 'Pending',
  message: 'Requesting approval for a ₹500 flat discount with a 10,000 redemption cap for the Diwali window.',
  at: '19 Aug, 10:55 AM',
  updates: [{ at: '19 Aug, 10:55 AM', by: 'Zoya Qureshi', note: 'Campaign brief attached in the marketing channel.', status: 'Pending' }]
},
{
  id: 'REQ-04',
  ref: 'INT/2026/08/038',
  subject: 'Manual payout for failed IFSC transfer',
  from: 'Finance',
  to: 'Management',
  requesterId: 'ADM-08',
  assigneeId: 'ADM-01',
  priority: 'Urgent',
  status: 'Approved',
  message: 'PO/2026/08/1104 failed twice. Partner submitted a new bank proof; requesting approval for an IMPS transfer of ₹1,42,300.',
  at: '19 Aug, 10:35 AM',
  updates: [
  { at: '19 Aug, 10:35 AM', by: 'Meera Iyer', note: 'Bank proof verified.', status: 'Pending' },
  { at: '19 Aug, 10:48 AM', by: 'Karthik Raman', note: 'Approved. Attach the UTR when done.', status: 'Approved' }]

},
{
  id: 'REQ-05',
  ref: 'INT/2026/08/037',
  subject: 'Block inventory at Andheri Transit Rooms',
  from: 'Operations',
  to: 'Support',
  requesterId: 'ADM-05',
  assigneeId: 'ADM-02',
  priority: 'High',
  status: 'Completed',
  propertyId: 'PRP-1006',
  message: 'Three rooms are out of service until Thursday. Please stop offering them as alternatives on escalations.',
  at: '18 Aug, 04:12 PM',
  updates: [
  { at: '18 Aug, 04:12 PM', by: 'Varun Joshi', note: 'Rooms blocked on the calendar.', status: 'Pending' },
  { at: '18 Aug, 05:02 PM', by: 'Ritu Malhotra', note: 'Support macros updated.', status: 'Completed' }]

},
{
  id: 'REQ-06',
  ref: 'INT/2026/08/036',
  subject: 'Chargeback evidence pack for pay_R8812200',
  from: 'Finance',
  to: 'Support',
  requesterId: 'ADM-04',
  assigneeId: 'ADM-03',
  priority: 'Urgent',
  status: 'Pending',
  bookingId: 'CHK-74122',
  message: 'Evidence window closes in 3 days. Need the guest correspondence and check-in log for the Goa villa stay.',
  at: '19 Aug, 09:30 AM',
  updates: [{ at: '19 Aug, 09:30 AM', by: 'Pooja Nambiar', note: 'Raised against the disputed transaction.', status: 'Pending' }]
},
{
  id: 'REQ-07',
  ref: 'INT/2026/08/035',
  subject: 'Reject duplicate listing request',
  from: 'Support',
  to: 'Operations',
  requesterId: 'ADM-03',
  assigneeId: 'ADM-05',
  priority: 'Low',
  status: 'Rejected',
  propertyId: 'PRP-1007',
  message: 'Partner submitted the same property twice with different photos.',
  at: '17 Aug, 02:40 PM',
  updates: [
  { at: '17 Aug, 02:40 PM', by: 'Sahil Grover', note: 'Flagged during ticket triage.', status: 'Pending' },
  { at: '17 Aug, 03:15 PM', by: 'Varun Joshi', note: 'Not a duplicate — different building on the same road.', status: 'Rejected' }]

}];


export const activityFeed: ActivityItem[] = [
{ id: 'ACT-01', actorId: 'ADM-04', kind: 'request', text: 'moved INT/2026/08/041 to In Review', context: 'Refund approval required · CHK-74108', at: '19 Aug, 12:05 PM' },
{ id: 'ACT-02', actorId: 'ADM-06', kind: 'message', text: 'posted in Marketing Team', context: 'CHECKDIN20 redemption top-up', at: '19 Aug, 02:15 PM' },
{ id: 'ACT-03', actorId: 'ADM-02', kind: 'mention', text: 'mentioned @Finance in Support Team', context: 'SUP-90412 escalation', at: '19 Aug, 11:20 AM' },
{ id: 'ACT-04', actorId: 'ADM-05', kind: 'approval', text: 'approved the Pink City Haveli listing', context: 'PRP-1010 · Jaipur', at: '19 Aug, 10:22 AM' },
{ id: 'ACT-05', actorId: 'ADM-01', kind: 'announcement', text: 'published an announcement', context: 'Hourly slot pricing v2 rolls out on 22 Aug', at: '19 Aug, 08:15 AM' },
{ id: 'ACT-06', actorId: 'ADM-08', kind: 'request', text: 'raised INT/2026/08/038', context: 'Manual payout for failed IFSC transfer', at: '19 Aug, 10:35 AM' },
{ id: 'ACT-07', actorId: 'ADM-07', kind: 'message', text: 'shared a file in Operations Team', context: 'heritage-permit-jaipur.pdf', at: '19 Aug, 10:05 AM' },
{ id: 'ACT-08', actorId: 'ADM-03', kind: 'request', text: 'closed INT/2026/08/035 as Rejected', context: 'Duplicate listing request', at: '17 Aug, 03:15 PM' }];


export const mentionTokens = ['@SuperAdmin', '@Operations', '@Finance', '@Support', '@Marketing'];