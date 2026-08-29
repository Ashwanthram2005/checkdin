import React from 'react';
import { ArrowRightIcon } from 'lucide-react';
import { todaysBookings } from '../data/dashboard';
import { slotLabel } from '../data/bookings';
import { StatusBadge } from './StatusBadge';

export function TodaysBookings() {
  return (
    <section className="rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-card">
      <div className="flex items-center justify-between">
        <h2 className="text-[16px] font-semibold text-ink">Today's Bookings</h2>
        <button
          type="button"
          className="text-[13px] font-medium text-lime-600 transition-colors duration-150 ease-out hover:text-lime-500">
          
          View all
        </button>
      </div>

      <ul className="mt-3 divide-y divide-neutral-100">
        {todaysBookings.map((booking) =>
        <li key={booking.id} className="flex items-center gap-3 py-3">
            <img
            src={booking.image}
            alt=""
            className="h-11 w-11 shrink-0 rounded-lg object-cover" />
          
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13.5px] font-semibold text-ink">{booking.guest}</p>
              <p className="mt-0.5 truncate text-[12px] text-ink-muted">
                {booking.checkIn} • {booking.duration}
              </p>
              <p className="mt-0.5 truncate text-[12px] text-ink-muted">
                {slotLabel(booking.room)}
              </p>
            </div>
            <StatusBadge status={booking.status} />
          </li>
        )}
      </ul>

      <button
        type="button"
        className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg py-2 text-[13px] font-medium text-lime-600 transition-colors duration-150 ease-out hover:bg-lime-50">
        
        View all bookings
        <ArrowRightIcon size={15} aria-hidden="true" />
      </button>
    </section>);

}