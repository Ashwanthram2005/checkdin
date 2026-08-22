import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2Icon, ShieldCheckIcon, SmartphoneIcon, XIcon } from 'lucide-react';
import { property } from '../data/auth';

type OtpDialogProps = {
  open: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  onClose: () => void;
  onVerified: () => void;
};

export function OtpDialog({
  open,
  title,
  description,
  confirmLabel,
  onClose,
  onVerified
}: OtpDialogProps) {
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [resendIn, setResendIn] = useState(30);

  useEffect(() => {
    if (!open) return;
    setCode('');
    setError(null);
    setResendIn(30);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const timer = window.setInterval(() => setResendIn((prev) => Math.max(0, prev - 1)), 1000);
    return () => window.clearInterval(timer);
  }, [open]);

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!/^\d{6}$/.test(code)) {
      setError('Enter the 6-digit code sent to the owner.');
      return;
    }
    onVerified();
  };

  return (
    <AnimatePresence>
      {open &&
      <>
          <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
          onClick={onClose}
          className="fixed inset-0 z-[70] bg-ink/50" />
        
          <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="otp-title"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
          className="fixed left-1/2 top-1/2 z-[80] w-full max-w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-6 shadow-2xl">
          
            <div className="flex items-start justify-between gap-4">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-lime-100">
                <ShieldCheckIcon size={20} className="text-lime-600" aria-hidden="true" />
              </span>
              <button
              type="button"
              aria-label="Close"
              onClick={onClose}
              className="rounded-lg p-1.5 text-ink-muted transition-colors duration-150 ease-out hover:bg-neutral-100 hover:text-ink">
              
                <XIcon size={17} aria-hidden="true" />
              </button>
            </div>

            <h2 id="otp-title" className="mt-4 text-[18px] font-bold tracking-tight text-ink">
              {title}
            </h2>
            <p className="mt-1.5 text-[13.5px] leading-relaxed text-ink-muted">{description}</p>

            <p className="mt-4 flex items-center gap-2 rounded-xl bg-neutral-50 px-4 py-3 text-[12.5px] text-ink-soft">
              <SmartphoneIcon size={15} className="text-ink-muted" aria-hidden="true" />
              OTP sent to owner mobile{' '}
              <span className="font-semibold text-ink">{property.ownerPhone}</span>
            </p>

            <form onSubmit={submit} className="mt-4">
              <label htmlFor="otp" className="block text-[13px] font-medium text-ink-soft">
                Enter 6-digit OTP
              </label>
              <input
              id="otp"
              inputMode="numeric"
              autoFocus
              maxLength={6}
              value={code}
              onChange={(e) => {
                setCode(e.target.value.replace(/\D/g, ''));
                setError(null);
              }}
              placeholder="••••••"
              className="mt-1.5 w-full rounded-xl border border-neutral-200 px-3.5 py-3 text-center font-mono text-[20px] font-semibold tracking-[0.5em] text-ink outline-none transition-colors duration-150 ease-out placeholder:tracking-[0.4em] placeholder:text-neutral-300 hover:border-neutral-300 focus:border-lime-500" />
            
              {error && <p className="mt-2 text-[12.5px] font-medium text-red-600">{error}</p>}

              <div className="mt-2 flex items-center justify-between">
                <p className="text-[11.5px] text-ink-muted">
                  {resendIn > 0 ? `Resend available in ${resendIn}s` : 'Did not receive the code?'}
                </p>
                <button
                type="button"
                disabled={resendIn > 0}
                onClick={() => setResendIn(30)}
                className="text-[12px] font-medium text-lime-600 transition-colors duration-150 ease-out hover:text-lime-500 disabled:text-ink-muted">
                
                  Resend OTP
                </button>
              </div>

              <button
              type="submit"
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-lime-300 py-3 text-[14px] font-semibold text-ink transition-colors duration-150 ease-out hover:bg-lime-200">
              
                <CheckCircle2Icon size={16} aria-hidden="true" />
                {confirmLabel}
              </button>
            </form>
          </motion.div>
        </>
      }
    </AnimatePresence>);

}