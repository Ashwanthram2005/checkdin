import React from 'react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis } from
'recharts';
import { useChartTheme } from '../../utils/chartTheme';
import { formatCurrency, formatNumber } from '../../utils/format';

function useTooltipStyle() {
  const theme = useChartTheme();
  return {
    contentStyle: {
      background: theme.tooltipBg,
      border: `1px solid ${theme.tooltipBorder}`,
      borderRadius: 10,
      fontSize: 12,
      boxShadow: '0 12px 32px -8px rgba(16,18,20,0.18)'
    },
    labelStyle: { color: theme.axis, fontWeight: 600, marginBottom: 4 },
    itemStyle: { padding: 0 }
  };
}

const axisProps = (color: string) => ({
  stroke: 'transparent',
  tick: { fill: color, fontSize: 11 },
  tickLine: false as const,
  axisLine: false as const
});

export function RevenueAreaChart({
  data,
  height = 260



}: {data: {label: string;revenue: number;target?: number;}[];height?: number;}) {
  const theme = useChartTheme();
  const tooltip = useTooltipStyle();
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="revFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={theme.accent} stopOpacity={0.45} />
            <stop offset="100%" stopColor={theme.accent} stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke={theme.grid} vertical={false} />
        <XAxis dataKey="label" {...axisProps(theme.axis)} />
        <YAxis
          {...axisProps(theme.axis)}
          width={58}
          tickFormatter={(value: number) => formatCurrency(value, true)} />
        
        <Tooltip
          {...tooltip}
          formatter={(value: number, name: string) => [formatCurrency(value), name === 'revenue' ? 'Revenue' : 'Target']} />
        
        <Area
          type="monotone"
          dataKey="revenue"
          stroke={theme.stroke}
          strokeWidth={2}
          fill="url(#revFill)"
          dot={false}
          activeDot={{ r: 4, strokeWidth: 0, fill: theme.stroke }} />
        
      </AreaChart>
    </ResponsiveContainer>);

}

export function BookingTrendChart({
  data,
  height = 260



}: {data: {label: string;confirmed: number;cancelled: number;}[];height?: number;}) {
  const theme = useChartTheme();
  const tooltip = useTooltipStyle();
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid stroke={theme.grid} vertical={false} />
        <XAxis dataKey="label" {...axisProps(theme.axis)} />
        <YAxis {...axisProps(theme.axis)} width={40} tickFormatter={(v: number) => formatNumber(v)} />
        <Tooltip {...tooltip} />
        <Legend
          iconType="circle"
          iconSize={7}
          wrapperStyle={{ fontSize: 12, color: theme.axis, paddingTop: 8 }} />
        
        <Line
          type="monotone"
          name="Confirmed"
          dataKey="confirmed"
          stroke={theme.stroke}
          strokeWidth={2}
          dot={false} />
        
        <Line
          type="monotone"
          name="Cancelled"
          dataKey="cancelled"
          stroke={theme.series[4]}
          strokeWidth={2}
          strokeDasharray="4 3"
          dot={false} />
        
      </LineChart>
    </ResponsiveContainer>);

}

export function OccupancyBarChart({
  data,
  height = 260



}: {data: {label: string;occupancy: number;capacity?: number;}[];height?: number;}) {
  const theme = useChartTheme();
  const tooltip = useTooltipStyle();
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid stroke={theme.grid} vertical={false} />
        <XAxis dataKey="label" {...axisProps(theme.axis)} interval={0} />
        <YAxis {...axisProps(theme.axis)} width={36} tickFormatter={(v: number) => `${v}%`} />
        <Tooltip {...tooltip} formatter={(value: number) => [`${value}%`, 'Occupancy']} />
        <Bar dataKey="occupancy" radius={[6, 6, 0, 0]} maxBarSize={34}>
          {data.map((entry) =>
          <Cell
            key={entry.label}
            fill={entry.occupancy >= (entry.capacity ?? 80) ? theme.stroke : theme.accentSoft}
            stroke={entry.occupancy >= (entry.capacity ?? 80) ? 'transparent' : theme.stroke}
            strokeWidth={1} />

          )}
        </Bar>
      </BarChart>
    </ResponsiveContainer>);

}

export function RevenueBreakdownChart({
  data,
  height = 280



}: {data: {label: string;gross: number;net: number;commission: number;}[];height?: number;}) {
  const theme = useChartTheme();
  const tooltip = useTooltipStyle();
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid stroke={theme.grid} vertical={false} />
        <XAxis dataKey="label" {...axisProps(theme.axis)} />
        <YAxis
          {...axisProps(theme.axis)}
          width={58}
          tickFormatter={(value: number) => formatCurrency(value, true)} />
        
        <Tooltip {...tooltip} formatter={(value: number) => formatCurrency(value)} />
        <Legend iconType="circle" iconSize={7} wrapperStyle={{ fontSize: 12, color: theme.axis, paddingTop: 8 }} />
        <Bar name="Gross" dataKey="gross" fill={theme.stroke} radius={[5, 5, 0, 0]} maxBarSize={22} />
        <Bar name="Net" dataKey="net" fill={theme.series[1]} radius={[5, 5, 0, 0]} maxBarSize={22} />
        <Bar name="Commission" dataKey="commission" fill={theme.series[3]} radius={[5, 5, 0, 0]} maxBarSize={22} />
      </BarChart>
    </ResponsiveContainer>);

}

export function DonutChart({
  data,
  height = 220



}: {data: {label: string;value: number;count?: number;}[];height?: number;}) {
  const theme = useChartTheme();
  const tooltip = useTooltipStyle();
  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row">
      <div style={{ width: height, height }} className="shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="label"
              innerRadius="62%"
              outerRadius="100%"
              paddingAngle={2}
              strokeWidth={0}>
              
              {data.map((entry, index) =>
              <Cell key={entry.label} fill={theme.series[index % theme.series.length]} />
              )}
            </Pie>
            <Tooltip {...tooltip} formatter={(value: number) => `${value}%`} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <ul className="w-full space-y-2.5">
        {data.map((entry, index) =>
        <li key={entry.label} className="flex items-center gap-2.5 text-sm">
            <span
            className="h-2 w-2 shrink-0 rounded-full"
            style={{ background: theme.series[index % theme.series.length] }} />
          
            <span className="font-medium text-ink">{entry.label}</span>
            <span className="ml-auto tabular-nums text-muted">
              {entry.value}%{entry.count !== undefined ? ` (${entry.count})` : ''}
            </span>
          </li>
        )}
      </ul>
    </div>);

}