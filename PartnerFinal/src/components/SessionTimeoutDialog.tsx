import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { TimerIcon } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { formatCountdown } from '../utils/bookingTime';

export function SessionTimeoutDialog() {
  const { warningActive, secondsToLogout, stayLoggedIn, logout } = useAuth();
  const minutes = Math.ceil(secondsToLogout / 60);

  return (
    <AnimatePresence>
      {warningActive &&
      <>
          <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
          className="fixed inset-0 z-[70] bg-ink/50" />
        
          <motion.div
          role="alertdialog"
          aria-modal="true"
          aria-labelledby="session-title"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
          className="fixed left-1/2 top-1/2 z-[80] w-full max-w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-6 shadow-2xl">
          
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-amber-50">
              <TimerIcon size={20} className="text-amber-700" aria-hidden="true" />
            </span>
            <h2 id="session-title" className="mt-4 text-[18px] font-bold tracking-tight text-ink">
              Your session is about to expire
            </h2>
            <p className="mt-1.5 text-[13.5px] leading-relaxed text-ink-muted">
              Your session will expire in {minutes} minute{minutes > 1 ? 's' : ''} due to inactivity.
              For security, you will be signed out and returned to the login screen.
            </p>
            <p className="mt-4 rounded-xl bg-neutral-50 px-4 py-3 font-mono text-[20px] font-semibold tabular-nums text-ink">
              {formatCountdown(secondsToLogout)}
            </p>

            <div className="mt-5 flex gap-3">
              <button
              type="button"
              onClick={stayLoggedIn}
              className="flex-1 rounded-xl bg-lime-300 py-2.5 text-[13.5px] font-semibold text-ink transition-colors duration-150 ease-out hover:bg-lime-200">
              
                Stay logged in
              </button>
              <button
              type="button"
              onClick={() => logout('Signed out from session warning')}
              className="flex-1 rounded-xl border border-neutral-200 py-2.5 text-[13.5px] font-medium text-ink-soft transition-colors duration-150 ease-out hover:border-neutral-300">
              
                Logout now
              </button>
            </div>
          </motion.div>
        </>
      }
    </AnimatePresence>);

}