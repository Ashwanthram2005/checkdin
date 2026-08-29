import React from 'react';
import {
  BarChart3Icon,
  CalendarOffIcon,
  ClockPlusIcon,
  TicketPercentIcon } from
'lucide-react';

const actions = [
{ label: 'Extensions', caption: 'Approve requests', icon: ClockPlusIcon },
{ label: 'Availability', caption: 'Pause or block', icon: CalendarOffIcon },
{ label: 'Promotions', caption: 'Fill quiet slots', icon: TicketPercentIcon },
{ label: 'Reports', caption: 'Dig into data', icon: BarChart3Icon }];


export function QuickActions({ onNavigate }: {onNavigate: (label: string) => void;}) {
  return (
    <section className="rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-card">
      <h2 className="text-[16px] font-semibold text-ink">Quick Actions</h2>

      <div className="mt-4 grid grid-cols-2 gap-3">
        {actions.map(({ label, caption, icon: Icon }) =>
        <button
          key={label}
          type="button"
          onClick={() => onNavigate(label)}
          className="flex flex-col items-start gap-2 rounded-xl border border-neutral-200 px-3 py-3 text-left transition-colors duration-150 ease-out hover:border-lime-400 hover:bg-lime-50">
          
            <Icon size={19} className="text-ink" strokeWidth={1.9} aria-hidden="true" />
            <span>
              <span className="block text-[12.5px] font-semibold leading-tight text-ink">
                {label}
              </span>
              <span className="mt-0.5 block text-[11px] text-ink-muted">{caption}</span>
            </span>
          </button>
        )}
      </div>
    </section>);

}