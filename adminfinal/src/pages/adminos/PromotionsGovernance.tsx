import React, { useState } from 'react';
import { PauseIcon, PlayIcon, SlidersHorizontalIcon, XIcon } from 'lucide-react';
import { Card, CardHeader } from '../../components/ui/Card';
import { PageHeader } from '../../components/ui/PageHeader';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Input, Label, Select } from '../../components/ui/Field';
import { Tabs } from '../../components/ui/Tabs';
import { DataTable, type Column } from '../../components/ui/DataTable';
import { MonoCell, RowActions, StackedCell } from '../../components/ui/Cells';
import { MetricTile, ScoreBar, ExportMenu, ReasonDialog } from '../../components/adminos/OsPrimitives';
import { useAdminOs } from '../../contexts/AdminOsContext';
import type { Promotion } from '../../data/adminos/governance';
import { formatCurrency, formatNumber } from '../../utils/format';

const tabs = ['All', 'Active', 'Scheduled', 'Paused', 'Expired'];

export function PromotionsGovernance() {
  const { state, run } = useAdminOs();
  const [tab, setTab] = useState('All');
  const [overriding, setOverriding] = useState<Promotion | null>(null);
  const [cap, setCap] = useState(500);
  const [limit, setLimit] = useState(5000);
  const [scope, setScope] = useState('Keep current scope');
  const [emergency, setEmergency] = useState(false);

  const promotions = state.promotions;
  const rows = tab === 'All' ? promotions : promotions.filter((promotion) => promotion.status === tab);

  const counts: Record<string, number> = { All: promotions.length };
  tabs.slice(1).forEach((status) => {
    counts[status] = promotions.filter((promotion) => promotion.status === status).length;
  });

  const revenue = promotions.reduce((sum, promotion) => sum + promotion.revenue, 0);
  const redemptions = promotions.reduce((sum, promotion) => sum + promotion.redemptions, 0);
  const active = promotions.filter((promotion) => promotion.status === 'Active');
  const avgConversion = active.length ?
  (active.reduce((sum, promotion) => sum + promotion.conversion, 0) / active.length).toFixed(1) :
  '0';

  const columns: Column<Promotion>[] = [
  {
    key: 'name',
    header: 'Promotion',
    render: (row) =>
    <div>
          <p className="text-[13px] font-semibold text-ink">{row.name}</p>
          <p className="text-xs text-muted">
            <MonoCell>{row.code}</MonoCell> · {row.scope}
          </p>
        </div>,

    sortValue: (row) => row.name
  },
  {
    key: 'discount',
    header: 'Discount',
    render: (row) => <StackedCell primary={row.discount} secondary={row.window} />,
    sortValue: (row) => row.discount,
    hideBelow: 'md'
  },
  {
    key: 'redemptions',
    header: 'Redemptions',
    align: 'right',
    render: (row) => <span className="tabular-nums text-[13px]">{formatNumber(row.redemptions)}</span>,
    sortValue: (row) => row.redemptions,
    hideBelow: 'sm'
  },
  {
    key: 'revenue',
    header: 'Revenue',
    align: 'right',
    render: (row) => <span className="font-semibold tabular-nums text-[13px]">{formatCurrency(row.revenue, true)}</span>,
    sortValue: (row) => row.revenue
  },
  {
    key: 'conversion',
    header: 'Conversion',
    render: (row) =>
    <div className="w-28">
          <ScoreBar value={Math.round(row.conversion * 3)} showLabel={false} />
          <p className="mt-1 text-[11px] tabular-nums text-muted">{row.conversion}%</p>
        </div>,

    sortValue: (row) => row.conversion,
    hideBelow: 'lg'
  },
  {
    key: 'lift',
    header: 'Occupancy lift',
    align: 'right',
    render: (row) =>
    <span className={`tabular-nums text-[13px] font-semibold ${row.occupancyLift > 0 ? 'text-positive' : 'text-muted'}`}>
          {row.occupancyLift > 0 ? `+${row.occupancyLift}%` : '—'}
        </span>,

    sortValue: (row) => row.occupancyLift,
    hideBelow: 'xl'
  },
  { key: 'status', header: 'Status', render: (row) => <Badge>{row.status}</Badge>, sortValue: (row) => row.status },
  {
    key: 'actions',
    header: '',
    align: 'right',
    render: (row) =>
    <div className="flex items-center justify-end gap-1.5">
          {row.status === 'Paused' || row.status === 'Scheduled' ?
      <Button
        size="sm"
        variant="primary"
        icon={PlayIcon}
        onClick={() =>
        run(
          { type: 'promotion.setStatus', id: row.id, status: 'Active', reason: 'Campaign approved' },
          { permission: 'Promotions Governance', success: `${row.code} activated` }
        )
        }>
        
              Approve
            </Button> :
      null}
          <RowActions
        actions={[
        { label: 'Override promotion', onSelect: () => setOverriding(row) },
        {
          label: row.status === 'Paused' ? 'Resume promotion' : 'Pause promotion',
          onSelect: () =>
          run(
            {
              type: 'promotion.setStatus',
              id: row.id,
              status: row.status === 'Paused' ? 'Active' : 'Paused',
              reason: 'Paused from promotions governance'
            },
            { permission: 'Promotions Governance', success: `${row.code} ${row.status === 'Paused' ? 'resumed' : 'paused'}` }
          )
        },
        {
          label: 'Disable promotion',
          danger: true,
          onSelect: () =>
          run(
            { type: 'promotion.setStatus', id: row.id, status: 'Expired', reason: 'Disabled by platform' },
            { permission: 'Promotions Governance', success: `${row.code} disabled and removed from checkout` }
          )
        }]
        } />
      
        </div>

  }];


  return (
    <div>
      <PageHeader
        title="Promotions governance"
        subtitle="Platform and partner promotions, what they earned, and what they cost in margin."
        actions={
        <ExportMenu
          title="Promotion performance"
          entity="Promotion"
          rows={rows}
          columns={[
          { header: 'Code', value: (row: Promotion) => row.code },
          { header: 'Name', value: (row: Promotion) => row.name },
          { header: 'Scope', value: (row: Promotion) => row.scope },
          { header: 'Discount', value: (row: Promotion) => row.discount },
          { header: 'Window', value: (row: Promotion) => row.window },
          { header: 'Redemptions', value: (row: Promotion) => row.redemptions },
          { header: 'Revenue', value: (row: Promotion) => row.revenue },
          { header: 'Conversion %', value: (row: Promotion) => row.conversion },
          { header: 'Occupancy lift %', value: (row: Promotion) => row.occupancyLift },
          { header: 'Status', value: (row: Promotion) => row.status }]
          } />

        } />
      

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <MetricTile label="Active promotions" value={String(counts.Active ?? 0)} hint={`${counts.Scheduled ?? 0} scheduled`} tone="accent" onClick={() => setTab('Active')} />
        <MetricTile label="Promotion revenue" value={formatCurrency(revenue, true)} hint="attributed gross value" to="/os/revenue-intelligence" />
        <MetricTile label="Total redemptions" value={formatNumber(redemptions)} hint="all promotions to date" onClick={() => setTab('All')} />
        <MetricTile label="Average conversion" value={`${avgConversion}%`} hint="active promotions only" tone="positive" onClick={() => setTab('Active')} />
      </div>

      <Card className="mt-4">
        <CardHeader title="Promotion performance" subtitle="Revenue, conversion, and occupancy impact side by side" />
        <Tabs tabs={tabs} value={tab} onChange={setTab} counts={counts} />
        <DataTable columns={columns} rows={rows} rowKey={(row) => row.id} pageSize={8} emptyLabel="No promotions in this state" />
      </Card>

      <Card className="mt-4">
        <CardHeader title="Margin guardrails" subtitle="Applied before any promotion reaches checkout" />
        <ul className="divide-y divide-line">
          {[
          { rule: 'Maximum stacked discount', value: '35% of booking value', status: 'Enforced' },
          { rule: 'Minimum post-discount commission', value: '₹75 per booking', status: 'Enforced' },
          { rule: 'Promotions on surge-priced inventory', value: 'Blocked', status: 'Enforced' },
          { rule: 'Partner-funded promotions require approval', value: 'Above 20% discount', status: 'Enforced' }].
          map((item) =>
          <li key={item.rule} className="flex flex-wrap items-center gap-3 px-5 py-3.5">
              <SlidersHorizontalIcon className="h-4 w-4 shrink-0 text-muted" />
              <div className="min-w-0 flex-1">
                <p className="text-[13px] font-semibold text-ink">{item.rule}</p>
                <p className="text-xs text-muted">{item.value}</p>
              </div>
              <Badge tone="positive">{item.status}</Badge>
            </li>
          )}
        </ul>
      </Card>

      <ReasonDialog
        open={Boolean(overriding)}
        onClose={() => setOverriding(null)}
        title={`Override ${overriding?.code ?? ''}`}
        description="Platform overrides take precedence over the partner or marketing configuration."
        confirmLabel="Apply override"
        onConfirm={() => {
          if (!overriding) return;
          run(
            { type: 'promotion.override', id: overriding.id, cap, limit, scope },
            { permission: 'Promotions Governance', success: `${overriding.code} override applied` }
          );
        }}>
        
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="promo-cap">Discount cap (₹)</Label>
            <Input id="promo-cap" type="number" value={cap} onChange={(event) => setCap(Number(event.target.value))} />
          </div>
          <div>
            <Label htmlFor="promo-limit">Redemption limit</Label>
            <Input id="promo-limit" type="number" value={limit} onChange={(event) => setLimit(Number(event.target.value))} />
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="promo-scope">Restrict scope</Label>
            <Select
              id="promo-scope"
              options={['Keep current scope', 'Limit to one city', 'Limit to new customers', 'Limit to weekdays']}
              value={scope}
              onChange={(event) => setScope(event.target.value)} />
            
          </div>
        </div>
      </ReasonDialog>

      <ReasonDialog
        open={emergency}
        onClose={() => setEmergency(false)}
        title="Emergency disable all promotions"
        description="Every active and scheduled promotion is paused platform-wide, immediately."
        reasons={['Margin breach detected', 'Pricing exploit in the wild', 'Finance directive']}
        confirmLabel="Disable everything"
        danger
        onConfirm={() =>
        run({ type: 'promotion.emergencyDisable' }, { permission: 'Promotions Governance', success: 'All promotions disabled' })
        } />
      

      <div className="mt-4 flex flex-wrap gap-2">
        <Button
          icon={PauseIcon}
          onClick={() =>
          active.forEach((promotion) =>
          run({
            type: 'promotion.setStatus',
            id: promotion.id,
            status: 'Paused',
            reason: 'Bulk pause from promotions governance'
          })
          )
          }
          disabled={active.length === 0}>
          
          Pause all active ({active.length})
        </Button>
        <Button variant="danger" icon={XIcon} onClick={() => setEmergency(true)}>
          Emergency disable
        </Button>
      </div>
    </div>);

}