import React, { useState } from 'react';
import { CheckCircle2Icon, ClockIcon, ShieldCheckIcon } from 'lucide-react';
import { savedBankAccount } from '../../data/payouts';
import { OtpDialog } from '../OtpDialog';
import { OwnerRequiredBadge } from '../AccessControls';
import { useAuth } from '../../contexts/AuthContext';

type Fields = {
  holderName: string;
  accountNumber: string;
  ifsc: string;
  branch: string;
  bankName: string;
};

const labels: {key: keyof Fields;label: string;placeholder: string;hint?: string;}[] = [
{
  key: 'holderName',
  label: 'Bank account holder name',
  placeholder: 'As printed on your passbook'
},
{ key: 'accountNumber', label: 'Account number', placeholder: '0000 0000 0000' },
{
  key: 'ifsc',
  label: 'IFSC code',
  placeholder: 'HDFC0001284',
  hint: '11 characters — e.g. HDFC0001284'
},
{ key: 'branch', label: 'Branch', placeholder: 'T. Nagar, Chennai' },
{ key: 'bankName', label: 'Bank name', placeholder: 'HDFC Bank' }];


export function BankDetailsForm() {
  const { isOwner, addAudit } = useAuth();
  const [fields, setFields] = useState<Fields>(savedBankAccount);
  const [errors, setErrors] = useState<Partial<Record<keyof Fields, string>>>({});
  const [otpOpen, setOtpOpen] = useState(false);
  const [verificationPending, setVerificationPending] = useState(false);

  const update = (key: keyof Fields, value: string) => {
    setFields((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const next: Partial<Record<keyof Fields, string>> = {};

    labels.forEach(({ key, label }) => {
      if (!fields[key].trim()) next[key] = `${label} is required`;
    });
    if (fields.ifsc.trim() && !/^[A-Z]{4}0[A-Z0-9]{6}$/.test(fields.ifsc.trim().toUpperCase())) {
      next.ifsc = 'Enter a valid 11-character IFSC code';
    }

    setErrors(next);
    if (Object.keys(next).length === 0) setOtpOpen(true);
  };

  return (
    <section className="rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-card">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-[16px] font-semibold text-ink">Bank account details</h2>
          <p className="mt-0.5 text-[12px] text-ink-muted">
            Changing these details requires an OTP sent to the owner's mobile number.
          </p>
        </div>
        {verificationPending ?
        <span className="inline-flex items-center gap-1.5 rounded-md bg-amber-50 px-2.5 py-1 text-[11px] font-semibold text-amber-700">
            <ClockIcon size={13} aria-hidden="true" />
            Verification Pending
          </span> :

        <span className="inline-flex items-center gap-1.5 rounded-md bg-lime-100 px-2.5 py-1 text-[11px] font-semibold text-lime-600">
            <ShieldCheckIcon size={13} aria-hidden="true" />
            Verified
          </span>
        }
      </div>

      {verificationPending &&
      <p className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-[12.5px] font-medium text-amber-700">
          Bank account verification may take up to 1 business day. Payouts continue to the previous
          account until the new details are verified.
        </p>
      }

      <form onSubmit={handleSubmit} noValidate className="mt-5">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {labels.map(({ key, label, placeholder, hint }) =>
          <div key={key} className={key === 'bankName' ? 'md:col-span-2' : undefined}>
              <label htmlFor={key} className="block text-[13px] font-medium text-ink-soft">
                {label}
              </label>
              <input
              id={key}
              name={key}
              value={fields[key]}
              disabled={!isOwner}
              onChange={(e) =>
              update(key, key === 'ifsc' ? e.target.value.toUpperCase() : e.target.value)
              }
              placeholder={placeholder}
              aria-invalid={Boolean(errors[key])}
              aria-describedby={errors[key] ? `${key}-error` : hint ? `${key}-hint` : undefined}
              className={[
              'mt-1.5 w-full rounded-xl border bg-white px-3.5 py-2.5 text-[14px] text-ink outline-none transition-colors duration-150 ease-out placeholder:text-neutral-400 disabled:bg-neutral-50 disabled:text-ink-muted',
              errors[key] ?
              'border-red-400 focus:border-red-500' :
              'border-neutral-200 hover:border-neutral-300 focus:border-lime-500'].
              join(' ')} />
            
              {errors[key] ?
            <p id={`${key}-error`} className="mt-1.5 text-[12px] text-red-600">
                  {errors[key]}
                </p> :
            hint ?
            <p id={`${key}-hint`} className="mt-1.5 text-[12px] text-ink-muted">
                  {hint}
                </p> :
            null}
            </div>
          )}
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-neutral-100 pt-4">
          {isOwner ?
          <>
              <button
              type="submit"
              className="rounded-xl bg-ink px-5 py-2.5 text-[14px] font-semibold text-white transition-colors duration-150 ease-out hover:bg-ink-soft">
              
                Verify & save bank details
              </button>
              <button
              type="button"
              onClick={() => {
                setFields(savedBankAccount);
                setErrors({});
              }}
              className="rounded-xl border border-neutral-200 px-5 py-2.5 text-[14px] font-medium text-ink-soft transition-colors duration-150 ease-out hover:border-neutral-300">
              
                Reset
              </button>
            </> :

          <OwnerRequiredBadge />
          }
          {verificationPending &&
          <p className="flex items-center gap-1.5 text-[13px] font-medium text-forest">
              <CheckCircle2Icon size={15} aria-hidden="true" />
              OTP verified — sent for bank verification
            </p>
          }
        </div>
      </form>

      <OtpDialog
        open={otpOpen}
        title="Confirm bank account change"
        description="For your security, bank account changes need owner OTP verification before they are submitted."
        confirmLabel="Verify & submit"
        onClose={() => setOtpOpen(false)}
        onVerified={() => {
          setOtpOpen(false);
          setVerificationPending(true);
          addAudit({
            action: 'Changed bank account',
            detail: `${fields.bankName} • ${fields.ifsc} • OTP verified`,
            category: 'Security'
          });
        }} />
      
    </section>);

}