import React, { useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  BadgeCheckIcon,
  GiftIcon,
  HeartIcon,
  ImageIcon,
  InfoIcon,
  LockIcon,
  MapPinIcon,
  ShieldCheckIcon,
  Share2Icon,
  StarIcon,
  TicketPercentIcon,
  UsersIcon } from
'lucide-react';
import { galleryFor, getHotel } from '../data/hotels';
import { areaNearby, specialFacilities, standardAmenities } from '../data/amenities';
import { useBooking } from '../contexts/BookingContext';
import { useAuth } from '../contexts/AuthContext';
import { SlotPicker } from '../components/hotel/SlotPicker';
import { BookingSummaryCard } from '../components/hotel/BookingSummaryCard';
import { LockedMap } from '../components/hotel/LockedMap';
import { Modal } from '../components/ui/Modal';
import { isSlotAvailable } from '../utils/availability';
import { inr, inrExact, toTimeLabel } from '../utils/format';
import { priceBreakdown } from '../utils/pricing';
import type { Duration, PayMode } from '../types/booking';

const tabs = [
{ id: 'basic', label: 'Basic Info' },
{ id: 'amenities', label: 'Facilities & Amenities' },
{ id: 'location', label: 'Property Location' },
{ id: 'ratings', label: 'Ratings' },
{ id: 'rules', label: 'Rules & Policies' },
{ id: 'rooms', label: 'Room Options' }];


const reviews = [
{
  name: 'Aravind R.',
  slot: '6 hours · 2 a.m. check-in',
  rating: 5,
  text: 'Landed late, room was ready in ten minutes. Slept properly and still made the 9 a.m. meeting.'
},
{
  name: 'Divya & Karthik',
  slot: '3 hours · afternoon',
  rating: 4,
  text: 'ID policy was written on the listing, so there was zero drama at the desk. That alone is worth it.'
}];


const ratingBars = [
{ stars: 5, share: 62 },
{ stars: 4, share: 24 },
{ stars: 3, share: 9 },
{ stars: 2, share: 3 },
{ stars: 1, share: 2 }];


