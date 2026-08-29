import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader } from '../../components/ui/Card';
import { PageHeader } from '../../components/ui/PageHeader';
import { Badge } from '../../components/ui/Badge';
import { MetricTile, ScoreBar, ExportMenu } from '../../components/adminos/OsPrimitives';
import { OccupancyBarChart } from '../../components/charts/Charts';
import { hotelOccupancyRanking, hourSlots, occupancyHeatmap, peakHours } from '../../data/adminos/intelligence';
import { useAdminOs } from '../../contexts/AdminOsContext';
import { liveCityOccupancy } from '../../services/adminos/selectors';
import { formatNumber } from '../../utils/format';
import { cn } from '../../utils/cn';

function heatColor(value: number): string {
  if (value >= 85) return 'bg-negative/80 text-white';
  if (value >= 70) return 'bg-warning/70 text-ink';
  if (value >= 55) return 'bg-accent/70 text-ink';
  if (value >= 40) return 'bg-accent/35 text-ink';
  return 'bg-faint text-muted';
}

const demandTone = {
  Peak: 'negative',
  Steady: 'positive',
  Soft: 'warning',
  Low: 'neutral'
} as const;

export function OccupancyIntelligence() {
  const { state } = useAdminOs();
  const cityOccupancy = useMemo(() => liveCityOccupancy(state), [state]);

  const platformOccupancy = Math.round(
    cityOccupancy.reduce((sum, city) => sum + city.occupancy * city.hotels, 0) /
    cityOccupancy.reduce((sum, city) => sum + city.hotels, 0)
  );
  const peak = [...cityOccupancy].sort((a, b) => b.occupancy - a.occupancy)[0];
  const low = [...cityOccupancy].sort((a, b) => a.occupancy - b.occupancy)[0];
  const peakHour = peakHours[0];

  return (
    <div>
      <PageHeader
        title="Occupancy intelligence"
        subtitle="Where demand is concentrated by city, hotel, and hour of day. Blended with live hotel visibility."
        actions={
        <ExportMenu
          title="Occupancy by city"
          entity="Occupancy"
          rows={cityOccupancy}
          columns={[
          { header: 'City', value: (row: (typeof cityOccupancy)[number]) => row.city },
          { header: 'Occupancy %', value: (row: (typeof cityOccupancy)[number]) => row.occupancy },
          { header: 'Target %', value: (row: (typeof cityOccupancy)[number]) => row.target },
          { header: 'Hotels', value: (row: (typeof cityOccupancy)[number]) => row.hotels },
          { header: 'Live hotels', value: (row: (typeof cityOccupancy)[number]) => row.liveHotels },
          { header: 'Demand', value: (row: (typeof cityOccupancy)[number]) => row.demand }]
          } />

        } />
      

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <MetricTile label="Platform occupancy" value={`${platformOccupancy}%`} hint="weighted by room count" tone="accent" />
        <MetricTile
          label="Peak demand city"
          value={peak.city}
          hint={`${peak.occupancy}% occupied`}
          tone="negative"
          to={`/os/city-intelligence?city=${encodeURIComponent(peak.city)}`} />
        
        <MetricTile
          label="Lowest demand city"
          value={low.city}
          hint={`${low.occupancy}% occupied`}
          tone="warning"
          to={`/os/city-intelligence?city=${encodeURIComponent(low.city)}`} />
        
        <MetricTile label="Peak booking window" value={`${peakHour.label} hrs`} hint={`${formatNumber(peakHour.bookings)} bookings`} to="/os/pricing-governance" />
      </div>

      <Card className="mt-4">
        <CardHeader title="City occupancy vs target" subtitle="Bars above target are surge candidates" />
        <div className="px-2 py-4">
          <OccupancyBarChart
            data={cityOccupancy.map((city) => ({ label: city.city, occupancy: city.occupancy, capacity: city.target }))} />
          
        </div>
      </Card>

      <Card className="mt-4">
        <CardHeader title="Occupancy heatmap" subtitle="City by four-hour slot — darker means fuller" />
        <div className="overflow-x-auto px-5 py-5">
          <table className="w-full min-w-[640px] border-separate border-spacing-1 text-sm">
            <thead>
              <tr>
                <th scope="col" className="w-32 text-left text-[11px] font-semibold uppercase tracking-wider text-muted">
                  City
                </th>
                {hourSlots.map((slot) =>
                <th key={slot} scope="col" className="text-center text-[11px] font-semibold uppercase tracking-wider text-muted">
                    {slot}
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {occupancyHeatmap.map((row) =>
              <tr key={row.city}>
                  <th scope="row" className="text-left text-[13px] font-semibold text-ink">
                    {row.city}
                  </th>
                  {row.slots.map((cell) =>
                <td key={cell.slot} className="p-0">
                      <div
                    className={cn(
                      'flex h-10 items-center justify-center rounded-md text-[13px] font-semibold tabular-nums',
                      heatColor(cell.value)
                    )}
                    title={`${row.city} · ${cell.slot} · ${cell.value}%`}>
                    
                        {cell.value}
                      </div>
                    </td>
                )}
                </tr>
              )}
            </tbody>
          </table>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-muted">
            <span>Scale</span>
            {[
            { label: '<40%', className: 'bg-faint' },
            { label: '40–55%', className: 'bg-accent/35' },
            { label: '55–70%', className: 'bg-accent/70' },
            { label: '70–85%', className: 'bg-warning/70' },
            { label: '85%+', className: 'bg-negative/80' }].
            map((item) =>
            <span key={item.label} className="flex items-center gap-1.5">
                <span className={cn('h-3 w-5 rounded', item.className)} />
                {item.label}
              </span>
            )}
          </div>
        </div>
      </Card>

      <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader title="Hotel occupancy ranking" subtitle="Highest to lowest, all cities" />
          <ul className="divide-y divide-line">
            {hotelOccupancyRanking.map((hotel, index) =>
            <li key={hotel.propertyId}>
                <Link
                to={`/properties/${hotel.propertyId}`}
                className="flex items-center gap-3 px-5 py-3.5 transition-colors duration-150 ease-smooth hover:bg-faint">
                
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-faint text-[11px] font-bold text-muted">
                    {index + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] font-semibold text-ink">{hotel.propertyName}</p>
                    <p className="text-xs text-muted">
                      {hotel.city} · {hotel.rooms} rooms
                    </p>
                  </div>
                  <div className="w-32 shrink-0">
                    <ScoreBar value={hotel.occupancy} />
                  </div>
                </Link>
              </li>
            )}
          </ul>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader title="Demand by hour" subtitle="Bookings created per four-hour slot" />
            <ul className="divide-y divide-line">
              {peakHours.map((slot) =>
              <li key={slot.label} className="flex items-center gap-3 px-5 py-3">
                  <span className="w-16 shrink-0 text-[13px] font-semibold text-ink">{slot.label}</span>
                  <div className="flex-1">
                    <ScoreBar value={Math.round(slot.bookings / peakHours[0].bookings * 100)} showLabel={false} />
                  </div>
                  <span className="w-16 shrink-0 text-right text-[13px] tabular-nums text-muted">
                    {formatNumber(slot.bookings)}
                  </span>
                </li>
              )}
            </ul>
          </Card>

          <Card>
            <CardHeader title="City demand state" subtitle="Occupancy against the city target" />
            <ul className="divide-y divide-line">
              {cityOccupancy.map((city) =>
              <li key={city.city}>
                  <Link
                  to={`/os/city-intelligence?city=${encodeURIComponent(city.city)}`}
                  className="flex items-center gap-3 px-5 py-3 transition-colors duration-150 ease-smooth hover:bg-faint">
                  
                    <div className="min-w-0 flex-1">
                      <p className="text-[13px] font-semibold text-ink">{city.city}</p>
                      <p className="text-xs text-muted">
                        {city.liveHotels} of {city.hotels} hotels live · target {city.target}%
                      </p>
                    </div>
                    <span className="text-[13px] font-semibold tabular-nums text-ink">{city.occupancy}%</span>
                    <Badge tone={demandTone[city.demand]}>{city.demand}</Badge>
                  </Link>
                </li>
              )}
            </ul>
          </Card>
        </div>
      </div>
    </div>);

}