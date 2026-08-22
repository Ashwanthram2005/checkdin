import React, { useState } from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis } from
'recharts';
import { ReportStat } from './ReportStat';
import { revenueSeries, revenueTotals } from '../../data/reports';
import { inr } from '../../utils/gst';

type View = 'daily' | 'weekly' | 'monthly';

const views: {id: View;label: string;}[] = [
{ id: 'daily', label: 'Daily' },
{ id: 'weekly', label: 'Weekly' },
{ id: 'monthly', label: 'Monthly' }];


export function RevenueReport() {
  const [view, setView] = useState<View>('daily');
  const data = revenueSeries[view];

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <ReportStat
          label="Daily revenue"
          value={inr(revenueTotals.daily)}
          delta={revenueTotals.dailyGrowth}
          note="vs yesterday"
          emphasis />
        
        <ReportStat
          label="Weekly revenue"
          value={inr(revenueTotals.weekly)}
          delta={revenueTotals.weeklyGrowth}
          note="vs last week" />
        
        <ReportStat
          label="Monthly revenue"
          value={inr(revenueTotals.monthly)}
          delta={revenueTotals.monthlyGrowth}
          note="vs last month" />
        
      </div>

      <section className="rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-card">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-[15px] font-semibold text-ink">Revenue trend</h2>
            <p className="mt-0.5 text-[12.5px] text-ink-muted">
              Net of GST, before platform commission.
            </p>
          </div>
          <div role="tablist" aria-label="Revenue view" className="flex rounded-xl bg-neutral-100 p-1">
            {views.map((item) =>
            <button
              key={item.id}
              role="tab"
              type="button"
              aria-selected={view === item.id}
              onClick={() => setView(item.id)}
              className={[
              'rounded-lg px-3.5 py-1.5 text-[12.5px] transition-colors duration-150 ease-out',
              view === item.id ?
              'bg-white font-semibold text-ink shadow-card' :
              'font-medium text-ink-muted hover:text-ink'].
              join(' ')}>
              
                {item.label}
              </button>
            )}
          </div>
        </div>

        <div className="mt-5 h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 4 }}>
              <defs>
                <linearGradient id="reportRevenueFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#D4E82A" stopOpacity={0.3} />
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
                tickFormatter={(value: number) =>
                value >= 100000 ? `₹${(value / 100000).toFixed(1)}L` : `₹${Math.round(value / 1000)}K`
                }
                width={62} />
              
              <Tooltip
                formatter={(value: number) => [inr(value), 'Revenue']}
                contentStyle={{
                  borderRadius: 10,
                  border: '1px solid #E5E5E5',
                  fontSize: 12
                }} />
              
              <Area
                type="monotone"
                dataKey="value"
                stroke="#B9CF12"
                strokeWidth={2.5}
                fill="url(#reportRevenueFill)"
                dot={{ r: 3.5, fill: '#B9CF12', strokeWidth: 0 }}
                activeDot={{ r: 5, fill: '#0D0D0D', strokeWidth: 0 }} />
              
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>);

}