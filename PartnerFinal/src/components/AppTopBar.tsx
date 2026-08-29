import React, { useEffect, useRef, useState } from 'react';
import {
  BellIcon,
  BuildingIcon,
  CheckIcon,
  ChevronDownIcon,
  LogOutIcon,
  MoonIcon,
  ShieldCheckIcon,
  SparklesIcon,
  SunIcon,
  TimerResetIcon,
  UserRoundIcon } from
'lucide-react';
import { LiveClock } from './LiveClock';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { PARTNER_AVATAR } from '../data/dashboard';
import { opsAlerts, performanceScore, portfolio } from '../data/operations';

type AppTopBarProps = {
  activeProperty: string;
  onPropertyChange: (id: string) => void;
  onNavigate: (label: string) => void;
};

export function AppTopBar({ activeProperty, onPropertyChange, onNavigate }: AppTopBarProps) {
  const { user, role, logout, triggerIdleWarning } = useAuth();
  const { theme, toggle } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const [propertyOpen, setPropertyOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const propertyRef = useRef<HTMLDivElement>(null);

  const unread = opsAlerts.filter((alert) => alert.unread).length;
  const property = portfolio.find((item) => item.id === activeProperty) ?? portfolio[0];

  useEffect(() => {
    const handle = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) setMenuOpen(false);
      if (propertyRef.current && !propertyRef.current.contains(event.target as Node))
      setPropertyOpen(false);
    };
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, []);

  return (
    <header className="flex h-16 w-full shrink-0 items-center justify-between gap-5 border-b border-white/10 bg-ink px-5">
      <div className="flex min-w-0 items-center gap-3">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-lime-400">
          <span className="h-2.5 w-2.5 rounded-full border-[3px] border-ink border-t-transparent" />
        </span>
        <span className="min-w-0">
          <span className="block truncate text-[16px] font-bold leading-tight tracking-tight text-white">
            Checkdin PartnerOS
          </span>
          <span className="hidden text-[10.5px] font-medium tracking-wide text-white/45 lg:block">
            The Operating System For Modern Hotels
          </span>
        </span>

        <span aria-hidden="true" className="hidden h-6 w-px bg-white/15 sm:block" />

        <div ref={propertyRef} className="relative hidden sm:block">
          <button
            type="button"
            aria-expanded={propertyOpen}
            onClick={() => setPropertyOpen((prev) => !prev)}
            className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-[13.5px] font-medium text-white/85 transition-colors duration-150 ease-out hover:bg-white/[0.07] hover:text-white">
            
            <BuildingIcon size={14} aria-hidden="true" />
            <span className="max-w-[170px] truncate">{property.name}</span>
            <ChevronDownIcon size={14} className="text-white/60" aria-hidden="true" />
          </button>

          {propertyOpen &&
          <div className="absolute left-0 top-11 z-50 w-[268px] overflow-hidden rounded-xl border border-neutral-200 bg-white py-1 shadow-lg">
              <p className="px-4 pb-1 pt-2 text-[10.5px] font-bold tracking-[0.14em] text-ink-muted">
                YOUR PROPERTIES
              </p>
              {portfolio.map((item) =>
            <button
              key={item.id}
              type="button"
              onClick={() => {
                onPropertyChange(item.id);
                setPropertyOpen(false);
              }}
              className="flex w-full items-center justify-between gap-3 px-4 py-2.5 text-left transition-colors duration-150 ease-out hover:bg-neutral-50">
              
                  <span className="min-w-0">
                    <span className="block truncate text-[13px] font-medium text-ink">
                      {item.name}
                    </span>
                    <span className="block text-[11.5px] text-ink-muted">
                      {item.city} • {item.occupancy}% occupancy
                    </span>
                  </span>
                  {item.id === property.id &&
              <CheckIcon size={14} className="shrink-0 text-lime-600" aria-hidden="true" />
              }
                </button>
            )}
              <button
              type="button"
              onClick={() => {
                setPropertyOpen(false);
                onNavigate('Properties');
              }}
              className="w-full border-t border-neutral-100 px-4 py-2.5 text-left text-[12.5px] font-semibold text-ink transition-colors duration-150 ease-out hover:bg-neutral-50">
              
                Compare all properties
              </button>
            </div>
          }
        </div>
      </div>

      <div className="hidden rounded-xl bg-white/[0.07] px-4 py-2 lg:block">
        <LiveClock className="[&>span]:text-white [&_span]:text-white/90" />
      </div>

      <div className="flex items-center gap-2.5">
        <button
          type="button"
          onClick={() => onNavigate('Performance Score')}
          className="hidden items-center gap-1.5 rounded-lg bg-white/[0.07] px-3 py-1.5 text-[12.5px] font-semibold text-white transition-colors duration-150 ease-out hover:bg-white/[0.12] xl:flex">
          
          <SparklesIcon size={13} className="text-lime-400" aria-hidden="true" />
          {performanceScore.score}
          <span className="font-normal text-white/50">/ 100</span>
        </button>

        <button
          type="button"
          onClick={toggle}
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          className="rounded-full p-2 text-white/80 transition-colors duration-150 ease-out hover:bg-white/10 hover:text-white">
          
          {theme === 'dark' ?
          <SunIcon size={18} strokeWidth={1.9} aria-hidden="true" /> :

          <MoonIcon size={18} strokeWidth={1.9} aria-hidden="true" />
          }
        </button>

        <button
          type="button"
          onClick={() => onNavigate('Notifications')}
          aria-label={`Notifications, ${unread} unread`}
          className="relative rounded-full p-2 text-white/80 transition-colors duration-150 ease-out hover:bg-white/10 hover:text-white">
          
          <BellIcon size={18} strokeWidth={1.9} aria-hidden="true" />
          {unread > 0 &&
          <span className="absolute -right-0.5 -top-0.5 flex h-[17px] min-w-[17px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
              {unread}
            </span>
          }
        </button>

        <div className="hidden text-right sm:block">
          <p className="text-[13px] font-semibold leading-tight text-white">{user?.name}</p>
          <p className="text-[11.5px] text-lime-400">{role?.name}</p>
        </div>

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
      </div>
    </header>);

}