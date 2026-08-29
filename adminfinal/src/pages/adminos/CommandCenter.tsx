import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertTriangleIcon,
  ArrowRightIcon,
  CalendarPlusIcon,
  CheckCircle2Icon,
  ClockIcon,
  LogInIcon,
  LogOutIcon,
  UndoIcon,
  XCircleIcon } from
'lucide-react';
import { Card, CardHeader } from '../../components/ui/Card';
import { PageHeader } from '../../components/ui/PageHeader';
import { Toggle, Select } from '../../components/ui/Field';
import { MetricTile, LivePulse, ExportMenu } from '../../components/adminos/OsPrimitives';
import { liveEventKinds, type LiveEvent, type LiveEventKind } from '../../data/adminos/liveEvents';
import { useAdminOs } from '../../contexts/AdminOsContext';
import { formatCurrency } from '../../utils/format';
import { cn } from '../../utils/cn';

const kindIcon: Record<LiveEventKind, React.ComponentType<{className?: string;}>> = {
  'New Booking': CalendarPlusIcon,
  'Check-in': LogInIcon,
  'Check-out': LogOutIcon,
  'Extension Request': ClockIcon,
  'Extension Approved': CheckCircle2Icon,
  Cancellation: XCircleIcon,
  'Refund Request': UndoIcon,
  'Payment Failure': AlertTriangleIcon
};

const kindTone: Record<LiveEventKind, string> = {
  'New Booking': 'border-accent/50 bg-accent/15 text-ink',
  'Check-in': 'border-positive/30 bg-positive/10 text-positive',
  'Check-out': 'border-line bg-faint text-muted',
  'Extension Request': 'border-info/30 bg-info/10 text-info',
  'Extension Approved': 'border-positive/30 bg-positive/10 text-positive',
  Cancellation: 'border-negative/30 bg-negative/10 text-negative',
  'Refund Request': 'border-warning/30 bg-warning/10 text-warning',
  'Payment Failure': 'border-negative/30 bg-negative/10 text-negative'
};

/** Where each event kind opens its own record. */
function destinationFor(event: LiveEvent): string {
  switch (event.kind) {
    case 'New Booking':
    case 'Check-in':
    case 'Check-out':
      return `/bookings?q=${encodeURIComponent(event.reference)}`;
    case 'Extension Request':
    case 'Extension Approved':
      return `/os/extensions?q=${encodeURIComponent(event.reference)}`;
    case 'Cancellation':
      return `/bookings?status=Cancelled&q=${encodeURIComponent(event.reference)}`;
    case 'Refund Request':
      return `/os/disputes?kind=Refund&q=${encodeURIComponent(event.reference)}`;
    case 'Payment Failure':
      return `/os/risk?q=${encodeURIComponent(event.guestName)}`;
    default:
      return '/os/command-center';
  }
}

export function CommandCenter() {
  const { state, streaming, setStreaming } = useAdminOs();
  const navigate = useNavigate();
  const [filter, setFilter] = useState('All events');

  const events = state.events;

  const rows = useMemo(
    () => filter === 'All events' ? events : events.filter((event) => event.kind === filter),
    [events, filter]
  );

  const counts = useMemo(() => {
    const result: Record<string, number> = {};
    liveEventKinds.forEach((kind) => {
      result[kind] = events.filter((event) => event.kind === kind).length;
    });
    return result;
  }, [events]);

  const failures = counts['Payment Failure'] ?? 0;

  return (
    <div>
      <PageHeader
        title="Operations command center"
        subtitle="Every marketplace event as it happens. Select any row to open its record."
        actions={
        <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-2.5 rounded-lg border border-line bg-card px-3 py-1.5">
              <LivePulse />
              <span className="text-[13px] font-medium text-ink">{streaming ? 'Streaming' : 'Paused'}</span>
              <Toggle checked={streaming} onChange={setStreaming} label="Live stream" />
            </div>
            <ExportMenu
            title="Live operations feed"
            entity="Event"
            rows={rows}
            columns={[
            { header: 'Time', value: (row: LiveEvent) => row.at },
            { header: 'Event', value: (row: LiveEvent) => row.kind },
            { header: 'Reference', value: (row: LiveEvent) => row.reference },
            { header: 'Guest', value: (row: LiveEvent) => row.guestName },
            { header: 'Hotel', value: (row: LiveEvent) => row.propertyName },
            { header: 'City', value: (row: LiveEvent) => row.city },
            { header: 'Amount', value: (row: LiveEvent) => row.amount }]
            } />
          
          </div>
        } />
      

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <MetricTile label="Events in session" value={String(events.length)} hint="rolling window of 80" tone="accent" live={streaming} />
        <MetricTile
          label="New bookings"
          value={String(counts['New Booking'] ?? 0)}
          hint="this session"
          onClick={() => setFilter('New Booking')} />
        
        <MetricTile
          label="Extension requests"
          value={String(counts['Extension Request'] ?? 0)}
          hint="awaiting hotel response"
          onClick={() => setFilter('Extension Request')} />
        
        <MetricTile
          label="Payment failures"
          value={String(failures)}
          hint={failures > 2 ? 'above the normal rate' : 'within normal range'}
          tone={failures > 2 ? 'negative' : 'default'}
          onClick={() => setFilter('Payment Failure')} />
        
      </div>

      <Card className="mt-4">
        <CardHeader
          title="Live event feed"
          subtitle="Newest first"
          action={
          <Select
            className="w-48"
            options={['All events', ...liveEventKinds]}
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
            aria-label="Filter events" />

          } />
        
        <ul className="max-h-[620px] divide-y divide-line overflow-y-auto">
          {rows.map((event, index) => {
            const Icon = kindIcon[event.kind];
            return (
              <li key={event.id}>
                <button
                  onClick={() => navigate(destinationFor(event))}
                  className={cn(
                    'flex w-full flex-wrap items-center gap-3 px-5 py-3 text-left transition-colors duration-150 ease-smooth hover:bg-faint',
                    index === 0 && streaming && 'bg-accent/[0.06]'
                  )}>
                  
                  <span
                    className={cn(
                      'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border',
                      kindTone[event.kind]
                    )}>
                    
                    <Icon className="h-4 w-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[13px] font-semibold text-ink">
                      {event.kind} · <span className="font-normal text-muted">{event.guestName}</span>
                    </p>
                    <p className="truncate text-xs text-muted">
                      {event.propertyName} · {event.city} · <span className="font-mono">{event.reference}</span>
                    </p>
                  </div>
                  <span className="text-[13px] font-semibold tabular-nums text-ink">{formatCurrency(event.amount)}</span>
                  <span className="w-20 shrink-0 text-right font-mono text-[11px] text-muted">{event.at}</span>
                  <ArrowRightIcon className="h-3.5 w-3.5 shrink-0 text-muted" />
                </button>
              </li>);

          })}
        </ul>
      </Card>
    </div>);

}