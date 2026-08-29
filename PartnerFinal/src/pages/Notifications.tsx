import React, { useState } from 'react';
import { BellIcon, CheckCheckIcon } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { opsAlerts, type AlertPriority, type OpsAlert } from '../data/operations';

const priorityChip: Record<AlertPriority, string> = {
  Critical: 'bg-red-50 text-red-600',
  High: 'bg-amber-50 text-amber-700',
  Normal: 'bg-neutral-100 text-ink-muted'
};

const filters = ['All', 'Critical', 'High', 'Normal', 'Unread'] as const;

export function Notifications() {
  const [alerts, setAlerts] = useState<OpsAlert[]>(opsAlerts);
  const [filter, setFilter] = useState<string>('All');

  const visible = alerts.filter((alert) => {
    if (filter === 'All') return true;
    if (filter === 'Unread') return alert.unread;
    return alert.priority === filter;
  });

  const unread = alerts.filter((alert) => alert.unread).length;

  return (
    <main className="scroll-slim h-full flex-1 overflow-y-auto bg-canvas px-7 py-6">
      <PageHeader
        title="Notifications"
        subtitle="Every operational event across bookings, payments and visibility."
        action={
        <button
          type="button"
          onClick={() => setAlerts((prev) => prev.map((a) => ({ ...a, unread: false })))}
          className="flex items-center gap-1.5 rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-[13.5px] font-medium text-ink shadow-card transition-colors duration-150 ease-out hover:border-neutral-300">
          
            <CheckCheckIcon size={16} aria-hidden="true" />
            Mark all read
          </button>
        } />
      

      <div className="mt-6 space-y-5 pb-8">
        <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-neutral-200/80 bg-white p-4 shadow-card">
          <BellIcon size={16} className="text-ink-muted" aria-hidden="true" />
          {filters.map((item) =>
          <button
            key={item}
            type="button"
            onClick={() => setFilter(item)}
            className={[
            'rounded-lg px-3.5 py-2 text-[12.5px] transition-colors duration-150 ease-out',
            filter === item ?
            'bg-ink font-semibold text-white' :
            'border border-neutral-200 font-medium text-ink-soft hover:border-neutral-300'].
            join(' ')}>
            
              {item}
              {item === 'Unread' && unread > 0 &&
            <span className="ml-1.5 rounded-md bg-red-500 px-1.5 text-[10.5px] font-bold text-white">
                  {unread}
                </span>
            }
            </button>
          )}
        </div>

        <ul className="overflow-hidden rounded-2xl border border-neutral-200/80 bg-white shadow-card">
          {visible.map((alert) =>
          <li
            key={alert.id}
            className={[
            'flex flex-wrap items-start gap-3 border-b border-neutral-100 px-5 py-4 last:border-0',
            alert.unread ? 'bg-lime-50/40' : ''].
            join(' ')}>
            
              <span
              className={`rounded-md px-2.5 py-1 text-[11px] font-semibold ${priorityChip[alert.priority]}`}>
              
                {alert.priority}
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex flex-wrap items-center gap-2">
                  <span className="text-[13.5px] font-semibold text-ink">{alert.title}</span>
                  <span className="rounded-md bg-neutral-100 px-2 py-0.5 text-[10.5px] font-medium text-ink-muted">
                    {alert.type}
                  </span>
                </span>
                <span className="mt-0.5 block text-[12.5px] text-ink-soft">{alert.detail}</span>
              </span>
              <span className="whitespace-nowrap text-[11.5px] text-ink-muted">{alert.time}</span>
              {alert.unread &&
            <button
              type="button"
              onClick={() =>
              setAlerts((prev) =>
              prev.map((item) =>
              item.id === alert.id ? { ...item, unread: false } : item
              )
              )
              }
              className="rounded-lg border border-neutral-200 px-2.5 py-1 text-[11.5px] font-medium text-ink transition-colors duration-150 ease-out hover:border-neutral-300">
              
                  Mark read
                </button>
            }
            </li>
          )}
          {visible.length === 0 &&
          <li className="px-5 py-16 text-center text-[13.5px] text-ink-muted">
              Nothing here — you are all caught up.
            </li>
          }
        </ul>
      </div>
    </main>);

}