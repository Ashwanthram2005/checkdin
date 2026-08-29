import React from 'react';
import { ReportStat } from './ReportStat';
import { payoutBalance, payouts } from '../../data/payouts';
import { inr } from '../../utils/gst';

const stageChip: Record<string, string> = {
  Pending: 'bg-amber-50 text-amber-700',
  'On process': 'bg-blue-50 text-blue-700',
  Completed: 'bg-lime-100 text-lime-600'
};

export function PayoutReport() {
  const pending = payouts.
  filter((payout) => payout.stage !== 'Completed').
  reduce((sum, payout) => sum + payout.amount, 0);
  const completed = payouts.
  filter((payout) => payout.stage === 'Completed').
  reduce((sum, payout) => sum + payout.amount, 0);

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <ReportStat label="Pending payouts" value={inr(pending)} note="Awaiting settlement" emphasis />
        <ReportStat label="Completed payouts" value={inr(completed)} note="Last 60 days" />
        <ReportStat label="Available balance" value={inr(payoutBalance.available)} note="Ready to withdraw" />
        <ReportStat label="Total earnings" value="₹28,75,430" note="All time" />
      </div>

      <section className="rounded-2xl border border-neutral-200/80 bg-white shadow-card">
        <div className="border-b border-neutral-100 px-5 py-4">
          <h2 className="text-[15px] font-semibold text-ink">Payout history</h2>
          <p className="mt-0.5 text-[12.5px] text-ink-muted">
            Weekly settlement cycles, newest first.
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse text-left">
            <thead>
              <tr className="border-b border-neutral-200/80 bg-neutral-50/70">
                {['Reference', 'Period', 'Bookings', 'Requested on', 'Amount', 'Status'].map((head) =>
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
              {payouts.map((payout) =>
              <tr key={payout.id} className="border-b border-neutral-100 last:border-0">
                  <td className="px-5 py-3.5 text-[13.5px] font-semibold text-ink">
                    {payout.reference}
                  </td>
                  <td className="px-5 py-3.5 text-[13px] text-ink-soft">{payout.period}</td>
                  <td className="px-5 py-3.5 text-[13px] text-ink-soft">{payout.bookings}</td>
                  <td className="px-5 py-3.5 text-[13px] text-ink-soft">{payout.requestedOn}</td>
                  <td className="px-5 py-3.5 text-[13.5px] font-semibold text-ink">
                    {inr(payout.amount)}
                  </td>
                  <td className="px-5 py-3.5">
                    <span
                    className={`inline-flex rounded-md px-2.5 py-1 text-[11px] font-semibold ${stageChip[payout.stage]}`}>
                    
                      {payout.stage}
                    </span>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>);

}