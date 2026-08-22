import React from 'react';
import { ArrowUpRightIcon, ClockIcon, InfoIcon, LockIcon, WalletIcon } from 'lucide-react';
import { payoutBalance } from '../../data/payouts';

const inr = (value: number) => `₹${value.toLocaleString('en-IN')}`;

type PayoutBalanceProps = {
  onWithdraw: () => void;
  canWithdraw: boolean;
};

export function PayoutBalance({ onWithdraw, canWithdraw }: PayoutBalanceProps) {
  return (
    <section
      aria-label="Available balance"
      className="grid grid-cols-1 gap-5 rounded-2xl bg-ink p-6 text-white lg:grid-cols-[minmax(0,1fr)_320px]">
      
      <div>
        <p className="flex items-center gap-2 text-[13px] font-medium text-white/60">
          <WalletIcon size={16} aria-hidden="true" />
          Amount available for payout
        </p>
        <p className="mt-3 text-[46px] font-bold leading-none tracking-tight">
          {inr(payoutBalance.available)}
        </p>
        <p className="mt-3 flex items-center gap-2 text-[13px] text-white/60">
          <ClockIcon size={14} aria-hidden="true" />
          Next automatic cycle on{' '}
          <span className="font-semibold text-lime-400">{payoutBalance.nextCycle}</span>
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          {canWithdraw ?
          <button
            type="button"
            onClick={onWithdraw}
            className="flex items-center gap-2 rounded-xl bg-lime-400 px-5 py-3 text-[14px] font-semibold text-ink transition-colors duration-150 ease-out hover:bg-lime-200">
            
              Withdraw now
              <ArrowUpRightIcon size={17} aria-hidden="true" />
            </button> :

          <span className="flex items-center gap-2 rounded-xl border border-white/20 bg-white/[0.06] px-5 py-3 text-[13.5px] font-medium text-white/60">
              <LockIcon size={15} aria-hidden="true" />
              Owner Permission Required
            </span>
          }
          <button
            type="button"
            className="rounded-xl border border-white/20 px-5 py-3 text-[14px] font-medium text-white/80 transition-colors duration-150 ease-out hover:border-white/40 hover:text-white">
            
            Download statement
          </button>
        </div>
      </div>

      <dl className="grid grid-cols-2 gap-3 lg:grid-cols-1">
        <div className="rounded-xl bg-white/[0.07] px-4 py-3">
          <dt className="text-[12px] text-white/55">In transit</dt>
          <dd className="mt-1 text-[19px] font-semibold tracking-tight">
            {inr(payoutBalance.inTransit)}
          </dd>
        </div>
        <div className="rounded-xl bg-white/[0.07] px-4 py-3">
          <dt className="text-[12px] text-white/55">Paid this month</dt>
          <dd className="mt-1 text-[19px] font-semibold tracking-tight">
            {inr(payoutBalance.paidThisMonth)}
          </dd>
        </div>
        <div className="col-span-2 flex items-start gap-2 rounded-xl bg-white/[0.07] px-4 py-3 lg:col-span-1">
          <InfoIcon size={15} className="mt-0.5 shrink-0 text-lime-400" aria-hidden="true" />
          <p className="text-[12px] leading-relaxed text-white/60">
            Last payout of{' '}
            <span className="font-semibold text-white">{inr(payoutBalance.lastPayout.amount)}</span>{' '}
            settled on {payoutBalance.lastPayout.date}.
          </p>
        </div>
      </dl>
    </section>);

}