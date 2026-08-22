import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRightIcon,
  BedDoubleIcon,
  BuildingIcon,
  CalendarCheckIcon,
  CheckIcon,
  ClockIcon,
  HandshakeIcon,
  IndianRupeeIcon,
  LogInIcon,
  LogOutIcon,
  PercentIcon,
  WalletIcon,
  XIcon } from
'lucide-react';
import { Card, CardHeader } from '../components/ui/Card';
import { KpiCard, MiniStat } from '../components/dashboard/KpiCard';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { SegmentedControl } from '../components/ui/Tabs';
import { DataTable, type Column } from '../components/ui/DataTable';
import { NameCell, StackedCell } from '../components/ui/Cells';
import { Avatar } from '../components/ui/Primitives';
import { TableSkeleton, ErrorState } from '../components/ui/LoadingState';
import { BookingTrendChart, DonutChart, OccupancyBarChart, RevenueAreaChart } from '../components/charts/Charts';
import { bookingTrend, durationSplit, occupancyTrend, revenueTrend } from '../data/analytics';
import { properties } from '../data/properties';
import { partners } from '../data/partners';
import { useMockQuery } from '../hooks/useMockQuery';
import { useAuth } from '../contexts/AuthContext';
import { useComms } from '../contexts/CommsContext';
import { api } from '../services/api';
import { formatCurrency, formatDate } from '../utils/format';
import type { Booking } from '../types';

const ranges = ['7 days', '14 days', '30 days'];

