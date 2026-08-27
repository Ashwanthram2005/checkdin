import React, { useEffect, useMemo, useState } from 'react';
import { SlidersHorizontalIcon, XIcon } from 'lucide-react';
import { SearchPanel } from '../components/search/SearchPanel';
import { HotelCard } from '../components/hotel/HotelCard';
import {
  FilterSidebar,
  emptyFilters,
  type Filters } from
'../components/search/FilterSidebar';
import { loadHotels } from '../data/hotels';
import { useBooking } from '../contexts/BookingContext';
import { dateLabel, toTimeLabel } from '../utils/format';
import type { Hotel } from '../types/booking';

export function Search() {
  const { search, setSearch } = useBooking();
  const [filters, setFilters] = useState<Filters>(emptyFilters);
  const [loading, setLoading] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [hotels, setHotels] = useState<Hotel[]>([]);

  useEffect(() => {
    setLoading(true);
    loadHotels({ city: search.city, search: search.location })
      .then(({ hotels }) => setHotels(hotels))
      .finally(() => setLoading(false));
  }, [search.city, search.location]);

  const tagMatchers: Record<string, (h: Hotel) => boolean> = {
    'Couple Friendly': (h) => h.coupleFriendly,
    'Pay At Hotel': (h) => h.payAtHotel,
    'Instant Check-in': (h) => h.instantConfirm
  };

  const results = useMemo(() => {
    let list = [...hotels];

    if (filters.tags.length)
    list = list.filter((h) =>
    filters.tags.every((tag) => tagMatchers[tag]?.(h) ?? true)
    );
    if (filters.areas.length)
    list = list.filter((h) => filters.areas.includes(h.area));
    if (filters.ratingMin !== null)
    list = list.filter((h) => h.rating >= (filters.ratingMin as number));
    if (filters.collections.length)
    list = list.filter(
      (h) => h.collection && filters.collections.includes(h.collection)
    );
    if (filters.chains.length)
    list = list.filter((h) => filters.chains.includes(h.chain));
    if (filters.businessOnly) list = list.filter((h) => h.businessFriendly);

    const sorted = [...list];
    if (filters.priceSort) {
      sorted.sort((a, b) =>
      filters.priceSort === 'asc' ?
      a.rates[search.duration] - b.rates[search.duration] :
      b.rates[search.duration] - a.rates[search.duration]
      );
    } else if (filters.ratingSort) {
      sorted.sort((a, b) =>
      filters.ratingSort === 'asc' ? a.rating - b.rating : b.rating - a.rating
      );
    } else {
      sorted.sort((a, b) => a.distanceKm - b.distanceKm);
    }
    return sorted;
  }, [search.duration, filters, hotels]);

  const activeCount =
  filters.tags.length +
  filters.areas.length +
  filters.collections.length +
  filters.chains.length + (
  filters.ratingMin !== null ? 1 : 0) + (
  filters.businessOnly ? 1 : 0);

  function update(next: Partial<Filters>) {
    setFilters((prev) => ({ ...prev, ...next }));
  }

  const sidebar =
  <FilterSidebar
    filters={filters}
    onChange={update}
    duration={search.duration}
    onDurationChange={(duration) => setSearch({ duration })} />;



  return (
    <div className="mx-auto w-full max-w-[1360px] px-5 py-8 lg:px-8">
      <SearchPanel variant="compact" />

      <div className="mt-8 grid gap-8 lg:grid-cols-[320px_1fr]">
        <aside className="hidden lg:block" aria-label="Filters">
          {sidebar}
        </aside>

        <section aria-label="Results">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="font-display text-3xl leading-tight">
                {search.location || search.city}, {dateLabel(search.date)}
              </h1>
              <p className="mt-1 text-sm text-muted">
                {loading ? 'Checking availability…' : `${results.length} stays`}{' '}
                with a {search.duration}-hour slot from{' '}
                {toTimeLabel(search.checkIn)}
              </p>
            </div>
            <div className="flex items-center gap-3">
              {activeCount > 0 &&
              <button
                type="button"
                onClick={() => setFilters(emptyFilters)}
                className="text-sm font-semibold text-accent underline underline-offset-4">
                
                  Clear all ({activeCount})
                </button>
              }
              <button
                type="button"
                onClick={() => setFiltersOpen(true)}
                className="inline-flex items-center gap-2 rounded-xl border border-line bg-surface px-4 py-2.5 text-sm font-semibold lg:hidden">
                
                <SlidersHorizontalIcon className="h-4 w-4" aria-hidden="true" />
                Filters
                {activeCount > 0 &&
                <span className="rounded-md bg-primary px-1.5 text-xs text-ink">
                    {activeCount}
                  </span>
                }
              </button>
            </div>
          </div>

          <div className="mt-6 space-y-5">
            {loading &&
            [0, 1, 2].map((i) =>
            <div
              key={i}
              className="h-56 animate-pulse rounded-2xl border border-line bg-surface sm:h-48" />

            )}

            {!loading &&
            results.map((hotel) =>
            <HotelCard
              key={hotel.id}
              hotel={hotel}
              duration={search.duration}
              onDurationChange={(duration) => setSearch({ duration })} />

            )}

            {!loading && results.length === 0 &&
            <div className="rounded-2xl border border-dashed border-line bg-surface p-12 text-center">
                <h2 className="font-display text-2xl">
                  Nothing open for that window
                </h2>
                <p className="mx-auto mt-2 max-w-sm text-sm text-muted">
                  Try a shorter slot, a later check-in, or loosen the filters —
                  Chennai inventory moves quickly around midnight.
                </p>
                <button
                type="button"
                onClick={() => setFilters(emptyFilters)}
                className="mt-5 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-ink transition-colors duration-150 ease-smooth hover:bg-primary-dark">
                
                  Clear filters
                </button>
              </div>
            }
          </div>
        </section>
      </div>

      {/* Mobile filter drawer */}
      {filtersOpen &&
      <div className="fixed inset-0 z-50 lg:hidden">
          <button
          type="button"
          aria-label="Close filters"
          onClick={() => setFiltersOpen(false)}
          className="absolute inset-0 bg-ink/50" />
        
          <div className="absolute inset-y-0 right-0 w-[88%] max-w-sm overflow-y-auto bg-canvas p-4">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-xl">Filters</h2>
              <button
              type="button"
              onClick={() => setFiltersOpen(false)}
              className="rounded-lg border border-line p-2"
              aria-label="Close filters">
              
                <XIcon className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
            {sidebar}
            <button
            type="button"
            onClick={() => setFiltersOpen(false)}
            className="sticky bottom-0 w-full rounded-xl bg-primary px-5 py-3.5 text-sm font-bold text-ink">
            
              Show {results.length} stays
            </button>
          </div>
        </div>
      }
    </div>);

}
