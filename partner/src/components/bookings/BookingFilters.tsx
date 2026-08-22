import React from 'react';
import { RotateCcwIcon, SearchIcon } from 'lucide-react';
import { Select, TextInput } from '../settings/FormField';
import { bookingStatuses, durationOptions, paymentStatuses } from '../../data/bookings';

export type BookingFilterState = {
  from: string;
  to: string;
  bookingId: string;
  guest: string;
  phone: string;
  duration: string;
  payment: string;
  status: string;
};

export const emptyFilters: BookingFilterState = {
  from: '',
  to: '',
  bookingId: '',
  guest: '',
  phone: '',
  duration: 'All durations',
  payment: 'All payments',
  status: 'All statuses'
};

type BookingFiltersProps = {
  value: BookingFilterState;
  onChange: (value: BookingFilterState) => void;
  resultCount: number;
};

export function BookingFilters({ value, onChange, resultCount }: BookingFiltersProps) {
  const set = (patch: Partial<BookingFilterState>) => onChange({ ...value, ...patch });
  const isDirty = JSON.stringify(value) !== JSON.stringify(emptyFilters);

  return (
    <section
      aria-label="Filter bookings"
      className="rounded-2xl border border-neutral-200/80 bg-white p-4 shadow-card">
      
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 xl:grid-cols-8">
        <div className="col-span-2">
          <label htmlFor="from" className="block text-[12px] font-medium text-ink-muted">
            Date range
          </label>
          <div className="mt-1.5 flex items-center gap-2">
            <TextInput
              id="from"
              type="date"
              value={value.from}
              onChange={(e) => set({ from: e.target.value })}
              className="py-2 text-[13px]" />
            
            <span className="text-[12px] text-ink-muted">to</span>
            <TextInput
              id="to"
              type="date"
              value={value.to}
              onChange={(e) => set({ to: e.target.value })}
              className="py-2 text-[13px]" />
            
          </div>
        </div>

        <div>
          <label htmlFor="bookingId" className="block text-[12px] font-medium text-ink-muted">
            Booking ID
          </label>
          <div className="relative mt-1.5">
            <SearchIcon
              size={14}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted"
              aria-hidden="true" />
            
            <TextInput
              id="bookingId"
              value={value.bookingId}
              onChange={(e) => set({ bookingId: e.target.value })}
              placeholder="CHK2451"
              className="py-2 pl-8 text-[13px]" />
            
          </div>
        </div>

        <div>
          <label htmlFor="guestSearch" className="block text-[12px] font-medium text-ink-muted">
            Guest name
          </label>
          <div className="relative mt-1.5">
            <SearchIcon
              size={14}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted"
              aria-hidden="true" />
            
            <TextInput
              id="guestSearch"
              value={value.guest}
              onChange={(e) => set({ guest: e.target.value })}
              placeholder="Search guest"
              className="py-2 pl-8 text-[13px]" />
            
          </div>
        </div>

        <div>
          <label htmlFor="phoneSearch" className="block text-[12px] font-medium text-ink-muted">
            Phone number
          </label>
          <div className="relative mt-1.5">
            <SearchIcon
              size={14}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted"
              aria-hidden="true" />
            
            <TextInput
              id="phoneSearch"
              value={value.phone}
              onChange={(e) => set({ phone: e.target.value })}
              placeholder="98407"
              className="py-2 pl-8 text-[13px]" />
            
          </div>
        </div>

        <div>
          <label htmlFor="durationFilter" className="block text-[12px] font-medium text-ink-muted">
            Duration
          </label>
          <div className="mt-1.5">
            <Select
              id="durationFilter"
              value={value.duration}
              onChange={(e) => set({ duration: e.target.value })}
              className="py-2 text-[13px]">
              
              <option>All durations</option>
              {durationOptions.map((option) =>
              <option key={option}>{option}</option>
              )}
            </Select>
          </div>
        </div>

        <div>
          <label htmlFor="paymentFilter" className="block text-[12px] font-medium text-ink-muted">
            Payment status
          </label>
          <div className="mt-1.5">
            <Select
              id="paymentFilter"
              value={value.payment}
              onChange={(e) => set({ payment: e.target.value })}
              className="py-2 text-[13px]">
              
              <option>All payments</option>
              {paymentStatuses.map((option) =>
              <option key={option}>{option}</option>
              )}
            </Select>
          </div>
        </div>

        <div>
          <label htmlFor="statusFilter" className="block text-[12px] font-medium text-ink-muted">
            Booking status
          </label>
          <div className="mt-1.5">
            <Select
              id="statusFilter"
              value={value.status}
              onChange={(e) => set({ status: e.target.value })}
              className="py-2 text-[13px]">
              
              <option>All statuses</option>
              {bookingStatuses.map((option) =>
              <option key={option}>{option}</option>
              )}
            </Select>
          </div>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between gap-3 border-t border-neutral-100 pt-3">
        <p className="text-[12.5px] text-ink-muted">
          <span className="font-semibold text-ink">{resultCount}</span> bookings match the current
          filters
        </p>
        {isDirty &&
        <button
          type="button"
          onClick={() => onChange(emptyFilters)}
          className="flex items-center gap-1.5 text-[12.5px] font-medium text-lime-600 transition-colors duration-150 ease-out hover:text-lime-500">
          
            <RotateCcwIcon size={13} aria-hidden="true" />
            Clear filters
          </button>
        }
      </div>
    </section>);

}