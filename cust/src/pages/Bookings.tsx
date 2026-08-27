import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  CalendarIcon,
  ClockIcon,
  KeyRoundIcon,
  MapPinIcon,
  StarIcon,
  TicketIcon } from
'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useBooking } from '../contexts/BookingContext';
import { loadHotel } from '../data/hotels';
import { loadBookings, type BookingRecord, type BookingStatus } from '../data/bookings';
import { checkoutTime, dateLabel, inr, toTimeLabel } from '../utils/format';
import type { Hotel } from '../types/booking';

const tabs: {id: BookingStatus;label: string;}[] = [
{ id: 'ongoing', label: 'Ongoing' },
{ id: 'completed', label: 'Completed' },
{ id: 'cancelled', label: 'Cancelled' }];


function BookingRow({ booking }: {booking: BookingRecord;}) {
  const [hotel, setHotel] = useState<Hotel | undefined>(undefined);

  useEffect(() => {
    loadHotel(booking.hotelId).then((h) => setHotel(h));
  }, [booking.hotelId]);

  if (!hotel) return null;

  return (
    <article className="grid gap-5 rounded-2xl border border-line bg-surface p-5 sm:grid-cols-[168px_1fr]">
      <img
        src={hotel.image}
        alt=""
        className="h-32 w-full rounded-xl object-cover sm:h-full" />
      
      <div className="flex flex-col">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h3 className="text-base font-bold">
              <Link
                to={`/hotel/${hotel.id}`}
                className="transition-colors duration-150 ease-smooth hover:text-muted">
                
                {hotel.name}
              </Link>
            </h3>
            <p className="mt-1 flex items-center gap-1.5 text-sm text-muted">
              <MapPinIcon className="h-3.5 w-3.5" aria-hidden="true" />
              {hotel.area}, {hotel.city}
            </p>
          </div>
          <span className="rounded-lg bg-canvas px-3 py-1.5 text-xs font-bold">
            {booking.reference}
          </span>
        </div>

        <dl className="mt-4 grid gap-x-8 gap-y-2 text-sm sm:grid-cols-3">
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-4 w-4 text-muted" aria-hidden="true" />
            <dt className="sr-only">Date</dt>
            <dd>{dateLabel(booking.date)}</dd>
          </div>
          <div className="flex items-center gap-2">
            <ClockIcon className="h-4 w-4 text-muted" aria-hidden="true" />
            <dt className="sr-only">Slot</dt>
            <dd>
              {toTimeLabel(booking.checkIn)} –{' '}
              {checkoutTime(booking.checkIn, booking.duration)} ·{' '}
              {booking.duration}h
            </dd>
          </div>
          <div className="flex items-center gap-2">
            <TicketIcon className="h-4 w-4 text-muted" aria-hidden="true" />
            <dt className="sr-only">Amount</dt>
            <dd className="font-bold">{inr(booking.amount)}</dd>
          </div>
        </dl>

        {booking.status === 'ongoing' && booking.otp &&
        <p className="mt-4 inline-flex w-fit items-center gap-2 rounded-lg bg-primary-soft px-3 py-2 text-sm">
            <KeyRoundIcon className="h-4 w-4" aria-hidden="true" />
            Check-in OTP
            <span className="font-bold tracking-[0.25em]">{booking.otp}</span>
          </p>
        }

        {booking.rated &&
        <p
          className="mt-4 flex items-center gap-1"
          aria-label={`You rated ${booking.rated} out of 5`}>
          
            {Array.from({ length: booking.rated }).map((_, i) =>
          <StarIcon
            key={i}
            className="h-4 w-4 fill-primary text-primary"
            aria-hidden="true" />

          )}
            <span className="ml-1 text-xs text-muted">Your rating</span>
          </p>
        }

        <div className="mt-auto flex flex-wrap gap-3 pt-5">
          {booking.status === 'ongoing' &&
          <>
              <Link
              to="/confirmation"
              className="rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-ink transition-colors duration-150 ease-smooth hover:bg-primary-dark">
              
                View booking
              </Link>
              <Link
              to="/support"
              className="rounded-xl border border-line px-5 py-2.5 text-sm font-semibold transition-colors duration-150 ease-smooth hover:border-ink">
              
                Need help
              </Link>
            </>
          }
          {booking.status === 'completed' &&
          <>
              <Link
              to={`/hotel/${hotel.id}`}
              className="rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-ink transition-colors duration-150 ease-smooth hover:bg-primary-dark">
              
                Book again
              </Link>
              <button
              type="button"
              className="rounded-xl border border-line px-5 py-2.5 text-sm font-semibold transition-colors duration-150 ease-smooth hover:border-ink">
              
                Download invoice
              </button>
            </>
          }
          {booking.status === 'cancelled' &&
          <Link
            to={`/hotel/${hotel.id}`}
            className="rounded-xl border border-line px-5 py-2.5 text-sm font-semibold transition-colors duration-150 ease-smooth hover:border-ink">
            
              Book again
            </Link>
          }
        </div>
      </div>
    </article>);

}

