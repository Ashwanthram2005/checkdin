import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  CheckIcon,
  LogOutIcon,
  PhoneCallIcon,
  ShieldCheckIcon,
  TicketIcon } from
'lucide-react';
import { initialsOf, useAuth, type Gender } from '../contexts/AuthContext';
import { useBooking } from '../contexts/BookingContext';
import { getHotel } from '../data/hotels';
import { checkoutTime, dateLabel, toTimeLabel } from '../utils/format';

const inputClass =
'mt-1.5 w-full rounded-xl border border-line bg-surface px-4 py-3 text-sm outline-none transition-colors duration-150 ease-smooth focus:border-ink';

const genders: {id: Gender;label: string;}[] = [
{ id: 'female', label: 'Female' },
{ id: 'male', label: 'Male' },
{ id: 'other', label: 'Other' },
{ id: 'unspecified', label: 'Prefer not to say' }];


export function Profile() {
  const { user, updateUser, signOut, openAuth } = useAuth();
  const { draft, reference, checkInOtp } = useBooking();
  const [saved, setSaved] = useState(false);

  if (!user) {
    return (
      <div className="mx-auto w-full max-w-[1360px] px-5 py-24 text-center lg:px-8">
        <h1 className="font-display text-4xl">You are signed out</h1>
        <p className="mt-3 text-muted">
          Sign in to see your profile, bookings and check-in codes.
        </p>
        <button
          type="button"
          onClick={() => openAuth()}
          className="mt-6 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-ink transition-colors duration-150 ease-smooth hover:bg-primary-dark">
          
          Sign in
        </button>
      </div>);

  }

  const hotel = draft ? getHotel(draft.hotelId) : undefined;

  return (
    <div className="mx-auto w-full max-w-[900px] px-5 py-10 lg:px-8">
      <div className="flex flex-wrap items-center gap-5">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-xl font-bold text-ink">
          {initialsOf(user.name) || 'G'}
        </span>
        <div>
          <h1 className="font-display text-3xl leading-tight">{user.name}</h1>
          <p className="mt-1 text-sm text-muted">
            {[user.phone, user.email].filter(Boolean).join(' · ') ||
            'Add your contact details below'}
          </p>
        </div>
        <button
          type="button"
          onClick={signOut}
          className="ml-auto inline-flex items-center gap-2 rounded-xl border border-line px-4 py-2.5 text-sm font-semibold transition-colors duration-150 ease-smooth hover:border-ink">
          
          <LogOutIcon className="h-4 w-4" aria-hidden="true" />
          Log out
        </button>
      </div>

      <section className="mt-8 rounded-2xl border border-line bg-surface p-6">
        <h2 className="text-lg font-bold">Your details</h2>
        <p className="mt-1 text-sm text-muted">
          These are pre-filled at checkout. They must match the ID you carry.
        </p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="text-sm font-medium">Full name (as on ID)</span>
            <input
              value={user.name}
              onChange={(e) => {
                updateUser({ name: e.target.value });
                setSaved(false);
              }}
              className={inputClass}
              autoComplete="name" />
            
          </label>
          <label className="block">
            <span className="text-sm font-medium">Mobile number</span>
            <input
              value={user.phone}
              onChange={(e) => {
                updateUser({ phone: e.target.value });
                setSaved(false);
              }}
              className={inputClass}
              inputMode="numeric"
              autoComplete="tel" />
            
          </label>
          <label className="block sm:col-span-2">
            <span className="text-sm font-medium">Email</span>
            <input
              value={user.email}
              onChange={(e) => {
                updateUser({ email: e.target.value });
                setSaved(false);
              }}
              className={inputClass}
              type="email"
              autoComplete="email" />
            
          </label>
        </div>

        <fieldset className="mt-5">
          <legend className="text-sm font-medium">Gender</legend>
          <p className="mt-1 text-xs text-muted">
            Some properties record this at check-in. Sharing it is optional.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {genders.map((option) => {
              const active = (user.gender ?? 'unspecified') === option.id;
              return (
                <button
                  key={option.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => {
                    updateUser({ gender: option.id });
                    setSaved(false);
                  }}
                  className={`rounded-xl border px-4 py-2.5 text-sm font-semibold transition-colors duration-150 ease-smooth ${
                  active ?
                  'border-primary bg-primary-soft' :
                  'border-line hover:border-ink'}`
                  }>
                  
                  {option.label}
                </button>);

            })}
          </div>
        </fieldset>
        <button
          type="button"
          onClick={() => setSaved(true)}
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-ink transition-colors duration-150 ease-smooth hover:bg-primary-dark">
          
          {saved && <CheckIcon className="h-4 w-4" aria-hidden="true" />}
          {saved ? 'Saved' : 'Save changes'}
        </button>
      </section>

      <section className="mt-6 rounded-2xl border border-line bg-surface p-6">
        <div className="flex items-start gap-3">
          <PhoneCallIcon className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
          <div>
            <h2 className="text-lg font-bold">Emergency contact</h2>
            <p className="mt-1 text-sm text-muted">
              Shared with the property only if something goes wrong during your
              stay. Never used for marketing.
            </p>
          </div>
        </div>
        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          <label className="block">
            <span className="text-sm font-medium">Contact name</span>
            <input
              value={user.emergencyName ?? ''}
              onChange={(e) => {
                updateUser({ emergencyName: e.target.value });
                setSaved(false);
              }}
              className={inputClass}
              placeholder="Meena Rajan" />
            
          </label>
          <label className="block">
            <span className="text-sm font-medium">Mobile number</span>
            <input
              value={user.emergencyPhone ?? ''}
              onChange={(e) => {
                updateUser({ emergencyPhone: e.target.value });
                setSaved(false);
              }}
              className={inputClass}
              placeholder="98400 00000"
              inputMode="numeric" />
            
          </label>
          <label className="block">
            <span className="text-sm font-medium">Relationship</span>
            <select
              value={user.emergencyRelation ?? ''}
              onChange={(e) => {
                updateUser({ emergencyRelation: e.target.value });
                setSaved(false);
              }}
              className={inputClass}>
              
              <option value="">Select</option>
              <option value="Spouse">Spouse</option>
              <option value="Parent">Parent</option>
              <option value="Sibling">Sibling</option>
              <option value="Friend">Friend</option>
              <option value="Colleague">Colleague</option>
            </select>
          </label>
        </div>
      </section>

      <section className="mt-6 rounded-2xl border border-line bg-surface p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-bold">Your bookings</h2>
          <Link
            to="/bookings"
            className="text-sm font-semibold underline decoration-primary decoration-2 underline-offset-4">
            
            See all bookings
          </Link>
        </div>
        {hotel && draft && reference ?
        <div className="mt-4 rounded-xl border border-line p-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="font-bold">{hotel.name}</p>
                <p className="mt-1 text-sm text-muted">
                  {dateLabel(draft.date)} · {toTimeLabel(draft.checkIn)} to{' '}
                  {checkoutTime(draft.checkIn, draft.duration)} · {draft.duration}{' '}
                  hours
                </p>
              </div>
              <span className="rounded-lg bg-primary-soft px-3 py-1.5 text-xs font-bold">
                {reference}
              </span>
            </div>
            {checkInOtp &&
          <p className="mt-4 flex items-center gap-2 text-sm">
                <ShieldCheckIcon className="h-4 w-4" aria-hidden="true" />
                Check-in OTP{' '}
                <span className="font-bold tracking-[0.3em]">{checkInOtp}</span>
              </p>
          }
            <Link
            to="/confirmation"
            className="mt-4 inline-block text-sm font-semibold underline decoration-primary decoration-2 underline-offset-4">
            
              View booking
            </Link>
          </div> :

        <div className="mt-4 flex flex-col items-start gap-4 rounded-xl border border-dashed border-line p-6">
            <TicketIcon className="h-5 w-5 text-muted" aria-hidden="true" />
            <p className="text-sm text-muted">
              No bookings yet. Your hourly stays and check-in codes will appear
              here.
            </p>
            <Link
            to="/search"
            className="rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-ink transition-colors duration-150 ease-smooth hover:bg-primary-dark">
            
              Find a room
            </Link>
          </div>
        }
      </section>
    </div>);

}