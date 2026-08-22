import type { Booking, BookingStatus, TimelineEvent } from '../types';
import { properties } from './properties';
import { customers } from './customers';

export const bookingStatuses: BookingStatus[] = [
'Pending',
'Confirmed',
'Checked In',
'Checked Out',
'Cancelled',
'Refunded'];


const roomNames = [
{ name: 'Deluxe Twin 204', type: 'Deluxe' },
{ name: 'Standard 108', type: 'Standard' },
{ name: 'Executive Suite 501', type: 'Suite' },
{ name: 'Studio Apartment 3B', type: 'Executive' },
{ name: 'Dorm Bed 12', type: 'Dorm Bed' },
{ name: 'Deluxe King 302', type: 'Deluxe' }];


const sources: Booking['source'][] = ['Website', 'Android App', 'iOS App', 'Walk-in', 'Partner Desk'];
const methods = ['UPI · GPay', 'UPI · PhonePe', 'Razorpay Card', 'Netbanking', 'Pay at hotel'];

function timelineFor(status: BookingStatus, createdAt: string, checkIn: string): TimelineEvent[] {
  const events: TimelineEvent[] = [
  { label: 'Booking created', at: `${createdAt}, 10:12 AM`, by: 'Customer' },
  { label: 'Payment captured', at: `${createdAt}, 10:13 AM`, by: 'Razorpay webhook' }];

  if (status === 'Pending') {
    return [
    { label: 'Awaiting partner confirmation', at: `${createdAt}, 10:14 AM`, by: 'System' },
    ...events];

  }
  events.unshift({ label: 'Confirmed by property', at: `${createdAt}, 10:41 AM`, by: 'Partner desk' });
  if (status === 'Checked In' || status === 'Checked Out') {
    events.unshift({ label: 'Guest checked in', at: `${checkIn}, 02:05 PM`, by: 'Front desk' });
  }
  if (status === 'Checked Out') {
    events.unshift({ label: 'Guest checked out', at: `${checkIn}, 11:20 AM`, by: 'Front desk' });
  }
  if (status === 'Cancelled' || status === 'Refunded') {
    events.unshift({
      label: 'Booking cancelled',
      at: `${checkIn}, 08:30 AM`,
      by: 'Customer',
      note: 'Cancellation within free window — no penalty applied.'
    });
  }
  if (status === 'Refunded') {
    events.unshift({
      label: 'Refund processed',
      at: `${checkIn}, 09:02 AM`,
      by: 'Finance Admin',
      note: 'Full refund credited to source account. UTR 4471120983.'
    });
  }
  return events;
}

function pad(value: number): string {
  return String(value).padStart(2, '0');
}

export const bookings: Booking[] = Array.from({ length: 56 }, (_, index) => {
  const property = properties[index % properties.length];
  const customer = customers[index % customers.length];
  const room = roomNames[index % roomNames.length];
  const status = bookingStatuses[index % bookingStatuses.length];
  const day = 3 + index % 24;
  const nights = 1 + index % 4;
  const checkIn = `2026-08-${pad(day)}`;
  const checkOut = `2026-08-${pad(Math.min(28, day + nights))}`;
  const createdAt = `2026-08-${pad(Math.max(1, day - 2))}`;
  const amount = 2400 + index % 9 * 1850 + nights * 900;
  const tax = Math.round(amount * 0.12);
  const commission = Math.round(amount * (property.id === 'PRP-1003' ? 0.1 : 0.13));
  const paymentStatus: Booking['paymentStatus'] =
  status === 'Refunded' ?
  'Refunded' :
  status === 'Pending' ?
  'Partially Paid' :
  index % 11 === 0 ?
  'Unpaid' :
  'Paid';

  return {
    id: `BKG-${9200 + index}`,
    code: `CHK-${74100 + index}`,
    customerId: customer.id,
    customerName: customer.name,
    customerEmail: customer.email,
    customerPhone: customer.phone,
    propertyId: property.id,
    propertyName: property.name,
    city: property.city,
    roomName: room.name,
    roomType: room.type,
    checkIn,
    checkOut,
    nights,
    guests: 1 + index % 3,
    amount,
    tax,
    commission,
    status,
    paymentMethod: methods[index % methods.length],
    paymentStatus,
    transactionId: `pay_R${8810000 + index * 37}`,
    source: sources[index % sources.length],
    createdAt,
    timeline: timelineFor(status, createdAt, checkIn)
  };
});

export function bookingsForCustomer(customerId: string): Booking[] {
  return bookings.filter((booking) => booking.customerId === customerId);
}

export function bookingsForProperty(propertyId: string): Booking[] {
  return bookings.filter((booking) => booking.propertyId === propertyId);
}