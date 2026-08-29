import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  BanIcon,
  CheckIcon,
  DownloadIcon,
  LogInIcon,
  LogOutIcon,
  MailIcon,
  MessageCircleIcon,
  PhoneIcon,
  PrinterIcon,
  XIcon } from
'lucide-react';
import { BookingStatusBadge, PaymentStatusBadge } from './BookingBadges';
import { ApprovalCountdown } from './ApprovalCountdown';
import { ExtensionBadge } from './ExtensionBadge';
import { ExtensionPanel } from './ExtensionPanel';
import type { BookingAction } from './BookingActionsMenu';
import { inr } from '../../utils/gst';
import { slotLabel, type Booking, type BookingStatus } from '../../data/bookings';

const flow: BookingStatus[] = ['Pending Approval', 'Confirmed', 'Checked In', 'Checked Out'];

type BookingDetailsDrawerProps = {
  booking: Booking | null;
  onClose: () => void;
  onAction: (action: BookingAction, booking: Booking) => void;
  onSaveNote: (id: string, note: string) => void;
  onExpire: (id: string) => void;
  onApproveExtension: (booking: Booking) => void;
  onRejectExtension: (booking: Booking, reason: string) => void;
  onExtensionExpire: (id: string) => void;
};

function Row({ label, value }: {label: string;value: React.ReactNode;}) {
  return (
    <div className="flex items-start justify-between gap-4 py-2">
      <dt className="text-[12.5px] text-ink-muted">{label}</dt>
      <dd className="max-w-[60%] text-right text-[13px] font-medium text-ink">{value}</dd>
    </div>);

}

function Section({ title, children }: {title: string;children: React.ReactNode;}) {
  return (
    <section className="rounded-xl border border-neutral-200/80 p-4">
      <h3 className="text-[13px] font-semibold text-ink">{title}</h3>
      <div className="mt-2">{children}</div>
    </section>);

}

