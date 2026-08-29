import React from 'react';
import { todaysBookings } from '../data/dashboard';
import { slotLabel } from '../data/bookings';
import { GuestAvatar, StatusBadge } from './StatusBadge';

export function RecentBookingsTable() {
  return (
    <section className="rounded-2xl border border-neutral-200/80 bg-white shadow-card">
      <div className="flex items-center justify-between px-5 py-4">
        <h2 className="text-[16px] font-semibold text-ink">Recent Bookings</h2>
        <button
          type="button"
          className="text-[13px] font-medium text-lime-600 transition-colors duration-150 ease-out hover:text-lime-500">
          
          View all
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] border-collapse text-left">
          <thead>
            <tr className="border-y border-neutral-200/80 bg-neutral-50/60">
              {['Guest Name', 'Room', 'Duration', 'Check-in', 'Amount', 'Status'].map((head) =>
              <th
                key={head}
                scope="col"
                className="px-5 py-2.5 text-[12px] font-medium text-ink-muted">
                
                  {head}
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {todaysBookings.map((booking) =>
            <tr
              key={booking.id}
              className="border-b border-neutral-100 last:border-0 transition-colors duration-150 ease-out hover:bg-neutral-50/70">
              
                <td className="px-5 py-3.5">
                  <span className="flex items-center gap-3">
                    <GuestAvatar name={booking.guest} />
                    <span className="text-[13.5px] font-medium text-ink">{booking.guest}</span>
                  </span>
                </td>
                <td className="px-5 py-3.5 text-[13.5px] text-ink-soft">
                  {slotLabel(booking.room)}
                </td>
                <td className="px-5 py-3.5 text-[13.5px] text-ink-soft">{booking.duration}</td>
                <td className="px-5 py-3.5 text-[13.5px] text-ink-soft">{booking.checkIn}</td>
                <td className="px-5 py-3.5 text-[13.5px] font-semibold text-ink">
                  ₹{booking.amount.toLocaleString('en-IN')}
                </td>
                <td className="px-5 py-3.5">
                  <StatusBadge status={booking.status} />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>);

}