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
import { GuestAvatar } from '../StatusBadge';
import { ExtensionTimer } from './ExtensionTimer';
import { inr } from '../../utils/gst';
import { extensionRejectionReasons, type ExtensionRequest } from '../../data/extensions';

type ExtensionRequestCardProps = {
  request: ExtensionRequest;
  onApprove: (request: ExtensionRequest) => void;
  onReject: (request: ExtensionRequest, reason: string) => void;
  onExpire: (request: ExtensionRequest) => void;
};

export function ExtensionRequestCard({
  request,
  onApprove,
  onReject,
  onExpire
}: ExtensionRequestCardProps) {
  const [rejecting, setRejecting] = useState(false);
  const [reason, setReason] = useState<string>(extensionRejectionReasons[0]);
  const pending = request.status === 'Waiting for Approval';
  const tight = !request.capacity.available;

  return (
    <article className="rounded-2xl border border-neutral-200 bg-white p-5">
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_264px]">
        <div className="min-w-0">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <GuestAvatar name={request.guest} />
              <div className="min-w-0">
                <p className="text-[15px] font-semibold text-ink">{request.guest}</p>
                <p className="mt-0.5 text-[12.5px] text-ink-muted">
                  #{request.bookingId} • {request.roomType}
                </p>
              </div>
            </div>
            <span
              className={[
              'rounded-md px-2.5 py-1 text-[11px] font-semibold',
              pending ?
              'bg-orange-100 text-orange-700' :
              request.status === 'Approved' ?
              'bg-lime-100 text-lime-700' :
              'bg-neutral-100 text-ink-muted'].
              join(' ')}>
              
              {request.status}
            </span>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-3 rounded-2xl bg-neutral-50 px-4 py-3.5">
            <span className="min-w-0">
              <span className="block text-[11.5px] text-ink-muted">Current checkout</span>
              <span className="mt-0.5 block text-[15px] font-semibold text-ink">
                {request.currentCheckout}
              </span>
            </span>

            <span className="flex items-center gap-2">
              <ArrowRightIcon size={16} className="text-ink-muted" aria-hidden="true" />
              <span className="flex items-center gap-1.5 rounded-lg bg-ink px-2.5 py-1.5 text-[12px] font-semibold text-lime-300">
                <ClockIcon size={12} aria-hidden="true" />+{request.extraHours}{' '}
                {request.extraHours === 1 ? 'hour' : 'hours'}
              </span>
              <ArrowRightIcon size={16} className="text-ink-muted" aria-hidden="true" />
            </span>

            <span className="min-w-0">
              <span className="block text-[11.5px] text-ink-muted">Requested checkout</span>
              <span className="mt-0.5 block text-[15px] font-semibold text-ink">
                {request.requestedCheckout}
              </span>
            </span>

            <span className="ml-auto min-w-0 text-right">
              <span className="block text-[11.5px] text-ink-muted">Additional revenue</span>
              <span className="mt-0.5 block text-[17px] font-bold tracking-tight text-forest">
                {inr(request.additionalRevenue)}
              </span>
            </span>
          </div>

          <div
            className={[
            'mt-3 flex items-start gap-2.5 rounded-2xl border px-4 py-3',
            tight ? 'border-amber-200 bg-amber-50' : 'border-lime-200 bg-lime-50'].
            join(' ')}>
            
            {tight ?
            <AlertTriangleIcon
              size={16}
              className="mt-0.5 shrink-0 text-amber-600"
              aria-hidden="true" /> :


            <CircleCheckBigIcon
              size={16}
              className="mt-0.5 shrink-0 text-lime-600"
              aria-hidden="true" />

            }
            <span>
              <span className="flex items-center gap-1.5 text-[11px] font-bold tracking-wide text-ink-muted">
                <GaugeIcon size={12} aria-hidden="true" />
                OPERATIONAL CAPACITY
              </span>
              <span className="mt-0.5 block text-[13.5px] font-medium text-ink">
                {request.capacity.message}
              </span>
              {request.capacity.detail &&
              <span className="mt-0.5 block text-[12px] text-ink-soft">
                  {request.capacity.detail}
                </span>
              }
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {pending ?
          <>
              <ExtensionTimer seconds={request.respondWithin} onExpire={() => onExpire(request)} />

              {rejecting ?
            <div className="rounded-xl border border-neutral-200 p-3.5">
                  <label
                htmlFor={`reason-${request.id}`}
                className="text-[12.5px] font-medium text-ink-soft">
                
                    Rejection reason
                  </label>
                  <select
                id={`reason-${request.id}`}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="mt-1.5 w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-[13px] text-ink outline-none transition-colors duration-150 ease-out hover:border-neutral-300 focus:border-lime-500">
                
                    {extensionRejectionReasons.map((item) =>
                <option key={item}>{item}</option>
                )}
                  </select>
                  <div className="mt-3 flex gap-2">
                    <button
                  type="button"
                  onClick={() => {
                    onReject(request, reason);
                    setRejecting(false);
                  }}
                  className="flex-1 rounded-lg bg-red-600 py-2.5 text-[13px] font-semibold text-white transition-colors duration-150 ease-out hover:bg-red-500">
                  
                      Submit
                    </button>
                    <button
                  type="button"
                  onClick={() => setRejecting(false)}
                  className="rounded-lg border border-neutral-200 px-3 py-2.5 text-[13px] font-medium text-ink transition-colors duration-150 ease-out hover:border-neutral-300">
                  
                      Cancel
                    </button>
                  </div>
                </div> :

            <>
                  <button
                type="button"
                onClick={() => onApprove(request)}
                className="flex items-center justify-center gap-2 rounded-xl bg-forest py-3.5 text-[14px] font-semibold text-white transition-colors duration-150 ease-out hover:bg-forest/90">
                
                    <CheckIcon size={16} aria-hidden="true" />
                    Approve Extension
                  </button>
                  <button
                type="button"
                onClick={() => setRejecting(true)}
                className="flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 py-3.5 text-[14px] font-semibold text-red-600 transition-colors duration-150 ease-out hover:bg-red-100">
                
                    <XIcon size={16} aria-hidden="true" />
                    Reject Extension
                  </button>
                </>
            }
            </> :

          <p className="rounded-2xl bg-neutral-50 px-4 py-4 text-[12.5px] leading-relaxed text-ink-soft">
              {request.status === 'Approved' ?
            `Checkout moved to ${request.requestedCheckout}. Confirmation sent to ${request.guest}.` :
            request.status === 'Rejected' ?
            `Rejection sent to ${request.guest}. Checkout stays at ${request.currentCheckout}.` :
            `The request expired without a response. Checkout stays at ${request.currentCheckout}.`}
            </p>
          }

          <p className="text-center text-[11.5px] text-ink-muted">
            Requested {request.requestedAgo}
          </p>
        </div>
      </div>
    </article>);

}