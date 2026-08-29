import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader } from '../../components/ui/Card';
import { PageHeader, Toolbar } from '../../components/ui/PageHeader';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { SearchInput, Select } from '../../components/ui/Field';
import { Modal } from '../../components/ui/Modal';
import { DataTable, type Column } from '../../components/ui/DataTable';
import { NameCell } from '../../components/ui/Cells';
import { MetricTile, ScoreBar, ExportMenu } from '../../components/adminos/OsPrimitives';
import { useAdminOs } from '../../contexts/AdminOsContext';
import { hotelHealth, type HotelHealthRow } from '../../services/adminos/selectors';
import { formatCurrency } from '../../utils/format';

export function PartnerPerformance() {
  const { state } = useAdminOs();
  const [query, setQuery] = useState('');
  const [city, setCity] = useState('All cities');
  const [breakdown, setBreakdown] = useState<HotelHealthRow | null>(null);

  const health = useMemo(() => hotelHealth(state), [state]);

  const cities = useMemo(() => ['All cities', ...Array.from(new Set(health.map((row) => row.city)))], [health]);

  const rows = useMemo(
    () =>
    health.filter((hotel) => {
      if (city !== 'All cities' && hotel.city !== city) return false;
      if (!query) return true;
      const needle = query.toLowerCase();
      return hotel.propertyName.toLowerCase().includes(needle) || hotel.partnerName.toLowerCase().includes(needle);
    }),
    [health, query, city]
  );

  const average = health.length ? Math.round(health.reduce((sum, hotel) => sum + hotel.score, 0) / health.length) : 0;
  const top = health.slice(0, 4);
  const bottom = [...health].slice(-4).reverse();
  const fastest = [...health].sort((a, b) => a.responseMinutes - b.responseMinutes).slice(0, 4);
  const revenueLeaders = [...health].sort((a, b) => b.revenue - a.revenue).slice(0, 4);

  const columns: Column<HotelHealthRow>[] = [
  {
    key: 'hotel',
    header: 'Hotel',
    render: (row) =>
    <Link to={`/properties/${row.propertyId}`} className="hover:underline">
          <NameCell primary={row.propertyName} secondary={`${row.city} · ${row.partnerName}`} />
        </Link>,

    sortValue: (row) => row.propertyName
  },
  {
    key: 'score',
    header: 'Health score',
    render: (row) =>
    <button onClick={() => setBreakdown(row)} className="w-32 text-left" aria-label={`Open score breakdown for ${row.propertyName}`}>
          <ScoreBar value={row.score} />
        </button>,

    sortValue: (row) => row.score
  },
  {
    key: 'occupancy',
    header: 'Occupancy',
    align: 'right',
    render: (row) => <span className="tabular-nums text-[13px]">{row.occupancy}%</span>,
    sortValue: (row) => row.occupancy,
    hideBelow: 'sm'
  },
  {
    key: 'rating',
    header: 'Rating',
    align: 'right',
    render: (row) => <span className="tabular-nums text-[13px]">{row.rating.toFixed(1)}★</span>,
    sortValue: (row) => row.rating,
    hideBelow: 'md'
  },
  {
    key: 'acceptance',
    header: 'Acceptance',
    align: 'right',
    render: (row) => <span className="tabular-nums text-[13px]">{row.acceptance}%</span>,
    sortValue: (row) => row.acceptance,
    hideBelow: 'lg'
  },
  {
    key: 'extension',
    header: 'Ext. approval',
    align: 'right',
    render: (row) => <span className="tabular-nums text-[13px]">{row.extensionApproval}%</span>,
    sortValue: (row) => row.extensionApproval,
    hideBelow: 'lg'
  },
  {
    key: 'response',
    header: 'Response',
    align: 'right',
    render: (row) =>
    <span
      className={`tabular-nums text-[13px] ${
      row.responseMinutes <= 12 ? 'text-positive' : row.responseMinutes >= 30 ? 'text-negative' : 'text-ink'}`
      }>
      
          {row.responseMinutes}m
        </span>,

    sortValue: (row) => row.responseMinutes,
    hideBelow: 'xl'
  },
  {
    key: 'band',
    header: 'Band',
    render: (row) =>
    <Badge tone={row.score >= 80 ? 'positive' : row.score >= 60 ? 'info' : row.score >= 45 ? 'warning' : 'negative'}>
          {row.score >= 80 ? 'Excellent' : row.score >= 60 ? 'Healthy' : row.score >= 45 ? 'At risk' : 'Critical'}
        </Badge>,

    sortValue: (row) => row.score
  },
  {
    key: 'actions',
    header: '',
    align: 'right',
    render: (row) =>
    <Button size="sm" onClick={() => setBreakdown(row)}>
          Breakdown
        </Button>

  }];


  const panels = [
  { title: 'Top performing hotels', subtitle: 'Highest health score', rows: top, metric: (row: HotelHealthRow) => String(row.score), to: (row: HotelHealthRow) => `/properties/${row.propertyId}` },
  { title: 'Lowest performing hotels', subtitle: 'Needs intervention', rows: bottom, metric: (row: HotelHealthRow) => String(row.score), to: (row: HotelHealthRow) => `/properties/${row.propertyId}` },
  { title: 'Fastest responders', subtitle: 'Average reply to guest requests', rows: fastest, metric: (row: HotelHealthRow) => `${row.responseMinutes}m`, to: (row: HotelHealthRow) => `/os/extensions?q=${encodeURIComponent(row.propertyName)}` },
  { title: 'Revenue leaders', subtitle: 'Gross booking value', rows: revenueLeaders, metric: (row: HotelHealthRow) => formatCurrency(row.revenue, true), to: () => '/os/revenue-intelligence' }];


  return (
    <div>
      <PageHeader
        title="Partner performance"
        subtitle="A single health score per hotel, recalculated from live occupancy, ratings, and extension behaviour."
        actions={
        <ExportMenu
          title="Partner health scores"
          entity="Hotel"
          rows={rows}
          columns={[
          { header: 'Hotel', value: (row: HotelHealthRow) => row.propertyName },
          { header: 'City', value: (row: HotelHealthRow) => row.city },
          { header: 'Partner', value: (row: HotelHealthRow) => row.partnerName },
          { header: 'Health score', value: (row: HotelHealthRow) => row.score },
          { header: 'Occupancy %', value: (row: HotelHealthRow) => row.occupancy },
          { header: 'Rating', value: (row: HotelHealthRow) => row.rating },
          { header: 'Acceptance %', value: (row: HotelHealthRow) => row.acceptance },
          { header: 'Extension approval %', value: (row: HotelHealthRow) => row.extensionApproval },
          { header: 'Response minutes', value: (row: HotelHealthRow) => row.responseMinutes },
          { header: 'Cancellation %', value: (row: HotelHealthRow) => row.cancellation },
          { header: 'Revenue', value: (row: HotelHealthRow) => row.revenue }]
          } />

        } />
      

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <MetricTile label="Average health score" value={String(average)} hint="across all live hotels" tone="accent" />
        <MetricTile label="Excellent (80+)" value={String(health.filter((h) => h.score >= 80).length)} tone="positive" hint="eligible for featured placement" />
        <MetricTile label="At risk (45–59)" value={String(health.filter((h) => h.score >= 45 && h.score < 60).length)} tone="warning" hint="needs a partner conversation" />
        <MetricTile label="Critical (<45)" value={String(health.filter((h) => h.score < 45).length)} tone="negative" hint="candidates for suspension" />
      </div>

      <Card className="mt-4">
        <CardHeader title="Hotel health scores" subtitle="Select any score to open its breakdown" />
        <Toolbar>
          <SearchInput
            className="sm:max-w-xs sm:flex-1"
            placeholder="Search hotel or partner…"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            aria-label="Search hotels" />
          
          <div className="sm:ml-auto">
            <Select options={cities} value={city} onChange={(event) => setCity(event.target.value)} aria-label="Filter by city" />
          </div>
        </Toolbar>
        <DataTable columns={columns} rows={rows} rowKey={(row) => row.propertyId} pageSize={10} emptyLabel="No hotels match these filters" />
      </Card>

      <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-2">
        {panels.map((panel) =>
        <Card key={panel.title}>
            <CardHeader title={panel.title} subtitle={panel.subtitle} />
            <ul className="divide-y divide-line">
              {panel.rows.map((row, index) =>
            <li key={row.propertyId}>
                  <Link
                to={panel.to(row)}
                className="flex items-center gap-3 px-5 py-3.5 transition-colors duration-150 ease-smooth hover:bg-faint">
                
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-faint text-[11px] font-bold text-muted">
                      {index + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[13px] font-semibold text-ink">{row.propertyName}</p>
                      <p className="text-xs text-muted">{row.city}</p>
                    </div>
                    <span className="text-sm font-bold tabular-nums text-ink">{panel.metric(row)}</span>
                  </Link>
                </li>
            )}
            </ul>
          </Card>
        )}
      </div>

      <Modal
        open={Boolean(breakdown)}
        onClose={() => setBreakdown(null)}
        title={`Score breakdown — ${breakdown?.propertyName ?? ''}`}
        description={breakdown ? `${breakdown.city} · ${breakdown.partnerName} · composite ${breakdown.score}/100` : undefined}
        footer={
        breakdown ?
        <>
              <Link to={`/os/extensions?q=${encodeURIComponent(breakdown.propertyName)}`}>
                <Button>Extension history</Button>
              </Link>
              <Link to={`/properties/${breakdown.propertyId}`}>
                <Button variant="primary">Open hotel</Button>
              </Link>
            </> :
        null
        }>
        
        {breakdown ?
        <ul className="divide-y divide-line rounded-xl border border-line">
            {breakdown.breakdown.map((factor) =>
          <li key={factor.label} className="flex items-center gap-3 px-4 py-3">
                <div className="w-40 shrink-0">
                  <p className="text-[13px] font-semibold text-ink">{factor.label}</p>
                  <p className="text-xs text-muted">weight {factor.weight}%</p>
                </div>
                <div className="flex-1">
                  <ScoreBar value={factor.value} showLabel={false} />
                </div>
                <span className="w-20 shrink-0 text-right text-[13px] font-semibold tabular-nums text-ink">
                  +{factor.contribution}
                </span>
              </li>
          )}
          </ul> :
        null}
      </Modal>
    </div>);

}