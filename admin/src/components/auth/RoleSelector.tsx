import React from 'react';
import { CheckIcon } from 'lucide-react';
import { roles, type RoleId } from '../../data/roles';
import { cn } from '../../utils/cn';

export function RoleSelector({
  value,
  onChange



}: {value: RoleId;onChange: (next: RoleId) => void;}) {
  return (
    <fieldset>
      <legend className="mb-2 text-[13px] font-medium text-ink">Sign in as</legend>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {roles.map((role) => {
          const active = role.id === value;
          return (
            <button
              key={role.id}
              type="button"
              aria-pressed={active}
              onClick={() => onChange(role.id)}
              style={active ? { borderColor: role.accent, backgroundColor: role.accentSoft } : undefined}
              className={cn(
                'group relative rounded-xl border p-3 text-left transition-colors duration-150 ease-smooth',
                active ? 'border-transparent' : 'border-line bg-card hover:bg-faint'
              )}>
              
              <span
                className="flex h-7 w-7 items-center justify-center rounded-lg"
                style={{ backgroundColor: role.accentSoft, color: role.accent }}>
                
                <role.icon className="h-4 w-4" />
              </span>
              <p className="mt-2 text-[13px] font-semibold leading-tight text-ink">{role.name}</p>
              <p className="mt-0.5 text-[11px] leading-snug text-muted">{role.blurb}</p>
              {active ?
              <span
                className="absolute right-2.5 top-2.5 flex h-4 w-4 items-center justify-center rounded-full text-white"
                style={{ backgroundColor: role.accent }}>
                
                  <CheckIcon className="h-2.5 w-2.5" />
                </span> :
              null}
            </button>);

        })}
      </div>
    </fieldset>);

}