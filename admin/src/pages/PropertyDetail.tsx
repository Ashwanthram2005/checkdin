import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeftIcon,
  BanIcon,
  CheckIcon,
  FileTextIcon,
  MapPinIcon,
  PencilIcon,
  StarIcon,
  Trash2Icon,
  XIcon } from
'lucide-react';
import { Card, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Tabs } from '../components/ui/Tabs';
import { DefinitionList, ProgressBar } from '../components/ui/Primitives';
import { DataTable, type Column } from '../components/ui/DataTable';
import { StackedCell } from '../components/ui/Cells';
import { BlockSkeleton, ErrorState } from '../components/ui/LoadingState';
import { RevenueAreaChart } from '../components/charts/Charts';
import { useMockQuery } from '../hooks/useMockQuery';
import { api } from '../services/api';
import { roomsForProperty } from '../data/rooms';
import { bookingsForProperty } from '../data/bookings';
import { reviews } from '../data/engagement';
import { revenueTrend } from '../data/analytics';
import { formatCurrency, formatDate } from '../utils/format';
import type { Room } from '../types';

const tabs = ['Overview', 'Rooms', 'Revenue', 'Reviews', 'Documents'];

export function PropertyDetail() {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const { data: property, loading, error } = useMockQuery(() => api.getProperty(id), [id]);
  const [tab, setTab] = useState('Overview');

  if (loading) {
    return (
      <div className="space-y-4">
        <BlockSkeleton className="h-24" />
        <BlockSkeleton className="h-80" />
      </div>);

  }

  if (error || !property) {
    return (
      <Card>
        <ErrorState message={error ?? `We could not find property ${id}.`} onRetry={() => navigate('/properties')} />
      </Card>);

  }

  const rooms = roomsForProperty(property.id);
  const propertyBookings = bookingsForProperty(property.id);
  const propertyReviews = reviews.filter((review) => review.propertyName === property.name);

  const roomColumns: Column<Room>[] = [
  { key: 'name', header: 'Room', render: (row) => <StackedCell primary={row.name} secondary={row.code} />, sortValue: (row) => row.name },
  { key: 'type', header: 'Type', render: (row) => row.type, sortValue: (row) => row.type },
  { key: 'floor', header: 'Floor', align: 'right', render: (row) => row.floor, sortValue: (row) => row.floor, hideBelow: 'sm' },
  { key: 'capacity', header: 'Sleeps', align: 'right', render: (row) => row.capacity, sortValue: (row) => row.capacity, hideBelow: 'sm' },
  {
    key: 'rate',
    header: 'Base rate',
    align: 'right',
    render: (row) => <span className="tabular-nums">{formatCurrency(row.baseRate)}</span>,
    sortValue: (row) => row.baseRate
  },
  { key: 'status', header: 'Status', align: 'right', render: (row) => <Badge>{row.status}</Badge>, sortValue: (row) => row.status }];


  return (
    <div>
      <Link
        to="/properties"
        className="mb-4 inline-flex items-center gap-1.5 text-[13px] font-medium text-muted transition-colors duration-150 ease-smooth hover:text-ink">
        
        <ArrowLeftIcon className="h-3.5 w-3.5" /> All properties
      </Link>

      <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-ink sm:text-[28px]">{property.name}</h1>
            <Badge>{property.status}</Badge>
          </div>
          <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted">
            <span className="inline-flex items-center gap-1">
              <MapPinIcon className="h-3.5 w-3.5" /> {property.address}, {property.city}
            </span>
            <span className="inline-flex items-center gap-1">
              <StarIcon className="h-3.5 w-3.5 text-warning" /> {property.rating} ({property.reviews} reviews)
            </span>
            <Link to={`/partners/${property.partnerId}`} className="text-info hover:underline">
              {property.partnerName}
            </Link>
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button icon={PencilIcon}>Edit</Button>
          {property.status === 'Pending Approval' ?
          <>
              <Button variant="primary" icon={CheckIcon} onClick={() => api.mutate('property.approve', { id })}>
                Approve
              </Button>
              <Button variant="danger" icon={XIcon} onClick={() => api.mutate('property.reject', { id })}>
                Reject
              </Button>
            </> :

          <Button icon={BanIcon} onClick={() => api.mutate('property.suspend', { id })}>
              Suspend
            </Button>
          }
          <Button variant="danger" icon={Trash2Icon} onClick={() => api.mutate('property.delete', { id })}>
            Delete
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.6fr_1fr]">
        <div className="overflow-hidden rounded-xl border border-line">
          <img src={property.images[0]} alt={`${property.name} exterior`} className="h-64 w-full object-cover sm:h-80" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          {property.images.slice(1, 5).map((image, index) =>
          <div key={image} className="overflow-hidden rounded-xl border border-line">
              <img src={image} alt={`${property.name} view ${index + 2}`} className="h-[7.5rem] w-full object-cover sm:h-[9.5rem]" />
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
        { label: 'Rooms', value: String(property.rooms) },
        { label: 'Occupancy', value: `${property.occupancy}%` },
        { label: 'Revenue (lifetime)', value: formatCurrency(property.revenue, true) },
        { label: 'Bookings on record', value: String(propertyBookings.length * 34) }].
        map((stat) =>
        <Card key={stat.label} className="px-5 py-4">
            <p className="text-[13px] font-medium text-muted">{stat.label}</p>
            <p className="mt-0.5 text-2xl font-bold tracking-tight text-ink">{stat.value}</p>
          </Card>
        )}
      </div>

      <Card className="mt-4">
        <Tabs tabs={tabs} value={tab} onChange={setTab} />

        {tab === 'Overview' ?
        <div className="grid grid-cols-1 gap-6 px-5 py-5 lg:grid-cols-2">
            <div>
              <h3 className="mb-3 text-sm font-semibold text-ink">Property details</h3>
              <DefinitionList
              columns={2}
              items={[
              { label: 'Property ID', value: property.id },
              { label: 'Type', value: property.type },
              { label: 'Onboarded', value: formatDate(property.onboardedAt) },
              { label: 'State', value: property.state },
              { label: 'Partner', value: property.partnerName },
              { label: 'Occupancy', value: <ProgressBar value={property.occupancy} /> }]
              } />
            
            </div>
            <div>
              <h3 className="mb-3 text-sm font-semibold text-ink">Amenities</h3>
              <ul className="flex flex-wrap gap-2">
                {property.amenities.map((amenity) =>
              <li key={amenity}>
                    <Badge tone="neutral">{amenity}</Badge>
                  </li>
              )}
              </ul>
            </div>
          </div> :
        null}

        {tab === 'Rooms' ?
        <DataTable columns={roomColumns} rows={rooms} rowKey={(row) => row.id} pageSize={6} /> :
        null}

        {tab === 'Revenue' ?
        <div className="px-2 py-5">
            <RevenueAreaChart data={revenueTrend} height={280} />
          </div> :
        null}

        {tab === 'Reviews' ?
        <ul className="divide-y divide-line">
            {(propertyReviews.length ? propertyReviews : reviews.slice(0, 3)).map((review) =>
          <li key={review.id} className="px-5 py-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="flex items-center gap-1 text-sm font-semibold text-ink">
                    <StarIcon className="h-3.5 w-3.5 text-warning" /> {review.rating}.0
                  </span>
                  <p className="text-sm font-semibold text-ink">{review.title}</p>
                  <Badge>{review.status}</Badge>
                  <span className="ml-auto text-xs text-muted">{formatDate(review.createdAt)}</span>
                </div>
                <p className="mt-1.5 text-[13px] text-muted">{review.body}</p>
                <p className="mt-1.5 text-xs text-muted">— {review.customerName}</p>
              </li>
          )}
          </ul> :
        null}

        {tab === 'Documents' ?
        <ul className="divide-y divide-line">
            {property.documents.map((document) =>
          <li key={document.name} className="flex items-center gap-3 px-5 py-3.5">
                <FileTextIcon className="h-4 w-4 shrink-0 text-muted" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] font-semibold text-ink">{document.name}</p>
                  <p className="text-xs text-muted">Uploaded {formatDate(document.uploadedAt)}</p>
                </div>
                <Badge>{document.status}</Badge>
                <Button size="sm" variant="ghost">
                  View
                </Button>
              </li>
          )}
          </ul> :
        null}
      </Card>
    </div>);

}