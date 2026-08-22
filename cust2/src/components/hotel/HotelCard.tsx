import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  BadgeCheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  MapPinIcon,
  StarIcon,
  UsersIcon } from
'lucide-react';
import type { Duration, Hotel } from '../../types/booking';
import { galleryFor } from '../../data/hotels';
import { standardAmenities } from '../../data/amenities';
import { inr } from '../../utils/format';
import { priceBreakdown, serviceFees } from '../../utils/pricing';

interface Props {
  hotel: Hotel;
  duration: Duration;
  onDurationChange: (duration: Duration) => void;
}

const slots: Duration[] = [3, 6, 12];

export function HotelCard({ hotel, duration, onDurationChange }: Props) {
  const gallery = galleryFor(hotel);
  const [frame, setFrame] = useState(0);
  const navigate = useNavigate();

  const iconAmenities = standardAmenities.slice(0, 6);
  const moreCount = standardAmenities.length - iconAmenities.length;

  function book(next: Duration) {
    onDurationChange(next);
    navigate(`/hotel/${hotel.id}`);
  }

  return (
    <article className="overflow-hidden rounded-2xl border border-line bg-surface shadow-card transition-shadow duration-200 ease-smooth hover:shadow-lift">
      <div className="grid gap-4 p-4 lg:grid-cols-[300px_84px_1fr]">
        {/* Main image */}
        <div className="relative h-52 overflow-hidden rounded-xl lg:h-full">
          <img
            src={gallery[frame]}
            alt={`${hotel.name} room`}
            className="h-full w-full object-cover" />
          
          {hotel.slotsLeft <= 3 &&
          <span className="absolute left-3 top-3 rounded-lg bg-primary px-2.5 py-1 text-xs font-bold text-ink">
              Only {hotel.slotsLeft} slot{hotel.slotsLeft > 1 ? 's' : ''} left
            </span>
          }
          <button
            type="button"
            onClick={() => setFrame((f) => (f - 1 + gallery.length) % gallery.length)}
            aria-label="Previous photo"
            className="absolute left-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-surface/90 transition-colors duration-150 ease-smooth hover:bg-surface">
            
            <ChevronLeftIcon className="h-4 w-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => setFrame((f) => (f + 1) % gallery.length)}
            aria-label="Next photo"
            className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-surface/90 transition-colors duration-150 ease-smooth hover:bg-surface">
            
            <ChevronRightIcon className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        {/* Thumbnails */}
        <div className="hidden flex-col gap-2 lg:flex">
          {gallery.map((img, i) =>
          <button
            key={img + i}
            type="button"
            onClick={() => setFrame(i)}
            aria-label={`Photo ${i + 1}`}
            aria-current={frame === i}
            className={`h-16 overflow-hidden rounded-lg border-2 transition-colors duration-150 ease-smooth ${
            frame === i ? 'border-primary' : 'border-transparent'}`
            }>
            
              <img src={img} alt="" className="h-full w-full object-cover" />
            </button>
          )}
        </div>

        {/* Details */}
        <div className="flex flex-col">
          <span className="inline-flex w-fit items-center gap-1 rounded-md bg-ink px-2 py-1 text-xs font-bold text-white">
            <StarIcon className="h-3 w-3 fill-primary text-primary" aria-hidden="true" />
            {hotel.rating}
            <span className="font-medium text-white/70">
              ({hotel.reviews.toLocaleString('en-IN')})
            </span>
          </span>

          <h3 className="mt-2 text-lg font-bold leading-snug">
            <Link
              to={`/hotel/${hotel.id}`}
              className="transition-colors duration-150 ease-smooth hover:text-muted">
              
              {hotel.name} — Near {hotel.landmark}
            </Link>
          </h3>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-muted">
            <MapPinIcon className="h-3.5 w-3.5" aria-hidden="true" />
            {hotel.area} · {hotel.distanceKm} km from {hotel.landmark}
          </p>

          <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm">
            {hotel.coupleFriendly &&
            <li className="flex items-center gap-1.5">
                <UsersIcon className="h-4 w-4 text-muted" aria-hidden="true" />
                Couple Friendly
              </li>
            }
            {hotel.localIdAccepted &&
            <li className="flex items-center gap-1.5">
                <BadgeCheckIcon className="h-4 w-4 text-muted" aria-hidden="true" />
                Accepts Local ID
              </li>
            }
          </ul>

          <ul className="mt-3 flex flex-wrap items-center gap-4 text-muted">
            {iconAmenities.map((amenity) =>
            <li key={amenity.label} title={amenity.label}>
                <amenity.icon className="h-[18px] w-[18px]" aria-label={amenity.label} />
              </li>
            )}
            <li className="text-sm">+{moreCount} more</li>
          </ul>

          <div className="mt-auto grid gap-3 pt-6 sm:grid-cols-3">
            {slots.map((slot) => {
              const active = slot === duration;
              return (
                <button
                  key={slot}
                  type="button"
                  onClick={() => book(slot)}
                  className={`rounded-xl border px-4 py-3 text-center transition-colors duration-150 ease-smooth ${
                  active ?
                  'border-primary bg-primary-soft' :
                  'border-line bg-surface hover:border-ink'}`
                  }>
                  
                  <span className="block text-lg font-bold">
                    {inr(priceBreakdown(hotel.rates[slot], slot).total)}
                  </span>
                  <span className="mt-0.5 block text-xs text-muted">
                    {slot} Hrs · incl. {inr(serviceFees[slot])} fee
                  </span>
                </button>);

            })}
          </div>
        </div>
      </div>
    </article>);

}