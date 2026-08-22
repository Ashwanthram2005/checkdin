import React from 'react';
import { BedDoubleIcon } from 'lucide-react';
import { roomStatus } from '../data/dashboard';

const tones = {
  neutral: { chip: 'bg-neutral-100 text-ink-muted', value: 'text-ink' },
  lime: { chip: 'bg-lime-100 text-lime-600', value: 'text-ink' },
  forest: { chip: 'bg-lime-50 text-forest', value: 'text-ink' },
  blue: { chip: 'bg-blue-50 text-blue-600', value: 'text-blue-600' },
  red: { chip: 'bg-red-50 text-red-600', value: 'text-red-600' }
};

export function RoomStatus() {
  return (
    <section className="rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-card">
      <div className="flex items-center justify-between">
        <h2 className="text-[16px] font-semibold text-ink">Room Status</h2>
        <button
          type="button"
          className="text-[13px] font-medium text-lime-600 transition-colors duration-150 ease-out hover:text-lime-500">
          
          View all
        </button>
      </div>

      <dl className="mt-3 space-y-1">
        {roomStatus.map((item) => {
          const tone = tones[item.tone];
          return (
            <div key={item.label} className="flex items-center gap-3 py-1.5">
              <span
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md ${tone.chip}`}>
                
                <BedDoubleIcon size={15} strokeWidth={2} aria-hidden="true" />
              </span>
              <dt className="flex-1 text-[13.5px] text-ink-soft">{item.label}</dt>
              <dd className={`text-[14px] font-semibold ${tone.value}`}>{item.count}</dd>
            </div>);

        })}
      </dl>
    </section>);

}