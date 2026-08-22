import React from 'react';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { ReportStat } from './ReportStat';
import { durationAnalysis } from '../../data/reports';
import { inr } from '../../utils/gst';

export function DurationReport() {
  const totalBookings = durationAnalysis.reduce((sum, item) => sum + item.bookings, 0);
  const totalRevenue = durationAnalysis.reduce((sum, item) => sum + item.revenue, 0);
  const popular = durationAnalysis.reduce(
    (top, item) => item.bookings > top.bookings ? item : top,
    durationAnalysis[0]
  );

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {durationAnalysis.map((item) =>
        <ReportStat
          key={item.key}
          label={`${item.label} bookings`}
          value={String(item.bookings)}
          note={`${inr(item.revenue)} revenue`}
          emphasis={item.key === popular.key} />

        )}
        <ReportStat
          label="Most popular duration"
          value={popular.label}
          note={`${Math.round(popular.bookings / totalBookings * 100)}% of all bookings`} />
        
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <section className="rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-card">
          <h2 className="text-[15px] font-semibold text-ink">Revenue by duration</h2>
          <p className="mt-0.5 text-[12.5px] text-ink-muted">
            Share of {inr(totalRevenue)} in the current month.
          </p>

          <div className="mt-4 flex items-center gap-6">
            <div className="relative h-[190px] w-[190px] shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={durationAnalysis}
                    dataKey="revenue"
                    innerRadius={60}
                    outerRadius={92}
                    paddingAngle={1.5}
                    startAngle={90}
                    endAngle={-270}
                    stroke="none">
                    
                    {durationAnalysis.map((item) =>
                    <Cell key={item.key} fill={item.color} />
                    )}
                  </Pie>
                  <Tooltip
                    formatter={(value: number, name: string) => [inr(value), name]}
                    contentStyle={{ borderRadius: 10, border: '1px solid #E5E5E5', fontSize: 12 }} />
                  
                </PieChart>
              </ResponsiveContainer>
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-[12px] text-ink-muted">Bookings</span>
                <span className="text-[26px] font-bold leading-none tracking-tight text-ink">
                  {totalBookings}
                </span>
              </div>
            </div>

            <ul className="space-y-3">
              {durationAnalysis.map((item) =>
              <li key={item.key} className="flex items-start gap-2.5">
                  <span
                  className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full"
                  style={{ backgroundColor: item.color }}
                  aria-hidden="true" />
                
                  <span>
                    <span className="block text-[13px] font-medium text-ink">{item.label}</span>
                    <span className="block text-[12px] text-ink-muted">
                      {inr(item.revenue)} • {Math.round(item.revenue / totalRevenue * 100)}%
                    </span>
                  </span>
                </li>
              )}
            </ul>
          </div>
        </section>

        <section className="rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-card">
          <h2 className="text-[15px] font-semibold text-ink">Duration performance</h2>
          <p className="mt-0.5 text-[12.5px] text-ink-muted">
            Average value per booking tells you which slot to promote.
          </p>

          <ul className="mt-4 space-y-4">
            {durationAnalysis.map((item) => {
              const share = Math.round(item.bookings / totalBookings * 100);
              return (
                <li key={item.key}>
                  <div className="flex items-center justify-between text-[13px]">
                    <span className="font-medium text-ink">{item.label}</span>
                    <span className="text-ink-muted">
                      {inr(Math.round(item.revenue / item.bookings))} avg
                    </span>
                  </div>
                  <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-neutral-100">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${share}%`, backgroundColor: item.color }} />
                    
                  </div>
                  <p className="mt-1.5 text-[11.5px] text-ink-muted">
                    {item.bookings} bookings • {share}% of volume
                  </p>
                </li>);

            })}
          </ul>
        </section>
      </div>
    </div>);

}