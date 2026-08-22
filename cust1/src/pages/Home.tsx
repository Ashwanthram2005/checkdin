import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRightIcon,
  BadgeCheckIcon,
  BedDoubleIcon,
  CheckCircle2Icon,
  ClockIcon,
  CreditCardIcon,
  DoorOpenIcon,
  IndianRupeeIcon,
  ListChecksIcon,
  LockIcon,
  MapPinIcon,
  SearchIcon,
  ShieldCheckIcon,
  TagIcon,
  ZapIcon } from
'lucide-react';
import { SearchPanel } from '../components/search/SearchPanel';
import { HotelTile } from '../components/hotel/HotelTile';
import { hotels } from '../data/hotels';
import { useBooking } from '../contexts/BookingContext';

const heroAssurances = [
{ icon: ZapIcon, label: 'Instant confirmation' },
{ icon: ShieldCheckIcon, label: 'Free cancellation up to 2 hours before' },
{ icon: TagIcon, label: 'No hidden charges' },
{ icon: LockIcon, label: 'Secure payments' }];


const valueProps = [
{
  icon: ClockIcon,
  title: 'Hourly stays',
  body: 'Book for 3, 6 or 12 hours'
},
{
  icon: ZapIcon,
  title: 'Instant check-in',
  body: 'Get a room in 15 minutes'
},
{
  icon: ShieldCheckIcon,
  title: 'Safe & private',
  body: 'Couple friendly rooms'
},
{
  icon: IndianRupeeIcon,
  title: 'Best price guarantee',
  body: 'Pay only for the time you stay'
}];


const steps = [
{
  icon: SearchIcon,
  title: 'Search',
  body: 'Choose location, date, time and duration'
},
{
  icon: ListChecksIcon,
  title: 'Choose',
  body: 'Pick a room that suits your needs'
},
{
  icon: CreditCardIcon,
  title: 'Book',
  body: 'Pay securely and get instant confirmation'
},
{
  icon: DoorOpenIcon,
  title: 'Check in',
  body: 'Walk in on your slot and enjoy your stay'
}];


const assurances = [
{
  icon: BadgeCheckIcon,
  title: 'Local ID accepted',
  body: 'Couple-friendly hotels accept Tamil Nadu and all-India ID. The rule is on the listing before you pay.'
},
{
  icon: CheckCircle2Icon,
  title: 'No surprise at the desk',
  body: 'The slot, the price and the ID policy are locked at booking. If a property refuses entry, we refund in full.'
},
{
  icon: BedDoubleIcon,
  title: 'Fresh room, every slot',
  body: 'Rooms are turned over between bookings, never resold mid-slot. Housekeeping is audited monthly.'
}];


const heroImage = "/30594db3-74de-4aa1-8511-f427f290fcc3.jpg";


