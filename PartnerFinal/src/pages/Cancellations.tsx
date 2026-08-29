import React from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis } from
'recharts';
import { PageHeader } from '../components/PageHeader';
import { ReportStat } from '../components/reports/ReportStat';
import { SettingsCard } from '../components/settings/SettingsCard';
import { cancellationReasons, cancellationTotals, cancellationTrend } from '../data/analytics';
import { inr } from '../utils/gst';

export function Cancellations() {
  return (
    <main className="scroll-slim h-full flex-1 overflow-y-auto bg-canvas px-7 py-6">
      <PageHeader
        title="Cancellations"
        subtitle="How often bookings fall through, what it costs, and why guests walk away." />
      

      <div className="mt-6 space-y-5 pb-8">
        <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <ReportStat
            label="Cancellation rate"
            value={`${cancellationTotals.rate}%`}
            delta={-3}
            note="vs last month"
            emphasis />
          
          <ReportStat
            label="Cancelled bookings"
            value={String(cancellationTotals.count)}
            note="This month" />
          
          <ReportStat
            label="Revenue lost"
            value={inr(cancellationTotals.lostRevenue)}
            note="Slots that went unsold" />
          
          <ReportStat
            label="Refunds paid"
            value={inr(cancellationTotals.refunded)}
            note="Returned to guests" />
          
        </section>

        <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
          <SettingsCard
            title="Cancellation trend"
            description="Rate over the last six months."
            bodyClassName="p-5">
            
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={cancellationTrend}
                  margin={{ top: 8, right: 8, bottom: 0, left: -14 }}>
                  
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
                    tickFormatter={(value: number) => `${value}%`} />
                  
                  <Tooltip
                    formatter={(value: number) => [`${value}%`, 'Cancellation rate']}
                    contentStyle={{ borderRadius: 10, border: '1px solid #E5E5E5', fontSize: 12 }} />
                  
                  <Line
                    type="monotone"
                    dataKey="rate"
                    stroke="#DC2626"
                    strokeWidth={2.5}
                    dot={{ r: 3.5, fill: '#DC2626', strokeWidth: 0 }} />
                  
                </LineChart>
              </ResponsiveContainer>
            </div>
          </SettingsCard>

          <SettingsCard
            title="Lost revenue"
            description="What cancellations cost each month."
            bodyClassName="p-5">
            
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={cancellationTrend}
                  margin={{ top: 8, right: 8, bottom: 0, left: -6 }}>
                  
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
                    tickFormatter={(value: number) => `₹${Math.round(value / 1000)}K`}
                    width={54} />
                  
                  <Tooltip
                    formatter={(value: number) => [inr(value), 'Revenue lost']}
                    contentStyle={{ borderRadius: 10, border: '1px solid #E5E5E5', fontSize: 12 }} />
                  
                  <Bar dataKey="lost" fill="#F0A6A6" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </SettingsCard>
        </div>

        <SettingsCard
          title="Why guests cancel"
          description="Reasons captured at cancellation."
          bodyClassName="p-5">
          
          <div className="flex flex-wrap items-center gap-8">
            <div className="h-[190px] w-[190px] shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={cancellationReasons}
                    dataKey="count"
                    nameKey="label"
                    innerRadius={58}
                    outerRadius={92}
                    paddingAngle={1.5}
                    stroke="none">
                    
                    {cancellationReasons.map((item) =>
                    <Cell key={item.label} fill={item.color} />
                    )}
                  </Pie>
                  <Tooltip
                    contentStyle={{ borderRadius: 10, border: '1px solid #E5E5E5', fontSize: 12 }} />
                  
                </PieChart>
              </ResponsiveContainer>
            </div>

            <ul className="min-w-[240px] flex-1 space-y-4">
              {cancellationReasons.map((reason) =>
              <li key={reason.label}>
                  <div className="flex items-center justify-between text-[13px]">
                    <span className="flex items-center gap-2 font-medium text-ink">
                      <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: reason.color }}
                      aria-hidden="true" />
                    
                      {reason.label}
                    </span>
                    <span className="text-ink-muted">
                      {reason.count} • {reason.share}%
                    </span>
                  </div>
                  <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-neutral-100">
                    <div
                    className="h-full rounded-full"
                    style={{ width: `${reason.share}%`, backgroundColor: reason.color }} />
                  
                  </div>
                </li>
              )}
            </ul>
          </div>
        </SettingsCard>
      </div>
    </main>);

}