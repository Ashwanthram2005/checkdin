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
import { MonoCell, NameCell, RowActions, StackedCell } from '../components/ui/Cells';
import { TableSkeleton, ErrorState } from '../components/ui/LoadingState';
import { useMockQuery } from '../hooks/useMockQuery';
import { api } from '../services/api';
import { bookingStatuses } from '../data/bookings';
import { cities } from '../data/properties';
import { formatCurrency, formatDate } from '../utils/format';
import type { Booking } from '../types';

const tabs = ['All', ...bookingStatuses];
const sources = ['All sources', 'Website', 'Android App', 'iOS App', 'Walk-in', 'Partner Desk'];

export function Bookings() {
  const navigate = useNavigate();
  const { data, loading, error } = useMockQuery(api.getBookings, []);
  const [params] = useSearchParams();
  const [tab, setTab] = useState(params.get('status') ?? 'All');
  const [query, setQuery] = useState(params.get('q') ?? '');
  const [city, setCity] = useState('All cities');
  const [source, setSource] = useState('All sources');

  const bookings = data ?? [];

  const counts = useMemo(() => {
    const result: Record<string, number> = { All: bookings.length };
    bookingStatuses.forEach((status) => {
      result[status] = bookings.filter((booking) => booking.status === status).length;
    });
    return result;
  }, [bookings]);

  const rows = useMemo(
    () =>
    bookings.filter((booking) => {
      if (tab !== 'All' && booking.status !== tab) return false;
      if (city !== 'All cities' && booking.city !== city) return false;
      if (source !== 'All sources' && booking.source !== source) return false;
      if (!query) return true;
      const needle = query.toLowerCase();
      return (
        booking.code.toLowerCase().includes(needle) ||
        booking.customerName.toLowerCase().includes(needle) ||
        booking.customerPhone.includes(needle) ||
        booking.propertyName.toLowerCase().includes(needle));

    }),
    [bookings, tab, city, source, query]
  );

  const columns: Column<Booking>[] = [
  {
    key: 'code',
    header: 'Booking',
    render: (row) =>
    <div>
          <MonoCell>{row.code}</MonoCell>
          <p className="text-xs text-muted">{row.source}</p>
        </div>,

    sortValue: (row) => row.code
  },
  {
    key: 'guest',
    header: 'Guest',
    render: (row) => <NameCell primary={row.customerName} secondary={row.customerPhone} />,
    sortValue: (row) => row.customerName
  },
  {
    key: 'property',
    header: 'Property & room',
    render: (row) => <StackedCell primary={row.propertyName} secondary={`${row.roomName} · ${row.city}`} />,
    sortValue: (row) => row.propertyName,
    hideBelow: 'md'
  },
  {
    key: 'stay',
    header: 'Stay',
    render: (row) =>
    <StackedCell
      primary={`${formatDate(row.checkIn)} → ${formatDate(row.checkOut)}`}
      secondary={`${row.nights} night${row.nights > 1 ? 's' : ''} · ${row.guests} guests`} />,


    sortValue: (row) => row.checkIn,
    hideBelow: 'lg'
  },
  {
    key: 'amount',
    header: 'Amount',
    align: 'right',
    render: (row) =>
    <StackedCell
      align="right"
      primary={<span className="font-semibold tabular-nums">{formatCurrency(row.amount)}</span>}
      secondary={row.paymentStatus} />,


    sortValue: (row) => row.amount
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
      { label: 'View details', onSelect: () => navigate(`/bookings/${row.id}`) },
      { label: 'Modify booking', onSelect: () => navigate(`/bookings/${row.id}`) },
      { label: 'Force check-in', onSelect: () => api.mutate('booking.forceCheckIn', { id: row.id }) },
      { label: 'Cancel booking', danger: true, onSelect: () => api.mutate('booking.cancel', { id: row.id }) }]
      } />


  }];


  return (
    <div>
      <PageHeader
        title="Bookings"
        subtitle="Every reservation across the platform, with live payment and stay status."
        actions={
        <>
            <Button icon={DownloadIcon}>Export CSV</Button>
            <Button variant="primary" icon={PlusIcon}>
              New booking
            </Button>
          </>
        } />
      

      <Card>
        <Tabs tabs={tabs} value={tab} onChange={setTab} counts={counts} />
        <Toolbar>
          <SearchInput
            className="sm:max-w-xs sm:flex-1"
            placeholder="Search code, guest, phone, property…"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            aria-label="Search bookings" />
          
          <div className="flex gap-2 sm:ml-auto">
            <Select options={cities} value={city} onChange={(event) => setCity(event.target.value)} aria-label="Filter by city" />
            <Select
              options={sources}
              value={source}
              onChange={(event) => setSource(event.target.value)}
              aria-label="Filter by source" />
            
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
          onRowClick={(row) => navigate(`/bookings/${row.id}`)}
          pageSize={10}
          emptyLabel="No bookings match these filters" />

        }
      </Card>
    </div>);

}