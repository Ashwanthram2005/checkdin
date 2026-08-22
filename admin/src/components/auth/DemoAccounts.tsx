import React from 'react';
import { CopyIcon, LogInIcon } from 'lucide-react';
import { roles, type RoleId } from '../../data/roles';
import { Button } from '../ui/Button';

export function DemoAccounts({
  onUse,
  onLogin,
  busyRole




}: {onUse: (roleId: RoleId) => void;onLogin: (roleId: RoleId) => void;busyRole: RoleId | null;}) {
  return (
    <section className="rounded-xl border border-line bg-card">
      <header className="flex flex-wrap items-center justify-between gap-2 border-b border-line px-4 py-3">
        <div>
          <h2 className="text-[13px] font-semibold text-ink">Demo accounts</h2>
          <p className="text-xs text-muted">Sandbox data only — nothing here bills or notifies.</p>
        </div>
      </header>

      <ul className="divide-y divide-line">
        {roles.map((role) =>
        <li key={role.id} className="flex flex-wrap items-center gap-3 px-4 py-3">
            <span
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
            style={{ backgroundColor: role.accentSoft, color: role.accent }}>
            
              <role.icon className="h-4 w-4" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[13px] font-semibold text-ink">{role.name}</p>
              <p className="truncate font-mono text-[11px] text-muted">
                {role.email} · {role.password}
              </p>
            </div>
            <div className="flex gap-1.5">
              <Button
              size="sm"
              variant="ghost"
              icon={CopyIcon}
              aria-label={`Fill the form with ${role.name} credentials`}
              onClick={() => onUse(role.id)}>
              
                Fill
              </Button>
              <Button
              size="sm"
              icon={LogInIcon}
              disabled={busyRole !== null}
              onClick={() => onLogin(role.id)}>
              
                {busyRole === role.id ? 'Signing in…' : 'Login as demo user'}
              </Button>
            </div>
          </li>
        )}
      </ul>
    </section>);

}