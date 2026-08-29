import type { Payout, Refund } from '../types';
import { partners } from './partners';
import { bookings } from './bookings';

const payoutStatuses: Payout['status'][] = ['Pending', 'Approved', 'Completed', 'Failed'];

export const payouts: Payout[] = Array.from({ length: 24 }, (_, index) => {
  const partner = partners[index % partners.length];
  const status = payoutStatuses[index % payoutStatuses.length];
  const gross = 84000 + index % 7 * 46500;
  const commission = Math.round(gross * (partner.commissionRate / 100));
  const tax = Math.round(commission * 0.18);
  return {
    id: `PYT-${5200 + index}`,
    reference: `PO/2026/08/${1100 + index}`,
    partnerId: partner.id,
    partnerName: partner.name,
    period: index % 2 === 0 ? '01–15 Aug 2026' : '16–31 Jul 2026',
    gross,
    commission,
    tax,
    net: gross - commission - tax,
    status,
    requestedAt: `2026-08-${String(2 + index % 16).padStart(2, '0')}`,
    utr: status === 'Completed' ? `HDFCN${44710000 + index * 91}` : undefined
  };
});

const refundStatuses: Refund['status'][] = ['Requested', 'Approved', 'Processed', 'Rejected'];

export const refunds: Refund[] = bookings.slice(0, 22).map((booking, index) => {
  const type: Refund['type'] = index % 3 === 0 ? 'Partial' : 'Full';
  return {
    id: `RFD-${7300 + index}`,
    reference: `RF/2026/08/${2200 + index}`,
    bookingCode: booking.code,
    customerName: booking.customerName,
    propertyName: booking.propertyName,
    bookingAmount: booking.amount,
    refundAmount: type === 'Full' ? booking.amount : Math.round(booking.amount * 0.5),
    type,
    reason: [
    'Guest cancelled within free window',
    'Room not as described',
    'Property unavailable on arrival',
    'Duplicate payment captured',
    'Partner-initiated cancellation'][
    index % 5],
    status: refundStatuses[index % refundStatuses.length],
    requestedAt: `2026-08-${String(4 + index % 15).padStart(2, '0')}`
  };
});

export const revenueSummary = {
  gross: 41230000,
  net: 35980000,
  commission: 4790000,
  taxes: 862000,
  grossChange: 14.2,
  netChange: 11.8,
  commissionChange: 9.4,
  taxChange: 6.1
};

export const dailyRevenue = Array.from({ length: 14 }, (_, index) => ({
  label: `${5 + index} Aug`,
  gross: 980000 + index * 34000 + index % 3 * 92000,
  net: 840000 + index * 28000 + index % 3 * 71000,
  commission: 118000 + index * 4200
}));

export const weeklyRevenue = [
{ label: 'W27', gross: 6420000, net: 5510000, commission: 742000 },
{ label: 'W28', gross: 6890000, net: 5940000, commission: 786000 },
{ label: 'W29', gross: 7210000, net: 6180000, commission: 831000 },
{ label: 'W30', gross: 6980000, net: 6020000, commission: 804000 },
{ label: 'W31', gross: 7640000, net: 6610000, commission: 878000 },
{ label: 'W32', gross: 8110000, net: 7020000, commission: 921000 },
{ label: 'W33', gross: 8460000, net: 7290000, commission: 964000 }];


export const monthlyRevenue = [
{ label: 'Mar', gross: 24800000, net: 21200000, commission: 2910000 },
{ label: 'Apr', gross: 26400000, net: 22600000, commission: 3080000 },
{ label: 'May', gross: 31200000, net: 26800000, commission: 3640000 },
{ label: 'Jun', gross: 29700000, net: 25500000, commission: 3460000 },
{ label: 'Jul', gross: 36900000, net: 31700000, commission: 4290000 },
{ label: 'Aug', gross: 41230000, net: 35980000, commission: 4790000 }];