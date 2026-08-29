import React from 'react';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { durationRevenue } from '../../data/revenue';
import { inr } from '../../utils/gst';

export function RevenueBreakdown() {
  const total = durationRevenue.reduce((sum, item) => sum + item.revenue, 0);

  return (
    <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {durationRevenue.map((item) => {
          const share = Math.round(item.revenue / total * 100);
          return (
            <article
              key={item.key}
              className="rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-card">
              
              <span className="flex items-center gap-2">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: item.color }}
                  aria-hidden="true" />
                
                <span className="text-[12.5px] font-medium text-ink-muted">{item.label}</span>
              </span>
              <p className="mt-2.5 text-[24px] font-bold leading-none tracking-tight text-ink">
                {inr(item.revenue)}
              </p>
              <p className="mt-2 text-[12px] text-ink-muted">
                {item.bookings} bookings • {inr(Math.round(item.revenue / item.bookings))} average
              </p>
              <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-neutral-100">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${share}%`, backgroundColor: item.color }} />
                
              </div>
              <p className="mt-1.5 text-[11.5px] font-semibold text-ink">{share}% of revenue</p>
            </article>);

        })}
      </section>

      <section className="rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-card">
        <h2 className="text-[15px] font-semibold text-ink">Revenue distribution</h2>
        <p className="mt-0.5 text-[12.5px] text-ink-muted">By slot length, this month.</p>

        <div className="relative mx-auto mt-4 h-[200px] w-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={durationRevenue}
                dataKey="revenue"
                nameKey="label"
                innerRadius={62}
                outerRadius={96}
                paddingAngle={1.5}
                startAngle={90}
                endAngle={-270}
                stroke="none">
                
                {durationRevenue.map((item) =>
                <Cell key={item.key} fill={item.color} />
                )}
              </Pie>
              <Tooltip
                formatter={(value: number, name: string) => [inr(value), name]}
                contentStyle={{ borderRadius: 10, border: '1px solid #E5E5E5', fontSize: 12 }} />
              
            </PieChart>
          </ResponsiveContainer>
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-[12px] text-ink-muted">Total</span>
            <span className="text-[20px] font-bold leading-none tracking-tight text-ink">
              {inr(total)}
            </span>
          </div>
        </div>
      </section>
    </div>);

}