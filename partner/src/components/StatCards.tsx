import React from 'react';
import {
  CalendarCheckIcon,
  IndianRupeeIcon,
  PieChartIcon,
  UserRoundIcon,
  TrendingUpIcon } from
'lucide-react';

const stats = [
{
  label: "Today's Bookings",
  value: '42',
  icon: CalendarCheckIcon,
  delta: '18% vs yesterday'
},
{
  label: 'Revenue Today',
  value: '₹ 18,450',
  icon: IndianRupeeIcon,
  delta: '22% vs yesterday'
},
{
  label: 'Occupancy',
  value: '76%',
  icon: PieChartIcon,
  delta: '8% vs yesterday'
},
{
  label: 'Upcoming Check-ins',
  value: '12',
  icon: UserRoundIcon,
  note: 'Next 24 hours'
}];


export function StatCards() {
  return (
    <section aria-label="Today at a glance" className="grid grid-cols-2 gap-5 xl:grid-cols-4">
      {stats.map(({ label, value, icon: Icon, delta, note }) =>
      <article
        key={label}
        className="flex items-start gap-4 rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-card">
        
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-lime-100">
            <Icon size={20} className="text-lime-600" strokeWidth={2} aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <p className="text-[13px] font-medium text-ink-muted">{label}</p>
            <p className="mt-1 text-[26px] font-bold leading-none tracking-tight text-ink">
              {value}
            </p>
            {delta ?
          <p className="mt-2.5 flex items-center gap-1 text-[12px] text-ink-muted">
                <TrendingUpIcon size={13} className="text-forest" aria-hidden="true" />
                <span className="font-semibold text-forest">{delta.split(' ')[0]}</span>
                {delta.slice(delta.indexOf(' ') + 1)}
              </p> :

          <p className="mt-2.5 text-[12px] text-ink-muted">{note}</p>
          }
          </div>
        </article>
      )}
    </section>);

}