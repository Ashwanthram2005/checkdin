import React from 'react';

type SwitchProps = {
  checked: boolean;
  onChange: (value: boolean) => void;
  label: string;
  disabled?: boolean;
  size?: 'sm' | 'md';
};

/** Standalone switch control — the knob is laid out with flex so it can never drift outside the track. */
export function Switch({ checked, onChange, label, disabled, size = 'md' }: SwitchProps) {
  const track = size === 'md' ? 'h-6 w-11' : 'h-5 w-9';
  const knob = size === 'md' ? 'h-5 w-5' : 'h-4 w-4';

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={[
      'flex shrink-0 items-center rounded-full p-0.5 transition-colors duration-150 ease-out disabled:opacity-40',
      track,
      checked ? 'justify-end bg-ink' : 'justify-start bg-neutral-300'].
      join(' ')}>
      
      <span className={`${knob} rounded-full bg-white shadow`} />
    </button>);

}

type ToggleProps = {
  checked: boolean;
  onChange: (value: boolean) => void;
  label: string;
  description?: string;
  disabled?: boolean;
};

export function Toggle({ checked, onChange, label, description, disabled }: ToggleProps) {
  return (
    <div className="flex items-center justify-between gap-6 py-3">
      <div className="min-w-0">
        <p className="text-[13.5px] font-medium text-ink">{label}</p>
        {description && <p className="mt-0.5 text-[12.5px] text-ink-muted">{description}</p>}
      </div>
      <Switch checked={checked} onChange={onChange} label={label} disabled={disabled} />
    </div>);

}