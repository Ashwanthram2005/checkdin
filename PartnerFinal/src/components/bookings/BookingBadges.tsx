import React from 'react';
import type { BookingStatus, PaymentStatus } from '../../data/bookings';

const statusStyles: Record<BookingStatus, string> = {
  'Pending Approval': 'bg-amber-50 text-amber-700 ring-amber-200',
  Confirmed: 'bg-lime-100 text-lime-600 ring-lime-200',
  'Checked In': 'bg-blue-50 text-blue-700 ring-blue-200',
  'Checked Out': 'bg-neutral-100 text-ink-soft ring-neutral-200',
  Cancelled: 'bg-red-50 text-red-600 ring-red-200',
  Rejected: 'bg-red-50 text-red-600 ring-red-200',
  'No Show': 'bg-orange-50 text-orange-700 ring-orange-200',
  Expired: 'bg-neutral-100 text-ink-muted ring-neutral-200'
};

const paymentStyles: Record<PaymentStatus, string> = {
  Paid: 'bg-lime-100 text-lime-600',
  Pending: 'bg-amber-50 text-amber-700',
  'Pay at hotel': 'bg-blue-50 text-blue-700',
  Refunded: 'bg-neutral-100 text-ink-soft',
  Failed: 'bg-red-50 text-red-600'
};

export function BookingStatusBadge({ status }: {status: BookingStatus;}) {
  return (
    <span
      className={`inline-flex items-center whitespace-nowrap rounded-md px-2.5 py-1 text-[11px] font-semibold ring-1 ${statusStyles[status]}`}>
      
      {status}
    </span>);

}

export function PaymentStatusBadge({ status }: {status: PaymentStatus;}) {
  return (
    <span
      className={`inline-flex items-center whitespace-nowrap rounded-md px-2.5 py-1 text-[11px] font-semibold ${paymentStyles[status]}`}>
      
      {status}
    </span>);

}