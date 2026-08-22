import React from 'react';
import { ArrowRightIcon, TrendingUpIcon, PiggyBankIcon, BarChart3Icon, WalletIcon } from 'lucide-react';
import { revenueOverview } from '../data/dashboard';

const icons = [PiggyBankIcon, BarChart3Icon, BarChart3Icon, WalletIcon];

export function RevenueOverview() {
  return (
    <section className="rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-card">
      <div className="flex items-center justify-between">
        <h2 className="text-[16px] font-semibold text-ink">Revenue Overview</h2>
        <button
          type="button"
          className="flex items-center gap-1.5 text-[13px] font-medium text-lime-600 transition-colors duration-150 ease-out hover:text-lime-500">
          
          View detailed report
          <ArrowRightIcon size={15} aria-hidden="true" />
        </button>
      </div>

      <dl className="mt-4 grid grid-cols-2 divide-neutral-200/80 lg:grid-cols-4 lg:divide-x">
        {revenueOverview.map((item, i) => {
          const Icon = icons[i];
          return (
            <div key={item.label} className="flex items-start gap-3 px-0 py-3 lg:px-5 lg:py-0 lg:first:pl-0">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-lime-100">
                <Icon size={18} className="text-lime-600" strokeWidth={2} aria-hidden="true" />
              </span>
              <div>
                <dt className="text-[12.5px] text-ink-muted">{item.label}</dt>
                <dd className="mt-0.5 text-[17px] font-bold tracking-tight text-ink">
                  {item.value}
                </dd>
                {item.delta ?
                <p className="mt-1 flex items-center gap-1 text-[11.5px] text-ink-muted">
                    <TrendingUpIcon size={12} className="text-forest" aria-hidden="true" />
                    <span className="font-semibold text-forest">{item.delta.split(' ')[0]}</span>
                    {item.delta.slice(item.delta.indexOf(' ') + 1)}
                  </p> :

                <p className="mt-1 text-[11.5px] text-ink-muted">{item.note ?? '\u00A0'}</p>
                }
              </div>
            </div>);

        })}
      </dl>
    </section>);

}