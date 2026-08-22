import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AlertCircleIcon, LockIcon, ShieldCheckIcon, UserCheckIcon } from 'lucide-react';
import { useBooking } from '../contexts/BookingContext';
import { useAuth } from '../contexts/AuthContext';
import { getHotel } from '../data/hotels';
import {
  bookingRef,
  checkInOtpCode,
  checkoutTime,
  dateLabel,
  inr,
  inrExact,
  toTimeLabel } from
'../utils/format';
import { priceBreakdown } from '../utils/pricing';
import type { PayMode } from '../types/booking';

type Payment = 'upi' | 'card' | 'netbanking';

const payments: {id: Payment;label: string;note: string;}[] = [
{ id: 'upi', label: 'UPI', note: 'GPay, PhonePe, Paytm' },
{ id: 'card', label: 'Card', note: 'Visa, Mastercard, RuPay' },
{ id: 'netbanking', label: 'Net banking', note: 'All major banks' }];


const inputClass =
'mt-1.5 w-full rounded-xl border border-line bg-surface px-4 py-3 text-sm outline-none transition-colors duration-150 ease-smooth focus:border-primary';

export function Checkout() {
  const { draft, setGuest, setReference, setCheckInOtp } = useBooking();
  const { user, openAuth } = useAuth();
  const navigate = useNavigate();
  const hotel = draft ? getHotel(draft.hotelId) : undefined;

  const [name, setName] = useState(user?.name ?? '');
  const [phone, setPhone] = useState(user?.phone ?? '');
  const [email, setEmail] = useState(user?.email ?? '');

  useEffect(() => {
    if (!user) return;
    setName((v) => v || user.name);
    setPhone((v) => v || user.phone);
    setEmail((v) => v || user.email);
  }, [user]);
  const [payment, setPayment] = useState<Payment>('upi');
  const [payMode, setPayMode] = useState<PayMode>(draft?.payMode ?? 'part');
  const [idAck, setIdAck] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (!user) {
    return (
      <div className="mx-auto w-full max-w-[560px] px-5 py-24 text-center lg:px-8">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary-soft">
          <UserCheckIcon className="h-6 w-6" aria-hidden="true" />
        </span>
        <h1 className="mt-5 font-display text-4xl">Sign in to confirm your slot</h1>
        <p className="mt-3 text-muted">
          We need an account to hold the room and to send your check-in OTP.
          Continue with Google, your mobile number, or email — it takes a few
          seconds.
        </p>
        <button
          type="button"
          onClick={() => openAuth()}
          className="mt-6 rounded-xl bg-primary px-6 py-3.5 text-sm font-bold text-ink transition-colors duration-150 ease-smooth hover:bg-primary-dark">
          
          Sign in / Sign up
        </button>
      </div>);

  }

  if (!draft || !hotel) {
    return (
      <div className="mx-auto w-full max-w-[1200px] px-5 py-24 text-center lg:px-8">
        <h1 className="font-display text-4xl">No slot selected yet</h1>
        <p className="mt-3 text-muted">
          Pick a hotel and an hour block, then come back to pay.
        </p>
        <Link
          to="/search"
          className="mt-6 inline-block rounded-xl bg-primary px-6 py-3 text-sm font-bold text-ink transition-colors duration-150 ease-smooth hover:bg-primary-dark">
          
          Find a room
        </Link>
      </div>);

  }

  const bill = priceBreakdown(hotel.rates[draft.duration], draft.duration);
  const dueNow = payMode === 'part' ? bill.payNow : bill.total;
  const dueNowLabel = payMode === 'part' ? inrExact(dueNow) : inr(bill.total);

  function submit(e: React.FormEvent | React.MouseEvent) {
    e.preventDefault();
    if (!name.trim() || phone.trim().length < 10) {
      setError('Enter the guest name and a 10-digit mobile number.');
      return;
    }
    if (!idAck) {
      setError('Please confirm you will carry original photo ID.');
      return;
    }
    setError(null);
    setSubmitting(true);
    window.setTimeout(() => {
      setGuest({ name, phone, email });
      setReference(bookingRef());
      setCheckInOtp(checkInOtpCode());
      setSubmitting(false);
      navigate('/confirmation');
    }, 900);
  }

  return (
    <div className="mx-auto w-full max-w-[1200px] px-5 py-10 lg:px-8">
      <h1 className="font-display text-4xl leading-tight sm:text-5xl">
        Confirm your slot
      </h1>
      <p className="mt-2 text-muted">
        {hotel.name} · {dateLabel(draft.date)} ·{' '}
        {toTimeLabel(draft.checkIn)} to {checkoutTime(draft.checkIn, draft.duration)}
      </p>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_380px]">
        <form onSubmit={submit} noValidate>
          <section className="rounded-2xl border border-line bg-surface p-6">
            <h2 className="font-display text-2xl">Who is checking in</h2>
            <p className="mt-1 text-sm text-muted">
              Pre-filled from your Checkdin account — edit if someone else is
              checking in. The name must match the ID carried to the desk.
            </p>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="text-sm font-medium">Full name (as on ID)</span>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={inputClass}
                  placeholder="Aravind Rajan"
                  autoComplete="name" />
                
              </label>
              <label className="block">
                <span className="text-sm font-medium">Mobile number</span>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className={inputClass}
                  placeholder="98400 00000"
                  inputMode="numeric"
                  autoComplete="tel" />
                
              </label>
              <label className="block sm:col-span-2">
                <span className="text-sm font-medium">
                  Email <span className="text-muted">(optional)</span>
                </span>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={inputClass}
                  placeholder="you@example.com"
                  type="email"
                  autoComplete="email" />
                
              </label>
            </div>
          </section>

          <section className="mt-6 rounded-2xl border border-line bg-surface p-6">
            <h2 className="font-display text-2xl">How you want to pay</h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {payments.map((option) =>
              <button
                key={option.id}
                type="button"
                aria-pressed={payment === option.id}
                onClick={() => setPayment(option.id)}
                className={`rounded-xl border px-4 py-3 text-left transition-colors duration-150 ease-smooth ${
                payment === option.id ?
                'border-primary bg-primary-soft' :
                'border-line hover:border-primary'}`
                }>
                
                  <span className="block text-sm font-semibold">
                    {option.label}
                  </span>
                  <span className="mt-0.5 block text-xs text-muted">
                    {option.note}
                  </span>
                </button>
              )}
            </div>

            {payment === 'upi' &&
            <label className="mt-5 block max-w-sm">
                <span className="text-sm font-medium">UPI ID</span>
                <input className={inputClass} placeholder="name@okhdfcbank" />
              </label>
            }
            {payment === 'card' &&
            <div className="mt-5 grid max-w-lg gap-4 sm:grid-cols-2">
                <label className="block sm:col-span-2">
                  <span className="text-sm font-medium">Card number</span>
                  <input className={inputClass} placeholder="4111 1111 1111 1111" inputMode="numeric" />
                </label>
                <label className="block">
                  <span className="text-sm font-medium">Expiry</span>
                  <input className={inputClass} placeholder="MM / YY" />
                </label>
                <label className="block">
                  <span className="text-sm font-medium">CVV</span>
                  <input className={inputClass} placeholder="123" inputMode="numeric" />
                </label>
              </div>
            }
            {payment === 'netbanking' &&
            <label className="mt-5 block max-w-sm">
                <span className="text-sm font-medium">Bank</span>
                <input className={inputClass} placeholder="HDFC Bank" />
              </label>
            }

            <fieldset className="mt-6 border-t border-line pt-6">
              <legend className="text-sm font-bold">How much to pay now</legend>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  aria-pressed={payMode === 'part'}
                  onClick={() => setPayMode('part')}
                  className={`rounded-xl border px-4 py-3 text-left transition-colors duration-150 ease-smooth ${
                  payMode === 'part' ?
                  'border-primary bg-primary-soft' :
                  'border-line hover:border-ink'}`
                  }>
                  
                  <span className="block text-sm font-bold">
                    Pay {inrExact(bill.payNow)} now
                  </span>
                  <span className="mt-0.5 block text-xs text-muted">
                    Balance {inrExact(bill.payAtHotel)} at the hotel desk
                  </span>
                </button>
                <button
                  type="button"
                  aria-pressed={payMode === 'full'}
                  onClick={() => setPayMode('full')}
                  className={`rounded-xl border px-4 py-3 text-left transition-colors duration-150 ease-smooth ${
                  payMode === 'full' ?
                  'border-primary bg-primary-soft' :
                  'border-line hover:border-ink'}`
                  }>
                  
                  <span className="block text-sm font-bold">
                    Pay {inr(bill.total)} now
                  </span>
                  <span className="mt-0.5 block text-xs text-muted">
                    Nothing to settle at the desk
                  </span>
                </button>
              </div>
            </fieldset>
          </section>

          <section className="mt-6 rounded-2xl border border-line bg-surface p-6">
            <h2 className="font-display text-2xl">Before you arrive</h2>
            <ul className="mt-4 space-y-2.5">
              {hotel.policies.map((p) =>
              <li key={p} className="flex items-start gap-2.5 text-sm">
                  <ShieldCheckIcon
                  className="mt-0.5 h-4 w-4 shrink-0 text-ink"
                  aria-hidden="true" />
                
                  {p}
                </li>
              )}
            </ul>
            <label className="mt-5 flex items-start gap-3 rounded-xl bg-canvas p-4 text-sm">
              <input
                type="checkbox"
                checked={idAck}
                onChange={(e) => setIdAck(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-line accent-primary" />
              
              <span>
                Every guest will carry an original government photo ID. If the
                property refuses entry despite a valid ID, Checkdin refunds the full
                amount.
              </span>
            </label>
          </section>

          {error &&
          <p
            role="alert"
            className="mt-5 flex items-center gap-2 rounded-xl border border-accent bg-accent-soft px-4 py-3 text-sm text-ink">
            
              <AlertCircleIcon className="h-4 w-4 text-accent" aria-hidden="true" />
              {error}
            </p>
          }

          <button
            type="submit"
            disabled={submitting}
            className="mt-6 w-full rounded-xl bg-primary px-6 py-4 text-sm font-bold text-ink transition-colors duration-150 ease-smooth hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-70 lg:hidden">
            
            {submitting ? 'Confirming…' : `Pay ${dueNowLabel}`}
          </button>
        </form>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="overflow-hidden rounded-2xl border border-line bg-surface shadow-card">
            <img
              src={hotel.image}
              alt=""
              className="h-36 w-full object-cover" />
            
            <div className="p-6">
              <h2 className="font-display text-2xl leading-tight">{hotel.name}</h2>
              <p className="mt-1 text-sm text-muted">
                {hotel.area}, {hotel.city}
              </p>

              <div className="mt-5 rounded-xl bg-canvas p-4">
                <div className="flex items-center justify-between text-sm">
                  <div>
                    <p className="text-xs text-muted">Check in</p>
                    <p className="font-semibold">{toTimeLabel(draft.checkIn)}</p>
                  </div>
                  <div className="mx-3 h-px flex-1 bg-line" aria-hidden="true" />
                  <div className="text-right">
                    <p className="text-xs text-muted">Check out</p>
                    <p className="font-semibold">
                      {checkoutTime(draft.checkIn, draft.duration)}
                    </p>
                  </div>
                </div>
                <p className="mt-3 text-xs text-muted">
                  {dateLabel(draft.date)} · {draft.duration} hours ·{' '}
                  {draft.guests} guest{draft.guests > 1 ? 's' : ''}
                </p>
              </div>

              <dl className="mt-5 space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted">Room, {draft.duration} hours</dt>
                  <dd>{inr(bill.base)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted">Checkdin service fee</dt>
                  <dd>{inr(bill.serviceFee)}</dd>
                </div>
                <div className="flex justify-between border-t border-line pt-3 text-base font-bold">
                  <dt>Total cost</dt>
                  <dd>{inr(bill.total)}</dd>
                </div>
                <div className="flex justify-between pt-1">
                  <dt className="text-muted">Paying now</dt>
                  <dd className="font-bold">{dueNowLabel}</dd>
                </div>
                {payMode === 'part' &&
                <div className="flex justify-between">
                    <dt className="text-muted">At the hotel</dt>
                    <dd>{inrExact(bill.payAtHotel)}</dd>
                  </div>
                }
              </dl>

              <button
                type="button"
                onClick={submit}
                disabled={submitting}
                className="mt-5 hidden w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-bold text-ink transition-colors duration-150 ease-smooth hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-70 lg:flex">
                
                <LockIcon className="h-4 w-4" aria-hidden="true" />
                {submitting ? 'Confirming…' : `Pay ${dueNowLabel}`}
              </button>
              <p className="mt-3 text-center text-xs text-muted">
                Free cancellation up to 2 hours before check-in
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>);

}