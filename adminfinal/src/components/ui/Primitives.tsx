import React from 'react';
import { cn } from '../../utils/cn';
import { initials } from '../../utils/format';

export function Avatar({
  name,
  src,
  size = 'md'




}: {name: string;src?: string;size?: 'sm' | 'md' | 'lg';}) {
  const sizes = { sm: 'h-7 w-7 text-[11px]', md: 'h-9 w-9 text-xs', lg: 'h-12 w-12 text-sm' };
  if (src) {
    return (
      <img
        src={src}
        alt=""
        className={cn('shrink-0 rounded-full object-cover', sizes[size])} />);


  }
  return (
    <span
      aria-hidden="true"
      className={cn(
        'inline-flex shrink-0 items-center justify-center rounded-full bg-accent/30 font-semibold text-ink',
        sizes[size]
      )}>
      
      {initials(name)}
    </span>);

}

export function IconTile({
  icon: Icon,
  tone = 'accent'



}: {icon: React.ComponentType<{className?: string;}>;tone?: 'accent' | 'neutral';}) {
  return (
    <span
      className={cn(
        'inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full',
        tone === 'accent' ? 'bg-accent/25 text-ink' : 'bg-faint text-muted'
      )}>
      
      <Icon className="h-4.5 w-4.5" />
    </span>);

}

export function DefinitionList({
  items,
  columns = 2



}: {items: {label: string;value: React.ReactNode;}[];columns?: 1 | 2 | 3;}) {
  const grid = { 1: 'grid-cols-1', 2: 'sm:grid-cols-2', 3: 'sm:grid-cols-3' };
  return (
    <dl className={cn('grid grid-cols-1 gap-x-6 gap-y-4', grid[columns])}>
      {items.map((item) =>
      <div key={item.label}>
          <dt className="text-[11px] font-semibold uppercase tracking-wider text-muted">
            {item.label}
          </dt>
          <dd className="mt-1 text-sm font-medium text-ink">{item.value}</dd>
        </div>
      )}
    </dl>);

}

export function ProgressBar({ value, label }: {value: number;label?: string;}) {
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-full min-w-[56px] overflow-hidden rounded-full bg-line">
        <div
          className="h-full rounded-full bg-accent"
          style={{ width: `${Math.min(100, Math.max(0, value))}%` }} />
        
      </div>
      <span className="w-9 shrink-0 text-right text-[13px] font-medium tabular-nums text-ink">
        {label ?? `${Math.round(value)}%`}
      </span>
    </div>);

}

export function Timeline({
  events


}: {events: {label: string;at: string;by: string;note?: string;}[];}) {
  return (
    <ol className="relative space-y-5 pl-5">
      <span className="absolute left-[3px] top-1.5 bottom-2 w-px bg-line" aria-hidden="true" />
      {events.map((event, index) =>
      <li key={`${event.label}-${event.at}`} className="relative">
          <span
          className={cn(
            'absolute -left-5 top-1.5 h-[7px] w-[7px] rounded-full ring-4 ring-card',
            index === 0 ? 'bg-accent' : 'bg-line'
          )} />
        
          <p className="text-sm font-semibold text-ink">{event.label}</p>
          <p className="text-[13px] text-muted">
            {event.at} · {event.by}
          </p>
          {event.note ? <p className="mt-1 text-[13px] text-muted">{event.note}</p> : null}
        </li>
      )}
    </ol>);

}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action





}: {icon: React.ComponentType<{className?: string;}>;title: string;description: string;action?: React.ReactNode;}) {
  return (
    <div className="flex flex-col items-center gap-2 px-6 py-16 text-center">
      <Icon className="h-6 w-6 text-muted" />
      <p className="text-sm font-semibold text-ink">{title}</p>
      <p className="max-w-sm text-[13px] text-muted">{description}</p>
      {action ? <div className="mt-2">{action}</div> : null}
    </div>);

}