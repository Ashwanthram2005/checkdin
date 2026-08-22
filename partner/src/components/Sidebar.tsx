import React from 'react';
import {
  LayoutDashboardIcon,
  CalendarDaysIcon,
  BedDoubleIcon,
  TagIcon,
  CircleCheckIcon,
  StarIcon,
  IndianRupeeIcon,
  WalletIcon,
  FileTextIcon,
  HistoryIcon,
  HeadsetIcon,
  ScrollTextIcon,
  SettingsIcon,
  LogOutIcon,
  CrownIcon } from
'lucide-react';
import { HOTEL_THUMB } from '../data/dashboard';

const navItems = [
{ label: 'Dashboard', icon: LayoutDashboardIcon },
{ label: 'Bookings', icon: CalendarDaysIcon },
{ label: 'Rooms', icon: BedDoubleIcon },
{ label: 'Pricing', icon: TagIcon },
{ label: 'Availability', icon: CircleCheckIcon },
{ label: 'Reviews', icon: StarIcon },
{ label: 'Revenue', icon: IndianRupeeIcon },
{ label: 'Payouts', icon: WalletIcon },
{ label: 'Reports', icon: FileTextIcon },
{ label: 'Audit Log', icon: HistoryIcon },
{ label: 'Rules & Policies', icon: ScrollTextIcon },
{ label: 'Support', icon: HeadsetIcon },
{ label: 'Settings', icon: SettingsIcon }];


type SidebarProps = {
  active: string;
  onSelect: (label: string) => void;
};

export function Sidebar({ active, onSelect }: SidebarProps) {
  return (
    <aside className="flex h-full w-[244px] shrink-0 flex-col bg-ink text-white">
      <div className="px-6 pb-5 pt-5">
        <p className="text-[10px] font-semibold tracking-[0.24em] text-white/40">PROPERTY</p>
        <p className="mt-1.5 text-[15px] font-semibold leading-tight">Hotel Empire Stay</p>
        <p className="mt-0.5 font-mono text-[11px] text-white/45">CHK-EMPIRE-017</p>
      </div>

      <nav aria-label="Main" className="scroll-slim flex-1 overflow-y-auto px-3">
        <ul className="space-y-0.5">
          {navItems.map(({ label, icon: Icon }) => {
            const isActive = label === active;
            return (
              <li key={label}>
                <button
                  type="button"
                  onClick={() => onSelect(label)}
                  aria-current={isActive ? 'page' : undefined}
                  className={[
                  'flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-[14px] transition-colors duration-150 ease-out',
                  isActive ?
                  'bg-lime-400 font-semibold text-ink' :
                  'font-medium text-white/70 hover:bg-white/[0.07] hover:text-white'].
                  join(' ')}>
                  
                  <Icon size={18} strokeWidth={1.9} aria-hidden="true" />
                  {label}
                </button>
              </li>);

          })}
        </ul>
      </nav>

      <div className="px-4 pb-2 pt-4">
        <div className="rounded-2xl bg-white/[0.06] p-3">
          <div className="flex items-center gap-3">
            <img
              src={HOTEL_THUMB}
              alt=""
              className="h-10 w-10 shrink-0 rounded-lg object-cover" />
            
            <div className="min-w-0">
              <p className="truncate text-[13px] font-semibold">Hotel Empire Stay</p>
              <p className="truncate text-[11px] text-white/50">Chennai, Tamil Nadu</p>
            </div>
          </div>
          <p className="mt-3 flex items-center gap-1.5 text-[11px] font-semibold text-lime-400">
            <CrownIcon size={13} aria-hidden="true" />
            Premium Partner
          </p>
        </div>
      </div>

      <div className="border-t border-white/10 px-4 py-4">
        <button
          type="button"
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[14px] font-medium text-white/70 transition-colors duration-150 ease-out hover:bg-white/[0.07] hover:text-white">
          
          <LogOutIcon size={18} strokeWidth={1.9} aria-hidden="true" />
          Logout
        </button>
      </div>
    </aside>);

}