export function HotelDetail() {
  const { id } = useParams<{id: string;}>();
  const hotel = id ? getHotel(id) : undefined;
  const { search, setSearch, setDraft } = useBooking();
  const { user, openAuth } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('basic');
  const [guests, setGuests] = useState(2);
  const [rooms, setRooms] = useState(1);
  const [payMode, setPayMode] = useState<PayMode>('part');
  const [amenitiesOpen, setAmenitiesOpen] = useState(false);
  const [photosOpen, setPhotosOpen] = useState(false);
  const [saved, setSaved] = useState(false);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  if (!hotel) {
    return (
      <div className="mx-auto w-full max-w-[1360px] px-5 py-24 text-center lg:px-8">
        <h1 className="font-display text-4xl">This stay is no longer listed</h1>
        <p className="mt-3 text-muted">
          It may have paused hourly bookings. Here is what is still open nearby.
        </p>
        <Link
          to="/search"
          className="mt-6 inline-block rounded-xl bg-primary px-6 py-3 text-sm font-bold text-ink transition-colors duration-150 ease-smooth hover:bg-primary-dark">
          
          Back to results
        </Link>
      </div>);

  }

  const gallery = galleryFor(hotel);
  const nearby = areaNearby[hotel.area] ?? [];
  const available = isSlotAvailable(hotel.id, search.checkIn, search.duration);
  const previewAmenities = standardAmenities.slice(0, 4);

  function goTo(tabId: string) {
    setActiveTab(tabId);
    sectionRefs.current[tabId]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function book() {
    if (!hotel) return;
    const proceed = () => {
      setDraft({
        hotelId: hotel.id,
        duration: search.duration,
        checkIn: search.checkIn,
        date: search.date,
        guests,
        payMode
      });
      navigate('/checkout');
    };
    if (!user) {
      openAuth(proceed);
      return;
    }
    proceed();
  }

  const title = `${hotel.name} — Near ${hotel.landmark}`;

  return (
    <div className="mx-auto w-full max-w-[1360px] px-5 py-6 lg:px-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <nav className="text-sm text-muted" aria-label="Breadcrumb">
          <Link to="/" className="hover:text-ink">
            Home
          </Link>
          <span className="mx-2" aria-hidden="true">
            &gt;
          </span>
          <Link to="/search" className="hover:text-ink">
            Chennai Hotels
          </Link>
          <span className="mx-2" aria-hidden="true">
            &gt;
          </span>
          <span className="text-ink">{title}</span>
        </nav>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setSaved((v) => !v)}
            aria-pressed={saved}
            aria-label={saved ? 'Remove from saved' : 'Save this property'}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-line transition-colors duration-150 ease-smooth hover:border-ink">
            
            <HeartIcon
              className={`h-4 w-4 ${saved ? 'fill-accent text-accent' : ''}`}
              aria-hidden="true" />
            
          </button>
          <button
            type="button"
            aria-label="Share this property"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-line transition-colors duration-150 ease-smooth hover:border-ink">
            
            <Share2Icon className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Gallery */}
      <div className="mt-5 grid gap-3 lg:grid-cols-[1.5fr_1fr]">
        <img
          src={gallery[0]}
          alt={`${hotel.name} room`}
          className="h-64 w-full rounded-2xl object-cover lg:h-[460px]" />
        
        <div className="relative grid grid-cols-2 gap-3">
          {gallery.slice(1, 5).map((img, i) =>
          <img
            key={img + i}
            src={img}
            alt=""
            className="h-32 w-full rounded-2xl object-cover lg:h-[224px]" />

          )}
          <button
            type="button"
            onClick={() => setPhotosOpen(true)}
            className="absolute bottom-3 right-3 inline-flex items-center gap-2 rounded-lg bg-surface px-3.5 py-2 text-sm font-bold shadow-card transition-colors duration-150 ease-smooth hover:bg-canvas">
            
            <ImageIcon className="h-4 w-4" aria-hidden="true" />
            View all
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="sticky top-16 z-20 mt-6 overflow-x-auto border-b border-line bg-canvas no-scrollbar">
        <div className="flex min-w-max gap-8">
          {tabs.map((tab) =>
          <button
            key={tab.id}
            type="button"
            onClick={() => goTo(tab.id)}
            aria-current={activeTab === tab.id}
            className={`whitespace-nowrap border-b-2 px-1 py-3.5 text-sm transition-colors duration-150 ease-smooth ${
            activeTab === tab.id ?
            'border-ink font-bold text-ink' :
            'border-transparent text-muted hover:text-ink'}`
            }>
            
              {tab.label}
            </button>
          )}
        </div>
      </div>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_400px]">
        <div>
          {/* Basic info */}
          <section
            id="basic"
            ref={(el) => sectionRefs.current.basic = el}
            className="scroll-mt-32">
            
            <h1 className="font-display text-3xl leading-tight sm:text-4xl">
              {title}
            </h1>
            <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
              <span className="flex items-center gap-1.5 font-bold">
                <StarIcon
                  className="h-4 w-4 fill-primary text-primary"
                  aria-hidden="true" />
                
                {hotel.rating}
                <span className="font-medium text-muted">
                  ({hotel.reviews.toLocaleString('en-IN')})
                </span>
              </span>
              <span className="h-4 w-px bg-line" aria-hidden="true" />
              <span className="text-muted">{hotel.area}, {hotel.city}</span>
            </div>

            <ul className="mt-5 flex flex-wrap gap-3">
              {hotel.coupleFriendly &&
              <li className="inline-flex items-center gap-2 rounded-xl border border-line px-4 py-2.5 text-sm font-semibold">
                  <UsersIcon className="h-4 w-4 text-muted" aria-hidden="true" />
                  Couple Friendly
                </li>
              }
              {hotel.localIdAccepted &&
              <li className="inline-flex items-center gap-2 rounded-xl border border-line px-4 py-2.5 text-sm font-semibold">
                  <BadgeCheckIcon className="h-4 w-4 text-muted" aria-hidden="true" />
                  Accepts Local ID
                </li>
              }
            </ul>

            <div className="mt-7 grid gap-4 border-t border-line pt-7 sm:grid-cols-2">
              <div className="flex items-center gap-4 rounded-xl bg-night px-5 py-4 text-white">
                <GiftIcon className="h-6 w-6 shrink-0 text-primary" aria-hidden="true" />
                <div>
                  <p className="text-sm font-bold text-primary">
                    Refer friends and win
                  </p>
                  <p className="text-xs text-night-muted">
                    Assured ₹100 Checkdin credit per referral
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 rounded-xl bg-primary-soft px-5 py-4">
                <TicketPercentIcon className="h-6 w-6 shrink-0" aria-hidden="true" />
                <div>
                  <p className="text-sm font-bold">
                    Upto ₹500 OFF on your first booking
                  </p>
                  <p className="text-xs text-muted">Use code NEWGUEST · T&amp;C apply</p>
                </div>
              </div>
            </div>

            <p className="mt-7 max-w-2xl leading-relaxed">{hotel.about}</p>

            <h2 className="mt-8 text-xs font-bold uppercase tracking-wide text-muted">
              Perks of {hotel.name}
            </h2>
            <p className="mt-1 text-lg font-bold">Special facilities at this hotel</p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {specialFacilities.map((facility) =>
              <div
                key={facility.label}
                className="rounded-xl border border-line p-5">
                
                  <facility.icon className="h-5 w-5" aria-hidden="true" />
                  <p className="mt-3 font-bold">{facility.label}</p>
                  <p className="mt-1 text-sm text-muted">{facility.body}</p>
                </div>
              )}
            </div>
          </section>

          {/* Amenities */}
          <section
            id="amenities"
            ref={(el) => sectionRefs.current.amenities = el}
            className="mt-14 scroll-mt-32">
            
            <h2 className="text-xs font-bold uppercase tracking-wide text-muted">
              Amenities of {hotel.name}
            </h2>
            <p className="mt-1 text-lg font-bold">Things that make the stay better</p>
            <ul className="mt-5 grid gap-5 sm:grid-cols-2">
              {previewAmenities.map((amenity) =>
              <li key={amenity.label} className="flex items-center gap-3">
                  <amenity.icon className="h-5 w-5 text-muted" aria-hidden="true" />
                  <span className="text-sm">{amenity.label}</span>
                </li>
              )}
            </ul>
            <button
              type="button"
              onClick={() => setAmenitiesOpen(true)}
              className="mt-6 w-full max-w-xs rounded-xl border border-line px-5 py-3 text-sm font-semibold transition-colors duration-150 ease-smooth hover:border-ink">
              
              View all amenities
            </button>
          </section>

          {/* Location */}
          <section
            id="location"
            ref={(el) => sectionRefs.current.location = el}
            className="mt-14 scroll-mt-32">
            
            <h2 className="text-xs font-bold uppercase tracking-wide text-muted">
              Location of {hotel.name}
            </h2>
            <p className="mt-1 text-lg font-bold">Where you need to go</p>

            <div className="mt-5">
              <LockedMap area={hotel.area} landmark={hotel.landmark} />
              <p className="mt-3 flex items-start gap-2 text-sm text-muted">
                <LockIcon className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                Exact location will be shared once your booking is confirmed.
              </p>
            </div>

            <div className="mt-5 overflow-hidden rounded-2xl border border-line">
              <div className="flex items-center gap-3 border-b border-line bg-canvas px-5 py-4">
                <MapPinIcon className="h-5 w-5 shrink-0" aria-hidden="true" />
                <p className="text-sm font-bold">What is nearby</p>
              </div>
              <ul className="divide-y divide-line">
                {nearby.map((place) =>
                <li
                  key={place.name}
                  className="flex items-center justify-between gap-4 px-5 py-3.5">
                  
                    <span className="text-sm">{place.name}</span>
                    <span className="text-sm font-semibold text-muted">
                      {place.km} km
                    </span>
                  </li>
                )}
              </ul>
              <p className="flex items-start gap-2.5 bg-primary-soft px-5 py-4 text-sm">
                <InfoIcon className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                Distances are measured from the property gate. The door number and
                map pin unlock in your confirmation.
              </p>
            </div>
          </section>

          {/* Ratings */}
          <section
            id="ratings"
            ref={(el) => sectionRefs.current.ratings = el}
            className="mt-14 scroll-mt-32">
            
            <h2 className="text-xs font-bold uppercase tracking-wide text-muted">
              Ratings of {hotel.name}
            </h2>
            <p className="mt-1 text-lg font-bold">What guests said</p>

            <div className="mt-5 grid gap-8 rounded-2xl border border-line p-6 sm:grid-cols-[160px_1fr]">
              <div>
                <p className="font-display text-5xl leading-none">{hotel.rating}</p>
                <p className="mt-2 flex items-center gap-1 text-sm text-muted">
                  <StarIcon
                    className="h-4 w-4 fill-primary text-primary"
                    aria-hidden="true" />
                  
                  {hotel.reviews.toLocaleString('en-IN')} ratings
                </p>
              </div>
              <ul className="space-y-2">
                {ratingBars.map((bar) =>
                <li key={bar.stars} className="flex items-center gap-3">
                    <span className="w-6 text-xs text-muted">{bar.stars}★</span>
                    <span className="h-2 flex-1 overflow-hidden rounded-full bg-canvas">
                      <span
                      className="block h-full rounded-full bg-primary"
                      style={{ width: `${bar.share}%` }} />
                    
                    </span>
                    <span className="w-8 text-right text-xs text-muted">
                      {bar.share}%
                    </span>
                  </li>
                )}
              </ul>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {reviews.map((review) =>
              <blockquote
                key={review.name}
                className="flex h-full flex-col rounded-2xl border border-line p-5">
                
                  <div className="flex items-center gap-1" aria-label={`${review.rating} out of 5`}>
                    {Array.from({ length: review.rating }).map((_, i) =>
                  <StarIcon
                    key={i}
                    className="h-3.5 w-3.5 fill-primary text-primary"
                    aria-hidden="true" />

                  )}
                  </div>
                  <p className="mt-3 text-sm leading-relaxed">“{review.text}”</p>
                  <footer className="mt-auto pt-4 text-xs text-muted">
                    <span className="font-bold text-ink">{review.name}</span> ·{' '}
                    {review.slot}
                  </footer>
                </blockquote>
              )}
            </div>
          </section>

          {/* Rules */}
          <section
            id="rules"
            ref={(el) => sectionRefs.current.rules = el}
            className="mt-14 scroll-mt-32">
            
            <h2 className="text-xs font-bold uppercase tracking-wide text-muted">
              Rules &amp; policies
            </h2>
            <p className="mt-1 text-lg font-bold">Read this before you book</p>
            <ul className="mt-5 space-y-3">
              {hotel.policies.map((policy) =>
              <li
                key={policy}
                className="flex items-start gap-2.5 rounded-xl border border-line px-4 py-3 text-sm">
                
                  <ShieldCheckIcon
                  className="mt-0.5 h-4 w-4 shrink-0"
                  aria-hidden="true" />
                
                  {policy}
                </li>
              )}
            </ul>
          </section>

          {/* Room options */}
          <section
            id="rooms"
            ref={(el) => sectionRefs.current.rooms = el}
            className="mt-14 scroll-mt-32">
            
            <h2 className="text-xs font-bold uppercase tracking-wide text-muted">
              Room options
            </h2>
            <p className="mt-1 text-lg font-bold">
              Pick a check-in time for your {search.duration}-hour slot
            </p>
            <div className="mt-5 rounded-2xl border border-line p-5">
              <SlotPicker
                hotelId={hotel.id}
                duration={search.duration}
                value={search.checkIn}
                onChange={(checkIn) => setSearch({ checkIn })} />
              
              <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-5">
                <p className="text-sm text-muted">
                  {toTimeLabel(search.checkIn)} · {search.duration} hours ·{' '}
                  <span className="font-bold text-ink">
                    {inr(priceBreakdown(hotel.rates[search.duration], search.duration).total)}
                  </span>{' '}
                  total · pay{' '}
                  {inrExact(
                    priceBreakdown(hotel.rates[search.duration], search.duration).
                    payNow
                  )}{' '}
                  now, rest at the hotel
                </p>
                <button
                  type="button"
                  onClick={book}
                  disabled={!available}
                  className="rounded-xl bg-primary px-6 py-3 text-sm font-bold text-ink transition-colors duration-150 ease-smooth hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-50">
                  
                  {available ? 'Book this slot' : 'Slot unavailable'}
                </button>
              </div>
            </div>
          </section>
        </div>

        <aside className="lg:sticky lg:top-32 lg:self-start">
          <BookingSummaryCard
            hotel={hotel}
            date={search.date}
            checkIn={search.checkIn}
            duration={search.duration}
            guests={guests}
            rooms={rooms}
            available={available}
            payMode={payMode}
            onPayModeChange={setPayMode}
            onDateChange={(date) => setSearch({ date })}
            onTimeChange={(checkIn) => setSearch({ checkIn })}
            onDurationChange={(duration: Duration) => setSearch({ duration })}
            onGuestsChange={setGuests}
            onRoomsChange={setRooms}
            onBook={book} />
          
        </aside>
      </div>

      <Modal
        open={amenitiesOpen}
        title="Property Amenities"
        onClose={() => setAmenitiesOpen(false)}>
        
        <ul className="divide-y divide-line">
          {standardAmenities.map((amenity) =>
          <li key={amenity.label} className="flex items-center gap-3 py-3.5">
              <amenity.icon className="h-5 w-5 text-muted" aria-hidden="true" />
              <span className="text-sm">{amenity.label}</span>
            </li>
          )}
        </ul>
      </Modal>

      <Modal
        open={photosOpen}
        title={`Photos of ${hotel.name}`}
        onClose={() => setPhotosOpen(false)}>
        
        <div className="grid gap-3 sm:grid-cols-2">
          {gallery.map((img, i) =>
          <img
            key={img + i}
            src={img}
            alt={`${hotel.name} photo ${i + 1}`}
            className="h-44 w-full rounded-xl object-cover" />

          )}
        </div>
      </Modal>
    </div>);

}