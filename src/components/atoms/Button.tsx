import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { Spinner } from './Spinner';
import { buttonClasses, type ButtonSize, type ButtonTone } from './buttonClasses';

// Shorter waits than this resolve before a spinner would read as anything but a flicker.
const SPINNER_DELAY_MS = 150;

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  tone?: ButtonTone;
  size?: ButtonSize;
  loading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ tone, size, loading = false, disabled, className, children, type = 'button', ...rest }, ref) => {
    const [showSpinner, setShowSpinner] = useState(false);

    useEffect(() => {
      if (!loading) {
        setShowSpinner(false);
        return;
      }
      const id = window.setTimeout(() => setShowSpinner(true), SPINNER_DELAY_MS);
      return () => window.clearTimeout(id);
    }, [loading]);

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || loading}
        aria-busy={loading || undefined}
        className={cn(buttonClasses({ tone, size }), className)}
        {...rest}
      >
        {/* Label stays in the layout while hidden so the button never changes width. */}
        <span className={cn('inline-flex items-center gap-[inherit]', showSpinner && 'invisible')}>{children}</span>
        {showSpinner && (
          <span className="absolute inset-0 grid place-items-center">
            <Spinner />
          </span>
        )}
      </button>
    );
  },
);
Button.displayName = 'Button';
