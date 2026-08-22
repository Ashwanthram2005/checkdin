import React, { useState } from 'react';
import { CheckCircle2Icon, ChevronDownIcon, CircleIcon } from 'lucide-react';
import type { Duration, Hotel, PayMode } from '../../types/booking';
import { checkInTimes } from '../../data/search';
import { checkoutTime, inr, inrExact, toTimeLabel, todayIso } from '../../utils/format';
import { priceBreakdown, serviceFees } from '../../utils/pricing';

interface Props {
  hotel: Hotel;
  date: string;
  checkIn: string;
  duration: Duration;
  guests: number;
  rooms: number;
  available: boolean;
  payMode: PayMode;
  onDateChange: (date: string) => void;
  onTimeChange: (time: string) => void;
  onDurationChange: (duration: Duration) => void;
  onGuestsChange: (guests: number) => void;
  onRoomsChange: (rooms: number) => void;
  onPayModeChange: (mode: PayMode) => void;
  onBook: () => void;
}

const slots: Duration[] = [3, 6, 12];

function Stepper({
  label,
  value,
  min,
  max,
  onChange






}: {label: string;value: number;min: number;max: number;onChange: (next: number) => void;}) {
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-sm">{label}</span>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => onChange(Math.max(min, value - 1))}
          className="h-7 w-7 rounded-full border border-line transition-colors duration-150 ease-smooth hover:border-ink"
          aria-label={`Fewer ${label.toLowerCase()}`}>
          
          –
        </button>
        <span className="w-4 text-center text-sm font-semibold">{value}</span>
        <button
          type="button"
          onClick={() => onChange(Math.min(max, value + 1))}
          className="h-7 w-7 rounded-full border border-line transition-colors duration-150 ease-smooth hover:border-ink"
          aria-label={`More ${label.toLowerCase()}`}>
          
          +
        </button>
      </div>
    </div>);

}

