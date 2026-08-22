import React from 'react';

const controlClasses =
'w-full rounded-xl border border-neutral-200 bg-white px-3.5 py-2.5 text-[14px] text-ink outline-none transition-colors duration-150 ease-out placeholder:text-neutral-400 hover:border-neutral-300 focus:border-lime-500 disabled:bg-neutral-50 disabled:text-ink-muted';

type FieldProps = {
  id: string;
  label: string;
  hint?: string;
  className?: string;
  children: React.ReactNode;
};

export function Field({ id, label, hint, className, children }: FieldProps) {
  return (
    <div className={className}>
      <label htmlFor={id} className="block text-[13px] font-medium text-ink-soft">
        {label}
      </label>
      <div className="mt-1.5">{children}</div>
      {hint && <p className="mt-1.5 text-[12px] text-ink-muted">{hint}</p>}
    </div>);

}

export function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  const { className = '', ...rest } = props;
  return <input {...rest} className={`${controlClasses} ${className}`} />;
}

export function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const { className = '', ...rest } = props;
  return <textarea {...rest} className={`${controlClasses} resize-y ${className}`} />;
}

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  const { className = '', children, ...rest } = props;
  return (
    <div className="relative">
      <select {...rest} className={`${controlClasses} appearance-none pr-9 ${className}`}>
        {children}
      </select>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute right-3.5 top-1/2 h-1.5 w-1.5 -translate-y-2/3 rotate-45 border-b-2 border-r-2 border-neutral-400" />
      
    </div>);

}