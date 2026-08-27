import React from 'react';
import { checkoutTime, toTimeLabel } from '../../utils/format';
import { daySlots, isSlotAvailable } from '../../utils/availability';
import type { Duration } from '../../types/booking';

interface Props {
  hotelId: string;
  duration: Duration;
  value: string;
  onChange: (slot: string) => void;
}

export function SlotPicker({ hotelId, duration, value, onChange }: Props) {
  return (
    <div>
      <div
        role="radiogroup"
        aria-label="Check-in time"
        className="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-6">
        
        {daySlots.map((slot) => {
          const available = isSlotAvailable(hotelId, slot, duration);
          const selected = value === slot;
          return (
            <button
              key={slot}
              type="button"
              role="radio"
              aria-checked={selected}
              disabled={!available}
              onClick={() => onChange(slot)}
              className={`rounded-xl border px-2 py-2.5 text-sm font-medium transition-colors duration-150 ease-smooth ${
              selected ?
              'border-primary bg-primary text-ink' :
              available ?
              'border-line bg-surface hover:border-ink' :
              'cursor-not-allowed border-line bg-canvas text-muted/50 line-through'}`
              }>
              
              {toTimeLabel(slot)}
            </button>);

        })}
      </div>
      <p className="mt-3 text-sm text-muted">
        Check in {toTimeLabel(value)}, out by{' '}
        <span className="font-semibold text-ink">
          {checkoutTime(value, duration)}
        </span>
        . Crossed-out times are already taken.
      </p>
    </div>);

}