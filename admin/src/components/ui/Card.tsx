import React from 'react';
import { cn } from '../../utils/cn';

export function Card({
  className,
  children



}: {className?: string;children: React.ReactNode;}) {
  return (
    <section className={cn('rounded-xl border border-line bg-card shadow-card', className)}>
      {children}
    </section>);

}

export function CardHeader({
  title,
  subtitle,
  action,
  className





}: {title: string;subtitle?: string;action?: React.ReactNode;className?: string;}) {
  return (
    <header
      className={cn(
        'flex flex-wrap items-start justify-between gap-3 border-b border-line px-5 py-4',
        className
      )}>
      
      <div>
        <h2 className="text-base font-semibold tracking-tight text-ink">{title}</h2>
        {subtitle ? <p className="mt-0.5 text-[13px] text-muted">{subtitle}</p> : null}
      </div>
      {action}
    </header>);

}