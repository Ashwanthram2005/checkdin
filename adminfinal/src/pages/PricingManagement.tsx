import React, { useState } from 'react';
import { PlusIcon, TrendingUpIcon } from 'lucide-react';
import { Card, CardHeader } from '../components/ui/Card';
import { PageHeader } from '../components/ui/PageHeader';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Input, Label, Select, Toggle } from '../components/ui/Field';
import { DataTable, type Column } from '../components/ui/DataTable';
import { StackedCell, RowActions } from '../components/ui/Cells';
import { Modal } from '../components/ui/Modal';
import { TableSkeleton, ErrorState } from '../components/ui/LoadingState';
import { OccupancyBarChart } from '../components/charts/Charts';
import { useMockQuery } from '../hooks/useMockQuery';
import { api } from '../services/api';
import { occupancyTrend } from '../data/analytics';
import { rooms } from '../data/rooms';
import { properties } from '../data/properties';
import { formatCurrency } from '../utils/format';
import type { PricingRule } from '../types';

const slotRates = [
{ slot: '3 hours', share: '38% of nightly rate', bookings: 140 },
{ slot: '6 hours', share: '55% of nightly rate', bookings: 68 },
{ slot: '12 hours', share: '78% of nightly rate', bookings: 44 },
{ slot: 'Full night', share: '100% of nightly rate', bookings: 59 }];


