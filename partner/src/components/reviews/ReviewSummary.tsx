import React from 'react';
import { MessageSquareIcon, TrendingUpIcon } from 'lucide-react';
import { StarRating } from './StarRating';
import { ratingDistribution } from '../../data/reviews';

type ReviewSummaryProps = {
  awaitingReply: number;
};

export function ReviewSummary({ awaitingReply }: ReviewSummaryProps) {
  const total = ratingDistribution.reduce((sum, row) => sum + row.count, 0);
  const average =
  ratingDistribution.reduce((sum, row) => sum + row.stars * row.count, 0) / total;

  return (
    <section
      aria-label="Rating summary"
      className="grid grid-cols-1 gap-5 rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-card lg:grid-cols-[220px_minmax(0,1fr)_260px]">
      
      <div className="flex flex-col justify-center border-neutral-100 lg:border-r lg:pr-5">
        <p className="text-[13px] font-medium text-ink-muted">Overall rating</p>
        <p className="mt-1 text-[46px] font-bold leading-none tracking-tight text-ink">
          {average.toFixed(1)}
        </p>
        <StarRating value={average} size={17} className="mt-2.5" />
        <p className="mt-2 text-[12.5px] text-ink-muted">Based on {total} guest reviews</p>
      </div>

      <ul className="space-y-2 lg:px-2">
        {ratingDistribution.map((row) => {
          const share = Math.round(row.count / total * 100);
          return (
            <li key={row.stars} className="flex items-center gap-3">
              <span className="w-8 shrink-0 text-[12.5px] font-medium text-ink-soft">
                {row.stars}★
              </span>
              <span className="h-2 flex-1 overflow-hidden rounded-full bg-neutral-100">
                <span
                  className={`block h-full rounded-full ${row.stars >= 4 ? 'bg-lime-400' : row.stars === 3 ? 'bg-neutral-400' : 'bg-red-400'}`}
                  style={{ width: `${share}%` }} />
                
              </span>
              <span className="w-14 shrink-0 text-right text-[12px] text-ink-muted">
                {row.count} ({share}%)
              </span>
            </li>);

        })}
      </ul>

      <dl className="grid grid-cols-2 gap-3 lg:grid-cols-1 lg:border-l lg:border-neutral-100 lg:pl-5">
        <div className="rounded-xl bg-neutral-50 px-4 py-3">
          <dt className="flex items-center gap-1.5 text-[12px] text-ink-muted">
            <MessageSquareIcon size={13} aria-hidden="true" />
            Awaiting your reply
          </dt>
          <dd className="mt-1 text-[19px] font-semibold tracking-tight text-ink">
            {awaitingReply}
          </dd>
        </div>
        <div className="rounded-xl bg-neutral-50 px-4 py-3">
          <dt className="flex items-center gap-1.5 text-[12px] text-ink-muted">
            <TrendingUpIcon size={13} aria-hidden="true" />
            Response rate
          </dt>
          <dd className="mt-1 text-[19px] font-semibold tracking-tight text-ink">
            92%
            <span className="ml-1.5 text-[12px] font-medium text-forest">+6% this month</span>
          </dd>
        </div>
      </dl>
    </section>);

}