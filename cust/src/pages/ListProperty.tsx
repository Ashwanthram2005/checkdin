import React, { useState } from 'react';
import {
  AlertCircleIcon,
  CheckIcon,
  IndianRupeeIcon,
  ShieldCheckIcon,
  TrendingUpIcon } from
'lucide-react';
import { chennaiAreas } from '../data/filters';

const inputClass =
'mt-1.5 w-full rounded-xl border border-line bg-surface px-4 py-3 text-sm outline-none transition-colors duration-150 ease-smooth focus:border-ink';

const benefits = [
{
  icon: TrendingUpIcon,
  title: '2.4 extra slots a day',
  body: 'Sell the hours between check-out and check-in that go empty today.'
},
{
  icon: IndianRupeeIcon,
  title: 'Weekly payouts',
  body: 'Settled every Monday to your registered account, with a line-item statement.'
},
{
  icon: ShieldCheckIcon,
  title: 'ID-verified guests',
  body: 'Every guest signs in with a verified mobile number and carries a check-in OTP.'
}];


export function ListProperty() {
  const [form, setForm] = useState({
    owner: '',
    property: '',
    phone: '',
    email: '',
    area: '',
    rooms: '',
    message: ''
  });
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  function set(key: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.owner.trim() || !form.property.trim()) {
      setError('Tell us your name and the property name.');
      return;
    }
    if (form.phone.replace(/\D/g, '').length < 10) {
      setError('Enter a 10-digit mobile number we can call back on.');
      return;
    }
    if (!form.area) {
      setError('Select the area your property is in.');
      return;
    }
    setError(null);
    setSent(true);
  }

  return (
    <div className="w-full">
      <section className="bg-night text-white">
        <div className="mx-auto grid w-full max-w-[1360px] gap-10 px-5 py-14 lg:grid-cols-[1.1fr_1fr] lg:px-8">
          <div>
            <h1 className="font-display text-4xl leading-[1.05] sm:text-5xl">
              List your property
              <br />
              <span className="text-primary">on Checkdin.</span>
            </h1>
            <p className="mt-5 max-w-lg text-white/70">
              We sell the hours your rooms sit empty — layovers, day use and
              short stays across west Chennai. Onboarding takes about a week, and
              there is no listing fee.
            </p>
            <ul className="mt-8 grid gap-6 sm:grid-cols-3">
              {benefits.map((benefit) =>
              <li key={benefit.title}>
                  <benefit.icon className="h-5 w-5 text-primary" aria-hidden="true" />
                  <h2 className="mt-3 text-sm font-bold">{benefit.title}</h2>
                  <p className="mt-1 text-[13px] leading-relaxed text-night-muted">
                    {benefit.body}
                  </p>
                </li>
              )}
            </ul>
          </div>

          <div className="rounded-2xl bg-surface p-6 text-ink shadow-lift">
            {sent ?
            <div className="py-8 text-center">
                <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary text-ink">
                  <CheckIcon className="h-6 w-6" aria-hidden="true" />
                </span>
                <h2 className="mt-5 font-display text-2xl">
                  Thanks, {form.owner.split(' ')[0]}.
                </h2>
                <p className="mx-auto mt-2 max-w-sm text-sm text-muted">
                  Our Chennai partnerships team will call {form.phone} within one
                  working day to walk through pricing, slot rules and photos for{' '}
                  {form.property}.
                </p>
                <button
                type="button"
                onClick={() => {
                  setSent(false);
                  setForm({
                    owner: '',
                    property: '',
                    phone: '',
                    email: '',
                    area: '',
                    rooms: '',
                    message: ''
                  });
                }}
                className="mt-6 rounded-xl border border-line px-5 py-2.5 text-sm font-semibold transition-colors duration-150 ease-smooth hover:border-ink">
                
                  Submit another property
                </button>
              </div> :

            <form onSubmit={submit} noValidate>
                <h2 className="text-lg font-bold">Contact us</h2>
                <p className="mt-1 text-sm text-muted">
                  Fill this in and we will call you back.
                </p>

                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="text-sm font-medium">Your name</span>
                    <input
                    value={form.owner}
                    onChange={(e) => set('owner', e.target.value)}
                    className={inputClass}
                    placeholder="Aravind Rajan"
                    autoComplete="name" />
                  
                  </label>
                  <label className="block">
                    <span className="text-sm font-medium">Property name</span>
                    <input
                    value={form.property}
                    onChange={(e) => set('property', e.target.value)}
                    className={inputClass}
                    placeholder="Porur Junction Stay" />
                  
                  </label>
                  <label className="block">
                    <span className="text-sm font-medium">Mobile number</span>
                    <input
                    value={form.phone}
                    onChange={(e) => set('phone', e.target.value)}
                    className={inputClass}
                    placeholder="98400 00000"
                    inputMode="numeric"
                    autoComplete="tel" />
                  
                  </label>
                  <label className="block">
                    <span className="text-sm font-medium">
                      Email <span className="text-muted">(optional)</span>
                    </span>
                    <input
                    value={form.email}
                    onChange={(e) => set('email', e.target.value)}
                    className={inputClass}
                    placeholder="you@hotel.com"
                    type="email" />
                  
                  </label>
                  <label className="block">
                    <span className="text-sm font-medium">Area</span>
                    <select
                    value={form.area}
                    onChange={(e) => set('area', e.target.value)}
                    className={inputClass}>
                    
                      <option value="">Select an area</option>
                      {chennaiAreas.map((area) =>
                    <option key={area} value={area}>
                          {area}
                        </option>
                    )}
                      <option value="other">Another area in Chennai</option>
                    </select>
                  </label>
                  <label className="block">
                    <span className="text-sm font-medium">Number of rooms</span>
                    <input
                    value={form.rooms}
                    onChange={(e) => set('rooms', e.target.value)}
                    className={inputClass}
                    placeholder="24"
                    inputMode="numeric" />
                  
                  </label>
                  <label className="block sm:col-span-2">
                    <span className="text-sm font-medium">
                      Anything else <span className="text-muted">(optional)</span>
                    </span>
                    <textarea
                    value={form.message}
                    onChange={(e) => set('message', e.target.value)}
                    rows={3}
                    className={`${inputClass} resize-none`}
                    placeholder="Couple-friendly policy, parking, front-desk hours…" />
                  
                  </label>
                </div>

                {error &&
              <p
                role="alert"
                className="mt-4 flex items-center gap-2 rounded-xl border border-accent bg-accent-soft px-4 py-3 text-sm">
                
                    <AlertCircleIcon
                  className="h-4 w-4 text-accent"
                  aria-hidden="true" />
                
                    {error}
                  </p>
              }

                <button
                type="submit"
                className="mt-5 w-full rounded-xl bg-primary px-6 py-3.5 text-sm font-bold text-ink transition-colors duration-150 ease-smooth hover:bg-primary-dark">
                
                  Request a callback
                </button>
                <p className="mt-3 text-center text-xs text-muted">
                  No listing fee · commission only on slots we fill
                </p>
              </form>
            }
          </div>
        </div>
      </section>
    </div>);

}