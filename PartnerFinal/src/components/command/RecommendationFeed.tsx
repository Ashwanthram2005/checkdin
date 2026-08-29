import React from 'react';
import { BrainCircuitIcon, ArrowRightIcon } from 'lucide-react';
import { recommendations } from '../../data/growth';
import { inr } from '../../utils/gst';

type RecommendationFeedProps = {
  limit?: number;
  onOpenAll?: () => void;
};

export function RecommendationFeed({ limit = 3, onOpenAll }: RecommendationFeedProps) {
  const items = recommendations.slice(0, limit);

  return (
    <section className="rounded-2xl bg-ink p-5 text-white">
      <div className="flex items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 text-[15px] font-semibold">
          <BrainCircuitIcon size={16} className="text-lime-300" aria-hidden="true" />
          What PartnerOS suggests today
        </h2>
        {onOpenAll &&
        <button
          type="button"
          onClick={onOpenAll}
          className="flex items-center gap-1 text-[12.5px] font-semibold text-lime-300 transition-colors duration-150 ease-out hover:text-lime-200">
          
            All recommendations
            <ArrowRightIcon size={13} aria-hidden="true" />
          </button>
        }
      </div>

      <ul className="mt-4 grid grid-cols-1 gap-3 lg:grid-cols-3">
        {items.map((item) =>
        <li key={item.id} className="rounded-xl bg-white/[0.07] p-4">
            <p className="text-[10.5px] font-bold tracking-[0.14em] text-lime-300">
              {item.category.toUpperCase()}
            </p>
            <p className="mt-1.5 text-[14px] font-semibold leading-snug">{item.headline}</p>
            <p className="mt-1.5 text-[12px] leading-relaxed text-white/60">{item.observation}</p>
            {item.upside > 0 &&
          <p className="mt-2.5 text-[12.5px] font-semibold text-lime-300">
                Worth about {inr(item.upside)}
              </p>
          }
          </li>
        )}
      </ul>
    </section>);

}