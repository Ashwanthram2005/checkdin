import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  CalendarPlusIcon,
  CheckIcon,
  KeyRoundIcon,
  MapPinIcon,
  MessageSquareIcon,
  PhoneIcon } from
'lucide-react';
import { useBooking } from '../contexts/BookingContext';
import { ExtendStay } from '../components/booking/ExtendStay';
import { loadHotel } from '../data/hotels';
import { checkoutTime, dateLabel, inr, inrExact, toTimeLabel } from '../utils/format';
import { priceBreakdown } from '../utils/pricing';
import type { Hotel } from '../types/booking';

export function Confirmation() {
  const { draft, guest, reference, checkInOtp } = useBooking();
  const [hotel, setHotel] = useState<Hotel | undefined>(undefined);

  useEffect(() => {
    if (!draft) return;
    loadHotel(draft.hotelId).then((h) => setHotel(h));
  }, [draft?.hotelId]);

  if (!draft || !hotel || !reference) {
    return (
      <div className="mx-auto w-full max-w-[1200px] px-5 py-24 text-center lg:px-8">
        <h1 className="font-display text-4xl">Nothing to show here yet</h1>
        <p className="mt-3 text-muted">
          Once you confirm a slot, your booking code appears on this page.
        </p>
        <Link
          to="/search"
          className="mt-6 inline-block rounded-xl bg-primary px-6 py-3 text-sm font-bold text-ink transition-colors duration-150 ease-smooth hover:bg-primary-dark">
          
          Find a room
        </Link>
      </div>);

  }

  const bill = priceBreakdown(hotel.rates[draft.duration], draft.duration);
  const paid = draft.payMode === 'part' ? bill.payNow : bill.total;

  return (
    <div className="mx-auto w-full max-w-[900px] px-5 py-14 lg:px-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
        className="flex h-12 w-12 items-center justify-center rounded-full bg-success text-white">
        
        <CheckIcon className="h-6 w-6" aria-hidden="true" />
      </motion.div>

      <h1 className="mt-6 font-display text-4xl leading-tight sm:text-5xl">
        Your room is held, {guest?.name?.split(' ')[0] ?? 'guest'}.
      </h1>
      <p className="mt-3 max-w-xl text-muted">
        We texted your check-in OTP to {guest?.phone ?? 'your mobile'}. The clock
        starts when you check in, not when you booked.
      </p>

      <div className="mt-8 rounded-3xl border-2 border-primary bg-primary-soft p-6">
        <div className="flex flex-wrap items-center justify-between gap-5">
          <div>
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-muted">
              <KeyRoundIcon className="h-4 w-4 text-ink" aria-hidden="true" />
              Check-in OTP
            </p>
            <p className="mt-2 font-display text-5xl leading-none tracking-[0.2em]">
              {checkInOtp}
            </p>
          </div>
          <p className="max-w-sm text-sm leading-relaxed">
            <span className="font-bold">This OTP is mandatory to check in.</span>{' '}
            The desk cannot hand over the room without it — keep it on your phone
            and share it only at the property.
          </p>
        </div>
      </div>

      <div className="mt-8 overflow-hidden rounded-3xl border border-line bg-surface shadow-card">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line bg-primary px-6 py-5 text-ink">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-ink/70">
              Booking code
            </p>
            <p className="mt-1 font-display text-3xl tracking-wide">{reference}</p>
          </div>
          <p className="text-sm font-semibold text-ink/75">
            {dateLabel(draft.date)} · {draft.duration} hours
          </p>
        </div>

        <div className="grid gap-6 p-6 sm:grid-cols-[1fr_auto] sm:items-center">
          <div>
            <h2 className="font-display text-2xl">{hotel.name}</h2>
            <p className="mt-1 flex items-center gap-1.5 text-sm text-muted">
              <MapPinIcon className="h-4 w-4" aria-hidden="true" />
              {hotel.area}, {hotel.city} · {hotel.distanceKm} km from{' '}
              {hotel.landmark}
            </p>
          </div>
          <img
            src={hotel.image}
            alt=""
            className="h-24 w-full rounded-xl object-cover sm:w-40" />
          
        </div>

        <div className="grid gap-px bg-line sm:grid-cols-3">
          <div className="bg-surface px-6 py-5">
            <p className="text-xs uppercase tracking-wide text-muted">Check in</p>
            <p className="mt-1 text-xl font-semibold">
              {toTimeLabel(draft.checkIn)}
            </p>
          </div>
          <div className="bg-surface px-6 py-5">
            <p className="text-xs uppercase tracking-wide text-muted">Check out</p>
            <p className="mt-1 text-xl font-semibold">
              {checkoutTime(draft.checkIn, draft.duration)}
            </p>
          </div>
          <div className="bg-surface px-6 py-5">
            <p className="text-xs uppercase tracking-wide text-muted">Paid now</p>
            <p className="mt-1 text-xl font-semibold">{inrExact(paid)}</p>
            <p className="mt-1 text-xs text-muted">
              {draft.payMode === 'part' ?
              `${inrExact(bill.payAtHotel)} due at the hotel` :
              `Total ${inr(bill.total)} · nothing due at the desk`}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 border-t border-line px-6 py-5">
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-ink transition-colors duration-150 ease-smooth hover:bg-primary-dark">
            
            <CalendarPlusIcon className="h-4 w-4" aria-hidden="true" />
            Add to calendar
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-xl border border-line px-4 py-2.5 text-sm font-semibold transition-colors duration-150 ease-smooth hover:border-ink">
            
            <MapPinIcon className="h-4 w-4" aria-hidden="true" />
            Directions
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-xl border border-line px-4 py-2.5 text-sm font-semibold transition-colors duration-150 ease-smooth hover:border-ink">
            
            <PhoneIcon className="h-4 w-4" aria-hidden="true" />
            Call the hotel
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-xl border border-line px-4 py-2.5 text-sm font-semibold transition-colors duration-150 ease-smooth hover:border-ink">
            
            <MessageSquareIcon className="h-4 w-4" aria-hidden="true" />
            Chat with support
          </button>
        </div>
      </div>

      <ExtendStay
        hotel={hotel}
        checkIn={draft.checkIn}
        duration={draft.duration} />
      

      <section className="mt-8 rounded-2xl border border-line bg-surface p-6">
        <h2 className="text-sm font-semibold">Carry this to the desk</h2>
        <ul className="mt-3 space-y-2 text-sm text-muted">
          <li className="font-semibold text-ink">
            · Your 6-digit check-in OTP — the room is not released without it
          </li>
          {hotel.policies.map((p) =>
          <li key={p}>· {p}</li>
          )}
          <li>· Late by more than 30 minutes? Call the hotel to hold the slot.</li>
        </ul>
      </section>

      <Link
        to="/"
        className="mt-8 inline-block text-sm font-semibold underline decoration-primary decoration-2 underline-offset-4">
        
        Back to Checkdin
      </Link>
    </div>);

}