export function PricingManagement() {
  const { data, loading, error } = useMockQuery(api.getPricingRules, []);
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState<PricingRule | null>(null);
  const [dynamic, setDynamic] = useState(true);

  const rules = data ?? [];
  const averageRate = Math.round(rooms.reduce((sum, room) => sum + room.baseRate, 0) / rooms.length);

  const columns: Column<PricingRule>[] = [
  {
    key: 'name',
    header: 'Rule',
    render: (row) => <StackedCell primary={row.name} secondary={row.scope} />,
    sortValue: (row) => row.name
  },
  {
    key: 'trigger',
    header: 'Trigger',
    render: (row) => <span className="text-[13px] text-muted">{row.trigger}</span>,
    sortValue: (row) => row.trigger,
    hideBelow: 'md'
  },
  {
    key: 'adjustment',
    header: 'Adjustment',
    render: (row) =>
    <span
      className={`text-[13px] font-semibold ${row.adjustment.startsWith('−') ? 'text-negative' : 'text-ink'}`}>
      
          {row.adjustment}
        </span>,

    sortValue: (row) => row.adjustment
  },
  { key: 'channel', header: 'Channel', render: (row) => <Badge tone="neutral">{row.channel}</Badge>, sortValue: (row) => row.channel, hideBelow: 'lg' },
  {
    key: 'updated',
    header: 'Updated',
    render: (row) => <span className="text-[13px] text-muted">{row.updatedAt}</span>,
    sortValue: (row) => row.updatedAt,
    hideBelow: 'xl'
  },
  { key: 'status', header: 'Status', render: (row) => <Badge>{row.status}</Badge>, sortValue: (row) => row.status },
  {
    key: 'actions',
    header: '',
    align: 'right',
    render: (row) =>
    <RowActions
      actions={[
      { label: 'Edit rule', onSelect: () => setEditing(row) },
      { label: row.status === 'Active' ? 'Pause rule' : 'Activate rule', onSelect: () => api.mutate('pricing.toggle', { id: row.id }) },
      { label: 'Duplicate', onSelect: () => api.mutate('pricing.duplicate', { id: row.id }) },
      { label: 'Delete rule', danger: true, onSelect: () => api.mutate('pricing.delete', { id: row.id }) }]
      } />


  }];


  return (
    <div>
      <PageHeader
        title="Pricing management"
        subtitle="Base rates, hourly slot multipliers, and the dynamic rules that move prices."
        actions={
        <Button variant="primary" icon={PlusIcon} onClick={() => setCreating(true)}>
            New rule
          </Button>
        } />
      

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card className="border-accent/60 bg-accent/[0.07] px-5 py-4">
          <p className="text-[13px] font-medium text-muted">Average nightly rate</p>
          <p className="mt-0.5 text-3xl font-bold tracking-tight text-ink">{formatCurrency(averageRate)}</p>
          <p className="mt-2 inline-flex items-center gap-1 text-[13px] font-semibold text-positive">
            <TrendingUpIcon className="h-3.5 w-3.5" /> 6.4% <span className="font-normal text-muted">vs last month</span>
          </p>
        </Card>
        <Card className="px-5 py-4">
          <p className="text-[13px] font-medium text-muted">Active rules</p>
          <p className="mt-0.5 text-2xl font-bold tracking-tight text-ink">
            {rules.filter((rule) => rule.status === 'Active').length}
          </p>
          <p className="mt-1 text-xs text-muted">{rules.length} configured</p>
        </Card>
        <Card className="px-5 py-4">
          <p className="text-[13px] font-medium text-muted">Rate parity</p>
          <p className="mt-0.5 text-2xl font-bold tracking-tight text-ink">98.2%</p>
          <p className="mt-1 text-xs text-muted">4 listings out of parity</p>
        </Card>
        <Card className="px-5 py-4">
          <p className="text-[13px] font-medium text-muted">Dynamic pricing</p>
          <div className="mt-2 flex items-center gap-2.5">
            <Toggle checked={dynamic} onChange={setDynamic} label="Dynamic pricing" />
            <span className="text-[13px] font-medium text-ink">{dynamic ? 'Enabled' : 'Paused'}</span>
          </div>
          <p className="mt-1.5 text-xs text-muted">Applies to all cities</p>
        </Card>
      </div>

      <Card className="mt-4">
        <CardHeader title="Pricing rules" subtitle="Evaluated in order, highest priority first" />
        {loading ?
        <TableSkeleton rows={5} /> :
        error ?
        <ErrorState message={error} /> :

        <DataTable columns={columns} rows={rules} rowKey={(row) => row.id} pageSize={6} />
        }
      </Card>

      <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader title="Hourly slot multipliers" subtitle="Share of the nightly rate charged per slot" />
          <ul className="divide-y divide-line">
            {slotRates.map((slot) =>
            <li key={slot.slot} className="flex items-center gap-3 px-5 py-3.5">
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] font-semibold text-ink">{slot.slot}</p>
                  <p className="text-xs text-muted">{slot.share}</p>
                </div>
                <span className="text-[13px] tabular-nums text-muted">{slot.bookings} bookings</span>
                <Button size="sm" variant="ghost">
                  Adjust
                </Button>
              </li>
            )}
          </ul>
        </Card>
        <Card>
          <CardHeader title="Occupancy vs target by city" subtitle="Cities above target are candidates for a surge" />
          <div className="px-2 py-4">
            <OccupancyBarChart data={occupancyTrend} />
          </div>
        </Card>
      </div>

      <Modal
        open={creating || Boolean(editing)}
        onClose={() => {
          setCreating(false);
          setEditing(null);
        }}
        title={editing ? `Edit ${editing.name}` : 'New pricing rule'}
        description="Rules apply on top of the room base rate at search time."
        footer={
        <>
            <Button
            onClick={() => {
              setCreating(false);
              setEditing(null);
            }}>
            
              Cancel
            </Button>
            <Button
            variant="primary"
            onClick={() => {
              api.mutate(editing ? 'pricing.update' : 'pricing.create', { id: editing?.id });
              setCreating(false);
              setEditing(null);
            }}>
            
              {editing ? 'Save rule' : 'Create rule'}
            </Button>
          </>
        }>
        
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Label htmlFor="rule-name">Rule name</Label>
            <Input id="rule-name" defaultValue={editing?.name} placeholder="Weekend surge — metros" />
          </div>
          <div>
            <Label htmlFor="rule-scope">Applies to</Label>
            <Select id="rule-scope" options={['All properties', ...properties.map((property) => property.name)]} />
          </div>
          <div>
            <Label htmlFor="rule-channel">Channel</Label>
            <Select id="rule-channel" options={['All', 'Website', 'App']} defaultValue={editing?.channel} />
          </div>
          <div>
            <Label htmlFor="rule-trigger">Trigger</Label>
            <Select
              id="rule-trigger"
              options={[
              'Day of week',
              'Occupancy threshold',
              'Date range',
              'Lead time to check-in',
              'Slot duration']
              } />
            
          </div>
          <div>
            <Label htmlFor="rule-adjust">Adjustment (%)</Label>
            <Input id="rule-adjust" type="number" placeholder="18" />
          </div>
        </div>
      </Modal>
    </div>);

}