import React, { useMemo, useState } from 'react';
import { PlusIcon } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { PageHeader, Toolbar } from '../components/ui/PageHeader';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Input, Label, SearchInput, Select, Textarea } from '../components/ui/Field';
import { Tabs } from '../components/ui/Tabs';
import { DataTable, type Column } from '../components/ui/DataTable';
import { MonoCell, RowActions, StackedCell } from '../components/ui/Cells';
import { ProgressBar } from '../components/ui/Primitives';
import { Modal } from '../components/ui/Modal';
import { TableSkeleton, ErrorState } from '../components/ui/LoadingState';
import { useMockQuery } from '../hooks/useMockQuery';
import { api } from '../services/api';
import { formatCurrency, formatDate, formatNumber } from '../utils/format';
import type { Coupon } from '../types';

const tabs = ['All', 'Active', 'Scheduled', 'Paused', 'Expired'];

export function Coupons() {
  const { data, loading, error } = useMockQuery(api.getCoupons, []);
  const [tab, setTab] = useState('All');
  const [query, setQuery] = useState('');
  const [editing, setEditing] = useState<Coupon | null>(null);
  const [creating, setCreating] = useState(false);

  const coupons = data ?? [];

  const counts = useMemo(() => {
    const result: Record<string, number> = { All: coupons.length };
    tabs.slice(1).forEach((status) => {
      result[status] = coupons.filter((coupon) => coupon.status === status).length;
    });
    return result;
  }, [coupons]);

  const rows = useMemo(
    () =>
    coupons.filter((coupon) => {
      if (tab !== 'All' && coupon.status !== tab) return false;
      if (!query) return true;
      const needle = query.toLowerCase();
      return coupon.code.toLowerCase().includes(needle) || coupon.description.toLowerCase().includes(needle);
    }),
    [coupons, tab, query]
  );

  const columns: Column<Coupon>[] = [
  {
    key: 'code',
    header: 'Coupon',
    render: (row) =>
    <div>
          <MonoCell>{row.code}</MonoCell>
          <p className="text-xs text-muted">{row.description}</p>
        </div>,

    sortValue: (row) => row.code
  },
  {
    key: 'value',
    header: 'Discount',
    render: (row) =>
    <StackedCell
      primary={row.type === 'Percentage' ? `${row.value}% off` : `${formatCurrency(row.value)} off`}
      secondary={`min ${formatCurrency(row.minBooking)} · cap ${formatCurrency(row.maxDiscount)}`} />,


    sortValue: (row) => row.value
  },
  {
    key: 'usage',
    header: 'Usage',
    render: (row) => <ProgressBar value={row.used / row.limit * 100} label={`${Math.round(row.used / row.limit * 100)}%`} />,
    sortValue: (row) => row.used / row.limit,
    className: 'w-44',
    hideBelow: 'md'
  },
  {
    key: 'redemptions',
    header: 'Redemptions',
    align: 'right',
    render: (row) =>
    <StackedCell
      align="right"
      primary={<span className="tabular-nums">{formatNumber(row.used)}</span>}
      secondary={`of ${formatNumber(row.limit)}`} />,


    sortValue: (row) => row.used
  },
  {
    key: 'window',
    header: 'Validity',
    render: (row) =>
    <span className="text-[13px] text-muted">
          {formatDate(row.validFrom)} → {formatDate(row.validTo)}
        </span>,

    sortValue: (row) => row.validTo,
    hideBelow: 'lg'
  },
  { key: 'status', header: 'Status', render: (row) => <Badge>{row.status}</Badge>, sortValue: (row) => row.status },
  {
    key: 'actions',
    header: '',
    align: 'right',
    render: (row) =>
    <RowActions
      actions={[
      { label: 'Edit coupon', onSelect: () => setEditing(row) },
      { label: row.status === 'Paused' ? 'Resume' : 'Pause', onSelect: () => api.mutate('coupon.toggle', { id: row.id }) },
      { label: 'Duplicate', onSelect: () => api.mutate('coupon.duplicate', { id: row.id }) },
      { label: 'Expire now', danger: true, onSelect: () => api.mutate('coupon.expire', { id: row.id }) }]
      } />


  }];


  return (
    <div>
      <PageHeader
        title="Coupons"
        subtitle="Discount codes, redemption limits, and live usage against each campaign."
        actions={
        <Button variant="primary" icon={PlusIcon} onClick={() => setCreating(true)}>
            Create coupon
          </Button>
        } />
      

      <Card>
        <Tabs tabs={tabs} value={tab} onChange={setTab} counts={counts} />
        <Toolbar>
          <SearchInput
            className="sm:max-w-xs sm:flex-1"
            placeholder="Search code or description…"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            aria-label="Search coupons" />
          
        </Toolbar>
        {loading ?
        <TableSkeleton rows={5} /> :
        error ?
        <ErrorState message={error} /> :

        <DataTable columns={columns} rows={rows} rowKey={(row) => row.id} pageSize={8} emptyLabel="No coupons match these filters" />
        }
      </Card>

      <Modal
        open={creating || Boolean(editing)}
        onClose={() => {
          setCreating(false);
          setEditing(null);
        }}
        title={editing ? `Edit ${editing.code}` : 'Create coupon'}
        description="Codes are case-insensitive and validated at checkout."
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
              api.mutate(editing ? 'coupon.update' : 'coupon.create', { id: editing?.id });
              setCreating(false);
              setEditing(null);
            }}>
            
              {editing ? 'Save coupon' : 'Create coupon'}
            </Button>
          </>
        }>
        
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="coupon-code">Code</Label>
            <Input id="coupon-code" defaultValue={editing?.code} placeholder="CHECKDIN20" />
          </div>
          <div>
            <Label htmlFor="coupon-type">Discount type</Label>
            <Select id="coupon-type" options={['Percentage', 'Flat']} defaultValue={editing?.type} />
          </div>
          <div>
            <Label htmlFor="coupon-value">Value</Label>
            <Input id="coupon-value" type="number" defaultValue={editing?.value} />
          </div>
          <div>
            <Label htmlFor="coupon-cap">Max discount (₹)</Label>
            <Input id="coupon-cap" type="number" defaultValue={editing?.maxDiscount} />
          </div>
          <div>
            <Label htmlFor="coupon-min">Min booking (₹)</Label>
            <Input id="coupon-min" type="number" defaultValue={editing?.minBooking} />
          </div>
          <div>
            <Label htmlFor="coupon-limit">Redemption limit</Label>
            <Input id="coupon-limit" type="number" defaultValue={editing?.limit} />
          </div>
          <div>
            <Label htmlFor="coupon-from">Valid from</Label>
            <Input id="coupon-from" type="date" defaultValue={editing?.validFrom} />
          </div>
          <div>
            <Label htmlFor="coupon-to">Valid to</Label>
            <Input id="coupon-to" type="date" defaultValue={editing?.validTo} />
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="coupon-desc">Description</Label>
            <Textarea id="coupon-desc" rows={2} defaultValue={editing?.description} />
          </div>
        </div>
      </Modal>
    </div>);

}