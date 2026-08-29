import React, { useState } from 'react';
import { GaugeIcon, ShieldCheckIcon } from 'lucide-react';
import { Card, CardHeader } from '../../components/ui/Card';
import { PageHeader } from '../../components/ui/PageHeader';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Input, Label, Select, Toggle } from '../../components/ui/Field';
import { Tabs } from '../../components/ui/Tabs';
import { DataTable, type Column } from '../../components/ui/DataTable';
import { StackedCell, RowActions } from '../../components/ui/Cells';
import { MetricTile, ExportMenu, ReasonDialog } from '../../components/adminos/OsPrimitives';
import { useAdminOs } from '../../contexts/AdminOsContext';
import { liveCityOccupancy } from '../../services/adminos/selectors';
import type { PartnerPricingRule } from '../../data/adminos/pricing';
import { formatCurrency } from '../../utils/format';

const tabs = ['All', 'Surge', 'Seasonal', 'Discount'];

export function PricingGovernance() {
  const { state, run } = useAdminOs();
  const [tab, setTab] = useState('All');
  const [overriding, setOverriding] = useState<PartnerPricingRule | null>(null);
  const [overrideType, setOverrideType] = useState('Rate ceiling');
  const [overrideValue, setOverrideValue] = useState(2400);
  const [floorDraft, setFloorDraft] = useState(state.guardrails.floor);
  const [ceilingDraft, setCeilingDraft] = useState(state.guardrails.ceiling);

  const rules = state.pricingRules;
  const rows = tab === 'All' ? rules : rules.filter((rule) => rule.kind === tab);
  const flagged = rules.filter((rule) => rule.status === 'Flagged');
  const overridden = rules.filter((rule) => rule.override);

  const counts: Record<string, number> = {
    All: rules.length,
    Surge: rules.filter((rule) => rule.kind === 'Surge').length,
    Seasonal: rules.filter((rule) => rule.kind === 'Seasonal').length,
    Discount: rules.filter((rule) => rule.kind === 'Discount').length
  };

  const cities = liveCityOccupancy(state);

  const columns: Column<PartnerPricingRule>[] = [
  {
    key: 'rule',
    header: 'Partner rule',
    render: (row) => <StackedCell primary={row.name} secondary={`${row.propertyName} · ${row.city}`} />,
    sortValue: (row) => row.name
  },
  { key: 'kind', header: 'Type', render: (row) => <Badge tone="neutral">{row.kind}</Badge>, sortValue: (row) => row.kind, hideBelow: 'sm' },
  {
    key: 'adjustment',
    header: 'Adjustment',
    render: (row) =>
    <span className={`text-[13px] font-semibold ${row.delta < 0 ? 'text-negative' : 'text-ink'}`}>
          {row.delta > 0 ? '+' : '−'}
          {Math.round(Math.abs(row.delta) * 100)}%
        </span>,

    sortValue: (row) => row.delta
  },
  {
    key: 'rate',
    header: 'Effective rate',
    align: 'right',
    render: (row) =>
    <StackedCell
      align="right"
      primary={<span className="font-semibold tabular-nums">{formatCurrency(row.effectiveRate)}</span>}
      secondary={row.override ? `${row.override.type} by ${row.override.by}` : `base ${formatCurrency(row.baseRate)}`} />,


    sortValue: (row) => row.effectiveRate,
    hideBelow: 'md'
  },
  { key: 'status', header: 'Status', render: (row) => <Badge>{row.status}</Badge>, sortValue: (row) => row.status },
  {
    key: 'actions',
    header: '',
    align: 'right',
    render: (row) =>
    <RowActions
      actions={[
      {
        label: 'Override price',
        onSelect: () => {
          setOverrideValue(row.baseRate);
          setOverriding(row);
        }
      },
      {
        label: row.status === 'Paused' ? 'Resume rule' : 'Pause rule',
        onSelect: () =>
        run(
          {
            type: 'pricing.setStatus',
            id: row.id,
            status: row.status === 'Paused' ? 'Active' : 'Paused',
            reason: 'Paused from pricing governance'
          },
          { permission: 'Pricing Governance', success: `Rule ${row.status === 'Paused' ? 'resumed' : 'paused'}` }
        )
      },
      {
        label: 'Block rule',
        danger: true,
        onSelect: () =>
        run(
          { type: 'pricing.setStatus', id: row.id, status: 'Blocked', reason: 'Blocked for pricing abuse' },
          { permission: 'Pricing Governance', success: 'Rule blocked' }
        )
      }]
      } />


  }];


  return (
    <div>
      <PageHeader
        title="Dynamic pricing governance"
        subtitle="What partners are charging, and the platform guardrails that stop pricing abuse."
        actions={
        <ExportMenu
          title="Pricing rules"
          entity="Pricing rule"
          rows={rows}
          columns={[
          { header: 'Rule', value: (row: PartnerPricingRule) => row.name },
          { header: 'Hotel', value: (row: PartnerPricingRule) => row.propertyName },
          { header: 'City', value: (row: PartnerPricingRule) => row.city },
          { header: 'Type', value: (row: PartnerPricingRule) => row.kind },
          { header: 'Base rate', value: (row: PartnerPricingRule) => row.baseRate },
          { header: 'Effective rate', value: (row: PartnerPricingRule) => row.effectiveRate },
          { header: 'Status', value: (row: PartnerPricingRule) => row.status },
          { header: 'Override', value: (row: PartnerPricingRule) => row.override ? `${row.override.type} ₹${row.override.value}` : '' }]
          } />

        } />
      

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <MetricTile label="Active partner rules" value={String(counts.All)} hint="across all properties" tone="accent" onClick={() => setTab('All')} />
        <MetricTile label="Surge rules live" value={String(counts.Surge)} hint="weekend and event driven" onClick={() => setTab('Surge')} />
        <MetricTile label="Flagged for abuse" value={String(flagged.length)} hint="above the platform ceiling" tone="negative" onClick={() => setTab('Surge')} />
        <MetricTile label="Platform overrides" value={String(overridden.length)} hint="ignoring partner rules" />
      </div>

      <Card className="mt-4">
        <CardHeader title="Platform guardrails" subtitle="Enforced at search time, above every partner rule" />
        <div className="grid grid-cols-1 gap-4 px-5 py-5 lg:grid-cols-3">
          <div className="rounded-xl border border-line px-4 py-3.5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[13px] font-semibold text-ink">Minimum price enforcement</p>
                <p className="text-xs text-muted">Blocks rates below the city floor.</p>
              </div>
              <Toggle
                checked={state.guardrails.floorEnabled}
                onChange={(checked) =>
                run(
                  { type: 'pricing.guardrails', patch: { floorEnabled: checked } },
                  { permission: 'Pricing Governance', success: `Minimum price enforcement ${checked ? 'on' : 'off'}` }
                )
                }
                label="Minimum price enforcement" />
              
            </div>
            <div className="mt-3 flex gap-2">
              <Input
                id="floor"
                type="number"
                value={floorDraft}
                onChange={(event) => setFloorDraft(Number(event.target.value))}
                disabled={!state.guardrails.floorEnabled}
                aria-label="City floor in rupees" />
              
              <Button
                size="sm"
                disabled={!state.guardrails.floorEnabled || floorDraft === state.guardrails.floor}
                onClick={() =>
                run(
                  { type: 'pricing.guardrails', patch: { floor: floorDraft } },
                  { permission: 'Pricing Governance', success: `Floor set to ₹${floorDraft}` }
                )
                }>
                
                Save
              </Button>
            </div>
            <p className="mt-1.5 text-xs text-muted">Current floor ₹{state.guardrails.floor}</p>
          </div>

          <div className="rounded-xl border border-line px-4 py-3.5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[13px] font-semibold text-ink">Maximum price enforcement</p>
                <p className="text-xs text-muted">Caps surge at a multiple of the base rate.</p>
              </div>
              <Toggle
                checked={state.guardrails.ceilingEnabled}
                onChange={(checked) =>
                run(
                  { type: 'pricing.guardrails', patch: { ceilingEnabled: checked } },
                  { permission: 'Pricing Governance', success: `Maximum price enforcement ${checked ? 'on' : 'off'}` }
                )
                }
                label="Maximum price enforcement" />
              
            </div>
            <div className="mt-3 flex gap-2">
              <Input
                id="ceiling"
                type="number"
                step={0.05}
                value={ceilingDraft}
                onChange={(event) => setCeilingDraft(Number(event.target.value))}
                disabled={!state.guardrails.ceilingEnabled}
                aria-label="Surge ceiling multiplier" />
              
              <Button
                size="sm"
                disabled={!state.guardrails.ceilingEnabled || ceilingDraft === state.guardrails.ceiling}
                onClick={() =>
                run(
                  { type: 'pricing.guardrails', patch: { ceiling: ceilingDraft } },
                  { permission: 'Pricing Governance', success: `Ceiling set to ${ceilingDraft}× base` }
                )
                }>
                
                Save
              </Button>
            </div>
            <p className="mt-1.5 text-xs text-muted">Current ceiling {state.guardrails.ceiling}× base</p>
          </div>

          <div className="rounded-xl border border-line px-4 py-3.5">
            <div className="flex items-center gap-2.5">
              <ShieldCheckIcon className="h-4 w-4 text-muted" />
              <p className="text-[13px] font-semibold text-ink">Abuse detection</p>
            </div>
            <p className="mt-1.5 text-xs text-muted">
              Rules that push a listing above the ceiling, or reprice repeatedly within an hour, are flagged for review.
              {flagged.length ? ` ${flagged.length} rules are flagged now.` : ' Nothing is flagged right now.'}
            </p>
            <Button
              size="sm"
              className="mt-3"
              onClick={() => {
                const breaches = rules.filter((rule) => rule.effectiveRate > rule.baseRate * state.guardrails.ceiling);
                breaches.forEach((rule) =>
                run({ type: 'pricing.setStatus', id: rule.id, status: 'Flagged', reason: 'Exceeds the surge ceiling' })
                );
                run({
                  type: 'audit.record',
                  entry: {
                    action: 'Run pricing abuse checks',
                    entityType: 'Pricing rule',
                    entityId: 'ALL',
                    entityLabel: `${rules.length} rules evaluated`,
                    previousState: `${flagged.length} flagged`,
                    newState: `${breaches.length} breaching the ${state.guardrails.ceiling}× ceiling`,
                    reason: 'Manual guardrail re-check'
                  }
                });
              }}>
              
              Re-run checks
            </Button>
          </div>
        </div>
      </Card>

      <Card className="mt-4">
        <CardHeader title="Partner pricing rules" subtitle="Live rules set inside PartnerOS" />
        <Tabs tabs={tabs} value={tab} onChange={setTab} counts={counts} />
        <DataTable columns={columns} rows={rows} rowKey={(row) => row.id} pageSize={10} />
      </Card>

      <Card className="mt-4">
        <CardHeader title="Pricing pressure by city" subtitle="Live occupancy against the city target — the input to surge decisions" />
        <ul className="divide-y divide-line">
          {cities.map((city) => {
            const over = city.occupancy - city.target;
            return (
              <li key={city.city} className="flex flex-wrap items-center gap-3 px-5 py-3.5">
                <GaugeIcon className="h-4 w-4 shrink-0 text-muted" />
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] font-semibold text-ink">{city.city}</p>
                  <p className="text-xs text-muted">
                    {city.occupancy}% occupied · target {city.target}% · {city.liveHotels} live hotels
                  </p>
                </div>
                <Badge tone={over > 6 ? 'negative' : over > 0 ? 'warning' : 'neutral'}>
                  {over > 6 ? 'Surge recommended' : over > 0 ? 'Watch' : 'No action'}
                </Badge>
              </li>);

          })}
        </ul>
      </Card>

      <ReasonDialog
        open={Boolean(overriding)}
        onClose={() => setOverriding(null)}
        title={`Override pricing — ${overriding?.propertyName ?? ''}`}
        description="A platform override ignores the partner's dynamic rule until you remove it."
        reasons={[
        'Rate above market ceiling',
        'Repeated repricing within an hour',
        'Guest complaint about price gouging',
        'Event-period rate cap']
        }
        confirmLabel="Apply override"
        onConfirm={(reason) => {
          if (!overriding) return;
          run(
            { type: 'pricing.override', id: overriding.id, overrideType: overrideType, value: overrideValue, reason },
            { permission: 'Pricing Governance', success: `Override applied to ${overriding.propertyName}` }
          );
        }}>
        
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="override-type">Override type</Label>
            <Select
              id="override-type"
              options={['Fixed rate', 'Rate ceiling', 'Rate floor']}
              value={overrideType}
              onChange={(event) => setOverrideType(event.target.value)} />
            
          </div>
          <div>
            <Label htmlFor="override-value">Value (₹)</Label>
            <Input
              id="override-value"
              type="number"
              value={overrideValue}
              onChange={(event) => setOverrideValue(Number(event.target.value))} />
            
          </div>
        </div>
      </ReasonDialog>
    </div>);

}