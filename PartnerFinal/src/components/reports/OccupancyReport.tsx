import React from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis } from
'recharts';
import { ReportStat } from './ReportStat';
import { occupancySeries, occupancyTotals, peakHours } from '../../data/reports';

export function OccupancyReport() {
  const busiest = peakHours.reduce((top, item) => item.value > top.value ? item : top, peakHours[0]);

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <ReportStat
          label="Occupancy now"
          value={`${occupancyTotals.current}%`}
          note="Rooms in use"
          emphasis />
        
        <ReportStat label="Daily average" value={`${occupancyTotals.daily}%`} note="Today" />
        <ReportStat label="Weekly average" value={`${occupancyTotals.weekly}%`} note="Last 7 days" />
        <ReportStat label="Monthly average" value={`${occupancyTotals.monthly}%`} note="August" />
      </div>

      <section className="rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-card">
        <h2 className="text-[15px] font-semibold text-ink">Daily occupancy</h2>
        <p className="mt-0.5 text-[12.5px] text-ink-muted">
          Share of allocated rooms occupied across the day.
        </p>
        <div className="mt-5 h-[240px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={occupancySeries} margin={{ top: 8, right: 8, bottom: 0, left: -12 }}>
              <CartesianGrid stroke="#EFEFEF" vertical={false} />
              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={false}
                tick={{ fill: '#8A8A8A', fontSize: 12 }}
                dy={8} />
              
              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{ fill: '#8A8A8A', fontSize: 12 }}
                domain={[0, 100]}
                tickFormatter={(value: number) => `${value}%`}
                width={46} />
              
              <Tooltip
                formatter={(value: number) => [`${value}%`, 'Occupancy']}
                contentStyle={{ borderRadius: 10, border: '1px solid #E5E5E5', fontSize: 12 }} />
              
              <Line
                type="monotone"
                dataKey="value"
                stroke="#1F6B33"
                strokeWidth={2.5}
                dot={{ r: 3.5, fill: '#1F6B33', strokeWidth: 0 }}
                activeDot={{ r: 5, fill: '#0D0D0D', strokeWidth: 0 }} />
              
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-card">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-[15px] font-semibold text-ink">Peak booking hours</h2>
            <p className="mt-0.5 text-[12.5px] text-ink-muted">
              When guests start their slots, indexed to the busiest hour.
            </p>
          </div>
          <span className="rounded-md bg-lime-100 px-2.5 py-1 text-[11.5px] font-semibold text-lime-600">
            Busiest at {busiest.label}
          </span>
        </div>
        <div className="mt-5 h-[240px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={peakHours} margin={{ top: 8, right: 8, bottom: 0, left: -12 }}>
              <CartesianGrid stroke="#EFEFEF" vertical={false} />
              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={false}
                tick={{ fill: '#8A8A8A', fontSize: 12 }}
                dy={8} />
              
              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{ fill: '#8A8A8A', fontSize: 12 }}
                width={46} />
              
              <Tooltip
                formatter={(value: number) => [`${value} index`, 'Demand']}
                contentStyle={{ borderRadius: 10, border: '1px solid #E5E5E5', fontSize: 12 }} />
              
              <Bar dataKey="value" fill="#D4E82A" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>);

}