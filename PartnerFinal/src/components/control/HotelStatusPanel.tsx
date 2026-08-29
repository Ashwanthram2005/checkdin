import React from 'react';
import { hotelStatusOptions, type HotelStatus } from '../../data/operations';

type HotelStatusPanelProps = {
  status: HotelStatus;
  onChange: (status: HotelStatus) => void;
  canManage: boolean;
};

export function HotelStatusPanel({ status, onChange, canManage }: HotelStatusPanelProps) {
  return (
    <section aria-label="Hotel status" className="rounded-2xl bg-ink p-6 text-white">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-bold tracking-wide text-white/45">HOTEL STATUS</p>
          <p className="mt-2 flex items-center gap-2.5 text-[28px] font-bold leading-none tracking-tight">
            <span
              className={[
              'h-3 w-3 rounded-full',
              hotelStatusOptions.find((option) => option.id === status)?.dot].
              join(' ')}
              aria-hidden="true" />
            
            {status}
          </p>
          <p className="mt-2 text-[13px] text-white/60">
            {hotelStatusOptions.find((option) => option.id === status)?.headline}
          </p>
        </div>
      </div>

      <ul className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-3">
        {hotelStatusOptions.map((option) => {
          const isActive = option.id === status;
          return (
            <li key={option.id}>
              <button
                type="button"
                disabled={!canManage}
                onClick={() => onChange(option.id)}
                aria-pressed={isActive}
                className={[
                'w-full rounded-xl border p-4 text-left transition-colors duration-150 ease-out disabled:cursor-not-allowed disabled:opacity-50',
                isActive ?
                'border-lime-300 bg-lime-300/15' :
                'border-white/12 bg-white/[0.05] hover:bg-white/[0.09]'].
                join(' ')}>
                
                <span className="flex items-center gap-2 text-[13.5px] font-semibold">
                  <span className={`h-2.5 w-2.5 rounded-full ${option.dot}`} aria-hidden="true" />
                  {option.id}
                </span>
                <span className="mt-1.5 block text-[12px] leading-relaxed text-white/55">
                  {option.description}
                </span>
              </button>
            </li>);

        })}
      </ul>
    </section>);

}