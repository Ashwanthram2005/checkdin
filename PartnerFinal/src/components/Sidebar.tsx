import React from 'react';
import {
  ActivityIcon,
  BedDoubleIcon,
  BellIcon,
  BrainCircuitIcon,
  CalendarDaysIcon,
  ChartColumnIcon,
  CircleCheckIcon,
  ClockPlusIcon,
  FileTextIcon,
  GaugeIcon,
  HeadsetIcon,
  HistoryIcon,
  IndianRupeeIcon,
  LayoutDashboardIcon,
  LogOutIcon,
  MegaphoneIcon,
  MessageSquareIcon,
  ScrollTextIcon,
  SettingsIcon,
  SparklesIcon,
  StarIcon,
  TagIcon,
  TrendingUpIcon,
  UsersRoundIcon,
  WalletIcon,
  XCircleIcon } from
'lucide-react';
import { useAuth } from '../contexts/AuthContext';

type NavItem = {label: string;icon: typeof LayoutDashboardIcon;};

const pillars: {pillar: string;items: NavItem[];}[] = [
{
  pillar: 'Operations',
  items: [
  { label: 'Command Center', icon: LayoutDashboardIcon },
  { label: 'Bookings', icon: CalendarDaysIcon },
  { label: 'Extensions', icon: ClockPlusIcon },
  { label: 'Guest Messaging', icon: MessageSquareIcon },
  { label: 'Notifications', icon: BellIcon }]

},
{
  pillar: 'Revenue',
  items: [
  { label: 'Revenue', icon: IndianRupeeIcon },
  { label: 'Extension Revenue', icon: TrendingUpIcon },
  { label: 'Forecasting', icon: ChartColumnIcon },
  { label: 'Reports', icon: FileTextIcon }]

},
{
  pillar: 'Growth',
  items: [
  { label: 'Dynamic Pricing', icon: TagIcon },
  { label: 'Promotions', icon: MegaphoneIcon }]

},
{
  pillar: 'Intelligence',
  items: [
  { label: 'Occupancy', icon: GaugeIcon },
  { label: 'Customer Insights', icon: UsersRoundIcon },
  { label: 'Extension Demand', icon: ActivityIcon },
  { label: 'Cancellations', icon: XCircleIcon },
  { label: 'AI Assistant', icon: BrainCircuitIcon },
  { label: 'Performance Score', icon: SparklesIcon }]

},
{
  pillar: 'Control',
  items: [
  { label: 'Availability', icon: CircleCheckIcon },
  { label: 'Property Experience', icon: BedDoubleIcon },
  { label: 'Reviews', icon: StarIcon },
  { label: 'Rules & Policies', icon: ScrollTextIcon }]

},
{
  pillar: 'Finance',
  items: [{ label: 'Payouts', icon: WalletIcon }]
},
{
  pillar: 'Portfolio',
  items: [{ label: 'Properties', icon: BedDoubleIcon }]
}];


const utilityItems: NavItem[] = [
{ label: 'Audit Log', icon: HistoryIcon },
{ label: 'Support', icon: HeadsetIcon },
{ label: 'Settings', icon: SettingsIcon }];


type SidebarProps = {
  active: string;
  onSelect: (label: string) => void;
};

function NavButton({
  item,
  active,
  onSelect




}: {item: NavItem;active: string;onSelect: (label: string) => void;}) {
  const isActive = item.label === active;
  const Icon = item.icon;

  return (
    <li>
      <button
        type="button"
        onClick={() => onSelect(item.label)}
        aria-current={isActive ? 'page' : undefined}
        className={[
        'flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-[13.5px] transition-colors duration-150 ease-out',
        isActive ?
        'bg-lime-400 font-semibold text-ink' :
        'font-medium text-white/70 hover:bg-white/[0.07] hover:text-white'].
        join(' ')}>
        
        <Icon size={16} strokeWidth={1.9} aria-hidden="true" />
        {item.label}
      </button>
    </li>);

}

export function Sidebar({ active, onSelect }: SidebarProps) {
  const { logout } = useAuth();

  return (
    <aside className="flex h-full w-[236px] shrink-0 flex-col bg-ink text-white">
      <nav aria-label="Main" className="scroll-slim flex-1 overflow-y-auto px-3 py-4">
        {pillars.map((group) =>
        <div key={group.pillar} className="mb-4">
            <p className="px-3 pb-1.5 text-[10px] font-bold tracking-[0.16em] text-white/35">
              {group.pillar.toUpperCase()}
            </p>
            <ul className="space-y-0.5">
              {group.items.map((item) =>
            <NavButton key={item.label} item={item} active={active} onSelect={onSelect} />
            )}
            </ul>
          </div>
        )}

        <div className="mt-2 border-t border-white/10 pt-3">
          <ul className="space-y-0.5">
            {utilityItems.map((item) =>
            <NavButton key={item.label} item={item} active={active} onSelect={onSelect} />
            )}
          </ul>
        </div>
      </nav>

      <div className="border-t border-white/10 px-3 py-3">
        <button
          type="button"
          onClick={() => logout()}
          className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-[13.5px] font-medium text-white/70 transition-colors duration-150 ease-out hover:bg-white/[0.07] hover:text-white">
          
          <LogOutIcon size={16} strokeWidth={1.9} aria-hidden="true" />
          Logout
        </button>
      </div>
    </aside>);

}