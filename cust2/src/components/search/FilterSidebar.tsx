import React, { useState } from 'react';
import {
  AirVentIcon,
  GlassWaterIcon,
  SearchIcon,
  StarIcon,
  TvIcon,
  WifiIcon } from
'lucide-react';
import {
  bookingNotes,
  chennaiAreas,
  collections,
  hotelChains,
  popularTags,
  ratingSteps } from
'../../data/filters';
import { durations } from '../../data/search';
import type { Duration } from '../../types/booking';

export type SortDirection = 'asc' | 'desc' | null;

export interface Filters {
  tags: string[];
  areas: string[];
  ratingMin: number | null;
  ratingSort: SortDirection;
  priceSort: SortDirection;
  collections: string[];
  chains: string[];
  businessOnly: boolean;
}

export const emptyFilters: Filters = {
  tags: [],
  areas: [],
  ratingMin: null,
  ratingSort: null,
  priceSort: null,
  collections: [],
  chains: [],
  businessOnly: false
};

interface Props {
  filters: Filters;
  onChange: (next: Partial<Filters>) => void;
  duration: Duration;
  onDurationChange: (duration: Duration) => void;
}

function toggle(list: string[], value: string): string[] {
  return list.includes(value) ?
  list.filter((v) => v !== value) :
  [...list, value];
}

function Card({
  title,
  onClear,
  children




}: {title: string;onClear: () => void;children: React.ReactNode;}) {
  return (
    <section className="rounded-2xl border border-line bg-surface p-5">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-[15px] font-bold">{title}</h2>
        <button
          type="button"
          onClick={onClear}
          className="text-sm font-semibold text-accent underline underline-offset-4 transition-opacity duration-150 ease-smooth hover:opacity-70">
          
          Clear
        </button>
      </div>
      <div className="mt-4">{children}</div>
    </section>);

}

function Check({
  checked,
  onChange,
  label,
  description





}: {checked: boolean;onChange: () => void;label: string;description?: string;}) {
  return (
    <label className="flex cursor-pointer items-start gap-3 py-1.5">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="mt-0.5 h-[18px] w-[18px] shrink-0 rounded border-line accent-primary" />
      
      <span>
        <span className="block text-sm">{label}</span>
        {description &&
        <span className="mt-0.5 block text-[13px] leading-relaxed text-muted">
            {description}
          </span>
        }
      </span>
    </label>);

}

