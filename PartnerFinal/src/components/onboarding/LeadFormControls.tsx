import React from 'react';
import { ChevronDownIcon } from 'lucide-react';

const controlBase =
'w-full rounded-[14px] border border-[#E2E8F0] bg-[#FCFCFC] px-4 py-3 text-[14.5px] text-[#111111] outline-none transition-colors duration-150 ease-out placeholder:text-[#94A3B8] hover:border-[#CBD5E1] hover:bg-white focus:border-[#D9FF3F] focus:bg-white focus:ring-4 focus:ring-[#D9FF3F]/15';

type LeadFieldProps = {
  id: string;
  label: string;
  required?: boolean;
  hint?: string;
  className?: string;
  children: React.ReactNode;
};

export function LeadField({ id, label, required, hint, className = '', children }: LeadFieldProps) {
  return (
    <div className={className}>
      <label htmlFor={id} className="block text-[13.5px] font-medium text-[#111111]">
        {label}
        {required && <span className="ml-0.5 text-[#94A3B8]">*</span>}
      </label>
      <div className="mt-2">{children}</div>
      {hint && <p className="mt-1.5 text-[12px] text-[#94A3B8]">{hint}</p>}
    </div>);

}

export function LeadInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  const { className = '', ...rest } = props;
  return <input {...rest} className={`${controlBase} ${className}`} />;
}

export function LeadTextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const { className = '', ...rest } = props;
  return <textarea {...rest} className={`${controlBase} resize-y ${className}`} />;
}

export function LeadSelect(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  const { className = '', children, ...rest } = props;
  return (
    <div className="relative">
      <select {...rest} className={`${controlBase} appearance-none pr-11 ${className}`}>
        {children}
      </select>
      <ChevronDownIcon
        size={17}
        aria-hidden="true"
        className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#64748B]" />
      
    </div>);

}

type LeadChoiceProps = {
  name: string;
  label: string;
  options: readonly string[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
  columns?: 'auto' | 'pair';
};

export function LeadChoice({
  name,
  label,
  options,
  value,
  onChange,
  className = '',
  columns = 'pair'
}: LeadChoiceProps) {
  return (
    <fieldset className={className}>
      <legend className="text-[13.5px] font-medium text-[#111111]">
        {label}
        <span className="ml-0.5 text-[#94A3B8]">*</span>
      </legend>
      <div className={`mt-2 ${columns === 'pair' ? 'flex gap-2.5' : 'flex flex-wrap gap-2.5'}`}>
        {options.map((option) => {
          const selected = value === option;
          return (
            <label
              key={option}
              className={[
              'cursor-pointer rounded-[14px] border px-4 py-3 text-[14px] transition-colors duration-150 ease-out',
              columns === 'pair' ? 'flex-1 text-center' : '',
              selected ?
              'border-[#D9FF3F] bg-[#D9FF3F]/15 font-semibold text-[#111111]' :
              'border-[#E2E8F0] bg-[#FCFCFC] font-medium text-[#475569] hover:border-[#CBD5E1] hover:bg-white'].
              join(' ')}>
              
              <input
                type="radio"
                name={name}
                value={option}
                checked={selected}
                onChange={() => onChange(option)}
                className="sr-only" />
              
              {option}
            </label>);

        })}
      </div>
    </fieldset>);

}