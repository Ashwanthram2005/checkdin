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
import { ProgressBar } from '../components/ui/Primitives';
import { TableSkeleton, ErrorState } from '../components/ui/LoadingState';
import { Modal } from '../components/ui/Modal';
import { Textarea, Label } from '../components/ui/Field';
import { useMockQuery } from '../hooks/useMockQuery';
import { api } from '../services/api';
import { cities } from '../data/properties';
import { formatCurrency } from '../utils/format';
import type { Property } from '../types';

const tabs = ['All', 'Active', 'Pending Approval', 'Suspended', 'Rejected'];
const types = ['All types', 'Hotel', 'Service Apartment', 'Hostel', 'Villa'];

export function Properties() {
  const navigate = useNavigate();
  const { data, loading, error } = useMockQuery(api.getProperties, []);
  const [params] = useSearchParams();
  const [tab, setTab] = useState(params.get('status') ?? 'All');
  const [query, setQuery] = useState(params.get('q') ?? '');
  const [city, setCity] = useState(params.get('city') ?? 'All cities');
  const [type, setType] = useState('All types');
  const [rejecting, setRejecting] = useState<Property | null>(null);

  const properties = data?.data ?? [];

  const counts = useMemo(() => {
    const result: Record<string, number> = { All: properties.length };
    tabs.slice(1).forEach((status) => {
      result[status] = properties.filter((property) => property.status === status).length;
    });
    return result;
  }, [properties]);

  const rows = useMemo(
    () =>
    properties.filter((property) => {
      if (tab !== 'All' && property.status !== tab) return false;
      if (city !== 'All cities' && property.city !== city) return false;
      if (type !== 'All types' && property.type !== type) return false;
      if (!query) return true;
      const needle = query.toLowerCase();
      return (
        property.name.toLowerCase().includes(needle) ||
        property.partnerName.toLowerCase().includes(needle) ||
        property.city.toLowerCase().includes(needle));

    }),
    [properties, tab, city, type, query]
  );

  const columns: Column<Property>[] = [
  {
    key: 'name',
    header: 'Property',
    render: (row) => <NameCell primary={row.name} secondary={`${row.type} · ${row.id}`} src={row.images[0]} />,
    sortValue: (row) => row.name
  },
  {
    key: 'city',
    header: 'City',
    render: (row) => <StackedCell primary={row.city} secondary={row.state} />,
    sortValue: (row) => row.city
  },
  {
    key: 'partner',
    header: 'Partner',
    render: (row) => <StackedCell primary={row.partnerName} secondary={row.partnerId} />,
    sortValue: (row) => row.partnerName,
    hideBelow: 'md'
  },
  {
    key: 'rooms',
    header: 'Rooms',
    align: 'right',
    render: (row) => <span className="tabular-nums">{row.rooms}</span>,
    sortValue: (row) => row.rooms
  },
  {
    key: 'occupancy',
    header: 'Occupancy',
    render: (row) => <ProgressBar value={row.occupancy} />,
    sortValue: (row) => row.occupancy,
    className: 'w-40',
    hideBelow: 'lg'
  },
  {
    key: 'revenue',
    header: 'Revenue',
    align: 'right',
    render: (row) =>
    <span className="font-semibold tabular-nums text-ink">{formatCurrency(row.revenue, true)}</span>,

    sortValue: (row) => row.revenue,
    hideBelow: 'sm'
  },
  {
    key: 'status',
    header: 'Status',
    render: (row) => <Badge>{row.status}</Badge>,
    sortValue: (row) => row.status
  },
  {
    key: 'actions',
    header: '',
    align: 'right',
    render: (row) =>
    <RowActions
      actions={[
      { label: 'Open property', onSelect: () => navigate(`/properties/${row.id}`) },
      { label: 'Approve listing', onSelect: () => api.mutate('property.approve', { id: row.id }) },
      { label: 'Reject listing', onSelect: () => setRejecting(row) },
      { label: 'Suspend', onSelect: () => api.mutate('property.suspend', { id: row.id }) },
      { label: 'Delete', danger: true, onSelect: () => api.mutate('property.delete', { id: row.id }) }]
      } />


  }];


  return (
    <div>
      <PageHeader
        title="Properties"
        subtitle="Listings, inventory size, and live occupancy for every partner property."
        actions={
        <>
            <Button icon={DownloadIcon}>Export</Button>
            <Button variant="primary" icon={PlusIcon}>
              Add property
            </Button>
          </>
        } />
      

      <Card>
        <Tabs tabs={tabs} value={tab} onChange={setTab} counts={counts} />
        <Toolbar>
          <SearchInput
            className="sm:max-w-xs sm:flex-1"
            placeholder="Search property, partner, city…"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            aria-label="Search properties" />
          
          <div className="flex gap-2 sm:ml-auto">
            <Select options={cities} value={city} onChange={(event) => setCity(event.target.value)} aria-label="Filter by city" />
            <Select options={types} value={type} onChange={(event) => setType(event.target.value)} aria-label="Filter by type" />
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
          onRowClick={(row) => navigate(`/properties/${row.id}`)}
          pageSize={8}
          emptyLabel="No properties match these filters" />

        }
      </Card>

      <Modal
        open={Boolean(rejecting)}
        onClose={() => setRejecting(null)}
        title={`Reject ${rejecting?.name ?? ''}`}
        description="The partner receives your reason and can resubmit after fixing it."
        width="sm"
        footer={
        <>
            <Button onClick={() => setRejecting(null)}>Cancel</Button>
            <Button
            variant="danger"
            onClick={() => {
              api.mutate('property.reject', { id: rejecting?.id });
              setRejecting(null);
            }}>
            
              Reject listing
            </Button>
          </>
        }>
        
        <Label htmlFor="reject-reason">Reason shared with partner</Label>
        <Textarea id="reject-reason" placeholder="e.g. Fire safety NOC has expired" />
      </Modal>
    </div>);

}
