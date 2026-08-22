import React from 'react';
import { LockIcon, MapPinIcon } from 'lucide-react';

interface Props {
  area: string;
  landmark: string;
}

/** A stylised, deliberately imprecise map. The real address unlocks after booking. */
export function LockedMap({ area, landmark }: Props) {
  return (
    <div className="relative h-60 overflow-hidden rounded-2xl border border-line bg-[#e9edd9]">
      {/* Fake streets and blocks, blurred so nothing is legible */}
      <div className="absolute inset-0 blur-[2px]" aria-hidden="true">
        <div className="absolute left-0 right-0 top-[28%] h-3 bg-surface" />
        <div className="absolute left-0 right-0 top-[62%] h-5 bg-surface" />
        <div className="absolute bottom-0 left-[22%] top-0 w-4 bg-surface" />
        <div className="absolute bottom-0 left-[68%] top-0 w-2.5 bg-surface" />
        <div className="absolute left-[8%] top-[6%] h-14 w-24 rounded bg-[#dfe6cb]" />
        <div className="absolute left-[34%] top-[36%] h-16 w-28 rounded bg-[#dfe6cb]" />
        <div className="absolute bottom-[6%] right-[10%] h-16 w-32 rounded bg-[#dfe6cb]" />
        <div className="absolute bottom-[8%] left-[6%] h-12 w-20 rounded bg-[#cfe0c0]" />
        <div className="absolute right-[6%] top-[8%] h-12 w-16 rounded bg-[#cfe0c0]" />
      </div>

      {/* Approximate pin */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/30">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-ink text-primary">
            <MapPinIcon className="h-5 w-5" aria-hidden="true" />
          </span>
        </span>
      </div>

      {/* Lock badge */}
      <div className="absolute inset-x-0 bottom-0 flex items-center gap-2.5 bg-surface/95 px-5 py-3.5">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-soft">
          <LockIcon className="h-4 w-4" aria-hidden="true" />
        </span>
        <p className="text-sm">
          <span className="font-bold">Approximate location only</span> —{' '}
          {area}, near {landmark}
        </p>
      </div>
    </div>);

}