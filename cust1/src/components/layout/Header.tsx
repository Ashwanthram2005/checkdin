import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ClockIcon,
  LifeBuoyIcon,
  LogOutIcon,
  MapPinIcon,
  MenuIcon,
  TicketIcon,
  UserIcon,
  XIcon } from
'lucide-react';
import { useBooking } from '../../contexts/BookingContext';
import { initialsOf, useAuth } from '../../contexts/AuthContext';

const links = [
{ label: 'How it works', to: '/#how', external: true },
{ label: 'List your property', to: '/list-your-property', external: false },
{ label: 'Help', to: '/support', external: false }];


export function Header() {
  const { search } = useBooking();
  const { user, openAuth, signOut } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!menuRef.current?.contains(e.target as Node)) setMenuOpen(false);
    }
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-night text-white">
      <div className="mx-auto flex h-16 w-full max-w-[1360px] items-center gap-4 px-5 lg:px-8">
        <Link to="/" className="flex items-center gap-2" aria-label="Checkdin home">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-ink">
            <ClockIcon className="h-4 w-4" aria-hidden="true" />
          </span>
          <span className="font-display text-2xl leading-none">
            Checkd<span className="text-primary">in</span>
          </span>
        </Link>

        <span className="ml-2 hidden items-center gap-1.5 rounded-lg border border-night-line px-3 py-2 text-sm font-medium md:flex">
          <MapPinIcon className="h-4 w-4 text-primary" aria-hidden="true" />
          {search.city}
          <span className="ml-1 rounded bg-night-soft px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-night-muted">
            Only city
          </span>
        </span>

        <nav className="ml-auto hidden items-center gap-8 lg:flex" aria-label="Main">
          {links.map((link) =>
          link.external ?
          <a
            key={link.label}
            href={link.to}
            className="whitespace-nowrap text-sm text-white/80 transition-colors duration-150 ease-smooth hover:text-primary">
            
                {link.label}
              </a> :

          <Link
            key={link.label}
            to={link.to}
            className="whitespace-nowrap text-sm text-white/80 transition-colors duration-150 ease-smooth hover:text-primary">
            
                {link.label}
              </Link>

          )}

          {user ?
          <div ref={menuRef} className="relative">
              <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              aria-expanded={menuOpen}
              className="flex items-center gap-2.5 rounded-full border border-night-line py-1.5 pl-1.5 pr-4 transition-colors duration-150 ease-smooth hover:border-primary">
              
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-ink">
                  {initialsOf(user.name) || 'G'}
                </span>
                <span className="max-w-[120px] truncate text-sm font-semibold">
                  {user.name.split(' ')[0]}
                </span>
              </button>

              {menuOpen &&
            <div className="absolute right-0 top-full mt-2 w-56 overflow-hidden rounded-xl border border-line bg-surface py-1 text-ink shadow-lift">
                  <Link
                to="/profile"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors duration-150 ease-smooth hover:bg-canvas">
                
                    <UserIcon className="h-4 w-4" aria-hidden="true" />
                    My profile
                  </Link>
                  <Link
                to="/bookings"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors duration-150 ease-smooth hover:bg-canvas">
                
                    <TicketIcon className="h-4 w-4" aria-hidden="true" />
                    My bookings
                  </Link>
                  <Link
                to="/support"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors duration-150 ease-smooth hover:bg-canvas">
                
                    <LifeBuoyIcon className="h-4 w-4" aria-hidden="true" />
                    Contact support
                  </Link>
                  <button
                type="button"
                onClick={() => {
                  signOut();
                  setMenuOpen(false);
                  navigate('/');
                }}
                className="flex w-full items-center gap-2.5 border-t border-line px-4 py-2.5 text-sm transition-colors duration-150 ease-smooth hover:bg-canvas">
                
                    <LogOutIcon className="h-4 w-4" aria-hidden="true" />
                    Log out
                  </button>
                </div>
            }
            </div> :

          <>
              <button
              type="button"
              onClick={() => openAuth()}
              className="whitespace-nowrap text-sm text-white/80 transition-colors duration-150 ease-smooth hover:text-primary">
              
                Login
              </button>
              <button
              type="button"
              onClick={() => openAuth()}
              className="whitespace-nowrap rounded-lg bg-primary px-5 py-2.5 text-sm font-bold text-ink transition-colors duration-150 ease-smooth hover:bg-primary-dark">
              
                Sign up
              </button>
            </>
          }
        </nav>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="ml-auto rounded-lg border border-night-line p-2 lg:hidden"
          aria-expanded={open}
          aria-label={open ? 'Close menu' : 'Open menu'}>
          
          {open ?
          <XIcon className="h-5 w-5" aria-hidden="true" /> :

          <MenuIcon className="h-5 w-5" aria-hidden="true" />
          }
        </button>
      </div>

      {open &&
      <div className="border-t border-night-line px-5 py-4 lg:hidden">
          <nav className="flex flex-col gap-4" aria-label="Mobile">
            {links.map((link) =>
          link.external ?
          <a
            key={link.label}
            href={link.to}
            onClick={() => setOpen(false)}
            className="text-sm text-white/80">
            
                  {link.label}
                </a> :

          <Link
            key={link.label}
            to={link.to}
            onClick={() => setOpen(false)}
            className="text-sm text-white/80">
            
                  {link.label}
                </Link>

          )}
            <Link to="/search" onClick={() => setOpen(false)} className="text-sm text-white/80">
              Browse stays
            </Link>
            {user ?
          <>
                <Link
              to="/profile"
              onClick={() => setOpen(false)}
              className="text-sm text-white/80">
              
                  My profile
                </Link>
                <Link
              to="/bookings"
              onClick={() => setOpen(false)}
              className="text-sm text-white/80">
              
                  My bookings
                </Link>
                <button
              type="button"
              onClick={() => {
                signOut();
                setOpen(false);
              }}
              className="rounded-lg border border-night-line px-4 py-2.5 text-sm font-bold">
              
                  Log out
                </button>
              </> :

          <button
            type="button"
            onClick={() => {
              setOpen(false);
              openAuth();
            }}
            className="rounded-lg bg-primary px-4 py-2.5 text-sm font-bold text-ink">
            
                Login / Sign up
              </button>
          }
          </nav>
        </div>
      }
    </header>);

}