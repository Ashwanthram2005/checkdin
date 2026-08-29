import React from 'react';
import { PageHeader } from '../components/PageHeader';
import { ExtensionRequestsPanel } from '../components/extensions/ExtensionRequestsPanel';
import { ExtensionBadge } from '../components/bookings/ExtensionBadge';
import { ReportStat } from '../components/reports/ReportStat';
import { SettingsCard } from '../components/settings/SettingsCard';
import { bookings } from '../data/bookings';
import { extensionDurations, extensionFunnel, extensionRevenueTotals } from '../data/extensions';
import { slotPricing } from '../data/pricing';
import { gstAmount, inr, priceWithGst } from '../utils/gst';

/** Extension price is charged pro-rata against the 3 hour slot rate, then GST is applied. */
const hourlyBase = Math.round(slotPricing.basePrices['3h'] / 3);

export function Extensions() {
  const history = bookings.filter((booking) => booking.extension);

  return (
    <main className="scroll-slim h-full flex-1 overflow-y-auto bg-canvas px-7 py-6">
      <PageHeader
        title="Extensions"
        subtitle="Every request to stay longer, the 5-minute window, and what each one earned." />
      

      <div className="mt-6 space-y-5 pb-8">
        <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <ReportStat
            label="Waiting now"
            value={String(
              history.filter((b) => b.extension?.state === 'Pending Approval').length
            )}
            note="Inside the 5 minute window"
            emphasis />
          
          <ReportStat
            label="Approved this month"
            value={String(extensionFunnel.approved)}
            note={`${extensionFunnel.approvalRate}% approval rate`} />
          
          <ReportStat
            label="Extension revenue"
            value={inr(extensionRevenueTotals.revenue)}
            note={`${extensionRevenueTotals.contribution}% of total revenue`} />
          
          <ReportStat
            label="Average value"
            value={inr(extensionRevenueTotals.average)}
            note="Per approved extension" />
          
        </section>

        <ExtensionRequestsPanel showToast={false} />

        <SettingsCard
          title="What each extension length costs a guest"
          description="Priced from your 3 hour slot rate, with the GST slab applied automatically."
          bodyClassName="p-5">
          
          <ul className="grid grid-cols-2 gap-3 md:grid-cols-5">
            {extensionDurations.map((hours) => {
              const base = hourlyBase * hours;
              return (
                <li key={hours} className="rounded-xl border border-neutral-200 p-4">
                  <p className="text-[13px] font-semibold text-ink">+{hours} {hours === 1 ? 'Hour' : 'Hours'}</p>
                  <p className="mt-2 text-[19px] font-bold leading-none tracking-tight text-ink">
                    {inr(priceWithGst(base))}
                  </p>
                  <p className="mt-2 text-[11.5px] text-ink-muted">
                    Base {inr(base)} + GST {inr(gstAmount(base))}
                  </p>
                </li>);

            })}
          </ul>
        </SettingsCard>

        <SettingsCard
          title="Recent extension activity"
          description="Approved, rejected and expired requests across your bookings."
          bodyClassName="">
          
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] border-collapse text-left">
              <thead>
                <tr className="border-b border-neutral-200/80 bg-neutral-50/70">
                  {['Booking', 'Guest', 'Requested', 'Extension', 'New checkout', 'Revenue', 'Status'].map(
                    (head) =>
                    <th
                      key={head}
                      scope="col"
                      className="whitespace-nowrap px-5 py-2.5 text-[12px] font-medium text-ink-muted">
                      
                        {head}
                      </th>

                  )}
                </tr>
              </thead>
              <tbody>
                {history.map((booking) => {
                  const extension = booking.extension!;
                  return (
                    <tr key={booking.id} className="border-b border-neutral-100 last:border-0">
                      <td className="whitespace-nowrap px-5 py-3.5 text-[13px] font-semibold text-ink">
                        #{booking.id}
                      </td>
                      <td className="whitespace-nowrap px-5 py-3.5 text-[13px] text-ink-soft">
                        {booking.guest}
                      </td>
                      <td className="whitespace-nowrap px-5 py-3.5 text-[13px] text-ink-muted">
                        {extension.requestedAt}
                      </td>
                      <td className="whitespace-nowrap px-5 py-3.5 text-[13px] text-ink-soft">
                        +{extension.extraHours} {extension.extraHours === 1 ? 'hour' : 'hours'}
                      </td>
                      <td className="whitespace-nowrap px-5 py-3.5 text-[13px] text-ink-soft">
                        {extension.state === 'Approved' ? extension.requestedCheckout : '—'}
                      </td>
                      <td className="whitespace-nowrap px-5 py-3.5 text-[13.5px] font-semibold text-ink">
                        {extension.state === 'Approved' ? inr(extension.additionalRevenue) : '—'}
                      </td>
                      <td className="px-5 py-3.5">
                        <ExtensionBadge
                          state={extension.state}
                          extraHours={extension.extraHours} />
                        
                      </td>
                    </tr>);

                })}
              </tbody>
            </table>
          </div>
        </SettingsCard>
      </div>
    </main>);

}