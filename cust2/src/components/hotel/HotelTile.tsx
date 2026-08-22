import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { HeartIcon, MapPinIcon, StarIcon } from 'lucide-react';
import type { Duration, Hotel } from '../../types/booking';
import { inr } from '../../utils/format';
import { slotPrice } from '../../utils/pricing';

interface Props {
  hotel: Hotel;
  duration: Duration;
}

export function HotelTile({ hotel, duration }: Props) {
  const [saved, setSaved] = useState(false);

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-surface transition-shadow duration-200 ease-smooth hover:shadow-lift">
      <div className="relative h-44 overflow-hidden">
        <img
          src={hotel.image}
          alt=""
          className="h-full w-full object-cover transition-transform duration-300 ease-smooth group-hover:scale-[1.03]" />
        
        <span className="absolute left-3 top-3 rounded-lg bg-primary px-2.5 py-1 text-xs font-bold text-ink">
          {duration}h from {inr(slotPrice(hotel.rates[duration], duration))}
        </span>
        <button
          type="button"
          onClick={() => setSaved((v) => !v)}
          aria-pressed={saved}
          aria-label={saved ? `Remove ${hotel.name} from saved` : `Save ${hotel.name}`}
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-surface/95 transition-colors duration-150 ease-smooth hover:bg-surface">
          
          <HeartIcon
            className={`h-4 w-4 ${saved ? 'fill-accent text-accent' : 'text-ink'}`}
            aria-hidden="true" />
          
        </button>
      </div>
      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-[15px] font-bold leading-snug">
            <Link
              to={`/hotel/${hotel.id}`}
              className="transition-colors duration-150 ease-smooth hover:text-muted">
              
              {hotel.name}
            </Link>
          </h3>
          <span className="flex shrink-0 items-center gap-1 text-sm font-bold">
            <StarIcon className="h-3.5 w-3.5 fill-primary text-primary" aria-hidden="true" />
            {hotel.rating}
          </span>
        </div>
        <p className="mt-auto flex items-center gap-1.5 pt-2 text-[13px] text-muted">
          <MapPinIcon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          {hotel.area}, {hotel.city} · {hotel.distanceKm} km from you
        </p>
      </div>
    </article>);

}