export function Dashboard() {
  const [range, setRange] = useState('14 days');
  const { user, role } = useAuth();
  const comms = useComms();
  const { data: bookings, loading, error } = useMockQuery(api.getBookings, []);

  const recent = (bookings ?? []).slice(0, 6);
  const pendingProperties = properties.filter((property) => property.status === 'Pending Approval');
  const pendingPartners = partners.filter((partner) => partner.status === 'Pending KYC');
  const newPartners = [...partners].sort((a, b) => b.joinedAt.localeCompare(a.joinedAt)).slice(0, 4);
  const approvalQueue = [
  ...pendingProperties.map((property) => ({
    id: property.id,
    kind: 'property' as const,
    name: property.name,
    detail: `${property.city} · ${property.rooms} rooms`
  })),
  ...pendingPartners.map((partner) => ({
    id: partner.id,
    kind: 'partner' as const,
    name: partner.name,
    detail: `${partner.company} · KYC pending`
  }))].
  slice(0, 4);
  const trendSlice = range === '7 days' ? revenueTrend.slice(-7) : range === '30 days' ? revenueTrend : revenueTrend;
  const bookingSlice = range === '7 days' ? bookingTrend.slice(-7) : bookingTrend;

  const columns: Column<Booking>[] = [
  {
    key: 'guest',
    header: 'Guest',
    render: (row) => <NameCell primary={row.customerName} secondary={row.code} />,
    sortValue: (row) => row.customerName
  },
  {
    key: 'property',
    header: 'Property',
    render: (row) => <StackedCell primary={row.propertyName} secondary={row.city} />,
    sortValue: (row) => row.propertyName,
    hideBelow: 'md'
  },
  {
    key: 'stay',
    header: 'Stay',
    render: (row) =>
    <StackedCell primary={formatDate(row.checkIn)} secondary={`${row.nights}N · ${row.guests} guests`} />,

    sortValue: (row) => row.checkIn,
    hideBelow: 'lg'
  },
  {
    key: 'amount',
    header: 'Amount',
    align: 'right',
    render: (row) =>
    <span className="font-semibold tabular-nums text-ink">{formatCurrency(row.amount)}</span>,

    sortValue: (row) => row.amount
  },
  {
    key: 'status',
    header: 'Status',
    align: 'right',
    render: (row) => <Badge>{row.status}</Badge>,
    sortValue: (row) => row.status
  }];


  return (
    <div>
      <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-ink sm:text-[28px]">
            Welcome back, {user?.name.split(' ')[0] ?? 'Admin'}
          </h1>
          <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted">
            {role ?
            <span
              className="inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-xs font-semibold"
              style={{ backgroundColor: role.accentSoft, color: role.accent }}>
              
                <role.icon className="h-3.5 w-3.5" />
                {role.name}
              </span> :
            null}
            Platform view for 19 Aug 2026 — 3 approvals and 6 payouts need a decision today.
          </p>
        </div>
        <SegmentedControl options={ranges} value={range} onChange={setRange} />
      </header>

      {role ?
      <nav aria-label="Your workspace" className="mb-4">
          <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-6">
            {role.modules.map((module) =>
          <li key={module.label}>
                <Link
              to={module.to}
              className="flex h-full items-center rounded-xl border border-line bg-card px-3.5 py-3 text-[13px] font-medium text-ink shadow-card transition-colors duration-150 ease-smooth hover:bg-faint">
              
                  {module.label}
                </Link>
              </li>
          )}
          </ul>
        </nav> :
      null}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          label="Revenue (month to date)"
          value="₹4.12Cr"
          delta={14.2}
          hint="vs last month"
          icon={IndianRupeeIcon}
          featured />
        
        <KpiCard label="Total Bookings" value="18,422" delta={12.4} hint="vs last month" icon={CalendarCheckIcon} />
        <KpiCard label="Occupancy Rate" value="74%" delta={5.3} hint="platform average" icon={PercentIcon} />
        <KpiCard label="Pending Payouts" value="₹18.4L" delta={-8.2} hint="6 awaiting approval" icon={WalletIcon} />
      </div>

      <Card className="mt-4 grid grid-cols-1 divide-y divide-line sm:grid-cols-2 sm:divide-y-0 xl:grid-cols-4 xl:divide-x">
        <MiniStat label="Today's Check-ins" value="286" hint="+6.1%" icon={LogInIcon} />
        <MiniStat label="Today's Check-outs" value="241" hint="−3.4%" icon={LogOutIcon} />
        <MiniStat label="Active Properties" value="7" hint="2 pending" icon={BuildingIcon} />
        <MiniStat label="Active Partners" value="6" hint="2 pending KYC" icon={HandshakeIcon} />
      </Card>

      <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader
            title="Revenue trend"
            subtitle={`Gross booking value, last ${range}`}
            action={
            <div className="text-right">
                <p className="text-sm font-bold tabular-nums text-ink">{formatCurrency(41230000, true)}</p>
                <p className="text-xs text-positive">+14.2% vs previous period</p>
              </div>
            } />
          
          <div className="px-2 py-4">
            <RevenueAreaChart data={trendSlice} />
          </div>
        </Card>
        <Card>
          <CardHeader title="Bookings by duration" subtitle="This month" />
          <div className="px-5 py-5">
            <DonutChart data={durationSplit} height={196} />
          </div>
        </Card>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader title="Booking trend" subtitle="Confirmed vs cancelled per day" />
          <div className="px-2 py-4">
            <BookingTrendChart data={bookingSlice} />
          </div>
        </Card>
        <Card>
          <CardHeader
            title="Occupancy by city"
            subtitle="Bars in solid lime are at or above target capacity" />
          
          <div className="px-2 py-4">
            <OccupancyBarChart data={occupancyTrend} />
          </div>
        </Card>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader
            title="Recent bookings"
            subtitle="Latest activity across all properties"
            action={
            <Link to="/bookings">
                <Button size="sm" variant="ghost">
                  View all <ArrowRightIcon className="h-3.5 w-3.5" />
                </Button>
              </Link>
            } />
          
          {loading ?
          <TableSkeleton rows={6} /> :
          error ?
          <ErrorState message={error} /> :

          <DataTable columns={columns} rows={recent} rowKey={(row) => row.id} pageSize={6} />
          }
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader
              title="Internal communications"
              subtitle="Live across channels, DMs, and requests"
              action={
              <Link to="/comms/channels">
                  <Button size="sm" variant="ghost">
                    Open center <ArrowRightIcon className="h-3.5 w-3.5" />
                  </Button>
                </Link>
              } />
            
            <ul className="grid grid-cols-2 divide-x divide-y divide-line">
              {[
              { label: 'Unread messages', value: comms.counts.unread, to: '/comms/channels' },
              { label: 'Pending requests', value: comms.counts.pendingRequests, to: '/comms/requests' },
              { label: 'Urgent escalations', value: comms.counts.urgent, to: '/comms/requests', urgent: true },
              { label: 'New announcements', value: comms.counts.announcements, to: '/comms/announcements' }].
              map((item) =>
              <li key={item.label}>
                  <Link
                  to={item.to}
                  className="block px-5 py-3.5 transition-colors duration-150 ease-smooth hover:bg-faint">
                  
                    <p className="text-xs font-medium text-muted">{item.label}</p>
                    <p
                    className={`mt-0.5 text-2xl font-bold tracking-tight ${
                    item.urgent && item.value > 0 ? 'text-negative' : 'text-ink'}`
                    }>
                    
                      {item.value}
                    </p>
                  </Link>
                </li>
              )}
            </ul>
          </Card>

          <Card>
            <CardHeader title="Pending approvals" subtitle="Blocking partner go-live" />
            <ul className="divide-y divide-line">
              {approvalQueue.map((item) =>
              <li key={item.id} className="flex items-start gap-3 px-5 py-3.5">
                  <span className="mt-0.5 rounded-md bg-warning/10 p-1.5 text-warning">
                    {item.kind === 'property' ?
                  <BuildingIcon className="h-3.5 w-3.5" /> :

                  <HandshakeIcon className="h-3.5 w-3.5" />
                  }
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] font-semibold text-ink">{item.name}</p>
                    <p className="text-xs text-muted">{item.detail}</p>
                  </div>
                  <div className="flex gap-1">
                    <button
                    aria-label={`Approve ${item.name}`}
                    className="rounded-md border border-line p-1.5 text-positive transition-colors duration-150 ease-smooth hover:bg-positive/10">
                    
                      <CheckIcon className="h-3.5 w-3.5" />
                    </button>
                    <button
                    aria-label={`Reject ${item.name}`}
                    className="rounded-md border border-line p-1.5 text-negative transition-colors duration-150 ease-smooth hover:bg-negative/10">
                    
                      <XIcon className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </li>
              )}
            </ul>
          </Card>

          <Card>
            <CardHeader
              title="New partner registrations"
              action={
              <Link to="/partners">
                  <Button size="sm" variant="ghost">
                    All partners
                  </Button>
                </Link>
              } />
            
            <ul className="divide-y divide-line">
              {newPartners.map((partner) =>
              <li key={partner.id} className="flex items-center gap-3 px-5 py-3.5">
                  <Avatar name={partner.name} size="sm" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] font-semibold text-ink">{partner.name}</p>
                    <p className="truncate text-xs text-muted">
                      {partner.city} · joined {formatDate(partner.joinedAt)}
                    </p>
                  </div>
                  <Badge>{partner.status}</Badge>
                </li>
              )}
            </ul>
          </Card>

          <Card>
            <CardHeader title="Rooms out of service" subtitle="Blocked or under maintenance" />
            <ul className="divide-y divide-line">
              {[
              { name: 'Deluxe 302', property: 'Andheri Transit Rooms', reason: 'Maintenance', since: 'since 17 Aug' },
              { name: 'Suite 501', property: 'Aurum Suites Whitefield', reason: 'Blocked', since: 'since 18 Aug' },
              { name: 'Dorm Bed 12', property: 'Jubilee Hills Stayspace', reason: 'Maintenance', since: 'since 12 Aug' }].
              map((room) =>
              <li key={room.name} className="flex items-center gap-3 px-5 py-3.5">
                  <BedDoubleIcon className="h-4 w-4 shrink-0 text-muted" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] font-semibold text-ink">{room.name}</p>
                    <p className="truncate text-xs text-muted">{room.property}</p>
                  </div>
                  <div className="text-right">
                    <Badge>{room.reason}</Badge>
                    <p className="mt-0.5 flex items-center justify-end gap-1 text-[11px] text-muted">
                      <ClockIcon className="h-3 w-3" /> {room.since}
                    </p>
                  </div>
                </li>
              )}
            </ul>
          </Card>
        </div>
      </div>
    </div>);

}