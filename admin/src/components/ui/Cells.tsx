import React from 'react';
import { MoreHorizontalIcon } from 'lucide-react';
import { Avatar } from './Primitives';
import { cn } from '../../utils/cn';

export function NameCell({
  primary,
  secondary,
  avatar = true,
  src





}: {primary: string;secondary?: string;avatar?: boolean;src?: string;}) {
  return (
    <div className="flex items-center gap-2.5">
      {avatar ? <Avatar name={primary} size="sm" src={src} /> : null}
      <div className="min-w-0">
        <p className="truncate text-[13px] font-semibold text-ink">{primary}</p>
        {secondary ? <p className="truncate text-xs text-muted">{secondary}</p> : null}
      </div>
    </div>);

}

export function StackedCell({
  primary,
  secondary,
  align = 'left'




}: {primary: React.ReactNode;secondary?: React.ReactNode;align?: 'left' | 'right';}) {
  return (
    <div className={cn(align === 'right' && 'text-right')}>
      <p className="text-[13px] font-medium text-ink">{primary}</p>
      {secondary ? <p className="text-xs text-muted">{secondary}</p> : null}
    </div>);

}

export function MonoCell({ children }: {children: React.ReactNode;}) {
  return <span className="font-mono text-xs text-ink">{children}</span>;
}

export function RowActions({
  actions


}: {actions: {label: string;onSelect: () => void;danger?: boolean;}[];}) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function onClick(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  return (
    <div ref={ref} className="relative flex justify-end">
      <button
        aria-label="Row actions"
        onClick={(event) => {
          event.stopPropagation();
          setOpen((prev) => !prev);
        }}
        className="rounded-lg p-1.5 text-muted transition-colors duration-150 ease-smooth hover:bg-faint hover:text-ink">
        
        <MoreHorizontalIcon className="h-4 w-4" />
      </button>
      {open ?
      <div className="absolute right-0 top-8 z-20 w-44 overflow-hidden rounded-xl border border-line bg-elevated py-1 text-left shadow-pop">
          {actions.map((action) =>
        <button
          key={action.label}
          onClick={(event) => {
            event.stopPropagation();
            setOpen(false);
            action.onSelect();
          }}
          className={cn(
            'block w-full px-3 py-2 text-left text-[13px] font-medium transition-colors duration-150 ease-smooth',
            action.danger ? 'text-negative hover:bg-negative/10' : 'text-ink hover:bg-faint'
          )}>
          
              {action.label}
            </button>
        )}
        </div> :
      null}
    </div>);

}