import React, { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { DownloadIcon, PlusIcon } from 'lucide-react';
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
import type { Partner } from '../types';

const tabs = ['All', 'Active', 'Pending KYC', 'Suspended'];

export function Partners() {
  const navigate = useNavigate();
  const { data, loading, error } = useMockQuery(api.getPartners, []);
  const [params] = useSearchParams();
  const [tab, setTab] = useState(params.get('status') ?? 'All');
  const [query, setQuery] = useState(params.get('q') ?? '');
  const [city, setCity] = useState(params.get('city') ?? 'All cities');

  const partners = data ?? [];
  const cityOptions = ['All cities', ...Array.from(new Set(partners.map((partner) => partner.city)))];

  const counts = useMemo(() => {
    const result: Record<string, number> = { All: partners.length };
    tabs.slice(1).forEach((status) => {
      result[status] = partners.filter((partner) => partner.status === status).length;
    });
    return result;
  }, [partners]);

  const rows = useMemo(
    () =>
    partners.filter((partner) => {
      if (tab !== 'All' && partner.status !== tab) return false;
      if (city !== 'All cities' && partner.city !== city) return false;
      if (!query) return true;
      const needle = query.toLowerCase();
      return (
        partner.name.toLowerCase().includes(needle) ||
        partner.company.toLowerCase().includes(needle) ||
        partner.email.toLowerCase().includes(needle) ||
        partner.phone.includes(needle));

    }),
    [partners, tab, city, query]
  );

  const columns: Column<Partner>[] = [
  {
    key: 'name',
    header: 'Partner',
    render: (row) => <NameCell primary={row.name} secondary={row.company} />,
    sortValue: (row) => row.name
  },
  {
    key: 'contact',
    header: 'Contact',
    render: (row) => <StackedCell primary={row.email} secondary={row.phone} />,
    sortValue: (row) => row.email,
    hideBelow: 'md'
  },
  {
    key: 'properties',
    header: 'Properties',
    align: 'right',
    render: (row) => <span className="tabular-nums">{row.properties}</span>,
    sortValue: (row) => row.properties
  },
  {
    key: 'revenue',
    header: 'Revenue',
    align: 'right',
    render: (row) =>
    <StackedCell
      align="right"
      primary={<span className="font-semibold tabular-nums">{formatCurrency(row.revenue, true)}</span>}
      secondary={`${row.commissionRate}% commission`} />,


    sortValue: (row) => row.revenue
  },
  {
    key: 'joined',
    header: 'Joined',
    render: (row) => <span className="text-[13px] text-muted">{formatDate(row.joinedAt)}</span>,
    sortValue: (row) => row.joinedAt,
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
      { label: 'Open profile', onSelect: () => navigate(`/partners/${row.id}`) },
      { label: 'Approve KYC', onSelect: () => api.mutate('partner.approve', { id: row.id }) },
      { label: 'Activate', onSelect: () => api.mutate('partner.activate', { id: row.id }) },
      { label: 'Reset password', onSelect: () => api.mutate('partner.resetPassword', { id: row.id }) },
      { label: 'Suspend', danger: true, onSelect: () => api.mutate('partner.suspend', { id: row.id }) }]
      } />


  }];


  return (
    <div>
      <PageHeader
        title="Partners"
        subtitle="Property owners and operators, their inventory, and payout standing."
        actions={
        <>
            <Button icon={DownloadIcon}>Export</Button>
            <Button variant="primary" icon={PlusIcon}>
              Invite partner
            </Button>
          </>
        } />
      

      <Card>
        <Tabs tabs={tabs} value={tab} onChange={setTab} counts={counts} />
        <Toolbar>
          <SearchInput
            className="sm:max-w-xs sm:flex-1"
            placeholder="Search partner, company, email…"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            aria-label="Search partners" />
          
          <div className="sm:ml-auto">
            <Select options={cityOptions} value={city} onChange={(event) => setCity(event.target.value)} aria-label="Filter by city" />
          </div>
        </Toolbar>
        {loading ?
        <TableSkeleton rows={7} /> :
        error ?
        <ErrorState message={error} /> :

        <DataTable
          columns={columns}
          rows={rows}
          rowKey={(row) => row.id}
          onRowClick={(row) => navigate(`/partners/${row.id}`)}
          pageSize={8}
          emptyLabel="No partners match these filters" />

        }
      </Card>
    </div>);

}