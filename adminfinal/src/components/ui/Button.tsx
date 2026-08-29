import React from 'react';
import { cn } from '../../utils/cn';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  icon?: React.ComponentType<{className?: string;}>;
}

const variants: Record<Variant, string> = {
  primary: 'bg-accent text-accent-ink hover:bg-accent/85 font-semibold',
  secondary: 'bg-ink text-canvas hover:bg-ink/85 font-medium',
  outline: 'border border-line bg-card text-ink hover:bg-faint font-medium',
  ghost: 'text-muted hover:bg-faint hover:text-ink font-medium',
  danger: 'border border-negative/30 bg-negative/10 text-negative hover:bg-negative/20 font-medium'
};

const sizes: Record<Size, string> = {
  sm: 'h-8 px-3 text-[13px] gap-1.5 rounded-lg',
  md: 'h-9.5 px-3.5 text-sm gap-2 rounded-lg py-2',
  lg: 'h-11 px-5 text-sm gap-2 rounded-xl'
};

export function Button({
  variant = 'outline',
  size = 'md',
  icon: Icon,
  className,
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center whitespace-nowrap transition-colors duration-150 ease-smooth disabled:pointer-events-none disabled:opacity-50',
        variants[variant],
        sizes[size],
        className
      )}
      {...rest}>
      
      {Icon ? <Icon className={size === 'sm' ? 'h-3.5 w-3.5' : 'h-4 w-4'} /> : null}
      {children}
    </button>);

}