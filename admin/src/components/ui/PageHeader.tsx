import React from 'react';

export function PageHeader({
  title,
  subtitle,
  actions




}: {title: string;subtitle?: string;actions?: React.ReactNode;}) {
  return (
    <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-ink sm:text-[28px]">{title}</h1>
        {subtitle ? <p className="mt-1 max-w-2xl text-sm text-muted">{subtitle}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
    </header>);

}

export function Toolbar({ children }: {children: React.ReactNode;}) {
  return (
    <div className="flex flex-col gap-2.5 border-b border-line px-5 py-3.5 sm:flex-row sm:items-center">
      {children}
    </div>);

}