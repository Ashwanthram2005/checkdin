import React, { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CheckIcon, TimerOffIcon, XIcon, ZapIcon } from 'lucide-react';
import { Card, CardHeader } from '../../components/ui/Card';
import { PageHeader, Toolbar } from '../../components/ui/PageHeader';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { SearchInput, Select } from '../../components/ui/Field';
import { Tabs } from '../../components/ui/Tabs';
import { Modal } from '../../components/ui/Modal';
import { DataTable, type Column } from '../../components/ui/DataTable';
import { MonoCell, StackedCell } from '../../components/ui/Cells';
import { MetricTile, ExportMenu, ReasonDialog } from '../../components/adminos/OsPrimitives';
import { RevenueAreaChart } from '../../components/charts/Charts';
import { extensionTrend } from '../../data/adminos/extensions';
import { useAdminOs } from '../../contexts/AdminOsContext';
import { extensionPerformance, extensionTotals, type ExtensionPerformanceRow } from '../../services/adminos/selectors';
import type { ExtensionRecord } from '../../services/adminos/store';
import { formatCurrency } from '../../utils/format';

const tabs = ['All', 'Approved', 'Rejected', 'Expired', 'Pending'];
const typeOptions = ['All types', '1 hour', '3 hours', '6 hours', 'Full night'];
const dateOptions = ['Last 14 days', 'Last 7 days', 'Today'];

const rejectReasons = [
'Room already booked for the next slot',
'Housekeeping turnaround required',
'Guest exceeded the maximum stay',
'Payment authorisation failed'];


