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
import { ChevronDownIcon } from 'lucide-react';
import { revenueTrend } from '../data/dashboard';

type TooltipProps = {
  active?: boolean;
  payload?: {payload: {date: string;revenue: number;};}[];
};

function ChartTooltip({ active, payload }: TooltipProps) {
  if (!active || !payload?.length) return null;
  const point = payload[0].payload;
  return (
    <div className="rounded-lg bg-ink px-3 py-2 text-white shadow-lg">
      <p className="text-[11px] text-white/60">{point.date}</p>
      <p className="text-[13px] font-semibold">₹{point.revenue.toLocaleString('en-IN')}</p>
    </div>);

}

export function RevenueTrendCard() {
  const [range, setRange] = useState('7 Days');

  return (
    <section className="flex flex-col rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-card">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-[16px] font-semibold text-ink">Revenue Trend</h2>
          <p className="mt-0.5 text-[12px] text-ink-muted">Last 7 days</p>
        </div>
        <div className="relative">
          <select
            aria-label="Select date range"
            value={range}
            onChange={(e) => setRange(e.target.value)}
            className="appearance-none rounded-lg border border-neutral-200 bg-white py-2 pl-3.5 pr-9 text-[13px] font-medium text-ink outline-none transition-colors duration-150 ease-out hover:border-neutral-300 focus:border-lime-500">
            
            <option>7 Days</option>
            <option>30 Days</option>
            <option>90 Days</option>
          </select>
          <ChevronDownIcon
            size={15}
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted"
            aria-hidden="true" />
          
        </div>
      </div>

      <div className="mt-5 h-[240px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={revenueTrend} margin={{ top: 8, right: 8, bottom: 0, left: -8 }}>
            <defs>
              <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#D4E82A" stopOpacity={0.28} />
                <stop offset="100%" stopColor="#D4E82A" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="#EFEFEF" vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tick={{ fill: '#8A8A8A', fontSize: 12 }}
              dy={8} />
            
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fill: '#8A8A8A', fontSize: 12 }}
              ticks={[0, 5000, 10000, 15000, 20000, 25000]}
              domain={[0, 25000]}
              tickFormatter={(v: number) => v === 0 ? '₹0' : `₹${v / 1000}K`}
              width={54} />
            
            <Tooltip content={<ChartTooltip />} cursor={{ stroke: '#D4D4D4', strokeWidth: 1 }} />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#B9CF12"
              strokeWidth={2.5}
              fill="url(#revenueFill)"
              dot={{ r: 4, fill: '#B9CF12', strokeWidth: 0 }}
              activeDot={{ r: 5, fill: '#0D0D0D', strokeWidth: 0 }} />
            
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </section>);

}