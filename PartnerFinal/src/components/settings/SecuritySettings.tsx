import React, { useState } from 'react';
import {
  AlertTriangleIcon,
  CheckCircle2Icon,
  LaptopIcon,
  LogOutIcon,
  SmartphoneIcon } from
'lucide-react';
import { SettingsCard } from './SettingsCard';
import { Field, TextInput } from './FormField';
import { Toggle } from './Toggle';
import { activeSessions, loginHistory } from '../../data/settings';

export function SecuritySettings() {
  const [twoFactor, setTwoFactor] = useState(true);
  const [loginAlerts, setLoginAlerts] = useState(true);
  const [sessions, setSessions] = useState(activeSessions);
  const [passwords, setPasswords] = useState({ current: '', next: '', confirm: '' });
  const [message, setMessage] = useState<string | null>(null);

  const changePassword = (event: React.FormEvent) => {
    event.preventDefault();
    if (passwords.next.length < 8) {
      setMessage('Password must be at least 8 characters.');
      return;
    }
    if (passwords.next !== passwords.confirm) {
      setMessage('New passwords do not match.');
      return;
    }
    setMessage('Password updated successfully.');
    setPasswords({ current: '', next: '', confirm: '' });
  };

  const isError = message !== null && message !== 'Password updated successfully.';

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        <SettingsCard title="Change password" description="Use at least 8 characters with a number.">
          <form onSubmit={changePassword} className="space-y-4">
            <Field id="currentPassword" label="Current password">
              <TextInput
                id="currentPassword"
                type="password"
                value={passwords.current}
                onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                placeholder="••••••••" />
              
            </Field>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Field id="newPassword" label="New password">
                <TextInput
                  id="newPassword"
                  type="password"
                  value={passwords.next}
                  onChange={(e) => setPasswords({ ...passwords, next: e.target.value })}
                  placeholder="••••••••" />
                
              </Field>
              <Field id="confirmPassword" label="Confirm new password">
                <TextInput
                  id="confirmPassword"
                  type="password"
                  value={passwords.confirm}
                  onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                  placeholder="••••••••" />
                
              </Field>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="submit"
                className="rounded-xl bg-ink px-4 py-2.5 text-[13.5px] font-semibold text-white transition-colors duration-150 ease-out hover:bg-ink-soft">
                
                Update password
              </button>
              {message &&
              <p
                role="status"
                className={`flex items-center gap-1.5 text-[12.5px] font-medium ${
                isError ? 'text-red-600' : 'text-forest'}`
                }>
                
                  {isError ?
                <AlertTriangleIcon size={14} aria-hidden="true" /> :

                <CheckCircle2Icon size={14} aria-hidden="true" />
                }
                  {message}
                </p>
              }
            </div>
          </form>
        </SettingsCard>

        <SettingsCard
          title="Two-factor authentication"
          description="Protect your account with a second step at login."
          bodyClassName="px-5 py-1">
          
          <div className="divide-y divide-neutral-100">
            <Toggle
              checked={twoFactor}
              onChange={setTwoFactor}
              label="Authenticator app"
              description="Verify with a 6-digit code from Google Authenticator." />
            
            <Toggle
              checked={loginAlerts}
              onChange={setLoginAlerts}
              label="Login alerts"
              description="Email me whenever a new device signs in." />
            
          </div>
          {twoFactor &&
          <div className="mb-4 mt-1 flex items-center justify-between gap-4 rounded-xl bg-neutral-50 px-4 py-3">
              <p className="text-[12.5px] text-ink-muted">
                Backup codes generated on 11 Aug 2026 — 8 of 10 unused.
              </p>
              <button
              type="button"
              className="shrink-0 rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-[12.5px] font-medium text-ink transition-colors duration-150 ease-out hover:border-neutral-300">
              
                Regenerate
              </button>
            </div>
          }
        </SettingsCard>
      </div>

      <SettingsCard
        title="Active sessions & devices"
        description="Devices currently signed in to this partner account."
        bodyClassName="divide-y divide-neutral-100"
        action={
        <button
          type="button"
          onClick={() => setSessions((prev) => prev.filter((session) => session.current))}
          className="flex items-center gap-1.5 rounded-lg border border-red-200 px-3.5 py-2 text-[13px] font-medium text-red-600 transition-colors duration-150 ease-out hover:bg-red-50">
          
            <LogOutIcon size={14} aria-hidden="true" />
            Logout from all devices
          </button>
        }>
        
        {sessions.map((session) => {
          const Icon = session.device.includes('iPhone') ? SmartphoneIcon : LaptopIcon;
          return (
            <div key={session.id} className="flex items-center gap-4 px-5 py-4 first:pt-0 last:pb-0">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-neutral-100">
                <Icon size={18} className="text-ink" aria-hidden="true" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="flex items-center gap-2 text-[13.5px] font-medium text-ink">
                  {session.device}
                  {session.current &&
                  <span className="rounded-md bg-lime-100 px-2 py-0.5 text-[10.5px] font-semibold text-lime-600">
                      This device
                    </span>
                  }
                </p>
                <p className="mt-0.5 text-[12px] text-ink-muted">
                  {session.location} • IP {session.ip} • {session.lastSeen}
                </p>
              </div>
              {!session.current &&
              <button
                type="button"
                onClick={() => setSessions((prev) => prev.filter((s) => s.id !== session.id))}
                className="rounded-lg border border-neutral-200 px-3 py-1.5 text-[12.5px] font-medium text-ink transition-colors duration-150 ease-out hover:border-neutral-300">
                
                  Sign out
                </button>
              }
            </div>);

        })}
      </SettingsCard>

      <SettingsCard title="Login history" description="Last 30 days of account activity." bodyClassName="">
        <ul className="divide-y divide-neutral-100">
          {loginHistory.map((entry) =>
          <li key={entry.id} className="flex items-center gap-4 px-5 py-3.5">
              <span
              className={`h-2 w-2 shrink-0 rounded-full ${entry.ok ? 'bg-forest' : 'bg-red-500'}`}
              aria-hidden="true" />
            
              <div className="min-w-0 flex-1">
                <p className="text-[13.5px] font-medium text-ink">{entry.event}</p>
                <p className="mt-0.5 text-[12px] text-ink-muted">{entry.device}</p>
              </div>
              <span className="text-[12.5px] text-ink-muted">{entry.time}</span>
            </li>
          )}
        </ul>
      </SettingsCard>
    </div>);

}