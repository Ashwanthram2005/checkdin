import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  BellIcon,
  ChevronDownIcon,
  LogOutIcon,
  MenuIcon,
  MoonIcon,
  SearchIcon,
  SunIcon } from
'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { Avatar } from '../ui/Primitives';
import { Button } from '../ui/Button';
import { cn } from '../../utils/cn';

const alerts = [
{ title: '2 properties awaiting approval', detail: 'Pink City Haveli, Hauz Khas Courtyard', at: '12m ago' },
{ title: '6 payouts pending finance approval', detail: '₹18.4L across 5 partners', at: '48m ago' },
{ title: 'Fraud alert — risk score 92', detail: 'CHK-74118 · 7 bookings in 40 minutes', at: '1h ago' }];


function useClock(): Date {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);
  return now;
}

export function Topbar({ onOpenNav }: {onOpenNav: () => void;}) {
  const { theme, toggleTheme } = useTheme();
  const { user, role, signOut } = useAuth();
  const navigate = useNavigate();
  const now = useClock();
  const [openMenu, setOpenMenu] = useState<'alerts' | 'user' | null>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  function handleSignOut() {
    signOut();
    navigate('/login', { replace: true });
  }

  useEffect(() => {
    function onClick(event: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(event.target as Node)) setOpenMenu(null);
    }
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-line bg-canvas/95 px-4 backdrop-blur sm:px-6">
      <button
        onClick={onOpenNav}
        aria-label="Open navigation"
        className="rounded-lg border border-line p-2 text-muted transition-colors duration-150 ease-smooth hover:bg-faint hover:text-ink lg:hidden">
        
        <MenuIcon className="h-4 w-4" />
      </button>

      <div className="relative hidden max-w-sm flex-1 md:block">
        <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
        <input
          type="search"
          aria-label="Search bookings, properties, partners"
          placeholder="Search bookings, properties, partners…"
          className="h-9.5 w-full rounded-lg border border-line bg-card pl-9 pr-3 text-sm text-ink placeholder:text-muted/70 focus:border-accent" />
        
      </div>

      <div className="ml-auto hidden items-center gap-2 rounded-lg border border-line bg-card px-3 py-1.5 xl:flex">
        <span className="text-[13px] font-semibold text-ink">
          {now.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
        </span>
        <span className="h-3.5 w-px bg-line" />
        <span className="font-mono text-[13px] tabular-nums text-muted">
          {now.toLocaleTimeString('en-IN', { hour12: true })}
        </span>
      </div>

      <div ref={wrapRef} className="ml-auto flex items-center gap-1.5 xl:ml-0">
        <button
          onClick={toggleTheme}
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          className="rounded-lg border border-line bg-card p-2 text-muted transition-colors duration-150 ease-smooth hover:bg-faint hover:text-ink">
          
          {theme === 'dark' ? <SunIcon className="h-4 w-4" /> : <MoonIcon className="h-4 w-4" />}
        </button>

        <div className="relative">
          <button
            onClick={() => setOpenMenu((prev) => prev === 'alerts' ? null : 'alerts')}
            aria-label="Notifications"
            aria-expanded={openMenu === 'alerts'}
            className="relative rounded-lg border border-line bg-card p-2 text-muted transition-colors duration-150 ease-smooth hover:bg-faint hover:text-ink">
            
            <BellIcon className="h-4 w-4" />
            <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-negative px-1 text-[10px] font-bold text-white">
              3
            </span>
          </button>
          <AnimatePresence>
            {openMenu === 'alerts' ?
            <motion.div
              initial={{ opacity: 0, scale: 0.97, y: -4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: -4 }}
              transition={{ duration: 0.15, ease: [0.23, 1, 0.32, 1] }}
              className="absolute right-0 top-11 w-80 overflow-hidden rounded-xl border border-line bg-elevated shadow-pop">
              
                <p className="border-b border-line px-4 py-2.5 text-[13px] font-semibold text-ink">
                  Needs your attention
                </p>
                <ul className="divide-y divide-line">
                  {alerts.map((alert) =>
                <li key={alert.title} className="px-4 py-3">
                      <p className="text-[13px] font-medium text-ink">{alert.title}</p>
                      <p className="mt-0.5 text-xs text-muted">{alert.detail}</p>
                      <p className="mt-1 text-[11px] text-muted">{alert.at}</p>
                    </li>
                )}
                </ul>
              </motion.div> :
            null}
          </AnimatePresence>
        </div>

        <div className="relative">
          <button
            onClick={() => setOpenMenu((prev) => prev === 'user' ? null : 'user')}
            aria-expanded={openMenu === 'user'}
            className={cn(
              'flex items-center gap-2 rounded-lg border border-line bg-card px-2 py-1.5 transition-colors duration-150 ease-smooth hover:bg-faint'
            )}>
            
            <Avatar name={user?.name ?? 'Admin'} size="sm" />
            <span className="hidden text-left sm:block">
              <span className="block text-[13px] font-semibold leading-tight text-ink">{user?.name ?? 'Admin'}</span>
              <span className="block text-[11px] leading-tight" style={{ color: role?.accent }}>
                {user?.roleName ?? 'Signed out'}
              </span>
            </span>
            <ChevronDownIcon className="h-3.5 w-3.5 text-muted" />
          </button>
          <AnimatePresence>
            {openMenu === 'user' ?
            <motion.div
              initial={{ opacity: 0, scale: 0.97, y: -4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: -4 }}
              transition={{ duration: 0.15, ease: [0.23, 1, 0.32, 1] }}
              className="absolute right-0 top-11 w-56 overflow-hidden rounded-xl border border-line bg-elevated py-1 shadow-pop">
              
                <p className="px-3 py-2 text-xs text-muted">{user?.email}</p>
                {['Profile', 'Security & 2FA', 'Notification preferences'].map((item) =>
              <button
                key={item}
                className="block w-full px-3 py-2 text-left text-[13px] font-medium text-ink transition-colors duration-150 ease-smooth hover:bg-faint">
                
                    {item}
                  </button>
              )}
                <div className="my-1 h-px bg-line" />
                <button
                onClick={handleSignOut}
                className="flex w-full items-center gap-2 px-3 py-2 text-left text-[13px] font-medium text-negative transition-colors duration-150 ease-smooth hover:bg-negative/10">
                
                  <LogOutIcon className="h-3.5 w-3.5" /> Logout
                </button>
              </motion.div> :
            null}
          </AnimatePresence>
        </div>

        <Button variant="outline" size="sm" icon={LogOutIcon} className="hidden lg:inline-flex" onClick={handleSignOut}>
          Logout
        </Button>
      </div>
    </header>);

}