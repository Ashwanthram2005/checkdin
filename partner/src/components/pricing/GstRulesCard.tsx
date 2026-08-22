import React from 'react';
import { InfoIcon } from 'lucide-react';

const slabs = [
{ range: 'Up to ₹1,000', rate: 'Exempt — 0%', tone: 'bg-white/[0.07]' },
{ range: '₹1,001 – ₹7,500', rate: '5% GST', tone: 'bg-white/[0.07]' },
{ range: 'Above ₹7,500', rate: '18% GST', tone: 'bg-white/[0.07]' }];


export function GstRulesCard() {
  return (
    <section aria-label="GST rules" className="rounded-2xl bg-ink p-6 text-white">
      <div className="flex flex-wrap items-start justify-between gap-6">
        <div className="max-w-[520px]">
          <p className="text-[13px] font-medium text-white/60">How pricing works</p>
          <h2 className="mt-2 text-[22px] font-bold leading-snug tracking-tight">
            Enter your price without GST — Checkdin adds the right slab automatically.
          </h2>
          <p className="mt-2 flex items-start gap-2 text-[13px] leading-relaxed text-white/60">
            <InfoIcon size={15} className="mt-0.5 shrink-0 text-lime-300" aria-hidden="true" />
            The slab is decided by the tariff per room per stay. Guests always see the GST-inclusive
            amount at checkout, and your payout is calculated on the base price.
          </p>
        </div>

        <dl className="grid w-full max-w-[380px] grid-cols-1 gap-2">
          {slabs.map((slab) =>
          <div
            key={slab.range}
            className={`flex items-center justify-between rounded-xl ${slab.tone} px-4 py-2.5`}>
            
              <dt className="text-[13px] text-white/70">{slab.range}</dt>
              <dd className="text-[13px] font-semibold text-lime-300">{slab.rate}</dd>
            </div>
          )}
        </dl>
      </div>
    </section>);

}