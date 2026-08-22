import React from 'react';
import { PlusCircleIcon, CalendarOffIcon, TicketPercentIcon, BarChart3Icon } from 'lucide-react';

const actions = [
{ label: 'Add Room', icon: PlusCircleIcon },
{ label: 'Block Dates', icon: CalendarOffIcon },
{ label: 'Offer / Discount', icon: TicketPercentIcon },
{ label: 'View Reports', icon: BarChart3Icon }];


export function QuickActions() {
  return (
    <section className="rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-card">
      <h2 className="text-[16px] font-semibold text-ink">Quick Actions</h2>

      <div className="mt-4 grid grid-cols-4 gap-3">
        {actions.map(({ label, icon: Icon }) =>
        <button
          key={label}
          type="button"
          className="flex flex-col items-center gap-2 rounded-xl border border-neutral-200 px-2 py-3 text-center transition-colors duration-150 ease-out hover:border-lime-400 hover:bg-lime-50">
          
            <Icon size={20} className="text-ink" strokeWidth={1.9} aria-hidden="true" />
            <span className="text-[11.5px] font-medium leading-tight text-ink-soft">{label}</span>
          </button>
        )}
      </div>
    </section>);

}