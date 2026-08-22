import React from 'react';

type BrandLockupProps = {
  size?: 'md' | 'lg';
  className?: string;
};

export function BrandLockup({ size = 'md', className = '' }: BrandLockupProps) {
  const large = size === 'lg';

  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <span
        className={[
        'flex items-center justify-center rounded-full bg-lime-400',
        large ? 'h-11 w-11' : 'h-9 w-9'].
        join(' ')}>
        
        <span
          className={[
          'rounded-full border-ink border-t-transparent',
          large ? 'h-4 w-4 border-[4px]' : 'h-3 w-3 border-[3px]'].
          join(' ')} />
        
      </span>
      <span
        className={[
        'font-bold leading-none tracking-tight text-ink',
        large ? 'text-[30px]' : 'text-[24px]'].
        join(' ')}>
        
        Checkdin
      </span>
      <span className="rounded-md bg-ink px-2 py-1 text-[9.5px] font-bold tracking-[0.22em] text-lime-400">
        PARTNER
      </span>
    </span>);

}