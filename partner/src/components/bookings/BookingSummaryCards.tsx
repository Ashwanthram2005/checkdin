import React from "react";
import { CalendarRangeIcon, ClockIcon, LogInIcon, LogOutIcon, UsersIcon, XCircleIcon, BoxIcon } from "lucide-react";
export type BookingCounts = {
  total: number;
  pending: number;
  checkInsToday: number;
  checkOutsToday: number;
  activeGuests: number;
  cancelled: number;
};
type BookingSummaryCardsProps = {
  counts: BookingCounts;
  onSelect: (tab: string) => void;
};
export function BookingSummaryCards({
  counts,
  onSelect
}: BookingSummaryCardsProps) {
  const cards: {
    label: string;
    value: number;
    icon: BoxIcon;
    tab: string;
    note: string;
    urgent?: boolean;
  }[] = [{
    label: 'Total Bookings',
    value: counts.total,
    icon: CalendarRangeIcon,
    tab: 'All Bookings',
    note: 'This period'
  }, {
    label: 'Pending Approval',
    value: counts.pending,
    icon: ClockIcon,
    tab: 'Pending Approval',
    note: 'Needs your action',
    urgent: true
  }, {
    label: "Today's Check-ins",
    value: counts.checkInsToday,
    icon: LogInIcon,
    tab: 'Confirmed',
    note: '16 Aug 2026'
  }, {
    label: "Today's Check-outs",
    value: counts.checkOutsToday,
    icon: LogOutIcon,
    tab: 'Checked In',
    note: '16 Aug 2026'
  }, {
    label: 'Active Guests',
    value: counts.activeGuests,
    icon: UsersIcon,
    tab: 'Checked In',
    note: 'In-house now'
  }, {
    label: 'Cancelled',
    value: counts.cancelled,
    icon: XCircleIcon,
    tab: 'Cancelled',
    note: 'This period'
  }];
  return <section aria-label="Booking summary" className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
      {cards.map(({
      label,
      value,
      icon: Icon,
      tab,
      note,
      urgent
    }) => <button key={label} type="button" onClick={() => onSelect(tab)} className={['rounded-2xl border p-4 text-left transition-colors duration-150 ease-out', urgent ? 'border-lime-400 bg-lime-50 hover:border-lime-500' : 'border-neutral-200/80 bg-white shadow-card hover:border-neutral-300'].join(' ')}>
          <span className="flex items-center gap-2">
            <Icon size={15} className={urgent ? 'text-lime-600' : 'text-ink-muted'} aria-hidden="true" />
            <span className="text-[12.5px] font-medium text-ink-muted">{label}</span>
          </span>
          <span className="mt-2 block text-[26px] font-bold leading-none tracking-tight text-ink">
            {value}
          </span>
          <span className={`mt-1.5 block text-[11.5px] ${urgent ? 'font-semibold text-lime-600' : 'text-ink-muted'}`}>
            {note}
          </span>
        </button>)}
    </section>;
}