import React, { useMemo, useState } from 'react';
import { EyeIcon, SearchIcon, ShieldCheckIcon } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { useAuth } from '../contexts/AuthContext';
import type { AuditCategory } from '../data/auth';

const categoryChip: Record<AuditCategory, string> = {
  Operations: 'bg-blue-50 text-blue-700',
  Management: 'bg-lime-100 text-lime-600',
  Security: 'bg-amber-50 text-amber-700'
};

const visibilityCopy: Record<string, string> = {
  owner: 'You see the complete history, including security, banking, permission and payout events.',
  manager: 'You see operational and management activity. Security and banking events are owner-only.',
  staff: 'You see operational activity for your property.'
};

export function AuditLog() {
  const { visibleAuditLog, loginActivity, role } = useAuth();
  const [tab, setTab] = useState<'activity' | 'logins'>('activity');
  const [category, setCategory] = useState<'All' | AuditCategory>('All');
  const [query, setQuery] = useState('');

  const categories = useMemo<('All' | AuditCategory)[]>(() => {
    if (role?.level === 'owner') return ['All', 'Operations', 'Management', 'Security'];
    if (role?.level === 'manager') return ['All', 'Operations', 'Management'];
    return ['All', 'Operations'];
  }, [role]);

  const rows = visibleAuditLog.filter((entry) => {
    if (category !== 'All' && entry.category !== category) return false;
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return [entry.actor, entry.role, entry.action, entry.detail].some((field) =>
    field.toLowerCase().includes(q)
    );
  });

  return (
    <main className="scroll-slim h-full flex-1 overflow-y-auto bg-canvas px-7 py-6">
      <PageHeader
        title="Audit Log"
        subtitle="Every action taken on this property, with who did it and when." />
      

      <div className="mt-6 space-y-5">
        <p className="flex items-start gap-2.5 rounded-2xl border border-neutral-200/80 bg-white px-4 py-3 text-[13px] text-ink-soft shadow-card">
          <EyeIcon size={16} className="mt-0.5 shrink-0 text-ink-muted" aria-hidden="true" />
          <span>
            <span className="font-semibold text-ink">Visible as {role?.name}.</span>{' '}
            {visibilityCopy[role?.level ?? 'staff']}
          </span>
        </p>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div role="tablist" aria-label="Audit views" className="flex rounded-xl bg-neutral-100 p-1">
            {(
            [
            ['activity', 'Activity history'],
            ['logins', 'Login activity']] as
            const).
            map(([id, label]) =>
            <button
              key={id}
              role="tab"
              type="button"
              aria-selected={tab === id}
              onClick={() => setTab(id)}
              className={[
              'rounded-lg px-4 py-2 text-[13px] transition-colors duration-150 ease-out',
              tab === id ?
              'bg-white font-semibold text-ink shadow-card' :
              'font-medium text-ink-muted hover:text-ink'].
              join(' ')}>
              
                {label}
              </button>
            )}
          </div>

          {tab === 'activity' &&
          <div className="flex flex-wrap items-center gap-2">
              {categories.map((item) =>
            <button
              key={item}
              type="button"
              onClick={() => setCategory(item)}
              className={[
              'rounded-lg px-3 py-1.5 text-[12.5px] transition-colors duration-150 ease-out',
              category === item ?
              'bg-ink font-semibold text-white' :
              'border border-neutral-200 bg-white font-medium text-ink-soft hover:border-neutral-300'].
              join(' ')}>
              
                  {item}
                </button>
            )}
              <div className="relative">
                <SearchIcon
                size={15}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted"
                aria-hidden="true" />
              
                <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search activity"
                aria-label="Search activity"
                className="w-[220px] rounded-lg border border-neutral-200 bg-white py-2 pl-9 pr-3 text-[13px] text-ink outline-none transition-colors duration-150 ease-out placeholder:text-neutral-400 hover:border-neutral-300 focus:border-lime-500" />
              
              </div>
            </div>
          }
        </div>

        {tab === 'activity' ?
        <div className="overflow-hidden rounded-2xl border border-neutral-200/80 bg-white shadow-card">
            {rows.length === 0 ?
          <p className="px-5 py-16 text-center text-[13.5px] text-ink-muted">
                No activity matches this filter.
              </p> :

          <ul className="divide-y divide-neutral-100">
                {rows.map((entry) =>
            <li key={entry.id} className="flex flex-wrap items-center gap-3 px-5 py-3.5">
                    <span className="w-[170px] shrink-0 font-mono text-[12px] tabular-nums text-ink-muted">
                      {entry.time}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[13.5px] text-ink">
                        <span className="font-semibold">{entry.role} {entry.actor}</span>{' '}
                        {entry.action.toLowerCase()}
                      </span>
                      <span className="mt-0.5 block text-[12px] text-ink-muted">{entry.detail}</span>
                    </span>
                    <span
                className={`shrink-0 rounded-md px-2.5 py-1 text-[11px] font-semibold ${categoryChip[entry.category]}`}>
                
                      {entry.category}
                    </span>
                  </li>
            )}
              </ul>
          }
          </div> :

        <div className="overflow-hidden rounded-2xl border border-neutral-200/80 bg-white shadow-card">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[860px] border-collapse text-left">
                <thead>
                  <tr className="border-b border-neutral-200/80 bg-neutral-50/70">
                    {['User', 'Role', 'Login time', 'Logout time', 'Device', 'IP address', 'Location'].map(
                    (head) =>
                    <th
                      key={head}
                      scope="col"
                      className="whitespace-nowrap px-4 py-2.5 text-[12px] font-medium text-ink-muted">
                      
                          {head}
                        </th>

                  )}
                  </tr>
                </thead>
                <tbody>
                  {loginActivity.map((entry) =>
                <tr key={entry.id} className="border-b border-neutral-100 last:border-0">
                      <td className="whitespace-nowrap px-4 py-3.5 text-[13.5px] font-medium text-ink">
                        {entry.user}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3.5 text-[13px] text-ink-soft">
                        {entry.role}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3.5 text-[13px] text-ink-soft">
                        {entry.loginTime}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3.5 text-[13px]">
                        {entry.logoutTime ?
                    <span className="text-ink-soft">{entry.logoutTime}</span> :

                    <span className="inline-flex items-center gap-1.5 rounded-md bg-lime-100 px-2 py-0.5 text-[11px] font-semibold text-lime-600">
                            <ShieldCheckIcon size={11} aria-hidden="true" />
                            Active session
                          </span>
                    }
                      </td>
                      <td className="whitespace-nowrap px-4 py-3.5 text-[13px] text-ink-soft">
                        {entry.device}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3.5 font-mono text-[12.5px] text-ink-soft">
                        {entry.ip}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3.5 text-[13px] text-ink-soft">
                        {entry.location}
                      </td>
                    </tr>
                )}
                </tbody>
              </table>
            </div>
          </div>
        }
      </div>
    </main>);

}