export function Home() {
  const { search, setSearch } = useBooking();
  const navigate = useNavigate();
  const featured = hotels.slice(0, 4);

  return (
    <div className="w-full">
      {/* Hero band */}
      <section className="relative overflow-hidden bg-night text-white">
        <div className="absolute inset-y-0 right-0 hidden w-[46%] lg:block">
          <img
            src={heroImage}
            alt="A sunlit hotel room with a teak headboard and white linen"
            className="h-full w-full object-cover" />
          
          <div className="absolute bottom-44 right-8 rounded-xl bg-night/90 p-4 backdrop-blur">
            <p className="text-xs text-white/70">Rooms from</p>
            <p className="mt-0.5 text-xl font-bold text-primary">
              ₹499 <span className="text-base font-medium text-white">for 3 hours</span>
            </p>
            <p className="mt-1 flex items-center gap-1 text-xs text-white/70">
              <MapPinIcon className="h-3 w-3" aria-hidden="true" />
              Chennai Central, today
            </p>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-[1360px] px-5 pb-6 pt-12 lg:px-8">
          <div className="lg:max-w-[52%]">
            <h1 className="font-display text-5xl leading-[1.02] sm:text-6xl">
              Pay for the hours
              <br />
              <span className="text-primary">you actually stay.</span>
            </h1>
            <p className="mt-5 max-w-md text-base leading-relaxed text-white/70">
              Hourly hotel rooms across Chennai. Whether it's a layover, a
              meeting, or a short break — book by the hour, not the night.
            </p>
          </div>

          <div className="mt-8 lg:hidden">
            <img
              src={heroImage}
              alt=""
              className="h-52 w-full rounded-2xl object-cover" />
            
          </div>

          <div className="relative z-10 mt-8">
            <SearchPanel />
          </div>

          <ul className="mt-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-3">
            {heroAssurances.map((item) =>
            <li
              key={item.label}
              className="flex items-center gap-2 text-sm text-white/75">
              
                <item.icon className="h-4 w-4 text-primary" aria-hidden="true" />
                {item.label}
              </li>
            )}
          </ul>
        </div>
      </section>

      {/* Value props */}
      <section className="mx-auto w-full max-w-[1360px] px-5 pt-8 lg:px-8">
        <div className="grid divide-y divide-line rounded-2xl border border-line bg-surface sm:grid-cols-2 lg:grid-cols-4 lg:divide-x lg:divide-y-0">
          {valueProps.map((item) =>
          <div key={item.title} className="flex items-center gap-4 px-6 py-6">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary-soft">
                <item.icon className="h-5 w-5 text-ink" aria-hidden="true" />
              </span>
              <div>
                <h2 className="text-[15px] font-bold">{item.title}</h2>
                <p className="mt-0.5 text-[13px] text-muted">{item.body}</p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Popular near you */}
      <section className="mx-auto w-full max-w-[1360px] px-5 pt-12 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="font-display text-3xl">Popular near you</h2>
            <p className="mt-1 text-sm text-muted">
              Top-rated rooms in and around {search.city}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex gap-1 rounded-lg border border-line bg-surface p-1">
              {[3, 6, 12].map((d) =>
              <button
                key={d}
                type="button"
                onClick={() => setSearch({ duration: d as 3 | 6 | 12 })}
                aria-pressed={search.duration === d}
                className={`rounded-md px-3 py-1.5 text-sm font-semibold transition-colors duration-150 ease-smooth ${
                search.duration === d ?
                'bg-primary text-ink' :
                'text-muted hover:text-ink'}`
                }>
                
                  {d}h
                </button>
              )}
            </div>
            <Link
              to="/search"
              className="text-sm font-semibold underline decoration-primary decoration-2 underline-offset-4">
              
              View all
            </Link>
          </div>
        </div>
        <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((hotel) =>
          <HotelTile key={hotel.id} hotel={hotel} duration={search.duration} />
          )}
        </div>
      </section>

      {/* App + How it works */}
      <section id="how" className="mx-auto w-full max-w-[1360px] px-5 pt-12 lg:px-8">
        <div className="grid gap-5 lg:grid-cols-[1fr_1.6fr]">
          <div className="flex flex-col justify-between rounded-2xl border border-line bg-surface p-7">
            <div>
              <h2 className="font-display text-2xl">Book faster on the go</h2>
              <p className="mt-2 text-sm text-muted">
                Get the Checkdin app for exclusive deals and a faster booking
                experience.
              </p>
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <button
                type="button"
                className="rounded-xl bg-ink px-5 py-2.5 text-left text-white transition-colors duration-150 ease-smooth hover:bg-night">
                
                <span className="block text-[10px] uppercase tracking-wide text-white/60">
                  Get it on
                </span>
                <span className="block text-sm font-bold">Google Play</span>
              </button>
              <button
                type="button"
                className="rounded-xl bg-ink px-5 py-2.5 text-left text-white transition-colors duration-150 ease-smooth hover:bg-night">
                
                <span className="block text-[10px] uppercase tracking-wide text-white/60">
                  Download on the
                </span>
                <span className="block text-sm font-bold">App Store</span>
              </button>
            </div>
          </div>

          <div className="rounded-2xl border border-line bg-surface p-7">
            <h2 className="font-display text-2xl">How it works</h2>
            <ol className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {steps.map((step, i) =>
              <li key={step.title}>
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-soft">
                    <step.icon className="h-5 w-5 text-ink" aria-hidden="true" />
                  </span>
                  <h3 className="mt-3 text-sm font-bold">
                    {i + 1}. {step.title}
                  </h3>
                  <p className="mt-1 text-[13px] leading-relaxed text-muted">
                    {step.body}
                  </p>
                </li>
              )}
            </ol>
          </div>
        </div>
      </section>

      {/* Trust */}
      <section id="help" className="mx-auto w-full max-w-[1360px] px-5 pt-12 lg:px-8">
        <div className="rounded-2xl bg-night px-6 py-12 text-white sm:px-12">
          <h2 className="max-w-2xl font-display text-4xl leading-tight">
            The awkward parts, settled before you pay.
          </h2>
          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {assurances.map((item) =>
            <div key={item.title} className="flex flex-col">
                <item.icon className="h-5 w-5 text-primary" aria-hidden="true" />
                <h3 className="mt-4 text-lg font-bold">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-night-muted">
                  {item.body}
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Partners */}
      <section
        id="partners"
        className="mx-auto w-full max-w-[1360px] px-5 pt-12 lg:px-8">
        
        <div className="flex flex-col items-start justify-between gap-6 rounded-2xl border border-line bg-surface p-8 md:flex-row md:items-center">
          <div>
            <h2 className="font-display text-3xl">
              Have rooms sitting empty at noon?
            </h2>
            <p className="mt-2 max-w-xl text-sm text-muted">
              Chennai hotels on Checkdin fill an average of 2.4 extra slots a day
              between check-out and check-in. Onboarding takes a week.
            </p>
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => navigate('/search')}
              className="whitespace-nowrap rounded-xl border border-line px-5 py-3 text-sm font-semibold transition-colors duration-150 ease-smooth hover:border-ink">
              
              Browse rooms
            </button>
            <Link
              to="/list-your-property"
              className="inline-flex items-center gap-2 whitespace-nowrap rounded-xl bg-primary px-6 py-3 text-sm font-bold text-ink transition-colors duration-150 ease-smooth hover:bg-primary-dark">
              
              List your property
              <ArrowRightIcon className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    </div>);

}