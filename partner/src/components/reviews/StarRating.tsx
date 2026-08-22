import React from 'react';
import { StarIcon } from 'lucide-react';

type StarRatingProps = {
  value: number;
  size?: number;
  className?: string;
};

export function StarRating({ value, size = 15, className = '' }: StarRatingProps) {
  return (
    <span className={`flex items-center gap-0.5 ${className}`} aria-label={`${value} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((star) =>
      <StarIcon
        key={star}
        size={size}
        aria-hidden="true"
        className={star <= Math.round(value) ? 'text-lime-500' : 'text-neutral-300'}
        fill={star <= Math.round(value) ? 'currentColor' : 'none'} />

      )}
    </span>);

}

type StarInputProps = {
  value: number;
  onChange: (value: number) => void;
  label: string;
};

export function StarInput({ value, onChange, label }: StarInputProps) {
  return (
    <span role="radiogroup" aria-label={label} className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) =>
      <button
        key={star}
        type="button"
        role="radio"
        aria-checked={value === star}
        aria-label={`${star} star${star > 1 ? 's' : ''}`}
        onClick={() => onChange(star)}
        className="rounded p-0.5 transition-transform duration-150 ease-out hover:scale-110">
        
          <StarIcon
          size={20}
          aria-hidden="true"
          className={star <= value ? 'text-lime-500' : 'text-neutral-300'}
          fill={star <= value ? 'currentColor' : 'none'} />
        
        </button>
      )}
    </span>);

}