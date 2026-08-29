import React from 'react';
import { ArrowRightIcon, BuildingIcon, LogInIcon } from 'lucide-react';
import { BrandLockup } from '../../components/onboarding/BrandLockup';

type PortalLandingProps = {
  onLogin: () => void;
  onList: () => void;
};

export function PortalLanding({ onLogin, onList }: PortalLandingProps) {
  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center bg-white px-6 py-12">
      <div className="w-full max-w-[900px] text-center">
        <BrandLockup size="lg" />

        <h1 className="mt-8 text-[34px] font-bold leading-tight tracking-tight text-ink md:text-[40px]">
          Manage Your Property with Checkdin
        </h1>
        <p className="mx-auto mt-3 max-w-[560px] text-[15px] leading-relaxed text-ink-soft">
          Access your property dashboard or join Checkdin to start receiving short-stay bookings.
        </p>

        <div className="mt-10 grid grid-cols-1 gap-5 text-left md:grid-cols-2">
          <article className="flex flex-col rounded-3xl bg-ink p-7 text-white">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-lime-300">
              <LogInIcon size={20} className="text-ink" aria-hidden="true" />
            </span>
            <h2 className="mt-5 text-[21px] font-bold tracking-tight">
              Already a Checkdin Partner?
            </h2>
            <p className="mt-2.5 text-[14px] leading-relaxed text-white/60">
              Access your property dashboard, manage bookings, pricing, availability, revenue and
              payouts.
            </p>
            <button
              type="button"
              onClick={onLogin}
              className="group mt-7 flex items-center justify-center gap-2 rounded-xl bg-lime-300 py-3.5 text-[14.5px] font-semibold text-ink transition-colors duration-150 ease-out hover:bg-lime-200">
              
              Login to Dashboard
              <ArrowRightIcon
                size={16}
                aria-hidden="true"
                className="transition-transform duration-150 ease-out group-hover:translate-x-0.5" />
              
            </button>
          </article>

          <article
            className="flex flex-col rounded-3xl border-2 border-[#D9FF3F] bg-white p-7"
            style={{ boxShadow: '0 8px 24px rgba(0,0,0,0.04)' }}>
            
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#D9FF3F]">
              <BuildingIcon size={20} className="text-[#111111]" aria-hidden="true" />
            </span>
            <h2 className="mt-5 text-[21px] font-bold tracking-tight text-ink">
              Not Listed on Checkdin?
            </h2>
            <p className="mt-2.5 text-[14px] leading-relaxed text-ink-soft">
              Join Checkdin and start receiving short-stay bookings from travellers looking for 3, 6
              and 12-hour stays.
            </p>
            <button
              type="button"
              onClick={onList}
              className="group mt-7 flex items-center justify-center gap-2 rounded-xl border border-ink bg-white py-3.5 text-[14.5px] font-semibold text-ink transition-colors duration-150 ease-out hover:bg-neutral-50">
              
              List Your Property
              <ArrowRightIcon
                size={16}
                aria-hidden="true"
                className="transition-transform duration-150 ease-out group-hover:translate-x-0.5" />
              
            </button>
          </article>
        </div>

        <p className="mt-8 text-[12.5px] text-ink-muted">
          Need help? Call partner support on 1800 313 2200, available 24 × 7.
        </p>
      </div>
    </main>);

}