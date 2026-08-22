import React, { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { XIcon } from 'lucide-react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  footer?: React.ReactNode;
  children?: React.ReactNode;
  width?: 'sm' | 'md' | 'lg';
}

const widths = { sm: 'max-w-md', md: 'max-w-xl', lg: 'max-w-3xl' };

export function Modal({
  open,
  onClose,
  title,
  description,
  footer,
  children,
  width = 'md'
}: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open ?
      <div className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-6">
          <motion.div
          className="absolute inset-0 bg-ink/40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18, ease: [0.23, 1, 0.32, 1] }}
          onClick={onClose} />
        
          <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={title}
          className={`relative w-full ${widths[width]} overflow-hidden rounded-t-2xl border border-line bg-elevated shadow-pop sm:rounded-2xl`}
          initial={{ opacity: 0, scale: 0.97, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.97, y: 8 }}
          transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}>
          
            <header className="flex items-start justify-between gap-4 border-b border-line px-5 py-4">
              <div>
                <h2 className="text-base font-semibold tracking-tight text-ink">{title}</h2>
                {description ?
              <p className="mt-0.5 text-[13px] text-muted">{description}</p> :
              null}
              </div>
              <button
              onClick={onClose}
              aria-label="Close dialog"
              className="rounded-lg p-1.5 text-muted transition-colors duration-150 ease-smooth hover:bg-faint hover:text-ink">
              
                <XIcon className="h-4 w-4" />
              </button>
            </header>
            {children ? <div className="max-h-[65vh] overflow-y-auto px-5 py-4">{children}</div> : null}
            {footer ?
          <footer className="flex flex-wrap justify-end gap-2 border-t border-line bg-faint/60 px-5 py-3.5">
                {footer}
              </footer> :
          null}
          </motion.div>
        </div> :
      null}
    </AnimatePresence>);

}