import React from 'react';
import { Link } from 'react-router-dom';
import {
  ClockIcon,
  MailIcon,
  PhoneIcon,
  ShieldCheckIcon,
  TicketIcon } from
'lucide-react';

const WHATSAPP_NUMBER = '919840041220';
const SUPPORT_EMAIL = 'support@checkdin.in';

function WhatsAppMark({ className }: {className?: string;}) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" fill="currentColor">
      <path d="M17.47 14.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.95 1.16-.17.2-.35.22-.65.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.48-1.75-1.65-2.05-.17-.3-.02-.46.13-.61.14-.14.3-.35.45-.53.15-.18.2-.3.3-.5.1-.2.05-.38-.02-.53-.08-.15-.67-1.6-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.38-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.22 3.08c.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.69.63.71.22 1.36.19 1.87.12.57-.09 1.75-.72 2-1.41.25-.69.25-1.28.17-1.4-.07-.13-.27-.2-.57-.35zM12.04 2.4c-5.3 0-9.6 4.3-9.6 9.6 0 1.7.44 3.35 1.29 4.81L2.4 21.6l4.92-1.29a9.56 9.56 0 0 0 4.72 1.24h.01c5.3 0 9.6-4.3 9.6-9.6 0-2.56-1-4.97-2.81-6.78a9.53 9.53 0 0 0-6.8-2.77zm0 17.5h-.01a7.96 7.96 0 0 1-4.06-1.11l-.29-.17-2.92.77.78-2.85-.19-.29a7.94 7.94 0 0 1-1.22-4.25c0-4.4 3.58-7.98 7.98-7.98 2.13 0 4.13.83 5.64 2.34a7.92 7.92 0 0 1 2.33 5.65c0 4.4-3.58 7.99-7.98 7.99z" />
    </svg>);

}

const faqs = [
{
  q: 'Can I check in before my slot starts?',
  a: 'Only if the room is free. Call the property from the booking screen — early entry is at their discretion and the clock still starts at your slot time.'
},
{
  q: 'What if the hotel refuses entry with a valid ID?',
  a: 'Message us on WhatsApp with your booking code. If the property refuses a guest carrying valid ID, Checkdin refunds the full amount.'
},
{
  q: 'I lost my check-in OTP.',
  a: 'Open My bookings — the OTP sits on the ongoing booking card. We can also resend it to your registered mobile.'
},
{
  q: 'How do refunds work?',
  a: 'Cancel more than two hours before check-in and the amount paid online is refunded to the source in 3-5 working days.'
}];


export function Support() {
  return (
    <div className="w-full">
      <section className="bg-night text-white">
        <div className="mx-auto w-full max-w-[1360px] px-5 py-14 lg:px-8">
          <h1 className="font-display text-4xl leading-tight sm:text-5xl">
            Contact support
          </h1>
          <p className="mt-4 max-w-xl text-white/70">
            A real Chennai team, not a bot queue. WhatsApp is fastest — most
            bookings are sorted in under five minutes.
          </p>
          <p className="mt-5 flex items-center gap-2 text-sm text-white/70">
            <ClockIcon className="h-4 w-4 text-primary" aria-hidden="true" />
            Open 24 hours, every day
          </p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1360px] px-5 py-10 lg:px-8">
        <div className="grid gap-5 lg:grid-cols-3">
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hi%20Checkdin%2C%20I%20need%20help%20with%20my%20booking`}
            target="_blank"
            rel="noreferrer"
            className="flex flex-col rounded-2xl border border-line bg-surface p-6 transition-shadow duration-200 ease-smooth hover:shadow-lift">
            
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#25D366] text-white">
              <WhatsAppMark className="h-6 w-6" />
            </span>
            <h2 className="mt-4 text-lg font-bold">Talk to us on WhatsApp</h2>
            <p className="mt-1 text-sm text-muted">
              +91 98400 41220 · typical reply in 2 minutes
            </p>
            <span className="mt-auto pt-6">
              <span className="inline-block rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-ink">
                Start WhatsApp chat
              </span>
            </span>
          </a>

          <a
            href={`mailto:${SUPPORT_EMAIL}?subject=Checkdin%20support`}
            className="flex flex-col rounded-2xl border border-line bg-surface p-6 transition-shadow duration-200 ease-smooth hover:shadow-lift">
            
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary-soft">
              <MailIcon className="h-5 w-5" aria-hidden="true" />
            </span>
            <h2 className="mt-4 text-lg font-bold">Email us</h2>
            <p className="mt-1 text-sm text-muted">
              {SUPPORT_EMAIL} · replies within 4 hours
            </p>
            <span className="mt-auto pt-6">
              <span className="inline-block rounded-xl border border-line px-5 py-2.5 text-sm font-bold">
                {SUPPORT_EMAIL}
              </span>
            </span>
          </a>

          <a
            href="tel:+919840041220"
            className="flex flex-col rounded-2xl border border-line bg-surface p-6 transition-shadow duration-200 ease-smooth hover:shadow-lift">
            
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary-soft">
              <PhoneIcon className="h-5 w-5" aria-hidden="true" />
            </span>
            <h2 className="mt-4 text-lg font-bold">Call the helpline</h2>
            <p className="mt-1 text-sm text-muted">
              +91 98400 41220 · for check-in emergencies
            </p>
            <span className="mt-auto pt-6">
              <span className="inline-block rounded-xl border border-line px-5 py-2.5 text-sm font-bold">
                Call now
              </span>
            </span>
          </a>
        </div>

        <div className="mt-10 grid gap-10 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <h2 className="font-display text-3xl">Common questions</h2>
            <dl className="mt-5 divide-y divide-line rounded-2xl border border-line bg-surface">
              {faqs.map((faq) =>
              <div key={faq.q} className="p-5">
                  <dt className="font-bold">{faq.q}</dt>
                  <dd className="mt-1.5 text-sm leading-relaxed text-muted">
                    {faq.a}
                  </dd>
                </div>
              )}
            </dl>
          </div>

          <div className="rounded-2xl bg-night p-6 text-white">
            <ShieldCheckIcon className="h-6 w-6 text-primary" aria-hidden="true" />
            <h2 className="mt-4 text-lg font-bold">Have your booking code ready</h2>
            <p className="mt-2 text-sm leading-relaxed text-night-muted">
              It starts with CD and sits on your confirmation and in My bookings.
              With it we can see your slot, the property contact and your refund
              status instantly.
            </p>
            <Link
              to="/bookings"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-ink transition-colors duration-150 ease-smooth hover:bg-primary-dark">
              
              <TicketIcon className="h-4 w-4" aria-hidden="true" />
              Open my bookings
            </Link>
          </div>
        </div>
      </section>
    </div>);

}