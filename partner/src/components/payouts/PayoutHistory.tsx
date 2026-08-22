import React, { useState } from 'react';
import { CheckCircle2Icon, ClockIcon, LoaderIcon } from 'lucide-react';
import { payouts, type PayoutStage } from '../../data/payouts';

const stages: {id: PayoutStage;icon: typeof ClockIcon;chip: string;}[] = [
{ id: 'Pending', icon: ClockIcon, chip: 'bg-amber-50 text-amber-700' },
{ id: 'On process', icon: LoaderIcon, chip: 'bg-blue-50 text-blue-700' },
{ id: 'Completed', icon: CheckCircle2Icon, chip: 'bg-lime-100 text-lime-600' }];


const inr = (value: number) => `₹${value.toLocaleString('en-IN')}`;

export function PayoutHistory() {
  const [active, setActive] = useState<PayoutStage>('Pending');
  const rows = payouts.filter((payout) => payout.stage === active);
  const activeStage = stages.find((stage) => stage.id === active)!;

  return (
    <section className="rounded-2xl border border-neutral-200/80 bg-white shadow-card">
      <div className="flex flex-wrap items-center justify-between gap-4 px-5 pb-4 pt-5">
        <div>
          <h2 className="text-[16px] font-semibold text-ink">Payouts</h2>
          <p className="mt-0.5 text-[12px] text-ink-muted">
            Weekly settlement cycles for Hotel Empire Stay
          </p>
        </div>

        <div
          role="tablist"
          aria-label="Payout stage"
          className="flex rounded-xl bg-neutral-100 p-1">
          
          {stages.map((stage) => {
            const count = payouts.filter((payout) => payout.stage === stage.id).length;
            const isActive = stage.id === active;
            return (
              <button
                key={stage.id}
                role="tab"
                type="button"
                aria-selected={isActive}
                onClick={() => setActive(stage.id)}
                className={[
                'rounded-lg px-4 py-2 text-[13px] transition-colors duration-150 ease-out',
                isActive ?
                'bg-white font-semibold text-ink shadow-card' :
                'font-medium text-ink-muted hover:text-ink'].
                join(' ')}>
                
                {stage.id}
                <span className="ml-1.5 text-[12px] text-ink-muted">{count}</span>
              </button>);

          })}
        </div>
      </div>

      {rows.length === 0 ?
      <p className="border-t border-neutral-200/80 px-5 py-12 text-center text-[13.5px] text-ink-muted">
          No {active.toLowerCase()} payouts right now.
        </p> :

      <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse text-left">
            <thead>
              <tr className="border-y border-neutral-200/80 bg-neutral-50/60">
                {['Reference', 'Period', 'Bookings', 'Requested on', 'Amount', 'Status'].map(
                (head) =>
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
              {rows.map((payout) => {
              const Icon = activeStage.icon;
              return (
                <tr
                  key={payout.id}
                  className="border-b border-neutral-100 transition-colors duration-150 ease-out last:border-0 hover:bg-neutral-50/70">
                  
                    <td className="px-5 py-4 text-[13.5px] font-semibold text-ink">
                      {payout.reference}
                    </td>
                    <td className="px-5 py-4 text-[13.5px] text-ink-soft">{payout.period}</td>
                    <td className="px-5 py-4 text-[13.5px] text-ink-soft">{payout.bookings}</td>
                    <td className="px-5 py-4 text-[13.5px] text-ink-soft">{payout.requestedOn}</td>
                    <td className="px-5 py-4 text-[14px] font-semibold text-ink">
                      {inr(payout.amount)}
                    </td>
                    <td className="px-5 py-4">
                      <span
                      className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[11px] font-semibold ${activeStage.chip}`}>
                      
                        <Icon size={13} aria-hidden="true" />
                        {payout.stage}
                      </span>
                      <p className="mt-1 text-[11.5px] text-ink-muted">{payout.note}</p>
                    </td>
                  </tr>);

            })}
            </tbody>
          </table>
        </div>
      }
    </section>);

}