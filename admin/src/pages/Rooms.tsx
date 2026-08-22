import React, { useMemo, useState } from 'react';
import { PlusIcon } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { PageHeader, Toolbar } from '../components/ui/PageHeader';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Input, Label, SearchInput, Select } from '../components/ui/Field';
import { Tabs } from '../components/ui/Tabs';
import { DataTable, type Column } from '../components/ui/DataTable';
import { RowActions, StackedCell } from '../components/ui/Cells';
import { Modal } from '../components/ui/Modal';
import { TableSkeleton, ErrorState } from '../components/ui/LoadingState';
import { useMockQuery } from '../hooks/useMockQuery';
import { api } from '../services/api';
import { properties } from '../data/properties';
import { formatCurrency, formatDate } from '../utils/format';
import type { Room } from '../types';

const tabs = ['All', 'Available', 'Occupied', 'Blocked', 'Maintenance'];
const propertyOptions = ['All properties', ...properties.map((property) => property.name)];
const roomTypes = ['All types', 'Deluxe', 'Standard', 'Suite', 'Dorm Bed', 'Executive'];

export function Rooms() {
  const { data, loading, error } = useMockQuery(api.getRooms, []);
  const [tab, setTab] = useState('All');
  const [query, setQuery] = useState('');
  const [property, setProperty] = useState('All properties');
  const [type, setType] = useState('All types');
  const [addOpen, setAddOpen] = useState(false);
  const [editing, setEditing] = useState<Room | null>(null);

  const rooms = data ?? [];

  const counts = useMemo(() => {
    const result: Record<string, number> = { All: rooms.length };
    tabs.slice(1).forEach((status) => {
      result[status] = rooms.filter((room) => room.status === status).length;
    });
    return result;
  }, [rooms]);

  const rows = useMemo(
    () =>
    rooms.filter((room) => {
      if (tab !== 'All' && room.status !== tab) return false;
      if (property !== 'All properties' && room.propertyName !== property) return false;
      if (type !== 'All types' && room.type !== type) return false;
      if (!query) return true;
      const needle = query.toLowerCase();
      return room.name.toLowerCase().includes(needle) || room.code.toLowerCase().includes(needle);
    }),
    [rooms, tab, property, type, query]
  );

  const inventory = [
  { label: 'Total rooms', value: rooms.length },
  { label: 'Occupied', value: counts.Occupied ?? 0 },
  { label: 'Available tonight', value: counts.Available ?? 0 },
  { label: 'Out of service', value: (counts.Blocked ?? 0) + (counts.Maintenance ?? 0) }];


  const columns: Column<Room>[] = [
  {
    key: 'room',
    header: 'Room',
    render: (row) => <StackedCell primary={row.name} secondary={row.code} />,
    sortValue: (row) => row.name
  },
  {
    key: 'property',
    header: 'Property',
    render: (row) => <StackedCell primary={row.propertyName} secondary={`Floor ${row.floor}`} />,
    sortValue: (row) => row.propertyName
  },
  { key: 'type', header: 'Type', render: (row) => row.type, sortValue: (row) => row.type, hideBelow: 'md' },
  {
    key: 'capacity',
    header: 'Sleeps',
    align: 'right',
    render: (row) => <span className="tabular-nums">{row.capacity}</span>,
    sortValue: (row) => row.capacity,
    hideBelow: 'sm'
  },
  {
    key: 'rate',
    header: 'Base rate',
    align: 'right',
    render: (row) => <span className="font-semibold tabular-nums text-ink">{formatCurrency(row.baseRate)}</span>,
    sortValue: (row) => row.baseRate
  },
  {
    key: 'availability',
    header: 'Next availability',
    render: (row) =>
    <span className="text-[13px] text-muted">
          {row.nextCheckIn ? formatDate(row.nextCheckIn) : '—'}
        </span>,

    sortValue: (row) => row.nextCheckIn ?? 'z',
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
      { label: 'Edit room', onSelect: () => setEditing(row) },
      { label: 'Block room', onSelect: () => api.mutate('room.block', { id: row.id }) },
      { label: 'Mark maintenance', onSelect: () => api.mutate('room.maintenance', { id: row.id }) },
      { label: 'Enable room', onSelect: () => api.mutate('room.enable', { id: row.id }) }]
      } />


  }];


  return (
    <div>
      <PageHeader
        title="Rooms"
        subtitle="Inventory, availability, and service status for every room on the platform."
        actions={
        <Button variant="primary" icon={PlusIcon} onClick={() => setAddOpen(true)}>
            Add room
          </Button>
        } />
      

      <Card className="mb-4 grid grid-cols-2 divide-line sm:grid-cols-4 sm:divide-x">
        {inventory.map((item) =>
        <div key={item.label} className="px-5 py-4">
            <p className="text-[13px] font-medium text-muted">{item.label}</p>
            <p className="mt-0.5 text-2xl font-bold tracking-tight text-ink">{item.value}</p>
          </div>
        )}
      </Card>

      <Card>
        <Tabs tabs={tabs} value={tab} onChange={setTab} counts={counts} />
        <Toolbar>
          <SearchInput
            className="sm:max-w-xs sm:flex-1"
            placeholder="Search room name or code…"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            aria-label="Search rooms" />
          
          <div className="flex gap-2 sm:ml-auto">
            <Select
              options={propertyOptions}
              value={property}
              onChange={(event) => setProperty(event.target.value)}
              aria-label="Filter by property" />
            
            <Select options={roomTypes} value={type} onChange={(event) => setType(event.target.value)} aria-label="Filter by room type" />
          </div>
        </Toolbar>
        {loading ?
        <TableSkeleton rows={8} /> :
        error ?
        <ErrorState message={error} /> :

        <DataTable columns={columns} rows={rows} rowKey={(row) => row.id} pageSize={10} emptyLabel="No rooms match these filters" />
        }
      </Card>

      <Modal
        open={addOpen || Boolean(editing)}
        onClose={() => {
          setAddOpen(false);
          setEditing(null);
        }}
        title={editing ? `Edit ${editing.name}` : 'Add room'}
        description="Rooms sync to partner inventory within a minute of saving."
        footer={
        <>
            <Button
            onClick={() => {
              setAddOpen(false);
              setEditing(null);
            }}>
            
              Cancel
            </Button>
            <Button
            variant="primary"
            onClick={() => {
              api.mutate(editing ? 'room.update' : 'room.create', { id: editing?.id });
              setAddOpen(false);
              setEditing(null);
            }}>
            
              {editing ? 'Save room' : 'Create room'}
            </Button>
          </>
        }>
        
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Label htmlFor="room-property">Property</Label>
            <Select
              id="room-property"
              options={properties.map((item) => item.name)}
              defaultValue={editing?.propertyName} />
            
          </div>
          <div>
            <Label htmlFor="room-name">Room name</Label>
            <Input id="room-name" defaultValue={editing?.name} placeholder="Deluxe 204" />
          </div>
          <div>
            <Label htmlFor="room-type">Room type</Label>
            <Select id="room-type" options={roomTypes.slice(1)} defaultValue={editing?.type} />
          </div>
          <div>
            <Label htmlFor="room-capacity">Sleeps</Label>
            <Input id="room-capacity" type="number" min={1} max={8} defaultValue={editing?.capacity ?? 2} />
          </div>
          <div>
            <Label htmlFor="room-rate">Base rate (₹ per night)</Label>
            <Input id="room-rate" type="number" step={100} defaultValue={editing?.baseRate ?? 3200} />
          </div>
          <div>
            <Label htmlFor="room-floor">Floor</Label>
            <Input id="room-floor" type="number" min={0} max={40} defaultValue={editing?.floor ?? 1} />
          </div>
          <div>
            <Label htmlFor="room-status">Status</Label>
            <Select id="room-status" options={tabs.slice(1)} defaultValue={editing?.status ?? 'Available'} />
          </div>
        </div>
      </Modal>
    </div>);

}