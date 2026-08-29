import React, { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Card, CardHeader } from '../../components/ui/Card';
import { PageHeader } from '../../components/ui/PageHeader';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Select } from '../../components/ui/Field';
import { DataTable, type Column } from '../../components/ui/DataTable';
import { MetricTile, ScoreBar, ExportMenu } from '../../components/adminos/OsPrimitives';
import { RevenueAreaChart } from '../../components/charts/Charts';
import { revenueByCity } from '../../data/adminos/intelligence';
import { revenueTrend } from '../../data/analytics';
import { useAdminOs } from '../../contexts/AdminOsContext';
import { liveCityOccupancy } from '../../services/adminos/selectors';
import { formatCurrency, formatNumber } from '../../utils/format';

interface CityRow {
  city: string;
  hotels: number;
  live: number;
  paused: number;
  offline: number;
  occupancy: number;
  gross: number;
  extension: number;
  bookings: number;
  newCustomers: number;
  repeatCustomers: number;
  refunds: number;
  settlements: number;
}

const periods = ['This month', 'Last month', 'This quarter'];

export function CityIntelligence() {
  const { state } = useAdminOs();
  const [params] = useSearchParams();
  const [period, setPeriod] = useState('This month');
  const focusCity = params.get('city');

  /** Per-city rollup built from live visibility, settlements, and extensions. */
  const cityRows = useMemo<CityRow[]>(() => {
    const cities = liveCityOccupancy(state);
    return cities.map((city, index) => {
      const revenue = revenueByCity.find((row) => row.label === city.city);
      const local = state.visibility.filter((hotel) => hotel.city === city.city);
      const settlements = state.settlements.filter((row) => row.city === city.city);
      const extension = state.extensions.
      filter((row) => row.city === city.city && row.status === 'Approved').
      reduce((sum, row) => sum + row.revenue, 0);
      const gross = settlements.reduce((sum, row) => sum + row.gross, 0) + extension || revenue?.gross || 0;
      return {
        city: city.city,
        hotels: local.length || city.hotels,
        live: local.filter((hotel) => hotel.state === 'Live').length,
        paused: local.filter((hotel) => hotel.state === 'Paused').length,
        offline: local.filter((hotel) => hotel.state === 'Offline' || hotel.state === 'Vacation').length,
        occupancy: city.occupancy,
        gross,
        extension,
        bookings: 1200 + index * 640,
        newCustomers: 820 + index * 310,
        repeatCustomers: 640 + index * 210,
        refunds: Math.round(gross * 0.027),
        settlements: settlements.reduce((sum, row) => sum + row.net, 0) || revenue?.net || 0
      };
    });
  }, [state]);

  const visibleRows = useMemo(
    () => focusCity ? cityRows.filter((row) => row.city === focusCity) : cityRows,
    [cityRows, focusCity]
  );

  const totals = cityRows.reduce(
    (acc, row) => ({
      hotels: acc.hotels + row.hotels,
      live: acc.live + row.live,
      paused: acc.paused + row.paused,
      offline: acc.offline + row.offline,
      gross: acc.gross + row.gross,
      extension: acc.extension + row.extension,
      bookings: acc.bookings + row.bookings,
      newCustomers: acc.newCustomers + row.newCustomers,
      repeatCustomers: acc.repeatCustomers + row.repeatCustomers,
      refunds: acc.refunds + row.refunds,
      settlements: acc.settlements + row.settlements
    }),
    { hotels: 0, live: 0, paused: 0, offline: 0, gross: 0, extension: 0, bookings: 0, newCustomers: 0, repeatCustomers: 0, refunds: 0, settlements: 0 }
  );

  const columns: Column<CityRow>[] = [
  {
    key: 'city',
    header: 'City',
    render: (row) =>
    <div>
          <p className="text-[13px] font-semibold text-ink">{row.city}</p>
          <p className="text-xs text-muted">{row.hotels} hotels</p>
        </div>,

    sortValue: (row) => row.city
  },
  {
    key: 'supply',
    header: 'Supply',
    render: (row) =>
    <span className="text-[13px] text-muted">
          <span className="text-positive">{row.live} live</span> · {row.paused} paused · {row.offline} offline
        </span>,

    sortValue: (row) => row.live,
    hideBelow: 'md'
  },
  {
    key: 'occupancy',
    header: 'Occupancy',
    render: (row) =>
    <div className="w-24">
          <ScoreBar value={row.occupancy} />
        </div>,

    sortValue: (row) => row.occupancy
  },
  {
    key: 'gross',
    header: 'Gross revenue',
    align: 'right',
    render: (row) => <span className="font-semibold tabular-nums text-[13px]">{formatCurrency(row.gross, true)}</span>,
    sortValue: (row) => row.gross
  },
  {
    key: 'extension',
    header: 'Extension',
    align: 'right',
    render: (row) => <span className="tabular-nums text-[13px] text-muted">{formatCurrency(row.extension, true)}</span>,
    sortValue: (row) => row.extension,
    hideBelow: 'lg'
  },
  {
    key: 'bookings',
    header: 'Bookings',
    align: 'right',
    render: (row) => <span className="tabular-nums text-[13px]">{formatNumber(row.bookings)}</span>,
    sortValue: (row) => row.bookings,
    hideBelow: 'sm'
  },
  {
    key: 'customers',
    header: 'New / repeat',
    align: 'right',
    render: (row) =>
    <span className="tabular-nums text-[13px] text-muted">
          {formatNumber(row.newCustomers)} / {formatNumber(row.repeatCustomers)}
        </span>,

    sortValue: (row) => row.newCustomers,
    hideBelow: 'xl'
  },
  {
    key: 'settlements',
    header: 'Settlements',
    align: 'right',
    render: (row) => <span className="tabular-nums text-[13px]">{formatCurrency(row.settlements, true)}</span>,
    sortValue: (row) => row.settlements,
    hideBelow: 'xl'
  }];


  return (
    <div>
      <PageHeader
        title="Multi-city business intelligence"
        subtitle="One row per city — supply, demand, revenue, customers, and settlements together."
        actions={
        <div className="flex gap-2">
            <Select options={periods} value={period} onChange={(event) => setPeriod(event.target.value)} aria-label="Reporting period" />
            <ExportMenu
            title="City scorecard"
            subtitle={period}
            entity="City"
            rows={visibleRows}
            columns={[
            { header: 'City', value: (row: CityRow) => row.city },
            { header: 'Hotels', value: (row: CityRow) => row.hotels },
            { header: 'Live', value: (row: CityRow) => row.live },
            { header: 'Paused', value: (row: CityRow) => row.paused },
            { header: 'Offline', value: (row: CityRow) => row.offline },
            { header: 'Occupancy %', value: (row: CityRow) => row.occupancy },
            { header: 'Gross revenue', value: (row: CityRow) => row.gross },
            { header: 'Extension revenue', value: (row: CityRow) => row.extension },
            { header: 'Bookings', value: (row: CityRow) => row.bookings },
            { header: 'New customers', value: (row: CityRow) => row.newCustomers },
            { header: 'Repeat customers', value: (row: CityRow) => row.repeatCustomers },
            { header: 'Refunds', value: (row: CityRow) => row.refunds },
            { header: 'Settlements', value: (row: CityRow) => row.settlements }]
            } />
          
          </div>
        } />
      

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <MetricTile label="Gross revenue" value={formatCurrency(totals.gross, true)} hint={`${period.toLowerCase()}, all cities`} tone="accent" />
        <MetricTile label="Extension revenue" value={formatCurrency(totals.extension, true)} hint="9.4% of gross" />
        <MetricTile label="Bookings" value={formatNumber(totals.bookings)} hint={`${formatNumber(totals.newCustomers)} new customers`} />
        <MetricTile label="Settlements" value={formatCurrency(totals.settlements, true)} hint={`refunds ${formatCurrency(totals.refunds, true)}`} />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader title="Platform revenue" subtitle="Daily gross, all cities combined" />
          <div className="px-2 py-4">
            <RevenueAreaChart data={revenueTrend} height={240} />
          </div>
        </Card>
        <Card>
          <CardHeader title="Supply health" subtitle="Marketplace-wide hotel states" />
          <ul className="divide-y divide-line">
            {[
            { label: 'Total hotels', value: totals.hotels, tone: 'text-ink' },
            { label: 'Live', value: totals.live, tone: 'text-positive' },
            { label: 'Paused', value: totals.paused, tone: 'text-warning' },
            { label: 'Offline / vacation', value: totals.offline, tone: 'text-negative' }].
            map((row) =>
            <li key={row.label} className="flex items-center gap-3 px-5 py-4">
                <span className="text-[13px] text-ink">{row.label}</span>
                <span className={`ml-auto text-lg font-bold tabular-nums ${row.tone}`}>{row.value}</span>
              </li>
            )}
          </ul>
        </Card>
      </div>

      <Card className="mt-4">
        <CardHeader
          title="City scorecard"
          subtitle={focusCity ? `Filtered to ${focusCity}` : 'Sortable on every KPI'}
          action={
          focusCity ?
          <Link to="/os/city-intelligence">
                <Button size="sm" variant="ghost">
                  Show all cities
                </Button>
              </Link> :
          null
          } />
        
        <DataTable columns={columns} rows={visibleRows} rowKey={(row) => row.city} pageSize={10} />
      </Card>

      <Card className="mt-4">
        <CardHeader title="Expansion watchlist" subtitle="Demand signals from cities with little or no supply" />
        <ul className="divide-y divide-line">
          {[
          { city: 'Coimbatore', signal: 'Searches up 34% over 8 weeks', supply: '2 hotels listed', priority: 'High' },
          { city: 'Kochi', signal: 'Searches up 21% over 8 weeks', supply: '3 hotels listed', priority: 'High' },
          { city: 'Pune', signal: 'Business-traveller demand up 17%', supply: '5 hotels listed', priority: 'Medium' },
          { city: 'Ahmedabad', signal: 'Layover demand up 12%', supply: '1 hotel listed', priority: 'Medium' }].
          map((row) =>
          <li key={row.city} className="flex flex-wrap items-center gap-3 px-5 py-3.5">
              <div className="min-w-0 flex-1">
                <p className="text-[13px] font-semibold text-ink">{row.city}</p>
                <p className="text-xs text-muted">
                  {row.signal} · {row.supply}
                </p>
              </div>
              <Badge tone={row.priority === 'High' ? 'warning' : 'neutral'}>{row.priority} priority</Badge>
              <Link to="/os/compliance?tab=Onboarding">
                <Button size="sm">Open onboarding</Button>
              </Link>
            </li>
          )}
        </ul>
      </Card>
    </div>);

}