import React from 'react';
import { cn } from '@/lib/utils';

interface SpinnerProps {
  className?: string;
  /** Announced to screen readers. Omit when a parent already announces the busy state. */
  label?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({ className, label }) => (
  <span role={label ? 'status' : undefined} className={cn('inline-flex', className)}>
    <svg viewBox="0 0 24 24" fill="none" className="size-[1em] animate-spin" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.25" strokeWidth="3" />
      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
    {label && <span className="sr-only">{label}</span>}
  </span>
);
