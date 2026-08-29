import React, { useState } from 'react';
import {
  ArrowLeftIcon,
  BuildingIcon,
  GlobeIcon,
  KeyRoundIcon,
  LockIcon,
  MonitorIcon,
  ShieldCheckIcon,
  UserRoundIcon } from
'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { deviceContext, property } from '../data/auth';
import { GuestAvatar } from '../components/StatusBadge';
import { LiveClock } from '../components/LiveClock';

type LoginProps = {
  onExit: () => void;
};

export function Login({ onExit }: LoginProps) {
  const {
    step,
    users,
    roles,
    candidateId,
    verifyProperty,
    selectUser,
    verifyUserPassword,
    backToUsers,
    backToProperty
  } = useAuth();

  const [hotelId, setHotelId] = useState('');
  const [propertyPassword, setPropertyPassword] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const candidate = users.find((item) => item.id === candidateId);
  const candidateRole = roles.find((item) => item.id === candidate?.roleId);

  const submitProperty = (event: React.FormEvent) => {
    event.preventDefault();
    setError(verifyProperty(hotelId, propertyPassword));
  };

  const submitUser = (event: React.FormEvent) => {
    event.preventDefault();
    const message = verifyUserPassword(userPassword);
    setError(message);
    if (!message) setUserPassword('');
  };

  return (
    <div className="flex min-h-screen w-full">
      <aside className="hidden w-[42%] flex-col justify-between bg-ink p-10 text-white lg:flex">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-lime-400">
            <span className="h-3 w-3 rounded-full border-[3px] border-ink border-t-transparent" />
          </span>
          <span className="text-[22px] font-bold tracking-tight">
            Check<span className="text-lime-400">din</span>
            <span className="ml-2 text-[10px] font-semibold tracking-[0.28em] text-white/50">
              PARTNER
            </span>
          </span>
        </div>

        <div>
          <h1 className="text-[34px] font-bold leading-tight tracking-tight">
            Sign in to your property.
          </h1>
          <p className="mt-3 max-w-[420px] text-[14px] leading-relaxed text-white/60">
            Every session starts with a fresh login — the portal never keeps you signed in. Property
            credentials come first, then your personal user password.
          </p>

          <ol className="mt-8 space-y-3">
            {[
            { label: 'Hotel ID & property password', active: step === 'property' },
            { label: 'Select your user account', active: step === 'user' },
            { label: 'Enter your user password', active: step === 'password' }].
            map((item, i) =>
            <li key={item.label} className="flex items-center gap-3">
                <span
                className={[
                'flex h-7 w-7 items-center justify-center rounded-full text-[12px] font-semibold',
                item.active ? 'bg-lime-400 text-ink' : 'bg-white/10 text-white/60'].
                join(' ')}>
                
                  {i + 1}
                </span>
                <span
                className={`text-[13.5px] ${item.active ? 'font-semibold text-white' : 'text-white/55'}`}>
                
                  {item.label}
                </span>
              </li>
            )}
          </ol>
        </div>

        <dl className="space-y-2 text-[12px] text-white/50">
          <div className="flex items-center gap-2">
            <MonitorIcon size={13} aria-hidden="true" />
            <dt className="sr-only">Device</dt>
            <dd>{deviceContext.device}</dd>
          </div>
          <div className="flex items-center gap-2">
            <GlobeIcon size={13} aria-hidden="true" />
            <dt className="sr-only">Network</dt>
            <dd>
              IP {deviceContext.ip} • {deviceContext.location}
            </dd>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheckIcon size={13} className="text-lime-400" aria-hidden="true" />
            <dt className="sr-only">Audit</dt>
            <dd>Every login is recorded in the audit log.</dd>
          </div>
        </dl>
      </aside>

      <main className="flex flex-1 flex-col items-center justify-center bg-canvas px-6 py-10">
        <div className="w-full max-w-[420px]">
          <div className="mb-6 flex flex-col items-center text-center">
            <span className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-lime-400">
                <span className="h-3 w-3 rounded-full border-[3px] border-ink border-t-transparent" />
              </span>
              <span className="text-[24px] font-bold leading-none tracking-tight text-ink">
                Checkdin
              </span>
              <span className="rounded-md bg-ink px-2 py-1 text-[9.5px] font-bold tracking-[0.22em] text-lime-400">
                PARTNER
              </span>
            </span>
            <LiveClock className="mt-3 justify-center" />
          </div>

          {step === 'property' &&
          <form
            onSubmit={submitProperty}
            className="rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-card">
            
              <button
              type="button"
              onClick={onExit}
              className="flex items-center gap-1.5 text-[12.5px] font-medium text-ink-muted transition-colors duration-150 ease-out hover:text-ink">
              
                <ArrowLeftIcon size={13} aria-hidden="true" />
                Partner portal
              </button>
              <h2 className="mt-3 text-[19px] font-bold tracking-tight text-ink">Property login</h2>
              <p className="mt-1 text-[13px] text-ink-muted">
                Enter the credentials issued to your property.
              </p>

              <label htmlFor="hotelId" className="mt-5 block text-[13px] font-medium text-ink-soft">
                Hotel ID
              </label>
              <div className="relative mt-1.5">
                <BuildingIcon
                size={16}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-muted"
                aria-hidden="true" />
              
                <input
                id="hotelId"
                value={hotelId}
                onChange={(e) => setHotelId(e.target.value)}
                placeholder="CHK-EMPIRE-017"
                autoComplete="off"
                className="w-full rounded-xl border border-neutral-200 py-2.5 pl-10 pr-3.5 text-[14px] text-ink outline-none transition-colors duration-150 ease-out placeholder:text-neutral-400 hover:border-neutral-300 focus:border-lime-500" />
              
              </div>

              <label
              htmlFor="propertyPassword"
              className="mt-4 block text-[13px] font-medium text-ink-soft">
              
                Property password
              </label>
              <div className="relative mt-1.5">
                <KeyRoundIcon
                size={16}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-muted"
                aria-hidden="true" />
              
                <input
                id="propertyPassword"
                type="password"
                value={propertyPassword}
                onChange={(e) => setPropertyPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-neutral-200 py-2.5 pl-10 pr-3.5 text-[14px] text-ink outline-none transition-colors duration-150 ease-out placeholder:text-neutral-400 hover:border-neutral-300 focus:border-lime-500" />
              
              </div>

              {error && <p className="mt-3 text-[12.5px] font-medium text-red-600">{error}</p>}

              <button
              type="submit"
              className="mt-5 w-full rounded-xl bg-lime-300 py-3 text-[14px] font-semibold text-ink transition-colors duration-150 ease-out hover:bg-lime-200">
              
                Continue
              </button>

              <p className="mt-4 rounded-xl bg-neutral-50 px-3.5 py-2.5 text-[11.5px] text-ink-muted">
                Demo credentials — Hotel ID <span className="font-semibold text-ink">{property.hotelId}</span>,
                property password <span className="font-semibold text-ink">{property.password}</span>, any
                user password <span className="font-semibold text-ink">1234</span>.
              </p>
            </form>
          }

          {step === 'user' &&
          <section className="rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-card">
              <button
              type="button"
              onClick={backToProperty}
              className="flex items-center gap-1.5 text-[12.5px] font-medium text-ink-muted transition-colors duration-150 ease-out hover:text-ink">
              
                <ArrowLeftIcon size={13} aria-hidden="true" />
                Property login
              </button>
              <h2 className="mt-3 text-[19px] font-bold tracking-tight text-ink">Select user</h2>
              <p className="mt-1 text-[13px] text-ink-muted">
                Active accounts for this property.
              </p>

              <ul className="mt-4 space-y-2">
                {users.
              filter((item) => item.active).
              map((item) => {
                const itemRole = roles.find((r) => r.id === item.roleId);
                return (
                  <li key={item.id}>
                        <button
                      type="button"
                      onClick={() => {
                        setError(null);
                        selectUser(item.id);
                      }}
                      className="flex w-full items-center gap-3 rounded-xl border border-neutral-200 p-3 text-left transition-colors duration-150 ease-out hover:border-lime-400 hover:bg-lime-50">
                      
                          <GuestAvatar name={item.name} />
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-[13.5px] font-semibold text-ink">
                              {item.name}
                            </span>
                            <span className="block text-[12px] text-ink-muted">
                              {itemRole?.name} • Last login {item.lastLogin}
                            </span>
                          </span>
                          <UserRoundIcon size={16} className="text-ink-muted" aria-hidden="true" />
                        </button>
                      </li>);

              })}
              </ul>
            </section>
          }

          {step === 'password' && candidate &&
          <form
            onSubmit={submitUser}
            className="rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-card">
            
              <button
              type="button"
              onClick={backToUsers}
              className="flex items-center gap-1.5 text-[12.5px] font-medium text-ink-muted transition-colors duration-150 ease-out hover:text-ink">
              
                <ArrowLeftIcon size={13} aria-hidden="true" />
                Change user
              </button>

              <div className="mt-4 flex items-center gap-3">
                <GuestAvatar name={candidate.name} />
                <div>
                  <p className="text-[15px] font-semibold text-ink">{candidate.name}</p>
                  <p className="text-[12.5px] text-ink-muted">{candidateRole?.name}</p>
                </div>
              </div>

              <label
              htmlFor="userPassword"
              className="mt-5 block text-[13px] font-medium text-ink-soft">
              
                User password
              </label>
              <div className="relative mt-1.5">
                <LockIcon
                size={16}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-muted"
                aria-hidden="true" />
              
                <input
                id="userPassword"
                type="password"
                autoFocus
                value={userPassword}
                onChange={(e) => setUserPassword(e.target.value)}
                placeholder="••••"
                className="w-full rounded-xl border border-neutral-200 py-2.5 pl-10 pr-3.5 text-[14px] text-ink outline-none transition-colors duration-150 ease-out placeholder:text-neutral-400 hover:border-neutral-300 focus:border-lime-500" />
              
              </div>

              {error && <p className="mt-3 text-[12.5px] font-medium text-red-600">{error}</p>}

              <button
              type="submit"
              className="mt-5 w-full rounded-xl bg-lime-300 py-3 text-[14px] font-semibold text-ink transition-colors duration-150 ease-out hover:bg-lime-200">
              
                Access dashboard
              </button>

              <p className="mt-4 text-[11.5px] text-ink-muted">
                {candidateRole?.description}
              </p>
            </form>
          }
        </div>
      </main>
    </div>);

}