import React, { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { AlertTriangleIcon, HistoryIcon } from 'lucide-react';
import { Card, CardHeader } from '../../components/ui/Card';
import { PageHeader, Toolbar } from '../../components/ui/PageHeader';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { SearchInput, Select } from '../../components/ui/Field';
import { Tabs } from '../../components/ui/Tabs';
import { DataTable, type Column } from '../../components/ui/DataTable';
import { NameCell, StackedCell, RowActions } from '../../components/ui/Cells';
import { MetricTile, StatusPill, ExportMenu, ReasonDialog } from '../../components/adminos/OsPrimitives';
import { useAdminOs } from '../../contexts/AdminOsContext';
import { supplyTotals } from '../../services/adminos/selectors';
import type { HotelVisibility, VisibilityLog, VisibilityState } from '../../data/adminos/hotelStatus';

const tabs = ['All', 'Live', 'Paused', 'Offline', 'Vacation'];

const reasonsFor: Record<VisibilityState, string[]> = {
  Live: ['Partner confirmed the property is operational', 'Maintenance completed', 'Compliance documents cleared'],
  Paused: ['Partner requested a temporary pause', 'Inventory sync failure', 'Staffing shortage at the property'],
  Offline: ['No response from the property desk', 'Repeated guest complaints', 'Compliance documents expired'],
  Vacation: ['Seasonal closure declared by the partner', 'Renovation period', 'Owner-declared long break']
};

export function HotelStatusCenter() {
  const { state, run } = useAdminOs();
  const [params, setParams] = useSearchParams();

  const [tab, setTab] = useState(params.get('state') ?? 'All');
  const [query, setQuery] = useState(params.get('q') ?? '');
  const [city, setCity] = useState('All cities');
  const [pending, setPending] = useState<{hotel: HotelVisibility;to: VisibilityState;} | null>(null);

  const hotels = state.visibility;
  const supply = supplyTotals(state);

  const cities = useMemo(() => ['All cities', ...Array.from(new Set(hotels.map((hotel) => hotel.city)))], [hotels]);

  const counts = useMemo(() => {
    const result: Record<string, number> = { All: hotels.length };
    tabs.slice(1).forEach((visibility) => {
      result[visibility] = hotels.filter((hotel) => hotel.state === visibility).length;
    });
    return result;
  }, [hotels]);

  const rows = useMemo(
    () =>
    hotels.filter((hotel) => {
      if (tab !== 'All' && hotel.state !== tab) return false;
      if (city !== 'All cities' && hotel.city !== city) return false;
      if (!query) return true;
      const needle = query.toLowerCase();
      return (
        hotel.propertyName.toLowerCase().includes(needle) ||
        hotel.partnerName.toLowerCase().includes(needle) ||
        hotel.city.toLowerCase().includes(needle));

    }),
    [hotels, tab, city, query]
  );

  const alerts = useMemo(
    () =>
    hotels.
    filter((hotel) => hotel.state !== 'Live').
    map((hotel) => {
      if (hotel.state === 'Offline' && hotel.days >= 7) {
        return {
          id: hotel.propertyId,
          severity: 'High' as const,
          hotel,
          title: `Offline for ${hotel.days} days`,
          detail: 'Exceeds the 7-day offline threshold — inventory is invisible to guests.'
        };
      }
      if (hotel.pauses30d >= 4) {
        return {
          id: hotel.propertyId,
          severity: 'Medium' as const,
          hotel,
          title: `${hotel.pauses30d} pauses in 30 days`,
          detail: 'Frequent pausing suggests staffing or inventory sync problems.'
        };
      }
      return {
        id: hotel.propertyId,
        severity: 'Medium' as const,
        hotel,
        title: `${hotel.state} for ${hotel.days} days`,
        detail: 'Long absence from the marketplace — confirm the reopening date with the partner.'
      };
    }),
    [hotels]
  );

  function updateTab(next: string) {
    setTab(next);
    const nextParams = new URLSearchParams(params);
    if (next === 'All') nextParams.delete('state');else
    nextParams.set('state', next);
    setParams(nextParams, { replace: true });
  }

  const columns: Column<HotelVisibility>[] = [
  {
    key: 'hotel',
    header: 'Hotel',
    render: (row) =>
    <Link to={`/properties/${row.propertyId}`} className="hover:underline">
          <NameCell primary={row.propertyName} secondary={`${row.city} · ${row.partnerName}`} />
        </Link>,

    sortValue: (row) => row.propertyName
  },
  { key: 'state', header: 'Visibility', render: (row) => <StatusPill state={row.state} />, sortValue: (row) => row.state },
  {
    key: 'since',
    header: 'Since',
    render: (row) => <StackedCell primary={row.since} secondary={row.days ? `${row.days} days` : 'Currently bookable'} />,
    sortValue: (row) => row.days,
    hideBelow: 'md'
  },
  {
    key: 'pauses',
    header: 'Pauses (30d)',
    align: 'right',
    render: (row) =>
    <span className={`text-[13px] font-semibold tabular-nums ${row.pauses30d >= 4 ? 'text-warning' : 'text-ink'}`}>
          {row.pauses30d}
        </span>,

    sortValue: (row) => row.pauses30d,
    hideBelow: 'lg'
  },
  {
    key: 'reason',
    header: 'Reason',
    render: (row) => <span className="text-[13px] text-muted">{row.reason}</span>,
    hideBelow: 'xl'
  },
  {
    key: 'actions',
    header: '',
    align: 'right',
    render: (row) =>
    <RowActions
      actions={[
      { label: 'Force online', onSelect: () => setPending({ hotel: row, to: 'Live' }) },
      { label: 'Pause hotel', onSelect: () => setPending({ hotel: row, to: 'Paused' }) },
      { label: 'Force offline', onSelect: () => setPending({ hotel: row, to: 'Offline' }) },
      { label: 'Set vacation mode', onSelect: () => setPending({ hotel: row, to: 'Vacation' }) }]
      } />


  }];


  const logColumns: Column<VisibilityLog>[] = [
  {
    key: 'hotel',
    header: 'Hotel',
    render: (row) => <span className="text-[13px] font-medium text-ink">{row.propertyName}</span>,
    sortValue: (row) => row.propertyName
  },
  {
    key: 'change',
    header: 'Change',
    render: (row) =>
    <span className="flex items-center gap-2">
          <StatusPill state={row.from} />
          <span className="text-muted">→</span>
          <StatusPill state={row.to} />
        </span>

  },
  {
    key: 'by',
    header: 'Changed by',
    render: (row) => <span className="text-[13px] text-muted">{row.changedBy}</span>,
    sortValue: (row) => row.changedBy,
    hideBelow: 'md'
  },
  {
    key: 'duration',
    header: 'Previous duration',
    render: (row) => <span className="text-[13px] text-muted">{row.duration}</span>,
    hideBelow: 'lg'
  },
  {
    key: 'at',
    header: 'When',
    align: 'right',
    render: (row) => <span className="text-[13px] text-muted">{row.at}</span>,
    sortValue: (row) => row.at
  }];


  return (
    <div>
      <PageHeader
        title="Hotel status monitoring"
        subtitle="Marketplace visibility for every property, with the full change history and threshold alerts."
        actions={
        <ExportMenu
          title="Hotel visibility"
          entity="Hotel"
          rows={rows}
          columns={[
          { header: 'Hotel', value: (row: HotelVisibility) => row.propertyName },
          { header: 'City', value: (row: HotelVisibility) => row.city },
          { header: 'Partner', value: (row: HotelVisibility) => row.partnerName },
          { header: 'Visibility', value: (row: HotelVisibility) => row.state },
          { header: 'Since', value: (row: HotelVisibility) => row.since },
          { header: 'Days', value: (row: HotelVisibility) => row.days },
          { header: 'Pauses 30d', value: (row: HotelVisibility) => row.pauses30d },
          { header: 'Reason', value: (row: HotelVisibility) => row.reason }]
          } />

        } />
      

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <MetricTile label="🟢 Live" value={String(supply.live)} hint="accepting bookings" tone="positive" onClick={() => updateTab('Live')} />
        <MetricTile label="🟡 Paused" value={String(supply.paused)} hint="temporarily hidden" tone="warning" onClick={() => updateTab('Paused')} />
        <MetricTile label="🔴 Offline" value={String(supply.offline)} hint="unreachable or withdrawn" tone="negative" onClick={() => updateTab('Offline')} />
        <MetricTile label="🟠 Vacation mode" value={String(supply.vacation)} hint="seasonal closure" onClick={() => updateTab('Vacation')} />
      </div>

      {alerts.length ?
      <Card className="mt-4 border-warning/50">
          <CardHeader title="Admin alerts" subtitle="Thresholds breached on visibility" />
          <ul className="divide-y divide-line">
            {alerts.map((alert) =>
          <li key={`${alert.id}-${alert.title}`} className="flex flex-wrap items-start gap-3 px-5 py-3.5">
                <AlertTriangleIcon
              className={`mt-0.5 h-4 w-4 shrink-0 ${alert.severity === 'High' ? 'text-negative' : 'text-warning'}`} />
            
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] font-semibold text-ink">
                    {alert.hotel.propertyName} — {alert.title}
                  </p>
                  <p className="text-xs text-muted">
                    {alert.hotel.city} · {alert.detail}
                  </p>
                </div>
                <Button size="sm" onClick={() => setPending({ hotel: alert.hotel, to: 'Live' })}>
                  Restore
                </Button>
                <Badge tone={alert.severity === 'High' ? 'negative' : 'warning'}>{alert.severity}</Badge>
              </li>
          )}
          </ul>
        </Card> :
      null}

      <Card className="mt-4">
        <Tabs tabs={tabs} value={tab} onChange={updateTab} counts={counts} />
        <Toolbar>
          <SearchInput
            className="sm:max-w-xs sm:flex-1"
            placeholder="Search hotel, partner, city…"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            aria-label="Search hotels" />
          
          <div className="sm:ml-auto">
            <Select options={cities} value={city} onChange={(event) => setCity(event.target.value)} aria-label="Filter by city" />
          </div>
        </Toolbar>
        <DataTable columns={columns} rows={rows} rowKey={(row) => row.propertyId} pageSize={10} emptyLabel="No hotels match these filters" />
      </Card>

      <Card className="mt-4">
        <CardHeader
          title="Visibility audit trail"
          subtitle="Every status change, who made it, and how long the previous state lasted"
          action={<HistoryIcon className="h-4 w-4 text-muted" />} />
        
        <DataTable columns={logColumns} rows={state.visibilityLogs} rowKey={(row) => row.id} pageSize={10} />
      </Card>

      <ReasonDialog
        open={Boolean(pending)}
        onClose={() => setPending(null)}
        title={pending ? `Set ${pending.hotel.propertyName} → ${pending.to}` : ''}
        description={
        pending?.to === 'Live' ?
        'Restores search visibility and enables new bookings immediately.' :
        'New bookings are disabled. Confirmed stays are preserved and guests are unaffected.'
        }
        reasons={pending ? reasonsFor[pending.to] : undefined}
        confirmLabel={pending ? `Set ${pending.to}` : 'Confirm'}
        danger={pending?.to === 'Offline'}
        onConfirm={(reason) => {
          if (!pending) return;
          run(
            { type: 'visibility.set', propertyId: pending.hotel.propertyId, to: pending.to, reason },
            { permission: 'Hotel Status', success: `${pending.hotel.propertyName} is now ${pending.to}` }
          );
        }} />
      
    </div>);

}