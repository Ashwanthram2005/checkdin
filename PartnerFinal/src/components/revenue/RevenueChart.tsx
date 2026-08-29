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
import { TrendingUpIcon } from 'lucide-react';
import { revenueSeries, revenueTotals } from '../../data/reports';
import { inr } from '../../utils/gst';

type View = 'daily' | 'weekly' | 'monthly';

const views: {id: View;label: string;growth: number;}[] = [
{ id: 'daily', label: 'Daily', growth: revenueTotals.dailyGrowth },
{ id: 'weekly', label: 'Weekly', growth: revenueTotals.weeklyGrowth },
{ id: 'monthly', label: 'Monthly', growth: revenueTotals.monthlyGrowth }];


export function RevenueChart() {
  const [view, setView] = useState<View>('daily');
  const data = revenueSeries[view];
  const growth = views.find((item) => item.id === view)!.growth;
  const total = data.reduce((sum, point) => sum + point.value, 0);

  return (
    <section className="rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-card">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-[15px] font-semibold text-ink">Revenue trend</h2>
          <div className="mt-1 flex items-center gap-3">
            <span className="text-[24px] font-bold leading-none tracking-tight text-ink">
              {inr(total)}
            </span>
            <span className="flex items-center gap-1 rounded-md bg-lime-100 px-2 py-1 text-[11.5px] font-semibold text-lime-600">
              <TrendingUpIcon size={12} aria-hidden="true" />
              {growth}% growth
            </span>
          </div>
          <p className="mt-1 text-[12.5px] text-ink-muted">
            Gross revenue for the selected {view === 'daily' ? 'week' : view === 'weekly' ? 'six weeks' : 'six months'}.
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

      <div className="mt-5 h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 4 }}>
            <defs>
              <linearGradient id="revenuePageFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#D4E82A" stopOpacity={0.32} />
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
              contentStyle={{ borderRadius: 10, border: '1px solid #E5E5E5', fontSize: 12 }} />
            
            <Area
              type="monotone"
              dataKey="value"
              stroke="#B9CF12"
              strokeWidth={2.5}
              fill="url(#revenuePageFill)"
              dot={{ r: 3.5, fill: '#B9CF12', strokeWidth: 0 }}
              activeDot={{ r: 5, fill: '#0D0D0D', strokeWidth: 0 }} />
            
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </section>);

}