export function FilterSidebar({
  filters,
  onChange,
  duration,
  onDurationChange
}: Props) {
  const [areaQuery, setAreaQuery] = useState('');
  const visibleAreas = chennaiAreas.filter((a) =>
  a.toLowerCase().includes(areaQuery.trim().toLowerCase())
  );

  return (
    <div className="space-y-4">
      <Card title="Popular Tags" onClear={() => onChange({ tags: [] })}>
        <div className="flex flex-wrap gap-2">
          {popularTags.map((tag) => {
            const active = filters.tags.includes(tag);
            return (
              <button
                key={tag}
                type="button"
                aria-pressed={active}
                onClick={() => onChange({ tags: toggle(filters.tags, tag) })}
                className={`rounded-xl border px-3.5 py-2.5 text-[13px] transition-colors duration-150 ease-smooth ${
                active ?
                'border-primary bg-primary-soft font-semibold text-ink' :
                'border-line text-muted hover:border-ink hover:text-ink'}`
                }>
                
                {tag}
              </button>);

          })}
        </div>
      </Card>

      <Card title="Areas" onClear={() => onChange({ areas: [] })}>
        <div className="flex items-center gap-2 border-b border-line pb-2">
          <SearchIcon className="h-4 w-4 text-muted" aria-hidden="true" />
          <input
            value={areaQuery}
            onChange={(e) => setAreaQuery(e.target.value)}
            placeholder="Search areas in Chennai"
            aria-label="Search areas"
            className="w-full bg-transparent text-sm outline-none placeholder:text-muted" />
          
        </div>
        <div className="mt-3 max-h-60 overflow-y-auto pr-2">
          {visibleAreas.map((area) =>
          <Check
            key={area}
            label={area}
            checked={filters.areas.includes(area)}
            onChange={() => onChange({ areas: toggle(filters.areas, area) })} />

          )}
          {visibleAreas.length === 0 &&
          <p className="py-2 text-sm text-muted">No areas match “{areaQuery}”</p>
          }
        </div>
      </Card>

      <Card title="Price" onClear={() => onChange({ priceSort: null })}>
        <div className="flex flex-wrap gap-4">
          {durations.map((d) =>
          <label
            key={d.value}
            className="flex cursor-pointer items-center gap-2 text-sm font-semibold">
            
              <input
              type="checkbox"
              checked={duration === d.value}
              onChange={() => onDurationChange(d.value)}
              className="h-[18px] w-[18px] rounded border-line accent-primary" />
            
              {d.value} Hrs
            </label>
          )}
        </div>

        <p className="mt-5 text-[13px] text-muted">Sort by price</p>
        <div className="mt-2 flex justify-between gap-4">
          <Check
            label="Low to High"
            checked={filters.priceSort === 'asc'}
            onChange={() =>
            onChange({ priceSort: filters.priceSort === 'asc' ? null : 'asc' })
            } />
          
          <Check
            label="High to Low"
            checked={filters.priceSort === 'desc'}
            onChange={() =>
            onChange({
              priceSort: filters.priceSort === 'desc' ? null : 'desc'
            })
            } />
          
        </div>
      </Card>

      <Card
        title="Customer Ratings"
        onClear={() => onChange({ ratingMin: null, ratingSort: null })}>
        
        <div className="grid grid-cols-4 gap-2">
          {ratingSteps.map((step) => {
            const active = filters.ratingMin === step;
            return (
              <button
                key={step}
                type="button"
                aria-pressed={active}
                onClick={() =>
                onChange({ ratingMin: active ? null : step })
                }
                className={`flex items-center justify-center gap-1 rounded-xl border py-2.5 text-sm font-bold transition-colors duration-150 ease-smooth ${
                active ?
                'border-primary bg-primary-soft text-ink' :
                'border-line text-ink hover:border-ink'}`
                }>
                
                <StarIcon
                  className="h-3.5 w-3.5 fill-primary text-primary"
                  aria-hidden="true" />
                
                {step}+
              </button>);

          })}
        </div>

        <p className="mt-5 text-[13px] text-muted">Sort ratings by</p>
        <div className="mt-2 flex justify-between gap-4">
          <Check
            label="Low to High"
            checked={filters.ratingSort === 'asc'}
            onChange={() =>
            onChange({
              ratingSort: filters.ratingSort === 'asc' ? null : 'asc'
            })
            } />
          
          <Check
            label="High to Low"
            checked={filters.ratingSort === 'desc'}
            onChange={() =>
            onChange({
              ratingSort: filters.ratingSort === 'desc' ? null : 'desc'
            })
            } />
          
        </div>
      </Card>

      <Card title="Collections" onClear={() => onChange({ collections: [] })}>
        {collections.map((collection) =>
        <Check
          key={collection.id}
          label={collection.label}
          description={collection.body}
          checked={filters.collections.includes(collection.id)}
          onChange={() =>
          onChange({ collections: toggle(filters.collections, collection.id) })
          } />

        )}
      </Card>

      <Card title="Hotel Chains" onClear={() => onChange({ chains: [] })}>
        {hotelChains.map((chain) =>
        <Check
          key={chain}
          label={chain}
          checked={filters.chains.includes(chain)}
          onChange={() => onChange({ chains: toggle(filters.chains, chain) })} />

        )}
      </Card>

      <Card
        title="Business Hotels"
        onClear={() => onChange({ businessOnly: false })}>
        
        <Check
          label="Show business hotels"
          description="Hotels with amenities suitable for working professionals."
          checked={filters.businessOnly}
          onChange={() => onChange({ businessOnly: !filters.businessOnly })} />
        
      </Card>

      <div className="px-1 pb-4">
        <ul className="space-y-3">
          {bookingNotes.map((note) =>
          <li key={note} className="flex gap-2 text-[13px] leading-relaxed text-muted">
              <span aria-hidden="true">·</span>
              {note}
            </li>
          )}
        </ul>
        <ul className="mt-4 flex gap-5 text-muted">
          <li>
            <WifiIcon className="h-5 w-5" aria-label="Wi-Fi" />
          </li>
          <li>
            <AirVentIcon className="h-5 w-5" aria-label="Air conditioning" />
          </li>
          <li>
            <TvIcon className="h-5 w-5" aria-label="Television" />
          </li>
          <li>
            <GlassWaterIcon className="h-5 w-5" aria-label="Drinking water" />
          </li>
        </ul>
      </div>
    </div>);

}