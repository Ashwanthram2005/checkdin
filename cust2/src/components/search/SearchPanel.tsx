import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CalendarIcon, ClockIcon, SearchIcon } from 'lucide-react';
import { useBooking } from '../../contexts/BookingContext';
import { checkInTimes, durations } from '../../data/search';
import { checkoutTime, toTimeLabel, todayIso } from '../../utils/format';
import type { Duration } from '../../types/booking';
import { LocationPicker } from './LocationPicker';

interface Props {
  /** 'bare' drops the panel's own chrome — the scroll-linked shell supplies it. */
  variant?: 'hero' | 'compact' | 'bare';
  /** Keeps input ids unique when two panels are mounted at once. */
  idPrefix?: string;
  /** Called after a successful search — used to collapse the sticky bar. */
  onSubmitted?: () => void;
}

const label = 'block text-[13px] font-medium text-muted';

export function SearchPanel({
  variant = 'hero',
  idPrefix = 'search',
  onSubmitted
}: Props) {
  const { search, setSearch } = useBooking();
  const navigate = useNavigate();
  const dateId = `${idPrefix}-date`;
  const timeId = `${idPrefix}-checkin`;

  function submit(e: React.FormEvent) {
    e.preventDefault();
    navigate('/search');
    onSubmitted?.();
  }

  const chrome =
  variant === 'hero' ?
  'rounded-2xl bg-surface p-2.5 shadow-lift' :
  variant === 'compact' ?
  'rounded-2xl border border-line bg-surface p-2' :
  'p-2.5';

  return (
    <form onSubmit={submit} className={`w-full text-ink ${chrome}`}>
      <div className="grid divide-y divide-line lg:grid-cols-[1.6fr_1fr_1fr_1.1fr_auto] lg:divide-x lg:divide-y-0">
        <div className="px-4 py-3">
          <LocationPicker
            value={search.location}
            onChange={(location) => setSearch({ location })} />
          
        </div>

        <div className="px-4 py-3">
          <label htmlFor={dateId} className={label}>
            When ?
          </label>
          <div className="mt-1.5 flex items-center gap-2">
            <CalendarIcon className="h-4 w-4 shrink-0 text-muted" aria-hidden="true" />
            <input
              id={dateId}
              type="date"
              value={search.date}
              min={todayIso()}
              onChange={(e) => setSearch({ date: e.target.value })}
              className="w-full bg-transparent text-sm font-bold outline-none" />
            
          </div>
        </div>

        <div className="px-4 py-3">
          <label htmlFor={timeId} className={label}>
            What Time ?
          </label>
          <div className="mt-1.5 flex items-center gap-2">
            <ClockIcon className="h-4 w-4 shrink-0 text-muted" aria-hidden="true" />
            <select
              id={timeId}
              value={search.checkIn}
              onChange={(e) => setSearch({ checkIn: e.target.value })}
              className="w-full bg-transparent text-sm font-bold outline-none">
              
              {checkInTimes.map((t) =>
              <option key={t} value={t}>
                  {toTimeLabel(t)}
                </option>
              )}
            </select>
          </div>
        </div>

        <div className="px-4 py-3">
          <span className={label}>For how long ?</span>
          <div className="mt-1.5 flex gap-2">
            {durations.map((d) =>
            <button
              key={d.value}
              type="button"
              onClick={() => setSearch({ duration: d.value as Duration })}
              aria-pressed={search.duration === d.value}
              className={`rounded-lg px-3 py-1 text-sm font-semibold transition-colors duration-150 ease-smooth ${
              search.duration === d.value ?
              'bg-primary text-ink' :
              'bg-canvas text-muted hover:text-ink'}`
              }>
              
                {d.value}h
              </button>
            )}
          </div>
        </div>

        <div className="p-1.5">
          <button
            type="submit"
            className="flex h-full w-full items-center justify-center gap-2 rounded-xl bg-primary px-7 py-3.5 text-sm font-bold text-ink transition-colors duration-150 ease-smooth hover:bg-primary-dark">
            
            <SearchIcon className="h-4 w-4" aria-hidden="true" />
            Search Rooms
          </button>
        </div>
      </div>

      {variant === 'compact' &&
      <p className="px-4 pb-2 pt-1 text-xs text-muted">
          Checking out at{' '}
          <span className="font-semibold text-ink">
            {checkoutTime(search.checkIn, search.duration)}
          </span>{' '}
          · you only pay for {search.duration} hours.
        </p>
      }
    </form>);

}