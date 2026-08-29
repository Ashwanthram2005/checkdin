import React from 'react';
import { GuestAvatar } from '../StatusBadge';
import { inr } from '../../utils/gst';
import type { Earning, PaymentState } from '../../data/revenue';

const statusChip: Record<PaymentState, string> = {
  Settled: 'bg-lime-100 text-lime-600',
  Processing: 'bg-blue-50 text-blue-700',
  Pending: 'bg-amber-50 text-amber-700'
};

type EarningsTableProps = {
  earnings: Earning[];
};

export function EarningsTable({ earnings }: EarningsTableProps) {
  const netTotal = earnings.reduce((sum, row) => sum + row.net, 0);

  if (earnings.length === 0) {
    return (
      <p className="rounded-2xl border border-neutral-200/80 bg-white px-5 py-16 text-center text-[13.5px] text-ink-muted shadow-card">
        No earnings match this filter.
      </p>);

  }

  return (
    <section className="overflow-hidden rounded-2xl border border-neutral-200/80 bg-white shadow-card">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-100 px-5 py-4">
        <div>
          <h2 className="text-[15px] font-semibold text-ink">Recent earnings</h2>
          <p className="mt-0.5 text-[12.5px] text-ink-muted">
            {earnings.length} bookings • {inr(netTotal)} net
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[980px] border-collapse text-left">
          <thead>
            <tr className="border-b border-neutral-200/80 bg-neutral-50/70">
              {[
              'Date',
              'Booking ID',
              'Guest',
              'Duration',
              'Gross amount',
              'Platform commission',
              'Net earnings',
              'Payment status'].
              map((head) =>
              <th
                key={head}
                scope="col"
                className="whitespace-nowrap px-4 py-2.5 text-[12px] font-medium text-ink-muted">
                
                  {head}
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {earnings.map((row) =>
            <tr
              key={row.id}
              className="border-b border-neutral-100 transition-colors duration-150 ease-out last:border-0 hover:bg-neutral-50/70">
              
                <td className="whitespace-nowrap px-4 py-3.5 text-[13px] text-ink-soft">{row.date}</td>
                <td className="whitespace-nowrap px-4 py-3.5 text-[13px] font-semibold text-ink">
                  #{row.bookingId}
                </td>
                <td className="whitespace-nowrap px-4 py-3.5">
                  <span className="flex items-center gap-2.5">
                    <GuestAvatar name={row.guest} />
                    <span className="text-[13.5px] font-medium text-ink">{row.guest}</span>
                  </span>
                </td>
                <td className="whitespace-nowrap px-4 py-3.5 text-[13px] text-ink-soft">
                  {row.duration}
                </td>
                <td className="whitespace-nowrap px-4 py-3.5 text-[13px] text-ink-soft">
                  {inr(row.gross)}
                </td>
                <td className="whitespace-nowrap px-4 py-3.5 text-[13px] text-red-600">
                  −{inr(row.commission)}
                </td>
                <td className="whitespace-nowrap px-4 py-3.5 text-[13.5px] font-semibold text-ink">
                  {inr(row.net)}
                </td>
                <td className="px-4 py-3.5">
                  <span
                  className={`inline-flex rounded-md px-2.5 py-1 text-[11px] font-semibold ${statusChip[row.status]}`}>
                  
                    {row.status}
                  </span>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>);

}