import React, { useMemo, useState } from 'react';
import { CheckCircle2Icon, TrendingUpIcon } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { SettingsCard } from '../components/settings/SettingsCard';
import { Switch } from '../components/settings/Toggle';
import { PermissionNotice } from '../components/AccessControls';
import { useAuth } from '../contexts/AuthContext';
import { pricingRules, type PricingRule } from '../data/growth';
import { durationKeys, durationLabels, slotPricing } from '../data/pricing';
import { inr, priceWithGst } from '../utils/gst';

const groups: PricingRule['group'][] = ['Time of day', 'Weekend', 'Seasonal', 'Demand'];

export function DynamicPricing() {
  const { can, addAudit } = useAuth();
  const canManage = can('manage_pricing');
  const [rules, setRules] = useState<PricingRule[]>(pricingRules);
  const [saved, setSaved] = useState(false);

  const activeImpact = useMemo(
    () => rules.filter((rule) => rule.active).reduce((sum, rule) => sum + rule.impact, 0),
    [rules]
  );

  const patch = (id: string, changes: Partial<PricingRule>) => {
    setSaved(false);
    setRules((prev) => prev.map((rule) => rule.id === id ? { ...rule, ...changes } : rule));
  };

  const preview = durationKeys.map((duration) => {
    const base = slotPricing.basePrices[duration];
    const evening = rules.find((rule) => rule.id === 'evening');
    const saturday = rules.find((rule) => rule.id === 'saturday');
    const eveningPrice = Math.round(base * (1 + (evening?.active ? evening.adjustment : 0) / 100));
    const weekendPrice = Math.round(
      eveningPrice * (1 + (saturday?.active ? saturday.adjustment : 0) / 100)
    );
    return { duration, base, eveningPrice, weekendPrice };
  });

  return (
    <main className="scroll-slim h-full flex-1 overflow-y-auto bg-canvas px-7 py-6">
      <PageHeader
        title="Dynamic Pricing"
        subtitle="Rules that move your slot price by time, day, season and demand." />
      

      <div className="mt-6 space-y-5 pb-28">
        <section className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-ink p-6 text-white">
          <div>
            <p className="flex items-center gap-2 text-[11px] font-bold tracking-wide text-lime-300">
              <TrendingUpIcon size={14} aria-hidden="true" />
              ESTIMATED MONTHLY IMPACT
            </p>
            <p className="mt-2 text-[34px] font-bold leading-none tracking-tight">
              {inr(activeImpact)}
            </p>
            <p className="mt-2 text-[13px] text-white/60">
              From {rules.filter((rule) => rule.active).length} active rules, applied on top of your
              base slot prices.
            </p>
          </div>
          <p className="max-w-[360px] text-[12.5px] leading-relaxed text-white/60">
            Rules stack in order: time of day, then weekend, then seasonal, then demand. GST is
            calculated on the final price.
          </p>
        </section>

        {groups.map((group) =>
        <SettingsCard
          key={group}
          title={group}
          description={
          group === 'Demand' ?
          'Applied automatically when occupancy crosses the threshold.' :
          'Adjustments applied to every slot in this window.'
          }
          bodyClassName="p-5">
          
            <ul className="space-y-3">
              {rules.
            filter((rule) => rule.group === group).
            map((rule) =>
            <li
              key={rule.id}
              className="flex flex-wrap items-center gap-4 rounded-xl border border-neutral-200 px-4 py-3">
              
                    <span className="min-w-[190px] flex-1">
                      <span className="block text-[13.5px] font-medium text-ink">{rule.label}</span>
                      <span className="block text-[12px] text-ink-muted">{rule.window}</span>
                    </span>

                    <label className="flex items-center gap-2">
                      <span className="sr-only">{rule.label} adjustment</span>
                      <input
                  type="number"
                  min={-50}
                  max={50}
                  step={1}
                  value={rule.adjustment}
                  disabled={!rule.active}
                  onChange={(e) => patch(rule.id, { adjustment: Number(e.target.value) || 0 })}
                  className="w-[86px] rounded-lg border border-neutral-200 bg-white px-3 py-2 text-[13.5px] font-semibold text-ink outline-none transition-colors duration-150 ease-out hover:border-neutral-300 focus:border-lime-500 disabled:bg-neutral-50 disabled:text-ink-muted" />
                
                      <span className="text-[13px] text-ink-muted">%</span>
                    </label>

                    <span className="w-[130px] text-right text-[12.5px] text-ink-muted">
                      {rule.active ? `${inr(rule.impact)} / month` : 'Inactive'}
                    </span>

                    <Switch
                checked={rule.active}
                onChange={(value) => patch(rule.id, { active: value })}
                label={`${rule.label} rule`}
                size="sm" />
              
                  </li>
            )}
            </ul>
          </SettingsCard>
        )}

        <SettingsCard
          title="Price preview"
          description="What a guest pays once the active rules and GST are applied."
          bodyClassName="">
          
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] border-collapse text-left">
              <thead>
                <tr className="border-b border-neutral-200/80 bg-neutral-50/70">
                  {['Slot', 'Base (excl. GST)', 'Weekday evening', 'Saturday evening'].map((head) =>
                  <th
                    key={head}
                    scope="col"
                    className="px-5 py-2.5 text-[12px] font-medium text-ink-muted">
                    
                      {head}
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {preview.map((row) =>
                <tr key={row.duration} className="border-b border-neutral-100 last:border-0">
                    <td className="px-5 py-3.5 text-[13.5px] font-medium text-ink">
                      {durationLabels[row.duration]}
                    </td>
                    <td className="px-5 py-3.5 text-[13px] text-ink-soft">{inr(row.base)}</td>
                    <td className="px-5 py-3.5 text-[13.5px] font-semibold text-ink">
                      {inr(priceWithGst(row.eveningPrice))}
                    </td>
                    <td className="px-5 py-3.5 text-[13.5px] font-semibold text-ink">
                      {inr(priceWithGst(row.weekendPrice))}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </SettingsCard>
      </div>

      <div className="sticky bottom-0 -mx-7 border-t border-neutral-200 bg-white/95 px-7 py-3.5 backdrop-blur">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-[13px] text-ink-muted">
            Rules apply to every Checkdin booking at this property.
          </p>
          <div className="flex items-center gap-3">
            {saved &&
            <p
              role="status"
              className="flex items-center gap-1.5 text-[13px] font-medium text-forest">
              
                <CheckCircle2Icon size={15} aria-hidden="true" />
                Pricing rules published
              </p>
            }
            {canManage ?
            <button
              type="button"
              onClick={() => {
                setSaved(true);
                addAudit({
                  action: 'Updated dynamic pricing rules',
                  detail: `${rules.filter((r) => r.active).length} active rules • ${inr(activeImpact)} estimated impact`,
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