export function BookingDetailsDrawer({
  booking,
  onClose,
  onAction,
  onSaveNote,
  onExpire,
  onApproveExtension,
  onRejectExtension,
  onExtensionExpire
}: BookingDetailsDrawerProps) {
  const [note, setNote] = useState('');

  useEffect(() => {
    setNote(booking?.internalNote ?? '');
  }, [booking]);

  useEffect(() => {
    const handle = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handle);
    return () => document.removeEventListener('keydown', handle);
  }, [onClose]);

  const activeIndex = booking ? flow.indexOf(booking.status) : -1;

  return (
    <AnimatePresence>
      {booking &&
      <>
          <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
          onClick={onClose}
          className="fixed inset-0 z-40 bg-ink/40" />
        
          <motion.aside
          role="dialog"
          aria-modal="true"
          aria-label={`Booking ${booking.id} details`}
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ duration: 0.28, ease: [0.23, 1, 0.32, 1] }}
          className="fixed right-0 top-0 z-50 flex h-full w-full max-w-[520px] flex-col bg-white shadow-2xl">
          
            <header className="flex items-start justify-between gap-4 border-b border-neutral-200 px-5 py-4">
              <div>
                <p className="text-[12px] text-ink-muted">Booking</p>
                <h2 className="text-[20px] font-bold tracking-tight text-ink">#{booking.id}</h2>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <BookingStatusBadge status={booking.status} />
                  <PaymentStatusBadge status={booking.paymentStatus} />
                  {booking.status === 'Pending Approval' && booking.approvalSeconds !== null &&
                <ApprovalCountdown
                  seconds={booking.approvalSeconds}
                  onExpire={() => onExpire(booking.id)} />

                }
                  {booking.extension &&
                <ExtensionBadge
                  state={booking.extension.state}
                  extraHours={booking.extension.extraHours} />

                }
                </div>
              </div>
              <button
              type="button"
              aria-label="Close booking details"
              onClick={onClose}
              className="rounded-lg p-2 text-ink-muted transition-colors duration-150 ease-out hover:bg-neutral-100 hover:text-ink">
              
                <XIcon size={18} aria-hidden="true" />
              </button>
            </header>

            <div className="scroll-slim flex-1 space-y-4 overflow-y-auto px-5 py-4">
              <ol className="flex items-center gap-1" aria-label="Status flow">
                {flow.map((step, i) => {
                const reached = activeIndex >= i && activeIndex !== -1;
                return (
                  <li key={step} className="flex flex-1 flex-col gap-1.5">
                      <span
                      className={`h-1.5 rounded-full ${reached ? 'bg-lime-400' : 'bg-neutral-200'}`} />
                    
                      <span
                      className={`text-[11px] ${reached ? 'font-semibold text-ink' : 'text-ink-muted'}`}>
                      
                        {step}
                      </span>
                    </li>);

              })}
              </ol>
              {activeIndex === -1 &&
            <p className="rounded-lg bg-red-50 px-3 py-2 text-[12.5px] font-medium text-red-600">
                  This booking left the standard flow — current status: {booking.status}.
                </p>
            }

              {booking.extension &&
            <ExtensionPanel
              booking={booking}
              onApprove={onApproveExtension}
              onReject={onRejectExtension}
              onExpire={onExtensionExpire} />

            }

              <Section title="Guest information">
                <dl className="divide-y divide-neutral-100">
                  <Row label="Name" value={booking.guest} />
                  <Row
                  label="Guests"
                  value={`${booking.guests.adults} adults, ${booking.guests.children} children`} />
                
                  <Row label="ID proof" value={booking.idProof} />
                </dl>
              </Section>

              <Section title="Contact details">
                <dl className="divide-y divide-neutral-100">
                  <Row label="Phone" value={booking.phone} />
                  <Row label="Email" value={booking.email} />
                </dl>
                <div className="mt-3 flex gap-2">
                  <button
                  type="button"
                  onClick={() => onAction('call', booking)}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-neutral-200 py-2 text-[12.5px] font-medium text-ink transition-colors duration-150 ease-out hover:border-neutral-300">
                  
                    <PhoneIcon size={13} aria-hidden="true" />
                    Call
                  </button>
                  <button
                  type="button"
                  onClick={() => onAction('whatsapp', booking)}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-neutral-200 py-2 text-[12.5px] font-medium text-ink transition-colors duration-150 ease-out hover:border-neutral-300">
                  
                    <MessageCircleIcon size={13} aria-hidden="true" />
                    WhatsApp
                  </button>
                  <a
                  href={`mailto:${booking.email}`}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-neutral-200 py-2 text-[12.5px] font-medium text-ink transition-colors duration-150 ease-out hover:border-neutral-300">
                  
                    <MailIcon size={13} aria-hidden="true" />
                    Email
                  </a>
                </div>
              </Section>

              <Section title="Booking information">
                <dl className="divide-y divide-neutral-100">
                  <Row label="Slot category" value={slotLabel(booking.room)} />
                  <Row label="Booking source" value={booking.source ?? 'Checkdin App'} />
                  <Row label="Booked on" value={booking.bookedOn} />
                </dl>
              </Section>

              <Section title="Stay duration">
                <dl className="divide-y divide-neutral-100">
                  <Row label="Date" value={booking.checkInDate} />
                  <Row
                  label="Slot"
                  value={`${booking.checkInTime} → ${booking.checkOutTime}`} />
                
                  <Row label="Duration" value={booking.duration} />
                  {booking.extension?.state === 'Approved' &&
                <Row
                  label="Updated checkout"
                  value={`${booking.extension.requestedCheckout} (+${booking.extension.extraHours}h)`} />

                }
                </dl>
              </Section>

              <Section title="Payment details">
                <dl className="divide-y divide-neutral-100">
                  <Row label="Base amount" value={inr(booking.baseAmount)} />
                  <Row
                  label="GST"
                  value={booking.gstAmount === 0 ? 'Exempt (0%)' : inr(booking.gstAmount)} />
                
                  <Row label="Total paid by guest" value={inr(booking.total)} />
                  <Row label="Method" value={booking.paymentMethod} />
                </dl>
              </Section>

              <Section title="Booking timeline">
                <ol className="space-y-3">
                  {booking.timeline.map((entry) =>
                <li key={entry.id} className="flex items-start gap-3">
                      <span
                    className={[
                    'mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full',
                    entry.done ? 'bg-lime-400 text-ink' : 'border border-neutral-300'].
                    join(' ')}>
                    
                        {entry.done && <CheckIcon size={10} aria-hidden="true" />}
                      </span>
                      <span className="min-w-0">
                        <span className="block text-[13px] font-medium text-ink">{entry.label}</span>
                        <span className="block text-[11.5px] text-ink-muted">{entry.time}</span>
                      </span>
                    </li>
                )}
                </ol>
              </Section>

              <Section title="Special requests">
                <p className="text-[13px] leading-relaxed text-ink-soft">
                  {booking.specialRequests || 'No special requests from this guest.'}
                </p>
              </Section>

              <Section title="Internal notes">
                <label htmlFor="internalNote" className="sr-only">
                  Internal note
                </label>
                <textarea
                id="internalNote"
                rows={3}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Visible to your staff only…"
                className="w-full resize-y rounded-xl border border-neutral-200 px-3.5 py-2.5 text-[13px] text-ink outline-none transition-colors duration-150 ease-out placeholder:text-neutral-400 hover:border-neutral-300 focus:border-lime-500" />
              
                <button
                type="button"
                onClick={() => onSaveNote(booking.id, note)}
                className="mt-2 rounded-lg border border-neutral-200 px-3.5 py-1.5 text-[12.5px] font-medium text-ink transition-colors duration-150 ease-out hover:border-neutral-300">
                
                  Save note
                </button>
              </Section>
            </div>

            <footer className="border-t border-neutral-200 px-5 py-4">
              <div className="flex flex-wrap gap-2">
                {booking.status === 'Pending Approval' &&
              <>
                    <button
                  type="button"
                  onClick={() => onAction('accept', booking)}
                  className="flex items-center gap-1.5 rounded-xl bg-lime-300 px-4 py-2.5 text-[13px] font-semibold text-ink transition-colors duration-150 ease-out hover:bg-lime-200">
                  
                      <CheckIcon size={15} aria-hidden="true" />
                      Accept booking
                    </button>
                    <button
                  type="button"
                  onClick={() => onAction('reject', booking)}
                  className="flex items-center gap-1.5 rounded-xl border border-neutral-200 px-4 py-2.5 text-[13px] font-medium text-red-600 transition-colors duration-150 ease-out hover:border-red-300 hover:bg-red-50">
                  
                      <XIcon size={15} aria-hidden="true" />
                      Reject
                    </button>
                  </>
              }
                {booking.status === 'Confirmed' &&
              <>
                    <button
                  type="button"
                  onClick={() => onAction('checkin', booking)}
                  className="flex items-center gap-1.5 rounded-xl bg-lime-300 px-4 py-2.5 text-[13px] font-semibold text-ink transition-colors duration-150 ease-out hover:bg-lime-200">
                  
                      <LogInIcon size={15} aria-hidden="true" />
                      Check in
                    </button>
                    <button
                  type="button"
                  onClick={() => onAction('cancel', booking)}
                  className="flex items-center gap-1.5 rounded-xl border border-neutral-200 px-4 py-2.5 text-[13px] font-medium text-red-600 transition-colors duration-150 ease-out hover:border-red-300 hover:bg-red-50">
                  
                      <BanIcon size={15} aria-hidden="true" />
                      Cancel
                    </button>
                  </>
              }
                {booking.status === 'Checked In' &&
              <button
                type="button"
                onClick={() => onAction('checkout', booking)}
                className="flex items-center gap-1.5 rounded-xl bg-lime-300 px-4 py-2.5 text-[13px] font-semibold text-ink transition-colors duration-150 ease-out hover:bg-lime-200">
                
                    <LogOutIcon size={15} aria-hidden="true" />
                    Check out
                  </button>
              }
                <button
                type="button"
                onClick={() => window.print()}
                className="flex items-center gap-1.5 rounded-xl border border-neutral-200 px-4 py-2.5 text-[13px] font-medium text-ink transition-colors duration-150 ease-out hover:border-neutral-300">
                
                  <PrinterIcon size={15} aria-hidden="true" />
                  Print
                </button>
                <button
                type="button"
                onClick={() => onAction('invoice', booking)}
                className="flex items-center gap-1.5 rounded-xl border border-neutral-200 px-4 py-2.5 text-[13px] font-medium text-ink transition-colors duration-150 ease-out hover:border-neutral-300">
                
                  <DownloadIcon size={15} aria-hidden="true" />
                  Invoice
                </button>
              </div>
            </footer>
          </motion.aside>
        </>
      }
    </AnimatePresence>);

}