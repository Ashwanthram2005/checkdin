import React from 'react';
import {
  Bar,
  BarChart,
  Cell,
  CartesianGrid,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis } from
'recharts';
import { AlertTriangleIcon } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { ReportStat } from '../components/reports/ReportStat';
import { SettingsCard } from '../components/settings/SettingsCard';
import {
  extensionFunnel,
  extensionOpportunity,
  extensionRevenueByDuration,
  extensionRevenueTotals } from
'../data/extensions';
import { inr } from '../utils/gst';

export function ExtensionRevenue() {
  return (
    <main className="scroll-slim h-full flex-1 overflow-y-auto bg-canvas px-7 py-6">
      <PageHeader
        title="Extension Revenue"
        subtitle="What guests staying longer is worth — and what saying no costs you." />
      

      <div className="mt-6 space-y-5 pb-8">
        <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <ReportStat
            label="Extension revenue"
            value={inr(extensionRevenueTotals.revenue)}
            note="This month"
            emphasis />
          
          <ReportStat
            label="Extensions approved"
            value={String(extensionRevenueTotals.count)}
            note={`${extensionFunnel.approvalRate}% approval rate`} />
          
          <ReportStat
            label="Average extension"
            value={inr(extensionRevenueTotals.average)}
            note="Per approved request" />
          
          <ReportStat
            label="Revenue contribution"
            value={`${extensionRevenueTotals.contribution}%`}
            note="Of total property revenue" />
          
        </section>

        <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
          <SettingsCard
            title="Revenue by extension length"
            description="Which extension lengths guests actually take."
            bodyClassName="p-5">
            
            <div className="h-[260px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={extensionRevenueByDuration}
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
                    formatter={(value: number) => [inr(value), 'Revenue']}
                    contentStyle={{ borderRadius: 10, border: '1px solid #E5E5E5', fontSize: 12 }} />
                  
                  <Bar dataKey="revenue" radius={[6, 6, 0, 0]}>
                    {extensionRevenueByDuration.map((item) =>
                    <Cell key={item.label} fill={item.color} />
                    )}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <table className="mt-4 w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-neutral-200">
                  {['Duration', 'Count', 'Revenue', 'Average'].map((head) =>
                  <th
                    key={head}
                    scope="col"
                    className="py-2 text-[12px] font-medium text-ink-muted">
                    
                      {head}
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {extensionRevenueByDuration.map((row) =>
                <tr key={row.label} className="border-b border-neutral-100 last:border-0">
                    <td className="py-2.5 text-[13px] font-medium text-ink">{row.label}</td>
                    <td className="py-2.5 text-[13px] text-ink-soft">{row.count}</td>
                    <td className="py-2.5 text-[13px] font-semibold text-ink">{inr(row.revenue)}</td>
                    <td className="py-2.5 text-[13px] text-ink-soft">
                      {inr(Math.round(row.revenue / row.count))}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </SettingsCard>

          <SettingsCard
            title="Request outcomes"
            description={`${extensionFunnel.requests} requests this month.`}
            bodyClassName="p-5">
            
            <div className="relative mx-auto h-[200px] w-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                    { name: 'Approved', value: extensionFunnel.approved, fill: '#D4E82A' },
                    { name: 'Rejected', value: extensionFunnel.rejected, fill: '#DC2626' },
                    { name: 'Expired', value: extensionFunnel.expired, fill: '#C9C9C9' }]
                    }
                    dataKey="value"
                    innerRadius={62}
                    outerRadius={96}
                    paddingAngle={1.5}
                    stroke="none" />
                  
                  <Tooltip
                    contentStyle={{ borderRadius: 10, border: '1px solid #E5E5E5', fontSize: 12 }} />
                  
                </PieChart>
              </ResponsiveContainer>
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-[12px] text-ink-muted">Approval</span>
                <span className="text-[26px] font-bold leading-none tracking-tight text-ink">
                  {extensionFunnel.approvalRate}%
                </span>
              </div>
            </div>

            <ul className="mt-4 space-y-2.5">
              {[
              { label: 'Total requests', value: extensionFunnel.requests },
              { label: 'Approved', value: extensionFunnel.approved },
              { label: 'Rejected', value: extensionFunnel.rejected },
              { label: 'Expired', value: extensionFunnel.expired }].
              map((row) =>
              <li key={row.label} className="flex items-center justify-between text-[13px]">
                  <span className="text-ink-soft">{row.label}</span>
                  <span className="font-semibold text-ink">{row.value}</span>
                </li>
              )}
            </ul>
          </SettingsCard>
        </div>

        <section className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
          <p className="flex items-center gap-2 text-[11px] font-bold tracking-wide text-amber-800">
            <AlertTriangleIcon size={14} aria-hidden="true" />
            REVENUE OPPORTUNITY
          </p>
          <div className="mt-3 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {[
            { label: 'Rejected revenue', value: extensionOpportunity.rejectedRevenue },
            { label: 'Expired revenue', value: extensionOpportunity.expiredRevenue },
            { label: 'Revenue missed', value: extensionOpportunity.missed },
            { label: 'Recoverable next month', value: extensionOpportunity.potential }].
            map((item) =>
            <div key={item.label}>
                <p className="text-[12.5px] text-amber-900/70">{item.label}</p>
                <p className="mt-1 text-[22px] font-bold leading-none tracking-tight text-amber-900">
                  {inr(item.value)}
                </p>
              </div>
            )}
          </div>
          <p className="mt-3 text-[12.5px] text-amber-900/80">{extensionOpportunity.note}</p>
        </section>
      </div>
    </main>);

}