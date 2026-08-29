import React from 'react';
import { PageHeader } from '../components/PageHeader';
import { SettingsCard } from '../components/settings/SettingsCard';
import { performanceScore } from '../data/operations';

const guidance: Record<string, string> = {
  occupancy: 'Add slots on Friday and Saturday evenings, where you sell out most often.',
  reviews: 'Keep replying within a day — reply rate matters as much as the star average.',
  acceptance: 'Strong. Auto-accept would push this to 100%.',
  extension: 'The weakest factor — expired requests are costing you points and revenue.',
  response: 'Excellent. Median first response is under 2 minutes.',
  cancellation: 'Below platform average, which is good. Watch price-related cancellations.'
};

export function PerformanceScore() {
  const { score, band, factors, badges } = performanceScore;
  const circumference = 2 * Math.PI * 52;

  return (
    <main className="scroll-slim h-full flex-1 overflow-y-auto bg-canvas px-7 py-6">
      <PageHeader
        title="Performance Score"
        subtitle="How Checkdin rates your property, and exactly what moves the number." />
      

      <div className="mt-6 space-y-5 pb-8">
        <section className="flex flex-wrap items-center gap-8 rounded-2xl bg-ink p-7 text-white">
          <div className="relative h-[144px] w-[144px] shrink-0">
            <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
              <circle cx="60" cy="60" r="52" stroke="rgba(255,255,255,0.12)" strokeWidth="12" fill="none" />
              <circle
                cx="60"
                cy="60"
                r="52"
                stroke="#D9FF3F"
                strokeWidth="12"
                strokeLinecap="round"
                fill="none"
                strokeDasharray={circumference}
                strokeDashoffset={circumference * (1 - score / 100)} />
              
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-[34px] font-bold leading-none tracking-tight">{score}</span>
              <span className="text-[12px] text-white/50">out of 100</span>
            </div>
          </div>

          <div className="min-w-[220px]">
            <p className="text-[11px] font-bold tracking-wide text-lime-300">{band.toUpperCase()}</p>
            <p className="mt-2 max-w-[460px] text-[14px] leading-relaxed text-white/70">
              You are in the top 8% of Checkdin properties in Chennai. Score updates nightly from
              the six factors below.
            </p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {badges.map((badge) =>
              <li
                key={badge.id}
                className="flex items-center gap-1.5 rounded-full bg-white/[0.09] px-3 py-1.5 text-[12.5px] font-medium">
                
                  <span aria-hidden="true">{badge.icon}</span>
                  {badge.label}
                </li>
              )}
            </ul>
          </div>
        </section>

        <SettingsCard
          title="What makes up your score"
          description="Each factor contributes its weighted share of the 100 points."
          bodyClassName="p-5">
          
          <ul className="space-y-5">
            {factors.map((factor) =>
            <li key={factor.id}>
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <span className="text-[13.5px] font-medium text-ink">{factor.label}</span>
                  <span className="text-[12.5px] text-ink-muted">
                    {factor.contribution} of {factor.weight} points • {factor.value}%
                  </span>
                </div>
                <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-neutral-100">
                  <div
                  className={`h-full rounded-full ${
                  factor.contribution / factor.weight >= 0.9 ?
                  'bg-forest' :
                  factor.contribution / factor.weight >= 0.75 ?
                  'bg-lime-400' :
                  'bg-amber-400'}`
                  }
                  style={{ width: `${factor.contribution / factor.weight * 100}%` }} />
                
                </div>
                <p className="mt-1.5 text-[12px] text-ink-muted">{guidance[factor.id]}</p>
              </li>
            )}
          </ul>
        </SettingsCard>
      </div>
    </main>);

}