import React from "react";
import { CheckIcon, PlusIcon, BoxIcon } from "lucide-react";
type ChipToggleGroupProps = {
  options: string[];
  icons: Record<string, BoxIcon>;
  selected: string[];
  onToggle: (option: string) => void;
  columns?: string;
};
export function ChipToggleGroup({
  options,
  icons,
  selected,
  onToggle,
  columns = 'sm:grid-cols-2 lg:grid-cols-3'
}: ChipToggleGroupProps) {
  return <ul className={`grid grid-cols-1 gap-2.5 ${columns}`}>
      {options.map((option) => {
      const Icon = icons[option];
      const isOn = selected.includes(option);
      return <li key={option}>
            <button type="button" aria-pressed={isOn} onClick={() => onToggle(option)} className={['flex w-full items-center gap-3 rounded-xl border px-3.5 py-3 text-left transition-colors duration-150 ease-out', isOn ? 'border-ink bg-neutral-50' : 'border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50/60'].join(' ')}>
              <span className={['flex h-8 w-8 shrink-0 items-center justify-center rounded-lg', isOn ? 'bg-lime-100 text-lime-600' : 'bg-neutral-100 text-ink-muted'].join(' ')}>
                <Icon size={16} strokeWidth={2} aria-hidden="true" />
              </span>
              <span className="flex-1 text-[13.5px] font-medium text-ink">{option}</span>
              <span className={['flex h-5 w-5 shrink-0 items-center justify-center rounded-full', isOn ? 'bg-ink text-white' : 'border border-neutral-300 text-neutral-400'].join(' ')}>
                {isOn ? <CheckIcon size={12} aria-hidden="true" /> : <PlusIcon size={12} aria-hidden="true" />}
              </span>
            </button>
          </li>;
    })}
    </ul>;
}