export function BookingSummaryCard({
  hotel,
  date,
  checkIn,
  duration,
  guests,
  rooms,
  available,
  payMode,
  onDateChange,
  onTimeChange,
  onDurationChange,
  onGuestsChange,
  onRoomsChange,
  onPayModeChange,
  onBook
}: Props) {
  const [guestsOpen, setGuestsOpen] = useState(false);
  const bill = priceBreakdown(hotel.rates[duration], duration);

  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-surface shadow-card">
      <div className="flex flex-wrap items-center justify-between gap-3 bg-primary px-5 py-3.5">
        <p className="text-sm font-bold text-ink">Get upto 25% OFF on bookings</p>
        <button
          type="button"
          className="rounded-lg bg-ink px-3.5 py-2 text-xs font-bold text-white transition-colors duration-150 ease-smooth hover:bg-night">
          
          Apply Coupon
        </button>
      </div>

      <div className="p-5">
        <h2 className="text-sm font-bold">Your Booking Summary</h2>

        <div className="mt-4 grid grid-cols-2 divide-x divide-line overflow-hidden rounded-xl border border-line">
          <label className="px-4 py-3">
            <span className="block text-[11px] text-muted">Check-in Date</span>
            <input
              type="date"
              value={date}
              min={todayIso()}
              onChange={(e) => onDateChange(e.target.value)}
              className="mt-1 w-full bg-transparent text-sm font-bold outline-none" />
            
          </label>
          <label className="px-4 py-3">
            <span className="block text-[11px] text-muted">Check in Time</span>
            <select
              value={checkIn}
              onChange={(e) => onTimeChange(e.target.value)}
              className="mt-1 w-full bg-transparent text-sm font-bold outline-none">
              
              {checkInTimes.map((t) =>
              <option key={t} value={t}>
                  {toTimeLabel(t)}
                </option>
              )}
            </select>
          </label>
        </div>

        <div
          role="radiogroup"
          aria-label="Slot length"
          className="mt-4 overflow-hidden rounded-xl bg-canvas">
          
          {slots.map((slot) => {
            const active = slot === duration;
            const slotBill = priceBreakdown(hotel.rates[slot], slot);
            return (
              <button
                key={slot}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => onDurationChange(slot)}
                className={`flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left transition-colors duration-150 ease-smooth ${
                active ?
                'rounded-xl border border-primary bg-surface' :
                'hover:bg-line/40'}`
                }>
                
                <span className="flex items-center gap-3">
                  {active ?
                  <CheckCircle2Icon
                    className="h-5 w-5 fill-ink text-surface"
                    aria-hidden="true" /> :


                  <CircleIcon className="h-5 w-5 text-muted" aria-hidden="true" />
                  }
                  <span>
                    <span className="block text-base font-bold">
                      {inr(slotBill.total)}
                    </span>
                    <span className="block text-[11px] text-muted">
                      incl. {inr(serviceFees[slot])} service fee
                    </span>
                  </span>
                </span>
                <span className="text-sm text-muted">{slot} Hrs</span>
              </button>);

          })}
        </div>

        <dl className="mt-4 space-y-1.5 text-sm">
          <div className="flex justify-between">
            <dt className="text-muted">Room, {duration} hours</dt>
            <dd>{inr(bill.base)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted">Checkdin service fee</dt>
            <dd>{inr(bill.serviceFee)}</dd>
          </div>
          <div className="flex justify-between border-t border-line pt-2 text-base font-bold">
            <dt>Total cost</dt>
            <dd>{inr(bill.total)}</dd>
          </div>
        </dl>

        <fieldset className="mt-4">
          <legend className="text-[11px] font-bold uppercase tracking-wide text-muted">
            How much to pay now
          </legend>
          <div className="mt-2 space-y-2">
            <button
              type="button"
              role="radio"
              aria-checked={payMode === 'part'}
              onClick={() => onPayModeChange('part')}
              className={`w-full rounded-xl border px-4 py-3 text-left transition-colors duration-150 ease-smooth ${
              payMode === 'part' ?
              'border-primary bg-primary-soft' :
              'border-line hover:border-ink'}`
              }>
              
              <span className="block text-sm font-bold">
                Pay {inrExact(bill.payNow)} now
              </span>
              <span className="mt-0.5 block text-xs text-muted">
                Pay the balance {inrExact(bill.payAtHotel)} at the hotel
              </span>
            </button>
            <button
              type="button"
              role="radio"
              aria-checked={payMode === 'full'}
              onClick={() => onPayModeChange('full')}
              className={`w-full rounded-xl border px-4 py-3 text-left transition-colors duration-150 ease-smooth ${
              payMode === 'full' ?
              'border-primary bg-primary-soft' :
              'border-line hover:border-ink'}`
              }>
              
              <span className="block text-sm font-bold">
                Pay {inr(bill.total)} now
              </span>
              <span className="mt-0.5 block text-xs text-muted">
                Nothing to settle at the desk
              </span>
            </button>
          </div>
        </fieldset>

        <div className="mt-4 rounded-xl border border-line">
          <button
            type="button"
            onClick={() => setGuestsOpen((v) => !v)}
            aria-expanded={guestsOpen}
            className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left">
            
            <span>
              <span className="block text-[11px] text-muted">
                Room &amp; Guests Details
              </span>
              <span className="mt-0.5 block text-sm font-bold">
                {guests} Guest{guests > 1 ? 's' : ''}, {rooms} Room
                {rooms > 1 ? 's' : ''}
              </span>
            </span>
            <ChevronDownIcon
              className={`h-5 w-5 text-muted transition-transform duration-200 ease-smooth ${
              guestsOpen ? 'rotate-180' : ''}`
              }
              aria-hidden="true" />
            
          </button>
          {guestsOpen &&
          <div className="border-t border-line px-4 py-2">
              <Stepper
              label="Guests"
              value={guests}
              min={1}
              max={6}
              onChange={onGuestsChange} />
            
              <Stepper
              label="Rooms"
              value={rooms}
              min={1}
              max={3}
              onChange={onRoomsChange} />
            
            </div>
          }
        </div>

        {available ?
        <>
            <button
            type="button"
            onClick={onBook}
            className="mt-5 w-full rounded-xl bg-primary px-6 py-3.5 text-sm font-bold text-ink transition-colors duration-150 ease-smooth hover:bg-primary-dark">
            
              Continue to book ·{' '}
              {payMode === 'part' ? inrExact(bill.payNow) : inr(bill.total)}
            </button>
            <p className="mt-3 text-center text-xs text-muted">
              Check out by {checkoutTime(checkIn, duration)} · free cancellation
              up to 2 hours before
            </p>
          </> :

        <div className="mt-5 rounded-xl border border-accent bg-accent-soft p-4 text-center">
            <p className="text-sm font-bold uppercase tracking-wide text-accent">
              Sold out
            </p>
            <p className="mt-1 text-xs leading-relaxed text-muted">
              {toTimeLabel(checkIn)} is not available for a {duration}-hour slot.
              Try another check-in time, another slot length, or a different date.
            </p>
          </div>
        }
      </div>
    </div>);

}