import React, { useState } from 'react';
import { CheckCircle2Icon } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { GstRulesCard } from '../components/pricing/GstRulesCard';
import { SlotPricingCard } from '../components/pricing/SlotPricingCard';
import { SettingsCard } from '../components/settings/SettingsCard';
import { Field, TextInput } from '../components/settings/FormField';
import { PermissionNotice } from '../components/AccessControls';
import { useAuth } from '../contexts/AuthContext';
import { slotPricing, type DurationKey, type SlotPricing } from '../data/pricing';
import { inr, priceWithGst } from '../utils/gst';

export function Pricing() {
  const { can, addAudit } = useAuth();
  const canManage = can('manage_pricing');
  const [pricing, setPricing] = useState<SlotPricing>(slotPricing);
  const [saved, setSaved] = useState(false);

  const patch = (changes: Partial<SlotPricing>) => {
    setSaved(false);
    setPricing((prev) => ({ ...prev, ...changes }));
  };

  return (
    <main className="scroll-slim h-full flex-1 overflow-y-auto bg-canvas px-7 py-6">
      <PageHeader
        title="Pricing"
        subtitle="Set one price per slot length without GST — the correct slab is applied for you." />
      

      <div className="mt-6 space-y-5 pb-28">
        <GstRulesCard />

        <SlotPricingCard
          pricing={pricing}
          onPriceChange={(duration, value) =>
          patch({ basePrices: { ...pricing.basePrices, [duration]: value } })
          }
          onToggleSlot={(duration, active) =>
          patch({ active: { ...pricing.active, [duration]: active } })
          } />
        

        <SettingsCard
          title="Adjustments"
          description="Applied on top of the slot price before GST is calculated.">
          
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Field
              id="extraHour"
              label="Extra hour charge"
              hint="Charged when a guest overstays their slot.">
              
              <TextInput
                id="extraHour"
                type="number"
                min={0}
                step={25}
                value={pricing.extraHour}
                onChange={(e) => patch({ extraHour: Number(e.target.value) || 0 })} />
              
            </Field>
            <Field
              id="weekend"
              label="Weekend surcharge (%)"
              hint="Applied on Friday, Saturday and Sunday.">
              
              <TextInput
                id="weekend"
                type="number"
                min={0}
                max={50}
                step={1}
                value={pricing.weekendSurcharge}
                onChange={(e) => patch({ weekendSurcharge: Number(e.target.value) || 0 })} />
              
            </Field>
            <div className="rounded-xl bg-neutral-50 px-4 py-3">
              <p className="text-[12px] text-ink-muted">Weekend guest price, 6 hour slot</p>
              <p className="mt-1 text-[19px] font-bold tracking-tight text-ink">
                {inr(
                  priceWithGst(
                    Math.round(pricing.basePrices['6h'] * (1 + pricing.weekendSurcharge / 100))
                  )
                )}
              </p>
              <p className="mt-1 text-[11.5px] text-ink-muted">
                Base {inr(pricing.basePrices['6h'])} + {pricing.weekendSurcharge}% + GST
              </p>
            </div>
          </div>
        </SettingsCard>
      </div>

      <div className="sticky bottom-0 -mx-7 border-t border-neutral-200 bg-white/95 px-7 py-3.5 backdrop-blur">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-[13px] text-ink-muted">
            Prices apply to every Checkdin booking at this property. GST is calculated per stay.
          </p>
          <div className="flex items-center gap-3">
            {saved &&
            <p role="status" className="flex items-center gap-1.5 text-[13px] font-medium text-forest">
                <CheckCircle2Icon size={15} aria-hidden="true" />
                Pricing published
              </p>
            }
            <button
              type="button"
              onClick={() => {
                setPricing(slotPricing);
                setSaved(false);
              }}
              className="rounded-xl border border-neutral-200 px-4 py-2.5 text-[13.5px] font-medium text-ink-soft transition-colors duration-150 ease-out hover:border-neutral-300">
              
              Discard
            </button>
            {canManage ?
            <button
              type="button"
              onClick={() => {
                setSaved(true);
                addAudit({
                  action: 'Updated pricing',
                  detail: `3h ${pricing.basePrices['3h']} • 6h ${pricing.basePrices['6h']} • 12h ${pricing.basePrices['12h']}`,
                  category: 'Management'
                });
              }}
              className="rounded-xl bg-lime-300 px-5 py-2.5 text-[13.5px] font-semibold text-ink transition-colors duration-150 ease-out hover:bg-lime-200">
              
                Save Changes
              </button> :

            <PermissionNotice label="Manage pricing permission required" />
            }
          </div>
        </div>
      </div>
    </main>);

}