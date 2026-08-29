import React from 'react';
import { MinusIcon, PlusIcon, UsersIcon } from 'lucide-react';
import { SettingsCard } from '../settings/SettingsCard';
import { Toggle } from '../settings/Toggle';
import { Field, TextInput } from '../settings/FormField';
import type { RoomProfile } from '../../data/rooms';

type RoomCapacityProps = {
  capacity: RoomProfile['capacity'];
  onChange: (capacity: RoomProfile['capacity']) => void;
};

function Stepper({
  id,
  label,
  value,
  min,
  max,
  onChange







}: {id: string;label: string;value: number;min: number;max: number;onChange: (value: number) => void;}) {
  return (
    <div>
      <p className="text-[13px] font-medium text-ink-soft" id={`${id}-label`}>
        {label}
      </p>
      <div className="mt-1.5 flex items-center gap-3 rounded-xl border border-neutral-200 px-3 py-2">
        <button
          type="button"
          aria-label={`Decrease ${label}`}
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
          className="flex h-7 w-7 items-center justify-center rounded-lg bg-neutral-100 text-ink transition-colors duration-150 ease-out hover:bg-neutral-200 disabled:opacity-40">
          
          <MinusIcon size={14} aria-hidden="true" />
        </button>
        <span
          aria-labelledby={`${id}-label`}
          className="flex-1 text-center text-[15px] font-semibold text-ink">
          
          {value}
        </span>
        <button
          type="button"
          aria-label={`Increase ${label}`}
          onClick={() => onChange(Math.min(max, value + 1))}
          disabled={value >= max}
          className="flex h-7 w-7 items-center justify-center rounded-lg bg-neutral-100 text-ink transition-colors duration-150 ease-out hover:bg-neutral-200 disabled:opacity-40">
          
          <PlusIcon size={14} aria-hidden="true" />
        </button>
      </div>
    </div>);

}

export function RoomCapacity({ capacity, onChange }: RoomCapacityProps) {
  const total = capacity.maxAdults + capacity.maxChildren;

  return (
    <SettingsCard
      title="Room capacity"
      description="Guests cannot book beyond these limits."
      action={
      <span className="flex items-center gap-1.5 rounded-md bg-neutral-100 px-2.5 py-1 text-[11.5px] font-semibold text-ink-muted">
          <UsersIcon size={12} aria-hidden="true" />
          Sleeps {total}
        </span>
      }>
      
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Stepper
          id="adults"
          label="Max adults"
          value={capacity.maxAdults}
          min={1}
          max={8}
          onChange={(maxAdults) => onChange({ ...capacity, maxAdults })} />
        
        <Stepper
          id="children"
          label="Max children"
          value={capacity.maxChildren}
          min={0}
          max={6}
          onChange={(maxChildren) => onChange({ ...capacity, maxChildren })} />
        
        {capacity.extraGuestAllowed &&
        <Field
          id="extraFee"
          label="Extra guest charge"
          hint="Charged per additional guest, per slot.">
          
            <TextInput
            id="extraFee"
            type="number"
            min={0}
            step={50}
            value={capacity.extraGuestFee}
            onChange={(e) =>
            onChange({ ...capacity, extraGuestFee: Number(e.target.value) || 0 })
            } />
          
          </Field>
        }
      </div>

      <div className="mt-1 border-t border-neutral-100">
        <Toggle
          checked={capacity.extraGuestAllowed}
          onChange={(extraGuestAllowed) => onChange({ ...capacity, extraGuestAllowed })}
          label="Extra guest allowed"
          description="Let guests add one person beyond the limit for a fee." />
        
      </div>
    </SettingsCard>);

}