import React from 'react';
import { TrendingDownIcon, TrendingUpIcon } from 'lucide-react';
import { cn } from '../../utils/cn';
import { IconTile } from '../ui/Primitives';

export function KpiCard({
  label,
  value,
  delta,
  hint,
  icon,
  featured = false







}: {label: string;value: string;delta?: number;hint?: string;icon: React.ComponentType<{className?: string;}>;featured?: boolean;}) {
  const up = (delta ?? 0) >= 0;
  return (
    <div
      className={cn(
        'rounded-xl border bg-card p-5 shadow-card',
        featured ? 'border-accent/60 bg-accent/[0.07]' : 'border-line'
      )}>
      
      <div className="flex items-start gap-3">
        <IconTile icon={icon} tone={featured ? 'accent' : 'neutral'} />
        <div className="min-w-0">
          <p className="text-[13px] font-medium text-muted">{label}</p>
          <p
            className={cn(
              'mt-0.5 font-bold tracking-tight text-ink',
              featured ? 'text-3xl' : 'text-2xl'
            )}>
            
            {value}
          </p>
        </div>
      </div>
      <div className="mt-3 flex items-center gap-2 text-[13px]">
        {delta !== undefined ?
        <span
          className={cn(
            'inline-flex items-center gap-1 font-semibold',
            up ? 'text-positive' : 'text-negative'
          )}>
          
            {up ? <TrendingUpIcon className="h-3.5 w-3.5" /> : <TrendingDownIcon className="h-3.5 w-3.5" />}
            {Math.abs(delta)}%
          </span> :
        null}
        {hint ? <span className="truncate text-muted">{hint}</span> : null}
      </div>
    </div>);

}

export function MiniStat({
  label,
  value,
  hint,
  icon: Icon





}: {label: string;value: string;hint?: string;icon: React.ComponentType<{className?: string;}>;}) {
  return (
    <div className="flex items-center gap-3 px-5 py-4">
      <Icon className="h-4 w-4 shrink-0 text-muted" />
      <div className="min-w-0">
        <p className="text-xs font-medium text-muted">{label}</p>
        <p className="text-lg font-bold leading-tight tracking-tight text-ink">{value}</p>
      </div>
      {hint ? <p className="ml-auto hidden text-xs text-muted sm:block">{hint}</p> : null}
    </div>);

}