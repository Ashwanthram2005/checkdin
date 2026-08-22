import React from 'react';
import { cn } from '../../utils/cn';

export function Tabs({
  tabs,
  value,
  onChange,
  counts





}: {tabs: string[];value: string;onChange: (next: string) => void;counts?: Record<string, number>;}) {
  return (
    <div
      role="tablist"
      className="flex gap-1 overflow-x-auto border-b border-line px-2 [scrollbar-width:none]">
      
      {tabs.map((tab) => {
        const active = tab === value;
        return (
          <button
            key={tab}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(tab)}
            className={cn(
              'relative whitespace-nowrap px-3 py-3 text-sm transition-colors duration-150 ease-smooth',
              active ? 'font-semibold text-ink' : 'font-medium text-muted hover:text-ink'
            )}>
            
            {tab}
            {counts?.[tab] !== undefined ?
            <span className="ml-1.5 text-xs text-muted">{counts[tab]}</span> :
            null}
            {active ?
            <span className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-accent" /> :
            null}
          </button>);

      })}
    </div>);

}

export function SegmentedControl({
  options,
  value,
  onChange




}: {options: string[];value: string;onChange: (next: string) => void;}) {
  return (
    <div className="inline-flex max-w-full overflow-x-auto rounded-lg border border-line bg-faint p-0.5 [scrollbar-width:none]">
      {options.map((option) =>
      <button
        key={option}
        onClick={() => onChange(option)}
        className={cn(
          'rounded-md px-2.5 py-1 text-[13px] transition-colors duration-150 ease-smooth',
          value === option ?
          'bg-card font-semibold text-ink shadow-card' :
          'font-medium text-muted hover:text-ink'
        )}>
        
          {option}
        </button>
      )}
    </div>);

}