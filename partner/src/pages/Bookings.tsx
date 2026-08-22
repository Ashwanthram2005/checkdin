import React, { useMemo, useState } from 'react';
import { BanIcon, CheckIcon, DownloadIcon, LogInIcon, XIcon } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { BookingSummaryCards } from '../components/bookings/BookingSummaryCards';
import {
  BookingFilters,
  emptyFilters,
  type BookingFilterState } from
'../components/bookings/BookingFilters';
import { BookingsTable } from '../components/bookings/BookingsTable';
import { BookingDetailsDrawer } from '../components/bookings/BookingDetailsDrawer';
import { Switch } from '../components/settings/Toggle';
import type { BookingAction } from '../components/bookings/BookingActionsMenu';
import { useAuth } from '../contexts/AuthContext';
import { bookings as seedBookings, type Booking, type BookingStatus } from '../data/bookings';
import type { PermissionId } from '../data/auth';

const actionPermissions: Partial<Record<BookingAction, PermissionId>> = {
  accept: 'accept_bookings',
  reject: 'reject_bookings',
  checkin: 'checkin_guests',
  checkout: 'checkout_guests',
  cancel: 'reject_bookings',
  view: 'view_guest_details'
};

const tabs = [
'All Bookings',
'Pending Approval',
'Confirmed',
'Checked In',
'Checked Out',
'Cancelled',
'No Show',
'Expired'] as
const;

const TODAY = '16 Aug 2026';

function toTimestamp(dateLabel: string): number {
  return new Date(dateLabel).getTime();
}

