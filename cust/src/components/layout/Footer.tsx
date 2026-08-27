import React from 'react';
import { Link } from 'react-router-dom';
import { ClockIcon } from 'lucide-react';
import { upcomingCities } from '../../data/filters';

const columns: {title: string;items: {label: string;to: string;}[];}[] = [
{
  title: 'Book',
  items: [
  { label: 'Hourly hotels', to: '/search' },
  { label: 'Day-use rooms', to: '/search' },
  { label: 'Couple friendly', to: '/search' },
  { label: 'My bookings', to: '/bookings' }]

},
{
  title: 'Company',
  items: [
  { label: 'About Checkdin', to: '/#how' },
  { label: 'List your property', to: '/list-your-property' },
  { label: 'Careers', to: '/#how' },
  { label: 'Press', to: '/#how' }]

},
{
  title: 'Support',
  items: [
  { label: 'Contact support', to: '/support' },
  { label: 'Cancellation policy', to: '/support' },
  { label: 'ID & check-in rules', to: '/support' },
  { label: 'WhatsApp us', to: '/support' }]

}];


const cities = ['Chennai', ...upcomingCities];

export function Footer() {
  return (
    <footer className="mt-20 bg-night text-white">
      <div className="mx-auto w-full max-w-[1360px] px-5 py-14 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div>
            <Link to="/" className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-ink">
                <ClockIcon className="h-4 w-4" aria-hidden="true" />
              </span>
              <span className="font-display text-2xl leading-none">
                Checkd<span className="text-primary">in</span>
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-night-muted">
              Hotels sold by the hour. Started in Chennai, opening city by city
              across India.
            </p>
            <a
              href="mailto:support@checkdin.in"
              className="mt-4 inline-block text-sm font-semibold text-primary hover:underline">
              
              support@checkdin.in
            </a>
          </div>

          {columns.map((col) =>
          <div key={col.title}>
              <h2 className="text-sm font-bold">{col.title}</h2>
              <ul className="mt-4 space-y-3">
                {col.items.map((item) =>
              <li key={item.label}>
                    <Link
                  to={item.to}
                  className="text-sm text-night-muted transition-colors duration-150 ease-smooth hover:text-primary">
                  
                      {item.label}
                    </Link>
                  </li>
              )}
              </ul>
            </div>
          )}
        </div>

        <div className="mt-12 border-t border-night-line pt-6">
          <h2 className="text-xs font-bold uppercase tracking-wide text-night-muted">
            Cities
          </h2>
          <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
            {cities.map((city) =>
            <li key={city} className="text-sm text-night-muted">
                <a href="#" className="transition-colors duration-150 ease-smooth hover:text-primary">
                  {city}
                </a>
                {city !== 'Chennai' &&
              <span className="ml-1.5 text-[11px] font-bold uppercase text-primary">
                    Soon
                  </span>
              }
              </li>
            )}
          </ul>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-night-line pt-6 text-sm text-night-muted sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Checkdin Stays Pvt. Ltd., Chennai</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-primary">Privacy</a>
            <a href="#" className="hover:text-primary">Terms</a>
            <a href="#" className="hover:text-primary">Guest safety</a>
          </div>
        </div>
      </div>
    </footer>);

}