import React from 'react';
import { CheckIcon, XIcon } from 'lucide-react';
import { BookingStatusBadge, PaymentStatusBadge } from './BookingBadges';
import { ApprovalCountdown } from './ApprovalCountdown';
import { BookingActionsMenu, type BookingAction } from './BookingActionsMenu';
import { GuestAvatar } from '../StatusBadge';
import { inr } from '../../utils/gst';
import type { Booking } from '../../data/bookings';

type BookingsTableProps = {
  bookings: Booking[];
  selected: string[];
  onToggleSelect: (id: string) => void;
  onToggleAll: () => void;
  onAction: (action: BookingAction, booking: Booking) => void;
  onExpire: (id: string) => void;
};

const columns = [
'Booking ID',
'Guest',
'Phone',
'Booked on',
'Check-in',
'Duration',
'Amount',
'Payment',
'Status',
'Time remaining',
''];


export function BookingsTable({
  bookings,
  selected,
  onToggleSelect,
  onToggleAll,
  onAction,
  onExpire
}: BookingsTableProps) {
  const allSelected = bookings.length > 0 && selected.length === bookings.length;

  if (bookings.length === 0) {
    return (
      <p className="rounded-2xl border border-neutral-200/80 bg-white px-5 py-16 text-center text-[13.5px] text-ink-muted shadow-card">
        No bookings match these filters. Try widening the date range or clearing a search field.
      </p>);

  }

  return (
    <div className="overflow-hidden rounded-2xl border border-neutral-200/80 bg-white shadow-card">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1180px] border-collapse text-left">
          <thead>
            <tr className="border-b border-neutral-200/80 bg-neutral-50/70">
              <th scope="col" className="w-10 px-4 py-2.5">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={onToggleAll}
                  aria-label="Select all bookings"
                  className="h-4 w-4 cursor-pointer rounded border-neutral-300 accent-lime-500" />
                
              </th>
              {columns.map((column, i) =>
              <th
                key={column || i}
                scope="col"
                className="whitespace-nowrap px-4 py-2.5 text-[12px] font-medium text-ink-muted">
                
                  {column}
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => {
              const isSelected = selected.includes(booking.id);
              const isPending = booking.status === 'Pending Approval';

              return (
                <tr
                  key={booking.id}
                  className={[
                  'border-b border-neutral-100 transition-colors duration-150 ease-out last:border-0',
                  isSelected ? 'bg-lime-50/60' : 'hover:bg-neutral-50/70'].
                  join(' ')}>
                  
                  <td className="px-4 py-3.5">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => onToggleSelect(booking.id)}
                      aria-label={`Select booking ${booking.id}`}
                      className="h-4 w-4 cursor-pointer rounded border-neutral-300 accent-lime-500" />
                    
                  </td>
                  <td className="whitespace-nowrap px-4 py-3.5">
                    <button
                      type="button"
                      onClick={() => onAction('view', booking)}
                      className="text-[13px] font-semibold text-ink underline-offset-2 transition-colors duration-150 ease-out hover:text-lime-600 hover:underline">
                      
                      #{booking.id}
                    </button>
                    <p className="mt-0.5 text-[11.5px] text-ink-muted">{booking.room}</p>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3.5">
                    <span className="flex items-center gap-2.5">
                      <GuestAvatar name={booking.guest} />
                      <span className="text-[13.5px] font-medium text-ink">{booking.guest}</span>
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3.5 text-[13px] text-ink-soft">
                    {booking.phone}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3.5 text-[13px] text-ink-soft">
                    {booking.bookedOn}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3.5 text-[13px] text-ink-soft">
                    {booking.checkInTime}
                    <span className="mt-0.5 block text-[11.5px] text-ink-muted">
                      {booking.checkInDate}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3.5 text-[13px] text-ink-soft">
                    {booking.duration}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3.5 text-[13.5px] font-semibold text-ink">
                    {inr(booking.total)}
                  </td>
                  <td className="px-4 py-3.5">
                    <PaymentStatusBadge status={booking.paymentStatus} />
                  </td>
                  <td className="px-4 py-3.5">
                    <BookingStatusBadge status={booking.status} />
                  </td>
                  <td className="px-4 py-3.5">
                    {isPending && booking.approvalSeconds !== null ?
                    <span className="flex flex-col items-start gap-1.5">
                        <ApprovalCountdown
                        seconds={booking.approvalSeconds}
                        onExpire={() => onExpire(booking.id)}
                        compact />
                      
                        <span className="flex gap-1">
                          <button
                          type="button"
                          onClick={() => onAction('accept', booking)}
                          className="flex items-center gap-1 rounded-md bg-lime-300 px-2 py-1 text-[11px] font-semibold text-ink transition-colors duration-150 ease-out hover:bg-lime-200">
                          
                            <CheckIcon size={11} aria-hidden="true" />
                            Accept
                          </button>
                          <button
                          type="button"
                          onClick={() => onAction('reject', booking)}
                          className="flex items-center gap-1 rounded-md border border-neutral-200 px-2 py-1 text-[11px] font-semibold text-ink-soft transition-colors duration-150 ease-out hover:border-red-300 hover:text-red-600">
                          
                            <XIcon size={11} aria-hidden="true" />
                            Reject
                          </button>
                        </span>
                      </span> :

                    <span className="text-[13px] text-ink-muted">—</span>
                    }
                  </td>
                  <td className="px-4 py-3.5">
                    <BookingActionsMenu booking={booking} onAction={onAction} />
                  </td>
                </tr>);

            })}
          </tbody>
        </table>
      </div>
    </div>);

}