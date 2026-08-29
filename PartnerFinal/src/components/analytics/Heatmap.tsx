import React from 'react';

type HeatmapProps = {
  rows: {day: string;values: number[];}[];
  bands: string[];
  max?: number;
  label: string;
  formatValue?: (value: number) => string;
};

export function Heatmap({ rows, bands, max, label, formatValue }: HeatmapProps) {
  const peak = max ?? Math.max(...rows.flatMap((row) => row.values));

  return (
    <div role="img" aria-label={label}>
      <div
        className="grid gap-1.5"
        style={{ gridTemplateColumns: `48px repeat(${bands.length}, minmax(0, 1fr))` }}>
        
        <span />
        {bands.map((band) =>
        <span key={band} className="text-center text-[10.5px] text-ink-muted">
            {band}
          </span>
        )}

        {rows.map((row) =>
        <React.Fragment key={row.day}>
            <span className="flex items-center text-[11.5px] font-medium text-ink-soft">
              {row.day}
            </span>
            {row.values.map((value, index) => {
            const intensity = Math.max(0.08, value / peak);
            return (
              <span
                key={`${row.day}-${index}`}
                title={`${row.day} ${bands[index]} — ${formatValue ? formatValue(value) : value}`}
                className="flex h-8 items-center justify-center rounded-md text-[11px] font-semibold"
                style={{
                  backgroundColor: `rgba(184, 207, 18, ${intensity})`,
                  color: intensity > 0.55 ? '#0D0D0D' : '#5A5A5A'
                }}>
                
                  {formatValue ? formatValue(value) : value}
                </span>);

          })}
          </React.Fragment>
        )}
      </div>

      <div className="mt-3 flex items-center gap-2">
        <span className="text-[11px] text-ink-muted">Low</span>
        <span className="h-1.5 flex-1 rounded-full bg-gradient-to-r from-lime-50 to-lime-500" />
        <span className="text-[11px] text-ink-muted">High</span>
      </div>
    </div>);

}