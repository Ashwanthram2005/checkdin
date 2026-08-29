import React from 'react';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { PageHeader } from '../components/PageHeader';
import { ReportStat } from '../components/reports/ReportStat';
import { SettingsCard } from '../components/settings/SettingsCard';
import { customerSegments } from '../data/analytics';
import { inr } from '../utils/gst';

export function CustomerInsights() {
  const totalRevenue = customerSegments.reduce((sum, segment) => sum + segment.revenue, 0);
  const topSegment = customerSegments.reduce((top, segment) =>
  segment.revenue > top.revenue ? segment : top
  );
  const mostLoyal = customerSegments.reduce((top, segment) =>
  segment.repeatRate > top.repeatRate ? segment : top
  );

  return (
    <main className="scroll-slim h-full flex-1 overflow-y-auto bg-canvas px-7 py-6">
      <PageHeader
        title="Customer Insights"
        subtitle="Who books you, what they spend, and how often they come back." />
      

      <div className="mt-6 space-y-5 pb-8">
        <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <ReportStat
            label="Biggest segment"
            value={topSegment.label}
            note={`${inr(topSegment.revenue)} this quarter`}
            emphasis />
          
          <ReportStat
            label="Most loyal"
            value={mostLoyal.label}
            note={`${mostLoyal.repeatRate}% book again`} />
          
          <ReportStat
            label="Average spend"
            value={inr(
              Math.round(
                customerSegments.reduce((sum, s) => sum + s.averageSpend * s.share, 0) / 100
              )
            )}
            note="Across all guests" />
          
          <ReportStat
            label="Segment revenue"
            value={inr(totalRevenue)}
            note="Last 90 days" />
          
        </section>

        <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
          <SettingsCard
            title="Segment mix"
            description="Share of bookings by guest type."
            bodyClassName="p-5">
            
            <div className="relative mx-auto h-[220px] w-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={customerSegments}
                    dataKey="share"
                    nameKey="label"
                    innerRadius={68}
                    outerRadius={104}
                    paddingAngle={1.5}
                    stroke="none">
                    
                    {customerSegments.map((segment) =>
                    <Cell key={segment.id} fill={segment.color} />
                    )}
                  </Pie>
                  <Tooltip
                    formatter={(value: number, name: string) => [`${value}%`, name]}
                    contentStyle={{ borderRadius: 10, border: '1px solid #E5E5E5', fontSize: 12 }} />
                  
                </PieChart>
              </ResponsiveContainer>
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-[12px] text-ink-muted">Segments</span>
                <span className="text-[26px] font-bold leading-none tracking-tight text-ink">
                  {customerSegments.length}
                </span>
              </div>
            </div>

            <ul className="mt-4 space-y-2">
              {customerSegments.map((segment) =>
              <li key={segment.id} className="flex items-center justify-between text-[12.5px]">
                  <span className="flex items-center gap-2 text-ink-soft">
                    <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: segment.color }}
                    aria-hidden="true" />
                  
                    {segment.label}
                  </span>
                  <span className="font-semibold text-ink">{segment.share}%</span>
                </li>
              )}
            </ul>
          </SettingsCard>

          <SettingsCard
            title="Segment performance"
            description="Spend, loyalty and slot preference by guest type."
            bodyClassName="">
            
            <div className="overflow-x-auto">
              <table className="w-full min-w-[620px] border-collapse text-left">
                <thead>
                  <tr className="border-b border-neutral-200/80 bg-neutral-50/70">
                    {['Segment', 'Avg spend', 'Repeat', 'Frequency', 'Preferred slot', 'Revenue'].map(
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
                  {customerSegments.map((segment) =>
                  <tr key={segment.id} className="border-b border-neutral-100 last:border-0">
                      <td className="whitespace-nowrap px-5 py-3.5 text-[13.5px] font-medium text-ink">
                        {segment.label}
                      </td>
                      <td className="whitespace-nowrap px-5 py-3.5 text-[13px] text-ink-soft">
                        {inr(segment.averageSpend)}
                      </td>
                      <td className="whitespace-nowrap px-5 py-3.5 text-[13px] text-ink-soft">
                        {segment.repeatRate}%
                      </td>
                      <td className="whitespace-nowrap px-5 py-3.5 text-[13px] text-ink-soft">
                        {segment.frequency}
                      </td>
                      <td className="whitespace-nowrap px-5 py-3.5 text-[13px] text-ink-soft">
                        {segment.preferredDuration}
                      </td>
                      <td className="whitespace-nowrap px-5 py-3.5 text-[13.5px] font-semibold text-ink">
                        {inr(segment.revenue)}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </SettingsCard>
        </div>

        <SettingsCard
          title="Revenue contribution"
          description="Which guests actually pay the bills."
          bodyClassName="p-5">
          
          <ul className="space-y-4">
            {customerSegments.map((segment) => {
              const share = Math.round(segment.revenue / totalRevenue * 100);
              return (
                <li key={segment.id}>
                  <div className="flex items-center justify-between text-[13px]">
                    <span className="font-medium text-ink">{segment.label}</span>
                    <span className="text-ink-muted">
                      {inr(segment.revenue)} • {share}%
                    </span>
                  </div>
                  <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-neutral-100">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${share}%`, backgroundColor: segment.color }} />
                    
                  </div>
                </li>);

            })}
          </ul>
        </SettingsCard>
      </div>
    </main>);

}