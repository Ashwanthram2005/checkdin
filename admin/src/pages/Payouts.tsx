import React, { useMemo, useState } from 'react';
import { BanknoteIcon, CheckIcon, DownloadIcon, XIcon } from 'lucide-react';
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
import { partners } from '../data/partners';
import { formatCurrency, formatDate } from '../utils/format';
import type { Payout } from '../types';

const tabs = ['All', 'Pending', 'Approved', 'Completed', 'Failed'];
const periods = ['All periods', '01–15 Aug 2026', '16–31 Jul 2026'];

export function Payouts() {
  const { data, loading, error } = useMockQuery(api.getPayouts, []);
  const [tab, setTab] = useState('Pending');
  const [query, setQuery] = useState('');
  const [period, setPeriod] = useState('All periods');
  const [manualOpen, setManualOpen] = useState(false);
  const [rejecting, setRejecting] = useState<Payout | null>(null);

  const payouts = data ?? [];

  const counts = useMemo(() => {
    const result: Record<string, number> = { All: payouts.length };
    tabs.slice(1).forEach((status) => {
      result[status] = payouts.filter((payout) => payout.status === status).length;
    });
    return result;
  }, [payouts]);

  const rows = useMemo(
    () =>
    payouts.filter((payout) => {
      if (tab !== 'All' && payout.status !== tab) return false;
      if (period !== 'All periods' && payout.period !== period) return false;
      if (!query) return true;
      const needle = query.toLowerCase();
      return payout.reference.toLowerCase().includes(needle) || payout.partnerName.toLowerCase().includes(needle);
    }),
    [payouts, tab, period, query]
  );

  const totals = useMemo(
    () =>
    tabs.slice(1).map((status) => ({
      label: `${status} payouts`,
      value: formatCurrency(
        payouts.filter((payout) => payout.status === status).reduce((sum, payout) => sum + payout.net, 0),
        true
      ),
      count: payouts.filter((payout) => payout.status === status).length
    })),
    [payouts]
  );

  const columns: Column<Payout>[] = [
  {
    key: 'reference',
    header: 'Reference',
    render: (row) =>
    <div>
          <MonoCell>{row.reference}</MonoCell>
          <p className="text-xs text-muted">{row.period}</p>
        </div>,

    sortValue: (row) => row.reference
  },
  {
    key: 'partner',
    header: 'Partner',
    render: (row) => <NameCell primary={row.partnerName} secondary={row.partnerId} />,
    sortValue: (row) => row.partnerName
  },
  {
    key: 'gross',
    header: 'Gross',
    align: 'right',
    render: (row) => <span className="tabular-nums text-muted">{formatCurrency(row.gross)}</span>,
    sortValue: (row) => row.gross,
    hideBelow: 'md'
  },
  {
    key: 'deductions',
    header: 'Commission + GST',
    align: 'right',
    render: (row) =>
    <StackedCell
      align="right"
      primary={<span className="tabular-nums">−{formatCurrency(row.commission + row.tax)}</span>}
      secondary={`GST ${formatCurrency(row.tax)}`} />,


    sortValue: (row) => row.commission + row.tax,
    hideBelow: 'lg'
  },
  {
    key: 'net',
    header: 'Net payout',
    align: 'right',
    render: (row) => <span className="font-semibold tabular-nums text-ink">{formatCurrency(row.net)}</span>,
    sortValue: (row) => row.net
  },
  {
    key: 'requested',
    header: 'Requested',
    render: (row) =>
    <StackedCell
      primary={<span className="text-[13px] text-muted">{formatDate(row.requestedAt)}</span>}
      secondary={row.utr ? <span className="font-mono text-xs">{row.utr}</span> : undefined} />,


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
      { label: 'Approve payout', onSelect: () => api.mutate('payout.approve', { id: row.id }) },
      { label: 'Reject payout', onSelect: () => setRejecting(row) },
      { label: 'Retry transfer', onSelect: () => api.mutate('payout.retry', { id: row.id }) },
      { label: 'Download advice', onSelect: () => api.mutate('payout.advice', { id: row.id }) }]
      } />


  }];


  return (
    <div>
      <PageHeader
        title="Payouts"
        subtitle="Partner settlements grouped by cycle, with commission and GST already deducted."
        actions={
        <>
            <Button icon={DownloadIcon}>Export</Button>
            <Button variant="primary" icon={BanknoteIcon} onClick={() => setManualOpen(true)}>
              Manual payout
            </Button>
          </>
        } />
      

      <div className="mb-4 grid grid-cols-2 gap-4 xl:grid-cols-4">
        {totals.map((total) =>
        <Card key={total.label} className="px-5 py-4">
            <p className="text-[13px] font-medium text-muted">{total.label}</p>
            <p className="mt-0.5 text-2xl font-bold tracking-tight text-ink">{total.value}</p>
            <p className="mt-1 text-xs text-muted">{total.count} settlements</p>
          </Card>
        )}
      </div>

      <Card>
        <Tabs tabs={tabs} value={tab} onChange={setTab} counts={counts} />
        <Toolbar>
          <SearchInput
            className="sm:max-w-xs sm:flex-1"
            placeholder="Search reference or partner…"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            aria-label="Search payouts" />
          
          <div className="flex gap-2 sm:ml-auto">
            <Select options={periods} value={period} onChange={(event) => setPeriod(event.target.value)} aria-label="Filter by period" />
            {tab === 'Pending' ?
            <Button variant="primary" icon={CheckIcon} onClick={() => api.mutate('payout.approveAll', { count: rows.length })}>
                Approve all
              </Button> :
            null}
          </div>
        </Toolbar>
        {loading ?
        <TableSkeleton rows={8} /> :
        error ?
        <ErrorState message={error} /> :

        <DataTable columns={columns} rows={rows} rowKey={(row) => row.id} pageSize={8} emptyLabel="No payouts in this state" />
        }
      </Card>

      <Modal
        open={manualOpen}
        onClose={() => setManualOpen(false)}
        title="Manual payout"
        description="Use this only when a cycle transfer has failed and finance has verified the bank details."
        footer={
        <>
            <Button onClick={() => setManualOpen(false)}>Cancel</Button>
            <Button
            variant="primary"
            onClick={() => {
              api.mutate('payout.manual');
              setManualOpen(false);
            }}>
            
              Initiate transfer
            </Button>
          </>
        }>
        
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Label htmlFor="manual-partner">Partner</Label>
            <Select id="manual-partner" options={partners.map((partner) => `${partner.name} — ${partner.company}`)} />
          </div>
          <div>
            <Label htmlFor="manual-amount">Amount (₹)</Label>
            <Input id="manual-amount" type="number" placeholder="120000" />
          </div>
          <div>
            <Label htmlFor="manual-mode">Transfer mode</Label>
            <Select id="manual-mode" options={['IMPS', 'NEFT', 'RTGS', 'UPI']} />
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="manual-note">Justification</Label>
            <Textarea id="manual-note" placeholder="Cycle PO/2026/08/1104 failed twice — bank confirmed IFSC change." />
          </div>
        </div>
      </Modal>

      <Modal
        open={Boolean(rejecting)}
        onClose={() => setRejecting(null)}
        title={`Reject ${rejecting?.reference ?? ''}`}
        description="The partner is notified and the amount rolls into the next cycle."
        width="sm"
        footer={
        <>
            <Button onClick={() => setRejecting(null)}>Cancel</Button>
            <Button
            variant="danger"
            icon={XIcon}
            onClick={() => {
              api.mutate('payout.reject', { id: rejecting?.id });
              setRejecting(null);
            }}>
            
              Reject payout
            </Button>
          </>
        }>
        
        <Label htmlFor="payout-reason">Reason</Label>
        <Select
          id="payout-reason"
          options={['Bank details unverified', 'KYC incomplete', 'Open dispute on bookings', 'Chargeback hold']} />
        
      </Modal>
    </div>);

}