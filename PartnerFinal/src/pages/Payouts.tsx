import React, { useState } from 'react';
import { CheckCircle2Icon, LockIcon } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { PayoutBalance } from '../components/payouts/PayoutBalance';
import { PayoutHistory } from '../components/payouts/PayoutHistory';
import { BankDetailsForm } from '../components/payouts/BankDetailsForm';
import { FinancialBreakdown } from '../components/payouts/FinancialBreakdown';
import { OtpDialog } from '../components/OtpDialog';
import { useAuth } from '../contexts/AuthContext';
import { payoutBalance } from '../data/payouts';
import { inr } from '../utils/gst';

export function Payouts() {
  const { isOwner, addAudit } = useAuth();
  const [otpOpen, setOtpOpen] = useState(false);
  const [requested, setRequested] = useState(false);

  return (
    <main className="scroll-slim h-full flex-1 overflow-y-auto bg-canvas px-7 py-6">
      <PageHeader
        title="Earnings & Payouts"
        subtitle="What you earned, what Checkdin kept, and when the rest reaches your bank." />
      

      <div className="mt-6 space-y-5">
        {!isOwner &&
        <p className="flex items-start gap-2.5 rounded-2xl border border-neutral-200/80 bg-white px-4 py-3 text-[13px] text-ink-soft shadow-card">
            <LockIcon size={16} className="mt-0.5 shrink-0 text-ink-muted" aria-hidden="true" />
            <span>
              <span className="font-semibold text-ink">Owner Permission Required.</span> You can view
              settlement history, but initiating a payout or changing bank details is restricted to
              the property owner.
            </span>
          </p>
        }

        <PayoutBalance canWithdraw={isOwner} onWithdraw={() => setOtpOpen(true)} />

        <FinancialBreakdown />

        {requested &&
        <p
          role="status"
          className="flex items-center gap-2 rounded-xl border border-lime-200 bg-lime-50 px-4 py-3 text-[13.5px] font-medium text-lime-600">
          
            <CheckCircle2Icon size={16} aria-hidden="true" />
            Payout request created after OTP verification — it will move to "On process" once
            approved.
          </p>
        }

        <PayoutHistory />
        <BankDetailsForm />
      </div>
      <div className="pb-8" />

      <OtpDialog
        open={otpOpen}
        title="Verify payout request"
        description={`No payout can be completed without owner OTP verification. Requesting ${inr(payoutBalance.available)} to your verified bank account.`}
        confirmLabel="Verify & create payout request"
        onClose={() => setOtpOpen(false)}
        onVerified={() => {
          setOtpOpen(false);
          setRequested(true);
          addAudit({
            action: 'Requested payout',
            detail: `${inr(payoutBalance.available)} • OTP verified`,
            category: 'Security'
          });
        }} />
      
    </main>);

}