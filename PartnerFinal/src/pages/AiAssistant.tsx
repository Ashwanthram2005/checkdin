import React, { useState } from 'react';
import { BrainCircuitIcon, CheckCircle2Icon, ClockIcon, XIcon } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { useAuth } from '../contexts/AuthContext';
import { recommendations, type Recommendation } from '../data/growth';
import { inr } from '../utils/gst';

type CardState = 'open' | 'applied' | 'snoozed' | 'dismissed';

const targets: Record<Recommendation['category'], string> = {
  Pricing: 'Dynamic Pricing',
  Revenue: 'Extension Revenue',
  Occupancy: 'Availability',
  Customers: 'Guest Messaging',
  Promotion: 'Promotions',
  Performance: 'Reviews'
};

type AiAssistantProps = {
  onNavigate: (label: string) => void;
};

export function AiAssistant({ onNavigate }: AiAssistantProps) {
  const { addAudit } = useAuth();
  const [states, setStates] = useState<Record<string, CardState>>({});

  const open = recommendations.filter((item) => (states[item.id] ?? 'open') === 'open');
  const upside = open.reduce((sum, item) => sum + item.upside, 0);

  const setState = (item: Recommendation, state: CardState) => {
    setStates((prev) => ({ ...prev, [item.id]: state }));
    if (state === 'applied') {
      addAudit({
        action: 'Applied AI recommendation',
        detail: `${item.headline} • estimated ${inr(item.upside)}`,
        category: 'Management'
      });
    }
  };

  return (
    <main className="scroll-slim h-full flex-1 overflow-y-auto bg-canvas px-7 py-6">
      <PageHeader
        title="AI Assistant"
        subtitle="Recommendations generated from your own occupancy, pricing and guest data." />
      

      <div className="mt-6 space-y-5 pb-8">
        <section className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-ink p-6 text-white">
          <div>
            <p className="flex items-center gap-2 text-[11px] font-bold tracking-wide text-lime-300">
              <BrainCircuitIcon size={14} aria-hidden="true" />
              OPPORTUNITY ON THE TABLE
            </p>
            <p className="mt-2 text-[34px] font-bold leading-none tracking-tight">{inr(upside)}</p>
            <p className="mt-2 text-[13px] text-white/60">
              Across {open.length} open recommendation{open.length === 1 ? '' : 's'} this week.
            </p>
          </div>
          <p className="max-w-[380px] text-[12.5px] leading-relaxed text-white/60">
            Each card states what PartnerOS observed, the action it suggests, and the rupee value.
            Applying a card takes you to the screen where the change happens.
          </p>
        </section>

        <ul className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {recommendations.map((item) => {
            const state = states[item.id] ?? 'open';
            const resolved = state !== 'open';

            return (
              <li
                key={item.id}
                className={[
                'rounded-2xl border p-5 transition-colors duration-150 ease-out',
                resolved ?
                'border-neutral-200 bg-neutral-50' :
                'border-neutral-200/80 bg-white shadow-card'].
                join(' ')}>
                
                <div className="flex items-start justify-between gap-3">
                  <span className="rounded-md bg-lime-100 px-2.5 py-1 text-[10.5px] font-bold tracking-wide text-lime-700">
                    {item.category.toUpperCase()}
                  </span>
                  <span className="text-[11.5px] text-ink-muted">
                    {item.confidence}% confidence
                  </span>
                </div>

                <h2 className="mt-3 text-[16px] font-semibold leading-snug text-ink">
                  {item.headline}
                </h2>
                <p className="mt-1.5 text-[13px] leading-relaxed text-ink-soft">
                  {item.observation}
                </p>
                <p className="mt-2.5 rounded-xl bg-neutral-50 px-3.5 py-2.5 text-[12.5px] text-ink-soft">
                  <span className="font-semibold text-ink">Suggested action — </span>
                  {item.action}
                </p>

                {item.upside > 0 &&
                <p className="mt-3 text-[15px] font-bold tracking-tight text-forest">
                    Worth about {inr(item.upside)}
                  </p>
                }

                {resolved ?
                <p className="mt-3 flex items-center gap-1.5 text-[12.5px] font-medium text-ink-muted">
                    {state === 'applied' &&
                  <>
                        <CheckCircle2Icon size={14} className="text-lime-600" aria-hidden="true" />
                        Applied — opened in {targets[item.category]}
                      </>
                  }
                    {state === 'snoozed' &&
                  <>
                        <ClockIcon size={14} aria-hidden="true" />
                        Snoozed for 7 days
                      </>
                  }
                    {state === 'dismissed' &&
                  <>
                        <XIcon size={14} aria-hidden="true" />
                        Dismissed
                      </>
                  }
                  </p> :

                <div className="mt-4 flex flex-wrap gap-2">
                    <button
                    type="button"
                    onClick={() => {
                      setState(item, 'applied');
                      onNavigate(targets[item.category]);
                    }}
                    className="rounded-xl bg-lime-300 px-4 py-2 text-[13px] font-semibold text-ink transition-colors duration-150 ease-out hover:bg-lime-200">
                    
                      Apply
                    </button>
                    <button
                    type="button"
                    onClick={() => setState(item, 'snoozed')}
                    className="rounded-xl border border-neutral-200 px-4 py-2 text-[13px] font-medium text-ink transition-colors duration-150 ease-out hover:border-neutral-300">
                    
                      Snooze
                    </button>
                    <button
                    type="button"
                    onClick={() => setState(item, 'dismissed')}
                    className="rounded-xl px-3 py-2 text-[13px] font-medium text-ink-muted transition-colors duration-150 ease-out hover:text-ink">
                    
                      Dismiss
                    </button>
                  </div>
                }
              </li>);

          })}
        </ul>
      </div>
    </main>);

}