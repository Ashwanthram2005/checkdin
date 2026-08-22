import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeftIcon, BanIcon, MailIcon, PhoneIcon, ShieldCheckIcon, UserXIcon } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Tabs } from '../components/ui/Tabs';
import { Avatar } from '../components/ui/Primitives';
import { DataTable, type Column } from '../components/ui/DataTable';
import { MonoCell, StackedCell } from '../components/ui/Cells';
import { BlockSkeleton, ErrorState } from '../components/ui/LoadingState';
import { useMockQuery } from '../hooks/useMockQuery';
import { api } from '../services/api';
import { bookingsForCustomer } from '../data/bookings';
import { refunds } from '../data/finance';
import { tickets } from '../data/engagement';
import { formatCurrency, formatDate } from '../utils/format';
import type { Booking } from '../types';

const tabs = ['Booking history', 'Refunds', 'Support tickets'];

export function CustomerDetail() {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const { data: customer, loading, error } = useMockQuery(() => api.getCustomer(id), [id]);
  const [tab, setTab] = useState('Booking history');

  if (loading) {
    return (
      <div className="space-y-4">
        <BlockSkeleton className="h-24" />
        <BlockSkeleton className="h-72" />
      </div>);

  }

  if (error || !customer) {
    return (
      <Card>
        <ErrorState message={error ?? `We could not find customer ${id}.`} onRetry={() => navigate('/customers')} />
      </Card>);

  }

  const customerBookings = bookingsForCustomer(customer.id);
  const customerRefunds = refunds.filter((refund) => refund.customerName === customer.name);
  const customerTickets = tickets.filter((ticket) => ticket.requester === customer.name);

  const bookingColumns: Column<Booking>[] = [
  { key: 'code', header: 'Booking', render: (row) => <MonoCell>{row.code}</MonoCell>, sortValue: (row) => row.code },
  {
    key: 'property',
    header: 'Property',
    render: (row) => <StackedCell primary={row.propertyName} secondary={row.roomName} />,
    sortValue: (row) => row.propertyName
  },
  {
    key: 'stay',
    header: 'Stay',
    render: (row) => <StackedCell primary={formatDate(row.checkIn)} secondary={`${row.nights}N`} />,
    sortValue: (row) => row.checkIn,
    hideBelow: 'md'
  },
  {
    key: 'amount',
    header: 'Amount',
    align: 'right',
    render: (row) => <span className="font-semibold tabular-nums text-ink">{formatCurrency(row.amount)}</span>,
    sortValue: (row) => row.amount
  },
  { key: 'status', header: 'Status', align: 'right', render: (row) => <Badge>{row.status}</Badge>, sortValue: (row) => row.status }];


  return (
    <div>
      <Link
        to="/customers"
        className="mb-4 inline-flex items-center gap-1.5 text-[13px] font-medium text-muted transition-colors duration-150 ease-smooth hover:text-ink">
        
        <ArrowLeftIcon className="h-3.5 w-3.5" /> All customers
      </Link>

      <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <Avatar name={customer.name} size="lg" />
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-2xl font-bold tracking-tight text-ink">{customer.name}</h1>
              <Badge>{customer.status}</Badge>
              {customer.verified ? <Badge tone="positive">Verified</Badge> : <Badge tone="warning">Unverified</Badge>}
            </div>
            <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted">
              <span className="inline-flex items-center gap-1">
                <MailIcon className="h-3.5 w-3.5" /> {customer.email}
              </span>
              <span className="inline-flex items-center gap-1">
                <PhoneIcon className="h-3.5 w-3.5" /> {customer.phone}
              </span>
              <span>Joined {formatDate(customer.joinedAt)}</span>
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button icon={ShieldCheckIcon} onClick={() => api.mutate('customer.verify', { id })}>
            Verify account
          </Button>
          <Button icon={BanIcon} onClick={() => api.mutate('customer.suspend', { id })}>
            Suspend
          </Button>
          <Button variant="danger" icon={UserXIcon} onClick={() => api.mutate('customer.ban', { id })}>
            Ban
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
        { label: 'Total bookings', value: String(customer.bookings) },
        { label: 'Total spend', value: formatCurrency(customer.spend) },
        { label: 'Cancellations', value: String(customer.cancellations) },
        { label: 'Avg booking value', value: formatCurrency(Math.round(customer.spend / customer.bookings)) }].
        map((stat) =>
        <Card key={stat.label} className="px-5 py-4">
            <p className="text-[13px] font-medium text-muted">{stat.label}</p>
            <p className="mt-0.5 text-2xl font-bold tracking-tight text-ink">{stat.value}</p>
          </Card>
        )}
      </div>

      <Card className="mt-4">
        <Tabs
          tabs={tabs}
          value={tab}
          onChange={setTab}
          counts={{
            'Booking history': customerBookings.length,
            Refunds: customerRefunds.length,
            'Support tickets': customerTickets.length
          }} />
        

        {tab === 'Booking history' ?
        <DataTable
          columns={bookingColumns}
          rows={customerBookings}
          rowKey={(row) => row.id}
          onRowClick={(row) => navigate(`/bookings/${row.id}`)}
          pageSize={6}
          emptyLabel="No bookings on this account" /> :

        null}

        {tab === 'Refunds' ?
        customerRefunds.length ?
        <ul className="divide-y divide-line">
              {customerRefunds.map((refund) =>
          <li key={refund.id} className="flex flex-wrap items-center gap-3 px-5 py-3.5">
                  <div className="min-w-0 flex-1">
                    <p className="text-[13px] font-semibold text-ink">
                      {refund.reference} · {refund.bookingCode}
                    </p>
                    <p className="text-xs text-muted">
                      {refund.reason} · requested {formatDate(refund.requestedAt)}
                    </p>
                  </div>
                  <span className="font-semibold tabular-nums text-ink">{formatCurrency(refund.refundAmount)}</span>
                  <Badge>{refund.type}</Badge>
                  <Badge>{refund.status}</Badge>
                </li>
          )}
            </ul> :

        <p className="px-5 py-12 text-center text-[13px] text-muted">No refunds raised by this customer.</p> :

        null}

        {tab === 'Support tickets' ?
        customerTickets.length ?
        <ul className="divide-y divide-line">
              {customerTickets.map((ticket) =>
          <li key={ticket.id} className="flex flex-wrap items-center gap-3 px-5 py-3.5">
                  <div className="min-w-0 flex-1">
                    <p className="text-[13px] font-semibold text-ink">{ticket.subject}</p>
                    <p className="text-xs text-muted">
                      {ticket.reference} · {ticket.category} · updated {formatDate(ticket.updatedAt)}
                    </p>
                  </div>
                  <Badge>{ticket.priority}</Badge>
                  <Badge>{ticket.status}</Badge>
                </li>
          )}
            </ul> :

        <p className="px-5 py-12 text-center text-[13px] text-muted">No support tickets from this customer.</p> :

        null}
      </Card>
    </div>);

}