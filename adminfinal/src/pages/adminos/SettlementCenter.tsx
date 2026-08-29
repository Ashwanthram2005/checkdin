import React, { useMemo, useState } from 'react';
import { CalculatorIcon, UnlockIcon } from 'lucide-react';
import { Card, CardHeader } from '../../components/ui/Card';
import { PageHeader, Toolbar } from '../../components/ui/PageHeader';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { SearchInput, Select } from '../../components/ui/Field';
import { Tabs } from '../../components/ui/Tabs';
import { DataTable, type Column } from '../../components/ui/DataTable';
import { MonoCell, NameCell, RowActions, StackedCell } from '../../components/ui/Cells';
import { MetricTile, ExportMenu, ReasonDialog } from '../../components/adminos/OsPrimitives';
import { useAdminOs } from '../../contexts/AdminOsContext';
import type { SettlementRecord } from '../../services/adminos/store';
import { formatCurrency } from '../../utils/format';

const tabs = ['All', 'Pending', 'Processed', 'Failed', 'Upcoming', 'On Hold'];
const cycles = ['All cycles', '01–15 Aug 2026', '16–31 Aug 2026'];

const holdReasons = [
'Open dispute on bookings in this cycle',
'Bank details unverified',
'Compliance documents expired',
'Fraud investigation in progress'];


