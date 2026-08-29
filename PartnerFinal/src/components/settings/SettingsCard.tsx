import React from 'react';

type SettingsCardProps = {
  title: string;
  description?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  bodyClassName?: string;
};

export function SettingsCard({
  title,
  description,
  action,
  children,
  bodyClassName = 'p-5'
}: SettingsCardProps) {
  return (
    <section className="rounded-2xl border border-neutral-200/80 bg-white shadow-card">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-neutral-100 px-5 py-4">
        <div>
          <h2 className="text-[15px] font-semibold text-ink">{title}</h2>
          {description && <p className="mt-0.5 text-[12.5px] text-ink-muted">{description}</p>}
        </div>
        {action}
      </div>
      <div className={bodyClassName}>{children}</div>
    </section>);

}