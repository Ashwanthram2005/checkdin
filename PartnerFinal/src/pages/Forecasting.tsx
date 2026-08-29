import React, { useState } from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis } from
'recharts';
import { PageHeader } from '../components/PageHeader';
import { ReportStat } from '../components/reports/ReportStat';
import { SettingsCard } from '../components/settings/SettingsCard';
import { forecastSeries, forecastSummary } from '../data/analytics';
import { revenueSeries } from '../data/reports';
import { inr } from '../utils/gst';

const ranges = [
{ id: 'today', label: 'Today' },
{ id: 'week', label: 'This week' },
{ id: 'month', label: 'This month' }] as
const;

type Range = (typeof ranges)[number]['id'];

export function Forecasting() {
  const [range, setRange] = useState<Range>('week');
  const summary = forecastSummary[range];

  return (
    <main className="scroll-slim h-full flex-1 overflow-y-auto bg-canvas px-7 py-6">
      <PageHeader
        title="Forecasting"
        subtitle="What PartnerOS expects you to earn, and how confident it is." />
      

      <div className="mt-6 space-y-5 pb-8">
        <div className="flex flex-wrap gap-2 rounded-2xl border border-neutral-200/80 bg-white p-4 shadow-card">
          {ranges.map((item) =>
          <button
            key={item.id}
            type="button"
            onClick={() => setRange(item.id)}
            className={[
            'rounded-lg px-4 py-2 text-[12.5px] transition-colors duration-150 ease-out',
            range === item.id ?
            'bg-ink font-semibold text-white' :
            'border border-neutral-200 font-medium text-ink-soft hover:border-neutral-300'].
            join(' ')}>
            
              {item.label}
            </button>
          )}
        </div>

        <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <ReportStat
            label="Expected revenue"
            value={inr(summary.expected)}
            note={ranges.find((item) => item.id === range)?.label}
            emphasis />
          
          <ReportStat
            label="Revenue growth"
            value={`${summary.growth}%`}
            delta={summary.growth}
            note="vs the same period last cycle" />
          
          <ReportStat
            label="Booking trend"
            value={summary.growth > 10 ? 'Accelerating' : 'Steady'}
            note="Based on the last 14 days" />
          
          <ReportStat
            label="Forecast confidence"
            value={`${summary.confidence}%`}
            note="Higher for shorter horizons" />
          
        </section>

        <SettingsCard
          title="Forecast vs actual"
          description="Solid area is what you earned; the line is what was predicted."
          bodyClassName="p-5">
          
          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={forecastSeries} margin={{ top: 8, right: 8, bottom: 0, left: 4 }}>
                <defs>
                  <linearGradient id="forecastFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#D4E82A" stopOpacity={0.34} />
                    <stop offset="100%" stopColor="#D4E82A" stopOpacity={0} />
                  </linearGradient>
                </defs>
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
                  width={58} />
                
                <Tooltip
                  formatter={(value: number, name: string) => [
                  value === 0 ? 'Not yet' : inr(value),
                  name === 'actual' ? 'Actual' : 'Forecast']
                  }
                  contentStyle={{ borderRadius: 10, border: '1px solid #E5E5E5', fontSize: 12 }} />
                
                <Area
                  type="monotone"
                  dataKey="actual"
                  stroke="#B9CF12"
                  strokeWidth={2.5}
                  fill="url(#forecastFill)" />
                
                <Line
                  type="monotone"
                  dataKey="forecast"
                  stroke="#0D0D0D"
                  strokeWidth={2}
                  strokeDasharray="5 4"
                  dot={false} />
                
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </SettingsCard>

        <SettingsCard
          title="Historical comparison"
          description="Six months of actual monthly revenue behind the forecast."
          bodyClassName="p-5">
          
          <div className="h-[240px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={revenueSeries.monthly}
                margin={{ top: 8, right: 8, bottom: 0, left: 4 }}>
                
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
                  tickFormatter={(value: number) => `₹${(value / 100000).toFixed(1)}L`}
                  width={58} />
                
                <Tooltip
                  formatter={(value: number) => [inr(value), 'Revenue']}
                  contentStyle={{ borderRadius: 10, border: '1px solid #E5E5E5', fontSize: 12 }} />
                
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#1F6B33"
                  strokeWidth={2.5}
                  fill="rgba(31,107,51,0.12)" />
                
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </SettingsCard>
      </div>
    </main>);

}