import React from 'react';

// Plain join, not cn(): this renders in the route fallback, and tailwind-merge would ride along into the first-load bundle.
const base =
  'relative block overflow-hidden rounded-md bg-raised after:absolute after:inset-0 after:animate-shimmer ' +
  'after:bg-gradient-to-r after:from-transparent after:via-ink/[0.06] after:to-transparent';

/** Placeholder block. Size it like the content it stands in for so nothing shifts on load. */
export const Skeleton: React.FC<{ className?: string }> = ({ className }) => (
  <span aria-hidden="true" className={className ? `${base} ${className}` : base} />
);
