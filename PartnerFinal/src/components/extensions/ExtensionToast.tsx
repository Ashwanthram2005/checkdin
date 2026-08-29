import React from 'react';
import { BellRingIcon, XIcon } from 'lucide-react';
import type { ExtensionRequest } from '../../data/extensions';

type ExtensionToastProps = {
  request: ExtensionRequest;
  onView: () => void;
  onDismiss: () => void;
};

export function ExtensionToast({ request, onView, onDismiss }: ExtensionToastProps) {
  return (
    <aside
      role="status"
      className="fixed right-6 top-[84px] z-50 w-[330px] rounded-2xl border border-neutral-200 bg-white/95 p-4 shadow-lg backdrop-blur">
      
      <div className="flex items-start gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-lime-300">
          <BellRingIcon size={17} className="text-ink" aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[13.5px] font-semibold text-ink">New Extension Request Received</p>
          <p className="mt-0.5 text-[12.5px] text-ink-soft">
            {request.guest} requests +{request.extraHours}{' '}
            {request.extraHours === 1 ? 'hour' : 'hours'}.
          </p>
          <p className="mt-0.5 text-[12px] text-ink-muted">
            Booking {request.bookingId} • {request.roomType}
          </p>
          <button
            type="button"
            onClick={onView}
            className="mt-2.5 rounded-lg bg-ink px-3 py-1.5 text-[12px] font-semibold text-white transition-colors duration-150 ease-out hover:bg-ink-soft">
            
            Review request
          </button>
        </div>
        <button
          type="button"
          aria-label="Dismiss notification"
          onClick={onDismiss}
          className="rounded-md p-1 text-ink-muted transition-colors duration-150 ease-out hover:bg-neutral-100 hover:text-ink">
          
          <XIcon size={15} aria-hidden="true" />
        </button>
      </div>
    </aside>);

}