import React from 'react';
import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts';
import { durationBreakdown } from '../data/dashboard';

const total = durationBreakdown.reduce((sum, item) => sum + item.value, 0);

export function DurationBreakdown() {
  return (
    <section className="flex flex-col rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-card">
      <div>
        <h2 className="text-[16px] font-semibold text-ink">Bookings by Duration</h2>
        <p className="mt-0.5 text-[12px] text-ink-muted">This Month</p>
      </div>

      <div className="mt-4 flex flex-1 items-center gap-4">
        <div className="relative h-[180px] w-[180px] shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={durationBreakdown}
                dataKey="value"
                innerRadius={58}
                outerRadius={88}
                paddingAngle={1.5}
                startAngle={90}
                endAngle={-270}
                stroke="none">
                
                {durationBreakdown.map((item) =>
                <Cell key={item.label} fill={item.color} />
                )}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-[12px] text-ink-muted">Total</span>
            <span className="text-[28px] font-bold leading-none tracking-tight text-ink">
              {total}
            </span>
          </div>
        </div>

        <ul className="space-y-3.5">
          {durationBreakdown.map((item) =>
          <li key={item.label} className="flex items-start gap-2.5">
              <span
              className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full"
              style={{ backgroundColor: item.color }}
              aria-hidden="true" />
            
              <span>
                <span className="block text-[13px] font-medium text-ink">{item.label}</span>
                <span className="block text-[12px] text-ink-muted">
                  {item.share}% ({item.value})
                </span>
              </span>
            </li>
          )}
        </ul>
      </div>
    </section>);

}