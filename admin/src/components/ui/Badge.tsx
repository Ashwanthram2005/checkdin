import React from 'react';
import { cn } from '../../utils/cn';

export type Tone = 'neutral' | 'positive' | 'warning' | 'negative' | 'info' | 'accent';

const tones: Record<Tone, string> = {
  neutral: 'bg-faint text-muted border-line',
  positive: 'bg-positive/10 text-positive border-positive/25',
  warning: 'bg-warning/10 text-warning border-warning/25',
  negative: 'bg-negative/10 text-negative border-negative/25',
  info: 'bg-info/10 text-info border-info/25',
  accent: 'bg-accent/25 text-ink border-accent/50'
};

const statusTone: Record<string, Tone> = {
  Pending: 'warning',
  'Pending Approval': 'warning',
  'Pending KYC': 'warning',
  Requested: 'warning',
  Scheduled: 'info',
  Paused: 'neutral',
  Draft: 'neutral',
  Confirmed: 'info',
  'Checked In': 'accent',
  'Checked Out': 'neutral',
  Cancelled: 'negative',
  Refunded: 'negative',
  Rejected: 'negative',
  Failed: 'negative',
  Banned: 'negative',
  Blocked: 'negative',
  Suspended: 'negative',
  Escalated: 'negative',
  Urgent: 'negative',
  High: 'warning',
  Medium: 'info',
  Low: 'neutral',
  Active: 'positive',
  Approved: 'positive',
  Completed: 'positive',
  Processed: 'positive',
  Verified: 'positive',
  Published: 'positive',
  Paid: 'positive',
  Sent: 'positive',
  Cleared: 'positive',
  Available: 'positive',
  Occupied: 'info',
  Maintenance: 'warning',
  Open: 'info',
  'In Progress': 'info',
  Closed: 'neutral',
  Hidden: 'neutral',
  Flagged: 'warning',
  Reviewing: 'warning',
  Expired: 'neutral',
  Unverified: 'warning',
  Invited: 'info',
  Disabled: 'neutral',
  'Partially Paid': 'warning',
  Unpaid: 'negative'
};

export function Badge({
  children,
  tone,
  className




}: {children: React.ReactNode;tone?: Tone;className?: string;}) {
  const resolved = tone ?? (typeof children === 'string' ? statusTone[children] : undefined) ?? 'neutral';
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 whitespace-nowrap rounded-md border px-2 py-0.5 text-xs font-medium',
        tones[resolved],
        className
      )}>
      
      {children}
    </span>);

}

export function StatusDot({ tone = 'neutral' }: {tone?: Tone;}) {
  const map: Record<Tone, string> = {
    neutral: 'bg-muted',
    positive: 'bg-positive',
    warning: 'bg-warning',
    negative: 'bg-negative',
    info: 'bg-info',
    accent: 'bg-accent'
  };
  return <span className={cn('h-1.5 w-1.5 rounded-full', map[tone])} />;
}