import React, { useMemo, useState } from 'react';
import {
  BuildingIcon,
  CheckCircle2Icon,
  CreditCardIcon,
  FileCheck2Icon,
  LockIcon,
  SearchIcon,
  SettingsIcon,
  UsersIcon } from
'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { OwnerOnly } from '../components/AccessControls';
import { GeneralSettings } from '../components/settings/GeneralSettings';
import { PropertyProfile } from '../components/settings/PropertyProfile';
import { StaffPermissions } from '../components/settings/StaffPermissions';
import { RolesPermissions } from '../components/settings/RolesPermissions';
import { PaymentsBanking } from '../components/settings/PaymentsBanking';
import { DocumentsVerification } from '../components/settings/DocumentsVerification';
import { SecuritySettings } from '../components/settings/SecuritySettings';
import { useAuth } from '../contexts/AuthContext';

const tabs = [
{
  id: 'general',
  label: 'General',
  icon: SettingsIcon,
  keywords: ['property name', 'logo', 'timezone', 'language', 'currency', 'booking behaviour']
},
{
  id: 'profile',
  label: 'Property Profile',
  icon: BuildingIcon,
  keywords: [
  'description',
  'address',
  'google maps',
  'contact number',
  'email',
  'amenities',
  'photos']

},
{
  id: 'staff',
  label: 'Staff Management',
  icon: UsersIcon,
  keywords: [
  'add staff',
  'manager',
  'receptionist',
  'housekeeping',
  'roles & permissions',
  'custom roles',
  'access matrix']

},
{
  id: 'payments',
  label: 'Payments & Banking',
  icon: CreditCardIcon,
  keywords: ['account holder', 'bank name', 'account number', 'ifsc', 'upi', 'gst', 'payout']
},
{
  id: 'documents',
  label: 'Documents & Verification',
  icon: FileCheck2Icon,
  keywords: ['gst certificate', 'pan card', 'trade license', 'registration', 'verification']
},
{
  id: 'security',
  label: 'Security',
  icon: LockIcon,
  keywords: ['password', 'two-factor', 'sessions', 'login history', 'devices', 'logout']
}];


export function Settings() {
  const { addAudit } = useAuth();
  const [active, setActive] = useState('general');
  const [query, setQuery] = useState('');
  const [saved, setSaved] = useState(false);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return tabs.
    map((tab) => ({
      tab,
      matches: tab.keywords.filter((keyword) => keyword.includes(q))
    })).
    filter(({ tab, matches }) => matches.length > 0 || tab.label.toLowerCase().includes(q));
  }, [query]);

  const panels: Record<string, React.ReactNode> = {
    general: <GeneralSettings />,
    profile: <PropertyProfile />,
    staff:
    <div className="space-y-5">
        <StaffPermissions />
        <RolesPermissions />
      </div>,

    payments:
    <OwnerOnly
      title="Payments & banking are owner-controlled"
      description="Owner Permission Required — bank details, GST information and payout preferences can only be changed by the property owner.">
      
        <PaymentsBanking />
      </OwnerOnly>,

    documents: <DocumentsVerification />,
    security:
    <OwnerOnly
      title="Security settings are owner-controlled"
      description="Owner Permission Required — passwords, two-factor authentication and device access are managed by the property owner.">
      
        <SecuritySettings />
      </OwnerOnly>

  };

  const activeTab = tabs.find((tab) => tab.id === active)!;

  return (
    <main className="scroll-slim h-full flex-1 overflow-y-auto bg-canvas px-7 py-6">
      <PageHeader
        title="Settings"
        subtitle="Manage your property, team, payments and account security."
        action={
        <div className="relative">
            <SearchIcon
            size={16}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-muted"
            aria-hidden="true" />
          
            <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search settings"
            aria-label="Search settings"
            className="w-[260px] rounded-xl border border-neutral-200 bg-white py-2.5 pl-10 pr-3.5 text-[14px] text-ink shadow-card outline-none transition-colors duration-150 ease-out placeholder:text-neutral-400 hover:border-neutral-300 focus:border-lime-500" />
          
            {results.length > 0 &&
          <ul className="absolute right-0 top-full z-20 mt-2 w-[320px] overflow-hidden rounded-xl border border-neutral-200 bg-white py-1 shadow-lg">
                {results.map(({ tab, matches }) =>
            <li key={tab.id}>
                    <button
                type="button"
                onClick={() => {
                  setActive(tab.id);
                  setQuery('');
                }}
                className="flex w-full items-start gap-3 px-4 py-2.5 text-left transition-colors duration-150 ease-out hover:bg-neutral-50">
                
                      <tab.icon size={16} className="mt-0.5 text-ink-muted" aria-hidden="true" />
                      <span className="min-w-0">
                        <span className="block text-[13px] font-medium text-ink">{tab.label}</span>
                        {matches.length > 0 &&
                  <span className="block truncate text-[12px] text-ink-muted">
                            {matches.join(' · ')}
                          </span>
                  }
                      </span>
                    </button>
                  </li>
            )}
              </ul>
          }
          </div>
        } />
      

      <nav aria-label="Settings sections" className="mt-6 border-b border-neutral-200">
        <ul className="flex flex-wrap gap-1">
          {tabs.map((tab) => {
            const isActive = tab.id === active;
            return (
              <li key={tab.id}>
                <button
                  type="button"
                  aria-current={isActive ? 'page' : undefined}
                  onClick={() => setActive(tab.id)}
                  className={[
                  'flex items-center gap-2 border-b-2 px-4 py-3 text-[13.5px] transition-colors duration-150 ease-out',
                  isActive ?
                  'border-ink font-semibold text-ink' :
                  'border-transparent font-medium text-ink-muted hover:text-ink'].
                  join(' ')}>
                  
                  <tab.icon size={16} aria-hidden="true" />
                  {tab.label}
                </button>
              </li>);

          })}
        </ul>
      </nav>

      <div className="mt-6 pb-28">{panels[active]}</div>

      <div className="sticky bottom-0 -mx-7 border-t border-neutral-200 bg-white/95 px-7 py-3.5 backdrop-blur">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-[13px] text-ink-muted">
            Editing <span className="font-medium text-ink">{activeTab.label}</span> — changes apply
            to Hotel Empire Stay.
          </p>
          <div className="flex items-center gap-3">
            {saved &&
            <p
              role="status"
              className="flex items-center gap-1.5 text-[13px] font-medium text-forest">
              
                <CheckCircle2Icon size={15} aria-hidden="true" />
                All changes saved
              </p>
            }
            <button
              type="button"
              onClick={() => setSaved(false)}
              className="rounded-xl border border-neutral-200 px-4 py-2.5 text-[13.5px] font-medium text-ink-soft transition-colors duration-150 ease-out hover:border-neutral-300">
              
              Discard
            </button>
            <button
              type="button"
              onClick={() => {
                setSaved(true);
                addAudit({
                  action: 'Updated settings',
                  detail: activeTab.label,
                  category: 'Management'
                });
              }}
              className="rounded-xl bg-lime-300 px-5 py-2.5 text-[13.5px] font-semibold text-ink transition-colors duration-150 ease-out hover:bg-lime-200">
              
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </main>);

}