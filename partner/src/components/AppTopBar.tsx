import React, { useEffect, useRef, useState } from 'react';
import {
  BellIcon,
  ChevronDownIcon,
  LogOutIcon,
  ShieldCheckIcon,
  TimerResetIcon,
  UserRoundIcon } from
'lucide-react';
import { LiveClock } from './LiveClock';
import { useAuth } from '../contexts/AuthContext';
import { PARTNER_AVATAR } from '../data/dashboard';
import { property } from '../data/auth';

export function AppTopBar() {
  const { user, role, logout, triggerIdleWarning } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const handle = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, [menuOpen]);

  return (
    <header className="flex h-16 w-full shrink-0 items-center justify-between gap-6 border-b border-white/10 bg-ink px-5">
      <div className="flex items-center gap-3">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-lime-400">
          <span className="h-2.5 w-2.5 rounded-full border-[3px] border-ink border-t-transparent" />
        </span>
        <span className="text-[17px] font-bold tracking-tight text-white">
          CHECK<span className="text-lime-400">DIN</span>
        </span>
        <span aria-hidden="true" className="h-5 w-px bg-white/20" />
        <span className="text-[14px] font-medium text-white/80">{property.name}</span>
      </div>

      <div className="hidden rounded-xl bg-white/[0.07] px-4 py-2 md:block">
        <LiveClock className="[&>span]:text-white [&_span]:text-white/90" />
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden text-right sm:block">
          <p className="text-[13px] font-semibold leading-tight text-white">{user?.name}</p>
          <p className="text-[11.5px] text-lime-400">{role?.name}</p>
        </div>

        <button
          type="button"
          aria-label="Notifications, 3 unread"
          className="relative rounded-full p-2 text-white/80 transition-colors duration-150 ease-out hover:bg-white/10 hover:text-white">
          
          <BellIcon size={19} strokeWidth={1.9} aria-hidden="true" />
          <span className="absolute -right-0.5 -top-0.5 flex h-[17px] min-w-[17px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
            3
          </span>
        </button>

        <div ref={menuRef} className="relative">
          <button
            type="button"
            aria-label="Profile menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((prev) => !prev)}
            className="flex items-center gap-1.5 rounded-full pr-1 transition-opacity duration-150 ease-out hover:opacity-80">
            
            <img
              src={PARTNER_AVATAR}
              alt=""
              className="h-9 w-9 rounded-full object-cover ring-2 ring-white/20" />
            
            <ChevronDownIcon size={15} className="text-white/70" aria-hidden="true" />
          </button>

          {menuOpen &&
          <div className="absolute right-0 top-12 z-50 w-[248px] overflow-hidden rounded-xl border border-neutral-200 bg-white py-1 shadow-lg">
              <div className="border-b border-neutral-100 px-4 py-3">
                <p className="text-[13.5px] font-semibold text-ink">{user?.name}</p>
                <p className="mt-0.5 flex items-center gap-1.5 text-[11.5px] text-ink-muted">
                  <ShieldCheckIcon size={12} aria-hidden="true" />
                  {role?.name} • {role?.permissions.length} permissions
                </p>
              </div>
              <button
              type="button"
              onClick={() => setMenuOpen(false)}
              className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-[13px] text-ink-soft transition-colors duration-150 ease-out hover:bg-neutral-50 hover:text-ink">
              
                <UserRoundIcon size={14} aria-hidden="true" />
                My profile
              </button>
              <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                triggerIdleWarning();
              }}
              className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-[13px] text-ink-soft transition-colors duration-150 ease-out hover:bg-neutral-50 hover:text-ink">
              
                <TimerResetIcon size={14} aria-hidden="true" />
                Preview session warning
              </button>
              <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                logout();
              }}
              className="flex w-full items-center gap-2.5 border-t border-neutral-100 px-4 py-2.5 text-left text-[13px] text-red-600 transition-colors duration-150 ease-out hover:bg-red-50">
              
                <LogOutIcon size={14} aria-hidden="true" />
                Logout
              </button>
            </div>
          }
        </div>

        <button
          type="button"
          onClick={() => logout()}
          className="hidden items-center gap-1.5 rounded-xl border border-white/20 px-3.5 py-2 text-[13px] font-medium text-white/85 transition-colors duration-150 ease-out hover:border-white/40 hover:text-white lg:flex">
          
          <LogOutIcon size={15} aria-hidden="true" />
          Logout
        </button>
      </div>
    </header>);

}