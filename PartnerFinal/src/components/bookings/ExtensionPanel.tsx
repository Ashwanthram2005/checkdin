import React, { useState } from 'react';
import {
  AlertTriangleIcon,
  ArrowRightIcon,
  CheckIcon,
  CircleCheckBigIcon,
  ClockIcon,
  GaugeIcon,
  XIcon } from
'lucide-react';
import { ExtensionBadge } from './ExtensionBadge';
import { ExtensionCountdown } from './ExtensionCountdown';
import { inr } from '../../utils/gst';
import { rejectionReasons, type Booking } from '../../data/bookings';

type ExtensionPanelProps = {
  booking: Booking;
  onApprove: (booking: Booking) => void;
  onReject: (booking: Booking, reason: string) => void;
  onExpire: (id: string) => void;
};

export function ExtensionPanel({ booking, onApprove, onReject, onExpire }: ExtensionPanelProps) {
  const extension = booking.extension;
  const [rejecting, setRejecting] = useState(false);
  const [reason, setReason] = useState<string>(rejectionReasons[0]);

  if (!extension) return null;

  const pending = extension.state === 'Pending Approval';
  const tight = !extension.capacity.available;

  return (
    <section className="rounded-xl border border-orange-200 bg-orange-50/50 p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-[13px] font-semibold text-ink">Extension request</h3>
        <ExtensionBadge state={extension.state} extraHours={extension.extraHours} />
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-3 rounded-xl bg-white px-4 py-3">
        <span>
          <span className="block text-[11.5px] text-ink-muted">Current checkout</span>
          <span className="mt-0.5 block text-[14.5px] font-semibold text-ink">
            {extension.currentCheckout}
          </span>
        </span>
        <ArrowRightIcon size={15} className="text-ink-muted" aria-hidden="true" />
        <span className="flex items-center gap-1.5 rounded-lg bg-ink px-2.5 py-1.5 text-[12px] font-semibold text-lime-300">
          <ClockIcon size={12} aria-hidden="true" />+{extension.extraHours} hours
        </span>
        <ArrowRightIcon size={15} className="text-ink-muted" aria-hidden="true" />
        <span>
          <span className="block text-[11.5px] text-ink-muted">Requested checkout</span>
          <span className="mt-0.5 block text-[14.5px] font-semibold text-ink">
            {extension.requestedCheckout}
          </span>
        </span>
        <span className="ml-auto text-right">
          <span className="block text-[11.5px] text-ink-muted">Additional revenue</span>
          <span className="mt-0.5 block text-[16px] font-bold tracking-tight text-forest">
            {inr(extension.additionalRevenue)}
          </span>
        </span>
      </div>

      <p className="mt-2 text-[11.5px] text-ink-muted">
        Request created {extension.requestedAt}
      </p>

      <div
        className={[
        'mt-3 flex items-start gap-2.5 rounded-xl border px-4 py-3',
        tight ? 'border-amber-200 bg-amber-50' : 'border-lime-200 bg-lime-50'].
        join(' ')}>
        
        {tight ?
        <AlertTriangleIcon size={15} className="mt-0.5 shrink-0 text-amber-600" aria-hidden="true" /> :

        <CircleCheckBigIcon size={15} className="mt-0.5 shrink-0 text-lime-600" aria-hidden="true" />
        }
        <span>
          <span className="flex items-center gap-1.5 text-[11px] font-bold tracking-wide text-ink-muted">
            <GaugeIcon size={12} aria-hidden="true" />
            OPERATIONAL CAPACITY
          </span>
          <span className="mt-0.5 block text-[13px] font-medium text-ink">
            {tight ? 'Capacity is tight in this window' : 'Capacity available for this extension'}
          </span>
          <span className="mt-0.5 block text-[12px] text-ink-soft">{extension.capacity.note}</span>
        </span>
      </div>

      {pending ?
      <div className="mt-3 space-y-3">
          <ExtensionCountdown
          seconds={extension.respondWithin}
          onExpire={() => onExpire(booking.id)} />
        

          {rejecting ?
        <div className="rounded-xl border border-neutral-200 bg-white p-3.5">
              <label
            htmlFor={`reason-${booking.id}`}
            className="text-[12.5px] font-medium text-ink-soft">
            
                Rejection reason
              </label>
              <select
            id={`reason-${booking.id}`}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="mt-1.5 w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-[13px] text-ink outline-none transition-colors duration-150 ease-out hover:border-neutral-300 focus:border-lime-500">
            
                {rejectionReasons.map((item) =>
            <option key={item}>{item}</option>
            )}
              </select>
              <div className="mt-3 flex gap-2">
                <button
              type="button"
              onClick={() => {
                onReject(booking, reason);
                setRejecting(false);
              }}
              className="flex-1 rounded-lg bg-red-600 py-2.5 text-[13px] font-semibold text-white transition-colors duration-150 ease-out hover:bg-red-500">
              
                  Submit rejection
                </button>
                <button
              type="button"
              onClick={() => setRejecting(false)}
              className="rounded-lg border border-neutral-200 px-3.5 py-2.5 text-[13px] font-medium text-ink transition-colors duration-150 ease-out hover:border-neutral-300">
              
                  Cancel
                </button>
              </div>
            </div> :

        <div className="flex gap-2">
              <button
            type="button"
            disabled={tight}
            title={tight ? 'Capacity is unavailable for this window' : undefined}
            onClick={() => onApprove(booking)}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-forest py-2.5 text-[13px] font-semibold text-white transition-colors duration-150 ease-out hover:bg-forest/90 disabled:cursor-not-allowed disabled:bg-neutral-200 disabled:text-ink-muted">
            
                <CheckIcon size={15} aria-hidden="true" />
                Approve Extension
              </button>
              <button
            type="button"
            onClick={() => setRejecting(true)}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-red-200 bg-red-50 py-2.5 text-[13px] font-semibold text-red-600 transition-colors duration-150 ease-out hover:bg-red-100">
            
                <XIcon size={15} aria-hidden="true" />
                Reject Extension
              </button>
            </div>
        }
        </div> :

      <p className="mt-3 rounded-xl bg-white px-4 py-3 text-[12.5px] leading-relaxed text-ink-soft">
          {extension.state === 'Approved' ?
        `Extension approved — checkout updated to ${extension.requestedCheckout} and confirmed to ${booking.guest}.` :
        extension.state === 'Rejected' ?
        `Extension rejected${extension.rejectionReason ? ` — ${extension.rejectionReason}` : ''}. Checkout stays at ${extension.currentCheckout}.` :
        `Request expired without a response. Checkout stays at ${extension.currentCheckout}.`}
        </p>
      }
    </section>);

}