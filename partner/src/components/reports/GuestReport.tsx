import React from 'react';
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { ReportStat } from './ReportStat';
import { guestSeries, guestTotals } from '../../data/reports';

export function GuestReport() {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <ReportStat label="Total guests" value={String(guestTotals.total)} note="All time" emphasis />
        <ReportStat label="New guests" value={String(guestTotals.newGuests)} note="First stay" />
        <ReportStat label="Repeat guests" value={String(guestTotals.repeatGuests)} note="Booked again" />
        <ReportStat
          label="Repeat rate"
          value={`${guestTotals.repeatRate}%`}
          delta={8}
          note="vs last month" />
        
      </div>

      <section className="rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-card">
        <h2 className="text-[15px] font-semibold text-ink">Guest trends</h2>
        <p className="mt-0.5 text-[12.5px] text-ink-muted">
          New versus returning guests over the last six months.
        </p>

        <div className="mt-5 h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={guestSeries} margin={{ top: 8, right: 8, bottom: 0, left: -12 }}>
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
              
              <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid #E5E5E5', fontSize: 12 }} />
              <Legend
                verticalAlign="top"
                align="right"
                iconType="circle"
                iconSize={8}
                wrapperStyle={{ fontSize: 12, paddingBottom: 12 }} />
              
              <Bar dataKey="newGuests" name="New guests" stackId="g" fill="#D4E82A" radius={[0, 0, 0, 0]} />
              <Bar
                dataKey="repeatGuests"
                name="Repeat guests"
                stackId="g"
                fill="#1F6B33"
                radius={[4, 4, 0, 0]} />
              
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>);

}