import React, { useEffect, useRef, useState } from 'react';
import { DownloadIcon, FileSpreadsheetIcon, FileTextIcon, PrinterIcon } from 'lucide-react';

export type ExportFormat = 'pdf' | 'excel' | 'csv';

type ExportMenuProps = {
  onExport: (format: ExportFormat) => void;
};

export function ExportMenu({ onExport }: ExportMenuProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handle = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, [open]);

  const items: {id: ExportFormat;label: string;icon: typeof FileTextIcon;}[] = [
  { id: 'pdf', label: 'Export PDF', icon: PrinterIcon },
  { id: 'excel', label: 'Export Excel', icon: FileSpreadsheetIcon },
  { id: 'csv', label: 'Export CSV', icon: FileTextIcon }];


  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-1.5 rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-[13.5px] font-medium text-ink shadow-card transition-colors duration-150 ease-out hover:border-neutral-300">
        
        <DownloadIcon size={16} aria-hidden="true" />
        Export
      </button>

      {open &&
      <ul className="absolute right-0 top-12 z-30 w-[186px] overflow-hidden rounded-xl border border-neutral-200 bg-white py-1 shadow-lg">
          {items.map(({ id, label, icon: Icon }) =>
        <li key={id}>
              <button
            type="button"
            onClick={() => {
              setOpen(false);
              onExport(id);
            }}
            className="flex w-full items-center gap-2.5 px-3.5 py-2 text-left text-[13px] text-ink-soft transition-colors duration-150 ease-out hover:bg-neutral-50 hover:text-ink">
            
                <Icon size={14} aria-hidden="true" />
                {label}
              </button>
            </li>
        )}
        </ul>
      }
    </div>);

}