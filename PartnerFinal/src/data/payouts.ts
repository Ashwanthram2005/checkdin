export type PayoutStage = 'Pending' | 'On process' | 'Completed';

export type Payout = {
  id: string;
  reference: string;
  period: string;
  requestedOn: string;
  amount: number;
  bookings: number;
  stage: PayoutStage;
  note: string;
};

export const payoutBalance = {
  available: 86450,
  inTransit: 24300,
  paidThisMonth: 312400,
  nextCycle: '20 Aug 2026',
  lastPayout: { amount: 74200, date: '05 Aug 2026' }
};

export const payouts: Payout[] = [
{
  id: 'p1',
  reference: 'PO-20826',
  period: '10 Aug – 16 Aug',
  requestedOn: '16 Aug 2026',
  amount: 42850,
  bookings: 38,
  stage: 'Pending',
  note: 'Awaiting approval'
},
{
  id: 'p2',
  reference: 'PO-20811',
  period: '03 Aug – 09 Aug',
  requestedOn: '10 Aug 2026',
  amount: 24300,
  bookings: 22,
  stage: 'On process',
  note: 'Bank transfer initiated'
},
{
  id: 'p3',
  reference: 'PO-20794',
  period: '27 Jul – 02 Aug',
  requestedOn: '03 Aug 2026',
  amount: 31600,
  bookings: 29,
  stage: 'On process',
  note: 'Expected in 1–2 working days'
},
{
  id: 'p4',
  reference: 'PO-20762',
  period: '20 Jul – 26 Jul',
  requestedOn: '27 Jul 2026',
  amount: 74200,
  bookings: 61,
  stage: 'Completed',
  note: 'Paid on 05 Aug 2026'
},
{
  id: 'p5',
  reference: 'PO-20738',
  period: '13 Jul – 19 Jul',
  requestedOn: '20 Jul 2026',
  amount: 58900,
  bookings: 47,
  stage: 'Completed',
  note: 'Paid on 24 Jul 2026'
},
{
  id: 'p6',
  reference: 'PO-20705',
  period: '06 Jul – 12 Jul',
  requestedOn: '13 Jul 2026',
  amount: 66150,
  bookings: 53,
  stage: 'Completed',
  note: 'Paid on 17 Jul 2026'
}];


export const savedBankAccount = {
  holderName: 'Karthik Raman',
  accountNumber: '5041 2298 7734',
  ifsc: 'HDFC0001284',
  branch: 'T. Nagar, Chennai',
  bankName: 'HDFC Bank'
};