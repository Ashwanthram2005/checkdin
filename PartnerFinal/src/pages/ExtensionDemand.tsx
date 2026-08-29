import React from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis } from
'recharts';
import { PageHeader } from '../components/PageHeader';
import { ReportStat } from '../components/reports/ReportStat';
import { SettingsCard } from '../components/settings/SettingsCard';
import { Heatmap } from '../components/analytics/Heatmap';
import {
  extensionDemandHighlights,
  extensionHourly,
  extensionRevenueByDuration,
  extensionWeekly,
  extensionWeeklyBands } from
'../data/extensions';
import { inr } from '../utils/gst';

export function ExtensionDemand() {
  return (
    <main className="scroll-slim h-full flex-1 overflow-y-auto bg-canvas px-7 py-6">
      <PageHeader
        title="Extension Demand"
        subtitle="When guests ask to stay longer — so you can staff and price for it." />
      

      <div className="mt-6 space-y-5 pb-8">
        <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <ReportStat
            label="Most requested"
            value={extensionDemandHighlights.mostRequested}
            note="By number of requests"
            emphasis />
          
          <ReportStat
            label="Most profitable"
            value={extensionDemandHighlights.mostProfitable}
            note="By total revenue" />
          
          <ReportStat
            label="Peak extension hours"
            value={extensionDemandHighlights.peakHours}
            note="Keep the desk staffed" />
          
          <ReportStat
            label="Busiest day"
            value={extensionDemandHighlights.busiestDay}
            note="Highest request volume" />
          
        </section>

        <SettingsCard
          title="Requests by hour"
          description="When extension requests land during the day."
          bodyClassName="p-5">
          
          <div className="h-[240px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={extensionHourly} margin={{ top: 8, right: 8, bottom: 0, left: -14 }}>
                <CartesianGrid stroke="#EFEFEF" vertical={false} />
                <XAxis
                  dataKey="hour"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: '#8A8A8A', fontSize: 12 }}
                  dy={8} />
                
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: '#8A8A8A', fontSize: 12 }} />
                
                <Tooltip
                  formatter={(value: number) => [`${value} requests`, 'Requests']}
                  contentStyle={{ borderRadius: 10, border: '1px solid #E5E5E5', fontSize: 12 }} />
                
                <Bar dataKey="requests" radius={[6, 6, 0, 0]}>
                  {extensionHourly.map((item) =>
                  <Cell
                    key={item.hour}
                    fill={item.requests >= 16 ? '#D4E82A' : '#E2F183'} />

                  )}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </SettingsCard>

        <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
          <SettingsCard
            title="Weekly heatmap"
            description="Requests by day and time band."
            bodyClassName="p-5">
            
            <Heatmap
              rows={extensionWeekly}
              bands={extensionWeeklyBands}
              label="Extension requests by day and time" />
            
          </SettingsCard>

          <SettingsCard
            title="Duration popularity"
            description="Share of requests by extension length."
            bodyClassName="p-5">
            
            <ul className="space-y-4">
              {extensionRevenueByDuration.map((item) => {
                const total = extensionRevenueByDuration.reduce((sum, row) => sum + row.count, 0);
                const share = Math.round(item.count / total * 100);
                return (
                  <li key={item.label}>
                    <div className="flex items-center justify-between text-[13px]">
                      <span className="font-medium text-ink">{item.label}</span>
                      <span className="text-ink-muted">
                        {item.count} requests • {inr(item.revenue)}
                      </span>
                    </div>
                    <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-neutral-100">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${share}%`, backgroundColor: item.color }} />
                      
                    </div>
                  </li>);

              })}
            </ul>
          </SettingsCard>
        </div>
      </div>
    </main>);

}