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
  WalletIcon,
  BanknoteIcon,
  BellRingIcon,
  FileCheckIcon,
  GavelIcon,
  LayersIcon,
  MapIcon,
  PercentIcon,
  PlugZapIcon,
  RadarIcon,
  RadioTowerIcon,
  SlidersHorizontalIcon,
  SlidersVerticalIcon,
  SparklesIcon,
  TimerIcon,
  TrendingUpIcon,
  TrophyIcon,
  UserSearchIcon } from
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
  label: 'Marketplace OS',
  items: [
  { label: 'Platform Overview', to: '/os', icon: RadarIcon },
  { label: 'Command Center', to: '/os/command-center', icon: RadioTowerIcon },
  { label: 'OS Notifications', to: '/os/notifications', icon: BellRingIcon },
  { label: 'Extensions', to: '/os/extensions', icon: TimerIcon, badge: 6 },
  { label: 'Hotel Status', to: '/os/hotel-status', icon: PlugZapIcon, badge: 3 },
  { label: 'Partner Performance', to: '/os/partner-performance', icon: TrophyIcon },
  { label: 'Compliance', to: '/os/compliance', icon: FileCheckIcon, badge: 4 }]

},
{
  label: 'Intelligence',
  items: [
  { label: 'Revenue Intelligence', to: '/os/revenue-intelligence', icon: TrendingUpIcon },
  { label: 'Occupancy Intelligence', to: '/os/occupancy', icon: LayersIcon },
  { label: 'Customer Intelligence', to: '/os/customer-intelligence', icon: UserSearchIcon },
  { label: 'City Intelligence', to: '/os/city-intelligence', icon: MapIcon },
  { label: 'AI Insights', to: '/os/ai-insights', icon: SparklesIcon, badge: 6 }]

},
{
  label: 'Platform Governance',
  items: [
  { label: 'Settlements', to: '/os/settlements', icon: BanknoteIcon, badge: 5 },
  { label: 'Pricing Governance', to: '/os/pricing-governance', icon: SlidersHorizontalIcon },
  { label: 'Promotions Governance', to: '/os/promotions', icon: PercentIcon },
  { label: 'Disputes', to: '/os/disputes', icon: GavelIcon, badge: 7 },
  { label: 'Risk & Fraud', to: '/os/risk', icon: ShieldAlertIcon, badge: 4 },
  { label: 'Control Center', to: '/os/control-center', icon: SlidersVerticalIcon }]

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