import React from 'react';
import type { BookingStatus } from '../data/dashboard';

const styles: Record<BookingStatus, string> = {
  Confirmed: 'bg-lime-100 text-lime-600',
  'Checked-in': 'bg-blue-50 text-blue-700',
  Upcoming: 'bg-amber-50 text-amber-700'
};

export function StatusBadge({ status }: {status: BookingStatus;}) {
  return (
    <span
      className={`inline-flex items-center rounded-md px-2.5 py-1 text-[11px] font-semibold ${styles[status]}`}>
      
      {status}
    </span>);

}

export function GuestAvatar({ name }: {name: string;}) {
  const initials = name.
  split(' ').
  slice(0, 2).
  map((part) => part[0]).
  join('');

  return (
    <span
      aria-hidden="true"
      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-[11px] font-semibold text-ink">
      
      {initials}
    </span>);

}