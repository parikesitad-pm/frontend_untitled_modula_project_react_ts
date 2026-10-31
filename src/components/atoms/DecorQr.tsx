import React from 'react';
import { cn } from '@/lib/utils';

// Fixed pattern with three finder squares, so it reads as a QR code and renders the same every time.
const cells = Array.from({ length: 49 }, (_, i) => {
  const r = Math.floor(i / 7);
  const c = i % 7;
  const finder = (r < 2 && c < 2) || (r < 2 && c > 4) || (r > 4 && c < 2);
  return finder || (i * 7 + 3) % 5 < 2;
});

/** Decorative QR-like mark for previews. Not scannable; hidden from assistive tech. */
export const DecorQr: React.FC<{ className?: string }> = ({ className }) => (
  <div aria-hidden="true" className={cn('grid shrink-0 grid-cols-7 gap-0.5 rounded-md bg-white p-2', className)}>
    {cells.map((on, i) => (
      <span key={i} className={on ? 'bg-black' : 'bg-white'} />
    ))}
  </div>
);
