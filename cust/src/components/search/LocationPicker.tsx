import { useEffect, useMemo, useRef, useState } from 'react';
import { MapPinIcon } from 'lucide-react';
import { chennaiAreas, upcomingCities } from '../../data/filters';
import { loadHotels } from '../../data/hotels';

type OptionType = 'City' | 'Area' | 'Property';

interface Option {
  label: string;
  type: OptionType;
  soon?: boolean;
}

const soonOptions: Option[] = upcomingCities.map((city) => ({
  label: city,
  type: 'City' as const,
  soon: true
}));

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export function LocationPicker({ value, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const wrapRef = useRef<HTMLDivElement>(null);
  const [liveOptions, setLiveOptions] = useState<Option[]>([
    { label: 'Chennai', type: 'City' },
    ...chennaiAreas.map((area) => ({
      label: `${area}, Chennai`,
      type: 'Area' as const
    })),
  ]);

  useEffect(() => {
    loadHotels({ limit: 50 }).then(({ hotels }) => {
      const propertyOptions: Option[] = hotels.map((hotel) => ({
        label: `${hotel.name}, ${hotel.area}`,
        type: 'Property' as const
      }));
      setLiveOptions([
        { label: 'Chennai', type: 'City' },
        ...chennaiAreas.map((area) => ({
          label: `${area}, Chennai`,
          type: 'Area' as const
        })),
        ...propertyOptions,
      ]);
    });
  }, []);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  const q = query.trim().toLowerCase();
  const live = useMemo(
    () => q ? liveOptions.filter((o) => o.label.toLowerCase().includes(q)) : liveOptions,
    [q, liveOptions]
  );
  const soon = useMemo(
    () => q ? soonOptions.filter((o) => o.label.toLowerCase().includes(q)) : soonOptions,
    [q]
  );

  function select(option: Option) {
    onChange(option.label);
    setQuery('');
    setOpen(false);
  }

  return (
    <div ref={wrapRef} className="relative">
      <label htmlFor="where" className="block text-[13px] font-medium text-muted">
        Where ?
      </label>
      <div className="mt-1.5 flex items-center gap-2">
        <MapPinIcon className="h-4 w-4 shrink-0 text-muted" aria-hidden="true" />
        <input
          id="where"
          role="combobox"
          aria-expanded={open}
          aria-controls="where-options"
          autoComplete="off"
          value={open ? query : value}
          onFocus={() => setOpen(true)}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Escape') setOpen(false);
            if (e.key === 'Enter' && open && live.length) {
              e.preventDefault();
              select(live[0]);
            }
          }}
          placeholder="Select City, Area or Property"
          className="w-full bg-transparent text-sm font-bold text-ink outline-none placeholder:font-bold placeholder:text-ink" />
        
      </div>

      {open &&
      <div
        id="where-options"
        className="absolute left-0 top-full z-30 mt-3 max-h-80 w-[360px] max-w-[90vw] overflow-y-auto rounded-2xl border border-line bg-surface py-2 text-ink shadow-lift">
        
          <ul role="listbox" aria-label="Locations">
            {live.map((option) =>
          <li key={`${option.type}-${option.label}`}>
                <button
              type="button"
              role="option"
              aria-selected={value === option.label}
              onClick={() => select(option)}
              className="flex w-full items-center justify-between gap-4 px-4 py-2.5 text-left transition-colors duration-150 ease-smooth hover:bg-canvas">
              
                  <span className="text-sm text-ink">{option.label}</span>
                  <span className="shrink-0 text-xs text-muted">{option.type}</span>
                </button>
              </li>
          )}
            {live.length === 0 &&
          <li className="px-4 py-3 text-sm text-muted">
                Nothing live matches &ldquo;{query}&rdquo;.
              </li>
          }
          </ul>

          {soon.length > 0 &&
        <div className="mt-2 border-t border-line pt-2">
              <p className="px-4 pb-1 text-[11px] font-bold uppercase tracking-wide text-muted">
                Opening next
              </p>
              <ul aria-label="Cities opening soon">
                {soon.map((option) =>
            <li
              key={option.label}
              className="flex items-center justify-between gap-4 px-4 py-2.5">
              
                    <span className="text-sm text-muted">{option.label}</span>
                    <span className="shrink-0 rounded-md bg-primary-soft px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-ink">
                      Soon
                    </span>
                  </li>
            )}
              </ul>
            </div>
        }
        </div>
      }
    </div>);

}