export function Bookings() {
  const { user, openAuth } = useAuth();
  const { draft, reference, checkInOtp } = useBooking();
  const [tab, setTab] = useState<BookingStatus>('ongoing');
  const [pastBookings, setPastBookings] = useState<BookingRecord[]>([]);

  useEffect(() => {
    if (!user) return;
    loadBookings().then((bookings) => setPastBookings(bookings));
  }, [user]);

  const live = useMemo<BookingRecord[]>(() => {
    if (!draft || !reference) return [];
    return [
    {
      id: 'live',
      reference,
      hotelId: draft.hotelId,
      date: draft.date,
      checkIn: draft.checkIn,
      duration: draft.duration,
      guests: draft.guests,
      amount: 0,
      status: 'ongoing',
      otp: checkInOtp ?? undefined
    }];

  }, [draft, reference, checkInOtp]);

  if (!user) {
    return (
      <div className="mx-auto w-full max-w-[900px] px-5 py-24 text-center lg:px-8">
        <h1 className="font-display text-4xl">Sign in to see your bookings</h1>
        <p className="mt-3 text-muted">
          Your ongoing slots, check-in codes and past stays live here.
        </p>
        <button
          type="button"
          onClick={() => openAuth()}
          className="mt-6 rounded-xl bg-primary px-6 py-3.5 text-sm font-bold text-ink transition-colors duration-150 ease-smooth hover:bg-primary-dark">
          
          Sign in
        </button>
      </div>);

  }

  const all = [...live, ...pastBookings];
  const visible = all.filter((b) => b.status === tab);
  const counts: Record<BookingStatus, number> = {
    ongoing: all.filter((b) => b.status === 'ongoing').length,
    completed: all.filter((b) => b.status === 'completed').length,
    cancelled: all.filter((b) => b.status === 'cancelled').length
  };

  return (
    <div className="mx-auto w-full max-w-[900px] px-5 py-10 lg:px-8">
      <h1 className="font-display text-4xl leading-tight">My bookings</h1>
      <p className="mt-2 text-muted">
        Every slot you have booked with Checkdin, newest first.
      </p>

      <div className="mt-7 flex gap-2 overflow-x-auto border-b border-line no-scrollbar">
        {tabs.map((t) =>
        <button
          key={t.id}
          type="button"
          onClick={() => setTab(t.id)}
          aria-current={tab === t.id}
          className={`whitespace-nowrap border-b-2 px-4 py-3 text-sm transition-colors duration-150 ease-smooth ${
          tab === t.id ?
          'border-ink font-bold text-ink' :
          'border-transparent text-muted hover:text-ink'}`
          }>
          
            {t.label}
            <span className="ml-2 rounded-md bg-canvas px-1.5 py-0.5 text-xs">
              {counts[t.id]}
            </span>
          </button>
        )}
      </div>

      <div className="mt-6 space-y-5">
        {visible.map((booking) =>
        <BookingRow key={booking.id} booking={booking} />
        )}

        {visible.length === 0 &&
        <div className="rounded-2xl border border-dashed border-line p-12 text-center">
            <h2 className="font-display text-2xl">
              No {tab} bookings
            </h2>
            <p className="mx-auto mt-2 max-w-sm text-sm text-muted">
              {tab === 'ongoing' ?
            'Nothing booked right now. Rooms in west Chennai start at ₹429 for three hours.' :
            'Nothing here yet.'}
            </p>
            <Link
            to="/search"
            className="mt-5 inline-block rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-ink transition-colors duration-150 ease-smooth hover:bg-primary-dark">
            
              Find a room
            </Link>
          </div>
        }
      </div>
    </div>);

}