export function SettlementCenter() {
  const { state, run } = useAdminOs();
  const [tab, setTab] = useState('Pending');
  const [query, setQuery] = useState('');
  const [cycle, setCycle] = useState('All cycles');
  const [holding, setHolding] = useState<SettlementRecord | null>(null);
  const [recalculating, setRecalculating] = useState<SettlementRecord | null>(null);
  const [releasing, setReleasing] = useState<SettlementRecord | null>(null);
  const [releasingBatch, setReleasingBatch] = useState(false);

  const settlements = state.settlements;

  const counts = useMemo(() => {
    const result: Record<string, number> = { All: settlements.length };
    tabs.slice(1).forEach((status) => {
      result[status] = settlements.filter((row) => row.status === status).length;
    });
    return result;
  }, [settlements]);

  const rows = useMemo(
    () =>
    settlements.filter((row) => {
      if (tab !== 'All' && row.status !== tab) return false;
      if (cycle !== 'All cycles' && row.cycle !== cycle) return false;
      if (!query) return true;
      const needle = query.toLowerCase();
      return (
        row.reference.toLowerCase().includes(needle) ||
        row.propertyName.toLowerCase().includes(needle) ||
        row.partnerName.toLowerCase().includes(needle) ||
        (row.utr ?? '').toLowerCase().includes(needle));

    }),
    [settlements, tab, cycle, query]
  );

  function total(status: SettlementRecord['status']) {
    return settlements.filter((row) => row.status === status).reduce((sum, row) => sum + row.net, 0);
  }

  const columns: Column<SettlementRecord>[] = [
  {
    key: 'reference',
    header: 'Settlement',
    render: (row) =>
    <div>
          <MonoCell>{row.reference}</MonoCell>
          <p className="text-xs text-muted">{row.utr ? `${row.cycle} · ${row.utr}` : row.cycle}</p>
        </div>,

    sortValue: (row) => row.reference
  },
  {
    key: 'hotel',
    header: 'Hotel',
    render: (row) => <NameCell primary={row.propertyName} secondary={`${row.city} · ${row.partnerName}`} />,
    sortValue: (row) => row.propertyName
  },
  {
    key: 'gross',
    header: 'Gross',
    align: 'right',
    render: (row) => <span className="tabular-nums text-[13px]">{formatCurrency(row.gross)}</span>,
    sortValue: (row) => row.gross,
    hideBelow: 'md'
  },
  {
    key: 'commission',
    header: 'Commission',
    align: 'right',
    render: (row) => <span className="tabular-nums text-[13px] text-muted">−{formatCurrency(row.commission)}</span>,
    sortValue: (row) => row.commission,
    hideBelow: 'lg'
  },
  {
    key: 'gst',
    header: 'GST',
    align: 'right',
    render: (row) => <span className="tabular-nums text-[13px] text-muted">−{formatCurrency(row.gst)}</span>,
    sortValue: (row) => row.gst,
    hideBelow: 'xl'
  },
  {
    key: 'net',
    header: 'Net payout',
    align: 'right',
    render: (row) =>
    <StackedCell
      align="right"
      primary={<span className="font-semibold tabular-nums">{formatCurrency(row.net)}</span>}
      secondary={row.releasedAt ? `released ${row.releasedAt}` : row.scheduledFor} />,


    sortValue: (row) => row.net
  },
  {
    key: 'status',
    header: 'Status',
    render: (row) =>
    <div>
          <Badge>{row.status}</Badge>
          {row.holdReason ? <p className="mt-1 max-w-[180px] text-[11px] text-muted">{row.holdReason}</p> : null}
        </div>,

    sortValue: (row) => row.status
  },
  {
    key: 'actions',
    header: '',
    align: 'right',
    render: (row) =>
    <RowActions
      actions={[
      { label: 'Release settlement', onSelect: () => setReleasing(row) },
      { label: 'Hold settlement', onSelect: () => setHolding(row) },
      { label: 'Recalculate', onSelect: () => setRecalculating(row) }]
      } />


  }];


  const exportColumns = [
  { header: 'Reference', value: (row: SettlementRecord) => row.reference },
  { header: 'Cycle', value: (row: SettlementRecord) => row.cycle },
  { header: 'Hotel', value: (row: SettlementRecord) => row.propertyName },
  { header: 'Partner', value: (row: SettlementRecord) => row.partnerName },
  { header: 'City', value: (row: SettlementRecord) => row.city },
  { header: 'Gross', value: (row: SettlementRecord) => row.gross },
  { header: 'Commission', value: (row: SettlementRecord) => row.commission },
  { header: 'GST', value: (row: SettlementRecord) => row.gst },
  { header: 'Net payout', value: (row: SettlementRecord) => row.net },
  { header: 'Status', value: (row: SettlementRecord) => row.status },
  { header: 'UTR', value: (row: SettlementRecord) => row.utr ?? '' },
  { header: 'Hold reason', value: (row: SettlementRecord) => row.holdReason }];


  return (
    <div>
      <PageHeader
        title="Payout & settlement center"
        subtitle="Every partner settlement with the full commission and GST breakdown before money moves."
        actions={
        <ExportMenu
          title="Settlement cycle"
          subtitle={`${rows.length} settlements · ${tab}`}
          entity="Settlement"
          rows={rows}
          columns={exportColumns}
          label="Export cycle" />

        } />
      

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <MetricTile label="Pending settlements" value={formatCurrency(total('Pending'), true)} hint={`${counts.Pending ?? 0} awaiting release`} tone="warning" onClick={() => setTab('Pending')} />
        <MetricTile label="Processed" value={formatCurrency(total('Processed'), true)} hint={`${counts.Processed ?? 0} settled`} tone="positive" onClick={() => setTab('Processed')} />
        <MetricTile label="Failed" value={formatCurrency(total('Failed'), true)} hint={`${counts.Failed ?? 0} need bank re-verification`} tone="negative" onClick={() => setTab('Failed')} />
        <MetricTile label="On hold" value={formatCurrency(total('On Hold'), true)} hint={`${counts['On Hold'] ?? 0} frozen`} onClick={() => setTab('On Hold')} />
      </div>

      <Card className="mt-4">
        <Tabs tabs={tabs} value={tab} onChange={setTab} counts={counts} />
        <Toolbar>
          <SearchInput
            className="sm:max-w-xs sm:flex-1"
            placeholder="Search reference, hotel, partner, UTR…"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            aria-label="Search settlements" />
          
          <div className="flex gap-2 sm:ml-auto">
            <Select options={cycles} value={cycle} onChange={(event) => setCycle(event.target.value)} aria-label="Filter by cycle" />
            {tab === 'Pending' && rows.length ?
            <Button variant="primary" icon={UnlockIcon} onClick={() => setReleasingBatch(true)}>
                Release all ({rows.length})
              </Button> :
            null}
          </div>
        </Toolbar>
        <DataTable columns={columns} rows={rows} rowKey={(row) => row.id} pageSize={10} emptyLabel="No settlements in this state" />
      </Card>

      <ReasonDialog
        open={Boolean(releasing)}
        onClose={() => setReleasing(null)}
        title={`Release ${releasing?.reference ?? ''}`}
        description={
        releasing ?
        `${formatCurrency(releasing.net)} will be transferred to ${releasing.partnerName} and a UTR generated.` :
        undefined
        }
        reasons={['Cycle approved by finance', 'Manual transfer after bank re-verification', 'Hold cleared']}
        confirmLabel="Release payout"
        onConfirm={(reason) => {
          if (!releasing) return;
          run(
            { type: 'settlement.release', id: releasing.id },
            { permission: 'Settlements', success: `Payout released — ${formatCurrency(releasing.net)}` }
          );
          run({
            type: 'audit.record',
            entry: {
              action: 'Release justification',
              entityType: 'Settlement',
              entityId: releasing.reference,
              entityLabel: releasing.partnerName,
              previousState: releasing.status,
              newState: 'Processed',
              reason
            }
          });
        }} />
      

      <ReasonDialog
        open={releasingBatch}
        onClose={() => setReleasingBatch(false)}
        title={`Release ${rows.length} settlements`}
        description={`${formatCurrency(rows.reduce((sum, row) => sum + row.net, 0))} across ${rows.length} partner accounts.`}
        reasons={['Fortnightly cycle approved', 'Backlog clearance approved by finance head']}
        confirmLabel="Release batch"
        onConfirm={() =>
        run(
          { type: 'settlement.releaseAll', ids: rows.map((row) => row.id) },
          { permission: 'Settlements', success: `${rows.length} payouts released` }
        )
        } />
      

      <ReasonDialog
        open={Boolean(holding)}
        onClose={() => setHolding(null)}
        title={`Hold ${holding?.reference ?? ''}`}
        description="A held settlement stays out of every payout cycle until it is explicitly released."
        reasons={holdReasons}
        confirmLabel="Hold settlement"
        danger
        onConfirm={(reason) => {
          if (!holding) return;
          run(
            { type: 'settlement.hold', id: holding.id, reason },
            { permission: 'Settlements', success: 'Settlement held and finance notified' }
          );
        }} />
      

      <ReasonDialog
        open={Boolean(recalculating)}
        onClose={() => setRecalculating(null)}
        title={`Recalculate ${recalculating?.reference ?? ''}`}
        description="Recomputes commission, GST, and the net payable from the booking ledger."
        reasons={['Refunds landed after the cycle cut-off', 'Commission slab changed', 'GST correction']}
        confirmLabel="Recalculate"
        onConfirm={(note) => {
          if (!recalculating) return;
          run(
            { type: 'settlement.recalculate', id: recalculating.id, note },
            { permission: 'Settlements', success: 'Settlement recalculated' }
          );
        }}>
        
        {recalculating ?
        <ul className="divide-y divide-line rounded-xl border border-line">
            {[
          { label: 'Gross revenue', value: formatCurrency(recalculating.gross) },
          { label: 'Platform commission (12%)', value: `−${formatCurrency(Math.round(recalculating.gross * 0.12))}` },
          { label: 'GST on commission (18%)', value: `−${formatCurrency(Math.round(recalculating.gross * 0.12 * 0.18))}` },
          {
            label: 'Net payable after recalculation',
            value: formatCurrency(
              recalculating.gross - Math.round(recalculating.gross * 0.12) - Math.round(recalculating.gross * 0.12 * 0.18)
            )
          }].
          map((line) =>
          <li key={line.label} className="flex items-center justify-between px-4 py-2.5">
                <span className="text-[13px] text-muted">{line.label}</span>
                <span className="text-[13px] font-semibold tabular-nums text-ink">{line.value}</span>
              </li>
          )}
          </ul> :
        null}
        <p className="flex items-center gap-2 text-xs text-muted">
          <CalculatorIcon className="h-3.5 w-3.5" /> Current net on record: {recalculating ? formatCurrency(recalculating.net) : '—'}
        </p>
      </ReasonDialog>
    </div>);

}