export function ExtensionCenter() {
  const { state, run } = useAdminOs();
  const [params, setParams] = useSearchParams();

  const [tab, setTab] = useState(params.get('status') ?? 'All');
  const [query, setQuery] = useState(params.get('q') ?? '');
  const [city, setCity] = useState('All cities');
  const [stateFilter, setStateFilter] = useState('All states');
  const [type, setType] = useState('All types');
  const [range, setRange] = useState('Last 14 days');
  const [viewing, setViewing] = useState<ExtensionRecord | null>(null);
  const [rejecting, setRejecting] = useState<ExtensionRecord | null>(null);

  const extensions = state.extensions;
  const totals = extensionTotals(extensions);
  const performance = extensionPerformance(extensions);

  const cities = useMemo(() => ['All cities', ...Array.from(new Set(extensions.map((row) => row.city)))], [extensions]);
  const states = useMemo(() => ['All states', ...Array.from(new Set(extensions.map((row) => row.state)))], [extensions]);

  const counts = useMemo(() => {
    const result: Record<string, number> = { All: extensions.length };
    tabs.slice(1).forEach((status) => {
      result[status] = extensions.filter((row) => row.status === status).length;
    });
    return result;
  }, [extensions]);

  const rows = useMemo(() => {
    const cutoffDay = range === 'Today' ? 19 : range === 'Last 7 days' ? 13 : 0;
    return extensions.filter((request) => {
      if (tab !== 'All' && request.status !== tab) return false;
      if (city !== 'All cities' && request.city !== city) return false;
      if (stateFilter !== 'All states' && request.state !== stateFilter) return false;
      if (type !== 'All types' && request.type !== type) return false;
      if (cutoffDay && Number(request.requestedDate.slice(-2)) < cutoffDay) return false;
      if (!query) return true;
      const needle = query.toLowerCase();
      return (
        request.id.toLowerCase().includes(needle) ||
        request.bookingId.toLowerCase().includes(needle) ||
        request.guestName.toLowerCase().includes(needle) ||
        request.propertyName.toLowerCase().includes(needle));

    });
  }, [extensions, tab, city, stateFilter, type, range, query]);

  function updateTab(next: string) {
    setTab(next);
    const nextParams = new URLSearchParams(params);
    if (next === 'All') nextParams.delete('status');else
    nextParams.set('status', next);
    setParams(nextParams, { replace: true });
  }

  const fastest = [...performance].sort((a, b) => a.avgResponseMinutes - b.avgResponseMinutes).slice(0, 4);
  const slowest = [...performance].sort((a, b) => b.avgResponseMinutes - a.avgResponseMinutes).slice(0, 4);
  const bestApproval = [...performance].sort((a, b) => b.approvalRate - a.approvalRate).slice(0, 4);
  const worstApproval = [...performance].sort((a, b) => a.approvalRate - b.approvalRate).slice(0, 4);

  const columns: Column<ExtensionRecord>[] = [
  {
    key: 'id',
    header: 'Request',
    render: (row) =>
    <div>
          <MonoCell>{row.id}</MonoCell>
          <p className="text-xs text-muted">{row.bookingId}</p>
        </div>,

    sortValue: (row) => row.id
  },
  {
    key: 'guest',
    header: 'Guest & hotel',
    render: (row) => <StackedCell primary={row.guestName} secondary={`${row.propertyName} · ${row.city}`} />,
    sortValue: (row) => row.guestName
  },
  { key: 'type', header: 'Type', render: (row) => <Badge tone="neutral">{row.type}</Badge>, sortValue: (row) => row.type, hideBelow: 'sm' },
  {
    key: 'requested',
    header: 'Requested',
    render: (row) => <span className="text-[13px] text-muted">{row.requestedAt}</span>,
    sortValue: (row) => row.requestedAt,
    hideBelow: 'lg'
  },
  {
    key: 'response',
    header: 'Response',
    align: 'right',
    render: (row) =>
    row.responseMinutes === null ?
    <span className="text-[13px] text-muted">—</span> :

    <span
      className={`text-[13px] font-semibold tabular-nums ${
      row.responseMinutes <= 10 ? 'text-positive' : row.responseMinutes >= 40 ? 'text-negative' : 'text-ink'}`
      }>
      
            {row.responseMinutes}m
          </span>,

    sortValue: (row) => row.responseMinutes ?? 999
  },
  {
    key: 'revenue',
    header: 'Revenue',
    align: 'right',
    render: (row) =>
    <span className="text-[13px] font-semibold tabular-nums text-ink">
          {row.revenue ? formatCurrency(row.revenue) : '—'}
        </span>,

    sortValue: (row) => row.revenue
  },
  { key: 'status', header: 'Status', render: (row) => <Badge>{row.status}</Badge>, sortValue: (row) => row.status },
  {
    key: 'actions',
    header: '',
    align: 'right',
    render: (row) =>
    <div className="flex justify-end gap-1.5">
          <Button size="sm" onClick={() => setViewing(row)}>
            View
          </Button>
          {row.status === 'Pending' ?
      <>
              <Button
          size="sm"
          variant="primary"
          icon={CheckIcon}
          onClick={() =>
          run(
            { type: 'extension.approve', id: row.id },
            { permission: 'Extensions', success: `Extension approved — checkout extended for ${row.guestName}` }
          )
          }>
          
                Approve
              </Button>
              <Button size="sm" variant="danger" icon={XIcon} onClick={() => setRejecting(row)}>
                Reject
              </Button>
            </> :
      null}
        </div>

  }];


  const exportColumns = [
  { header: 'Request ID', value: (row: ExtensionRecord) => row.id },
  { header: 'Booking', value: (row: ExtensionRecord) => row.bookingId },
  { header: 'Guest', value: (row: ExtensionRecord) => row.guestName },
  { header: 'Hotel', value: (row: ExtensionRecord) => row.propertyName },
  { header: 'City', value: (row: ExtensionRecord) => row.city },
  { header: 'State', value: (row: ExtensionRecord) => row.state },
  { header: 'Type', value: (row: ExtensionRecord) => row.type },
  { header: 'Requested at', value: (row: ExtensionRecord) => row.requestedAt },
  { header: 'Decided at', value: (row: ExtensionRecord) => row.decidedAt ?? '' },
  { header: 'Response minutes', value: (row: ExtensionRecord) => row.responseMinutes ?? '' },
  { header: 'Revenue', value: (row: ExtensionRecord) => row.revenue },
  { header: 'Status', value: (row: ExtensionRecord) => row.status },
  { header: 'Reason', value: (row: ExtensionRecord) => row.reason }];


  return (
    <div>
      <PageHeader
        title="Extension management center"
        subtitle="Every stay extension across the marketplace, with hotel response performance."
        actions={
        <ExportMenu
          title="Extension audit log"
          subtitle={`${rows.length} requests · ${tab} · ${range}`}
          entity="Extension"
          rows={rows}
          columns={exportColumns}
          label="Export audit log" />

        } />
      

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-5">
        <MetricTile label="Total requests" value={String(totals.total)} hint="last 14 days" tone="accent" onClick={() => updateTab('All')} />
        <MetricTile label="Approved" value={String(totals.approved)} hint={`${totals.approvalRate}% approval rate`} onClick={() => updateTab('Approved')} />
        <MetricTile label="Rejected" value={String(totals.rejected)} tone="warning" hint="guest asked to vacate" onClick={() => updateTab('Rejected')} />
        <MetricTile label="Expired" value={String(totals.expired)} tone="negative" hint="no hotel response in 60m" onClick={() => updateTab('Expired')} />
        <MetricTile label="Extension revenue" value={formatCurrency(totals.revenue, true)} hint={`avg response ${totals.avgResponseMinutes}m`} to="/os/revenue-intelligence" />
      </div>

      <Card className="mt-4">
        <CardHeader title="Extension revenue trend" subtitle="Daily, last 14 days" />
        <div className="px-2 py-4">
          <RevenueAreaChart data={extensionTrend} height={220} />
        </div>
      </Card>

      <Card className="mt-4">
        <Tabs tabs={tabs} value={tab} onChange={updateTab} counts={counts} />
        <Toolbar>
          <SearchInput
            className="sm:max-w-xs sm:flex-1"
            placeholder="Search request, booking, guest, hotel…"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            aria-label="Search extension requests" />
          
          <div className="flex flex-wrap gap-2 sm:ml-auto">
            <Select options={cities} value={city} onChange={(event) => setCity(event.target.value)} aria-label="Filter by city" />
            <Select options={states} value={stateFilter} onChange={(event) => setStateFilter(event.target.value)} aria-label="Filter by state" />
            <Select options={typeOptions} value={type} onChange={(event) => setType(event.target.value)} aria-label="Filter by extension type" />
            <Select options={dateOptions} value={range} onChange={(event) => setRange(event.target.value)} aria-label="Filter by date range" />
          </div>
        </Toolbar>
        <DataTable columns={columns} rows={rows} rowKey={(row) => row.id} pageSize={10} emptyLabel="No extension requests match these filters" />
      </Card>

      <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-2">
        {[
        { title: 'Fastest responders', subtitle: 'Average decision time', rows: fastest, metric: (row: ExtensionPerformanceRow) => `${row.avgResponseMinutes}m`, tone: 'text-positive' },
        { title: 'Slowest responders', subtitle: 'Average decision time', rows: slowest, metric: (row: ExtensionPerformanceRow) => `${row.avgResponseMinutes}m`, tone: 'text-negative' },
        { title: 'Highest approval rate', subtitle: 'Share of requests approved', rows: bestApproval, metric: (row: ExtensionPerformanceRow) => `${row.approvalRate}%`, tone: 'text-positive' },
        { title: 'Lowest approval rate', subtitle: 'Share of requests approved', rows: worstApproval, metric: (row: ExtensionPerformanceRow) => `${row.approvalRate}%`, tone: 'text-negative' }].
        map((panel) =>
        <Card key={panel.title}>
            <CardHeader title={panel.title} subtitle={`${panel.subtitle} · recalculated from live decisions`} />
            <ul className="divide-y divide-line">
              {panel.rows.map((row, index) =>
            <li key={row.propertyId}>
                  <button
                onClick={() => {
                  setQuery(row.propertyName);
                  updateTab('All');
                }}
                className="flex w-full items-center gap-3 px-5 py-3.5 text-left transition-colors duration-150 ease-smooth hover:bg-faint">
                
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-faint text-[11px] font-bold text-muted">
                      {index + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[13px] font-semibold text-ink">{row.propertyName}</p>
                      <p className="text-xs text-muted">
                        {row.city} · {row.requests} requests
                      </p>
                    </div>
                    <span className={`text-sm font-bold tabular-nums ${panel.tone}`}>{panel.metric(row)}</span>
                  </button>
                </li>
            )}
            </ul>
          </Card>
        )}
      </div>

      <Card className="mt-4">
        <CardHeader title="Why extensions matter" subtitle="Marketplace context" />
        <div className="flex items-start gap-3 px-5 py-4">
          <ZapIcon className="mt-0.5 h-4 w-4 shrink-0 text-muted" />
          <p className="text-[13px] leading-relaxed text-muted">
            Extension revenue carries no acquisition cost and lifts occupancy without new inventory. Requests left
            unanswered for 60 minutes are expired automatically by the SLA worker, the guest is notified, and the
            hotel's response metrics are updated.
          </p>
        </div>
      </Card>

      <Modal
        open={Boolean(viewing)}
        onClose={() => setViewing(null)}
        title={`Extension ${viewing?.id ?? ''}`}
        description={viewing ? `${viewing.guestName} · ${viewing.propertyName}` : undefined}
        footer={
        viewing?.status === 'Pending' ?
        <>
              <Button
            icon={TimerOffIcon}
            onClick={() => {
              run({ type: 'extension.expire', id: viewing.id }, { success: 'Request expired and guest notified' });
              setViewing(null);
            }}>
            
                Expire now
              </Button>
              <Button
            variant="danger"
            icon={XIcon}
            onClick={() => {
              setRejecting(viewing);
              setViewing(null);
            }}>
            
                Reject
              </Button>
              <Button
            variant="primary"
            icon={CheckIcon}
            onClick={() => {
              run(
                { type: 'extension.approve', id: viewing.id },
                { permission: 'Extensions', success: 'Extension approved and checkout time updated' }
              );
              setViewing(null);
            }}>
            
                Approve extension
              </Button>
            </> :

        <Button onClick={() => setViewing(null)}>Close</Button>

        }>
        
        {viewing ?
        <dl className="grid grid-cols-2 gap-x-6 gap-y-4">
            {[
          { label: 'Booking', value: viewing.bookingId },
          { label: 'Guest', value: viewing.guestName },
          { label: 'Hotel', value: `${viewing.propertyName} · ${viewing.city}` },
          { label: 'Extension type', value: viewing.type },
          { label: 'Requested at', value: viewing.requestedAt },
          { label: 'Decided at', value: viewing.decidedAt ?? 'Awaiting hotel' },
          { label: 'Response time', value: viewing.responseMinutes === null ? '—' : `${viewing.responseMinutes} minutes` },
          { label: 'Revenue recorded', value: viewing.revenue ? formatCurrency(viewing.revenue) : '—' },
          { label: 'Checkout shift', value: viewing.checkoutShiftHours ? `+${viewing.checkoutShiftHours} hours` : '—' },
          { label: 'Status', value: viewing.status }].
          map((item) =>
          <div key={item.label}>
                <dt className="text-[11px] font-semibold uppercase tracking-wider text-muted">{item.label}</dt>
                <dd className="mt-1 text-sm font-medium text-ink">{item.value}</dd>
              </div>
          )}
            {viewing.reason ?
          <div className="col-span-2">
                <dt className="text-[11px] font-semibold uppercase tracking-wider text-muted">Recorded reason</dt>
                <dd className="mt-1 text-sm text-muted">{viewing.reason}</dd>
              </div> :
          null}
          </dl> :
        null}
      </Modal>

      <ReasonDialog
        open={Boolean(rejecting)}
        onClose={() => setRejecting(null)}
        title={`Reject extension ${rejecting?.id ?? ''}`}
        description="The guest is notified immediately and the hotel's approval rate is recalculated."
        reasons={rejectReasons}
        confirmLabel="Reject extension"
        danger
        onConfirm={(reason) => {
          if (!rejecting) return;
          run(
            { type: 'extension.reject', id: rejecting.id, reason },
            { permission: 'Extensions', success: 'Extension rejected and guest notified' }
          );
        }} />
      
    </div>);

}