import React, { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { DownloadIcon } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { PageHeader, Toolbar } from '../components/ui/PageHeader';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { SearchInput, Select } from '../components/ui/Field';
import { Tabs } from '../components/ui/Tabs';
import { DataTable, type Column } from '../components/ui/DataTable';
import { NameCell, RowActions, StackedCell } from '../components/ui/Cells';
import { TableSkeleton, ErrorState } from '../components/ui/LoadingState';
import { useMockQuery } from '../hooks/useMockQuery';
import { api } from '../services/api';
import { formatCurrency, formatDate } from '../utils/format';
import type { Customer } from '../types';

const tabs = ['All', 'Active', 'Unverified', 'Suspended', 'Banned'];
const sortOptions = ['Highest spend', 'Most bookings', 'Newest', 'Most cancellations'];

export function Customers() {
  const navigate = useNavigate();
  const { data, loading, error } = useMockQuery(api.getCustomers, []);
  const [params] = useSearchParams();
  const [tab, setTab] = useState(params.get('segment') ?? params.get('status') ?? 'All');
  const [query, setQuery] = useState(params.get('q') ?? '');
  const [sort, setSort] = useState(sortOptions[0]);

  const customers = data ?? [];

  const counts = useMemo(() => {
    const result: Record<string, number> = { All: customers.length };
    tabs.slice(1).forEach((status) => {
      result[status] = customers.filter((customer) => customer.status === status).length;
    });
    return result;
  }, [customers]);

  const rows = useMemo(() => {
    const filtered = customers.filter((customer) => {
      if (tab !== 'All' && customer.status !== tab) return false;
      if (!query) return true;
      const needle = query.toLowerCase();
      return (
        customer.name.toLowerCase().includes(needle) ||
        customer.email.toLowerCase().includes(needle) ||
        customer.phone.includes(needle));

    });
    const sorted = [...filtered];
    if (sort === 'Highest spend') sorted.sort((a, b) => b.spend - a.spend);
    if (sort === 'Most bookings') sorted.sort((a, b) => b.bookings - a.bookings);
    if (sort === 'Newest') sorted.sort((a, b) => b.joinedAt.localeCompare(a.joinedAt));
    if (sort === 'Most cancellations') sorted.sort((a, b) => b.cancellations - a.cancellations);
    return sorted;
  }, [customers, tab, query, sort]);

  const columns: Column<Customer>[] = [
  {
    key: 'name',
    header: 'Customer',
    render: (row) => <NameCell primary={row.name} secondary={row.id} />,
    sortValue: (row) => row.name
  },
  {
    key: 'contact',
    header: 'Contact',
    render: (row) => <StackedCell primary={row.email} secondary={row.phone} />,
    sortValue: (row) => row.email,
    hideBelow: 'md'
  },
  { key: 'city', header: 'City', render: (row) => row.city, sortValue: (row) => row.city, hideBelow: 'lg' },
  {
    key: 'bookings',
    header: 'Bookings',
    align: 'right',
    render: (row) =>
    <StackedCell
      align="right"
      primary={<span className="tabular-nums">{row.bookings}</span>}
      secondary={`${row.cancellations} cancelled`} />,


    sortValue: (row) => row.bookings
  },
  {
    key: 'spend',
    header: 'Total spend',
    align: 'right',
    render: (row) => <span className="font-semibold tabular-nums text-ink">{formatCurrency(row.spend)}</span>,
    sortValue: (row) => row.spend
  },
  {
    key: 'last',
    header: 'Last booking',
    render: (row) => <span className="text-[13px] text-muted">{formatDate(row.lastBookingAt)}</span>,
    sortValue: (row) => row.lastBookingAt,
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
      { label: 'Open profile', onSelect: () => navigate(`/customers/${row.id}`) },
      { label: 'Verify account', onSelect: () => api.mutate('customer.verify', { id: row.id }) },
      { label: 'Suspend', onSelect: () => api.mutate('customer.suspend', { id: row.id }) },
      { label: 'Ban account', danger: true, onSelect: () => api.mutate('customer.ban', { id: row.id }) }]
      } />


  }];


  return (
    <div>
      <PageHeader
        title="Customers"
        subtitle="Guest accounts, lifetime value, and cancellation behaviour."
        actions={<Button icon={DownloadIcon}>Export</Button>} />
      

      <Card>
        <Tabs tabs={tabs} value={tab} onChange={setTab} counts={counts} />
        <Toolbar>
          <SearchInput
            className="sm:max-w-xs sm:flex-1"
            placeholder="Search name, email, phone…"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            aria-label="Search customers" />
          
          <div className="sm:ml-auto">
            <Select options={sortOptions} value={sort} onChange={(event) => setSort(event.target.value)} aria-label="Sort customers" />
          </div>
        </Toolbar>
        {loading ?
        <TableSkeleton rows={8} /> :
        error ?
        <ErrorState message={error} /> :

        <DataTable
          columns={columns}
          rows={rows}
          rowKey={(row) => row.id}
          onRowClick={(row) => navigate(`/customers/${row.id}`)}
          pageSize={8}
          emptyLabel="No customers match these filters" />

        }
      </Card>
    </div>);

}