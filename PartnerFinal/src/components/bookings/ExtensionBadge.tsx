import React from 'react';
import type { ExtensionState } from '../../data/bookings';

const styles: Record<ExtensionState, {chip: string;label: string;}> = {
  'Pending Approval': { chip: 'bg-orange-100 text-orange-700', label: 'Pending Approval' },
  Approved: { chip: 'bg-lime-100 text-lime-700', label: 'Approved' },
  Rejected: { chip: 'bg-red-50 text-red-600', label: 'Rejected' },
  Expired: { chip: 'bg-neutral-100 text-ink-muted', label: 'Expired' }
};

type ExtensionBadgeProps = {
  state: ExtensionState;
  extraHours?: number;
};

export function ExtensionBadge({ state, extraHours }: ExtensionBadgeProps) {
  const { chip, label } = styles[state];
  const suffix = state === 'Approved' && extraHours ? ` (+${extraHours}h)` : '';

  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-md px-2.5 py-1 text-[11px] font-semibold ${chip}`}>
      
      {state === 'Pending Approval' &&
      <span className="h-1.5 w-1.5 rounded-full bg-orange-500" aria-hidden="true" />
      }
      {label}
      {suffix}
    </span>);

}