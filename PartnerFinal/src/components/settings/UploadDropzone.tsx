import React from 'react';
import { UploadCloudIcon } from 'lucide-react';

type UploadDropzoneProps = {
  label: string;
  hint: string;
  onSelect?: () => void;
  className?: string;
};

export function UploadDropzone({ label, hint, onSelect, className = '' }: UploadDropzoneProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`flex w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-neutral-300 bg-neutral-50/60 px-4 py-6 text-center transition-colors duration-150 ease-out hover:border-lime-400 hover:bg-lime-50 ${className}`}>
      
      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-card">
        <UploadCloudIcon size={17} className="text-ink" aria-hidden="true" />
      </span>
      <span className="text-[13px] font-medium text-ink">{label}</span>
      <span className="text-[11.5px] text-ink-muted">{hint}</span>
    </button>);

}