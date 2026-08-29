import React, { useState } from 'react';
import { MegaphoneIcon, PlusIcon } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { ReportStat } from '../components/reports/ReportStat';
import { SettingsCard } from '../components/settings/SettingsCard';
import { Field, Select, TextInput } from '../components/settings/FormField';
import { PermissionNotice } from '../components/AccessControls';
import { useAuth } from '../contexts/AuthContext';
import { promotions as seed, type Promotion, type PromotionStatus } from '../data/growth';
import { inr } from '../utils/gst';

const statusChip: Record<PromotionStatus, string> = {
  Live: 'bg-lime-100 text-lime-700',
  Scheduled: 'bg-blue-50 text-blue-700',
  Ended: 'bg-neutral-100 text-ink-muted'
};

const types: Promotion['type'][] = ['Happy Hour', 'Last Minute', 'Low Occupancy', 'Festival'];

export function Promotions() {
  const { can, addAudit } = useAuth();
  const canManage = can('manage_pricing');
  const [items, setItems] = useState<Promotion[]>(seed);
  const [creating, setCreating] = useState(false);
  const [draft, setDraft] = useState({
    name: '',
    type: types[0] as Promotion['type'],
    window: '',
    discount: 10,
    slots: 'All slots'
  });

  const live = items.filter((item) => item.status === 'Live');
  const revenue = items.reduce((sum, item) => sum + item.revenue, 0);

  return (
    <main className="scroll-slim h-full flex-1 overflow-y-auto bg-canvas px-7 py-6">
      <PageHeader
        title="Promotions"
        subtitle="Campaigns that fill quiet slots — and what each one actually returned."
        action={
        canManage ?
        <button
          type="button"
          onClick={() => setCreating((prev) => !prev)}
          className="flex items-center gap-1.5 rounded-xl bg-lime-300 px-4 py-2.5 text-[13.5px] font-semibold text-ink transition-colors duration-150 ease-out hover:bg-lime-200">
          
              <PlusIcon size={16} aria-hidden="true" />
              Create campaign
            </button> :

        <PermissionNotice label="Manage pricing permission required" />

        } />
      

      <div className="mt-6 space-y-5 pb-8">
        <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <ReportStat
            label="Live campaigns"
            value={String(live.length)}
            note="Running right now"
            emphasis />
          
          <ReportStat label="Campaign revenue" value={inr(revenue)} note="All campaigns to date" />
          <ReportStat
            label="Best conversion"
            value={`${Math.max(...items.map((item) => item.conversion))}%`}
            note="Same-day Last Minute" />
          
          <ReportStat
            label="Occupancy lift"
            value={`+${Math.max(...items.map((item) => item.occupancyLift))}%`}
            note="Best performing campaign" />
          
        </section>

        {creating &&
        <SettingsCard title="New campaign" description="Set the window, discount and slot scope.">
            <form
            onSubmit={(event) => {
              event.preventDefault();
              const promotion: Promotion = {
                id: `p${Date.now()}`,
                name: draft.name,
                type: draft.type,
                window: draft.window,
                discount: draft.discount,
                slots: draft.slots,
                status: 'Scheduled',
                revenue: 0,
                conversion: 0,
                occupancyLift: 0
              };
              setItems((prev) => [promotion, ...prev]);
              setCreating(false);
              setDraft({ name: '', type: types[0], window: '', discount: 10, slots: 'All slots' });
              addAudit({
                action: 'Created promotion',
                detail: `${promotion.name} • ${promotion.discount}% • ${promotion.window}`,
                category: 'Management'
              });
            }}
            className="grid grid-cols-1 gap-4 md:grid-cols-2">
            
              <Field id="promoName" label="Campaign name">
                <TextInput
                id="promoName"
                value={draft.name}
                onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                placeholder="e.g. Monsoon Midweek"
                required />
              
              </Field>
              <Field id="promoType" label="Campaign type">
                <Select
                id="promoType"
                value={draft.type}
                onChange={(e) => setDraft({ ...draft, type: e.target.value as Promotion['type'] })}>
                
                  {types.map((type) =>
                <option key={type}>{type}</option>
                )}
                </Select>
              </Field>
              <Field id="promoWindow" label="When it runs">
                <TextInput
                id="promoWindow"
                value={draft.window}
                onChange={(e) => setDraft({ ...draft, window: e.target.value })}
                placeholder="e.g. Mon–Thu, 11 AM – 3 PM"
                required />
              
              </Field>
              <Field id="promoDiscount" label="Discount (%)">
                <TextInput
                id="promoDiscount"
                type="number"
                min={5}
                max={50}
                value={draft.discount}
                onChange={(e) => setDraft({ ...draft, discount: Number(e.target.value) || 0 })} />
              
              </Field>
              <Field id="promoSlots" label="Applies to" className="md:col-span-2">
                <Select
                id="promoSlots"
                value={draft.slots}
                onChange={(e) => setDraft({ ...draft, slots: e.target.value })}>
                
                  <option>All slots</option>
                  <option>3 Hours</option>
                  <option>6 Hours</option>
                  <option>12 Hours</option>
                  <option>3 &amp; 6 Hours</option>
                </Select>
              </Field>

              <div className="flex gap-2 md:col-span-2">
                <button
                type="submit"
                className="rounded-xl bg-lime-300 px-5 py-2.5 text-[13.5px] font-semibold text-ink transition-colors duration-150 ease-out hover:bg-lime-200">
                
                  Schedule campaign
                </button>
                <button
                type="button"
                onClick={() => setCreating(false)}
                className="rounded-xl border border-neutral-200 px-4 py-2.5 text-[13.5px] font-medium text-ink transition-colors duration-150 ease-out hover:border-neutral-300">
                
                  Cancel
                </button>
              </div>
            </form>
          </SettingsCard>
        }

        <ul className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {items.map((promotion) =>
          <li
            key={promotion.id}
            className="rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-card">
            
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="flex items-center gap-2 text-[15px] font-semibold text-ink">
                    <MegaphoneIcon size={15} className="text-lime-600" aria-hidden="true" />
                    {promotion.name}
                  </p>
                  <p className="mt-0.5 text-[12.5px] text-ink-muted">
                    {promotion.type} • {promotion.window} • {promotion.slots}
                  </p>
                </div>
                <span
                className={`rounded-md px-2.5 py-1 text-[11px] font-semibold ${statusChip[promotion.status]}`}>
                
                  {promotion.status}
                </span>
              </div>

              <p className="mt-4 text-[26px] font-bold leading-none tracking-tight text-ink">
                {promotion.discount}%<span className="ml-1.5 text-[13px] font-medium text-ink-muted">off</span>
              </p>

              <dl className="mt-4 grid grid-cols-3 gap-3 border-t border-neutral-100 pt-4">
                <div>
                  <dt className="text-[11.5px] text-ink-muted">Revenue</dt>
                  <dd className="mt-0.5 text-[14px] font-semibold text-ink">
                    {promotion.revenue > 0 ? inr(promotion.revenue) : '—'}
                  </dd>
                </div>
                <div>
                  <dt className="text-[11.5px] text-ink-muted">Conversion</dt>
                  <dd className="mt-0.5 text-[14px] font-semibold text-ink">
                    {promotion.conversion > 0 ? `${promotion.conversion}%` : '—'}
                  </dd>
                </div>
                <div>
                  <dt className="text-[11.5px] text-ink-muted">Occupancy lift</dt>
                  <dd className="mt-0.5 text-[14px] font-semibold text-forest">
                    {promotion.occupancyLift > 0 ? `+${promotion.occupancyLift}%` : '—'}
                  </dd>
                </div>
              </dl>

              {canManage && promotion.status !== 'Ended' &&
            <button
              type="button"
              onClick={() =>
              setItems((prev) =>
              prev.map((item) =>
              item.id === promotion.id ?
              { ...item, status: item.status === 'Live' ? 'Scheduled' : 'Live' } :
              item
              )
              )
              }
              className="mt-4 w-full rounded-xl border border-neutral-200 py-2 text-[13px] font-medium text-ink transition-colors duration-150 ease-out hover:border-neutral-300">
              
                  {promotion.status === 'Live' ? 'Pause campaign' : 'Start campaign'}
                </button>
            }
            </li>
          )}
        </ul>
      </div>
    </main>);

}