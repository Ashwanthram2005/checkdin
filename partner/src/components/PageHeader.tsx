import React from 'react';

type PageHeaderProps = {
  title: string;
  subtitle: string;
  action?: React.ReactNode;
};

export function PageHeader({ title, subtitle, action }: PageHeaderProps) {
  return (
    <header className="flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="text-[26px] font-bold tracking-tight text-ink">{title}</h1>
        <p className="mt-1 text-[14px] text-ink-muted">{subtitle}</p>
      </div>
      {action && <div className="flex items-center gap-3">{action}</div>}
    </header>);

}