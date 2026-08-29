import React from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
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
  heatmapBands,
  hourlyDemand,
  occupancyDaily,
  occupancyForecast,
  occupancyMonthly,
  occupancyNow,
  utilizationHeatmap } from
'../data/analytics';

export function Occupancy() {
  const peak = hourlyDemand.reduce((top, item) => item.value > top.value ? item : top);
  const low = hourlyDemand.reduce((min, item) => item.value < min.value ? item : min);

  return (
    <main className="scroll-slim h-full flex-1 overflow-y-auto bg-canvas px-7 py-6">
      <PageHeader
        title="Occupancy"
        subtitle="Slot utilisation across the day, the week and the month." />
      

      <div className="mt-6 space-y-5 pb-8">
        <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <ReportStat
            label="Current occupancy"
            value={`${occupancyNow.current}%`}
            note={`${occupancyNow.slotsSold} of ${occupancyNow.slotsAllocated} slots sold`}
            emphasis />
          
          <ReportStat label="Daily average" value={`${occupancyNow.daily}%`} note="Last 7 days" />
          <ReportStat label="Weekly average" value={`${occupancyNow.weekly}%`} note="Last 4 weeks" />
          <ReportStat
            label="Monthly average"
            value={`${occupancyNow.monthly}%`}
            delta={6}
            note="vs last month" />
          
        </section>

        <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
          <SettingsCard
            title="Occupancy by day"
            description="This week against your monthly trend."
            bodyClassName="p-5">
            
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={occupancyDaily} margin={{ top: 8, right: 8, bottom: 0, left: -12 }}>
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
                    formatter={(value: number) => [`${value}%`, 'Occupancy']}
                    contentStyle={{ borderRadius: 10, border: '1px solid #E5E5E5', fontSize: 12 }} />
                  
                  <Bar dataKey="value" fill="#D4E82A" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </SettingsCard>

          <SettingsCard
            title="Occupancy by month"
            description="Six month trajectory."
            bodyClassName="p-5">
            
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={occupancyMonthly}
                  margin={{ top: 8, right: 8, bottom: 0, left: -12 }}>
                  
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
                    formatter={(value: number) => [`${value}%`, 'Occupancy']}
                    contentStyle={{ borderRadius: 10, border: '1px solid #E5E5E5', fontSize: 12 }} />
                  
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#1F6B33"
                    strokeWidth={2.5}
                    dot={{ r: 3.5, fill: '#1F6B33', strokeWidth: 0 }} />
                  
                </LineChart>
              </ResponsiveContainer>
            </div>
          </SettingsCard>
        </div>

        <SettingsCard
          title="Demand by time of day"
          description={`Busiest at ${peak.hour}, quietest at ${low.hour}.`}
          bodyClassName="p-5"
          action={
          <span className="rounded-md bg-lime-100 px-2.5 py-1 text-[11.5px] font-semibold text-lime-700">
              Peak {peak.hour}
            </span>
          }>
          
          <div className="h-[230px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hourlyDemand} margin={{ top: 8, right: 8, bottom: 0, left: -12 }}>
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
                  tick={{ fill: '#8A8A8A', fontSize: 12 }}
                  tickFormatter={(value: number) => `${value}%`} />
                
                <Tooltip
                  formatter={(value: number) => [`${value}%`, 'Slots sold']}
                  contentStyle={{ borderRadius: 10, border: '1px solid #E5E5E5', fontSize: 12 }} />
                
                <Bar dataKey="value" fill="#98A70F" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </SettingsCard>

        <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
          <SettingsCard
            title="Utilisation heatmap"
            description="Percentage of allocated slots sold, by day and time band."
            bodyClassName="p-5">
            
            <Heatmap
              rows={utilizationHeatmap}
              bands={heatmapBands}
              max={100}
              label="Slot utilisation by day and time"
              formatValue={(value) => `${value}`} />
            
          </SettingsCard>

          <SettingsCard
            title="Seven day forecast"
            description="Projected occupancy for the week ahead."
            bodyClassName="p-5">
            
            <ul className="space-y-3">
              {occupancyForecast.map((day) =>
              <li key={day.label}>
                  <div className="flex items-center justify-between text-[13px]">
                    <span className="font-medium text-ink">{day.label}</span>
                    <span className="text-ink-soft">{day.projected}%</span>
                  </div>
                  <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-neutral-100">
                    <div
                    className={`h-full rounded-full ${
                    day.projected >= 85 ?
                    'bg-forest' :
                    day.projected >= 60 ?
                    'bg-lime-400' :
                    'bg-amber-400'}`
                    }
                    style={{ width: `${day.projected}%` }} />
                  
                  </div>
                </li>
              )}
            </ul>
            <p className="mt-4 text-[12px] leading-relaxed text-ink-muted">
              Days below 60% are worth a discount rule; days above 90% are worth a surge rule.
            </p>
          </SettingsCard>
        </div>
      </div>
    </main>);

}