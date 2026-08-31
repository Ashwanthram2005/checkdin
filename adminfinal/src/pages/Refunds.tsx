import React, { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CheckIcon, DownloadIcon, XIcon } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { PageHeader, Toolbar } from '../components/ui/PageHeader';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Input, Label, SearchInput, Select, Textarea } from '../components/ui/Field';
import { Tabs } from '../components/ui/Tabs';
import { DataTable, type Column } from '../components/ui/DataTable';
import { MonoCell, NameCell, RowActions, StackedCell } from '../components/ui/Cells';
import { Modal } from '../components/ui/Modal';
import { TableSkeleton, ErrorState } from '../components/ui/LoadingState';
import { useMockQuery } from '../hooks/useMockQuery';
import { api } from '../services/api';
import { formatCurrency, formatDate } from '../utils/format';
import type { Refund } from '../types';

const tabs = ['All', 'Requested', 'Approved', 'Processed', 'Rejected'];
const typeOptions = ['All types', 'Full', 'Partial'];

export function Refunds() {
  const { data, loading, error } = useMockQuery(api.getRefunds, []);
  const [params] = useSearchParams();
  const [tab, setTab] = useState(params.get('status') ?? 'Requested');
  const [query, setQuery] = useState(params.get('q') ?? '');
  const [type, setType] = useState('All types');
  const [approving, setApproving] = useState<Refund | null>(null);
  const [rejecting, setRejecting] = useState<Refund | null>(null);

  const refunds = data?.data ?? []

  const counts = useMemo(() => {
    const result: Record<string, number> = { All: refunds.length };
    tabs.slice(1).forEach((status) => {
      result[status] = refunds.filter((refund) => refund.status === status).length;
    });
    return result;
  }, [refunds]);

  const rows = useMemo(
    () =>
    refunds.filter((refund) => {
      if (tab !== 'All' && refund.status !== tab) return false;
      if (type !== 'All types' && refund.type !== type) return false;
      if (!query) return true;
      const needle = query.toLowerCase();
      return (
        refund.reference.toLowerCase().includes(needle) ||
        refund.bookingCode.toLowerCase().includes(needle) ||
        refund.customerName.toLowerCase().includes(needle));

    }),
    [refunds, tab, type, query]
  );

  const openValue = refunds.
  filter((refund) => refund.status === 'Requested').
  reduce((sum, refund) => sum + refund.refundAmount, 0);

  const columns: Column<Refund>[] = [
  {
    key: 'reference',
    header: 'Refund',
    render: (row) =>
    <div>
          <MonoCell>{row.reference}</MonoCell>
          <p className="text-xs text-muted">{row.bookingCode}</p>
        </div>,

    sortValue: (row) => row.reference
  },
  {
    key: 'customer',
    header: 'Customer',
    render: (row) => <NameCell primary={row.customerName} secondary={row.propertyName} />,
    sortValue: (row) => row.customerName
  },
  {
    key: 'reason',
    header: 'Reason',
    render: (row) => <span className="text-[13px] text-muted">{row.reason}</span>,
    sortValue: (row) => row.reason,
    hideBelow: 'lg'
  },
  {
    key: 'amount',
    header: 'Refund',
    align: 'right',
    render: (row) =>
    <StackedCell
      align="right"
      primary={<span className="font-semibold tabular-nums">{formatCurrency(row.refundAmount)}</span>}
      secondary={`of ${formatCurrency(row.bookingAmount)}`} />,


    sortValue: (row) => row.refundAmount
  },
  { key: 'type', header: 'Type', render: (row) => <Badge tone="neutral">{row.type}</Badge>, sortValue: (row) => row.type, hideBelow: 'sm' },
  {
    key: 'requested',
    header: 'Requested',
    render: (row) => <span className="text-[13px] text-muted">{formatDate(row.requestedAt)}</span>,
    sortValue: (row) => row.requestedAt,
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
      { label: 'Approve refund', onSelect: () => setApproving(row) },
      { label: 'Reject refund', onSelect: () => setRejecting(row) },
      { label: 'View booking', onSelect: () => api.mutate('refund.viewBooking', { code: row.bookingCode }) }]
      } />


  }];


  return (
    <div>
      <PageHeader
        title="Refunds"
        subtitle="Requests awaiting a decision, plus the full processed history."
        actions={<Button icon={DownloadIcon}>Export</Button>} />
      

      <div className="mb-4 grid grid-cols-2 gap-4 xl:grid-cols-4">
        <Card className="border-warning/50 bg-warning/[0.06] px-5 py-4">
          <p className="text-[13px] font-medium text-muted">Awaiting decision</p>
          <p className="mt-0.5 text-2xl font-bold tracking-tight text-ink">{formatCurrency(openValue)}</p>
          <p className="mt-1 text-xs text-muted">{counts.Requested ?? 0} requests</p>
        </Card>
        {['Approved', 'Processed', 'Rejected'].map((status) =>
        <Card key={status} className="px-5 py-4">
            <p className="text-[13px] font-medium text-muted">{status}</p>
            <p className="mt-0.5 text-2xl font-bold tracking-tight text-ink">
              {formatCurrency(
              refunds.filter((refund) => refund.status === status).reduce((sum, refund) => sum + refund.refundAmount, 0)
            )}
            </p>
            <p className="mt-1 text-xs text-muted">{counts[status] ?? 0} requests</p>
          </Card>
        )}
      </div>

      <Card>
        <Tabs tabs={tabs} value={tab} onChange={setTab} counts={counts} />
        <Toolbar>
          <SearchInput
            className="sm:max-w-xs sm:flex-1"
            placeholder="Search refund, booking, customer…"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            aria-label="Search refunds" />
          
          <div className="sm:ml-auto">
            <Select options={typeOptions} value={type} onChange={(event) => setType(event.target.value)} aria-label="Filter by refund type" />
          </div>
        </Toolbar>
        {loading ?
        <TableSkeleton rows={8} /> :
        error ?
        <ErrorState message={error} /> :

        <DataTable columns={columns} rows={rows} rowKey={(row) => row.id} pageSize={8} emptyLabel="No refunds in this state" />
        }
      </Card>

      <Modal
        open={Boolean(approving)}
        onClose={() => setApproving(null)}
        title={`Approve ${approving?.reference ?? ''}`}
        description="Approved refunds are pushed to the payment gateway within the hour."
        footer={
        <>
            <Button onClick={() => setApproving(null)}>Cancel</Button>
            <Button
            variant="primary"
            icon={CheckIcon}
            onClick={() => {
              api.mutate('refund.approve', { id: approving?.id });
              setApproving(null);
            }}>
            
              Approve refund
            </Button>
          </>
        }>
        
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="refund-type">Refund type</Label>
            <Select id="refund-type" options={['Full refund', 'Partial refund']} defaultValue={approving?.type === 'Full' ? 'Full refund' : 'Partial refund'} />
          </div>
          <div>
            <Label htmlFor="refund-amount">Amount (₹)</Label>
            <Input id="refund-amount" type="number" defaultValue={approving?.refundAmount} />
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="refund-note">Note for the customer</Label>
            <Textarea id="refund-note" placeholder="Refund approved — expect credit in 5–7 working days." />
          </div>
        </div>
      </Modal>

      <Modal
        open={Boolean(rejecting)}
        onClose={() => setRejecting(null)}
        title={`Reject ${rejecting?.reference ?? ''}`}
        description="The customer receives your reason and can reply on the support thread."
        width="sm"
        footer={
        <>
            <Button onClick={() => setRejecting(null)}>Cancel</Button>
            <Button
            variant="danger"
            icon={XIcon}
            onClick={() => {
              api.mutate('refund.reject', { id: rejecting?.id });
              setRejecting(null);
            }}>
            
              Reject refund
            </Button>
          </>
        }>
        
        <Label htmlFor="reject-refund-reason">Reason</Label>
        <Select
          id="reject-refund-reason"
          options={[
          'Outside cancellation window',
          'Stay was consumed',
          'No-show as per property',
          'Duplicate request',
          'Suspected abuse']
          } />
        
      </Modal>
    </div>);

}
