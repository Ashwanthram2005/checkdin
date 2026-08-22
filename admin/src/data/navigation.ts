import type React from 'react';
import {
  ActivityIcon,
  BadgePercentIcon,
  BedDoubleIcon,
  BellIcon,
  InboxIcon,
  MegaphoneIcon,
  MessageCircleIcon,
  MessagesSquareIcon,
  BuildingIcon,
  CalendarCheckIcon,
  FileTextIcon,
  GaugeIcon,
  HandshakeIcon,
  IndianRupeeIcon,
  LayoutDashboardIcon,
  LifeBuoyIcon,
  ScrollTextIcon,
  SettingsIcon,
  ShieldAlertIcon,
  StarIcon,
  TagIcon,
  UndoIcon,
  UsersIcon,
  UserCogIcon,
  WalletIcon } from
'lucide-react';

export interface NavItem {
  label: string;
  to: string;
  icon: React.ComponentType<{className?: string;}>;
  badge?: number;
}

export interface NavGroup {
  label: string;
  items: NavItem[];
}

/** Filters the full sidebar down to the modules a role is allowed to reach. */
export function getNavigationForRole(allowed: string[]): NavGroup[] {
  return navigation.
  map((group) => ({ ...group, items: group.items.filter((item) => allowed.includes(item.label)) })).
  filter((group) => group.items.length > 0);
}

export const navigation: NavGroup[] = [
{
  label: 'Overview',
  items: [{ label: 'Dashboard', to: '/', icon: LayoutDashboardIcon }]
},
{
  label: 'Operations',
  items: [
  { label: 'Bookings', to: '/bookings', icon: CalendarCheckIcon, badge: 9 },
  { label: 'Properties', to: '/properties', icon: BuildingIcon, badge: 2 },
  { label: 'Rooms', to: '/rooms', icon: BedDoubleIcon },
  { label: 'Pricing Management', to: '/pricing', icon: GaugeIcon },
  { label: 'Partners', to: '/partners', icon: HandshakeIcon, badge: 2 },
  { label: 'Customers', to: '/customers', icon: UsersIcon }]

},
{
  label: 'Finance',
  items: [
  { label: 'Revenue', to: '/revenue', icon: IndianRupeeIcon },
  { label: 'Payouts', to: '/payouts', icon: WalletIcon, badge: 6 },
  { label: 'Refunds', to: '/refunds', icon: UndoIcon, badge: 6 }]

},
{
  label: 'Engagement',
  items: [
  { label: 'Reviews', to: '/reviews', icon: StarIcon, badge: 1 },
  { label: 'Support', to: '/support', icon: LifeBuoyIcon, badge: 4 },
  { label: 'Coupons', to: '/coupons', icon: TagIcon },
  { label: 'CMS', to: '/cms', icon: BadgePercentIcon }]

},
{
  label: 'Communications',
  items: [
  { label: 'Department Chat', to: '/comms/channels', icon: MessagesSquareIcon, badge: 12 },
  { label: 'Direct Messages', to: '/comms/dms', icon: MessageCircleIcon, badge: 3 },
  { label: 'Announcements', to: '/comms/announcements', icon: MegaphoneIcon },
  { label: 'Support Requests', to: '/comms/requests', icon: InboxIcon, badge: 4 },
  { label: 'Notifications', to: '/notifications', icon: BellIcon },
  { label: 'Activity Feed', to: '/comms/activity', icon: ActivityIcon }]

},
{
  label: 'Governance',
  items: [
  { label: 'Reports', to: '/reports', icon: FileTextIcon },
  { label: 'Audit Logs', to: '/audit-logs', icon: ScrollTextIcon },
  { label: 'Fraud Detection', to: '/fraud', icon: ShieldAlertIcon, badge: 2 },
  { label: 'Admin Users', to: '/admin-users', icon: UserCogIcon },
  { label: 'Settings', to: '/settings', icon: SettingsIcon }]

}];