import React from 'react';
import { ChevronDownIcon, SearchIcon } from 'lucide-react';
import { cn } from '../../utils/cn';

const base =
'w-full rounded-lg border border-line bg-card text-sm text-ink placeholder:text-muted/70 transition-colors duration-150 ease-smooth focus:border-accent';

export function Input({
  className,
  ...rest
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(base, 'h-9.5 px-3 py-2', className)} {...rest} />;
}

export function Textarea({
  className,
  ...rest
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cn(base, 'px-3 py-2', className)} rows={4} {...rest} />;
}

export function SearchInput({
  className,
  ...rest
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className={cn('relative', className)}>
      <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
      <input className={cn(base, 'h-9.5 pl-9 pr-3 py-2')} {...rest} />
    </div>);

}

export function Select({
  options,
  className,
  ...rest
}: React.SelectHTMLAttributes<HTMLSelectElement> & {options: string[];}) {
  return (
    <div className={cn('relative', className)}>
      <select
        className={cn(base, 'h-9.5 appearance-none pl-3 pr-8 py-2 font-medium')}
        {...rest}>
        
        {options.map((option) =>
        <option key={option} value={option}>
            {option}
          </option>
        )}
      </select>
      <ChevronDownIcon className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
    </div>);

}

export function Label({
  children,
  htmlFor



}: {children: React.ReactNode;htmlFor?: string;}) {
  return (
    <label htmlFor={htmlFor} className="mb-1.5 block text-[13px] font-medium text-ink">
      {children}
    </label>);

}

export function Toggle({
  checked,
  onChange,
  label




}: {checked: boolean;onChange: (next: boolean) => void;label: string;}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={cn(
        'relative h-5 w-9 shrink-0 rounded-full transition-colors duration-150 ease-smooth',
        checked ? 'bg-accent' : 'bg-line'
      )}>
      
      <span
        className={cn(
          'absolute top-0.5 h-4 w-4 rounded-full bg-card shadow-card transition-transform duration-150 ease-smooth',
          checked ? 'translate-x-4.5' : 'translate-x-0.5'
        )}
        style={{ transform: checked ? 'translateX(1.125rem)' : 'translateX(0.125rem)' }} />
      
    </button>);

}