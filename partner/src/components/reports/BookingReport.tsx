import React from 'react';
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { ReportStat } from './ReportStat';
import { bookingSeries, bookingTotals } from '../../data/reports';

export function BookingReport() {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <ReportStat label="Total bookings" value={String(bookingTotals.total)} note="This month" emphasis />
        <ReportStat label="Confirmed" value={String(bookingTotals.confirmed)} note="Awaiting stay" />
        <ReportStat label="Completed" value={String(bookingTotals.completed)} note="Checked out" />
        <ReportStat
          label="Cancelled"
          value={String(bookingTotals.cancelled)}
          note={`${Math.round(bookingTotals.cancelled / bookingTotals.total * 100)}% of bookings`} />
        
      </div>

      <section className="rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-card">
        <h2 className="text-[15px] font-semibold text-ink">Booking trend</h2>
        <p className="mt-0.5 text-[12.5px] text-ink-muted">
          Confirmed, completed and cancelled bookings per day.
        </p>

        <div className="mt-5 h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={bookingSeries} margin={{ top: 8, right: 8, bottom: 0, left: -12 }}>
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
                contentStyle={{ borderRadius: 10, border: '1px solid #E5E5E5', fontSize: 12 }} />
              
              <Legend
                verticalAlign="top"
                align="right"
                iconType="circle"
                iconSize={8}
                wrapperStyle={{ fontSize: 12, paddingBottom: 12 }} />
              
              <Bar dataKey="confirmed" name="Confirmed" fill="#D4E82A" radius={[4, 4, 0, 0]} />
              <Bar dataKey="completed" name="Completed" fill="#1F6B33" radius={[4, 4, 0, 0]} />
              <Bar dataKey="cancelled" name="Cancelled" fill="#E5484D" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>);

}