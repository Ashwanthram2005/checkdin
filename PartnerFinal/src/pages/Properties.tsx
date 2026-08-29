import React from 'react';
import { ArrowDownRightIcon, ArrowUpRightIcon, BuildingIcon } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { ReportStat } from '../components/reports/ReportStat';
import { SettingsCard } from '../components/settings/SettingsCard';
import { portfolio, type HotelStatus } from '../data/operations';
import { inr } from '../utils/gst';

const statusChip: Record<HotelStatus, string> = {
  Live: 'bg-lime-100 text-lime-700',
  'Bookings Paused': 'bg-amber-50 text-amber-700',
  Offline: 'bg-red-50 text-red-600'
};

export function Properties() {
  const totalRevenue = portfolio.reduce((sum, item) => sum + item.revenue, 0);
  const avgOccupancy = Math.round(
    portfolio.reduce((sum, item) => sum + item.occupancy, 0) / portfolio.length
  );
  const top = portfolio.reduce((best, item) => item.revenue > best.revenue ? item : best);
  const lowest = portfolio.reduce((worst, item) => item.score < worst.score ? item : worst);

  return (
    <main className="scroll-slim h-full flex-1 overflow-y-auto bg-canvas px-7 py-6">
      <PageHeader
        title="Properties"
        subtitle="Your whole portfolio side by side — revenue, occupancy and extension performance." />
      

      <div className="mt-6 space-y-5 pb-8">
        <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <ReportStat
            label="Total revenue"
            value={inr(totalRevenue)}
            note={`${portfolio.length} properties`}
            emphasis />
          
          <ReportStat label="Average occupancy" value={`${avgOccupancy}%`} note="Across portfolio" />
          <ReportStat label="Top property" value={top.name} note={inr(top.revenue)} />
          <ReportStat
            label="Needs attention"
            value={lowest.name}
            note={`Score ${lowest.score} • ${lowest.occupancy}% occupancy`} />
          
        </section>

        <SettingsCard
          title="Property comparison"
          description="Same metrics, every property, ranked by revenue."
          bodyClassName="">
          
          <div className="overflow-x-auto">
            <table className="w-full min-w-[880px] border-collapse text-left">
              <thead>
                <tr className="border-b border-neutral-200/80 bg-neutral-50/70">
                  {[
                  'Property',
                  'City',
                  'Status',
                  'Revenue',
                  'Occupancy',
                  'Extensions',
                  'Extension revenue',
                  'Score'].
                  map((head) =>
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
                {[...portfolio].
                sort((a, b) => b.revenue - a.revenue).
                map((item) =>
                <tr key={item.id} className="border-b border-neutral-100 last:border-0">
                      <td className="whitespace-nowrap px-5 py-3.5">
                        <span className="flex items-center gap-2.5">
                          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-100">
                            <BuildingIcon size={15} className="text-ink-soft" aria-hidden="true" />
                          </span>
                          <span className="text-[13.5px] font-medium text-ink">{item.name}</span>
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-5 py-3.5 text-[13px] text-ink-soft">
                        {item.city}
                      </td>
                      <td className="px-5 py-3.5">
                        <span
                      className={`inline-flex whitespace-nowrap rounded-md px-2.5 py-1 text-[11px] font-semibold ${statusChip[item.status]}`}>
                      
                          {item.status}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-5 py-3.5 text-[13.5px] font-semibold text-ink">
                        {inr(item.revenue)}
                      </td>
                      <td className="whitespace-nowrap px-5 py-3.5 text-[13px] text-ink-soft">
                        {item.occupancy}%
                      </td>
                      <td className="whitespace-nowrap px-5 py-3.5 text-[13px] text-ink-soft">
                        {item.extensions}
                      </td>
                      <td className="whitespace-nowrap px-5 py-3.5 text-[13px] text-ink-soft">
                        {inr(item.extensionRevenue)}
                      </td>
                      <td className="whitespace-nowrap px-5 py-3.5">
                        <span
                      className={[
                      'inline-flex items-center gap-1 text-[13.5px] font-semibold',
                      item.score >= 85 ? 'text-forest' : 'text-amber-700'].
                      join(' ')}>
                      
                          {item.score >= 85 ?
                      <ArrowUpRightIcon size={13} aria-hidden="true" /> :

                      <ArrowDownRightIcon size={13} aria-hidden="true" />
                      }
                          {item.score}
                        </span>
                      </td>
                    </tr>
                )}
              </tbody>
            </table>
          </div>
        </SettingsCard>

        <SettingsCard
          title="Revenue share"
          description="How much each property contributes to the portfolio."
          bodyClassName="p-5">
          
          <ul className="space-y-4">
            {portfolio.map((item) => {
              const share = Math.round(item.revenue / totalRevenue * 100);
              return (
                <li key={item.id}>
                  <div className="flex items-center justify-between text-[13px]">
                    <span className="font-medium text-ink">{item.name}</span>
                    <span className="text-ink-muted">
                      {inr(item.revenue)} • {share}%
                    </span>
                  </div>
                  <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-neutral-100">
                    <div
                      className="h-full rounded-full bg-lime-400"
                      style={{ width: `${share}%` }} />
                    
                  </div>
                </li>);

            })}
          </ul>
        </SettingsCard>
      </div>
    </main>);

}