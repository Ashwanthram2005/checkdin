import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
  BuildingIcon,
  CheckIcon,
  ClockIcon,
  HourglassIcon,
  PlusIcon } from
'lucide-react';
import type { Hotel } from '../../types/booking';
import { checkoutTime, inr } from '../../utils/format';

type Phase = 'idle' | 'pending' | 'approved';

const extensionHours = [1, 2, 3, 6, 9] as const;
type ExtensionHours = (typeof extensionHours)[number];

/** The hotel has five minutes to answer before the request lapses. */
const WINDOW_SECONDS = 300;
const ease = [0.23, 1, 0.32, 1] as const;

interface Props {
  hotel: Hotel;
  checkIn: string;
  duration: number;
}

function mmss(total: number): string {
  const m = Math.floor(Math.max(0, total) / 60);
  const s = Math.max(0, total) % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export function ExtendStay({ hotel, checkIn, duration }: Props) {
  const reduceMotion = useReducedMotion();
  const [phase, setPhase] = useState<Phase>('idle');
  const [hours, setHours] = useState<ExtensionHours>(3);
  const [secondsLeft, setSecondsLeft] = useState(WINDOW_SECONDS);
  const approvedAt = useRef<number | null>(null);

  const hourlyRate = useMemo(
    () => Math.round(hotel.rates[3] / 3 / 10) * 10,
    [hotel.rates]
  );

  useEffect(() => {
    if (phase !== 'pending') return;
    const tick = window.setInterval(() => {
      setSecondsLeft((s) => s <= 1 ? 0 : s - 1);
    }, 1000);
    // The property replies from its dashboard — simulated here.
    const reply = window.setTimeout(() => {
      approvedAt.current = Date.now();
      setPhase('approved');
    }, 6000);
    return () => {
      window.clearInterval(tick);
      window.clearTimeout(reply);
    };
  }, [phase]);

  const previousCheckout = checkoutTime(checkIn, duration);
  const newCheckout = checkoutTime(checkIn, duration + hours);
  const amount = hourlyRate * hours;

  return (
    <section
      aria-labelledby="extend-heading"
      className="mt-8 overflow-hidden rounded-3xl border border-line bg-surface shadow-card">
      
      <AnimatePresence mode="wait" initial={false}>
        {/* ── Idle: pick a block ─────────────────────────────── */}
        {phase === 'idle' &&
        <motion.div
          key="idle"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: reduceMotion ? 0 : 0.22, ease }}
          className="p-6 sm:p-7">
          
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h2 id="extend-heading" className="font-display text-2xl">
                  Need more time?
                </h2>
                <p className="mt-1.5 text-sm text-muted">
                  Extend your stay instantly — {inr(hourlyRate)} an hour, added to
                  this booking. No new check-in, no new OTP.
                </p>
              </div>
              <p className="rounded-lg bg-canvas px-3 py-2 text-sm">
                Checking out{' '}
                <span className="font-bold">{previousCheckout}</span>
              </p>
            </div>

            <div
            role="radiogroup"
            aria-label="Extra hours"
            className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-5">
            
              {extensionHours.map((h) => {
              const active = h === hours;
              return (
                <button
                  key={h}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  onClick={() => setHours(h)}
                  className={`rounded-2xl border px-4 py-4 text-left transition-colors duration-150 ease-smooth ${
                  active ?
                  'border-ink bg-primary-soft' :
                  'border-line hover:border-ink'}`
                  }>
                  
                    <span className="flex items-center gap-1 text-lg font-bold">
                      <PlusIcon className="h-4 w-4" aria-hidden="true" />
                      {h} {h === 1 ? 'Hour' : 'Hours'}
                    </span>
                    <span className="mt-1 block text-xs text-muted">
                      till {checkoutTime(checkIn, duration + h)}
                    </span>
                    <span className="mt-2 block text-sm font-semibold">
                      {inr(hourlyRate * h)}
                    </span>
                  </button>);

            })}
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-5">
              <p className="text-sm text-muted">
                New check-out would be{' '}
                <span className="font-bold text-ink">{newCheckout}</span> ·{' '}
                <span className="font-bold text-ink">{inr(amount)}</span> payable
                at the desk
              </p>
              <button
              type="button"
              onClick={() => {
                setSecondsLeft(WINDOW_SECONDS);
                setPhase('pending');
              }}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-bold text-ink transition-colors duration-150 ease-smooth hover:bg-primary-dark">
              
                <ClockIcon className="h-4 w-4" aria-hidden="true" />
                Request extension
              </button>
            </div>
          </motion.div>
        }

        {/* ── Pending: waiting on the hotel ──────────────────── */}
        {phase === 'pending' &&
        <motion.div
          key="pending"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: reduceMotion ? 0 : 0.22, ease }}
          className="grid gap-8 p-6 sm:p-7 lg:grid-cols-[1fr_auto] lg:items-center">
          
            <div>
              <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-muted">
                <span className="relative flex h-2 w-2" aria-hidden="true">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary-dark opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-primary-dark" />
                </span>
                Awaiting hotel approval
              </p>
              <h2 className="mt-3 font-display text-2xl">Extension request sent</h2>
              <p className="mt-2 max-w-md text-sm leading-relaxed text-muted">
                Your request for <span className="font-bold text-ink">+{hours} hours</span>{' '}
                has been forwarded to {hotel.name} for approval. Please wait while
                the hotel verifies room availability.
              </p>

              <ol className="mt-5 space-y-3 text-sm">
                <li className="flex items-center gap-2.5">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-success text-white">
                    <CheckIcon className="h-3 w-3" aria-hidden="true" />
                  </span>
                  Request sent to the front desk
                </li>
                <li className="flex items-center gap-2.5">
                  <motion.span
                  animate={reduceMotion ? {} : { rotate: 360 }}
                  transition={{ duration: 2.4, repeat: Infinity, ease: 'linear' }}
                  className="flex h-5 w-5 items-center justify-center rounded-full bg-primary-soft">
                  
                    <HourglassIcon className="h-3 w-3" aria-hidden="true" />
                  </motion.span>
                  Front desk checking room availability
                </li>
                <li className="flex items-center gap-2.5 text-muted">
                  <span className="h-5 w-5 rounded-full border border-line" aria-hidden="true" />
                  Slot updated and new check-out issued
                </li>
              </ol>
            </div>

            <div className="flex items-center gap-6 rounded-2xl bg-canvas p-6">
              <span className="relative flex h-16 w-16 shrink-0 items-center justify-center">
                {!reduceMotion &&
              <motion.span
                className="absolute inset-0 rounded-full border-2 border-primary-dark"
                animate={{ scale: [1, 1.35], opacity: [0.6, 0] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut' }}
                aria-hidden="true" />

              }
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-ink text-primary">
                  <BuildingIcon className="h-6 w-6" aria-hidden="true" />
                </span>
              </span>
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-muted">
                  Reply window
                </p>
                <p
                className="mt-1 font-display text-5xl leading-none tabular-nums"
                role="timer"
                aria-live="off">
                
                  {mmss(secondsLeft)}
                </p>
                <p className="mt-2 text-xs text-muted">
                  {secondsLeft > 0 ?
                'No charge if the hotel cannot take it.' :
                'Request lapsed — try a shorter block.'}
                </p>
              </div>
            </div>
          </motion.div>
        }

        {/* ── Approved ───────────────────────────────────────── */}
        {phase === 'approved' &&
        <motion.div
          key="approved"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: reduceMotion ? 0 : 0.24, ease }}>
          
            <div className="flex flex-wrap items-center gap-4 bg-success px-6 py-5 text-white sm:px-7">
              <motion.span
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: reduceMotion ? 0 : 0.2, ease }}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15">
              
                <CheckIcon className="h-5 w-5" aria-hidden="true" />
              </motion.span>
              <div>
                <h2 className="font-display text-2xl leading-tight">
                  Extension confirmed
                </h2>
                <p className="text-sm text-white/85">
                  Your stay has been extended successfully.
                </p>
              </div>
              <p className="ml-auto rounded-full bg-white/15 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wide">
                Approved by hotel
              </p>
            </div>

            <div className="grid gap-px bg-line sm:grid-cols-3">
              <div className="bg-surface px-6 py-5">
                <p className="text-xs uppercase tracking-wide text-muted">
                  Previous check-out
                </p>
                <p className="mt-1 text-xl font-semibold text-muted line-through">
                  {previousCheckout}
                </p>
              </div>
              <div className="bg-surface px-6 py-5">
                <p className="text-xs uppercase tracking-wide text-muted">
                  New check-out
                </p>
                <p className="mt-1 text-xl font-bold text-success">{newCheckout}</p>
              </div>
              <div className="bg-surface px-6 py-5">
                <p className="text-xs uppercase tracking-wide text-muted">
                  Added
                </p>
                <p className="mt-1 text-xl font-semibold">
                  +{hours} {hours === 1 ? 'hour' : 'hours'} · {inr(amount)}
                </p>
                <p className="mt-1 text-xs text-muted">Payable at the desk</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-line px-6 py-5 sm:px-7">
              <p className="text-sm text-muted">
                Same room, same OTP — housekeeping has been told to skip your
                turnover.
              </p>
              <button
              type="button"
              onClick={() => {
                setPhase('idle');
                setSecondsLeft(WINDOW_SECONDS);
              }}
              className="rounded-xl border border-line px-5 py-2.5 text-sm font-semibold transition-colors duration-150 ease-smooth hover:border-ink">
              
                Extend again
              </button>
            </div>
          </motion.div>
        }
      </AnimatePresence>
    </section>);

}