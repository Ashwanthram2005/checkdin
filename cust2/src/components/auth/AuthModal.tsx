import React, { useState } from 'react';
import { ArrowLeftIcon, MailIcon, SmartphoneIcon } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { useAuth } from '../../contexts/AuthContext';

type Step = 'choose' | 'phone' | 'otp' | 'email';

const inputClass =
'mt-1.5 w-full rounded-xl border border-line bg-surface px-4 py-3 text-sm outline-none transition-colors duration-150 ease-smooth focus:border-ink';

function GoogleMark() {
  return (
    <svg viewBox="0 0 48 48" className="h-5 w-5" aria-hidden="true">
      <path
        fill="#EA4335"
        d="M24 9.5c3.5 0 6.6 1.2 9 3.6l6.7-6.7C35.6 2.6 30.2 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.8 6.1C12.3 13.2 17.6 9.5 24 9.5z" />
      
      <path
        fill="#4285F4"
        d="M46.1 24.6c0-1.6-.1-3.1-.4-4.6H24v9.1h12.4c-.5 2.9-2.1 5.3-4.6 6.9l7.2 5.6c4.2-3.9 7.1-9.6 7.1-17z" />
      
      <path
        fill="#FBBC05"
        d="M10.4 28.7a14.6 14.6 0 0 1 0-9.4l-7.8-6.1a24 24 0 0 0 0 21.6l7.8-6.1z" />
      
      <path
        fill="#34A853"
        d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.2-5.6c-2 1.4-4.6 2.2-8.7 2.2-6.4 0-11.7-3.7-13.6-9.1l-7.8 6.1C6.5 42.6 14.6 48 24 48z" />
      
    </svg>);

}

export function AuthModal() {
  const { authOpen, closeAuth, signIn } = useAuth();
  const [step, setStep] = useState<Step>('choose');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);

  function reset() {
    setStep('choose');
    setPhone('');
    setOtp('');
    setName('');
    setEmail('');
    setError(null);
  }

  function close() {
    reset();
    closeAuth();
  }

  function google() {
    signIn({
      name: 'Aravind Rajan',
      phone: '98400 41220',
      email: 'aravind.rajan@gmail.com'
    });
    reset();
  }

  function sendOtp() {
    if (phone.replace(/\D/g, '').length < 10) {
      setError('Enter a valid 10-digit mobile number.');
      return;
    }
    setError(null);
    setStep('otp');
  }

  function verifyOtp() {
    if (otp.replace(/\D/g, '').length < 4) {
      setError('Enter the 4-digit code we sent you.');
      return;
    }
    signIn({
      name: name.trim() || 'Guest',
      phone,
      email: ''
    });
    reset();
  }

  function emailContinue() {
    if (!name.trim() || !email.includes('@')) {
      setError('Enter your name and a valid email address.');
      return;
    }
    signIn({ name: name.trim(), phone: '', email: email.trim() });
    reset();
  }

  const title =
  step === 'choose' ?
  'Sign in to Checkdin' :
  step === 'email' ?
  'Continue with email' :
  'Continue with mobile';

  return (
    <Modal open={authOpen} title={title} onClose={close}>
      {step !== 'choose' &&
      <button
        type="button"
        onClick={() => {
          setStep('choose');
          setError(null);
        }}
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted transition-colors duration-150 ease-smooth hover:text-ink">
        
          <ArrowLeftIcon className="h-4 w-4" aria-hidden="true" />
          All sign-in options
        </button>
      }

      {step === 'choose' &&
      <div>
          <p className="text-sm text-muted">
            You need an account to hold a slot — it is also how we send your
            check-in OTP.
          </p>
          <button
          type="button"
          onClick={google}
          className="mt-5 flex w-full items-center justify-center gap-3 rounded-xl border border-line px-5 py-3.5 text-sm font-bold transition-colors duration-150 ease-smooth hover:border-ink">
          
            <GoogleMark />
            Continue with Google
          </button>
          <div className="my-4 flex items-center gap-3">
            <span className="h-px flex-1 bg-line" aria-hidden="true" />
            <span className="text-xs text-muted">or</span>
            <span className="h-px flex-1 bg-line" aria-hidden="true" />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <button
            type="button"
            onClick={() => setStep('phone')}
            className="flex items-center justify-center gap-2 rounded-xl border border-line px-5 py-3.5 text-sm font-bold transition-colors duration-150 ease-smooth hover:border-ink">
            
              <SmartphoneIcon className="h-4 w-4" aria-hidden="true" />
              Mobile number
            </button>
            <button
            type="button"
            onClick={() => setStep('email')}
            className="flex items-center justify-center gap-2 rounded-xl border border-line px-5 py-3.5 text-sm font-bold transition-colors duration-150 ease-smooth hover:border-ink">
            
              <MailIcon className="h-4 w-4" aria-hidden="true" />
              Email
            </button>
          </div>
          <p className="mt-5 text-xs leading-relaxed text-muted">
            By continuing you agree to Checkdin's terms and privacy policy. New
            here? The same options create your account.
          </p>
        </div>
      }

      {step === 'phone' &&
      <div>
          <label className="block">
            <span className="text-sm font-medium">Mobile number</span>
            <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="98400 00000"
            inputMode="numeric"
            autoComplete="tel"
            className={inputClass} />
          
          </label>
          <label className="mt-4 block">
            <span className="text-sm font-medium">
              Your name <span className="text-muted">(optional)</span>
            </span>
            <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Aravind Rajan"
            className={inputClass} />
          
          </label>
          <button
          type="button"
          onClick={sendOtp}
          className="mt-5 w-full rounded-xl bg-primary px-5 py-3.5 text-sm font-bold text-ink transition-colors duration-150 ease-smooth hover:bg-primary-dark">
          
            Send OTP
          </button>
        </div>
      }

      {step === 'otp' &&
      <div>
          <p className="text-sm text-muted">
            We sent a 4-digit code to {phone}. Enter it to continue.
          </p>
          <label className="mt-4 block">
            <span className="text-sm font-medium">Verification code</span>
            <input
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="1234"
            inputMode="numeric"
            maxLength={6}
            className={`${inputClass} tracking-[0.5em]`} />
          
          </label>
          <button
          type="button"
          onClick={verifyOtp}
          className="mt-5 w-full rounded-xl bg-primary px-5 py-3.5 text-sm font-bold text-ink transition-colors duration-150 ease-smooth hover:bg-primary-dark">
          
            Verify &amp; continue
          </button>
          <button
          type="button"
          onClick={() => setStep('phone')}
          className="mt-3 w-full text-center text-sm text-muted transition-colors duration-150 ease-smooth hover:text-ink">
          
            Change number
          </button>
        </div>
      }

      {step === 'email' &&
      <div>
          <label className="block">
            <span className="text-sm font-medium">Full name</span>
            <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Aravind Rajan"
            autoComplete="name"
            className={inputClass} />
          
          </label>
          <label className="mt-4 block">
            <span className="text-sm font-medium">Email address</span>
            <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            type="email"
            autoComplete="email"
            className={inputClass} />
          
          </label>
          <button
          type="button"
          onClick={emailContinue}
          className="mt-5 w-full rounded-xl bg-primary px-5 py-3.5 text-sm font-bold text-ink transition-colors duration-150 ease-smooth hover:bg-primary-dark">
          
            Continue
          </button>
        </div>
      }

      {error &&
      <p role="alert" className="mt-4 text-sm font-medium text-accent">
          {error}
        </p>
      }
    </Modal>);

}