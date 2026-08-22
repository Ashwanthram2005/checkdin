import React from 'react';
import { SettingsCard } from '../settings/SettingsCard';
import { availabilityOptions, type AvailabilityStatus } from '../../data/rooms';

export const statusChip: Record<AvailabilityStatus, string> = {
  Active: 'bg-lime-100 text-lime-600',
  Inactive: 'bg-neutral-100 text-ink-muted',
  'Under Maintenance': 'bg-red-50 text-red-600',
  'Temporarily Unavailable': 'bg-amber-50 text-amber-700'
};

type AvailabilityStatusCardProps = {
  value: AvailabilityStatus;
  onChange: (status: AvailabilityStatus) => void;
};

export function AvailabilityStatusCard({ value, onChange }: AvailabilityStatusCardProps) {
  return (
    <SettingsCard
      title="Availability status"
      description="Controls whether guests can book this room type right now.">
      
      <fieldset>
        <legend className="sr-only">Availability status</legend>
        <div className="grid grid-cols-1 gap-2.5 md:grid-cols-2">
          {availabilityOptions.map((option) => {
            const isActive = option.id === value;
            return (
              <label
                key={option.id}
                className={[
                'flex cursor-pointer items-start gap-3 rounded-xl border px-4 py-3 transition-colors duration-150 ease-out',
                isActive ?
                'border-ink bg-neutral-50' :
                'border-neutral-200 hover:border-neutral-300'].
                join(' ')}>
                
                <input
                  type="radio"
                  name="availability"
                  value={option.id}
                  checked={isActive}
                  onChange={() => onChange(option.id)}
                  className="mt-1 h-4 w-4 accent-lime-500" />
                
                <span className="min-w-0">
                  <span className="flex items-center gap-2">
                    <span className="text-[13.5px] font-semibold text-ink">{option.id}</span>
                    {isActive &&
                    <span
                      className={`rounded-md px-2 py-0.5 text-[10.5px] font-semibold ${statusChip[option.id]}`}>
                      
                        Current
                      </span>
                    }
                  </span>
                  <span className="mt-0.5 block text-[12.5px] text-ink-muted">
                    {option.description}
                  </span>
                </span>
              </label>);

          })}
        </div>
      </fieldset>
    </SettingsCard>);

}