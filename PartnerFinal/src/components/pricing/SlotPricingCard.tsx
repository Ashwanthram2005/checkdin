import React from 'react';
import { Switch } from '../settings/Toggle';
import { durationKeys, durationLabels, type DurationKey, type SlotPricing } from '../../data/pricing';
import { gstAmount, gstSlabFor, inr, priceWithGst } from '../../utils/gst';

type SlotPricingCardProps = {
  pricing: SlotPricing;
  onPriceChange: (duration: DurationKey, value: number) => void;
  onToggleSlot: (duration: DurationKey, active: boolean) => void;
};

export function SlotPricingCard({ pricing, onPriceChange, onToggleSlot }: SlotPricingCardProps) {
  return (
    <section className="rounded-2xl border border-neutral-200/80 bg-white shadow-card">
      <div className="border-b border-neutral-100 px-5 py-4">
        <h2 className="text-[15px] font-semibold text-ink">Slot pricing</h2>
        <p className="mt-0.5 text-[12.5px] text-ink-muted">
          One price per slot length, applied to every room you allocate to Checkdin.
        </p>
      </div>

      <div className="grid grid-cols-1 divide-y divide-neutral-100 md:grid-cols-3 md:divide-x md:divide-y-0">
        {durationKeys.map((duration) => {
          const base = pricing.basePrices[duration];
          const slab = gstSlabFor(base);
          const tax = gstAmount(base);
          const total = priceWithGst(base);
          const isActive = pricing.active[duration];
          const inputId = `slot-${duration}`;

          return (
            <div key={duration} className="p-5">
              <div className="flex items-center justify-between gap-3">
                <label htmlFor={inputId} className="text-[14px] font-semibold text-ink">
                  {durationLabels[duration]}
                </label>
                <Switch
                  checked={isActive}
                  onChange={(value) => onToggleSlot(duration, value)}
                  label={`${durationLabels[duration]} slot bookable`}
                  size="sm" />
                
              </div>

              <span
                className={[
                'mt-2 inline-flex rounded-md px-2 py-0.5 text-[11px] font-semibold',
                slab.rate === 0 ?
                'bg-lime-100 text-lime-600' :
                slab.rate === 0.05 ?
                'bg-blue-50 text-blue-700' :
                'bg-amber-50 text-amber-700'].
                join(' ')}>
                
                {slab.label}
              </span>

              <div className="relative mt-3">
                <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[14px] text-ink-muted">
                  ₹
                </span>
                <input
                  id={inputId}
                  type="number"
                  min={0}
                  step={50}
                  value={base}
                  disabled={!isActive}
                  onChange={(e) => onPriceChange(duration, Number(e.target.value) || 0)}
                  aria-describedby={`${inputId}-breakdown`}
                  className="w-full rounded-xl border border-neutral-200 bg-white py-2.5 pl-8 pr-3.5 text-[16px] font-semibold text-ink outline-none transition-colors duration-150 ease-out hover:border-neutral-300 focus:border-lime-500 disabled:bg-neutral-50 disabled:text-ink-muted" />
                
              </div>
              <p className="mt-1.5 text-[11.5px] text-ink-muted">Base price, excluding GST</p>

              <dl
                id={`${inputId}-breakdown`}
                className="mt-3 space-y-1.5 rounded-xl bg-neutral-50 px-3.5 py-3">
                
                <div className="flex items-center justify-between text-[12.5px]">
                  <dt className="text-ink-muted">Base</dt>
                  <dd className="font-medium text-ink">{inr(base)}</dd>
                </div>
                <div className="flex items-center justify-between text-[12.5px]">
                  <dt className="text-ink-muted">GST ({Math.round(slab.rate * 100)}%)</dt>
                  <dd className="font-medium text-ink">{tax === 0 ? '—' : inr(tax)}</dd>
                </div>
                <div className="flex items-center justify-between border-t border-neutral-200 pt-1.5 text-[13px]">
                  <dt className="font-medium text-ink">Guest pays</dt>
                  <dd className="font-bold text-ink">{inr(total)}</dd>
                </div>
              </dl>
            </div>);

        })}
      </div>
    </section>);

}