import type React from 'react';
import {
  BuildingIcon,
  HeadsetIcon,
  MegaphoneIcon,
  ShieldIcon,
  WalletIcon } from
'lucide-react';

export type RoleId = 'super' | 'operations' | 'finance' | 'support' | 'marketing';

export interface RoleModule {
  label: string;
  to: string;
}

export interface RoleDefinition {
  id: RoleId;
  name: string;
  blurb: string;
  icon: React.ComponentType<{className?: string;}>;
  accent: string;
  accentSoft: string;
  email: string;
  password: string;
  person: string;
  modules: RoleModule[];
  /** Sidebar entries this role can reach, matched on nav label. */
  nav: string[];
}

export const roles: RoleDefinition[] = [
{
  id: 'super',
  name: 'Super Admin',
  blurb: 'Complete platform control',
  icon: ShieldIcon,
  accent: '#7C3AED',
  accentSoft: 'rgba(124, 58, 237, 0.12)',
  email: 'superadmin@checkdin.com',
  password: 'Super@123',
  person: 'Karthik Raman',
  modules: [
  { label: 'User Management', to: '/admin-users' },
  { label: 'Roles & Permissions', to: '/admin-users' },
  { label: 'Platform Settings', to: '/settings' },
  { label: 'Property Approvals', to: '/properties' },
  { label: 'System Analytics', to: '/reports' },
  { label: 'Financial Overview', to: '/revenue' }],

  nav: [
  'Dashboard',
  'Bookings',
  'Properties',
  'Rooms',
  'Pricing Management',
  'Partners',
  'Customers',
  'Revenue',
  'Payouts',
  'Refunds',
  'Reviews',
  'Support',
  'Notifications',
  'Coupons',
  'CMS',
  'Reports',
  'Audit Logs',
  'Fraud Detection',
  'Admin Users',
  'Settings',
  'Department Chat',
  'Direct Messages',
  'Announcements',
  'Support Requests',
  'Activity Feed',
  'Platform Overview',
  'Command Center',
  'Extensions',
  'Hotel Status',
  'Partner Performance',
  'Compliance',
  'Revenue Intelligence',
  'Occupancy Intelligence',
  'Customer Intelligence',
  'City Intelligence',
  'AI Insights',
  'Settlements',
  'Pricing Governance',
  'Promotions Governance',
  'Disputes',
  'Risk & Fraud',
  'Control Center',
  'OS Notifications']

},
{
  id: 'operations',
  name: 'Operations Admin',
  blurb: 'Manage bookings, properties & inventory',
  icon: BuildingIcon,
  accent: '#2563EB',
  accentSoft: 'rgba(37, 99, 235, 0.12)',
  email: 'operations@checkdin.com',
  password: 'Ops@123',
  person: 'Varun Joshi',
  modules: [
  { label: 'Hotel Management', to: '/properties' },
  { label: 'Room Inventory', to: '/rooms' },
  { label: 'Booking Management', to: '/bookings' },
  { label: 'Check-in / Check-out', to: '/bookings' },
  { label: 'Housekeeping', to: '/rooms' },
  { label: 'Vendor Management', to: '/partners' }],

  nav: [
  'Dashboard',
  'Bookings',
  'Properties',
  'Rooms',
  'Pricing Management',
  'Partners',
  'Customers',
  'Reviews',
  'Reports',
  'Department Chat',
  'Direct Messages',
  'Announcements',
  'Support Requests',
  'Activity Feed',
  'Platform Overview',
  'Command Center',
  'Extensions',
  'Hotel Status',
  'Partner Performance',
  'Compliance',
  'Occupancy Intelligence',
  'City Intelligence',
  'AI Insights',
  'Pricing Governance',
  'OS Notifications']

},
{
  id: 'finance',
  name: 'Finance Admin',
  blurb: 'Payments, settlements & reports',
  icon: WalletIcon,
  accent: '#15803D',
  accentSoft: 'rgba(21, 128, 61, 0.12)',
  email: 'finance@checkdin.com',
  password: 'Finance@123',
  person: 'Pooja Nambiar',
  modules: [
  { label: 'Revenue Analytics', to: '/revenue' },
  { label: 'Settlements', to: '/payouts' },
  { label: 'Refund Processing', to: '/refunds' },
  { label: 'Invoices', to: '/reports' },
  { label: 'GST Reports', to: '/reports' },
  { label: 'Commission Tracking', to: '/revenue' }],

  nav: [
  'Dashboard',
  'Revenue',
  'Payouts',
  'Refunds',
  'Reports',
  'Bookings',
  'Partners',
  'Audit Logs',
  'Department Chat',
  'Direct Messages',
  'Announcements',
  'Support Requests',
  'Activity Feed',
  'Platform Overview',
  'Extensions',
  'Revenue Intelligence',
  'City Intelligence',
  'Settlements',
  'Disputes',
  'Risk & Fraud',
  'OS Notifications']

},
{
  id: 'support',
  name: 'Support Admin',
  blurb: 'Customer & partner assistance',
  icon: HeadsetIcon,
  accent: '#EA580C',
  accentSoft: 'rgba(234, 88, 12, 0.12)',
  email: 'support@checkdin.com',
  password: 'Support@123',
  person: 'Ritu Malhotra',
  modules: [
  { label: 'Customer Tickets', to: '/support' },
  { label: 'Partner Support', to: '/support' },
  { label: 'Booking Issues', to: '/bookings' },
  { label: 'Escalations', to: '/support' },
  { label: 'Live Chat Support', to: '/support' }],

  nav: [
  'Dashboard',
  'Support',
  'Bookings',
  'Customers',
  'Reviews',
  'Refunds',
  'Properties',
  'Department Chat',
  'Direct Messages',
  'Announcements',
  'Support Requests',
  'Activity Feed',
  'Platform Overview',
  'Command Center',
  'Extensions',
  'Hotel Status',
  'Customer Intelligence',
  'Disputes',
  'OS Notifications']

},
{
  id: 'marketing',
  name: 'Marketing Admin',
  blurb: 'Campaigns, promotions & growth',
  icon: MegaphoneIcon,
  accent: '#DB2777',
  accentSoft: 'rgba(219, 39, 119, 0.12)',
  email: 'marketing@checkdin.com',
  password: 'Marketing@123',
  person: 'Zoya Qureshi',
  modules: [
  { label: 'Campaign Manager', to: '/notifications' },
  { label: 'Coupon Management', to: '/coupons' },
  { label: 'SEO Tools', to: '/cms' },
  { label: 'Push Notifications', to: '/notifications' },
  { label: 'Email Marketing', to: '/notifications' },
  { label: 'Performance Analytics', to: '/reports' }],

  nav: [
  'Dashboard',
  'Notifications',
  'Coupons',
  'CMS',
  'Reports',
  'Customers',
  'Properties',
  'Department Chat',
  'Direct Messages',
  'Announcements',
  'Support Requests',
  'Activity Feed',
  'Platform Overview',
  'Promotions Governance',
  'Customer Intelligence',
  'City Intelligence',
  'Occupancy Intelligence',
  'AI Insights',
  'OS Notifications']

}];


export function getRole(id: RoleId): RoleDefinition {
  return roles.find((role) => role.id === id) ?? roles[0];
}

export const securityFeatures = [
{ label: 'Role-Based Access Control', detail: 'Every module gated per role' },
{ label: 'Two-Factor Authentication Ready', detail: 'TOTP and SMS second factor' },
{ label: 'Encrypted Sessions', detail: 'AES-256 at rest, TLS 1.3 in transit' },
{ label: 'Activity Logs', detail: 'Immutable audit trail on every action' },
{ label: 'Secure Access Management', detail: 'IP allowlists and session expiry' }];