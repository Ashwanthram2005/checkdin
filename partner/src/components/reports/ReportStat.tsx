import React from 'react';
import { TrendingDownIcon, TrendingUpIcon } from 'lucide-react';

type ReportStatProps = {
  label: string;
  value: string;
  note?: string;
  delta?: number;
  emphasis?: boolean;
};

export function ReportStat({ label, value, note, delta, emphasis = false }: ReportStatProps) {
  const positive = (delta ?? 0) >= 0;

  return (
    <article
      className={[
      'rounded-2xl border p-4',
      emphasis ? 'border-lime-400 bg-lime-50' : 'border-neutral-200/80 bg-white shadow-card'].
      join(' ')}>
      
      <p className="text-[12.5px] font-medium text-ink-muted">{label}</p>
      <p className="mt-2 text-[24px] font-bold leading-none tracking-tight text-ink">{value}</p>
      {typeof delta === 'number' ?
      <p className="mt-2 flex items-center gap-1 text-[11.5px] text-ink-muted">
          {positive ?
        <TrendingUpIcon size={12} className="text-forest" aria-hidden="true" /> :

        <TrendingDownIcon size={12} className="text-red-600" aria-hidden="true" />
        }
          <span className={`font-semibold ${positive ? 'text-forest' : 'text-red-600'}`}>
            {positive ? '+' : ''}
            {delta}%
          </span>
          {note}
        </p> :

      note && <p className="mt-2 text-[11.5px] text-ink-muted">{note}</p>
      }
    </article>);

}