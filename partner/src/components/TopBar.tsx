import React from 'react';
import { CalendarIcon, ChevronDownIcon } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export function TopBar() {
  const { user, role } = useAuth();
  const firstName = user?.name.split(' ')[0] ?? 'there';

  return (
    <header className="flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="text-[26px] font-bold tracking-tight text-ink">
          Welcome back, {firstName}! <span aria-hidden="true">👋</span>
        </h1>
        <p className="mt-1 text-[14px] text-ink-muted">
          Signed in as {role?.name} — here's what's happening with your property today.
        </p>
      </div>

      <button
        type="button"
        className="flex items-center gap-3 rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-[14px] font-medium text-ink shadow-card transition-colors duration-150 ease-out hover:border-neutral-300">
        
        <CalendarIcon size={17} className="text-ink-muted" aria-hidden="true" />
        16 Aug 2026, Sat
        <ChevronDownIcon size={16} className="ml-6 text-ink-muted" aria-hidden="true" />
      </button>
    </header>);

}