export function Bookings() {
  const { can, addAudit, role } = useAuth();
  const [rows, setRows] = useState<Booking[]>(seedBookings);
  const [tab, setTab] = useState<string>('All Bookings');
  const [filters, setFilters] = useState<BookingFilterState>(emptyFilters);
  const [selected, setSelected] = useState<string[]>([]);
  const [openId, setOpenId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [autoAccept, setAutoAccept] = useState(false);

  const notify = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(null), 2600);
  };

  const counts = useMemo(
    () => ({
      total: rows.length,
      pending: rows.filter((b) => b.status === 'Pending Approval').length,
      checkInsToday: rows.filter((b) => b.checkInDate === TODAY && b.status === 'Confirmed').length,
      checkOutsToday: rows.filter((b) => b.status === 'Checked In').length,
      activeGuests: rows.
      filter((b) => b.status === 'Checked In').
      reduce((sum, b) => sum + b.guests.adults + b.guests.children, 0),
      cancelled: rows.filter((b) => b.status === 'Cancelled' || b.status === 'Rejected').length
    }),
    [rows]
  );

  const tabCounts = useMemo(() => {
    const map: Record<string, number> = { 'All Bookings': rows.length };
    tabs.slice(1).forEach((name) => {
      map[name] = rows.filter((b) => b.status === name).length;
    });
    return map;
  }, [rows]);

  const visible = useMemo(
    () =>
    rows.filter((booking) => {
      if (tab !== 'All Bookings' && booking.status !== tab) return false;
      if (
      filters.bookingId &&
      !booking.id.toLowerCase().includes(filters.bookingId.trim().toLowerCase()))

      return false;
      if (
      filters.guest &&
      !booking.guest.toLowerCase().includes(filters.guest.trim().toLowerCase()))

      return false;
      if (filters.phone && !booking.phone.replace(/\s/g, '').includes(filters.phone.replace(/\s/g, '')))
      return false;
      if (filters.duration !== 'All durations' && booking.duration !== filters.duration)
      return false;
      if (filters.payment !== 'All payments' && booking.paymentStatus !== filters.payment)
      return false;
      if (filters.status !== 'All statuses' && booking.status !== filters.status) return false;
      if (filters.from && toTimestamp(booking.checkInDate) < new Date(filters.from).getTime())
      return false;
      if (filters.to && toTimestamp(booking.checkInDate) > new Date(filters.to).getTime())
      return false;
      return true;
    }),
    [rows, tab, filters]
  );

  const patchStatus = (ids: string[], status: BookingStatus, timelineLabel: string) => {
    setRows((prev) =>
    prev.map((booking) =>
    ids.includes(booking.id) ?
    {
      ...booking,
      status,
      approvalSeconds: null,
      timeline: [
      ...booking.timeline.map((entry) => ({ ...entry, done: true })),
      {
        id: `t${Date.now()}-${booking.id}`,
        label: timelineLabel,
        time: 'Just now',
        done: true
      }]

    } :
    booking
    )
    );
  };

  const handleAction = (action: BookingAction, booking: Booking) => {
    const required = actionPermissions[action];
    if (required && !can(required)) {
      notify(`${role?.name} role cannot do this — permission required`);
      return;
    }

    switch (action) {
      case 'view':
        setOpenId(booking.id);
        break;
      case 'call':
        window.open(`tel:${booking.phone.replace(/\s/g, '')}`);
        break;
      case 'whatsapp':
        window.open(`https://wa.me/${booking.phone.replace(/[^\d]/g, '')}`, '_blank');
        break;
      case 'accept':
        patchStatus([booking.id], 'Confirmed', 'Booking accepted by partner');
        notify(`#${booking.id} accepted — guest notified`);
        addAudit({
          action: 'Accepted booking',
          detail: `#${booking.id} • ${booking.room}`,
          category: 'Operations'
        });
        break;
      case 'reject':
        patchStatus([booking.id], 'Rejected', 'Booking rejected by partner');
        notify(`#${booking.id} rejected — refund initiated`);
        addAudit({
          action: 'Rejected booking',
          detail: `#${booking.id} • refund initiated`,
          category: 'Operations'
        });
        break;
      case 'checkin':
        patchStatus([booking.id], 'Checked In', 'Guest checked in at reception');
        notify(`${booking.guest} checked in`);
        addAudit({
          action: 'Checked in booking',
          detail: `#${booking.id} • ${booking.room}`,
          category: 'Operations'
        });
        break;
      case 'checkout':
        patchStatus([booking.id], 'Checked Out', 'Guest checked out');
        notify(`${booking.guest} checked out — room sent for cleaning`);
        addAudit({
          action: 'Checked out booking',
          detail: `#${booking.id} • ${booking.room}`,
          category: 'Operations'
        });
        break;
      case 'cancel':
        patchStatus([booking.id], 'Cancelled', 'Cancelled by property');
        notify(`#${booking.id} cancelled`);
        addAudit({
          action: 'Cancelled booking',
          detail: `#${booking.id} • cancelled by property`,
          category: 'Operations'
        });
        break;
      case 'invoice':
        notify(`Invoice for #${booking.id} downloaded`);
        break;
    }
  };

  const handleExpire = (id: string) => {
    setRows((prev) =>
    prev.map((booking) =>
    booking.id === id && booking.status === 'Pending Approval' ?
    {
      ...booking,
      status: 'Expired',
      approvalSeconds: null,
      timeline: [
      ...booking.timeline,
      {
        id: `t${Date.now()}-${id}`,
        label: 'Approval window expired',
        time: 'Just now',
        done: true
      }]

    } :
    booking
    )
    );
  };

  const exportCsv = () => {
    const header = [
    'Booking ID',
    'Guest',
    'Phone',
    'Booked On',
    'Check-in Date',
    'Check-in Time',
    'Duration',
    'Total',
    'Payment Status',
    'Booking Status'];

    const lines = visible.map((booking) =>
    [
    booking.id,
    booking.guest,
    booking.phone,
    booking.bookedOn,
    booking.checkInDate,
    booking.checkInTime,
    booking.duration,
    booking.total,
    booking.paymentStatus,
    booking.status].

    map((cell) => `"${String(cell).replace(/"/g, '""')}"`).
    join(',')
    );
    const blob = new Blob([[header.join(','), ...lines].join('\n')], {
      type: 'text/csv;charset=utf-8;'
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'checkdin-bookings.csv';
    link.click();
    URL.revokeObjectURL(url);
    notify(`${visible.length} bookings exported to CSV`);
  };

  const bulk = (action: 'accept' | 'reject' | 'checkin' | 'cancel') => {
    const map = {
      accept: ['Confirmed', 'Booking accepted by partner', 'accepted'],
      reject: ['Rejected', 'Booking rejected by partner', 'rejected'],
      checkin: ['Checked In', 'Guest checked in at reception', 'checked in'],
      cancel: ['Cancelled', 'Cancelled by property', 'cancelled']
    } as const;
    const required = actionPermissions[action as BookingAction];
    if (required && !can(required)) {
      notify(`${role?.name} role cannot do this — permission required`);
      return;
    }
    const [status, label, verb] = map[action];
    patchStatus(selected, status as BookingStatus, label);
    notify(`${selected.length} bookings ${verb}`);
    addAudit({
      action: `Bulk ${verb}`,
      detail: `${selected.length} bookings • ${selected.join(', ')}`,
      category: 'Operations'
    });
    setSelected([]);
  };

  const openBooking = rows.find((booking) => booking.id === openId) ?? null;

  return (
    <main className="scroll-slim h-full flex-1 overflow-y-auto bg-canvas px-7 py-6">
      <PageHeader
        title="Bookings"
        subtitle="Approve requests, run check-ins and check-outs, and manage guest details."
        action={
        <button
          type="button"
          onClick={exportCsv}
          className="flex items-center gap-1.5 rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-[13.5px] font-medium text-ink shadow-card transition-colors duration-150 ease-out hover:border-neutral-300">
          
            <DownloadIcon size={16} aria-hidden="true" />
            Export CSV
          </button>
        } />
      

      <div className="mt-6 space-y-5 pb-8">
        <BookingSummaryCards
          counts={counts}
          onSelect={(next) => {
            setTab(next);
            setSelected([]);
          }} />
        

        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-neutral-200/80 bg-white px-4 py-3 shadow-card">
          <div>
            <p className="text-[13.5px] font-semibold text-ink">Manual approval</p>
            <p className="mt-0.5 text-[12.5px] text-ink-muted">
              {autoAccept ?
              'Auto-accept is on — requests are confirmed instantly.' :
              'Auto-accept is off — each request must be accepted before its timer runs out.'}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[12.5px] text-ink-muted">Auto-accept bookings</span>
            <Switch
              checked={autoAccept}
              onChange={setAutoAccept}
              label="Auto-accept bookings" />
            
          </div>
        </div>

        <div className="sticky top-0 z-20 -mx-7 space-y-4 bg-canvas/95 px-7 py-3 backdrop-blur">
          <nav aria-label="Booking status" className="border-b border-neutral-200">
            <ul className="flex flex-wrap gap-1">
              {tabs.map((name) => {
                const isActive = name === tab;
                return (
                  <li key={name}>
                    <button
                      type="button"
                      aria-current={isActive ? 'page' : undefined}
                      onClick={() => {
                        setTab(name);
                        setSelected([]);
                      }}
                      className={[
                      'flex items-center gap-2 border-b-2 px-3.5 py-2.5 text-[13px] transition-colors duration-150 ease-out',
                      isActive ?
                      'border-ink font-semibold text-ink' :
                      'border-transparent font-medium text-ink-muted hover:text-ink'].
                      join(' ')}>
                      
                      {name}
                      <span
                        className={`rounded-md px-1.5 py-0.5 text-[11px] ${
                        isActive ? 'bg-lime-100 text-lime-600' : 'bg-neutral-100 text-ink-muted'}`
                        }>
                        
                        {tabCounts[name] ?? 0}
                      </span>
                    </button>
                  </li>);

              })}
            </ul>
          </nav>

          <BookingFilters value={filters} onChange={setFilters} resultCount={visible.length} />
        </div>

        {selected.length > 0 &&
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-lime-400 bg-lime-50 px-4 py-3">
            <p className="text-[13px] font-semibold text-ink">
              {selected.length} booking{selected.length > 1 ? 's' : ''} selected
            </p>
            <div className="flex flex-wrap gap-2">
              <button
              type="button"
              onClick={() => bulk('accept')}
              className="flex items-center gap-1.5 rounded-lg bg-ink px-3.5 py-2 text-[12.5px] font-semibold text-white transition-colors duration-150 ease-out hover:bg-ink-soft">
              
                <CheckIcon size={14} aria-hidden="true" />
                Accept
              </button>
              <button
              type="button"
              onClick={() => bulk('checkin')}
              className="flex items-center gap-1.5 rounded-lg border border-neutral-300 bg-white px-3.5 py-2 text-[12.5px] font-medium text-ink transition-colors duration-150 ease-out hover:border-neutral-400">
              
                <LogInIcon size={14} aria-hidden="true" />
                Check in
              </button>
              <button
              type="button"
              onClick={() => bulk('reject')}
              className="flex items-center gap-1.5 rounded-lg border border-neutral-300 bg-white px-3.5 py-2 text-[12.5px] font-medium text-red-600 transition-colors duration-150 ease-out hover:border-red-300">
              
                <XIcon size={14} aria-hidden="true" />
                Reject
              </button>
              <button
              type="button"
              onClick={() => bulk('cancel')}
              className="flex items-center gap-1.5 rounded-lg border border-neutral-300 bg-white px-3.5 py-2 text-[12.5px] font-medium text-red-600 transition-colors duration-150 ease-out hover:border-red-300">
              
                <BanIcon size={14} aria-hidden="true" />
                Cancel
              </button>
              <button
              type="button"
              onClick={() => setSelected([])}
              className="rounded-lg px-3 py-2 text-[12.5px] font-medium text-ink-muted transition-colors duration-150 ease-out hover:text-ink">
              
                Clear
              </button>
            </div>
          </div>
        }

        <BookingsTable
          bookings={visible}
          selected={selected}
          onToggleSelect={(id) =>
          setSelected((prev) => prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id])
          }
          onToggleAll={() =>
          setSelected((prev) =>
          prev.length === visible.length ? [] : visible.map((booking) => booking.id)
          )
          }
          onAction={handleAction}
          onExpire={handleExpire} />
        
      </div>

      <BookingDetailsDrawer
        booking={openBooking}
        onClose={() => setOpenId(null)}
        onAction={handleAction}
        onSaveNote={(id, note) => {
          setRows((prev) =>
          prev.map((booking) =>
          booking.id === id ? { ...booking, internalNote: note } : booking
          )
          );
          notify('Internal note saved');
        }}
        onExpire={handleExpire} />
      

      {toast &&
      <p
        role="status"
        className="fixed bottom-6 left-1/2 z-[60] -translate-x-1/2 rounded-xl bg-ink px-4 py-2.5 text-[13px] font-medium text-white shadow-lg">
        
          {toast}
        </p>
      }
    </main>);

}